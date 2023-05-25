import {Body, Controller, CurrentUser, Delete, Flow, Get, Params, Patch, Post, Put} from 'amala';
import {thisEm} from '@backend/util/requestContext';
import {isLoggedIn} from '@backend/endpoints/flows/authFlow';
import {Org} from '@backend/data/models/org/Org';
import {OrgInfoParams, OrgStats} from '@common/types/transports/orgTransports';
import {OrgMember} from '@backend/data/models/org/OrgMember';
import {User} from '@backend/data/models/auth/User';
import {errorNotFound} from '@backend/util/errors';
import {EOrgRole} from '@common/enums/orgEnums';
import {notifications} from '@backend/services/notificationService';
import {LeaveRequest} from '@backend/data/models/org/LeaveRequest';


@Controller('/org')
@Flow(isLoggedIn)
export class OrgController {

  /**
   * Gets all of the thing, as allowed
   * @param user
   */
  @Get('/')
  async getAllAssociations(@CurrentUser() user: User): Promise<OrgMember[]> {
    const em = thisEm();
    const orgAssociations = await em.find(OrgMember, {user: user}, ['org']);
    return orgAssociations;
  }

  /**
   * Create Org.
   *
   * @param user
   * @param input
   */
  @Post('/')
  async create(@CurrentUser() user: User, @Body({required: true}) input: OrgInfoParams): Promise<Org> {
    const em = thisEm();

    //The Org
    const org = new Org(input);

    // establish the relationship between this user and the new org
    const orgMember = new OrgMember({org, user,
      acceptedInviteOn: new Date(),
      role: EOrgRole.Admin,
      startDate: new Date(),

    });

    await em.persistAndFlush([org, orgMember]);

    notifications.org.newOrg(user, org);

    return org;
  }

  @Get('/:orgId')
  async getOne(
    @CurrentUser() user: User,
    @Params('orgId') orgId: string): Promise<Org> {
    const em = thisEm();
    const org = await em.findOne(Org, orgId) || await em.findOne(Org, {slug: orgId});
    const companyAssociation = await em.findOne(OrgMember, {
      user: user,
      org: org
    });

    if (!companyAssociation) throw new errorNotFound();
    return org;
  }


  @Get('/:orgId/stats')
  async stats(@CurrentUser() user: User,
              @Params('orgId') orgId: string): Promise<OrgStats> {
    const org = await this.getOne(user, orgId);
    if (!org) throw errorNotFound('Org not found');

    const em = thisEm();

    const stats: OrgStats = {
      employees: {
        count: await em.count(OrgMember, {org}),
        pending: await em.count(OrgMember, {org, acceptedInviteOn: null})
      },
      leaveRequests: {
        count: await em.count(LeaveRequest, {org}),
        unapproved: await em.count(LeaveRequest, {org, approved: {$ne: true}}),
      }
    };


    return stats;
  }


  /**
   * Mark as deleted on this date
   * @param orgId
   */
  @Delete('/:orgId')
  async deleteOne(@Params('orgId') orgId: string): Promise<void> {
    const em = thisEm();
    await em.nativeUpdate(Org, {id: orgId}, {deletedOn: new Date()});
  }

  /**
   *
   * @param orgId
   * @param body
   */
  @Put('/:orgId')
  async strictUpdate(
    @CurrentUser() user: User,
    @Params('orgId') orgId: string,
    @Body({required: true}) body: OrgInfoParams): Promise<void> {
    const org = await this.getOne(user, orgId)
    const em = thisEm();
    await em.nativeUpdate(Org, {id: orgId}, body);

    //process change notifications
    if(!org.onboarded && body.onboarded) notifications.org.finalizedOrg(user, org);
  }

  @Patch('/:orgId')
  async freeUpdate(
    @CurrentUser() user: User,
    @Params('orgId') orgId: string,
    @Body({required: true}) body: Partial<Org>): Promise<void> {
    const org = await this.getOne(user, orgId)
    const em = thisEm();
    await em.nativeUpdate(Org, {id: orgId}, body);

    //process change notifications
    if(!org.onboarded && body.onboarded) notifications.org.finalizedOrg(user, org);
  }



}
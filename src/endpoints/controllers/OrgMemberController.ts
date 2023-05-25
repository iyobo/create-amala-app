import {Body, Controller, CurrentUser, Flow, Get, Params, Patch, Post, Query} from 'amala';
import {thisEm} from '@backend/util/requestContext';
import {Org} from '@backend/data/models/org/Org';
import {User} from '@backend/data/models/auth/User';
import {MetaQueryParams, BulkChanges, OrgMemberInviteRequest} from '@common/types/transports/orgTransports';
import {OrgMember} from '@backend/data/models/org/OrgMember';
import {EOrgRole} from '@common/enums/orgEnums';
import {isLoggedIn} from '@backend/endpoints/flows/authFlow';
import {errorNotFound} from '@backend/util/errors';
import {QueryOrder} from '@mikro-orm/core';

@Controller('/org/:orgId/members')
@Flow(isLoggedIn)
export class OrgMemberController {

  @Get('/')
  async list(
    @CurrentUser() user: User,
    @Params('orgId') orgId: string,
    @Query() q: MetaQueryParams
  ): Promise<OrgMember[]> {

    // TODO: use these
    const page = Number.parseInt(q.page) || 0;
    const limit = Number.parseInt(q.limit) || 20;
    const sortDir = q.sortDir || QueryOrder.ASC;
    const sort = q.sort;
    const search = q.search;


    const em = thisEm();
    const orderBy = {createdAt: sortDir};
    if (sort) {
      orderBy[sort] = sortDir;
    }

    const orgAssociations = await em.find(OrgMember,
      {
        org: {$or: [{slug: orgId}, {id: orgId}]},
      },
      ['user', 'manager.user'],
      orderBy,
      // limit,
      // (page - 1) * limit
    );
    return orgAssociations;
  }

  @Post('/')
  async bulkInvite(
    @CurrentUser() user: User,
    @Params('orgId') orgId: string,
    @Body({required: true}) input: OrgMemberInviteRequest): Promise<any> {

    const em = thisEm();

    //The Org
    const org = await em.findOne(Org, {id: orgId});
    // await canUpsertEmployees(user, org);

    // Create members
    const membersToAdd = [];
    const membersToNotify = [];

    //We will Ignore if Org member of that email already exists...
    //so get all existing orgMembers
    const existing = await em.find(OrgMember, {org}, ['user']);
    const existingMap = existing.reduce(function (map, obj) {
      if(obj.user){
        map[(obj.user as User).email] = 1;
      }
      else if(obj.inviteeEmail){
        map[obj.inviteeEmail] = 1;
      }

      return map;
    }, {});


    input?.memberInvites?.forEach((it) => {

      if (existingMap[it.email]) return; //already exists

      const member = new OrgMember({
        inviteeFirstName: it.firstName,
        inviteeLastName: it.lastName,
        inviteeEmail: it.email,
        inviteePhone: it.phone,
        org,
        role: EOrgRole.Employee
      });

      if (it.notify) {
        membersToNotify.push(member)
      }

      membersToAdd.push(member);
    });


    // The org's first location (Usually the head office)
    // const location = new OrgLocation(input as unknown as OrgLocation);
    // location.org = org;

    await em.persistAndFlush(membersToAdd);

    // FIXME: should not be here
    // org.onboarded = true;
    // await em.persistAndFlush(org);


    //TODO: notify members in membersToNotify of invite
    // membersToNotify

    return org;
  }

  @Get('/:memberId')
  async getOne(
    @CurrentUser() user: User,
    @Params('orgId') orgId: string,
    @Params('memberId') memberId: string
  ) {
    const em = thisEm();
    const orgMember = await em.findOne(OrgMember, memberId, ['user']);
    if (!orgMember) throw errorNotFound();

    return orgMember;
  }

  @Patch('/')
  async bulkPatch(
    @CurrentUser() user: User,
    @Params('orgId') orgId: string,
    @Body() changes: BulkChanges
  ) {
    const em = thisEm();
    const updatedMembers = await Promise.all(Object.keys(changes).map(async (memberId) => {
      const orgMember = await em.findOne(OrgMember, memberId);
      return orgMember.setFields(changes[memberId]);
    }));

    await em.persistAndFlush(updatedMembers);

    return {success: true};
  }


}
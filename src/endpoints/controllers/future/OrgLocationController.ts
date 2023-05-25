import {Body, Controller, CurrentUser, Params, Patch, Post} from 'amala';
import {thisEm} from '@backend/util/requestContext';
import {Org} from '@backend/data/models/org/Org';
import {OrgAddressParams} from '@common/types/transports/orgTransports';
import {User} from '@backend/data/models/auth/User';
import {OrgLocation} from '@backend/data/models/geo/OrgLocation';
import {canEditJobs} from '@backend/util/auth/permissions';


@Controller('/org/:orgId/location')
export class OrgLocationController {

  @Post('/')
  async createLocation(
    @CurrentUser() user: User,
    @Params('orgId') orgId: string,
    @Body({required: true}) input: OrgAddressParams): Promise<Org> {

    const em = thisEm();

    //The Org
    const org = await em.findOne(Org, {id: orgId});

    await canEditJobs(user, org);

    // The org's first location (Usually the head office)
    const location = new OrgLocation(input as unknown as OrgLocation);
    location.org = org;

    await em.persistAndFlush([location]);

    return org;
  }

  @Patch('/:locationId')
  async updateLocation(
    @CurrentUser() user: User,
    @Params('orgId') orgId: string,
    @Params('locationId') locationId: string,
    @Body({required: true}) input: OrgAddressParams): Promise<Org> {

    const em = thisEm();

    //The Org
    const org = await em.findOne(Org, {id: orgId});
    await canEditJobs(user, org);

    // The org's first location (Usually the head office)
    await em.nativeUpdate(OrgLocation, {id:locationId},{...input});

    return org;
  }


}
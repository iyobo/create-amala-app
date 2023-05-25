import {Controller, CurrentUser, Get, Params, Query} from 'amala';
import {thisEm} from '@backend/util/requestContext';
import {OrgMember} from '@backend/data/models/org/OrgMember';
import {User} from '@backend/data/models/auth/User';
import {Org} from '@backend/data/models/org/Org';
import {errorNotFound} from '@backend/util/errors';


@Controller('/org-slug')
export class OrgSlugController {

  /**
   * Define this first!!!
   * @param user
   * @param slug
   */
  @Get('/check')
  async check(@CurrentUser() user: User, @Query('slug') slug: string): Promise<{ exists: boolean }> {

    // check is a reserved name
    if (slug === 'check') return {exists: true};

    const em = thisEm();
    const org = await em.findOne(Org, {slug});
    if (org) return {exists: true};

    return {exists: false};
  }

  @Get('/:slug')
  async getOrg(@CurrentUser() user: User, @Params('orgId') slug: string): Promise<Org> {
    const em = thisEm();

    const org = await em.findOne(Org, {slug});
    if (!org) throw new errorNotFound();

    const companyAssociation = await em.findOne(OrgMember, {user: user, org: org}, ['org']);
    if (!companyAssociation) throw new errorNotFound();

    return companyAssociation.org as Org;
  }

}
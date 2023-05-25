import {User} from '@backend/data/models/auth/User';
import {Org} from '@backend/data/models/org/Org';
import {thisEm} from '@backend/util/requestContext';
import {errorForbidden, errorNotFound} from '@backend/util/errors';
import {OrgMember} from '@backend/data/models/org/OrgMember';
import {EOrgRole} from '@common/enums/orgEnums';
import {LeaveRequest} from '@backend/data/models/org/LeaveRequest';
import {Reference} from '@mikro-orm/core';

export async function canAccessOrg(actor: User, org: Org): Promise<OrgMember> {
  const em = thisEm();

  if (!actor) throw errorNotFound('No such user');
  if (!org) throw errorNotFound('No such organization');

  const member = await em.findOne(OrgMember, {org, user: actor});
  if (!member) throw errorForbidden('You are not associated with that organization');

  return member;
}

/**
 * can create a job/Operation
 *
 * @param actor
 * @param org
 */
export async function canCreateJobs(actor: User, org: Org) {
  const member = await canAccessOrg(actor, org);

  if (member.role === EOrgRole.Admin) {
    return true;
  }

  throw errorForbidden('You cannot create jobs');
}

export async function canEditJobs(actor: User, org: Org) {
  const member = await canAccessOrg(actor, org);
  if (member.role === EOrgRole.Admin || member.role === EOrgRole.Manager) {
    return true;
  }

  throw errorForbidden('You cannot edit jobs');
}

export async function canAccessReports(actor: User, org: Org) {
  return await canEditJobs(actor, org);
}

export async function canExportTimesheets(actor: User, org: Org) {
  return await canEditJobs(actor, org);
}

export async function canViewEmployeeCosts(actor: User, org: Org) {
  return await canEditJobs(actor, org);
}

export async function canUpsertEmployees(actor: User, org: Org) {
  return await canEditJobs(actor, org);
}


export async function canApproveLeaveRequest(actor: User, org: Org, leave: LeaveRequest) {
  const member = await canAccessOrg(actor, org);
  if (member.role === EOrgRole.Admin || member.role === EOrgRole.Manager) {
    return true;
  }

  if (member.role === EOrgRole.Supervisor) {
    // can only approve for direct report
    await thisEm().populate(member, ['manages']);
    const directReports = member.manages.getItems();

    const managedEmployee = directReports.find((employee)=>{
      employee.manages.contains(leave.requestedFor as unknown as Reference<OrgMember>)
    })

    if(managedEmployee) return true;
  }

  throw errorForbidden('You cannot approve that Leave request');
}

export async function canApproveTimesheets(actor: User, org: Org, timesheet) {
  // TBD
}

export async function canScheduleEmployees(actor: User, org: Org, timesheet) {
  // TBD
}









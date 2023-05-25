import {sendEmail} from '../mailService';
import {User} from '../../data/models/auth/User';
import config from '../../config/config';
import {Org} from '@backend/data/models/org/Org';

export class OrgNotifications {

  async newOrg(user: User, org: Org) {

    return sendEmail({
      to: user.email,
      subject: `New company: ${org.name}!`,
      body: `<div>
              <h1>Hey ${user.firstName}!</h1>
              <p>Congratulations on the new company <b>${org.name}</b>!</p> 
              <p>There are just a few more steps to take before this new company is ready to go. 
                  To finalize things, please head over to the 
                  <a href="${process.env.BASE_WEB_URL}/o/${org.slug}">company dashboard</a>.
              </p> 
              <br/>
              <p>The ${config.appName} team.</p>
            </div>`
    });
  }

  async finalizedOrg(user: User, org: Org) {

    return sendEmail({
      to: user.email,
      subject: `${org.name}! is ready!`,
      body: `<div>
              <h1>Hey ${user.firstName}!</h1>
              <p>It's settled...</p> 
              <p>
                <a href="${process.env.BASE_WEB_URL}/o/${org.slug}"><b>${org.name}</b></a> is in business! Go check it out.
              </p> 
              <br/>
              <p>The ${config.appName} team.</p>
            </div>
`
    });
  }


}

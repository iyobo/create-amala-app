import {sendEmail} from '../mailService';
import {User} from '../../data/models/auth/User';
import config from '../../config/config';
import {PasswordRecovery} from '@backend/data/models/auth/PasswordRecovery';

export class UserNotifications {

  async newUser(user: User) {

    return sendEmail({
      to: user.email,
      subject: `Welcome to ${config.appName}!`,
      body: `<div>
<h1>Hey ${user.firstName}!</h1>
<p>Welcome to ${config.appName}! Let's <a href="${process.env.BASE_WEB_URL}${config.app.onboardingURl}">get you started</a>.</p> 
<br/>
<p>The ${config.appName} team.</p>
</div>`
    });
  }

  async passwordReset(user: User, passwordRecovery: PasswordRecovery) {

    return sendEmail({
      to: user.email,
      subject: `Your ${config.appName} password has been reset`,
      body: `
            <h1>Hey ${user.firstName}!</h1>
            <p>Your password reset code is ${passwordRecovery.resetCode} over at ${config.appName}. 
            Please enter it there to choose your new password</p> 
            <p>If you did not try to reset your password, please ignore this email.</p>
        `
    });
  }
}

import {UserNotifications} from '@backend/services/notifications/UserNotifications';
import {OrgNotifications} from '@backend/services/notifications/OrgNotifications';

export const notifications = {
  user: new UserNotifications(),
  org: new OrgNotifications()
};
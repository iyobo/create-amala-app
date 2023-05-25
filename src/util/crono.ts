import {toNumber} from '../../../common/util/converters';
import {PasswordRecovery} from '../data/models/auth/PasswordRecovery';
import config from '../config/config';

export function toNumericClock(clock: string) {
  return toNumber(clock.replace(':', ''));
}

export function toUTCClock() {

}

export const generateExpiryMilliseconds = () => Date.now() + config.auth.passwordResetExpirySeconds;

export function isPasswordRecoveryExpired(pr: PasswordRecovery) {
  if(!pr) return false;

  return pr.createdAt.getTime() + config.auth.passwordResetExpirySeconds * 1000 > Date.now();
}
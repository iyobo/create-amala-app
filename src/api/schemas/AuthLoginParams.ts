import {IsRequired} from '../../util/validators/IsRequired';
import {IsBoolean, IsOptional, IsString} from 'class-validator';


export class AuthLoginParams {

  // Email or username
  @IsRequired()
  @IsString()
  identity: string;

  @IsRequired()
  @IsString()
  password: string;

  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean
}
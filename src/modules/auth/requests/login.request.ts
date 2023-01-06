import {IsNotEmpty, IsString} from 'class-validator';
import {Transform} from "class-transformer";
import {TransformUtils} from "../../core/utils/transform.utils";

export class LoginRequest {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @Transform(TransformUtils.parseString)
  password: string;
}

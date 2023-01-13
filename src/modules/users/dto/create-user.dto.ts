import { Transform } from 'class-transformer';
import {IsNotEmpty, IsNumber, IsOptional} from 'class-validator';
import { User } from '../../../database/entities/user/user.entity';
import { TransformUtils } from './../../core/utils/transform.utils';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @Transform(TransformUtils.parseNumber)
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  @Transform(TransformUtils.parseString)
  @ApiProperty({example: "tonganh"})
  username: string;

  @IsNotEmpty()
  @Transform(TransformUtils.parseString)
  @ApiProperty() @ApiProperty({example: "123456", minLength: 6, })
  password: string;

  @IsNotEmpty()
  @Transform(TransformUtils.parseString)
  @ApiProperty() @ApiProperty({example: "tong tien anh" })
  fullname: string;

  confirmPassword?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsNumber()
  gender?: number;

  @Transform(TransformUtils.parseNumberArray)
  @ApiProperty({example: [1,2,3], type: [Number]})
  roleIds: number[];

  toEntity(): User {
    const entity = new User();
    entity.username = this.username;
    entity.password = this.password;
    entity.age = this.age;
    entity.fullname = this.fullname;
    entity.gender = this.gender;
    entity.createdAt = new Date();
    entity.updatedAt = new Date();

    return entity;
  }
}

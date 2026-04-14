import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@wilkins.io' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '••••••••' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}

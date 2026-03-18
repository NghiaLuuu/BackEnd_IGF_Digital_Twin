import { ArrayNotEmpty, IsArray, IsString, MinLength } from 'class-validator';

export class ProfileDto {
  @IsString()
  @MinLength(3)
  userId!: string;

  @IsString()
  @MinLength(3)
  requesterUserId!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  requesterRoles!: string[];
}

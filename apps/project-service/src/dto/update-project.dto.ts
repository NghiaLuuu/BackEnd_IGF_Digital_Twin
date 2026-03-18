import {
  ArrayNotEmpty,
  IsArray,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  projectId!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name!: string;

  @IsString()
  @MaxLength(1000)
  description!: string;

  @IsString()
  requesterUserId!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  requesterRoles!: string[];
}

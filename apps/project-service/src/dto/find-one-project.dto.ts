import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class FindOneProjectDto {
  @IsString()
  projectId!: string;

  @IsString()
  requesterUserId!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  requesterRoles!: string[];
}

import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class DeleteProjectDto {
  @IsString()
  projectId!: string;

  @IsString()
  requesterUserId!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  requesterRoles!: string[];
}

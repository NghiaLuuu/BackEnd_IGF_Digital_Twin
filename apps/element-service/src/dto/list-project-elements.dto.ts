import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class ListProjectElementsDto {
  @IsString()
  projectId!: string;

  @IsString()
  requesterUserId!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  requesterRoles!: string[];
}

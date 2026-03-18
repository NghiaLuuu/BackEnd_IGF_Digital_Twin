import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ElementDto } from './element.dto';

export class SaveProjectElementsDto {
  @IsString()
  projectId!: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ElementDto)
  elements!: ElementDto[];

  @IsString()
  requesterUserId!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  requesterRoles!: string[];
}

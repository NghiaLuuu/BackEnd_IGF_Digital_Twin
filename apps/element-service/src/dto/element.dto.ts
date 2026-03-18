import { IsNumber, IsString, MaxLength, Min } from 'class-validator';

export class ElementDto {
  @IsString()
  @MaxLength(50)
  type!: string;

  @IsNumber()
  x!: number;

  @IsNumber()
  y!: number;

  @IsNumber()
  z!: number;

  @IsNumber()
  @Min(0)
  width!: number;

  @IsNumber()
  @Min(0)
  height!: number;

  @IsNumber()
  @Min(0)
  depth!: number;

  @IsString()
  @MaxLength(30)
  color!: string;
}

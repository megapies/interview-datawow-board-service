import { IsString } from 'class-validator';

import { IsOptional } from 'class-validator';

export class FindAllPostDto {
  @IsOptional()
  @IsString()
  community?: string;

  @IsOptional()
  @IsString()
  search?: string;
}

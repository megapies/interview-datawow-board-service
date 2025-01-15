import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  post_id: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(10000)
  text_value: string;
}

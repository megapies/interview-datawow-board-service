import { Inject, Injectable, Request } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Model, Types } from 'mongoose';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @Inject('COMMENT_MODEL')
    private commentModel: Model<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto, @Request() req) {
    const user = req.user;

    try {
      const comment = await this.commentModel.create({
        text_value: createCommentDto.text_value,
        post_id: Types.ObjectId.createFromHexString(createCommentDto.post_id),
        user_id: Types.ObjectId.createFromHexString(user.id),
        created_at: new Date(),
        updated_at: new Date(),
      });

      console.log('commenting', comment);

      return {
        comment: {
          id: comment.id,
          text_value: comment.text_value,
          created_at: comment.created_at,
          updated_at: comment.updated_at,
          post_id: comment.post_id,
          user_id: comment.user_id,
        },
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}

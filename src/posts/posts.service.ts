import { Model } from 'mongoose';
import { Inject, Injectable, Request, UseGuards } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Injectable()
export class PostsService {
  constructor(
    @Inject('POST_MODEL')
    private postModel: Model<Post>,
  ) {}

  @UseGuards(AuthGuard)
  async create(createPostDto: CreatePostDto, @Request() req) {
    const user = req.user;

    console.log('user', user);
    try {
      const post = await this.postModel.create({
        title: createPostDto.title,
        text_value: createPostDto.text_value,
        user_id: user.id,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return {
        post: {
          id: post.id,
          title: post.title,
          text_value: post.text_value,
          created_at: post.created_at,
          updated_at: post.updated_at,
          user_id: post.user_id,
        },
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}

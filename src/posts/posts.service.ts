import { Model, Types } from 'mongoose';
import { Inject, Injectable, Request, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @Inject('POST_MODEL')
    private postModel: Model<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, @Request() req) {
    const user = req.user;

    try {
      const post = await this.postModel.create({
        title: createPostDto.title,
        text_value: createPostDto.text_value,
        user_id: Types.ObjectId.createFromHexString(user.id),
        community: createPostDto.community,
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
          community: post.community,
        },
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll() {
    const posts = await this.postModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $lookup: {
          from: 'comments',
          let: { postId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$post_id', '$$postId'] },
              },
            },
            {
              $count: 'count',
            },
          ],
          as: 'comments_count',
        },
      },
      {
        $addFields: {
          comments_count: {
            $ifNull: [{ $arrayElemAt: ['$comments_count.count', 0] }, 0],
          },
        },
      },
    ]);

    return {
      posts: posts.map((post) => ({
        id: post._id,
        title: post.title,
        text_value: post.text_value,
        created_at: post.created_at,
        updated_at: post.updated_at,
        author: {
          username: post.user.username,
          avatar: post.user.avatar,
        },
        community: post.community,
        comments_count: post.comments_count,
      })),
    };
  }
  async findOne(id: string) {
    const post = await this.postModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'users',
          let: { userId: '$user_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$userId'],
                },
              },
            },
          ],
          as: 'author',
        },
      },
      {
        $unwind: '$author',
      },
      {
        $lookup: {
          from: 'comments',
          let: { postId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$post_id', '$$postId'],
                },
              },
            },
            {
              $lookup: {
                from: 'users',
                let: { userId: '$user_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$userId'],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      username: 1,
                    },
                  },
                ],
                as: 'user',
              },
            },
            {
              $unwind: '$user',
            },
          ],
          as: 'comments',
        },
      },
    ]);

    const formattedPost = post[0];
    if (!formattedPost) {
      throw new NotFoundException('Post not found');
    }

    return {
      post: {
        id: formattedPost._id,
        title: formattedPost.title,
        text_value: formattedPost.text_value,
        created_at: formattedPost.created_at,
        updated_at: formattedPost.updated_at,
        user_id: formattedPost.user_id,
      },
      author: {
        id: formattedPost.author._id,
        username: formattedPost.author.username,
      },
      comments: formattedPost.comments.map((comment) => ({
        id: comment._id,
        text_value: comment.text_value,
        created_at: comment.created_at,
        updated_at: comment.updated_at,
        user_id: comment.user_id,
        user: {
          id: comment.user._id,
          username: comment.user.username,
        },
      })),
    };
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { Model } from 'mongoose';
import { Post } from './entities/post.entity';
import { NotFoundException } from '@nestjs/common';

describe('PostsService', () => {
  let service: PostsService;
  let postModel: Model<Post>;

  const mockPostModel = {
    create: jest.fn(),
    aggregate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: 'POST_MODEL',
          useValue: mockPostModel,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postModel = module.get<Model<Post>>('POST_MODEL');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const createPostDto = {
        title: 'Test Post',
        text_value: 'Test Content',
      };

      const req = {
        user: {
          id: 'user123',
        },
      };

      const mockCreatedPost = {
        id: 'post123',
        title: createPostDto.title,
        text_value: createPostDto.text_value,
        user_id: req.user.id,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPostModel.create.mockResolvedValue(mockCreatedPost);

      const result = await service.create(createPostDto, req);

      expect(postModel.create).toHaveBeenCalledWith({
        title: createPostDto.title,
        text_value: createPostDto.text_value,
        user_id: req.user.id,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });

      expect(result).toEqual({
        post: mockCreatedPost,
      });
    });

    it('should throw an error if creation fails', async () => {
      const createPostDto = {
        title: 'Test Post',
        text_value: 'Test Content',
      };

      const req = {
        user: {
          id: 'user123',
        },
      };

      const error = new Error('Database error');
      mockPostModel.create.mockRejectedValue(error);

      await expect(service.create(createPostDto, req)).rejects.toThrow(error);
    });
  });

  describe('findOne', () => {
    it('should return a post with author and comments', async () => {
      const postId = '507f1f77bcf86cd799439011';

      const mockAggregateResult = [
        {
          _id: postId,
          title: 'Test Post',
          text_value: 'Test Content',
          user_id: 'user123',
          created_at: new Date(),
          updated_at: new Date(),
          author: {
            _id: 'user123',
            username: 'testuser',
          },
          comments: [
            {
              _id: 'comment123',
              text_value: 'Test Comment',
              created_at: new Date(),
              updated_at: new Date(),
              user_id: 'commenter123',
              user: {
                _id: 'commenter123',
                username: 'commenter',
              },
            },
          ],
        },
      ];

      mockPostModel.aggregate = jest
        .fn()
        .mockResolvedValue(mockAggregateResult);

      const result = await service.findOne(postId);

      expect(mockPostModel.aggregate).toHaveBeenCalledWith([
        {
          $match: {
            _id: expect.any(Object), // Types.ObjectId
          },
        },
        {
          $lookup: {
            from: 'users',
            let: { userId: '$user_id' },
            pipeline: expect.any(Array),
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
            pipeline: expect.any(Array),
            as: 'comments',
          },
        },
      ]);

      expect(result).toEqual({
        post: {
          id: postId,
          title: 'Test Post',
          text_value: 'Test Content',
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          user_id: 'user123',
        },
        author: {
          id: 'user123',
          username: 'testuser',
        },
        comments: [
          {
            id: 'comment123',
            text_value: 'Test Comment',
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            user_id: 'commenter123',
            user: {
              id: 'commenter123',
              username: 'commenter',
            },
          },
        ],
      });
    });

    it('should throw NotFoundException when post is not found', async () => {
      const postId = '507f1f77bcf86cd799439011';

      mockPostModel.aggregate = jest.fn().mockResolvedValue([]);

      await expect(service.findOne(postId)).rejects.toThrow(NotFoundException);
    });
  });
});

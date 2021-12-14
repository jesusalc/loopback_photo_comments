import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Photo,
  Comment,
} from '../models';
import {CommentRepository, PhotoRepository} from '../repositories';

export class CommentController {
  constructor(
    @repository(PhotoRepository) public photoRepository: PhotoRepository,
    @repository(CommentRepository) public commentRepository : CommentRepository,
  ) { }

  @get('/photos/{id}/comment', {
    responses: {
      '200': {
        description: 'Comment belonging to Photo',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Comment)},
          },
        },
      },
    },
  })
  async getComment(
    @param.path.number('id') id: typeof Photo.prototype.id,
  ): Promise<Comment> {
    return this.photoRepository.comment(id);
  }

  @get('/photos/{id}/comments', {
    responses: {
      '200': {
        description: 'Array of Photo has many Comment',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Comment)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Comment>,
  ): Promise<Comment[]> {
    return this.photoRepository.comments(id).find(filter);
  }

  @get('/comment/{id}/comments', {
    responses: {
      '200': {
        description: 'Array of Comments has many Comment',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Comment)},
          },
        },
      },
    },
  })
  async getComments(
    @param.path.number('id') commentId: typeof Comment.prototype.id,
  ): Promise<Comment> {
    return this.commentRepository.subComment(commentId);
  }

  @post('/photos/{id}/comments', {
    responses: {
      '200': {
        description: 'Photo model instance',
        content: {'application/json': {schema: getModelSchemaRef(Comment)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Photo.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Comment, {
            title: 'NewCommentInPhoto',
            exclude: ['id'],
            optional: ['photoId']
          }),
        },
      },
    }) comment: Omit<Comment, 'id'>,
  ): Promise<Comment> {
    return this.photoRepository.comments(id).create(comment);
  }

  @patch('/photos/{id}/comments', {
    responses: {
      '200': {
        description: 'Photo.Comment PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Comment, {partial: true}),
        },
      },
    })
    comment: Partial<Comment>,
    @param.query.object('where', getWhereSchemaFor(Comment)) where?: Where<Comment>,
  ): Promise<Count> {
    return this.photoRepository.comments(id).patch(comment, where);
  }

  @del('/photos/{id}/comments', {
    responses: {
      '200': {
        description: 'Photo.Comment DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Comment)) where?: Where<Comment>,
  ): Promise<Count> {
    return this.photoRepository.comments(id).delete(where);
  }

}

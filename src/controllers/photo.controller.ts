// Copyright IBM Corp. 2018,2020. All Rights Reserved.
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {Photo} from '../models';
import {PhotoRepository} from '../repositories';

export class PhotoController {
  constructor(
    @repository(PhotoRepository)
    public photoRepository: PhotoRepository,
  ) {}

  @post('/photos', {
    responses: {
      '200': {
        description: 'Photo model instance',
        content: {'application/json': {schema: getModelSchemaRef(Photo)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Photo, {
            title: 'NewPhoto',
            exclude: ['id'],
          }),
        },
      },
    })
    photo: Omit<Photo, 'id'>,
  ): Promise<Photo> {
    return this.photoRepository.create(photo);
  }

  @get('/photos/{id}', {
    responses: {
      '200': {
        description: 'Photo model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Photo, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Photo, {exclude: 'where'})
    filter?: FilterExcludingWhere<Photo>,
  ): Promise<Photo> {
    return this.photoRepository.findById(id, filter);
  }

  @get('/photos', {
    responses: {
      '200': {
        description: 'Array of Photo model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Photo, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Photo) filter?: Filter<Photo>): Promise<Photo[]> {
    return this.photoRepository.find(filter);
  }

  @put('/photos/{id}', {
    responses: {
      '204': {
        description: 'Photo PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() photo: Photo,
  ): Promise<void> {
    await this.photoRepository.replaceById(id, photo);
  }

  @patch('/photos/{id}', {
    responses: {
      '204': {
        description: 'Photo PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Photo, {partial: true}),
        },
      },
    })
    photo: Photo,
  ): Promise<void> {
    await this.photoRepository.updateById(id, photo);
  }

  @del('/photos/{id}', {
    responses: {
      '204': {
        description: 'Photo DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.photoRepository.deleteById(id);
  }
}

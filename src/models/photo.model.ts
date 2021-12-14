// Copyright IBM Corp. 2018,2020. All Rights Reserved.
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {Comment} from './comment.model';

@model()
export class Photo extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  link: string;

  @property({
    type: 'string',
  })
  title?: string;

  @hasMany(() => Comment)
  comments: Comment[];

  constructor(data?: Partial<Photo>) {
    super(data);
  }
}

export type PhotoWithRelations = Photo;

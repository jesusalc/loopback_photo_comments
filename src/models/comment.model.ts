import {model, property, belongsTo, hasMany} from '@loopback/repository';
import { Photo} from '.';
import { Comment as SubComment } from './comment.model';

@model({settings: {strict: false}})
export class Comment extends Photo {
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
  text: string;

  @belongsTo(() => Photo, {keyTo: 'id'})
  photoId: number;

  @hasMany(() => SubComment, {keyTo: 'id'})
  commentId: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Comment>) {
    super(data);
  }
}

export interface CommentRelations {
  // describe navigational properties here
}

export type CommentWithRelations = Comment & CommentRelations;

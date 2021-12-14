import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, BelongsToAccessor, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Comment, CommentRelations, Photo} from '../models';
import {PhotoRepository} from './photo.repository';

export class CommentRepository extends DefaultCrudRepository<
  Comment,
  typeof Comment.prototype.id,
  CommentRelations
> {

  public readonly subComment: BelongsToAccessor<
    Comment,
    typeof Comment.prototype.id
    >;

  public readonly photo: BelongsToAccessor<
    Photo,
    typeof Photo.prototype.id
    >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('PhotoRepository')
      photoRepositoryGetter: Getter<PhotoRepository>,
  ) {
    super(Comment, dataSource);
    this.subComment = this._createBelongsToAccessorFor(
      'friend',
      Getter.fromValue(this),
    );
    this.photo = this._createBelongsToAccessorFor(
      'photo',
      photoRepositoryGetter,
    );
  }
}

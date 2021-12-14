// Copyright IBM Corp. 2018,2020. All Rights Reserved.
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Photo, Comment} from '../models';
import {CommentRepository} from './comment.repository';

export class PhotoRepository extends DefaultCrudRepository<
  Photo,
  typeof Photo.prototype.id
> {

  public readonly comment: BelongsToAccessor<Comment, typeof Photo.prototype.id>;

  public readonly comments: HasManyRepositoryFactory<Comment, typeof Photo.prototype.id>;

  constructor(@inject('datasources.db') dataSource: DbDataSource,
              @repository.getter('CommentRepository') protected commentRepositoryGetter: Getter<CommentRepository>,
  ) {
    super(Photo, dataSource);
    this.comments = this.createHasManyRepositoryFactoryFor('comments', commentRepositoryGetter,);
    this.registerInclusionResolver('comments', this.comments.inclusionResolver);
    this.comment = this.createBelongsToAccessorFor('comment', commentRepositoryGetter,);
    this.registerInclusionResolver('comment', this.comment.inclusionResolver);
  }
}

// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {juggler} from '@loopback/repository';
import {givenHttpServerConfig} from '@loopback/testlab';
import {SocialApplication} from '../application';
import {Photo, Comment} from '../models';
import {PhotoRepository, CommentRepository} from '../repositories';

/*
 ==============================================================================
 HELPER FUNCTIONS
 If you find yourself creating the same helper functions across different
 test files, then extracting those functions into helper modules is an easy
 way to reduce duplication.

 Other tips:

 - Using the super awesome Partial<T> type in conjunction with Object.assign
   means you can:
   * customize the object you get back based only on what's important
   to you during a particular test
   * avoid writing test logic that is brittle with respect to the properties
   of your object
 - Making the input itself optional means you don't need to do anything special
   for tests where the particular details of the input don't matter.
 ==============================================================================
 */

/**
 * Generate a complete Photo object for use with tests.
 * @param photo - A partial (or complete) Photo object.
 */
export function givenPhoto(photo?: Partial<Photo>) {
  const data = Object.assign(
    {
      title: 'Wedding dance',
      link: 'link',
    },
    photo,
  );
  return new Photo(data);
}

/**
 * Generate a complete Comment object for use with tests.
 * @param comment - A partial (or complete) Photo object.
 */
export function givenComment(comment?: Partial<Comment>) {
  const data = Object.assign(
    {
      photoId: 1,
      text: 'Wedding comment',
    },
    comment,
  );
  return new Comment(data);
}
/**
 * Generate a complete Comment object for use with tests.
 * @param comment - A partial (or complete) Photo object.
 */
export function givenSubComment(comment?: Partial<Comment>) {
  const data = Object.assign(
    {
      photoId: 1,
      commentId: 1,
      text: 'Wedding sub comment',
    },
    comment,
  );
  return new Comment(data);
}
export function givenPhotoWithoutId(photo?: Partial<Photo>): Omit<Photo, 'id'> {
  return givenPhoto(photo);
}
export function givenCommentWithoutId(comment?: Partial<Comment>): Omit<Comment, 'id'> {
  return givenPhoto(comment);
}

export async function givenRunningApplicationWithCustomConfiguration() {
  const app = new SocialApplication({
    rest: givenHttpServerConfig(),
  });

  await app.boot();

  /**
   * Override default config for DataSource for testing so we don't write
   * test data to file when using the memory connector.
   */
  app.bind('datasources.config.db').to({
    name: 'db',
    connector: 'memory',
  });

  // Start Application
  await app.start();
  return app;
}

export async function givenPhotoRepositories(app: SocialApplication) {
  const photoRepo = await app.getRepository(PhotoRepository);
  const commentRepo = await app.getRepository(CommentRepository);
  return {photoRepo, commentRepo};
}


export async function givenPhotoInstance(
  photoRepo: PhotoRepository,
  photo?: Partial<Photo>,
) {
  return photoRepo.create(givenPhoto(photo));
}
export async function givenCommentInstance(
  commentRepo: CommentRepository,
  comment?: Partial<Comment>,
) {
  return commentRepo.create(givenComment(comment));
}

export async function givenEmptyDatabase() {
  const commentRepo: CommentRepository = new CommentRepository(testdb, testdb);
  const photoRepo: PhotoRepository = new PhotoRepository(testdb, testdb);

  await commentRepo.deleteAll();
  await photoRepo.deleteAll();
}

export const testdb: juggler.DataSource = new juggler.DataSource({
  name: 'db',
  connector: 'memory',
});

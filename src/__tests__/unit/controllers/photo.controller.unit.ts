// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {PhotoController} from '../../../controllers';
import {Photo} from '../../../models';
import {PhotoRepository} from '../../../repositories';
import {givenPhoto} from '../../helpers';

describe('PhotoController', () => {
  let photoRepo: StubbedInstanceWithSinonAccessor<PhotoRepository>;

  /*
  =============================================================================
  TEST VARIABLES
  Combining top-level objects with our resetRepositories method means we don't
  need to duplicate several variable assignments (and generation statements)
  in all of our test logic.

  NOTE: If you wanted to parallelize your test runs, you should avoid this
  pattern since each of these tests is sharing references.
  =============================================================================
  */
  let controller: PhotoController;
  let aPhoto: Photo;
  let aPhotoWithId: Photo;
  let aChangedPhoto: Photo;
  let aListOfPhotos: Photo[];

  beforeEach(resetRepositories);

  describe('createPhoto', () => {
    it('creates a Photo', async () => {
      const create = photoRepo.stubs.create;
      create.resolves(aPhotoWithId);
      const result = await controller.create(aPhoto);
      expect(result).to.eql(aPhotoWithId);
      sinon.assert.calledWith(create, aPhoto);
    });
  });

  describe('findPhotoById', () => {
    it('returns a photo if it exists', async () => {
      const findById = photoRepo.stubs.findById;
      findById.resolves(aPhotoWithId);
      expect(await controller.findById(aPhotoWithId.id as number)).to.eql(
        aPhotoWithId,
      );
      sinon.assert.calledWith(findById, aPhotoWithId.id);
    });
  });

  describe('findPhotos', () => {
    it('returns multiple photos if they exist', async () => {
      const find = photoRepo.stubs.find;
      find.resolves(aListOfPhotos);
      expect(await controller.find()).to.eql(aListOfPhotos);
      sinon.assert.called(find);
    });

    it('returns empty list if no photos exist', async () => {
      const find = photoRepo.stubs.find;
      const expected: Photo[] = [];
      find.resolves(expected);
      expect(await controller.find()).to.eql(expected);
      sinon.assert.called(find);
    });
  });

  describe('replacePhoto', () => {
    it('successfully replaces existing items', async () => {
      const replaceById = photoRepo.stubs.replaceById;
      replaceById.resolves();
      await controller.replaceById(aPhotoWithId.id as number, aChangedPhoto);
      sinon.assert.calledWith(replaceById, aPhotoWithId.id, aChangedPhoto);
    });
  });

  describe('updatePhoto', () => {
    it('successfully updates existing items', async () => {
      const updateById = photoRepo.stubs.updateById;
      updateById.resolves();
      await controller.updateById(aPhotoWithId.id as number, aChangedPhoto);
      sinon.assert.calledWith(updateById, aPhotoWithId.id, aChangedPhoto);
    });
  });

  describe('deletePhoto', () => {
    it('successfully deletes existing items', async () => {
      const deleteById = photoRepo.stubs.deleteById;
      deleteById.resolves();
      await controller.deleteById(aPhotoWithId.id as number);
      sinon.assert.calledWith(deleteById, aPhotoWithId.id);
    });
  });

  function resetRepositories() {
    photoRepo = createStubInstance(PhotoRepository);
    aPhoto = givenPhoto();
    aPhotoWithId = givenPhoto({
      id: 1,
    });
    aListOfPhotos = [
      aPhotoWithId,
      givenPhoto({
        id: 2,
        title: 'so many things to do',
      }),
    ] as Photo[];
    aChangedPhoto = givenPhoto({
      id: aPhotoWithId.id,
      title: 'Do some important things',
    });

    controller = new PhotoController(photoRepo);
  }
});

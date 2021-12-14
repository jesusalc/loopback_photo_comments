// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {EntityNotFoundError} from '@loopback/repository';
import {Client, createRestAppClient, expect, toJSON} from '@loopback/testlab';
import {SocialApplication} from '../../application';
import {Photo} from '../../models';
import {PhotoRepository} from '../../repositories';
import {
  givenRunningApplicationWithCustomConfiguration,
  givenPhoto,
  givenPhotoInstance,
  givenPhotoRepositories,
} from '../helpers';

describe('SocialApplication', () => {
  let app: SocialApplication;
  let client: Client;
  let photoRepo: PhotoRepository;

  before(async () => {
    app = await givenRunningApplicationWithCustomConfiguration();
  });
  after(() => app.stop());

  before(async () => {
    ({photoRepo} = await givenPhotoRepositories(app));
  });
  before(() => {
    client = createRestAppClient(app);
  });

  beforeEach(async () => {
    await photoRepo.deleteAll();
  });

  it('creates a photo', async function () {
    const photo = givenPhoto();
    const response = await client.post('/photos').send(photo).expect(200);
    expect(response.body).to.containDeep(photo);
    const result = await photoRepo.findById(response.body.id);
    expect(result).to.containDeep(photo);
  });

  it('rejects requests to create a photo with no link', async () => {
    const photo: Partial<Photo> = givenPhoto();
    delete photo.link;
    await client.post('/photos').send(photo).expect(422);
  });

  context('when dealing with a single persisted photo', () => {
    let persistedPhoto: Photo;

    beforeEach(async () => {
      persistedPhoto = await givenPhotoInstance(photoRepo);
    });

    it('gets a photo by ID', () => {
      return client
        .get(`/photos/${persistedPhoto.id}`)
        .send()
        .expect(200, toJSON(persistedPhoto));
    });

    it('returns 404 when getting a photo that does not exist', () => {
      return client.get('/photos/99999').expect(404);
    });

    it('replaces the photo by ID', async () => {
      const updatedPhoto = givenPhoto({
        title: 'Wedding dance',
        link: 'link',
      });
      await client
        .put(`/photos/${persistedPhoto.id}`)
        .send(updatedPhoto)
        .expect(204);
      const result = await photoRepo.findById(persistedPhoto.id);
      expect(result).to.containEql(updatedPhoto);
    });

    it('returns 404 when replacing a photo that does not exist', () => {
      return client.put('/photos/99999').send(givenPhoto()).expect(404);
    });

    it('updates the photo by ID ', async () => {
      const updatedPhoto = givenPhoto({
        title: 'Wedding dance',
      });
      await client
        .patch(`/photos/${persistedPhoto.id}`)
        .send(updatedPhoto)
        .expect(204);
      const result = await photoRepo.findById(persistedPhoto.id);
      expect(result).to.containEql(updatedPhoto);
    });

    it('returns 404 when updating a photo that does not exist', () => {
      return client.patch('/photos/99999').send(givenPhoto()).expect(404);
    });

    it('deletes the photo', async () => {
      await client.del(`/photos/${persistedPhoto.id}`).send().expect(204);
      await expect(photoRepo.findById(persistedPhoto.id)).to.be.rejectedWith(
        EntityNotFoundError,
      );
    });

    it('returns 404 when deleting a photo that does not exist', async () => {
      await client.del(`/photos/99999`).expect(404);
    });
  });
});

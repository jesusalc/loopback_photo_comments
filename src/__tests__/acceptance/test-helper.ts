// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {SocialApplication} from '../..';

export async function setupApplication(): Promise<AppWithClient> {
  const app = new SocialApplication({
    rest: givenHttpServerConfig(),
  });

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: SocialApplication;
  client: Client;
}

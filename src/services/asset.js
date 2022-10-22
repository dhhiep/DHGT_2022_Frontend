import { apiCaller } from '@/services/api';
import * as storage from '@/utils/storage';

export const fetch = () => {
  return new Promise((resolve) => {
    const currentResourceKey = 'currentResource';
    // const latestResourceURL = storage.load(currentResourceKey);

    // TODO: Disable feature using previous asset. Remove it when go live.
    const latestResourceURL = null;

    if (latestResourceURL) {
      resolve(latestResourceURL);
    } else {
      apiCaller('POST', '/api/register').then((resp) => {
        const resourceURL = `${process.env.VUE_APP_PUBLIC_BUCKET}/${resp.data.data.image_file_name}`;
        storage.store(currentResourceKey, resourceURL);

        resolve(resourceURL);
      });
    }
  });
};

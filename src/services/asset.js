// import { getResource } from '@/services/api';
import * as storage from '@/utils/storage';

export const fetch = () => {
  return new Promise((resolve) => {
    const currentResourceKey = 'currentResource';
    const latestResourceURL = storage.load(currentResourceKey);

    if (latestResourceURL) {
      resolve(latestResourceURL);
    } else {
      // getResource().then((resp) => {
      //   const baseEndpoint = 'https://daihoigioitre2021.s3-ap-southeast-1.amazonaws.com';
      //   const resourceURL = `${baseEndpoint}/${resp.data}`;
      //   storage.store(currentResourceKey, resourceURL);

      //   resolve(resourceURL);
      // });

      const resourceURL = 'https://carlo-acutis-team.s3.ap-southeast-1.amazonaws.com/lixi/17.jpg';
      storage.store(currentResourceKey, resourceURL);

      resolve(resourceURL);
    }
  });
};

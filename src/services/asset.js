import { apiCaller } from '@/services/api';
import { storeLocalAsset, loadLocalAsset } from '@/services/localStorage';
import { isPresent } from '@/utils/lang';

export const fetch = () => {
  return new Promise((resolve) => {
    if (isPresent(loadLocalAsset())) {
      resolve(loadLocalAsset());
    } else {
      apiCaller('POST', '/api/register', {}, { attachApiKey: false }).then((resp) => {
        let resource = resp.data.data;
        resource.imageUrl = `${process.env.VUE_APP_PUBLIC_BUCKET}/${resource.image_file_name}`;
        storeLocalAsset(resource);
        resolve(resource);
      });
    }
  });
};

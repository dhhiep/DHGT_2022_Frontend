import { apiCaller } from '@/services/api';
import { storeLocalAsset, loadLocalAsset } from '@/services/localStorage';
import { isPresent } from '@/utils/lang';
// import { clearLocalAsset } from '@/services/localStorage';

export const fetch = () => {
  return new Promise((resolve) => {
    // TODO: Disable feature using previous asset. Remove it when go live.
    // clearLocalAsset();

    if (isPresent(loadLocalAsset())) {
      resolve(loadLocalAsset());
    } else {
      apiCaller('POST', '/api/register').then((resp) => {
        let resource = resp.data.data;
        resource.imageUrl = `${process.env.VUE_APP_PUBLIC_BUCKET}/${resource.image_file_name}`;
        storeLocalAsset(resource);
        resolve(resource);
      });
    }
  });
};

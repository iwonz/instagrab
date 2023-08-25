import { MediaType, PostItem } from '../types';

export const getPostsMaterialsCount = (posts: PostItem[]) => {
  const defaultCounts = { photosCount: 0, videosCount: 0, totalCount: 0 };

  return posts?.reduce((counters, post) => {
    if (post.product_type === 'carousel_container') {
      post.carousel_media.forEach((media) => {
        if (media.media_type === MediaType.PHOTO) {
          counters.photosCount = counters.photosCount + 1;
        } else if (media.media_type === MediaType.VIDEO) {
          counters.videosCount = counters.videosCount + 1;
        }
      });

      counters.totalCount = counters.totalCount += post.carousel_media.length;
    } else {
      if (post.media_type === MediaType.PHOTO) {
        counters.photosCount = counters.photosCount + 1;
      } else if (post.media_type === MediaType.VIDEO) {
        counters.videosCount = counters.videosCount + 1;
      }

      counters.totalCount++;
    }

    return counters;
  }, defaultCounts) || defaultCounts;
};

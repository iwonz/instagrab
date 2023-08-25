import { MediaFile, MediaStatus, MediaType, PostItem, PostItemCarouselMedia } from '../types';
import Queue from 'queue-promise';
import { downloadMediaFileFx } from '../store/downloaders/posts';

export const getMediaExtension = (media: PostItem | PostItemCarouselMedia) => {
  return media.media_type === MediaType.PHOTO ? 'jpg' : 'mp4';
};

export const downloadPostMediaFiles = (post: PostItem, postIndex: number): Promise<MediaFile[]> => {
  const postFolderName = `post${postIndex}`;

  return new Promise((resolve) => {
    const queue = new Queue({
      concurrent: 5,
      start: false,
    });

    const mediaFiles: MediaFile[] = [];
    mediaFiles.push({
      status: MediaStatus.SUCCESS,
      media: null,
      response: JSON.stringify({
        captionText: post.caption?.text,
        dtCreate: new Date((post.taken_at || 0) * 1000).toLocaleString(),
        takenAt: post.taken_at,
      }),
      meta: {
        fileName: `${postFolderName}/info.json`,
      },
    });

    if (post.product_type === 'carousel_container') {
      post.carousel_media.forEach((media, mediaIndex) => {
        queue.enqueue(() => downloadMediaFileFx({
          media,
          meta: {
            fileName: `${postFolderName}/${mediaIndex + 1}.${getMediaExtension(media)}`,
          },
        }));
      }, []);
    } else {
      queue.enqueue(() => downloadMediaFileFx({
        media: post,
        meta: {
          fileName: `${postFolderName}/1.${getMediaExtension(post)}`,
        },
      }));
    }

    queue.on('end', () => {
      resolve(mediaFiles);
    });

    queue.on('resolve', (media) => {
      mediaFiles.push(media);
    });

    queue.start();
  });
};

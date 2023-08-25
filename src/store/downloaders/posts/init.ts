import { $posts, $postsDownloadingStatus, $users, downloadMediaFileFx, downloadPost, downloadPostFx, downloadPosts, downloadPostsFx, loadUser, loadUserFx } from './index';
import { fetchAllPosts, fetchUser } from '../../../utils/fetchPosts';
import { sample } from 'effector';
import Queue from 'queue-promise';
import chunk from 'lodash/chunk';
import { POSTS_DOWNLOADING_CHUNK_SIZE } from '../../../utils/constants';
import { downloadPostMediaFiles } from '../../../utils/downloadPostMediaFiles';
import { MediaFile, MediaStatus, MediaType, PostItem } from '../../../types';
import { produce } from 'immer';
import { downloadZipFile } from '../../../utils/downloadZipFile';

loadUserFx.use((username) => {
  return Promise.all([
    fetchUser(username),
    fetchAllPosts(username),
  ]).then(([user, posts]) => {
    return {
      user,
      posts,
    };
  });
});

sample({
  clock: loadUser,
  source: $users,
  filter: (users, username) => !users[username],
  fn: (_, username) => username,
  target: loadUserFx,
});

sample({
  clock: loadUserFx.doneData,
  source: $users,
  fn: (users, user) => {
    return produce(users, (users) => {
      users[user.user.username] = user.user;

      return users;
    });
  },
  target: $users,
});

sample({
  clock: loadUserFx.doneData,
  source: $posts,
  fn: (posts, user) => {
    return produce(posts, (posts) => {
      posts[user.user.username] = user.posts;

      return posts;
    });
  },
  target: $posts,
});

downloadMediaFileFx.use(({ media, meta }) => {
  return new Promise((resolve) => {
    const isPhoto = media.media_type === MediaType.PHOTO;
    const url = isPhoto ? media.image_versions2.candidates.find((candidate) => candidate.width === media.original_width && candidate.height === media.original_height).url : media.video_versions?.[0].url;

    return fetch(url).then((response) => {
      resolve({
        status: MediaStatus.SUCCESS,
        media,
        response,
        meta,
      });
    }).catch((error) => {
      resolve({
        status: MediaStatus.FAILED,
        media,
        error,
        meta,
      });
    });
  });
});

downloadPostsFx.use((posts) => {
  return new Promise((resolve) => {
    const queue = new Queue({
      concurrent: 1,
      start: false,
    });

    chunk(posts, POSTS_DOWNLOADING_CHUNK_SIZE).forEach((part, chunkIndex) => {
      const chunkFromId = (chunkIndex * POSTS_DOWNLOADING_CHUNK_SIZE) + 1;
      const chunkToId = POSTS_DOWNLOADING_CHUNK_SIZE * (chunkIndex + 1) - Math.abs(part.length - POSTS_DOWNLOADING_CHUNK_SIZE);
      const zipFileName = `${chunkFromId} - ${chunkToId}`;

      queue.enqueue(() => {
        return new Promise((resolve) => {
          const queue = new Queue({
            concurrent: 5,
            start: false,
          });

          const mediaFiles: MediaFile[] = [];
          part.forEach((post, postIndex) => {
            queue.enqueue(() => downloadPostMediaFiles(post, (postIndex + 1) + (chunkIndex * POSTS_DOWNLOADING_CHUNK_SIZE)));
          });

          queue.on('end', () => {
            downloadZipFile(
              mediaFiles.map((mediaFile) => {
                return {
                  input: mediaFile.response,
                  name: mediaFile.meta.fileName,
                };
              }),
              zipFileName,
            ).then(resolve);
          });

          queue.on('resolve', (postMediaFiles) => {
            mediaFiles.push(...postMediaFiles);
          });

          queue.start();
        });
      });
    });

    queue.on('end', resolve);
    queue.start();
  });
});

sample({
  clock: downloadPosts,
  source: {
    isPending: downloadPostsFx.pending,
    posts: $posts,
  },
  filter: ({ isPending }) => !isPending,
  fn: ({ posts }, username) => posts[username],
  target: downloadPostsFx,
});

sample({
  clock: downloadMediaFileFx.doneData,
  source: $postsDownloadingStatus,
  fn: (postsDownloadingStatus, mediaFile) => {
    return produce(postsDownloadingStatus, (postsDownloadingStatus) => {
      if (mediaFile.status === MediaStatus.SUCCESS) {
        postsDownloadingStatus.downloaded.push(mediaFile.media);

        if (mediaFile.media?.media_type === MediaType.PHOTO || mediaFile.media?.media_type === MediaType.VIDEO) {
          postsDownloadingStatus.totalDownloadedCount++;
        }
      } else {
        postsDownloadingStatus.failed.push(mediaFile.media);
      }

      return postsDownloadingStatus;
    });
  },
  target: $postsDownloadingStatus,
});

sample({
  clock: downloadPost,
  source: {
    posts: $posts,
    isPending: downloadPostFx.pending,
  },
  filter: ({ isPending }) => !isPending,
  fn: ({ posts }, { username, postCode }) => {
    return {
      username,
      posts,
      postCode,
    };
  },
  target: downloadPostFx,
});

downloadPostFx.use(({ username, posts, postCode }) => {
  const download = (posts: PostItem[], postCode: string) => {
    return new Promise((resolve) => {
      const post = posts.find((post) => post.code === postCode);
      const zipFileName = '1';

      return downloadPostMediaFiles(post, 1).then((mediaFiles) => {
        return downloadZipFile(
          mediaFiles.map((mediaFile) => {
            return {
              input: mediaFile.response,
              name: mediaFile.meta.fileName,
            };
          }),
          zipFileName,
        ).then(resolve);
      });
    });
  };

  if (posts[username]) {
    return download(posts[username], postCode);
  }

  return loadUserFx(username).then(({ posts }) => {
    return download(posts, postCode);
  });
});

import { getFetchOptions } from './getFetchOptions';
import { PostItem, UserData } from '../types';

export const fetchPosts = (username: string, maxId?: string, count = 15) => {
  return fetch(
    `https://www.instagram.com/api/v1/feed/user/${username}/username/?count=${count}${
      maxId ? `&max_id=${maxId}` : ''
    }`,
    getFetchOptions(),
  ).then((r) => r.json());
};

export const fetchAllPosts = (username: string) => {
  return new Promise((resolve, reject) => {
    let posts: PostItem[] = [];

    const fetchPostsPart = (maxId?: string) => {
      fetchPosts(username, maxId)
        .then((response) => {
          posts.push(...response.items);

          if (response.more_available) {
            setTimeout(() => {
              fetchPostsPart(response.next_max_id);
            }, 100);
          } else {
            resolve(posts.reverse());
          }
        })
        .catch(reject);
    };

    fetchPostsPart();
  });
};

export const fetchUser = (username: string): Promise<UserData['user']> => {
  return fetch(
    `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
    getFetchOptions(),
  ).then((r) => r.json()).then((response) => {
    return response.data.user;
  });
};

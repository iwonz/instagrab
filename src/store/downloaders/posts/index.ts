import { createEffect, createEvent, createStore } from 'effector';
import { MediaFile, PostItem, PostItemCarouselMedia, PostsDownloadingStatus, UserItem } from '../../../types';

export const $users = createStore<Record<string, UserItem>>({});
export const $posts = createStore<Record<string, PostItem[]>>({});

export const loadUser = createEvent<string>();
export const loadUserFx = createEffect<string, { user: UserItem; posts: PostItem[]; }>();

export const downloadPosts = createEvent<string>();
export const downloadPostsFx = createEffect<PostItem[], void>();

export const downloadPost = createEvent<{ username: string; postCode: string; }>();
export const downloadPostFx = createEffect<{ username: string; posts: Record<string, PostItem[]>; postCode: string; }, void>();

export const downloadMediaFileFx = createEffect<{ media: PostItem | PostItemCarouselMedia; meta: Record<string, any>; }, MediaFile>();

export const $postsDownloadingStatus = createStore<PostsDownloadingStatus>({
  totalDownloadedCount: 0,
  downloaded: [],
  failed: [],
}).reset(downloadPosts);

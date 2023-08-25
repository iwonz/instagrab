export enum MessageType {
  GET_USER_DATA = 'GET_USER_DATA',
  URL_CHANGED = 'URL_CHANGED',
  TAB_READY = 'TAB_READY',
}

export enum ActivePage {
  UNKNOWN,
  PROFILE,
  POST,
  STORY,
  HIGHLIGHT,
}

export enum ActiveModal {
  USER_DATA = 'USER_DATA',
}

export enum ProductType {
  CAROUSEL_CONTAINER = 'carousel_container',
  CAROUSEL_ITEM = 'carousel_item',
  FEED = 'feed',
  CLIPS = 'clips',
}

export enum MediaStatus {
  SUCCESS,
  FAILED
}

export interface MediaFile {
  status: MediaStatus;
  media: PostItem | PostItemCarouselMedia;
  response?: Response | string;
  error?: any;
  meta: Record<string, any>;
}

export enum MediaType {
  PHOTO = 1,
  VIDEO = 2,
}

export interface PostItemImage {
  width: number;
  height: number;
  url: string;
}

export interface PostItemCarouselMedia {
  media_type: MediaType;
  original_height: number;
  original_width: number;
  image_versions2: {
    candidates: PostItemImage[];
  };
  video_versions?: PostItemImage[];
}

export interface PostItem {
  id: string;
  code: string;
  media_type: MediaType;
  original_height: number;
  original_width: number;
  taken_at: number;
  caption?: {
    text: string;
  };
  image_versions2: {
    candidates: PostItemImage[];
  };
  video_versions?: PostItemImage[];
  carousel_media?: PostItemCarouselMedia[];
  product_type: ProductType;
}

export interface UserItem {
  full_name: string;
  username: string;
  profile_pic_url_hd: string;
}

export interface UserData {
  user: {
    full_name: string;
    username: string;
    profile_pic_url_hd: string;
  };
  posts: PostItem[];
}

export interface PostsDownloadingStatus {
  totalDownloadedCount: number;
  downloaded: Array<PostItem | PostItemCarouselMedia>;
  failed: Array<PostItem | PostItemCarouselMedia>;
}

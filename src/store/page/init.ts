import { sample } from 'effector';
import { $activeModal, $activePage, $activePostCode, $pathname, $username, setActiveModal, setPathName } from './index';
import { DOCUMENT_TITLE_USERNAME_REGEX, HIGHLIGHT_REGEX, POST_REGEX, PROFILE_PAGE_REGEX, STORY_REGEX } from '../../utils/constants';
import { ActivePage } from '../../types';

sample({
  clock: setPathName,
  target: $pathname,
});

sample({
  clock: setActiveModal,
  target: $activeModal,
});

sample({
  clock: $pathname,
  fn: (pathname) => {
    if (pathname.match(PROFILE_PAGE_REGEX)) {
      return ActivePage.PROFILE;
    }

    if (pathname.match(POST_REGEX)) {
      return ActivePage.POST;
    }

    if (pathname.match(STORY_REGEX)) {
      return ActivePage.STORY;
    }

    if (pathname.match(HIGHLIGHT_REGEX)) {
      return ActivePage.HIGHLIGHT;
    }

    return ActivePage.UNKNOWN;
  },
  target: $activePage,
});

sample({
  clock: $pathname,
  fn: (pathname) => {
    return pathname.match(PROFILE_PAGE_REGEX)?.[1] || document.title.match(DOCUMENT_TITLE_USERNAME_REGEX)?.[1] || document.querySelector('meta[name="twitter:title"]')?.getAttribute('content')?.match(DOCUMENT_TITLE_USERNAME_REGEX)?.[1];
  },
  target: $username,
});

sample({
  clock: $pathname,
  fn: (pathname) => {
    return pathname.match(POST_REGEX)?.[1];
  },
  target: $activePostCode,
});

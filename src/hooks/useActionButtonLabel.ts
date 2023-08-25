import { useStore } from 'effector-react';
import { ActivePage } from '../types';
import { $activePage, $username } from '../store/page';

export const useActionButtonLabel = () => {
  const activePage = useStore($activePage);
  const username = useStore($username);

  let label = 'β';
  switch (activePage) {
    case ActivePage.PROFILE:
      label = `Grab${username ? ` @${username}` : ''} profile`;
      break;
    case ActivePage.POST:
      label = 'Download post';
      break;
    case ActivePage.STORY:
      label = 'Grab story';
      break;
    case ActivePage.HIGHLIGHT:
      label = 'Grab highlight';
      break;
  }

  return label;
};

import { getProfileUrl } from './getProfileUrl';

export const getInstagramLogin = () => {
  const splittedProfileUrl = getProfileUrl()?.split('/');

  return splittedProfileUrl[splittedProfileUrl.length - 1];
};

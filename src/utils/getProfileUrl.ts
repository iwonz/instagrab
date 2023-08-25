export const getProfileUrl = (): string => {
  return document.querySelector('link[hreflang="x-default"]')?.getAttribute('href');
};

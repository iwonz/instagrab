export const getBaseFetchOptions = () => {
  return {
    'x-csrftoken': document.cookie.split(' ')[2].split('=')[1].slice(0, -1),
    'x-ig-app-id': '936619743392459',
    'x-ig-www-claim': sessionStorage.getItem('www-claim-v2'),
  };
};

export const getFetchOptions = () => {
  return {
    headers: {
      accept: '*/*',
      'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
      'cache-control': 'no-cache',
      dpr: '2',
      pragma: 'no-cache',
      'sec-ch-prefers-color-scheme': 'light',
      'sec-ch-ua':
        '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
      'sec-ch-ua-full-version-list':
        '"Not/A)Brand";v="99.0.0.0", "Google Chrome";v="115.0.5790.170", "Chromium";v="115.0.5790.170"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-ch-ua-platform-version': '"13.4.1"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'viewport-width': '883',
      'x-asbd-id': '129477',
      ...getBaseFetchOptions(),
      'x-requested-with': 'XMLHttpRequest',
    },
    referrer: 'https://www.instagram.com/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: null,
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  };
};
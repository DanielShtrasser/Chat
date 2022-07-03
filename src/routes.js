const prefix = 'api';

export default {
  login: () => [prefix, 'login'].join('/'),
  signup: () => [prefix, 'signup'].join('/'),
  data: () => [prefix, 'data'].join('/'),
};

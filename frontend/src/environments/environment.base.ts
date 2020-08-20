const production = false;

const BACKEND_BASE = 'http://localhost:3000/v1';
// const BACKEND_BASE = 'https://great-things-test.herokuapp.com/v1';

const BACKEND = {
  login: `${BACKEND_BASE}/auth/authenticate`,
  register: `${BACKEND_BASE}/auth/register`,
  refreshToken: `${BACKEND_BASE}/auth/refresh`
};

export const baseEnvironment = {
  production,
  BACKEND_BASE,
  BACKEND
};

import 'zone.js/dist/zone-error';

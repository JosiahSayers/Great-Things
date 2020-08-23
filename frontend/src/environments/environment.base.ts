const production = false;

const BACKEND_BASE = 'http://localhost:3000/v1';
// const BACKEND_BASE = 'https://great-things-test.herokuapp.com/v1';

const BACKEND = {
  login: `${BACKEND_BASE}/auth/authenticate`,
  register: `${BACKEND_BASE}/auth/register`,
  refreshToken: `${BACKEND_BASE}/auth/refresh`,
  greatThings: {
    base: (userId: string) => `${BACKEND_BASE}/users/${userId}/great-things`,
    random: function (userId: string) { return `${this.base(userId)}/random`; },
    single: function (userId: string, greatThingId: string) { return `${this.base(userId)}/${greatThingId}`; }
  }
};

export const baseEnvironment = {
  production,
  BACKEND_BASE,
  BACKEND
};

import 'zone.js/dist/zone-error';

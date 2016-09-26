
const ROLE_GUEST = 'guest';
const ROLE_USER = 'user';
const ROLE_ADMIN = 'admin';

const AUTH_SIGN_UP = 'auth:sign-up';
const AUTH_SIGN_IN = 'auth:sign-in';

const REPORTS_VIEW   = 'users:view';
const REPORTS_EDIT   = 'users:edit';
const REPORTS_CREATE = 'users:create';
const REPORTS_REMOVE = 'users:remove';
const REPORTS = [REPORTS_VIEW, REPORTS_EDIT, REPORTS_CREATE, REPORTS_REMOVE];

module.exports = {
  ROLE_GUEST: ROLE_GUEST,
  ROLE_USER: ROLE_USER,
  ROLE_ADMIN: ROLE_ADMIN,

  AUTH_SIGN_UP: AUTH_SIGN_UP,
  AUTH_SIGN_IN: AUTH_SIGN_IN,
  AUTH_SIGN_OUT: AUTH_SIGN_OUT,

  REPORTS_VIEW: REPORTS_VIEW,
  REPORTS_EDIT: REPORTS_EDIT,
  REPORTS_CREATE: REPORTS_CREATE,
  REPORTS_REMOVE: REPORTS_REMOVE,

  rules: {
    [ROLE_GUEST]: [AUTH_SIGN_IN, AUTH_SIGN_UP],
    [ROLE_USER]: [...REPORTS],
  }
};

const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt');
const createTokenUser = require('./createTokenUser');
const checkPermisions = require('./checkPermissions');

module.exports = {
  attachCookiesToResponse,
  checkPermisions,
  createJWT,
  createTokenUser,
  isTokenValid,
};

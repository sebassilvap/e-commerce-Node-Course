const CustomError = require('../errors');
const { isTokenValid } = require('../utils');

// set up the middleware
const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    //console.log('error, no token present');
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }

  //console.log('token present');

  // if token is present
  try {
    //console.log(payload);
    //const payload = isTokenValid({ token }); //? destructuring
    const { name, userId, role } = isTokenValid({ token });

    req.user = { name, userId, role };

    // if all is ok, pass to the next middleware!
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }
};

/*//? Refactor this using the roles as ARGUMENTS
const authorizePermissions = (req, res, next) => {
  //console.log('admin route');

  // if it's not an admin
  if (req.user.role !== 'admin') {
    throw new CustomError.UnauthorizedError(
      'Unauthorized to access this route'
    );
  }
  next();
};
*/

// with ...rest => collect all that I pass to the function!
// from here we return a function, and this function will have access to req, res & next
const authorizePermissions = (...roles) => {
  //console.log(roles);
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized to access this route'
      );
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};

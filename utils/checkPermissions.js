const CustomError = require('../errors');

const checkPermisions = (requestUser, resourceUserId) => {
  /*//? Just for Reference
  console.log(requestUser);
  console.log(resourceUserId);
  console.log(typeof resourceUserId);
  */

  // getSingleUser -> for role 'user' can only check own profile
  // admin can check all!

  if (requestUser.role === 'admin') return;
  if (requestUser.userId === resourceUserId.toString()) return;

  throw new CustomError.UnauthorizedError(
    'Not authorized to access this route'
  );
};

module.exports = checkPermisions;

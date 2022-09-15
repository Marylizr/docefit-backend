const jwt = require("jsonwebtoken");
const User = require('../mongo/schema/user');
const { roles } = require('../roles')
const AccessControl = require("accesscontrol");
const ac = new AccessControl();


exports.roles = (function() {
ac.grant("basic")
 .readOwn("profile")
 .updateOwn("profile")

ac.grant("supervisor")
 .extend("basic")
 .readAny("profile")

ac.grant("admin")
 .extend("basic")
 .extend("supervisor")
 .updateAny("profile")
 .deleteAny("profile")

return ac;
})();

exports.authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    let tokenData;
    try {
        tokenData = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return res.status(400).send("Invalid token");
    }

    const user = await User.findById(tokenData.id);
    if(user){
        req.sessionUser = user;
    }
    next();

};

exports.grantAccess = function(action, resource) {
    return async (req, res, next) => {
     try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
       return res.status(401).json({
        error: "You don't have enough permission to perform this action"
       });
      }
      next()
     } catch (error) {
      next(error)
     }
    }
   }
    
   exports.allowIfLoggedin = async (req, res, next) => {
    try {
     const user = res.locals.loggedInUser;
     if (!user)
      return res.status(401).json({
       error: "You need to be logged in to access this route"
      });
      req.user = user;
      next();
     } catch (error) {
      next(error);
     }
   }

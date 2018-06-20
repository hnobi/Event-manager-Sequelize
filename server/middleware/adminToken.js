import jwt from 'jsonwebtoken';
import env from 'dotenv';

env.config();


/**
 * @param {obj} req
 * @param {obj} res
 * @param {obj} next
 * @returns {obj} Error on
 */
const authAdminToken = (req, res, next) => {
  const token = req.body.token || req.headers['x-access-token'] || req.query.token;

  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: 'Token is Invalid or Expired',
        });
      }
      req.decoded = decoded;
      const { isAdmin } = req.decoded;// isAdmin = req.decoded.isAdmin
      if (isAdmin) {
        return next();
      }
      return res.status(403).send({
        message: 'You are not permitted to view this page',
      });
    });
  } else {
    res.status(403);
    res.send({
      message: 'Access denied. You are not logged in',
    });
  }
};

export default authAdminToken;

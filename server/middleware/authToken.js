//this is  Verification of  JSON Web Tokens  and authorization 
import jwt from 'jsonwebtoken';
import env from 'dotenv';
env.config();



const authToken = (req, res, next) => {
  const token = req.body.token || req.headers['x-access-token'] || req.query.token;


  //if token is provided by the user ,verify and check if it invalid or expired
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(401)
          .json({
            status: 'Failed',
            message: 'Authentication failed. Token is invalid or expired'
          });
      } else {
        // if everything in authentication is valid, save to request for use in other routes
        // jwt.verify wil decode the encoded payload


        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(403);
    res.json({
      status: 'Failed',
      message: 'Access denied. You are not logged in'
    });
  }

}




export default authToken;


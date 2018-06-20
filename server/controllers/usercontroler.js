import models from '../models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from 'dotenv';
env.config();

const { User } = models;   // const User = models.user (i.e, destructuring)es6
export default class UserApiController {

  static signup(req, res) {
    const { fullname, username, email } = req.body;

    User.findOne({
      where: {
        $or: [{
          username: {
            $ilike: username   // input username exist in db//ilike will see upper and lowercase to be the same
          }
        },
        {
          email: {
            $ilike: email
          }
        }
        ]
      }
    }).then((userExistInDb) => {
      if (userExistInDb) {
        let errorValue;
        if (userExistInDb.username === username) {
          errorValue = username;
        } else if (userExistInDb.email === email) {
          errorValue = email;
        }
        return res.status(400)
          .json({
            status: 'failed',
            message: `${errorValue} already exist`
          })
      }
      // end existing user checking

      //if the user doesn’t exist, it is created

      const saltRounds = 10;
      bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          User.create({
            fullname,
            username,
            email,
            isAdmin: true,
            password: hash

          }).then((user) => {
            const payload = { fullname: user.fullname, username: user.username, isAdmin: user.isAdmin, userId: user.id };
            const token = jwt.sign(payload, process.env.SECRET_KEY, {
              expiresIn: 60 * 60 * 8   // 8 hours
            });
            req.token = token;
            res.status(200)
              .json({
                status: 'success',
                message: 'successfull register',
                data: {
                  id: user.id,
                  username: user.username,
                  email: user.email,
                  isAdmin: user.isAdmin
                },
                token
              });
          });

        });
      });
    }).catch(error => res.status(500).json({
      status: 'Failed',
      message: error.message // bring out only the error message from sequelize error object
    }));


  }
  //signup ends
  /**
   * 
   * 
   * @static
   * @param {any} req 
   * @param {any} res 
   * @returns 
   * @memberof UserApiController
   */
  static signin(req, res) {
    const { username, password } = req.body;

    User.findOne({
      where: {
        username: {
          $iLike: username
        }
      }
    }).then((user) => {
      if (user && user.username.toLowerCase === username.toLowerCase) {
        const check = bcrypt.compareSync(password, user.password);
        if (check) { // check===true
          const payload = { fullname: user.fullname, username: user.username, isAdmin: user.isAdmin, userId: user.id };
          const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 60 * 60 * 8   // 8 hours
          });
          req.token = token; // second token here means const token in authToken file
          return res.status(200).json({
            status: 'Success',
            message: 'You are now logged In',
            data: {
              id: user.id,
              username: user.username
            },
            token
          });
        }
        return res.status(400).json({
          status: 'Failed',
          message: 'Invalid username or password'
        });
      }
      res.status(404).json({
        status: 'Failed',
        message: 'User not found'
      });
    }).catch(error => res.status(500).json({
      status: 'Failed',
      message: error.message
    }));
  }









}


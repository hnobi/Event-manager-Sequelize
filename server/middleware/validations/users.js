import validator from 'validator';
import isEmpty from 'lodash/isEmpty';




export default class UsersValidations {

    static signup(req, res, next) {
        const {
            fullname,
            username,
            email,
            password
        } = req.body;

        const error = {};

        if (fullname === undefined || username === undefined || email === undefined || password === undefined) {
            res.status(400)
                .json({
                    Status: 'failed',
                    Message: 'all or some fields are not defined'
                });
        }
        if (!validator.isEmpty(fullname)) {
            for (let i = 0; i < fullname.length; i++) {
                if (validator.toInt(fullname[i])) {
                    error.fullName = 'Full name must not contain numbers';
                    break;
                }
            }
        } else {
            error.Fullname = 'Fullname is required'
        }

        if (!validator.isEmpty(username)) {
            if (validator.toFloat(username)) {
                error.username = 'username must not begin with number(s)'
            }
        } else {
            error.username = 'username is required'
        }

        if (!validator.isEmpty(email)) {
            if (!validator.isEmail(email)) {
                error.email = 'Email is invalid'
            }
        } else {
            error.email = 'email is required'
        }
        if (!validator.isEmpty(password)) {
            if (!validator.isLength(password, { min: 8, max: 20 })) {
                error.password = 'Password length must be between 8 and 30'
            }
        } else {
            error.password = 'password is required'
        }


        if (!isEmpty(error)) {
            return res.status(400).json({ error });
        }

        next();
    }
    //   signup validation ends



    static signin(req, res, next) {

        const {
            username,
            password
        } = req.body;

        const error = {};

        if (username === undefined || password === undefined) {
            return res.status(400)
                .json({
                    status: 'failed',
                    message: 'both or one field(s) is/are not defined'
                });
        }

        if (validator.isEmpty(username)) {
            error.username = 'username is required'
        }

        if (validator.isEmpty(password)) {
            error.password = 'password is required'
        }

        if (!isEmpty(error)) { //from lodash isEmpty dats y it has no (validator.IsEmpty(str) cos this one is for str)
            return res.status(400).json({ error });
        }

        next();
    }









}





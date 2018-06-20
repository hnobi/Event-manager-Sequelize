import validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default class CenterValidation {
  static addCenter(req, res, next) {
    const { name, location, facilities } = req.body
    const error = {};
    if (name === undefined || location === undefined || facilities === undefined) {
      return res.status(400)
        .json({
          status: 'failed',
          message: 'all or some field(s) is/are not defined'
        });
    }

    if (!validator.isEmpty(name)) {
      if (!validator.isLength(name, { min: 3, max: 50 })) {
        error.name = 'name of center must be between 3 and 50 characters'
      }
    } else {
      error.name = 'name is required'
    }


    if (!validator.isEmpty(location)) {
      if (!validator.isLength(location, { min: 10, max: 100 })) {
        error.location = 'location of center must be between 10 and 100 character'
      }
    } else {
      error.location = 'location is required'
    }


    if (!validator.isEmpty(facilities)) {
      if (!validator.isLength(facilities, { min: 20, max: 1000 })) {
        error.facilities = 'Facilities of center must be between 20 and 1000 letters'
      }
    } else {
      error.facilities = 'facilties is required'
    }
    if (!isEmpty(error)) {
      return res.status(400).json({ error });
    }
    next();
  }














}


import express from 'express';
import CentersController from '../controllers/centerscontroler';
import UserController from '../controllers/usercontroler';
import UserValidation from '../middleware/validations/users'
import tokenAuth from '../middleware/authToken';
import CenterValidation from '../middleware/validations/centers'
import EventController from '../controllers/eventscontroler';
const router = express.Router();



router.route('/users/signup')
    .post(UserValidation.signup, UserController.signup)
router.route('/users/signin')
    .post(UserValidation.signin, UserController.signin)



router.route('/centers')
    .post(tokenAuth, CenterValidation.addCenter, CentersController.addCenter)
    .get(CentersController.getAllCenter);



router.route('/centers/:centerID')
    .get(CentersController.getSingleCenter)


router.route('/events')
    .post(tokenAuth, EventController.addEvent)











export default router;
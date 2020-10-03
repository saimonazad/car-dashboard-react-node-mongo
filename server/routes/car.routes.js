import express from 'express'
import carCtrl from '../controllers/car.controller'
import authCtrl from '../controllers/auth.controller'
import userCtrl from '../controllers/user.controller'

const router = express.Router()

router.route('/api/cars')
  .get(carCtrl.list)

  router.route('/api/cars/search')
  .get(carCtrl.search)

router.route('/api/cars/new/:userId')
  .post(carCtrl.create)

router.route('/api/cars/:carId')
  .get(authCtrl.requireSignin, carCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, carCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, carCtrl.remove)

router.param('carId', carCtrl.carByID)
router.param('userId', userCtrl.userByID)


export default router

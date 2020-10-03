import Car from '../models/car.model'
import extend from 'lodash/extend'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
  const car = new Car(req.body)
  car.postedBy = req.profile
  try {
    await car.save()
    return res.status(200).json({
      message: "Successfully added car to database"
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/**
 * Load car and append to req.
 */
const carByID = async (req, res, next, id) => {
  try {
    let car = await Car.findById(id)
    if (!car)
      return res.status('400').json({
        error: "Car not found"
      })
    req.profile = car
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve car"
    })
  }
}

const read = (req, res) => {
  return res.json(req.profile)
}

const list = async (req, res) => {
  const { page = 0, limit = 2 } = req.query;
  try {
    let cars = await Car.find().select('manufacturer model year updated postedBy created')
      .limit(limit * 1)
      .skip((page) * limit)
      .exec()
    const countAll = await Car.count();
    const countResult = await Car.countDocuments();
    res.json({
      cars,
      totalPages: Math.ceil(countResult / limit),
      currentPage: page,
      totalCarCount: countAll
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const search = async (req, res) => {

  const { q = '', page = 0, limit = 5 } = req.query;
  try {
    let cars = await Car.find({ model: { '$regex': `^${q}.*`, '$options': 'i' } })
      .limit(limit * 1)
      .skip((page) * limit)
      .exec()
      
    const countResult = await Car.countDocuments()
    res.json({
      cars,
      totalPages: Math.ceil(countResult / limit),
      currentPage: page,
      totalCarCount: countResult
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const update = async (req, res) => {
  try {
    let car = req.profile
    car = extend(car, req.body)
    car.updated = Date.now()
    await car.save()
    car.hashed_password = undefined
    car.salt = undefined
    res.json(car)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const remove = async (req, res) => {
  try {
    let car = req.profile
    let deletedCar = await car.remove()
    deletedCar.hashed_password = undefined
    deletedCar.salt = undefined
    res.json(deletedCar)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

export default {
  create,
  carByID,
  read,
  list,
  remove,
  update,
  search
}

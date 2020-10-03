import mongoose from 'mongoose'

const CarSchema = new mongoose.Schema({
  manufacturer: {
    type: String,
    required: 'Manufacturer name is required'
  },
  model: {
    type: String,
    required: 'Car model is required'
  },
  year: {
    type: String,
    required: "Year is required"
  },
  postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
})



export default mongoose.model('Car', CarSchema)

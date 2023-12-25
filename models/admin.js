import mongoose from 'mongoose';

const SlotSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
});

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  fromGoogle: {
    type: Boolean,
    default: false,
  },
  slots: [
    {
      date: {
        type: Date,
        required: true,
      },
      slots: [SlotSchema],
    },
  ],
});

export default mongoose.model('Admin', AdminSchema);

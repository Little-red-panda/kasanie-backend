import { Schema, model } from 'mongoose';

const roleSchema = new Schema({
  value: {
    type: String,
    unique: true,
    required: true,
    default: 'USER',
  },
});

export default model('Role', roleSchema);

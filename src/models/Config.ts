import mongoose, { Model, Schema } from 'mongoose';
import { IConfig } from '../interfaces';

const ConfigSchema: Schema<IConfig> = new Schema({
  min: { type: Number, required: true , default: 3},
  max: { type: Number, required: true , default: 8},
  default: { type: Number, required: true , default: 5}
});


const Config: Model<IConfig> = mongoose.model('Config', ConfigSchema);
export default Config;

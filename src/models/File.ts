import mongoose, { Model, Schema } from 'mongoose';
import { IFile } from '../interfaces';

const FileSchema: Schema<IFile> = new Schema({
    name: {type: String, required: true},
    path: {type: String, required: true, unique: true},
    weight: {type: Number, required: true},
    upload_at: {type: Date, required: true},
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    shared_users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    type: { type: String, required: true },
    sync: { type: Boolean, default: false },
});


const File: Model<IFile> = mongoose.model('File', FileSchema);
export default File;

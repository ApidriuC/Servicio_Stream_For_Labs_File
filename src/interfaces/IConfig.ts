import { Document } from 'mongoose';

/**
 * Define a user interface to managament with mongoose
 * @category Interfaces
 * @interface   IConfig
 * @extends {Document}
 */
interface   IConfig extends Document{
    max:number,
    min:number,
    default:number
}
export default  IConfig;

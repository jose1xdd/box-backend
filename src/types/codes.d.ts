import mongoose from 'mongoose';

declare global{
    export interface Icode {
        userId: mongoose.Types.ObjectId,
        code:string;
    }
    export interface IcodeDocument extends Icode, Document{}
}
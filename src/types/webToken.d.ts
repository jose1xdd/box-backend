import mongoose from 'mongoose';
declare global{
    export interface IWebToken {
        token : string;
        ttl: Date;
        userId: mongoose.ObjectId;
    }

    export interface IWebTokenDocument extends IWebToken, Document { }

}
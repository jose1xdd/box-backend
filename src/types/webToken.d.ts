import mongoose from 'mongoose';

export interface IWebToken {
    token : string;
    ttl: Date;
    userId: mongoose.ObjectId;
}

export interface IWebTokenDocument extends IWebToken, Document { }
import mongoose from 'mongoose';

declare global{
    export interface Icombat {
        boxer1: mongoose.ObjectId,
        boxer2: mongoose.ObjectId,
        winner: mongoose.ObjectId,
        status: string,
        weigthCategory: IweightCategoryDocument
    }

    export interface IcombatDocument extends Icombat, Document{}

}
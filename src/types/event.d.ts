import mongoose from 'mongoose';
declare global {
    export interface Ievent {
        type: string,
        trainer: mongoose.ObjectId,
        name: string,
        description: string,
        combats?: Icombat[],
        startsAt: Date,
        endsAt: Date,
        participants?: mongoose.ObjectId[]

    }

    export interface IeventDocument extends Ievent, Document{}

}
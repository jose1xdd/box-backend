import mongoose from 'mongoose';
import { Icombat } from './combat';

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
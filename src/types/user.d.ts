import mongoose from 'mongoose';
import { IphysicalTest } from './physicalTest';
import { IweightCategory } from './weightCategory';
export interface Iranking {
    win: number,
    lose: number,
    draw:number,
}
export interface Irole {
    name: string,
    permissions: string
}
export interface Iuser {
    name : string,
    lastName : string,
    birthDate : Date,
    cedula : string,
    email : string,
    weight?: number,
    phone : string,
    address : string,
    club: mongoose.ObjectId,
    password : string,
    role : string | Irole,
    photo? : string,
    ranking?: Iranking,
    weightCategory? : IweightCategory,
    physicalTest? : IphysicalTest[]
}

export interface IUserDocument extends Iuser, Document {}

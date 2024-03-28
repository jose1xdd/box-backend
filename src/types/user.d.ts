import mongoose from 'mongoose';
declare global{
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
        _id: mongoose.Types.ObjectId
    }

    export interface IUserDocument extends Iuser, Document {}

}

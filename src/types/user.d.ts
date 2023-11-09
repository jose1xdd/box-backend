import { IphysicalTest } from './physicalTest';
import { IweightCategory } from './weightCategory';

export interface Iuser {
    name : string,
    lastName : string,
    birthDate : Date,
    cedula : string,
    email : string,
    weight?: number,
    phone : string,
    address : string,
    password : string,
    role : string,
    photo? : string,
    weightCategory? : IweightCategory,
    physicalTest? : IphysicalTest[]
}

export interface IUserDocument extends Iuser, Document {}

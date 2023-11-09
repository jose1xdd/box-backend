import { IphysicalTest } from './physicalTest';
import { Iweight_category } from './weight_category';

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
    weightCategory? : Iweight_category,
    physicalTest? : IphysicalTest[]
}

export interface IUserDocument extends Iuser, Document {}

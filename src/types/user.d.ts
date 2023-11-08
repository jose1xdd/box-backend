import { Iphysical_test } from './physical_test';
import { Iweight_category } from './weight_category';

export interface Iuser {
    name : string,
    lastName : string,
    birth_date : Date,
    cedula : string,
    email : string,
    phone : string,
    adress : string,
    password : string,
    role : string,
    photo? : string,
    weight_category? : Iweight_category,
    physical_test? : Iphysical_test[]
}

export interface IUserDocument extends Iuser, Document {}

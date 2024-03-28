import { Document } from 'mongoose';

declare global{
    export interface IcriterioTestuser extends IcriterioTest{
        repeats : number
    }
    export interface IcriterioTest {
        name : string
    }

    export interface IcriterioTestDocument extends IcriterioTest, Document {}
    export interface Icriterio extends IcriterioTest {
        repeats: number;
    }

    export interface IphysicalTest {
            date: Date;
            test: IcriterioTest[];
        }

}
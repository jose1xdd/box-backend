
import { IcriterioTest } from './criterioTest';

export interface Icriterio extends IcriterioTest {
    repeats : number
}

export interface IphysicalTest {
    date: Date,
    test: IcriterioTest[]
}
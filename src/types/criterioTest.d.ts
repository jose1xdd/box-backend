export interface IcriterioTestuser extends IcriterioTest{
    repeats : number
}
export interface IcriterioTest {
    name : string
}

export interface IcriterioTestDocument extends IcriterioTest, Document {}
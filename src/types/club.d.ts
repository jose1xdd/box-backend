import { Document } from 'mongoose';

declare global{
    export interface Iclub {
        name: string,
        description: string,
        members?: Iuser[],
        photo?: string
    }

    export interface IclubDocument extends Iclub, Document{}

}
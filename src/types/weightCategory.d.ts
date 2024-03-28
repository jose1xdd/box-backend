import { Document } from 'mongoose';

declare global{
   export interface IweightCategory {
         name : string,
         maxWeight : number,
         minWeight : number
      }

   export interface IweightCategoryDocument extends IweightCategory, Document { }

}

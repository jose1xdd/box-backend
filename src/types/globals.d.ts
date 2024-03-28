import {} from 'express';
declare global{
    export interface Iseccion extends Document {
            name: string,
            description: string,
            photo?: string
        }
    export interface Iindex {
            mision: string,
            vision: string,
            logo?: string,
            section: Iseccion[]
        }

    export namespace Express {
            export interface Request {
                box:{
                    session:{
                        user:IUserDocument
                    }
                }
                getUser: () => Request['box']['session']['user'];
                getUserId: () => string;
            }
        }

}

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
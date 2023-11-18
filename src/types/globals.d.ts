export interface Iseccion {
    name: string,
    description: string,
    photo?: string
}
export interface Iindex {
    mision: string,
    vision: string,
    logo?: string,
    seccion: Iseccion[]
}
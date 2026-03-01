export type Genre = 'fiction' | 'non-fiction'
//1
export interface Book{
    title: string,
    author: string,
    genre: Genre,
    year?: number | undefined,
}


export interface User{
    id: number,
    name: string,
    email: string,
    isActive?: boolean
}

export const createUser = (
    id: number,
    name:string,
    email:string, 
    isActive: boolean = true
): User => {

    return {id, name, email, isActive }
}

export const createBook = (book: Book): Book => {

    return excludeUndefinedFields(book)
}

export const excludeUndefinedFields =  <T extends object> (object: T): T =>{

     return Object.fromEntries(

        Object.entries(object)

        .filter(([_,value]) => value !== undefined)
    ) as T
}


//2
//перерузки в js нет же?
export function calculateArea (
    shape: 'circle' | 'square',
    radius?: number | undefined, 
    side?:number | undefined

): number {
    
    if (shape === 'circle') {
        if (radius === undefined) {
            throw new Error("err");
        }
        return getCircleSquare(radius);
    }

    if (shape === 'square') {
        if (side === undefined) {
            throw new Error("err");
        }
        return getAreaOfSquare(side);
    }

    throw new Error("Unknown shape");
 }
    

function getCircleSquare(radius:number): number{
    return Math.PI * Math.pow(radius,2)
}

function getAreaOfSquare(side:number): number{
    return  side * side
}



//3
type StringFormatter = (str: string, uppercase?: boolean) => string


export const capitalizeFirstString : StringFormatter = (str: string): string =>{
   return str.charAt(0).toUpperCase() + str.slice(1)
}

export const trimString: StringFormatter = (str:string, uppercase?:boolean): string => {

    const trimStr: string = str.trim()

    return !uppercase ? trimStr : trimStr.toUpperCase()
}   



//4
export interface HasId{
    
    id:number
}

export const findById = <T extends HasId>(items: T[], id: number): T | undefined => {

    return items.find((item) => item.id === id)
}




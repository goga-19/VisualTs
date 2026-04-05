import type { Book, User } from "../../main/index.js"

const correctUser:User =  {
    id:1,
    name: "Misha",
    email: "da",
    isActive: true
}

const correctBookWithYear: Book = {
    title: "title",
    author: "ya",
    genre: 'fiction',
    year: 2005
}

const correctBookWithoutYear: Book = {
    title: "title",
    author: "ya",
    genre: 'fiction',
    year: undefined
}
const expectedBookWithYearUndefined: Book = {
    title: "title",
    author: "ya",
    genre: 'fiction',
}

export default {
    correctBookWithYear,
    correctBookWithoutYear,
    expectedBookWithYearUndefined,
    correctUser
}
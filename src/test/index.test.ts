import { assert, assertType, expect, expectTypeOf, it, test } from 'vitest'
import { calculateArea, createBook, createUser, findById, type Book, type User } from '../main/index.js'
import { describe } from 'node:test';
import Data from '../test/data/data.js'


describe("UserBookTest", () => {

    it('Correct create user', () => {
         expect(createUser(1,"Misha","da",true)).toStrictEqual(Data.correctUser);
    })

    it('Incorrect create user', () => {
         expect(createUser(131,"Mish31a","d31a",true)).not.equal(Data.correctUser);
    })

    it('Correct create book with year', () => {
         expect(createBook(Data.correctBookWithYear)).toStrictEqual(Data.correctBookWithYear);
    })  

    it('correct create book with year', () => {
         expect(createBook(Data.correctBookWithoutYear)).toStrictEqual(Data.expectedBookWithYearUndefined);
    })

    it("Type User tests" , () => {
        assertType<User>(createUser(1,"Misha","da",true))
    })


    it('Calculate circle area сorrect', () => {
        const radius = 2;
        const expected = Math.PI * 4;
        expect(calculateArea('circle', radius)).toBeCloseTo(expected);
    });

    it('Calculate square area correct', () => {
        const side = 5;
        const expected = 25; 
        expect(calculateArea('square', undefined, side)).toBe(expected);
    });

    it('Find item by ID', () => {
        const items = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
        const found = findById(items, 2);
        expect(found).toEqual({ id: 2, name: 'B' });
    });

    it('Return undefined if ID not found', () => {
        const items = [{ id: 1, name: 'A' }];
        const found = findById(items, 999);
        expect(found).toBeUndefined();
    });

})
import { describe, it, expect } from 'vitest';
import { where, sort, groupBy, having, query } from '../main/index.js';

// ── фикстура ──────────────────────────────────────────────
type User = {
  id: number;
  name: string;
  age: number;
  role: 'admin' | 'user';
};

const users: User[] = [
  { id: 1, name: 'Alice', age: 30, role: 'admin' },
  { id: 2, name: 'Bob',   age: 25, role: 'user'  },
  { id: 3, name: 'Carol', age: 30, role: 'user'  },
  { id: 4, name: 'Dave',  age: 25, role: 'admin' },
];

describe('where', () => {
  it('фильтрует по точному совпадению', () => {
    const result = where('role', 'admin')(users);
    expect(result).toHaveLength(2);
    expect(result.every(u => u.role === 'admin')).toBe(true);
  });

  it('возвращает пустой массив если ничего не найдено', () => {
    const result = where('name', 'Unknown')(users);
    expect(result).toHaveLength(0);
  });

  it('не мутирует исходный массив', () => {
    const copy = [...users];
    where('role', 'admin')(users);
    expect(users).toEqual(copy);
  });
});


describe('sort', () => {
  it('сортирует числа по возрастанию', () => {
    const result = sort('age')(users);
    const ages = result.map(u => u.age);
    expect(ages).toEqual([...ages].sort((a, b) => a - b));
  });

  it('сортирует строки по возрастанию', () => {
    const result = sort('name')(users);
    const names = result.map(u => u.name);
    expect(names).toEqual([...names].sort());
  });

  it('не мутирует исходный массив', () => {
    const copy = [...users];
    sort('age')(users);
    expect(users).toEqual(copy);
  });
});


describe('groupBy', () => {
  it('группирует по ключу', () => {
    const groups = groupBy('role')(users);
    expect(groups).toHaveLength(2);
  });

  it('каждая группа содержит правильный key', () => {
    const groups = groupBy('role')(users);
    const keys = groups.map(g => g.key).sort();
    expect(keys).toEqual(['admin', 'user']);
  });

  it('items в группе соответствуют ключу', () => {
    const groups = groupBy('role')(users);
    for (const group of groups) {
      expect(group.items.every(u => u.role === group.key)).toBe(true);
    }
  });

  it('суммарное кол-во items равно исходному массиву', () => {
    const groups = groupBy('age')(users);
    const total = groups.reduce((acc, g) => acc + g.items.length, 0);
    expect(total).toBe(users.length);
  });
});


describe('having', () => {
  it('оставляет группы по предикату', () => {
    const groups = groupBy('role')(users);
    const result = having((g) => g.items.length > 1)(groups);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every(g => g.items.length > 1)).toBe(true);
  });

  it('возвращает пустой массив если предикат false для всех', () => {
    const groups = groupBy('role')(users);
    const result = having(() => false)(groups);
    expect(result).toHaveLength(0);
  });
});


describe('query', () => {
  it('применяет шаги последовательно', () => {
    const result = query(
      where('role', 'user'),
      sort('age'),
    )(users);

    expect(result.every((u: User) => u.role === 'user')).toBe(true);
    const ages = result.map((u: User) => u.age);
    expect(ages).toEqual([...ages].sort((a, b) => a - b));
  });

  it('работает с groupBy + having в пайплайне', () => {
    const result = query(
      groupBy('age'),
      having((g) => g.key === 30),
    )(users);

    expect(result).toHaveLength(1);
    expect(result[0].key).toBe(30);
  });

  it('без шагов возвращает исходные данные', () => {
    const result = query()(users);
    expect(result).toEqual(users);
  });
});
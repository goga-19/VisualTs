export type Transform<T> = (data: T[]) => T[];


export type Where<T> = <K extends keyof T>(
  key: K,
  value: T[K]
) => Transform<T>;


export type Sort<T> = <K extends keyof T>(
  key: K
) => Transform<T>;


export type Group<T, K extends keyof T> = {
  key: T[K];
  items: T[];
};


export type GroupBy<T> = <K extends keyof T>(
  key: K
) => Transform<Group<T, K>>;


export type GroupTransform<T, K extends keyof T> = Transform<Group<T, K>>;

export type Having<T> = <K extends keyof T>(
  predicate: (group: Group<T, K>) => boolean
) => GroupTransform<T, K>;


export const where: Where<any> =
  (key, value) =>
  (data) =>
    data.filter((item) => item[key] === value);


export const sort: Sort<any> =
  (key) =>
  (data) =>
    [...data].sort((a, b) => {
      const av = a[key];
      const bv = b[key];

      if (av < bv) return -1;
      if (av > bv) return 1;
      return 0;
    });


export const groupBy: GroupBy<any> =
  (key) =>
  (data: any[]) => {  
    const map = data.reduce((acc, item) => {
      const k = item[key] as any;
      if (!acc[k]) {
        acc[k] = {
          key: item[key],
          items: [],
        };
      }
      acc[k].items.push(item);
      return acc;
    }, {} as Record<string, Group<any, any>>);
    return Object.values(map);
  };


export const having: Having<any> =
  (predicate) =>
  (groups) =>
    groups.filter(predicate);

type AnyTransform = Transform<any> | GroupTransform<any, any>;

export function query<T>(
  ...steps: AnyTransform[]
): Transform<any> {
  return (data: any[]) => {
    return steps.reduce((acc, step) => step(acc), data);
  };
}

export type DeepReadonly<T> = T extends (infer U)[]
  ? ReadonlyArray<DeepReadonly<U>>
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;


export type PickedByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

export type EventHandlers<T extends Record<string, unknown>> = {
  [K in keyof T & string as `on${Capitalize<K>}`]: (event: T[K]) => void;
};
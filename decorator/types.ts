export type ConvertToArrayParam<
    T extends any[],
    Index extends number
> = {
  [K in keyof T]: K extends `${Index}` ? Array<T[K]> | T[K] : T[K]
};

export type PromiseReturnType<F extends (...args: any[]) => any> = Awaited<ReturnType<F>>;
/**
 * Union:   number | string | undefined
 */
export type ExtractByCondition<Union, Condition> = Union extends Condition ? Union : never;

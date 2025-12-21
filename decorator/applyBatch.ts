import {ConvertToArrayParam, ExtractByCondition, PromiseReturnType} from "./types";

export function applyBatch<Index extends number>(dependentArgIdx?: Index) {
  return function<F extends (...args: any[]) => Promise<any>>(Fn: F,){
    type RawReturn = PromiseReturnType<F>;
    type TDB = ExtractByCondition<RawReturn, {}>;
    type BatchFnParams = ConvertToArrayParam<Parameters<F>, Index>;
    type BatchFnReturn = Promise<TDB[] | undefined>;

    type BatchMethodType = (
        this: ThisParameterType<F>,
        ...args: BatchFnParams
    ) => BatchFnReturn;

    return (async function (this: ThisParameterType<F>, ...args: BatchFnParams) {
      const paramIdx = (dependentArgIdx ?? 0) as number
      const param = args[paramIdx];
      try {
        if (param === null || param === undefined) {
          console.log(`[ERROR]: Argument[${paramIdx}] not found`);
          return
        }
        if (Array.isArray(param)) {
          const raw = await Promise.all(
              param.map(async (item: any, idx: number) =>
                  Fn.apply(this, args.map((arg, i) => i === paramIdx ? item : arg))
                      .catch((err: Error) => {
                        console.error(`Failed at ${idx}：`, err);
                        return
                      })
              )
          );
          return raw.filter(Boolean).flat(1) as TDB[];
        }
        const result = await Fn.apply(this, args);
        return result ? (Array.isArray(result) ? result : [result]) : undefined;
      } catch (e) {
        console.error("[ERROR]:", e);
        console.log(args);
        throw e;
      }
    }) as BatchMethodType;
}
}


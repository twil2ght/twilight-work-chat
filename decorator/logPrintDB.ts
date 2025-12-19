const DIVIDING_SIGN="-------------------------------------------------"

function printRowDB<TDB extends object = {}>(data: TDB): void {
  if (data === null || data === undefined || Object.keys(data).length === 0) return;

  const pairs: [string, TDB[keyof TDB]][] = Object.entries(data)
  const log: string = pairs.map(([key, value]) => `${key}: ${value}`).join(' | ');
  console.log(log);
  console.log(DIVIDING_SIGN);
}
export function LogPrintDB<TDB extends Record<string, any>>(enabled:boolean) {
  return function (target: any, methodName: string, descriptor: PropertyDescriptor): PropertyDescriptor | undefined {
    if(!enabled) return;
    const originalMethod = descriptor.value as (this:typeof target, ...args: any[]) => Promise<TDB | TDB[] | undefined>;
    descriptor.value = async function (...args: any[]): Promise<TDB | TDB[] | undefined> {
      console.log("!==========================================================!");
      try {
        const result = await originalMethod.apply(this, args);
        console.log(`[Method]: ${methodName}`);
        console.log(DIVIDING_SIGN);
        if (result === undefined || result === null) {
          console.log("[ERROR]: find nothing")
          return;
        }
        if (!Array.isArray(result)) {
          printRowDB<TDB>(result);
          return result;
        }
        if (result.length === 0) {
          console.log("[ERROR]: result is empty")
          return result;
        }
        result.forEach(e => printRowDB<TDB>(e));
        return result;
      } catch (e) {
        console.log(`[ERROR] [${methodName}]:`, e);
        console.log(DIVIDING_SIGN);
        throw e;
      }
    };
    return descriptor;
  }
}
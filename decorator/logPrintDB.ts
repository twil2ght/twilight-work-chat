const DIVIDING_SIGN = "-------------------------------------------------";

// 保留原有的行打印逻辑（核心功能不变）
function printRowDB<TDB extends object = {}>(data: TDB): void {
  if (data === null || data === undefined || Object.keys(data).length === 0) return;

  const pairs: [string, TDB[keyof TDB]][] = Object.entries(data);
  const log: string = pairs.map(([key, value]) => `${key}: ${value}`).join(' | ');
  console.log(log);
  console.log(DIVIDING_SIGN);
}

// 1. 提取通用的方法装饰逻辑（复用原有逻辑）
function decorateMethod<TDB extends Record<string, any>>(
    target: any,
    methodName: string,
    descriptor: PropertyDescriptor,
    enabled: boolean
) {
  if (!enabled) return descriptor;

  const originalMethod = descriptor.value as (this: typeof target, ...args: any[]) => Promise<TDB | TDB[] | undefined>;

  descriptor.value = async function (...args: any[]): Promise<TDB | TDB[] | undefined> {
    console.log("!==========================================================!");
    try {
      const result = await originalMethod.apply(this, args);
      console.log(`[Method]: ${methodName}`);
      console.log(DIVIDING_SIGN);

      if (result === undefined || result === null) {
        console.log("[ERROR]: find nothing");
        return result; // 修复：原代码return undefined，这里返回原result保持一致性
      }

      if (!Array.isArray(result)) {
        printRowDB<TDB>(result);
        return result;
      }

      if (result.length === 0) {
        console.log("[ERROR]: result is empty");
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

// 2. 类装饰器：批量装饰类的所有异步方法
export function LogPrintDBClass<TDB extends Record<string, any>>(enabled: boolean) {
  return function (constructor: Function) {
    // 遍历类的所有原型方法
    const proto = constructor.prototype;
    const methodNames = Object.getOwnPropertyNames(proto).filter(name => {
      // 过滤掉构造函数和非函数属性
      return name !== 'constructor' && typeof proto[name] === 'function';
    });

    // 对每个方法应用装饰逻辑
    methodNames.forEach(methodName => {
      const descriptor = Object.getOwnPropertyDescriptor(proto, methodName);
      if (descriptor) {
        // 应用装饰器并重新定义方法
        const newDescriptor = decorateMethod<TDB>(proto, methodName, descriptor, enabled);
        Object.defineProperty(proto, methodName, newDescriptor);
      }
    });
  };
}

// 3. 保留原有的方法装饰器（兼容旧用法）
export function LogPrintDB<TDB extends Record<string, any>>(enabled: boolean) {
  return function (target: any, methodName: string, descriptor: PropertyDescriptor): PropertyDescriptor | undefined {
    return decorateMethod<TDB>(target, methodName, descriptor, enabled);
  };
}
/**
 * Debug 装饰器工厂
 * @param enabled 是否开启调试
 */
export function debug(enabled: boolean) {
  return function (
      target: any,
      methodName: string,
      descriptor: PropertyDescriptor
  ) {
    if (!enabled) return;

    const originalMethod = descriptor.value;

    if (typeof originalMethod !== 'function') {
      console.warn(`@debug 装饰器只能用于方法，${String(methodName)} 不是函数`);
      return;
    }

    descriptor.value = function (this: any, ...args: any[]) {
      const className = this?.constructor?.name || target?.constructor?.name || 'UnknownClass';

      console.log(`[Method]: ${methodName}`);

      try {
        return originalMethod.apply(this, args);
      } catch (error) {
        console.error(`[${className}.${methodName}] 执行出错:`, error);
        throw error;
      }
    };

    return descriptor;
  };
}
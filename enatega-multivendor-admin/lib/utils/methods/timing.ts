// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

export const debounce = <F extends AnyFunction>(fn: F, wait: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>) =>
    new Promise<Awaited<ReturnType<F>>>((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(async () => {
        timeoutId = null;

        try {
          resolve(await fn(...args));
        } catch (error) {
          reject(error);
        }
      }, wait);
    });
};

export const throttle = <F extends AnyFunction>(fn: F, wait: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastRun = 0;
  let trailingArgs: Parameters<F> | null = null;

  return (...args: Parameters<F>) => {
    const now = Date.now();
    const remaining = wait - (now - lastRun);

    trailingArgs = args;

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      lastRun = now;
      fn(...args);
      return;
    }

    if (timeoutId) {
      return;
    }

    timeoutId = setTimeout(() => {
      timeoutId = null;
      lastRun = Date.now();

      if (trailingArgs) {
        fn(...trailingArgs);
      }
    }, remaining);
  };
};

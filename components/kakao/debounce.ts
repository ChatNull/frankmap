export function debounce<T extends (...args: any[]) => void>(callback: T, limit = 500): T {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback.apply(this, args), limit);
  } as T;
}

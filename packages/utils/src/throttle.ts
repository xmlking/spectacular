export const debounce = (func: (...args: any) => void, timeout = 300) => {
  let timer: ReturnType<typeof setTimeout> | undefined = undefined;
  return (...args: any) => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

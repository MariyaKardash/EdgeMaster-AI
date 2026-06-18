export function log(message?: any, ...optionalParams: any[]) {
  if (__DEV__) {
    console.log(message, ...optionalParams);
  }
}

export function logDev(message?: any, ...optionalParams: any[]) {
  log('__DEV__', message, optionalParams);
}

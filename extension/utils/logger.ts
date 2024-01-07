// This is temporary
const enableLogger = true;
const enableLoggingData = false;

export const createLogger = (name: string) => {
  return (message: string, data: any) => {
    if (enableLogger && enableLoggingData) {
      console.log(`[${name}]AIE ${message} time:${Date.now()}`, data);

      return;
    }
    if (enableLogger) {
      console.log(`[${name}]AIE ${message} time:${Date.now()}`);
      return;
    }
  };
};

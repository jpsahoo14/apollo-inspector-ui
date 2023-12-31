// This is temporary
const enableLogger = true;
export const createLogger = (name: string) => {
  return (message: string, data: any) => {
    enableLogger && console.log(`[${name}AIE] ${message}`, data);
  };
};

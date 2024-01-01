// This is temporary
const enableLogger = false;
export const createLogger = (name: string) => {
  return (message: string, data: any) => {
    enableLogger && console.log(`[${name}]AIE ${message}`, data);
  };
};

export const generateRequestId = (name: string) => {
  return `${name}:${Date.now()}`;
};

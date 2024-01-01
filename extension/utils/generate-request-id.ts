export const generateRequestInfo = (
  name: string
): {
  requestId: string;
  sender: string;
} => {
  return {
    requestId: `${name}:${Date.now()}`,
    sender: `${name}`,
  };
};

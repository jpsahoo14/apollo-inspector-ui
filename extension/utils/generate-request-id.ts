export const generateRequestInfo = (
  name: string,
  action: string
): {
  requestId: string;
  sender: string;
} => {
  return {
    requestId: `${name}:${action}:${Date.now()}`,
    sender: `${name}`,
  };
};

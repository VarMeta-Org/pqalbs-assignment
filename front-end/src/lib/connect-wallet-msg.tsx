export const getEvmMessage = ({ code, message }: { code: number; message: string; data?: { location?: string } }) => {
  if (code === 4001 || code === -32003) {
    return 'Wallet connection denied. Please approve the connection request in your wallet';
  }

  if (message) {
    return message;
  }

  return 'Unable to connect wallet. Please try again';
};

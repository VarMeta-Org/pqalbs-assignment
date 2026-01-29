import { toast } from 'sonner';

export const handleToastError = (error: any, defaultError = 'Something went wrong') => {
  // console.error(error);
  toast.error(error?.reason || error?.shortMessage || error?.message || defaultError);
};

export function shortenString(str?: string, length = 10) {
  if (!str) return '';
  if (str?.length <= length) return str;
  return `${str.substring(0, length)}...${str.substring(str.length - length)}`;
}

export const formatAddress = (addr: string, length = 6) => {
  if (!addr) return '';
  return `${addr.slice(0, length)}...${addr.slice(-length)}`;
};

export const parseContractError = (error: any): string | null => {
  if (!error) return null;

  // Ethers error processing or generic
  if (error.reason) return error.reason;
  if (error.shortMessage) return error.shortMessage;

  // If no short message, try to extract from the details
  const match = error.message?.match(/execution reverted: (.+)/);
  if (match && match[1]) return match[1];

  // If still no message, try message
  return error.message;
};

export const formatCurrency = (value: number | string, currency = 'ETH', decimals = 4) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0 ' + currency;

  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });

  return `${formatted} ${currency}`;
};

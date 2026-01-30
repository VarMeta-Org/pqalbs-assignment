import BN from "bn.js";

export const ZERO_BN = new BN(0);

// Helper to safely convert various types to BN
export const toBN = (value: string | number | bigint | BN): BN => {
	if (BN.isBN(value)) return value;
	if (typeof value === "bigint") return new BN(value.toString());
	return new BN(value);
};

export function shortenString(str?: string, length = 10) {
	if (!str) return "";
	if (str?.length <= length) return str;
	return `${str.substring(0, length)}...${str.substring(str.length - length)}`;
}

export const formatAddress = (addr: string, length = 6) => {
	if (!addr) return "";
	return `${addr.slice(0, length)}...${addr.slice(-length)}`;
};

export const formatBN = (
	bn: BN | undefined | null,
	decimals = 18,
	displayDecimals = 4,
): string => {
	if (!bn) return "0";

	const divisor = new BN(10).pow(new BN(decimals));
	const integerPart = bn.div(divisor).toString();

	let fractionalPart = bn.mod(divisor).toString();
	// Pad left with zeros to ensure correct length
	while (fractionalPart.length < decimals) {
		fractionalPart = "0" + fractionalPart;
	}

	// Truncate to desired display decimals
	fractionalPart = fractionalPart.substring(0, displayDecimals);

	// Remove trailing zeros
	fractionalPart = fractionalPart.replace(/0+$/, "");

	if (fractionalPart.length > 0) {
		return `${integerPart}.${fractionalPart}`;
	}
	return integerPart;
};

export const parseContractError = (error: any): string | null => {
	if (!error) return null;

	// 1. Handle "User Rejected" explicitly
	if (
		error.code === 4001 ||
		error.code === "ACTION_REJECTED" ||
		error?.info?.error?.code === 4001 ||
		error.message?.includes("user rejected") ||
		error.message?.includes("User denied")
	) {
		return "Transaction rejected by user";
	}

	// 2. Recursive check for 'reason' or 'shortMessage' (Ethers v6 often puts it here)
	if (error.reason) return error.reason;
	if (error.shortMessage) return error.shortMessage;

	// 3. Handle nested "data" objects often seen in JSON-RPC errors or Metamask
	// structure: error.data.message or error.info.error.data.message
	const findMessage = (obj: any): string | null => {
		if (!obj) return null;
		if (obj.message && typeof obj.message === "string") return obj.message;
		if (obj.data) return findMessage(obj.data);
		if (obj.error) return findMessage(obj.error);
		if (obj.cause) return findMessage(obj.cause); // often in viem or recent ethers
		return null;
	};

	const deepMessage = findMessage(error);
	if (deepMessage) {
		// Clean up common prefixes
		const match = deepMessage.match(
			/(?:execution reverted: |VM Exception while processing transaction: )(.+)/,
		);
		if (match && match[1]) return match[1];
		return deepMessage;
	}

	// 4. Fallback to top-level message if it's not too long/JSON-like
	if (error.message && typeof error.message === "string") {
		// If it looks like a huge JSON dump, avoid showing it.
		if (error.message.length > 200 || error.message.includes("{")) {
			return "Transaction failed. Check console for details.";
		}
		return error.message;
	}

	return "Unknown error occurred";
};

export const formatCurrency = (
	value: number | string,
	currency = "ETH",
	decimals = 4,
) => {
	const num = typeof value === "string" ? parseFloat(value) : value;
	if (isNaN(num)) return "0 " + currency;

	const formatted = num.toLocaleString("en-US", {
		minimumFractionDigits: 0,
		maximumFractionDigits: decimals,
	});

	return `${formatted} ${currency}`;
};

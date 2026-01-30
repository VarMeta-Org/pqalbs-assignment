"use client";

import {
	BrowserProvider,
	type Eip1193Provider,
	type JsonRpcSigner,
} from "ethers";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { toast } from "sonner";
import { EVM_CHAINS, TARGET_CHAIN } from "@/lib/const";
import { BMSDK } from "@/lib/metamask-sdk";
import { parseContractError } from "@/utils/common";

interface EthereumEvents {
	connect: (info: { chainId: string }) => void;
	disconnect: (error: { code: number; message: string }) => void;
	accountsChanged: (accounts: string[]) => void;
	chainChanged: (chainId: string) => void;
	message: (message: { type: string; data: unknown }) => void;
}

// Add type definition for window.ethereum
declare global {
	interface Window {
		ethereum?: Eip1193Provider & {
			on: <K extends keyof EthereumEvents>(
				event: K,
				listener: EthereumEvents[K],
			) => void;
			removeListener: <K extends keyof EthereumEvents>(
				event: K,
				listener: EthereumEvents[K],
			) => void;
			request: (args: { method: string; params?: unknown[] }) => Promise<any>;
			isMetaMask?: boolean;
		};
	}
}

interface WalletContextType {
	address: string | null;
	chainId: number | null;
	isConnected: boolean;
	provider: BrowserProvider | null;
	signer: JsonRpcSigner | null;
	connect: () => Promise<string | undefined>;
	disconnect: () => void;
	switchNetwork: (targetChainId: number) => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
	address: null,
	chainId: null,
	isConnected: false,
	provider: null,
	signer: null,
	connect: async () => undefined,
	disconnect: () => {},
	switchNetwork: async () => {},
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
	const [address, setAddress] = useState<string | null>(null);
	const [chainId, setChainId] = useState<number | null>(null);
	const [provider, setProvider] = useState<BrowserProvider | null>(null);
	const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	// Constants
	const WALLET_CONNECTED_KEY = "result_wallet_connected";

	const disconnect = () => {
		setAddress(null);
		setSigner(null);
		setChainId(null);
		setIsConnected(false);
		localStorage.removeItem(WALLET_CONNECTED_KEY);
	};

	// Handle events
	useEffect(() => {
		const ethereum = BMSDK.getProvider();

		if (ethereum) {
			const handleAccountsChanged = async (accounts: any) => {
				if (accounts.length === 0) {
					disconnect();
				} else if (provider) {
					const _signer = await provider.getSigner();
					const _address = await _signer.getAddress();
					setAddress(_address);
					setSigner(_signer);
					setIsConnected(true);
					localStorage.setItem(WALLET_CONNECTED_KEY, "true");
				}
			};

			const handleChainChanged = (_chainId: any) => {
				// window.location.reload(); // Recommended by MetaMask to reload on chain change
				// Or handle state update strictly:
				setChainId(parseInt(_chainId, 16));
				window.location.reload();
			};

			ethereum.on("accountsChanged", handleAccountsChanged);
			ethereum.on("chainChanged", handleChainChanged);

			return () => {
				ethereum.removeListener("accountsChanged", handleAccountsChanged);
				ethereum.removeListener("chainChanged", handleChainChanged);
			};
		}
	}, [provider]);

	// Auto connect logic
	useEffect(() => {
		const checkConnection = async () => {
			const shouldConnect =
				localStorage.getItem(WALLET_CONNECTED_KEY) === "true";
			if (!shouldConnect) return;

			// Add a small delay to ensure provider is ready if needed, mostly for SDK
			// or just try immediately.
			const ethereum = BMSDK.getProvider();
			if (ethereum) {
				try {
					// eth_accounts returns an array that is either empty or contains the accounts.
					// It does not trigger the popup.
					const accounts = await ethereum.request({
						method: "eth_accounts",
					});

					if (
						accounts &&
						Array.isArray(accounts) &&
						(accounts as string[]).length > 0
					) {
						// We have permission, reconstruct the state
						const _provider = new BrowserProvider(ethereum);
						setProvider(_provider);
						const _signer = await _provider.getSigner();
						const _address = await _signer.getAddress();
						const _network = await _provider.getNetwork();

						setAddress(_address);
						setSigner(_signer);
						setChainId(Number(_network.chainId));
						setIsConnected(true);
					} else {
						// user might have disconnected via wallet UI but we still have the local storage
						// debatable if we should clear it or leave it. Usually clean it.
						localStorage.removeItem(WALLET_CONNECTED_KEY);
					}
				} catch (err) {
					console.error("Auto connnect failed", err);
					localStorage.removeItem(WALLET_CONNECTED_KEY);
				}
			}
		};

		checkConnection();
	}, []);

	const switchNetwork = async (targetChainId: number) => {
		if (!provider) return;
		// We can use the provider stored in state which wraps the sdk provider

		const chainConfig = EVM_CHAINS.find((c) => c.id === targetChainId);
		if (!chainConfig) {
			toast.error("Unsupported network");
			return;
		}

		const hexChainId = `0x${targetChainId.toString(16)}`;

		try {
			await provider.send("wallet_switchEthereumChain", [
				{ chainId: hexChainId },
			]);
		} catch (switchError: any) {
			// 4902 indicates the chain has not been added to MetaMask
			if (
				switchError.code === 4902 ||
				switchError?.data?.originalError?.code === 4902 ||
				switchError.message?.includes("Unrecognized chain ID")
			) {
				try {
					await provider.send("wallet_addEthereumChain", [
						{
							chainId: hexChainId,
							chainName: chainConfig.name,
							nativeCurrency: chainConfig.nativeCurrency,
							rpcUrls: chainConfig.rpcUrls.default.http,
							blockExplorerUrls: chainConfig.blockExplorers
								? [chainConfig.blockExplorers.default.url]
								: [],
						},
					]);
				} catch (addError: any) {
					toast.error(parseContractError(addError) || "Failed to add network");
				}
			} else {
				toast.error(
					parseContractError(switchError) || "Failed to switch network",
				);
			}
		}
	};

	const connect = async (): Promise<string | undefined> => {
		if (!BMSDK) {
			toast.error("Wallet SDK not initialized");
			return undefined;
		}

		try {
			const ethereum = BMSDK.getProvider();
			if (!ethereum) {
				toast.error("MetaMask provider not found");
				return undefined;
			}

			// This allows users to re-select their account on each connect
			await ethereum.request({
				method: "wallet_requestPermissions",
				params: [{ eth_accounts: {} }],
			});

			// Update state using ethers
			const _provider = new BrowserProvider(ethereum);
			setProvider(_provider); // Ensure provider is consistent

			const _signer = await _provider.getSigner();
			const _address = await _signer.getAddress();
			const _network = await _provider.getNetwork();

			setAddress(_address);
			setSigner(_signer);
			setChainId(Number(_network.chainId));
			setIsConnected(true);
			localStorage.setItem(WALLET_CONNECTED_KEY, "true");

			// Auto switch to Target network (inline to avoid race condition with provider state)
			if (Number(_network.chainId) !== TARGET_CHAIN.id) {
				const chainConfig = EVM_CHAINS.find((c) => c.id === TARGET_CHAIN.id);
				const hexChainId = `0x${TARGET_CHAIN.id.toString(16)}`;

				try {
					await _provider.send("wallet_switchEthereumChain", [
						{ chainId: hexChainId },
					]);
				} catch (switchError: any) {
					// 4902 indicates the chain has not been added to MetaMask
					if (
						switchError.code === 4902 ||
						switchError?.data?.originalError?.code === 4902 ||
						switchError.message?.includes("Unrecognized chain ID")
					) {
						if (chainConfig) {
							try {
								await _provider.send("wallet_addEthereumChain", [
									{
										chainId: hexChainId,
										chainName: chainConfig.name,
										nativeCurrency: chainConfig.nativeCurrency,
										rpcUrls: chainConfig.rpcUrls.default.http,
										blockExplorerUrls: chainConfig.blockExplorers
											? [chainConfig.blockExplorers.default.url]
											: [],
									},
								]);
							} catch (addError: any) {
								toast.error(
									parseContractError(addError) || "Failed to add network",
								);
							}
						}
					} else {
						toast.error(
							parseContractError(switchError) || "Failed to switch network",
						);
					}
				}
			}

			return _address;
		} catch (error: any) {
			console.error("Connection error:", error);
			toast.error(parseContractError(error) || "Failed to connect wallet");
			return undefined;
		}
	};

	const value = useMemo(
		() => ({
			address,
			chainId,
			isConnected,
			provider,
			signer,
			connect,
			disconnect,
			switchNetwork,
		}),
		[address, chainId, isConnected, provider, signer],
	);

	return (
		<WalletContext.Provider value={value}>{children}</WalletContext.Provider>
	);
};

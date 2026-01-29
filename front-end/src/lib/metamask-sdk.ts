import MetaMaskSDK from "@metamask/sdk";
import { env } from "./const";

export const BMSDK = new MetaMaskSDK({
	dappMetadata: {
		name: "Varmeta Assignment",
		url: env.APP_URL,
	},
	checkInstallationImmediately: false,
});

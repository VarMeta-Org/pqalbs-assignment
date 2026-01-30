import { appConfig } from ".";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	appUrl: appConfig.appUrl,
	name: "Assignment SC",
	metaTitle: "Assignment SC",
	description: "Assignment SC",
	ogImage: `${appConfig.appUrl}/og-image.jpg`,
};

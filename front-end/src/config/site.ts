import { appConfig } from '.';

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  appUrl: appConfig.appUrl,
  name: 'ArchDAO',
  metaTitle: 'ArchDAO',
  description: 'ArchDAO',
  ogImage: `${appConfig.appUrl}/og-image.jpg`,
};

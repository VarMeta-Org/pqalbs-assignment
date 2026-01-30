import type { FC, PropsWithChildren } from "react";

declare global {
	// eslint-disable-next-line no-unused-vars
	interface Window {}
}

export type FCC<P = {}> = FC<PropsWithChildren<P>>;

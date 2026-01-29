import { ArrowLeft, ArrowRight, Check, ChevronDown, Loader2, Minus, Plus, Search, X } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';
import baseSm from './svg/base-sm.svg';
import checkedCircleFilled from './svg/checked-circle-filled.svg';
import coinbaseWallet from './svg/coinbase-wallet.svg';
import ethereumSm from './svg/ethereum-sm.svg';
import filledSquareArrowOutUpRight from './svg/filled-square-arrow-out-up-right.svg';
import folderFilled from './svg/folder-filled.svg';
import github from './svg/github.svg';
import hourglassFilled from './svg/hourglass-filled.svg';
import metamask from './svg/metamask.svg';
import walletConnect from './svg/wallet_connect.svg';
import xCircleFilled from './svg/x-circle-filled.svg';

const IconList = {
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  chevronDown: ChevronDown,
  x: X,
  minus: Minus,
  plus: Plus,
  spinner: Loader2,
  check: Check,
  search: Search,
  github,
  baseSm,
  ethereumSm,
  walletConnect,
  metamask,
  hourglassFilled,
  folderFilled,
  checkedCircleFilled,
  xCircleFilled,
  coinbaseWallet,
  filledSquareArrowOutUpRight,
};

type SVGAttributes = Partial<SVGProps<SVGSVGElement>>;
type ComponentAttributes = RefAttributes<SVGSVGElement> & SVGAttributes;
interface IconProps extends ComponentAttributes {
  size?: string | number;
  absoluteStrokeWidth?: boolean;
  width?: number;
  height?: number;
}

export type Icon = ForwardRefExoticComponent<IconProps>;

export const Icons = IconList as Record<keyof typeof IconList, Icon>;

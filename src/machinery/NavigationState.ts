import type { WalletResult } from './wallet';

export type MenuSelector =
  | 'splash'
  | 'accounts'
  | 'account'
  | 'setup'
  | 'menu'
  | 'about'
  | 'unlock'
  | 'onboard'
  | 'import';
export type AccountAction =
  | 'menu'
  | 'send'
  | 'transactions'
  | 'transaction'
  | 'receive'
  | 'send_qr'
  | 'send_address'
  | 'send_mobile_number'
  | 'settings'
  | 'donate';

export type OnboardView =
  | 'start'
  | 'intro'
  | 'disclaimer'
  | 'create-or-import'
  | 'seed'
  | 'account'
  | 'pin'
  | 'disclaimer-import'
  | 'keyboard-change'
  | 'input-import'
  | 'license';

export type SetupAction = 'menu' | 'export-seed';

export interface OnboardState {
  view: OnboardView;
  walletResult?: WalletResult;
  alias?: string;
  attemptedSeedImport?: string;
}

export interface NavigationState {
  menu: MenuSelector;
  accountAction: AccountAction;
  onboardState?: OnboardState;
  setupAction?: SetupAction;
}

export const START_STATE: NavigationState = {
  menu: 'splash',
  accountAction: undefined,
  onboardState: undefined,
  setupAction: undefined,
};

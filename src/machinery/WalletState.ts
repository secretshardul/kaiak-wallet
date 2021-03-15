import type {
  NanoAccount,
  NanoAddress,
  NanoTransaction,
  NanoWallet,
} from './models';
import { loadAndResolveAccountData, updateAccountInWallet } from './nano-ops';
import { getHistory } from './nano-rpc-fetch-wrapper';
import { pushToast } from './eventListener';
import { writable, Writable } from 'svelte/store';

export interface WalletState {
  wallet?: NanoWallet;
  transactions?: NanoTransaction[];
  account?: NanoAccount;
  transaction?: NanoTransaction;
  sendToAddress?: NanoAddress;
  mobileNumber?: string;
  mobileNumberToVerify?: string;
}

export function setWalletState(walletState: WalletState) {
  walletStore.set(walletState);
}

export async function updateWalletState(
  nanoAccount: NanoAccount,
  wallet: NanoWallet,
  sendToAddress?: NanoAddress,
  mobileNumber?: string
): Promise<void> {
  const {
    account: updatedAccount,
    resolvedCount,
    error,
  } = await loadAndResolveAccountData(nanoAccount, 0);
  const resolvedTransactions = await getHistory(nanoAccount.address);
  if (resolvedCount > 0) {
    pushToast({ languageId: 'got-new-transactions', type: 'success' });
  } else if (error) {
    pushToast({ languageId: error, type: 'warn' });
  }
  setWalletState({
    wallet: updateAccountInWallet(updatedAccount, wallet),
    account: updatedAccount,
    transactions: resolvedTransactions,
    sendToAddress: sendToAddress,
    mobileNumber,
  });
}

/** Handles updates of wallet */
export const walletStore: Writable<WalletState> = writable({
  wallet: undefined,
  transactions: undefined,
  mobileNumber: undefined,
  mobileNumberToVerify: undefined,
});

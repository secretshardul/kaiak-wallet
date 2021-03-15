import type { NanoWallet } from './models';
import { Store, _idb } from 'secure-webstore/dist/secure-webstore';
import { WalletData, walletDataToWallet } from './wallet';

const APP_STORE = 'kaios_nano';
const WALLET_KEY = 'wallet';
const MOBILE_NUMBER_KEY = 'mobile_number';
let securePhase: string;

function walletToWalletData(wallet: NanoWallet): WalletData {
  return {
    seed: wallet.seed,
    aliases: wallet.accounts.map((account) => account.alias),
  };
}

export async function setWallet(
  wallet: NanoWallet
): Promise<NanoWallet | undefined> {
  try {
    const store: Store = new Store(APP_STORE, wallet.encryptionSecret);
    await store.init();
    await store.set(WALLET_KEY, walletToWalletData(wallet));
    console.log('Read wallet data', wallet);
    return wallet;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export async function setMobileNumber(
  mobileNumber: string,
  // encryptionSecret: string
) {
  console.log('Secure phase when setting number', securePhase);
  const store = new Store(APP_STORE, securePhase);
  await store.init()
  await store.set(MOBILE_NUMBER_KEY, mobileNumber);
}

export async function getMobileNumber(
  encryptionSecret: string
) {
  const store = new Store(APP_STORE, encryptionSecret);
  await store.init();
  try {
    const mobileNumber = await store.get(MOBILE_NUMBER_KEY);
    securePhase = encryptionSecret;
    return mobileNumber;
  } catch(e) {
    return undefined;
  }
}

export async function deleteStore() {
  const store = new _idb.Store(APP_STORE, APP_STORE);
  await _idb.clear(store);
}

export async function walletExists() {
  const store = new _idb.Store(APP_STORE, APP_STORE);
  const keys = await _idb.keys(store);
  return keys.length > 0;
}

export async function unlockWallet(
  encryptionSecret: string
): Promise<NanoWallet | undefined> {
  try {
    const store = new Store(APP_STORE, encryptionSecret);
    await store.init();
    const data: WalletData = await store.get(WALLET_KEY);
    console.log('Wallet data during unlock', data);
    if (data.seed && data.aliases) {
      return walletDataToWallet(data, encryptionSecret);
    } else {
      return undefined;
    }
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

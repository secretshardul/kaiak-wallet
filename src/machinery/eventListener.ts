import { toastStore } from '../stores/stores';
import { Navigation } from './navigation';
import type {
  AccountAction,
  MenuSelector,
  NavigationState,
  OnboardState,
  SetupAction,
} from './NavigationState';
import type { SoftwareKeysState } from './SoftwareKeysState';
import type { ToastState } from './ToastState';
import { setSoftwareKeys, softwareKeysStore } from './SoftwareKeysState';
import { NavigationStack } from './NavigationStack';
import { walletExists } from './secure-storage';

let navigation: Navigation = new Navigation([]);

let middleKey: (() => Promise<void>) | undefined = undefined;
let leftKey: (() => Promise<void>) | undefined = undefined;
let rightKey: (() => Promise<void>) | undefined = undefined;

let stack = new NavigationStack();

/** Asking for permissions blurs / focuses screen, we need to ignore on those events */
export function ignoreOnCameraBlur(): boolean {
  let current = stack.peek();
  return current !== undefined // any screen other than splash screen
  // return current?.menu === 'account' && current?.accountAction === 'send_qr';
}

export const loadStartScreen = async () => {
  const exists = await walletExists();
  if (exists) {
    pushMenu('unlock');
  } else {
    pushMenu('onboard');
  }
};

export const navigationReload = (value: SoftwareKeysState = undefined) => {
  const elements: Element[] = Array.from(
    document.getElementsByClassName('navigation')
  );
  document.removeEventListener('keydown', handleKeydown);
  navigation = new Navigation(elements);
  document.addEventListener('keydown', handleKeydown);
  navigation.focus();
  value ? setSoftwareKeys(value) : setSoftwareKeys({});
};

// TODO: Instead of subscribing, we could click DOM elements
softwareKeysStore.subscribe((value: SoftwareKeysState) => {
  leftKey =
    value.leftKey && value.leftKey.disabled !== true
      ? value.leftKey?.onClick
      : undefined;
  middleKey =
    value.middleKey && value.middleKey.disabled !== true
      ? value.middleKey?.onClick
      : undefined;
  rightKey =
    value.rightKey && value.rightKey.disabled !== true
      ? value.rightKey?.onClick
      : undefined;
});

export function reset(): void {
  stack = new NavigationStack();
}

export function back(): boolean {
  const current = stack.peek();
  if (current?.menu === 'unlock') return false;
  else if (current?.menu === 'onboard' && current.onboardState === undefined)
    return false;
  else return stack.pop() !== undefined;
}
export function pushMenu(menu: MenuSelector): void {
  stack.pushOn((current: NavigationState | undefined) => {
    return { ...current, menu, onboardState: undefined };
  });
}
export function pushAccountAction(action: AccountAction): void {
  stack.pushOn((current: NavigationState | undefined) => {
    return { ...current, menu: 'account', accountAction: action };
  });
}
export function pushOnboardState(updated: OnboardState): void {
  stack.pushOn((current: NavigationState | undefined) => {
    return { ...current, menu: 'onboard', onboardState: updated };
  });
}

export function pushSetupAction(action: SetupAction): void {
  stack.pushOn((current: NavigationState | undefined) => {
    return { ...current, menu: 'setup', setupAction: action };
  });
}

export function pushState(state: NavigationState): void {
  stack.push(state);
}

export function pushToast(state: ToastState): void {
  toastStore.set(state);
}

export function clickSelection(): void {
  navigation.selection().click();
}

export async function handleKeydown(e) {
  switch (e.key) {
    case 'ArrowUp':
      if (navigation.up()) {
        e.preventDefault();
      }
      break;
    case 'ArrowDown':
      if (navigation.down()) {
        e.preventDefault();
      }
      break;
    case 'ArrowRight':
      if (navigation.navigatesInInputField()) {
        break;
      } else if (navigation.selection()) {
        navigation.selection().click();
      }
      e.preventDefault();
      break;
    case 'ArrowLeft':
      if (navigation.navigatesInInputField()) {
        break;
      } else if (back()) {
        e.preventDefault();
      }
      break;
    case 'Backspace':
      if (navigation.preventBackspaceInInputField()) {
        break;
      } else if (back()) {
        e.preventDefault();
      }
      break;
    case 'Enter':
      if (navigation.isClickableElement()) {
        navigation.selection().click();
      } else if (middleKey) {
        await middleKey();
      }
      e.preventDefault();
      break;
    case 'SoftLeft':
      if (leftKey) {
        await leftKey();
        e.preventDefault();
      }
      break;
    case 'SoftRight':
      if (rightKey) {
        await rightKey();
        e.preventDefault();
      }
      break;
  }
}

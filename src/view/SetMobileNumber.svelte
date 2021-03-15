<script lang="ts">
    import phone from 'phone';
    import { onMount } from "svelte";
    import Content from "../components/Content.svelte";
    import {
        navigationReload, pushToast,
    } from "../machinery/eventListener";
    import NumberInput from "../components/input/NumberInput.svelte";
    import { verifyMobileNumber } from "../machinery/mobile-number-setup";
    import { setSoftwareKeys } from '../machinery/SoftwareKeysState';
    import type { WalletState } from '../machinery/WalletState';
    import { setWalletState } from '../machinery/WalletState';

    export let walletState: WalletState;

    let inputMobileNumber: string | undefined;

    async function sendOtp() {
        try {
            const verifyResponse = await verifyMobileNumber(inputMobileNumber);
            if (verifyResponse) {
                setWalletState({ ...walletState, mobileNumberToVerify: inputMobileNumber });
            } else {
                pushToast({languageId: 'otp-send-failed'});
            }
        } catch(e) {
            pushToast({languageId: 'otp-send-failed'});
        }
    }

    const softwareKeys = (disabledOtp: boolean) => {
        return {
                middleKey: {
                    languageId: 'send-otp',
                    onClick: sendOtp,
                    disabled: disabledOtp,
                },
            }
    }
    $: {
        const valid = phone(inputMobileNumber)[0] !== undefined;
        setSoftwareKeys(softwareKeys(!valid));
    }

    onMount(() => navigationReload(softwareKeys(true)))
</script>

<Content titleKey="set-mobile-number-text">
    <NumberInput languageId="mobile-number-label" placeholderLanguage="mobile-number-label" bind:value={inputMobileNumber}/>
</Content>

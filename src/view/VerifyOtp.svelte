<script lang="ts">
    import { onMount } from "svelte";
    import Content from "../components/Content.svelte";
    import {
        navigationReload, pushToast,
    } from "../machinery/eventListener";
    import type { WalletState } from '../machinery/WalletState';
    import { setWalletState } from "../machinery/WalletState";
    import { setMobileNumber } from "../machinery/secure-storage";
    import NumberInput from "../components/input/NumberInput.svelte";
    import { saveNumberAndAddress } from "../machinery/mobile-number-setup";

    export let walletState: WalletState;
    const {alias, publicKey} = walletState.wallet.accounts[0];

    let otp: string | undefined;

    async function verifyOtp() {
        try {
            // verify OTP
            const saveNumberResp = await saveNumberAndAddress(walletState.mobileNumberToVerify!, otp, publicKey);
            if(saveNumberResp) {
                // Save mobile number to secure store
                await setMobileNumber(walletState.mobileNumberToVerify);
                //  Update wallet state
                setWalletState({
                     ...walletState,
                     mobileNumber: walletState.mobileNumberToVerify,
                     mobileNumberToVerify: undefined,
                })
            } else {
                pushToast({languageId: 'otp-verification-failed'})
            }
        } catch(e) {
            pushToast({languageId: 'otp-verification-failed'});
        }
    }

    const softwareKeys = () => {
        return {
                middleKey: {
                    languageId: 'verify-otp',
                    onClick: verifyOtp,
                },
            }
    }

    onMount(() => navigationReload(softwareKeys()))
</script>

<Content titleKey="verify-otp-text" title="Number will be linked">
    <NumberInput languageId="otp-label" placeholderLanguage="otp-label" bind:value={otp}/>
    <br />
    <p> Account {alias}({publicKey}) will be linked with {walletState.mobileNumberToVerify}</p>
</Content>

<script lang="ts">
    import phone from 'phone';
    import { onMount } from "svelte";
    import Content from "../components/Content.svelte";
    import {
        navigationReload,
    } from "../machinery/eventListener";
    import NumberInput from "../components/input/NumberInput.svelte";
    import { verifyMobileNumber } from "../machinery/mobile-number-setup";
    import { setSoftwareKeys } from '../machinery/SoftwareKeysState';

    let inputMobileNumber: string | undefined;

    async function verifyOtp() {
        console.log('Got number', inputMobileNumber);
        try {
            await verifyMobileNumber(inputMobileNumber);
        } catch(e) {

        }
    }

    const softwareKeys = (disabledOtp: boolean) => {
        return {
                middleKey: {
                    languageId: 'verify-otp',
                    onClick: verifyOtp,
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

<Content titleKey="verify-otp-text">
    <NumberInput languageId="otp-label" placeholderLanguage="otp-label" bind:value={inputMobileNumber}/>
</Content>

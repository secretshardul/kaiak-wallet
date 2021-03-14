<script lang="ts">
    import { onMount } from "svelte";
    import Content from "../components/Content.svelte";
    import {
        navigationReload,
    } from "../machinery/eventListener";
    import NumberInput from "../components/input/NumberInput.svelte";

    let inputMobileNumber: string | undefined;

    async function sendOtp() {
        console.log('Got number', inputMobileNumber)
    }

    onMount(() => {
        navigationReload(
            {
                middleKey: {
                    languageId: 'send-otp',
                    onClick: sendOtp
                },
            }
        )
    })
</script>

<Content titleKey="set-mobile-number-text">
    <NumberInput languageId="mobile-number-label" placeholderLanguage="mobile-number-label" bind:value={inputMobileNumber}/>
</Content>

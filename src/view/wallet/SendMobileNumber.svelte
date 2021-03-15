<script lang="ts">
    import type {NanoAddress} from "../../machinery/models";
    import {navigationReload, pushAccountAction, pushToast} from "../../machinery/eventListener";
    import {load} from "../../machinery/loader-store";
    import {onMount} from "svelte";
    import {setWalletState, updateWalletState} from "../../machinery/WalletState";
    import NumberInput from "../../components/input/NumberInput.svelte";
    import TextArea from "../../components/input/TextArea.svelte";
    import {setSoftwareKeys} from "../../machinery/SoftwareKeysState";
    import phone from "phone";
    import { getAddress } from "../../machinery/mobile-number-setup";

    export let addressFoundCallback: (address: NanoAddress) => void;

    let toMobileNumber: string = ''

    async function getAddressFromNumber() {
        console.log('Callback', addressFoundCallback);
        console.log('Entered number', toMobileNumber);
        const address = await getAddress(toMobileNumber);
        addressFoundCallback(address);
    }

    const softwareKeys = (invalidNumber: boolean) => {
        return {
                middleKey: {
                    languageId: 'get-address',
                    onClick: getAddressFromNumber,
                    disabled: invalidNumber,
                },
            }
    }
    $: {
        const valid = phone(toMobileNumber)[0] !== undefined;
        setSoftwareKeys(softwareKeys(!valid));
    }

    onMount(() => navigationReload(softwareKeys(true)))

</script>
<NumberInput languageId="mobile-number-label" placeholderLanguage="mobile-number-label" bind:value={toMobileNumber}/>

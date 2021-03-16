<script lang="ts">
    import phone from "phone";
    import type {NanoAddress} from "../../machinery/models";
    import {navigationReload, pushToast} from "../../machinery/eventListener";
    import {onMount} from "svelte";
    import NumberInput from "../../components/input/NumberInput.svelte";
    import {setSoftwareKeys} from "../../machinery/SoftwareKeysState";
    import { getAddress } from "../../machinery/mobile-number-setup";

    export let addressFoundCallback: (address: NanoAddress) => void;

    let toMobileNumber: string = ''

    async function getAddressFromNumber() {
        try {
            const address = await getAddress(toMobileNumber);
            console.log('Address', address);
            if(address != null) {
                addressFoundCallback(address);
                pushToast({languageId: 'got-address-from-number', type: 'success'});
            } else {
                pushToast({languageId: 'get-address-fail'});
            }
        } catch(error) {
            pushToast({languageId: 'get-address-fail'})
        }

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

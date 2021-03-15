const BASE_URL = 'https://kaiak-mobile-number-backend.herokuapp.com';

export async function verifyMobileNumber(mobileNumber: string) {
    try {
        const verifyResponse = await fetch(BASE_URL + '/verify', {
            method: 'POST',
            body: new URLSearchParams({ mobileNumber }),
        })

        console.log('Verify status', verifyResponse.status)

        return verifyResponse.status === 200;
    } catch(error) {
        return false;
    }
}

export async function saveNumberAndAddress(
    mobileNumber: string, otp: string, nanoAddress: string
    ) {
        try {
            const saveResponse = await fetch(BASE_URL + '/save', {
                method: 'POST',
                body: new URLSearchParams({ mobileNumber, otp, nanoAddress }),
            })

            console.log('Save status', saveResponse.status)

            return saveResponse.status === 201;
        } catch(error) {
            return false;
        }
}

export async function getAddress(mobileNumber: string) {
    const resp = await fetch('https://rpc.testnet.near.org', {
        method: 'POST',
        headers: new Headers({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: "dontcare",
            method: "query",
            params: {
                request_type: "call_function",
                finality: "final",
                account_id: "dev-1615619158857-5968612",
                method_name: "getNanoAddress",
                args_base64: window.btoa(JSON.stringify({
                    mobileNumber
                }))
            }
        })
    })
    const body = await resp.json();
    const result = String.fromCharCode(...body.result.result);
    return result;
}
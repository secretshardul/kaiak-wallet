
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
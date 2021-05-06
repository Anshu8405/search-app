import { BASE_API, BASE_API_KEY } from '../instance';

export const getReq = (urlName) => {
    return fetch(`${BASE_API}${urlName}`, {
        method: "GET",
        headers: {
            "x-api-key": BASE_API_KEY,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        }
    }).then(res => res.json());
}
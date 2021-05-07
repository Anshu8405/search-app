export const getReq = (urlName) => {
    return fetch(`${process.env.REACT_APP_API_URL}${urlName}`, {
        method: "GET",
        headers: {
            "x-api-key": process.env.REACT_APP_API_KEY,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        }
    }).then(res => res.json());
}
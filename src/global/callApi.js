import React from 'react';
import config from './config';

const callApi = async (apiurl, data, method = '') => {


    let formBody = [];
    for (let property in data) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    //console.log('formbody - ',formBody );

    let settings = {};

    if (method == 'put') {
        settings = {
            method: 'PUT',
            headers: config.headers,
            body: formBody,
        };
    } else {
        settings = {
            method: 'POST',
            headers: config.headers,
            body: formBody,
        };
    }
   // console.log(settings)
    let url = config.authurl + apiurl;
  
    try {
        const fetchResponse = await fetch(url, settings);

        const response = await fetchResponse.json();
       
        return response;

    } catch {
        const response = false;
        return response;
    }
}

export default callApi;
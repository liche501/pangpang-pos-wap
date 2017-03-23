import axios from 'axios';
import { api_serverRoot } from '../common/apiRoot';
import { getRequestHeader } from '../common/request';

export default {
    searchSkus: (q, skipCount, maxResultCount) => {
        return new Promise((resolve, reject) => {
            const headers = getRequestHeader();
            axios.get(api_serverRoot() + `/catalog/skus?q=` + q + `&skipCount=` + skipCount + `&maxResultCount=` + maxResultCount, { "headers": headers })
                .then(function (response) {
                    // console.log(response.data);
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                    // reject(new Error('Could not load image at ' + url));
                });
        })
    }
}
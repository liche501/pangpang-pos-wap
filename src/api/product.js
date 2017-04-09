import axios from 'axios';
import { api_serverRoot } from '../common/apiRoot';
import { getRequestHeader } from '../common/request';

export default {
    searchContents: (q, skipCount, maxResultCount) => {
        return new Promise((resolve, reject) => {
            const headers = getRequestHeader();
            axios.get(api_serverRoot() + `/catalog/contents?q=` + q + `&skipCount=` + skipCount + `&maxResultCount=` + maxResultCount, { "headers": headers })
                .then(function (response) {
                    // console.log(response.data);
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                    // reject(new Error('Could not load image at ' + url));
                });
        })
    },
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
    },

    getContentById:(contentId) => {
        return new Promise((resolve, reject) => {
            const headers = getRequestHeader();
            axios.get(api_serverRoot() + `/catalog/contents/` + contentId, { "headers": headers })
                .then(function (response) {
                    // console.log(response.data);
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                });
        })
    }
}
import axios from 'axios';
import { api_serverRoot } from '../common/apiRoot';
import { getRequestHeader } from '../common/request';

export default {
    placeOrder: (order) => {
        // order => {"cartId": 7}
        return new Promise((resolve, reject) => {
            const headers = getRequestHeader();
            axios.post(api_serverRoot() + `/orders`, order, { "headers": headers })
                .then(function (response) {
                    // console.log(response.data);
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                });
        })
    },
    getAllOrders: (skipCount, maxResultCount) => {
        return new Promise((resolve, reject) => {
            const headers = getRequestHeader();
            axios.get(api_serverRoot() + `/orders?skipCount=` + skipCount + `&maxResultCount=` + maxResultCount, { "headers": headers })
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
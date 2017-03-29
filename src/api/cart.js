import axios from 'axios';
import 'whatwg-fetch'
import { api_serverRoot } from '../common/apiRoot';
import { getRequestHeader } from '../common/request';

export default {
    createCart: () => {
        return new Promise((resolve, reject) => {
            const headers = getRequestHeader();
            axios.post(api_serverRoot() + `/carts`, {}, { "headers": headers })
                .then(function (response) {
                    // console.log(response.data);
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                });
        })
    },
    getAllCart: () => {
        return new Promise((resolve, reject) => {
            const headers = getRequestHeader();
            axios.get(api_serverRoot() + `/carts`, { "headers": headers })
                .then(function (response) {
                    // console.log(response.data);
                    resolve(response.data)
                })
                .catch(function (error) {
                    reject(error);
                });
        })

    },
    getCartById: (id) => {
        return new Promise((resolve, reject) => {
            const headers = getRequestHeader();
            axios.get(api_serverRoot() + `/carts/` + id, { "headers": headers })
                .then(function (response) {
                    // console.log(response.data);
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                });
        })

    },
    removeCartById: (id ) => {
        return new Promise((resolve, reject) => {
            const headers = getRequestHeader();
            axios.delete(api_serverRoot() + `/carts/` + id, { "headers": headers })
                .then(function (response) {
                    // console.log(response.data);
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                });
        })
    },
    addItemsFromCart: (id, cartItem) => {
        // cartItem => {skuId:25,quantity:1}
        return new Promise((resolve, reject) => {

            const headers = getRequestHeader();
            axios.post(api_serverRoot() + `/carts/` + id + `/items`, cartItem, { "headers": headers })
                .then(function (response) {
                    // console.log(response.data);
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                });
        })
    },
    removeItemsFromCart: (id, cartItem) => {
        return new Promise((resolve, reject) => {
            const headers = getRequestHeader();
            fetch(api_serverRoot() + `/carts/` + id + `/items`, {
                method: "DELETE",
                body: JSON.stringify(cartItem),
                headers: headers,
            }).then(function (response) {
                // console.log(response)
                return response.json()
            }, function (error) {
                reject(error.message )
            }).then(function (json) {
                // console.log(json)
                resolve(json)
            })
        })
    },
    setCustomer: (id, customerInfo) => {
        // customerInfo => {"no":"111","mobile":"13591194223","brandCode":"ee"}
        return new Promise((resolve, reject) => {

            const headers = getRequestHeader();
            axios.post(api_serverRoot() + `/carts/` + id + `/customer`, customerInfo, { "headers": headers })
                .then(function (response) {
                    // console.log(response.data);
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                });
        })
    },
    setCoupon: (id, couponInfo) => {
        // couponInfo => {"no":"1111111"}
        return new Promise((resolve, reject) => {

            const headers = getRequestHeader();
            axios.post(api_serverRoot() + `/carts/` + id + `/coupon`, couponInfo, { "headers": headers })
                .then(function (response) {
                    // console.log(response.data);
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                });
        })
    },
    setPayment: (id, paymentInfo) => {
        // couponInfo => {"no":"1111111"}
        return new Promise((resolve, reject) => {

            const headers = getRequestHeader();
            axios.post(api_serverRoot() + `/carts/` + id + `/payment`, paymentInfo, { "headers": headers })
                .then(function (response) {
                    // console.log(response.data);
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                });
        })
    },
    setInfo: (id, info) => {
        // customerInfo => {} 任意json
        return new Promise((resolve, reject) => {

            const headers = getRequestHeader();
            axios.post(api_serverRoot() + `/carts/` + id + `/info`, info, { "headers": headers })
                .then(function (response) {
                    // console.log(response.data);
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                });
        })
    },
}
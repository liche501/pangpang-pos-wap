import axios from 'axios';
import { api_serverRoot } from '../common/apiRoot'
export default {
    login: (tenant, userName, password) => {
        // console.log(tenant, userName, password);
        let param = {
            tenant,
            userName,
            password
        }
        return new Promise((resolve, reject) => {
            axios.post(api_serverRoot() + `/account/login`, param)
                .then((response) => {
                    console.log(response.data);
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        })
    }
}
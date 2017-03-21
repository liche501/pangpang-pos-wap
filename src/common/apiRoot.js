export function api_serverRoot() {
    var serverRoot = "https://staging.p2shop.cn/jan-api/v1";
    if (process.env.REACT_APP_ENV === 'production') {
        serverRoot = "http://staging.p2shop.cn:54012/v1";
    }
    else if (process.env.REACT_APP_ENV === 'staging') {
        serverRoot = "https://staging.p2shop.cn/jan-api/v1";
    }
    return serverRoot;
}
export function api_serverRoot() {
    var serverRoot = "http://staging.p2shop.cn:54012/v1";
    if (process.env.REACT_APP_ENV === 'production') {
        serverRoot = "http://staging.p2shop.cn:54012/v1";
    }
    else if (process.env.REACT_APP_ENV === 'staging') {
        serverRoot = "http://staging.p2shop.cn:54012/v1";
    }
    return serverRoot;
}
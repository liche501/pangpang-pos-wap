import {getAccount} from './request';
export function getShop(brandCode){
    var account=getAccount();
    var result;
    account.shopInfos.forEach(function(shop){
        if(brandCode===shop.brandCode){
            result=shop.shopCode;
        }
    });
    return result;
}

export function brandCodeSpliter(shopInfos){
        if(!Array.isArray(shopInfos)){
            return undefined;
        }
        let brandCode="";
        shopInfos.map(function(v,i){
            brandCode+=v.brandCode+',';
        })
        return brandCode=brandCode.substring(0,brandCode.length-1);
}

export function shopCodeSpliter(shopInfos){
        if(!Array.isArray(shopInfos)){
            return undefined;
        }
        let shopCode="";
        shopInfos.map(function(v,i){
            shopCode+=v.shopCode+',';
        })
        return shopCode=shopCode.substring(0,shopCode.length-1);
}
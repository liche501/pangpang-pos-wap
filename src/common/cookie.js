export function setCookie(str){
    document.setCookie(str);
}
export function getCookie(key){
    var result;
    var strCookie=document.cookie;
    //将多cookie切割为多个名/值对
    var arrCookie=strCookie.split("; "); 
    for(var i=0;i<arrCookie.length;i++){
        var arr=arrCookie[i].split("=");
        if("userId"===arr[0]){
            result=arr[1];
            break;
        }
    }
    return result;
}
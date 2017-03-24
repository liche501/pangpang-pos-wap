export function arrayContains(arr, obj) {  
    var i = arr.length;  
    while (i--) {  
        if (arr[i] === obj) {  
            return true;  
        }  
    }  
    return false;  
}
export  function arrayUnique(arr)
{
	arr.sort();
	var re=[arr[0]];
	for(var i = 1; i < arr.length; i++)
	{
		if( arr[i] !== re[re.length-1])
		{
			re.push(arr[i]);
		}
	}
	return re;
}

export function stringTrim(str,is_global)
        {
            var result;
            result = str.replace(/(^\s+)|(\s+$)/g,"");
            if(is_global.toLowerCase()=="g")
            {
                result = result.replace(/\s/g,"");
             }
            return result;
}

// 获取URL参数
export function getQueryString(name) {
    var url = window.location.hash;
    url = "?" + url.split("?", 2)[1];
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = url.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
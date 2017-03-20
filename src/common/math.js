export function toDecimal2(x) {      
        var f = parseFloat(x);   //将字符串转换为浮点型      
        if (isNaN(f)) {       //isNaN() 函数用于检查其参数是否是非数字值。  
            return false;      
        }      
        f = Math.round(f*100)/100;      
        var s = f.toString();      
        var rs = s.indexOf('.');      
        if (rs < 0) {      
            rs = s.length;      
            s += '.';      
        }      
        while (s.length <= rs + 2) {      
            s += '0';      
        }      
        return s;      
    } 

export function newGuid()
{
    var guid = "";
    for (var i = 1; i <= 32; i++){
      var n = Math.floor(Math.random()*16.0).toString(16);
      guid +=   n;
      if((i===8)||(i===12)||(i===16)||(i===20))
        guid += "-";
    }
    return guid;    
}

export function pad(num, n) {  
  return Array(n-(''+num).length+1).join(0)+num;
} 

export function thousandBitSeparator(num) {
    return num && num
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
            return $1 + ",";
        });
}
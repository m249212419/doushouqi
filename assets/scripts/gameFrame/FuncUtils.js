
/**
 * 数组乱序
 */
if (!Array.prototype.shuffle) {
    Array.prototype.shuffle = function() {
        for(var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
        return this;
    }
}

/**
 * 生成指定范围内的随机整数
 */
if(!Math.random2){
    Math.random2 = function(min, max, exact) {
        if (arguments.length === 0) { 
            return Math.random(); 
          } else if (arguments.length === 1) { 
            max = min; 
            min = 0; 
          } 
          var range = min + (Math.random()*(max - min)); 
          return exact === void(0) ? Math.round(range) : range.toFixed(exact); 
    }
}

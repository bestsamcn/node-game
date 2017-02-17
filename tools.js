var PY = require('pinyin');
/**
 * @function getClientIp获取客户端ip，
 * @param {req}
 * @return 返回ip地址
 */
var _getClientIp = function (req) {
    var ipAddress;
    var forwardIpStr = req.headers['x-forwarded-for'];
    if (forwardIpStr) {
        var forwardIp = forwardIpStr.split(',');
        ipAddress = forwardIp[0];
    }
    if (!ipAddress) {
        ipAddress = req.connection.remoteAdress;
    }
    if (!ipAddress) {
        ipAddress = req.socket.remoteAdress;
    }
    if (!ipAddress) {
        if (req.connection.socket) {
            ipAddress = req.connection.socket.remoteAdress;
        }
        else if (req.headers['remote_addr']) {
            ipAddress = req.headers['remote_addr'];
        }
        else if (req.headers['client_ip']) {
            ipAddress = req.headers['client_ip'];
        }
        else {
            ipAddress = req.ip;
        }

    }
    return ipAddress;
};

/**
 *@function getPinyin 汉字转拼音
 *@param {Array} bufArr 拼音单体的二维拼音 
 *@param {Boolean} isAll 转换的类型，true是全拼，false是首字母，默认true
 *@return {String} 返回合体后的汉字拼音 
 *@example
 * getPinyin([['ha'],['ha']])=>haha
 */
 var _getPinyin = function(bufArr,isAll){
    var str = '';
    isAll = !!isAll;

    if(!bufArr.length) return str;
    str = isAll ? PY(bufArr, {style:PY.STYLE_NORMAL}).join('').toString() : PY(bufArr, {style:PY.STYLE_FIRST_LETTER}).join('').toString();
    
    return str;
 }

exports.getClientIp = _getClientIp;
exports.getPinyin = _getPinyin;

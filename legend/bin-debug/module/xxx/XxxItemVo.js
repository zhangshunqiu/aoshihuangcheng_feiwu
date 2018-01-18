var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Author: zhangshunqiu
 * Xxx模块ItemVo 2017/06/20.
 */
var XxxItemVo = (function () {
    function XxxItemVo() {
        this.wingR = {}; //说明要写
    }
    Object.defineProperty(XxxItemVo.prototype, "heroVo", {
        /**
         * 英雄Vo
         */
        get: function () {
            return this._heroVo;
        },
        /**
         * 英雄Vo
         */
        set: function (value) {
            this._heroVo = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 更新其他数据
     */
    XxxItemVo.prototype.updateOther = function (data) {
        //处理更新数据
    };
    /**
     *  获取其他数据
     */
    XxxItemVo.prototype.getOtherData = function (id) {
        //处理获取数据
        return this._heroVo;
    };
    return XxxItemVo;
}());
__reflect(XxxItemVo.prototype, "XxxItemVo");
//# sourceMappingURL=XxxItemVo.js.map
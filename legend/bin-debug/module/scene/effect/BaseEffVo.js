var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 效果VO基类 2017/10.
 */
var BaseEffVo = (function () {
    function BaseEffVo() {
        BaseEffVo.EFF_ID_ADD++;
        this.id = BaseEffVo.EFF_ID_ADD;
    }
    BaseEffVo.prototype.callBackFun = function () {
        if (this.backFun) {
            if (this.param) {
                this.backFun.call(this.thisObject, this.param);
            }
            else {
                this.backFun.call(this.thisObject);
            }
            this.thisObject = null;
            this.backFun = null;
        }
    };
    BaseEffVo.prototype.destroy = function () {
        if (this.backFun) {
            this.thisObject = null;
            this.backFun = null;
            if (this.param) {
                this.param = null;
            }
        }
        this.atkVo = null;
        this.targetVo = null;
    };
    BaseEffVo.EFF_ID_ADD = 1;
    return BaseEffVo;
}());
__reflect(BaseEffVo.prototype, "BaseEffVo");
//# sourceMappingURL=BaseEffVo.js.map
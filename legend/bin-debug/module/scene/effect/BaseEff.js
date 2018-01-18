var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 场景显示对象基类 2017/09/20.
 */
var BaseEff = (function (_super) {
    __extends(BaseEff, _super);
    function BaseEff(objectVo) {
        if (objectVo === void 0) { objectVo = null; }
        return _super.call(this) || this;
    }
    /**
    * 获取ID
    */
    BaseEff.prototype.getId = function () {
        return 0;
    };
    /**
     * 更新VO
     */
    BaseEff.prototype.updateVo = function (value) {
    };
    /**
     * 更新
     */
    BaseEff.prototype.update = function () {
        return true;
    };
    /**
     * 暂停
     */
    BaseEff.prototype.pause = function () {
    };
    /**
     * 恢复暂停
     */
    BaseEff.prototype.resume = function () {
    };
    /**
     * 销毁
     */
    BaseEff.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    return BaseEff;
}(AMovieClip));
__reflect(BaseEff.prototype, "BaseEff");
//# sourceMappingURL=BaseEff.js.map
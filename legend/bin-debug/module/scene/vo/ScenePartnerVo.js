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
 * Email： 21102585@qq.com  2017/6/20
 * 场景搭档的VO
 */
var ScenePartnerVo = (function (_super) {
    __extends(ScenePartnerVo, _super);
    function ScenePartnerVo() {
        var _this = _super.call(this) || this;
        _this.type = SceneObjectType.PARTNER;
        return _this;
    }
    /**
     * 清理
     */
    ScenePartnerVo.prototype.clear = function () {
        _super.prototype.clear.call(this);
    };
    return ScenePartnerVo;
}(ScenePlayerVo));
__reflect(ScenePartnerVo.prototype, "ScenePartnerVo");
//# sourceMappingURL=ScenePartnerVo.js.map
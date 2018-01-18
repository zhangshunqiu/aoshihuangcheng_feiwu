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
 * Created by yangsong on 15-1-23.
 * 引擎扩展类
 */
var EgretExpandUtils = (function (_super) {
    __extends(EgretExpandUtils, _super);
    /**
     * 构造函数
     */
    function EgretExpandUtils() {
        return _super.call(this) || this;
    }
    /**
     * 初始化函数
     */
    EgretExpandUtils.prototype.init = function () {
        AnchorUtil.init();
    };
    return EgretExpandUtils;
}(BaseClass));
__reflect(EgretExpandUtils.prototype, "EgretExpandUtils");
//# sourceMappingURL=EgretExpandUtils.js.map
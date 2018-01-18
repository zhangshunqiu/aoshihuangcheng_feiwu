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
var BtnTips = (function (_super) {
    __extends(BtnTips, _super);
    function BtnTips(tip, parent, xx, yy) {
        var _this = _super.call(this, 0, parent, xx, yy) || this;
        if (tip) {
            _this.show(tip);
        }
        else {
            _this.hide();
        }
        return _this;
    }
    return BtnTips;
}(BaseBtnTips));
__reflect(BtnTips.prototype, "BtnTips");
//# sourceMappingURL=BtnTips.js.map
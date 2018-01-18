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
var customui;
(function (customui) {
    // 通用全屏窗口类
    var CommonWin = (function (_super) {
        __extends(CommonWin, _super);
        function CommonWin(params) {
            var _this = _super.call(this) || this;
            _this.skinName = "CommonWinSkin";
            return _this;
        }
        CommonWin.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            egret.callLater(function () {
                _this.mask = new egret.Rectangle(0, 0, _this.width, _this.height);
            }, this);
        };
        return CommonWin;
    }(eui.Component));
    customui.CommonWin = CommonWin;
    __reflect(CommonWin.prototype, "customui.CommonWin");
})(customui || (customui = {}));
//# sourceMappingURL=CommonWin.js.map
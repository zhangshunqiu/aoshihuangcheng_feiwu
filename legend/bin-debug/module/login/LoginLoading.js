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
 * 登录加载中动画
 */
var LoginLoading = (function (_super) {
    __extends(LoginLoading, _super);
    function LoginLoading() {
        var _this = _super.call(this) || this;
        _this.graphics.beginFill(0x000000, 0.5);
        _this.graphics.drawRect(0, 0, App.stageWidth, App.stageHeight);
        _this.graphics.endFill();
        if (_this._loadingMc == null) {
            _this._loadingMc = new AMovieClip();
            _this.addChild(_this._loadingMc);
        }
        _this._loadingMc.playMCKey("effloading");
        _this._loadingMc.x = App.stageWidth / 2;
        _this._loadingMc.y = App.stageHeight / 2;
        return _this;
    }
    /**
     * 销毁
     */
    LoginLoading.prototype.destroy = function () {
        if (this._loadingMc) {
            this._loadingMc.destroy();
            if (this._loadingMc.parent) {
                this._loadingMc.parent.removeChild(this._loadingMc);
            }
            this._loadingMc = null;
        }
    };
    return LoginLoading;
}(egret.Sprite));
__reflect(LoginLoading.prototype, "LoginLoading");
//# sourceMappingURL=LoginLoading.js.map
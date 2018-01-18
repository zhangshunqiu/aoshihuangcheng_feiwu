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
var game;
(function (game) {
    var FortuneResultView = (function (_super) {
        __extends(FortuneResultView, _super);
        function FortuneResultView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            return _super.call(this, viewConf) || this;
        }
        FortuneResultView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.handlerCloseBtn, this);
        };
        FortuneResultView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this);
            this.lb_num.text = this.openData + "";
        };
        /**
         * 界面返回
         */
        FortuneResultView.prototype.handlerCloseBtn = function () {
            WinManager.getInstance().closePopWin(WinName.POP_FORTUNE_RESULT);
        };
        FortuneResultView.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        FortuneResultView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return FortuneResultView;
    }(BaseView));
    game.FortuneResultView = FortuneResultView;
    __reflect(FortuneResultView.prototype, "game.FortuneResultView");
})(game || (game = {}));
//# sourceMappingURL=FortuneResultView.js.map
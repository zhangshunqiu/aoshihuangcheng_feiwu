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
 * Author: lihe
 * Email： hersletter@qq.com
 * 每日必做UI界面逻辑 2017/06/20.
 */
var game;
(function (game) {
    var MustDoUnTakeView = (function (_super) {
        __extends(MustDoUnTakeView, _super);
        function MustDoUnTakeView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._mustdomodel = game.MustDoModel.getInstance();
            return _this;
        }
        MustDoUnTakeView.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            this.btn_opennow.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getUnTakeAchieve, this);
            this.bt_back.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.closeWin(null);
            }, this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.closeWin(null);
            }, this);
            if (this._btnTakeMc == null) {
                this._btnTakeMc = new AMovieClip();
                this._btnTakeMc.x = this.img_achieveframe.x + this.img_achieveframe.width / 2;
                this._btnTakeMc.y = this.img_achieveframe.y + this.img_achieveframe.height / 2;
                this._btnTakeMc.touchEnabled = false;
                this.addChild(this._btnTakeMc);
            }
            this._btnTakeMc.visible = false;
            //this
        };
        MustDoUnTakeView.prototype.getUnTakeAchieve = function () {
            this.closeWin(null);
            App.WinManager.openWin(WinName.MONTHCARD);
        };
        /**
                 * 打开窗口
                */
        MustDoUnTakeView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this.lb_untakevalue.textFlow = [{ text: this._mustdomodel.achieve_not_get + "", style: { textColor: 0x6ee902 } }, { text: "/" + 8000 }];
            // = this._mustdomodel.achieve_not_get+"/"+8000;
            var value = this._mustdomodel.achieve_not_get * 100 / 8000;
            this._btnTakeMc.visible = true;
            if (value >= 0 && value < 25)
                this._btnTakeMc.visible = false;
            if (value >= 25 && value < 50)
                this._btnTakeMc.playMCKey("effcjz01");
            if (value >= 50 && value < 75)
                this._btnTakeMc.playMCKey("effcjz02");
            if (value >= 75 && value < 25)
                this._btnTakeMc.playMCKey("effcjz03");
            if (value >= 100)
                this._btnTakeMc.playMCKey("effcjz04");
        };
        /**
         * 关闭窗口
         */
        MustDoUnTakeView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        MustDoUnTakeView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            if (this._btnTakeMc) {
                this._btnTakeMc.stop();
                this._btnTakeMc.destroy();
                this._btnTakeMc = null;
            }
        };
        /**
         * 销毁
         */
        MustDoUnTakeView.prototype.destroy = function () {
        };
        return MustDoUnTakeView;
    }(BaseView));
    game.MustDoUnTakeView = MustDoUnTakeView;
    __reflect(MustDoUnTakeView.prototype, "game.MustDoUnTakeView");
})(game || (game = {}));
//# sourceMappingURL=MustDoUnTakeView.js.map
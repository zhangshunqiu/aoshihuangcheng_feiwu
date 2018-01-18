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
 * 天梯争霸tips界面 2017/06/20.
 */
var game;
(function (game) {
    var CountDownView = (function (_super) {
        __extends(CountDownView, _super);
        function CountDownView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._count_timeId = 0;
            _this._total_sec = 120;
            return _this;
        }
        CountDownView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
        };
        CountDownView.prototype.onCountDown = function () {
            this.lb_time.text = GlobalUtil.getFormatBySecond1(this._total_sec);
            this._total_sec--;
            if (this._total_sec < 0) {
                if (this._count_timeId != 0) {
                    App.GlobalTimer.remove(this._count_timeId);
                    this._count_timeId = 0;
                }
                this.closeWin(null);
            }
        };
        /**
                 * 打开窗口
                */
        CountDownView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (openParam && openParam.sec) {
                this._total_sec = openParam.sec;
            }
            else {
                this._total_sec = 120;
            }
            if (this._count_timeId == 0) {
                this._count_timeId = App.GlobalTimer.addSchedule(1000, 0, this.onCountDown, this);
            }
            this.x = 220;
            this.y = 950;
        };
        /**
         * 关闭窗口
         */
        CountDownView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        CountDownView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._count_timeId != 0) {
                App.GlobalTimer.remove(this._count_timeId);
                this._count_timeId = 0;
            }
        };
        /**
         * 销毁
         */
        CountDownView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return CountDownView;
    }(BaseView));
    game.CountDownView = CountDownView;
    __reflect(CountDownView.prototype, "game.CountDownView");
})(game || (game = {}));
//# sourceMappingURL=CountDownView.js.map
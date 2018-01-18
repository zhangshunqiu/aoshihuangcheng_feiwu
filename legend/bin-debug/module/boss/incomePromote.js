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
    var incomePromote = (function (_super) {
        __extends(incomePromote, _super);
        function incomePromote(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._timerId = 0;
            _this._bossModel = game.BossModel.getInstance();
            return _this;
        }
        incomePromote.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.lb_lastExp.text = this._bossModel.lastIncomePromote.online_exp * 60 + '';
            this.lb_exp.text = this._bossModel.incomePromote.online_exp * 60 + '';
            this.lb_lastCoin.text = this._bossModel.lastIncomePromote.online_gold * 60 + '';
            this.lb_coin.text = this._bossModel.incomePromote.online_gold * 60 + '';
            this.lb_hour.text = Math.floor(this._bossModel.upLevelTime / 60) + "";
            this.lb_minute.text = this._bossModel.upLevelTime % 60 + '';
        };
        /**
         * 打开窗口
         */
        incomePromote.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (this._timerId == 0) {
                this._timerId = App.GlobalTimer.addSchedule(4000, 1, this.closeWin, this, function () { }, this);
            }
        };
        /**
         * 关闭窗口
         */
        incomePromote.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        /**
         * 清理
         */
        incomePromote.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
            if (this._timerId != 0) {
                App.GlobalTimer.remove(this._timerId);
                this._timerId = 0;
            }
        };
        /**
         * 销毁
         */
        incomePromote.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return incomePromote;
    }(BaseView));
    game.incomePromote = incomePromote;
    __reflect(incomePromote.prototype, "game.incomePromote");
})(game || (game = {}));
//# sourceMappingURL=incomePromote.js.map
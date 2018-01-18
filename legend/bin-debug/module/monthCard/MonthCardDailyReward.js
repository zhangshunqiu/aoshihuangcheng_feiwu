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
 * Author: liuyonggen
 * 月卡每日奖励弹窗 2017/11/24
 */
var game;
(function (game) {
    var MonthCardDailyReward = (function (_super) {
        __extends(MonthCardDailyReward, _super);
        function MonthCardDailyReward(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._monthCardModel = game.MonthCardModel.getInstance();
            _this._getRewardSuccessEventId = 0;
            return _this;
        }
        MonthCardDailyReward.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.re_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_getReward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getReward, this);
            this.updateView();
        };
        MonthCardDailyReward.prototype.updateView = function () {
            this.lb_day.text = this._monthCardModel.day + "";
        };
        MonthCardDailyReward.prototype.getReward = function () {
            App.Socket.send(25002, {});
        };
        MonthCardDailyReward.prototype.onGetReward = function () {
            this._monthCardModel.rewardNum--;
            this._monthCardModel.day++;
            if (this._monthCardModel.rewardNum == 0) {
                this.closeWin();
                App.BtnTipManager.setTypeValue(ConstBtnTipType.MOUTHCARD, false);
            }
            else {
                this.updateView();
            }
        };
        /**
         * 打开窗口
         */
        MonthCardDailyReward.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (this._getRewardSuccessEventId == 0) {
                this._getRewardSuccessEventId = App.EventSystem.addEventListener(PanelNotify.MONTHCARD_GET_SUCCESS, this.onGetReward, this);
            }
        };
        /**
         * 关闭窗口
         */
        MonthCardDailyReward.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        /**
         * 清理
         */
        MonthCardDailyReward.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._getRewardSuccessEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.MONTHCARD_GET_SUCCESS, this._getRewardSuccessEventId);
                this._getRewardSuccessEventId = 0;
            }
        };
        /**
         * 销毁
         */
        MonthCardDailyReward.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return MonthCardDailyReward;
    }(BaseView));
    game.MonthCardDailyReward = MonthCardDailyReward;
    __reflect(MonthCardDailyReward.prototype, "game.MonthCardDailyReward");
})(game || (game = {}));
//# sourceMappingURL=MonthCardDailyReward.js.map
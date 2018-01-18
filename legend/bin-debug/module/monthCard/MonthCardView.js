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
 * 月卡系统数据模型 2017/11/24
 */
var game;
(function (game) {
    var MonthCardView = (function (_super) {
        __extends(MonthCardView, _super);
        function MonthCardView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._timeUpdateEventId = 0;
            _this._timer = 0;
            _this._monthCardModel = game.MonthCardModel.getInstance();
            return _this;
        }
        MonthCardView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_help.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.openWin(WinName.MONTHCARD_INFO_TIP);
            }, this);
            this.monthCardFloat();
            this.initView();
        };
        MonthCardView.prototype.initView = function () {
            if (this._monthCardModel.rewardNum) {
                App.WinManager.openWin(WinName.MONTHCARD_DAILY_REWARD);
            }
            var monthCardInfo = this._monthCardModel.monthCardInfo;
            this.btlb_dailyGold.text = monthCardInfo.gold;
            this.btlb_allGold.text = monthCardInfo.gold * 30 + "";
            this.btlb_hookExp.text = "+" + Math.floor(monthCardInfo.exp / 100) + "%";
            this.btlb_hookCoin.text = "+" + Math.floor(monthCardInfo.coin / 100) + "%";
            this.btlb_bag.text = "+" + monthCardInfo.bag;
            this.btlb_achievement.text = "+" + Math.floor(monthCardInfo.achievement / 100) + "%";
            this.joinMonthCardEffect();
        };
        MonthCardView.prototype.updateView = function () {
            if (this._monthCardModel.leftTime) {
                this.gp_leftTime.visible = true;
                this.lb_day.text = this._monthCardModel.leftTimeDay + '';
                this.lb_hour.text = this._monthCardModel.leftTimeHour + "";
            }
            else {
                this.gp_leftTime.visible = false;
            }
            if (this._monthCardModel.rewardNum > 0) {
                App.WinManager.openWin(WinName.MONTHCARD_DAILY_REWARD);
                App.BtnTipManager.setTypeValue(ConstBtnTipType.MOUTHCARD, true);
            }
        };
        MonthCardView.prototype.joinMonthCardEffect = function () {
            if (!this._monthCardMc) {
                this._monthCardMc = new AMovieClip();
            }
            this._monthCardMc.x = 340;
            this._monthCardMc.y = 350;
            this.gp_wing.addChild(this._monthCardMc);
            this._monthCardMc.playMCKey("effyueka");
        };
        MonthCardView.prototype.monthCardFloat = function () {
            egret.Tween.get(this.gp_wing).to({ y: -10 }, 1000, egret.Ease.sineInOut).to({ y: 10 }, 1000, egret.Ease.sineInOut);
        };
        MonthCardView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            App.Socket.send(25001, {});
            if (this._timeUpdateEventId === 0) {
                this._timeUpdateEventId = App.EventSystem.addEventListener(PanelNotify.MONTHCARD_INFO_UPDATE, this.updateView, this);
            }
            if (this._timer === 0) {
                this._timer = App.GlobalTimer.addSchedule(2000, 0, this.monthCardFloat, this);
            }
        };
        MonthCardView.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        /**
         * 清理
         */
        MonthCardView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._timeUpdateEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.MONTHCARD_INFO_UPDATE, this._timeUpdateEventId);
                this._timeUpdateEventId = 0;
            }
            if (this._timer != 0) {
                App.GlobalTimer.remove(this._timer);
                this._timer = 0;
            }
        };
        /**
         * 销毁
         */
        MonthCardView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            if (this._monthCardMc) {
                this._monthCardMc.destroy();
                this._monthCardMc = null;
            }
        };
        return MonthCardView;
    }(BaseView));
    game.MonthCardView = MonthCardView;
    __reflect(MonthCardView.prototype, "game.MonthCardView");
})(game || (game = {}));
//# sourceMappingURL=MonthCardView.js.map
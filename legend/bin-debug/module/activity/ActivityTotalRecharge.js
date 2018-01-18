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
 * module: 累计充值
 * author : yangyipeng
*/
var game;
(function (game) {
    var ActivityTotalRecharge = (function (_super) {
        __extends(ActivityTotalRecharge, _super);
        function ActivityTotalRecharge(skinName) {
            var _this = _super.call(this, skinName) || this;
            _this._intervalId = 0;
            _this.skinName = ActivityTotalRechargeSkin;
            return _this;
        }
        ActivityTotalRecharge.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            // this.btn_recharge.addEventListener(egret.TouchEvent.TOUCH_TAP,this.handlerRecharge,this);
            this.btn_reward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.handlerReward, this);
            this.gp_recharge.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                game.RechargeOpenManager.getInstance().openRechargeView();
            }, this);
        };
        ActivityTotalRecharge.prototype.handlerReward = function () {
            var state = game.ActivityModel.getInstance().totalRechargeInfo["state"]; // 状态 （0不能领 1可领 2已领）
            switch (state) {
                case 0:
                    break;
                case 1:
                    App.Socket.send(30009, {}); //领取奖励
                    break;
                case 2:
                    break;
                default:
                    break;
            }
        };
        ActivityTotalRecharge.prototype.updateView = function () {
            var _this = this;
            var config = ConfigManager.getInstance().getRechargeGiftInfoById(5);
            var reward = config["reward"];
            for (var i = 0; i < reward.length; i++) {
                var type = reward[i][0];
                var id = reward[i][1];
                var num = reward[i][2];
                this["baseItem" + i].updateBaseItem(type, id, num);
                this["baseItem" + i].setItemNameVisible(true);
            }
            this.lb_rechargeDesc.textFlow = [{ text: "累冲" }, { text: config["add_gold"], style: { textColor: 0xffea00 } },
                { text: "元宝即可获得" }, { text: "材料礼包", style: { textColor: 0xffea00 } }];
            this.lb_desc.textFlow = [{ text: "活动说明：", style: { textColor: 0xf87500 } }, { text: "开服1-7天累计充值满" + config["add_gold"] + "可领取", style: { textColor: 0xB6B1AE } }];
            //倒计时
            if (this._intervalId) {
                App.GlobalTimer.remove(this._intervalId);
            }
            var leftTime = game.ActivityModel.getInstance().totalRechargeInfo["left_time"];
            this.lb_leftTime.textFlow = [{ text: "剩余时间：", style: { textColor: 0xf87500 } }, { text: game.InvestUtil.getFormatBySecond1(leftTime), style: { textColor: 0x11E428 } }];
            if (leftTime <= 0) {
                this.lb_leftTime.textFlow = [{ text: "剩余时间：", style: { textColor: 0xf87500 } }, { text: game.InvestUtil.getFormatBySecond1(0), style: { textColor: 0x11E428 } }];
                App.Socket.send(30008, {});
            }
            else {
                this.lb_leftTime.textFlow = [{ text: "剩余时间：", style: { textColor: 0xf87500 } }, { text: game.InvestUtil.getFormatBySecond1(leftTime), style: { textColor: 0x11E428 } }];
                App.GlobalTimer.addSchedule(1000, leftTime, this.updateTime, this, function () {
                    App.GlobalTimer.remove(_this._intervalId);
                    App.Socket.send(30008, {});
                    _this._intervalId = null;
                }, this);
            }
            //充值元宝 
            var charge = game.ActivityModel.getInstance().totalRechargeInfo["charge"];
            this.lb_gold.text = "已充值：" + charge + "/" + config["add_gold"] + "元宝";
        };
        ActivityTotalRecharge.prototype.updateTime = function () {
            game.ActivityModel.getInstance().totalRechargeInfo["left_time"]--;
            var leftTime = game.ActivityModel.getInstance().totalRechargeInfo["left_time"];
            this.lb_leftTime.textFlow = [{ text: "剩余时间：", style: { textColor: 0xf87500 } }, { text: game.InvestUtil.getFormatBySecond1(leftTime), style: { textColor: 0x11E428 } }];
        };
        /**
         * 打开窗口
         */
        ActivityTotalRecharge.prototype.open = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.open.call(this, openParam);
            //请求后台数据
            App.Socket.send(30008, {});
        };
        /**
         * 清理
         */
        ActivityTotalRecharge.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._intervalId != 0) {
                clearInterval(this._intervalId);
                this._intervalId = 0;
            }
        };
        /**
         * 销毁
         */
        ActivityTotalRecharge.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return ActivityTotalRecharge;
    }(BaseChildView));
    game.ActivityTotalRecharge = ActivityTotalRecharge;
    __reflect(ActivityTotalRecharge.prototype, "game.ActivityTotalRecharge");
})(game || (game = {}));
//# sourceMappingURL=ActivityTotalRecharge.js.map
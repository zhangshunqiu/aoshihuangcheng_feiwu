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
 * 活动模块控制器
 * author ：zrj
*/
var game;
(function (game) {
    var ActivityController = (function (_super) {
        __extends(ActivityController, _super);
        function ActivityController() {
            var _this = _super.call(this) || this;
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化协议
         */
        ActivityController.prototype.initProtocol = function () {
            this.registerProtocal(30001, this.handleActivityList, this);
            this.registerProtocal(30002, this.handleActivityDailyRank, this);
            this.registerProtocal(30003, this.handleActivityDailyRankReward, this);
            this.registerProtocal(30004, this.handleActivityLimitGiftInfo, this);
            this.registerProtocal(30005, this.handleActivityLimitGiftReward, this);
            this.registerProtocal(30008, this.handleActivityTotalRecharge, this);
            this.registerProtocal(30009, this.handleActivityTotalRechargeReward, this);
            this.registerProtocal(30006, this.handleActivityPerferentialGiftInfo, this);
            this.registerProtocal(30007, this.handleActivityGetPerferentialGift, this);
            this.registerProtocal(30010, this.handleActivityDailyRechargeInfo, this);
            this.registerProtocal(30011, this.handleActivityDailyRechargeReward, this);
            this.registerProtocal(30012, this.handleActivityContinueRechargeInfo, this);
            this.registerProtocal(30013, this.handleActivityContinueRechargeReward, this);
        };
        //开服活动信息
        ActivityController.prototype.handleActivityList = function (data) {
            App.logzrj("data:", data);
            ActivityManager.getInstance().updateActivityDict(data.list);
        };
        //每日竞技信息
        ActivityController.prototype.handleActivityDailyRank = function (data) {
            App.logzrj("data:", data);
            game.ActivityModel.getInstance().dailyRankInfo = data;
            this.dispatchEvent(PanelNotify.ACTIVITY_UPDATE_VIEW);
        };
        //每日竞技领取奖励
        ActivityController.prototype.handleActivityDailyRankReward = function (data) {
            App.logzrj("data:", data);
            App.Socket.send(30002, null);
            this.dispatchEvent(PanelNotify.ACTIVITY_UPDATE_VIEW);
        };
        //限购礼包信息
        ActivityController.prototype.handleActivityLimitGiftInfo = function (data) {
            App.logzrj("data:", data);
            game.ActivityModel.getInstance().limitGiftInfo = data;
            this.dispatchEvent(PanelNotify.ACTIVITY_UPDATE_VIEW);
        };
        //限购礼包领取
        ActivityController.prototype.handleActivityLimitGiftReward = function (data) {
            App.logzrj("data:", data);
            game.ActivityModel.getInstance().updateLimitGiftInfo(data);
            this.dispatchEvent(PanelNotify.ACTIVITY_UPDATE_VIEW);
        };
        //累计充值信息
        ActivityController.prototype.handleActivityTotalRecharge = function (data) {
            game.ActivityModel.getInstance().updateTotalRecharge(data);
            this.dispatchEvent(PanelNotify.ACTIVITY_UPDATE_VIEW);
        };
        //累计充值返回
        ActivityController.prototype.handleActivityTotalRechargeReward = function (data) {
            game.ActivityModel.getInstance().totalRechargeInfo["state"] = 2; // 状态 （0不能领 1可领 2已领
            game.ActivityModel.getInstance().checkActicityRedDot(4);
            this.dispatchEvent(PanelNotify.ACTIVITY_UPDATE_VIEW);
        };
        //每日累充礼包信息
        ActivityController.prototype.handleActivityDailyRechargeInfo = function (data) {
            App.logzrj("data:", data);
            game.ActivityModel.getInstance().dailyRechargeInfo = data;
            // ActivityModel.getInstance().sortDailyRecharge();
            game.ActivityModel.getInstance().updateDailyRechargeInfo(data);
            this.dispatchEvent(PanelNotify.ACTIVITY_UPDATE_VIEW);
        };
        //每日累充礼包领取
        ActivityController.prototype.handleActivityDailyRechargeReward = function (data) {
            App.logzrj("data:", data);
            game.ActivityModel.getInstance().updateDailyRechargeInfo(data);
            this.dispatchEvent(PanelNotify.ACTIVITY_UPDATE_VIEW);
        };
        //连续充值礼包信息
        ActivityController.prototype.handleActivityContinueRechargeInfo = function (data) {
            App.logzrj("data:", data);
            game.ActivityModel.getInstance().continueRechargeInfo = data;
            game.ActivityModel.getInstance().sortContinueRecharge();
            this.dispatchEvent(PanelNotify.ACTIVITY_UPDATE_VIEW);
        };
        //连续充值礼包领取
        ActivityController.prototype.handleActivityContinueRechargeReward = function (data) {
            App.logzrj("data:", data);
            game.ActivityModel.getInstance().updateContinueRechargeInfo(data);
            this.dispatchEvent(PanelNotify.ACTIVITY_UPDATE_VIEW);
        };
        //特惠礼包信息
        ActivityController.prototype.handleActivityPerferentialGiftInfo = function (data) {
            game.ActivityModel.getInstance().updatePerferentialGiftInfo(data);
            this.dispatchEvent(PanelNotify.ACTIVITY_UPDATE_VIEW);
        };
        /**
         * 购买特惠礼包
         */
        ActivityController.prototype.handleActivityGetPerferentialGift = function (data) {
            game.ActivityModel.getInstance().perferentialGiftInfo.list[data.id - 1].state = 2; //购买成功后把购买状态改为已购买
            this.dispatchEvent(PanelNotify.ACTIVITY_UPDATE_VIEW);
        };
        /**
         * 销毁
         */
        ActivityController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        /**
         * 清理
         */
        ActivityController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        return ActivityController;
    }(BaseController));
    game.ActivityController = ActivityController;
    __reflect(ActivityController.prototype, "game.ActivityController");
})(game || (game = {}));
//# sourceMappingURL=ActivityController.js.map
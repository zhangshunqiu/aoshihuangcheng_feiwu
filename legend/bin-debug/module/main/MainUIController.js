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
 * 主界面控制器，通用的数据分发走这里
 * author : zrj
*/
var game;
(function (game) {
    var MainUIController = (function (_super) {
        __extends(MainUIController, _super);
        function MainUIController() {
            var _this = _super.call(this) || this;
            _this._hasreqmainline = false;
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        MainUIController.prototype.initProtocol = function () {
            this.registerProtocal(13008, this.handleHookReward, this);
            this.registerProtocal(9004, this.playerInfoR, this);
            this.registerProtocal(13009, this.handleFastFightTime, this);
            this.registerProtocal(13010, this.handleFastFightResult, this);
            //主线任务
            this.registerProtocal(29001, this.handleGetMainLineTaskInfo, this);
            this.registerProtocal(29002, this.handleTakeMainLineReward, this);
            this.registerProtocal(29003, this.handleUpdateMainLineTaskInfo, this);
            //新手引导
            this.registerProtocal(9012, this.handleGuideR, this);
        };
        //挂机奖励 自动挂机的奖励，每分钟发放
        MainUIController.prototype.handleHookReward = function (data) {
            game.MainUIModel.getInstance().hookRewardInfo = data;
            this.dispatchEvent(PanelNotify.PLAYER_OFFLINE_INFO);
        };
        //数值改变,玩家信息更新
        MainUIController.prototype.playerInfoR = function (data) {
            var backpckModel = game.BackpackModel.getInstance();
            if (data.type == CurrencyType.COIN) {
                if (data.value - App.RoleManager.roleWealthInfo.coin > 0) {
                    backpckModel.handleReward({ type: ClientType.CURRENCY, good_id: CurrencyType.COIN, num: data.value - App.RoleManager.roleWealthInfo.coin });
                }
                App.RoleManager.roleWealthInfo.coin = data.value;
                game.SkillModel.getInstance().checkSkillCanUpgradeAll();
            }
            else if (data.type == CurrencyType.GOLD) {
                if (data.value - App.RoleManager.roleWealthInfo.gold > 0) {
                    backpckModel.handleReward({ type: ClientType.CURRENCY, good_id: CurrencyType.GOLD, num: data.value - App.RoleManager.roleWealthInfo.gold });
                }
                App.RoleManager.roleWealthInfo.gold = data.value;
            }
            else if (data.type == CurrencyType.EXP) {
                App.RoleManager.roleInfo.exp = data.value;
            }
            else if (data.type == CurrencyType.LEVEL) {
                if (data.value > App.RoleManager.roleInfo.lv) {
                }
                App.RoleManager.roleInfo.lv = data.value;
            }
            else if (data.type == CurrencyType.TURN_EXP) {
                if (data.value - App.RoleManager.roleInfo.lifeExp > 0) {
                    backpckModel.handleReward({ type: ClientType.CURRENCY, good_id: CurrencyType.TURN_EXP, num: data.value - App.RoleManager.roleInfo.lifeExp });
                }
                App.RoleManager.roleInfo.lifeExp = data.value;
            }
            else if (data.type == CurrencyType.TURN) {
                App.RoleManager.roleInfo.turn = Number(data.value);
            }
            else if (data.type == CurrencyType.VIP_LV) {
                App.RoleManager.roleInfo.vipLv = data.value;
            }
            else if (data.type == CurrencyType.TITLE) {
                App.RoleManager.roleInfo.titleId = data.value;
            }
            App.EventSystem.dispatchEvent(PanelNotify.PLAYER_UPDATE_PLAYER_INFO);
            game.WingModel.getInstance().updateBaseInfo();
        };
        //快速战斗次数
        MainUIController.prototype.handleFastFightTime = function (data) {
            App.logzrj("data:", data);
            game.MainUIModel.getInstance().fastFightTime = data.result;
            this.dispatchEvent(PanelNotify.PLAYER_FASTFIGHT_INFO, data);
        };
        //快速战斗结果
        MainUIController.prototype.handleFastFightResult = function (data) {
            App.logzrj("data:", data);
            game.MainUIModel.getInstance().fastFightInfo = data;
            this.dispatchEvent(PanelNotify.PLAYER_FASTFIGHT_RESULT, data);
        };
        //主线任务
        //获取主线任务信息
        MainUIController.prototype.handleGetMainLineTaskInfo = function (data) {
            App.loglh("handleGetMainLineTaskInfo");
            game.MainUIModel.getInstance().getMainLineTaskInfo(data);
            this.dispatchEvent(PanelNotify.MAIN_LINE_TASK_GET_INFO, data);
        };
        //领取主线任务奖励
        MainUIController.prototype.handleTakeMainLineReward = function (data) {
            App.loglh("handleTakeMainLineReward");
            // App.Socket.send(29001, null);
        };
        //主线任务信息变更
        MainUIController.prototype.handleUpdateMainLineTaskInfo = function (data) {
            App.loglh("handleUpdateMainLineTaskInfo");
            game.MainUIModel.getInstance().getMainLineTaskInfo(data);
            this.dispatchEvent(PanelNotify.MAIN_LINE_TASK_GET_INFO, data);
        };
        MainUIController.prototype.requestMainLineTaskInfo = function () {
            if (this._hasreqmainline)
                return;
            this._hasreqmainline = true;
            App.Socket.send(29001, null);
        };
        //新手引导存储进度返回
        MainUIController.prototype.handleGuideR = function (data) {
        };
        MainUIController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        MainUIController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return MainUIController;
    }(BaseController));
    game.MainUIController = MainUIController;
    __reflect(MainUIController.prototype, "game.MainUIController");
})(game || (game = {}));
//# sourceMappingURL=MainUIController.js.map
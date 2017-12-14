/**
 * 主界面控制器，通用的数据分发走这里
 * author : zrj
*/
module game {
    export class MainUIController extends BaseController {

        private _hasreqmainline = false;

        public constructor() {
            super();
            this.initProtocol();
            this.initEventListener();
        }

        protected initProtocol() {
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
        }

        //挂机奖励 自动挂机的奖励，每分钟发放
        public handleHookReward(data) {
            MainUIModel.getInstance().hookRewardInfo = data;
            this.dispatchEvent(PanelNotify.PLAYER_OFFLINE_INFO);
        }

        //数值改变,玩家信息更新
        public playerInfoR(data) {
            let backpckModel = BackpackModel.getInstance() as BackpackModel;
            if (data.type == CurrencyType.COIN) {
                if (data.value - App.RoleManager.roleWealthInfo.coin > 0) {
                    backpckModel.handleReward({ type: ClientType.CURRENCY, good_id: CurrencyType.COIN, num: data.value - App.RoleManager.roleWealthInfo.coin });
                }
                App.RoleManager.roleWealthInfo.coin = data.value;
                SkillModel.getInstance().checkSkillCanUpgradeAll();
            } else if (data.type == CurrencyType.GOLD) {
                if (data.value - App.RoleManager.roleWealthInfo.gold > 0) {
                    backpckModel.handleReward({ type: ClientType.CURRENCY, good_id: CurrencyType.GOLD, num: data.value - App.RoleManager.roleWealthInfo.gold })
                }
                App.RoleManager.roleWealthInfo.gold = data.value;
            } else if (data.type == CurrencyType.EXP) {
                App.RoleManager.roleInfo.exp = data.value;
            } else if (data.type == CurrencyType.LEVEL) {
                if (data.value > App.RoleManager.roleInfo.lv) { //升级了

                }
                App.RoleManager.roleInfo.lv = data.value;
            } else if (data.type == CurrencyType.TURN_EXP) {
                if (data.value - App.RoleManager.roleInfo.lifeExp > 0) {
                    backpckModel.handleReward({ type: ClientType.CURRENCY, good_id: CurrencyType.TURN_EXP, num: data.value - App.RoleManager.roleInfo.lifeExp })
                }
                App.RoleManager.roleInfo.lifeExp = data.value;
            } else if (data.type == CurrencyType.TURN) {
                App.RoleManager.roleInfo.turn = data.value;
            } else if (data.type == CurrencyType.VIP_LV) {
                App.RoleManager.roleInfo.vipLv = data.value;
            }
            App.EventSystem.dispatchEvent(PanelNotify.PLAYER_UPDATE_PLAYER_INFO);
            WingModel.getInstance().updateBaseInfo();
        }

        //快速战斗次数
        public handleFastFightTime(data) {
            App.logzrj("data:", data);
            MainUIModel.getInstance().fastFightTime = data.result;
            this.dispatchEvent(PanelNotify.PLAYER_FASTFIGHT_INFO, data);
        }

        //快速战斗结果
        public handleFastFightResult(data) {
            App.logzrj("data:", data);
            MainUIModel.getInstance().fastFightInfo = data;
            this.dispatchEvent(PanelNotify.PLAYER_FASTFIGHT_RESULT, data);
        }


        //主线任务
        //获取主线任务信息
        public handleGetMainLineTaskInfo(data) {
            App.loglh("handleGetMainLineTaskInfo");
            (MainUIModel.getInstance() as MainUIModel).getMainLineTaskInfo(data);
            this.dispatchEvent(PanelNotify.MAIN_LINE_TASK_GET_INFO, data);
        }

        //领取主线任务奖励
        public handleTakeMainLineReward(data) {
            App.loglh("handleTakeMainLineReward");
           // App.Socket.send(29001, null);

        }

        //主线任务信息变更
        public handleUpdateMainLineTaskInfo(data) {
            App.loglh("handleUpdateMainLineTaskInfo");
            (MainUIModel.getInstance() as MainUIModel).getMainLineTaskInfo(data);
            this.dispatchEvent(PanelNotify.MAIN_LINE_TASK_GET_INFO, data);
        }

        public requestMainLineTaskInfo() {          //开始时请求每日任务信息

            if (this._hasreqmainline)
                return;
            this._hasreqmainline = true;
            App.Socket.send(29001, null);

        }

        //新手引导存储进度返回
        public handleGuideR(data) {

        }

        public clear() {
            super.clear();
        }

        public destroy() {
            super.destroy();
        }
    }
}
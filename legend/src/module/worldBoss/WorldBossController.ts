/**
 * Author: liuyonggen
 * 世界boss系统控制模块 2017/12/4
 */
module game {
    export class WorldBossController extends BaseController {
        public constructor() {
            super();
            this.initProtocol();
            this.initEventListener();
        }
           
        /**
         * 初始化协议
         */
        protected initProtocol() {
            super.initProtocol();
            this.registerProtocal(36001, this.handlerWorldBossInterface, this);
            this.registerProtocal(36002, this.handlerStartChallenge, this);
            this.registerProtocal(36003, this.handlerKillRecord, this);
            this.registerProtocal(36004, this.handlerBuyTimesResult, this);
            this.registerProtocal(36005, this.handlerWorldBossCheer, this);
            this.registerProtocal(36006, this.handlerWorldBossCheerResult, this);
            this.registerProtocal(36009, this.handlerWorldBossChallengeResult, this);
            this.registerProtocal(36010, this.handlerWorldBossHurtList, this);
        }

        /**
         * boss界面数据
         */
        public handlerWorldBossInterface(data) {
            (WorldBossModel.getInstance() as WorldBossModel).updateWorldBossInfo(data);
            App.EventSystem.dispatchEvent(PanelNotify.WORLDBOSS_INFO_UPDATE);
            if(data.bosses.length < 3) {
                if((WorldBossModel.getInstance() as WorldBossModel).showBossRevive()) {
                    App.WinManager.openWin(WinName.WORLDBOSS_REVIVE);
                }
            }
        }

        /**
         * 玩家发起挑战 服务器返回一个结果
         */
        public handlerStartChallenge(data) {
            App.loglyg(data);
            App.EventSystem.dispatchEvent(PanelNotify.WORLDBOSS_FIGHT);
        }

        /**
         * 击杀记录
         */
        public handlerKillRecord(data) {
            (WorldBossModel.getInstance() as WorldBossModel).killRecord = data.kill_players;
            App.EventSystem.dispatchEvent(PanelNotify.WORLDBOSS_KILLRECORD_UPDATE);
        }

        /**
         * 购买挑战世界boss次数协议，成功返回结果
         */
        public handlerBuyTimesResult(data) {
            (WorldBossModel.getInstance() as WorldBossModel).pbWorldBossInfo.left_times++;
            (WorldBossModel.getInstance() as WorldBossModel).pbWorldBossInfo.buy_times++;
            App.EventSystem.dispatchEvent(PanelNotify.WORLDBOSS_INFO_UPDATE);
        }

        /**
         * 当前助威次数
         */
        public handlerWorldBossCheer(data) {
            App.EventSystem.dispatchEvent(PanelNotify.WORLDBOSS_CHEER, data.num);
        }

        /**
         * 点击助威，返回助威是否成功
         */
        public handlerWorldBossCheerResult(data) {
            App.EventSystem.dispatchEvent(PanelNotify.WORLDBOSS_CHEER_RESULT, data.result);
        }

        /**
         * 世界boss挑战结果
         */
        public handlerWorldBossChallengeResult(data) {
             //延迟弹出窗口
		    SceneManager.getInstance().delayOpenCompleteView(data,this.worldBossChallengeResult,this);
        }
         /**
         * 执行世界boss挑战结果
         */
        public worldBossChallengeResult(data) {
            (BossModel.getInstance() as BossModel).rank = data.rank;
            (BossModel.getInstance() as BossModel).dropItem = data.reward;
            App.WinManager.openWin(WinName.BOSS_WIN);
        }

        /**
         * 世界boss伤害排行
         */
        public handlerWorldBossHurtList(data) {
            App.EventSystem.dispatchEvent(PanelNotify.WORLDBOSS_HURT_RANK_UPDATE, data);
        }

         /**
         * 初始化事件监听                                           
         */
        protected initEventListener() {
            super.initEventListener();
        }


        /**
         * 清理
         */
        public clear() {
            super.clear();

        }

        /**
         * 销毁
         */
        public destroy() {
            super.destroy();
        }
    }
}
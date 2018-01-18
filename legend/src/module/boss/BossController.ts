/**
 * Author: liuyonggen
 * Boss模块主控制器 2017/11/13
 */
module game{
    export class BossController extends BaseController{
        private _sceneChangeEventId: number = 0;
    
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
            this.registerProtocal(13011, this.handlerGetBossReward, this);
            this.registerProtocal(13012, this.handlerBossRewardLevel, this);
            this.registerProtocal(13013, this.handlerMeetBoss, this);
            this.registerProtocal(13014, this.handlerChallengeMeetBoss, this);
        }


        private updateChallengeBtnTips(){
            // if(){
            //     App.BtnTipManager.setTypeValue(ConstBtnTipType.BOSS_CHALLENGE,true);
			// }else{
			// 	App.BtnTipManager.setTypeValue(ConstBtnTipType.BOSS_CHALLENGE,false);
            // }
        }
       

         
        /**
         * 获取挑战boss通关奖励
         */
        private handlerGetBossReward(data) {
            App.loglyg("获得boss奖励", data);
        }

        /**
         * 已获取挑战boss通关奖励的最高等级
         */
        private handlerBossRewardLevel(data) {
            (BossModel.getInstance() as BossModel).updateBossRewardInfo(data.id);
            App.EventSystem.dispatchEvent(PanelNotify.BOSS_REWARD_UPDATE);
        }

        /**
         * 随机遭遇boss
         */
        private handlerMeetBoss(data) {
            App.EventSystem.dispatchEvent(PanelNotify.BOSS_MEET, data.result);   //1为遭遇boss
        }

        /**
         * 请求挑战遭遇boss
         */
        private handlerChallengeMeetBoss(data) {
            if(data.id) {
                this.dispatchEvent(PanelNotify.BOSS_MEET_START_CHALLENGE);
            }
        }

        /**
         * 初始化事件监听                                           
         */
        protected initEventListener() {
            super.initEventListener();
            if(this._sceneChangeEventId === 0) {
                this._sceneChangeEventId = App.EventSystem.addEventListener(SceneEventType.SCENE_INIT_COMPLETE, ()=>{
                    (BossModel.getInstance() as BossModel).updateSceneInfo();
                     (BossModel.getInstance() as BossModel).wave = 0;
                    App.EventSystem.dispatchEvent(PanelNotify.BOSS_WAVE_UPDATE);
                }, this);
            }
        }        

        /**
         * 销毁
         */
        public destroy(){
            super.destroy();
        }

        /**
         * 清理
         */
        public clear(){
            super.clear();
            if(this._sceneChangeEventId !=0) {
                App.EventSystem.removeEventListener(SceneEventType.SCENE_INIT_COMPLETE, this._sceneChangeEventId);
                this._sceneChangeEventId = 0;
            }
        }

    }
}
/**
 * Author: liuyonggen
 * 世界boss挑战时窗口 2017/12/4
 */
module game {
    export class WorldBossFight extends BaseView {
        public img_icon: eui.Image;
        public img_cheer: eui.Image;
        public img_reward: eui.Image;
        public btn_shield: eui.Button;
        public lb_bossName: eui.Label;
        public lb_bossLv: eui.Label;
        public pb_hp: eui.ProgressBar;
        public img_rankBg: eui.Image;
        public gp_rank0: eui.Group;
        public gp_rank1: eui.Group;
        public gp_rank2: eui.Group;
        public gp_rank3: eui.Group;
        public gp_rank4: eui.Group;
        public lb_rank0: eui.Label;
        public lb_rank1: eui.Label;
        public lb_rank2: eui.Label;
        public lb_rank3: eui.Label;
        public lb_rank4: eui.Label;
        public lb_name0: eui.Label;
        public lb_name1: eui.Label;
        public lb_name2: eui.Label;
        public lb_name3: eui.Label;
        public lb_name4: eui.Label;
        public lb_hurt0: eui.Label;
        public lb_hurt1: eui.Label;
        public lb_hurt2: eui.Label;
        public lb_hurt3: eui.Label;
        public lb_hurt4: eui.Label;
        public lb_myHurt: eui.Label;
        public gp_countDown: eui.Group;
        public lb_time: eui.Label;
        public gp_rankAll: eui.Group;
        public btn_showOrHide: eui.Button;
        public gp_myHurt: eui.Group;
        private _worldBossInfo: any = {};
        private _worldBossEventId: number = 0;
        private _hurtRankTimer:number = 0;
        private _hurtRankEventId: number = 0;
        private _leftTimeTimer: number = 0;

        public _worldBossModel: WorldBossModel = WorldBossModel.getInstance();

        public constructor(viewConf:WinManagerVO = null) {
            super(viewConf);

        }

        public childrenCreated() {
            super.childrenCreated();
            this.img_cheer.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                App.WinManager.openWin(WinName.WORLDBOSS_CHEER, this._worldBossInfo.worldBossItem);
            }, this);
            this.img_reward.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                App.WinManager.openWin(WinName.WORLDBOSS_REWARD, this._worldBossInfo.worldBossItem);
            }, this);
            this.btn_shield.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                if(this.btn_shield.currentState == "up") {
                    this.btn_shield.currentState = "down";
                    SceneManager.getInstance().setOtherPlayerVisible(false);
                } else {
                    this.btn_shield.currentState = "up";
                    SceneManager.getInstance().setOtherPlayerVisible(true);
                }  
            }, this);
            this.btn_showOrHide.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showOrHide, this);
            
        }

        private showOrHide() {
            if(this.btn_showOrHide.currentState == "up") {
                this.btn_showOrHide.currentState = "down";
                this.gp_rankAll.visible = false;
                this.img_rankBg.height = 60;
                this.gp_myHurt.y = 102;
            } else {
                this.btn_showOrHide.currentState = "up";
                this.gp_rankAll.visible = true;
                this.img_rankBg.height = 178;
                this.gp_myHurt.y = 217;
            }
        }

        private initView() {
            this.img_icon.source = this._worldBossInfo.worldBossItem.icon + "_png";
            let bossId = this._worldBossInfo.worldBossItem.monster_list[0][2];
            let bossInfo = App.ConfigManager.getMonsterById(bossId);
            this.lb_bossName.text = bossInfo.name;
            this.lb_bossLv.text = bossInfo.lv;
        }

        private updateView(bossInfo) {
            // App.loglyg("bossssssssssssss",bossInfo);
            this.pb_hp.maximum = bossInfo.hp;
            this.pb_hp.value = bossInfo.curHp;
        }

        private updateRankView(data) {
            for(let i:number=0; i<5; i++) {
                if(data.hurt_list.length > i) {
                    this["gp_rank" + i].visible = true;
                    this["lb_rank" + i].text = data.hurt_list[i].rank;
                    this["lb_name" + i].text = data.hurt_list[i].nick;
                    this["lb_hurt" + i].text = data.hurt_list[i].hurt;
                } else {
                    this["gp_rank" + i].visible = false;
                }
            }
            this.lb_myHurt.text = data.self_hurt;
            if(data.left_time <= 60) {
                if(this._leftTimeTimer == 0) {
                    let nowTime = data.left_time;
                    this.gp_countDown.visible = true;
                    App.GlobalTimer.addSchedule(1000, 0, ()=>{
                        this.lb_time.text = nowTime-- + "";
                        if(nowTime == 0){
                            this.gp_countDown.visible = false;
                            if(this._leftTimeTimer != 0) {
                                App.GlobalTimer.remove(this._leftTimeTimer);
                                this._leftTimeTimer = 0;
                            }
                        }
                    }, this);
                }
            }
        }

        private updateHurtRank() {
            App.Socket.send(36010, {});
        }

        public openWin(openParam: any = null): void {
            super.openWin(openParam);
            if(typeof openParam == "number") {
                this._worldBossInfo.worldBossItem = this._worldBossModel.worldBossInfo[openParam];
            } else {
                this._worldBossInfo = openParam;
            }
            this.initView()
            if(this._worldBossEventId == 0) {
                this._worldBossEventId = App.EventSystem.addEventListener(SceneEventType.BOSS_INFO, this.updateView, this);
            }
            if(this._hurtRankTimer == 0) {
                this._hurtRankTimer = App.GlobalTimer.addSchedule(2000, 0, this.updateHurtRank, this);
            }
            if(this._hurtRankEventId == 0) {
                this._worldBossEventId = App.EventSystem.addEventListener(PanelNotify.WORLDBOSS_HURT_RANK_UPDATE, this.updateRankView, this);
            }
            if(this._leftTimeTimer != 0) {
                App.GlobalTimer.remove(this._leftTimeTimer);
                this._leftTimeTimer = 0;
            }
            App.EventSystem.dispatchEvent(PanelNotify.MAIN_HIDE_FIGHT_INFO, true);
        }

        public closeWin(): void {
            super.closeWin();
        }

        /**
         * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
         */
        public clear(data: any = null): void {
            super.clear(data);
            if(this._worldBossEventId != 0) {
                App.EventSystem.removeEventListener(SceneEventType.BOSS_INFO, this._worldBossEventId);
                this._worldBossEventId = 0;
            }
            if(this._hurtRankTimer != 0) {
                App.GlobalTimer.remove(this._hurtRankTimer);
                this._hurtRankTimer = 0;
            }
            if(this._hurtRankEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WORLDBOSS_HURT_RANK_UPDATE, this._hurtRankEventId);
                this._hurtRankEventId = 0;
            }
            App.EventSystem.dispatchEvent(PanelNotify.MAIN_HIDE_FIGHT_INFO, false);
        }
        /**
         * 销毁
         */
        public destroy(): void {
            super.destroy();
        }
    }
}

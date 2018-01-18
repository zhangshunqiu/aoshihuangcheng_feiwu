module game {
    export class BossIconView extends BaseView {
        public gp_boss: eui.Group;
        public gp_bossUI: eui.Group;
        public pb_monsterWave: eui.ProgressBar;
        public btn_auto: eui.Button;
        public gp_autoChallenge: eui.Group;
        public gp_meetBoss: eui.Group;

        private _mc: AMovieClip;
        private _mcChallenge: AMovieClip;
        private _mcMeetBoss: AMovieClip;

        private _bossResultEventId: number = 0;

        public constructor() {
            super();
            this.skinName = "BossIconSkin";
        }

        public childrenCreated() {
            super.childrenCreated();
            this.gp_boss.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
                App.WinManager.openWin(WinName.BOSS);
            }, this);
            this.btn_auto.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openAutoChallenge, this);
            this.gp_autoChallenge.touchEnabled = false;

            App.EventSystem.addEventListener(PanelNotify.BOSS_WAVE_UPDATE, this.updateWave, this);  //监听波数更新

            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.BOSS_CHALLENGE,this.gp_boss,140,15);
            this.joinBossIconEffect();
            this.closeBossIconEffect();
        }

        public updateWave() { //更新主界面波数
            this.pb_monsterWave.maximum = (BossModel.getInstance() as BossModel).waveAll;  
            this.pb_monsterWave.value = (BossModel.getInstance() as BossModel).wave;
            if((BossModel.getInstance() as BossModel).waveAll <= (BossModel.getInstance() as BossModel).wave) {
                this.openBossIconEffect();
                
                //波数已到，可以挑战boss
                App.EventSystem.dispatchEvent(PanelNotify.MAIN_BOSS_CAN_CHANLLENGE,true);
            } else {
                App.EventSystem.dispatchEvent(PanelNotify.MAIN_BOSS_CAN_CHANLLENGE,false);
                this.closeBossIconEffect();
            }
        }

        public joinBossIconEffect() {  //加入挑战boss图标特效和自动挑战特效
            this._mc = new AMovieClip();
            this._mcChallenge = new AMovieClip();
            this._mcMeetBoss = new AMovieClip();
            this.gp_bossUI.addChild(this._mc);
            this.gp_autoChallenge.addChild(this._mcChallenge);
            this.gp_meetBoss.addChild(this._mcMeetBoss);
            this._mc.playMCKey("efftzgq");
            this._mcChallenge.playMCKey("efftzgqk");
            this._mcMeetBoss.frameRate = 8;
            this._mcMeetBoss.playMCKey("efftishi");
            this.gp_autoChallenge.visible = false;
        }

        public openBossIconEffect() {  //打开挑战boss图标特效
            this.gp_bossUI.visible = true;
        }

        public closeBossIconEffect() {  //关闭挑战boss图标特效
            this.gp_bossUI.visible = false;
        }

        public openAutoChallenge() {
            //自动挑战开启  //判断开启条件
            if (!App.GuideManager.isModuleOpen("AUTO_FIGHT")) {
                App.GuideManager.moduleNotOpenTip("AUTO_FIGHT");
                return;
            }
            
            if(this._bossResultEventId == 0) {
                this._bossResultEventId = App.EventSystem.addEventListener(PanelNotify.SHOW_BOSS_RESULT, this.showBossResult, this);
            }
            if(this.gp_autoChallenge.visible) {
                App.Socket.send(13006, {id:0});  //关闭自动挑战
                this.gp_autoChallenge.visible = false;
            } else {
                App.Socket.send(13006, {id:1}); //打开自动挑战
                this.gp_autoChallenge.visible = true;
            } 
        }

        private showBossResult(result) {
            if(result === 1) {
                this.gp_meetBoss.visible = false;
            } else if(result === 0) {
                this.gp_autoChallenge.visible = false;
            }
        }

		public openWin(openParam:any = null):void{
			super.openWin(openParam);
		}

		public closeWin(): void {
			super.closeWin();
		}

		public clear(data:any = null):void{
			super.clear();
		}

		public destroy():void{
			super.destroy();
		}

    }
}
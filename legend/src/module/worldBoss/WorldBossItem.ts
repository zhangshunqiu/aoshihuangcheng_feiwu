 module game{
    export class WorldBossItem extends BaseView {
        public lb_bossName: eui.Label;
        public lb_bossLv: eui.Label;
        public lb_man: eui.Label;
        public img_icon: eui.Image;
        public img_killRecord: eui.Image;
        public img_hadKill: eui.Image;
        public lb_refreshTime: eui.Label;
        public lb_limitLv: eui.Label;
        public worldBossItem: any;
        public pbWorldBossItem: any;
        public index: number;
        public checkBox: eui.CheckBox;
        private _worldBossModel: WorldBossModel = WorldBossModel.getInstance();
        private _returnTimeTimer: number = 0;

        public constructor() {
            super();
            this.skinName = "WorldBossItem";
            this.initView();
        }

         public childrenCreated() {
            super.childrenCreated();
            this.checkBox.addEventListener(eui.UIEvent.CHANGE, this.onCheckBoxChange, this);
        }

        private onCheckBoxChange() {
            App.Socket.send(36007, {scene_id:this.worldBossItem.scene_id})
        }

        private initView() {
            
        }

        public updateView(worldBossItem, pbWorldBossItem) {
            this.worldBossItem = worldBossItem;
            this.pbWorldBossItem = pbWorldBossItem;
            let bossId = worldBossItem.monster_list[0][2];
            let bossInfo = App.ConfigManager.getMonsterById(bossId);
            this.lb_bossName.text = bossInfo.name;
            this.lb_bossLv.text = "LV." + bossInfo.lv;
            this.lb_man.text = pbWorldBossItem.num + "人";
            this.img_icon.source = worldBossItem.icon + "_png";
            if((App.RoleManager.roleInfo.lv >= worldBossItem.lv_limit && worldBossItem.lv_limit) ||
            (App.RoleManager.roleInfo.turn >= worldBossItem.transmigration && worldBossItem.transmigration)) {
                this.checkBox.visible = true;
                this.lb_limitLv.visible = false;
                if(pbWorldBossItem.notice == 1) {
                    this.checkBox.selected = true;
                } else {
                    this.checkBox.selected = false;
                }
            } else {
                this.checkBox.visible = false;
                this.lb_limitLv.visible = true;
                if(worldBossItem.lv_limit) {
                    this.lb_limitLv.text = worldBossItem.lv_limit + "级开启";
                } else {
                    this.lb_limitLv.text = worldBossItem.transmigration + "转开启";
                }
            }
            
            if(pbWorldBossItem.refresh_time) {
                this.img_hadKill.visible = true;
                this.lb_refreshTime.visible = true;
                if(this._returnTimeTimer == 0) {
                    this._returnTimeTimer = App.GlobalTimer.addSchedule(1000, 0, ()=>{
                        pbWorldBossItem.refresh_time--;
                        this.lb_refreshTime.text = GlobalUtil.getFormatBySecond1(pbWorldBossItem.refresh_time);
                        if(pbWorldBossItem.refresh_time <= 0) {
                            this.stopTimer();
                            this.lb_refreshTime.visible = false;
                        }
                }, this);
            }
                this.lb_refreshTime.text = pbWorldBossItem.refresh_time;
            } else {
                this.img_hadKill.visible = false;
                this.lb_refreshTime.visible = false;
            }
            this.img_killRecord.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                App.WinManager.openWin(WinName.WORLDBOSS_KILL_RECORD, this.worldBossItem.scene_id);
            }, this);
        }

        private stopTimer() {
            if(this._returnTimeTimer != 0) {
                App.GlobalTimer.remove(this._returnTimeTimer);
                this._returnTimeTimer = 0;
            }
        }

        private itemTap(event: eui.ItemTapEvent) {
			let itemData = event.item;
			App.GlobalTips.showItemTips(itemData[0], itemData[1], null);
		}

        
        public openWin(openParam: any = null): void {
            super.openWin(openParam);
        }

        public closeWin(): void {
            super.closeWin();
        }

        /**
         * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
         */
        public clear(data: any = null): void {
            super.clear(data);
            this.stopTimer();
        }
        /**
         * 销毁
         */
        public destroy(): void {
            super.destroy();
        }
    }

    
 }
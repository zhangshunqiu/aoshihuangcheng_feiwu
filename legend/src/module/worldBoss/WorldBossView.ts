/**
 * Author: liuyonggen
 * 世界boss视图窗口 2017/12/4
 */
module game {
    export class WorldBossView extends BaseView {
        public commonWin: customui.CommonWin;
        public img_back: eui.Image;
        public img_buyTimes: eui.Image;
        public gp_middle: eui.Group;
        public lb_timesLimit: eui.Label;
        public lb_curTimes: eui.Label;
        public lb_timesReturn: eui.Label;
        public scroller: eui.Scroller;
        public gp_refreshTime: eui.Group;
        private _curIndex: number = 0;
        // private _worldBossItemGroup: any = {};
        private _bossItemWidth: number = 0;
        private _bossItemHeight: number = 0;
        private _worldBossInfoItem: WorldBossInfoItem;
        private _returnTimeTimer: number = 0;

        public _worldBossModel: WorldBossModel = WorldBossModel.getInstance();

        private _worldBossInfoUpdateEventId: number = 0;

        public constructor(viewConf:WinManagerVO = null) {
            super(viewConf);
            this._worldBossInfoItem = new WorldBossInfoItem();
        }

        public childrenCreated() {
            super.childrenCreated();
            this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
             RES.getResAsync("worldboss_boss_title_png", (texture) => {
				this.commonWin.img_title.texture = texture;
			}, this);
            this.img_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_buyTimes.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                App.WinManager.openWin(WinName.WORLDBOSS_BUY_TIMES);
            }, this);
            this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
            this.scroller.scrollPolicyV = eui.ScrollPolicy.ON;
            this.scroller.verticalScrollBar.autoVisibility = false;
            this.scroller.verticalScrollBar.visible = false;
        }

        private initView() {
            let i: number = 0;
            for(let k in this._worldBossModel.worldBossInfo) {
                let worldBossItem = new WorldBossItem();
                worldBossItem.updateView(this._worldBossModel.worldBossInfo[k], this._worldBossModel.pbWorldBossInfo.bosses[i]);
                worldBossItem.index = i;
                worldBossItem.addEventListener(egret.TouchEvent.TOUCH_TAP, (e:Event)=>{
                    this.updateView(e.currentTarget["index"]);
                    this._curIndex = e.currentTarget["index"];
                }, this);
                i++;
                this._worldBossModel.worldBossItemGroup[k] = worldBossItem;
            }
            for(let k in this._worldBossModel.worldBossItemGroup) {
                this._bossItemWidth = this._worldBossModel.worldBossItemGroup[k].width;
                this._bossItemHeight = this._worldBossModel.worldBossItemGroup[k].height;
                break;
            }
            this.lb_curTimes.text = this._worldBossModel.pbWorldBossInfo.left_times; 
            this.lb_timesLimit.text = "/" + this._worldBossModel.maxTimesLimit;
            if(this._worldBossModel.pbWorldBossInfo.refresh_time <= 0) {
                this.gp_refreshTime.visible = false;
            } else if(this._returnTimeTimer == 0) {
                this._returnTimeTimer = App.GlobalTimer.addSchedule(1000, 0, ()=>{
                    this._worldBossModel.pbWorldBossInfo.refresh_time--;
                    this.lb_timesReturn.text = GlobalUtil.getFormatBySecond1(this._worldBossModel.pbWorldBossInfo.refresh_time);
                    if(this._worldBossModel.pbWorldBossInfo.refresh_time <= 0) {
                        this.stopTimer();
                    }
                }, this);
            }
            this.updateView(this._curIndex);
        }

        private stopTimer() {
            if(this._returnTimeTimer != 0) {
                App.GlobalTimer.remove(this._returnTimeTimer);
                this._returnTimeTimer = 0;
            }
            
        }

        private updateView(index:number = 0) {
            let blank:number = 0; //世界boss的掉落物品信息预留高度
            let i:number = 0;
            for(let k in this._worldBossModel.worldBossItemGroup) {
                this._worldBossModel.worldBossItemGroup[k].x = 6;
                this._worldBossModel.worldBossItemGroup[k].y = i * this._bossItemHeight + blank;
                this.gp_middle.addChild(this._worldBossModel.worldBossItemGroup[k]);
                if(i==index) {
                    if(!this._worldBossInfoItem) {
                        this._worldBossInfoItem = new WorldBossInfoItem();
                    }
                    this._worldBossInfoItem.updateView(this._worldBossModel.worldBossItemGroup[k]);
                    this.gp_middle.addChild(this._worldBossInfoItem);
                    this._worldBossInfoItem.y = (index + 1) * this._bossItemHeight + 2;
                    blank = 360;    
                }
                i++;
            }
        }

        

        public openWin(openParam: any = null): void {
            super.openWin(openParam);
            App.Socket.send(36001, {});
            if(this._worldBossInfoUpdateEventId == 0) {
                this._worldBossInfoUpdateEventId = App.EventSystem.addEventListener(PanelNotify.WORLDBOSS_INFO_UPDATE, this.initView, this);
            }
        }

        public closeWin(): void {
            super.closeWin();
        }

        /**
         * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
         */
        public clear(data: any = null): void {
            super.clear(data);
            if(this._worldBossInfoUpdateEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WORLDBOSS_INFO_UPDATE, this._worldBossInfoUpdateEventId);
                this._worldBossInfoUpdateEventId = 0;
            }
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

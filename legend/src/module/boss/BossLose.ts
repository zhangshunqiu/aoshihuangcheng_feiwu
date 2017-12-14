/**
 * Author: liuyonggen
 * 挑战Boss失败弹出窗口 2017/11/13
 */
module game{
    export class BossLose extends BaseView{
        public gp_go: eui.Group;
        public gp_return: eui.Image;
        public img_role: eui.Image;
        public img_wing: eui.Image;
        public img_forge: eui.Image;
        public img_raid: eui.Image;
        public list: eui.List;
        public scroller: eui.Scroller;
        public gp_middle: eui.Group;
        public countDownNum: number = 5;
        private _timerId: number = 0;
        public btlb_countDown: eui.BitmapLabel;
        public _bossModel: BossModel = BossModel.getInstance();

        public constructor(viewConf:WinManagerVO = null) {
            super(viewConf);
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.img_role.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openHeroWin, this);
            this.img_wing.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openWingWin, this);
            this.img_forge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openForgeWin, this);
            this.img_raid.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openRaidWin, this);
            this.gp_go.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openHeroWin, this);
            this.gp_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBack, this);
            if(App.RoleManager.heroList.length == 3) {
                this.gp_go.visible = false;
            }
        }

        private openHeroWin() {
            App.WinManager.openWin(WinName.HERO);
        }
        private openWingWin() {
            App.WinManager.openWin(WinName.WING);
        }

        private openForgeWin() {
            App.WinManager.openWin(WinName.FORGE);
        }

        private openRaidWin() {
            App.WinManager.openWin(WinName.RAIDER);
        }
        /**
         * 返回挂机场景
         */
        private onBack() {
            this.stopTime();
            App.WinManager.closeWin(WinName.BOSS_LOSE);
        }
    
        private timeUpdate(){
            if(this.countDownNum >=0){
                 this.btlb_countDown.text = this.countDownNum + "";
                this.countDownNum--;
            }else{
                this.stopTime();
                this.onBack();
            }
        }

        private initDropList() {
            this.list = new eui.List();
            this.list.itemRenderer = getItem;
            let layout = new eui.TileLayout();
            layout.requestedColumnCount = 4;
            layout.verticalGap = 10;
            layout.horizontalGap = 10;
            layout.horizontalAlign = egret.HorizontalAlign.LEFT;
            this.list.layout = layout;
            this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTap, this);  //点击物品弹出对应物品信息

            this.scroller.viewport = this.list;
            this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
            this.scroller.scrollPolicyV = eui.ScrollPolicy.ON;
            this.scroller.verticalScrollBar.autoVisibility = false;
            this.scroller.verticalScrollBar.visible = false;

            this.list.dataProvider = new eui.ArrayCollection([]);
        }

        
        private dropItem() {
            if(this.list){
                this.list.dataProvider = new eui.ArrayCollection(this._bossModel.dropItem); 
            }
        }

        /**
         * 点击弹出物品信息
         */
        private itemTap(event:eui.ItemTapEvent) {
            let itemData = event.item;
            App.GlobalTips.showItemTips(itemData.type, itemData.good_id, itemData.id);
        }

        /**
		 * 打开窗口
		 */
		public openWin(openParam:any = null):void{
			super.openWin(openParam);
            if(openParam == "encounter") {
                this.gp_middle.visible = false;
                this.initDropList();
                this.dropItem();
            }
            this.countDownNum = 5;
            if(this._timerId == 0){
                this._timerId = App.GlobalTimer.addSchedule(1000, 0, this.timeUpdate, this)
            }
		}

        /**
         * 停止计时器
         */
        private stopTime(){
            if(this._timerId != 0){
                App.GlobalTimer.remove(this._timerId);
                this._timerId = 0;
            }
        }

		/**
		 * 关闭窗口
		 */
		public closeWin(callback): void {
			super.closeWin(callback);
		}

        /**
		 * 清理
		 */
		public clear(data:any = null):void{
			super.clear();
            this.stopTime();
            App.GlobalTimer.remove(this._timerId);
            this._bossModel.wave = 0;   //把打小怪的波数清零
            App.EventSystem.dispatchEvent(PanelNotify.BOSS_WAVE_UPDATE);
            App.Socket.send(13001, {});
		}
		/**
		 * 销毁
		 */
		public destroy():void{
			super.destroy();
		}

    }

    class getItem extends eui.ItemRenderer {
		public baseItem : customui.BaseItem;
		public constructor() {
			super();
			this.skinName = `<?xml version="1.0" encoding="utf-8"?>
				<e:Skin class="getItemSkin" width="100" height="125" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing" xmlns:customui="customui.*">
					<e:Group id="gp_main" left="0" right="0" top="0" bottom="0">
						<customui:BaseItem id="baseItem" width="100" height="100" horizontalCenter="0" top="0" anchorOffsetX="0" anchorOffsetY="0"/>
					</e:Group>
				</e:Skin>`;
			this.baseItem.lb_name.visible = true;
	    }

        protected dataChanged() {
            this.data.id = this.data.id || this.data.good_id;
            this.data.type = this.data.type || ClientType.BASE_ITEM;
            this.data.num = this.data.num || this.data.good_num;
			this.baseItem.updateBaseItem(this.data.type, this.data.id, this.data.num);
            if (this.data.type == ClientType.EQUIP) {
				let info = App.ConfigManager.equipConfig()[this.data.good_id];
				if (info) {
					this.baseItem.lb_name.text = "LV:" + info.limit_lvl;
				}
			}
		}
    }
}
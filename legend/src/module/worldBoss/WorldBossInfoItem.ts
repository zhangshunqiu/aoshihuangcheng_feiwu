/**
 * Author: liuyonggen
 * 世界boss视图窗口 2017/12/5
 */
module game {
    export class WorldBossInfoItem extends BaseView {
        public pageView: PageView;
        public gp_main: eui.Group;
        public img_left: eui.Image;
        public img_right: eui.Image;
        public img_reward: eui.Image;
        public list: eui.List;
        public btn_challenge: eui.Button;
        public img_challenge: eui.Image;
        public gp_other: eui.Group;
        public worldBossInfo: any;
        public maxIndex: number = 0;

        private _eventId: number = 0;
        private _worldBossFightEventId: number = 0;
        private _vipModel: VipModel = VipModel.getInstance();
        private _worldBossModel: WorldBossModel = WorldBossModel.getInstance();

        public constructor() {
            super();
            this.skinName = "WorldBossInfoItem";
            this.initView();
        }

        public childrenCreated() {
            super.childrenCreated();
            this.img_left.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toLeft, this);
            this.img_right.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toRight, this);
            this.gp_main.addChild(this.pageView);
            this.btn_challenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.challengeBoss, this);
            this.img_reward.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                App.WinManager.openWin(WinName.WORLDBOSS_REWARD, this.worldBossInfo.worldBossItem);
            }, this);
            if(this._worldBossFightEventId == 0) {
                this._worldBossFightEventId = App.EventSystem.addEventListener(PanelNotify.WORLDBOSS_FIGHT, ()=>{
                    App.WinManager.closeWin(WinName.WORLDBOSS);
                    App.WinManager.openWin(WinName.WORLDBOSS_FIGHT, this.worldBossInfo);
                }, this);
            }
            if(this._eventId == 0) {
                this._eventId = App.EventSystem.addEventListener(PanelNotify.PAGE_CURRENTINDEX_UPDATE, this.onCurrentIndexUpdate, this);
            }
        }

        private challengeBoss() {
            if(this.worldBossInfo.pbWorldBossItem.status == 0) {
                let text = [{text:"等级不足或Boss未复活", style:{textColor:0xffffff,size:24,fontFamily:"SimHei"}}]
                App.GlobalTips.showTips(text);
            } else {
                if(this.worldBossInfo.pbWorldBossItem.left_times == 0) {
                App.WinManager.openWin(WinName.WORLDBOSS_BUY_TIMES);
                } else {
                    App.Socket.send(36002, {scene_id:this.worldBossInfo.worldBossItem.scene_id});
                } 
            }       
        }

        private initView() {
            this.pageView = new PageView();
			this.pageView.setTabbarEnabled(false);
			this.pageView.itemRenderer = backpackGroup;
			this.pageView.horizontalCenter = 1;
			this.pageView.height = 200;
			this.pageView.width = 450;
        }

        public updateView(data) {
            this.worldBossInfo = data;
            this._worldBossModel.changeToPage(data.worldBossItem);
            this.maxIndex = data.worldBossItem.killReward.length;
            this.pageView.dataProvider = new eui.ArrayCollection(data.worldBossItem.killReward);    
            if(data.worldBossItem.killReward.length < 2) {
                this.img_left.visible = false;
                this.img_right.visible = false;
            } else {
                this.onCurrentIndexUpdate();
            } 
            if(data.pbWorldBossItem.status == 1) {
                this.btn_challenge.currentState = "up";
            } else {
                this.btn_challenge.currentState = "down";
            }
        }

        public updateReward(data) {
            this.pageView.dataProvider = new eui.ArrayCollection(data);
            this.maxIndex = data.length;
            if(data.length < 2) {
                this.img_left.visible = false;
                this.img_right.visible = false;
            } else {
                this.onCurrentIndexUpdate();
            }
            this.gp_other.visible = false;
            this.btn_challenge.visible = false;
            this.img_challenge.visible = false;
        }

         private itemTap(event: eui.ItemTapEvent) {
            let itemData = event.item;
            App.GlobalTips.showItemTips(itemData[0], itemData[1], null);
        }

        private toLeft() {
            let index = this.pageView.currentIndex -1;
            App.loglyg("index",index);
            if(index >= 0) {
                this.pageView.jumpToPages(index);
                // this.pageView.currentIndex = index;
                this.onCurrentIndexUpdate();
            }
        }

        private toRight() {
            let index = this.pageView.currentIndex + 1;
            if(index <= 10) {
                this.pageView.jumpToPages(index);
                this.onCurrentIndexUpdate();
                // this.pageView.currentIndex = index;
            }
        }

        private onCurrentIndexUpdate() {
            if(this.pageView.currentIndex === 0) {
                this.img_left.visible = false;
                this.img_right.visible = true;
            } else if(this.pageView.currentIndex === this.maxIndex-1) {
                this.img_right.visible = false;
                this.img_left.visible = true;
            } else {
                this.img_left.visible = true;
                this.img_right.visible = true;
            }
        }

        public openWin(openParam: any = null): void {
            super.openWin(openParam);
        }

        /**
         * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
         */
        public clear(data: any = null): void {
            super.clear(data);
            if(this._eventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.PAGE_CURRENTINDEX_UPDATE, this._eventId);
                this._eventId = 0;
            }
            if(this._worldBossFightEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WORLDBOSS_FIGHT, this._worldBossFightEventId);
                this._worldBossFightEventId = 0;
            }
        }
        /**
         * 销毁
         */
        public destroy(): void {
            super.destroy();
        }
    }

    class backpackGroup extends PageViewItem {
		public list: eui.List;
		public constructor() {
			super();
			this.skinName = `<?xml version="1.0" encoding="utf-8"?>
				<e:Skin class="backpackItemSkin" width="500" height="200" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing" xmlns:customui="customui.*">
					<e:List id="list" width="500" height="200">
						
					</e:List>
				</e:Skin>`;
			let layout = new eui.TileLayout();
			layout.requestedColumnCount = 4;
			layout.requestedRowCount = 2;
            layout.verticalGap = -15;
            layout.verticalAlign = egret.VerticalAlign.JUSTIFY;
			layout.horizontalAlign = egret.HorizontalAlign.JUSTIFY;
			this.list.layout = layout;
			this.list.itemRenderer = backpackItem;
            this.list.x = 20;
            this.list.addEventListener(egret.TouchEvent.TOUCH_MOVE, (e:Event)=>{
                e.stopImmediatePropagation();
            }, this)
			this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTap, this);
		}

		public reload(data) {
			this.list.dataProvider = new eui.ArrayCollection(data);
		}

		private itemTap(event: eui.ItemTapEvent) {
			let itemData = event.item;
            App.GlobalTips.showItemTips(itemData[0], itemData[1], null);
		}
	}

    class backpackItem extends eui.ItemRenderer {
		public baseItem: customui.BaseItem;
		public constructor() {
			super();
			this.skinName = `<?xml version="1.0" encoding="utf-8"?>
				<e:Skin class="backpackItemSkin" width="100" height="125" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing" xmlns:customui="customui.*">
					<e:Group id="gp_main" left="0" right="0" top="0" bottom="0">
						<customui:BaseItem id="baseItem" width="100" height="100" horizontalCenter="0" top="0" anchorOffsetX="0" anchorOffsetY="0"/>
					</e:Group>
				</e:Skin>`;
			this.baseItem.lb_name.visible = false;
		}

		protected dataChanged() {
            this.baseItem.updateBaseItem(this.data[0], this.data[1], this.data[2]);
			if (this.data.type == ClientType.EQUIP) {
				let info = App.ConfigManager.equipConfig()[this.data.good_id];
				this.baseItem.lb_name.text = "LV:" + info.limit_lvl;
			}
		}

	}
}

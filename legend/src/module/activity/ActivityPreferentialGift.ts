/**
 * module: 每日竞技
 * author : liuyonggen
*/
module game {
	export class ActivityPreferentialGift extends BaseChildView {
        public gp_main: eui.Group;
        public gp_top: eui.Group;
        public gp_gift0: eui.Group;
        public gp_gift1: eui.Group;
        public gp_gift2: eui.Group;
        public gp_gift3: eui.Group;
        public lb_gold: eui.Label;
        public lb_name: eui.Label;
        public lb_day: eui.Label;
        public lb_hour: eui.Label;
        public lb_minute: eui.Label;
        public img_display: eui.Image;
        public btn_buy: eui.Button;
        public list: eui.List;

        public _currentIndex: number = 0;

		private _activityModel :ActivityModel = ActivityModel.getInstance();

		public constructor(skinName: string) {
			super(skinName);
			this.skinName = "ActivityPreferentialGift"
		}

		protected childrenCreated() {
			super.childrenCreated();
            for(let i:number=0; i<4; i++) {
                this["gp_gift"+i].addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                    this._currentIndex = i;
                    this.updateView();
                }, this);
            }
            this.list.itemRenderer = backpackItem;
            let layout = new eui.TileLayout();
			layout.requestedColumnCount = 3;
			layout.verticalGap = 15;
			layout.horizontalAlign = egret.HorizontalAlign.JUSTIFY;
			this.list.layout = layout;
            this.list.dataProvider = new eui.ArrayCollection([]);
            this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTap, this);
            this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                App.Socket.send(30007, {id: this._currentIndex + 1});
            }, this);    
		}

        private itemTap(event: eui.ItemTapEvent) {
            let itemData = event.item;
            App.GlobalTips.showItemTips(itemData[0], itemData[1], null);
        }

		public updateView() {
            let info = App.ConfigManager.getRechargeGiftInfoById(this._currentIndex + 1);
            this.lb_gold.text = info.gold;
            this.lb_name.text = info.name;
            this.img_display.source = info.icon + "_png";
            this.list.dataProvider = new eui.ArrayCollection(info.reward);
            this.lb_day.text = Math.floor(this._activityModel.perferentialGiftInfo.left_time / (3600 *24)) + "";
            this.lb_hour.text = Math.floor((this._activityModel.perferentialGiftInfo.left_time / 3600) % 24) + "";
            this.lb_minute.text = Math.floor((this._activityModel.perferentialGiftInfo.left_time / 60) % 60) + "";
            if(this._activityModel.perferentialGiftInfo.list[this._currentIndex].state == 1) {
                this.btn_buy.currentState = "up";
            } else {
                this.btn_buy.currentState = "down";
            }

		}

		/**
		 * 打开窗口
		 */
		public open(openParam: any = null): void {
			super.open(openParam);
			App.Socket.send(30006,{});
		}

		/**
		 * 清理
		 */
		public clear(data: any = null): void {
			super.clear(data);
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
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
			this.baseItem.lb_name.visible = true;
            this.baseItem.lb_num.visible = false;
		}

		protected dataChanged() {
            this.baseItem.updateBaseItem(this.data[0], this.data[1], this.data[2]);
			if (this.data[1] == ClientType.EQUIP) {
				let info = App.ConfigManager.equipConfig()[this.data.good_id];
				if (info) {
					this.baseItem.lb_name.text = "LV:" + info.limit_lvl;
				}
			}
		}

	} 		
}
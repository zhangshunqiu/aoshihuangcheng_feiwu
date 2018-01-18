/**
 * module : 背包模块视图
 * author ：zrj
 * 
*/
module game {
	export class BackpackView extends BaseView {
		public gp_main: eui.Group;
		public btn_back: eui.Button;
		public com_baseview: ComBaseViewBg;
		public btn_smelt: eui.Button;
		public btn_orange: eui.Button;
		public lb_capacity: eui.Label;
		public tabbar: eui.TabBar;
		public scroller: eui.Scroller;
		public vs_stack: eui.ViewStack;
		public _listPos: number = 0;

		public list: eui.List;
		private _source : eui.ArrayCollection;
		private backpackModel: BackpackModel = BackpackModel.getInstance();
		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
		}

		protected childrenCreated() {
			super.childrenCreated();
			// this.img_close = this.commonWin.img_close;
			// RES.getResAsync("bag_title_png", (texture) => {
			// 	this.commonWin.img_title.source = texture;
			// }, this);
			this.btn_smelt.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
				// App.WinManager.openWin(WinName.SMELT);
				App.WinManager.openPopWin(WinName.POP_SMELT);
			}, this);
			this.btn_orange.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
				App.WinManager.openWin(WinName.POP_SMELT_ORANGE);
			}, this);

			App.EventSystem.addEventListener(PanelNotify.HERO_ON_HERO_BAG_UPDATE, this.updateView, this);
			this.initView();
		}

		private initView() {
			this.tabbar.dataProvider = new eui.ArrayCollection(["装备", "道具", "功能道具"]);
			this.tabbar.selectedIndex = 0;

			this.list = new eui.List();
			this.list.itemRenderer = backpackItem;
			let layout = new eui.TileLayout();
			layout.requestedColumnCount = 5;
			layout.verticalGap = 5;//10;
			layout.horizontalGap = 35;//20;
			layout.horizontalAlign = egret.HorizontalAlign.LEFT;
			this.list.layout = layout;
			this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTap, this);

			this.scroller.viewport = this.list;
			this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
			this.scroller.scrollPolicyV = eui.ScrollPolicy.ON;
			this.scroller.verticalScrollBar.autoVisibility = false;
			this.scroller.verticalScrollBar.visible = false;
			// this.scroller.viewport.scrollPolicyV

			this.tabbar.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.changedIndex, this)

			// this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
			// 	App.WinManager.closeWin(WinName.BACKPACK);
			// }, this);

             this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
				App.WinManager.closeWin(WinName.BACKPACK);
			 }, this);

			this.list.dataProvider = new eui.ArrayCollection([]);
			let event = new eui.ItemTapEvent("");
			event.itemIndex = 0;
			this.changedIndex(event);
			this.updateView();
		}

		private itemTap(event: eui.ItemTapEvent) {
			let itemData = event.item;
			App.GlobalTips.showItemTips(itemData.type, itemData.good_id, itemData.id);
		}

		private changedIndex(event: eui.ItemTapEvent) {
			let backpackModel = BackpackModel.getInstance() as BackpackModel;
			let data = undefined;
			let index = event ? event.itemIndex : this.tabbar.selectedIndex;
			switch (index) {
				// case 0: { //所有
				// 	data = backpackModel.equipBackpack.concat(<EquipVO[]>backpackModel.itemBackpack, <EquipVO[]>backpackModel.chestBackpack);
				// 	break;
				// }
				case 0: {
					data = backpackModel.equipBackpack;
					break;
				}
				case 1: {
					data = backpackModel.itemBackpack;
					break;
				}
				case 2: {
					data = backpackModel.chestBackpack;
					break;
				}
			}
			if (!this._source) {
				this._source = new eui.ArrayCollection(data);
				this.list.dataProvider = this._source;
			} else {
				this._source.source = data;
			}
			if (event) {
				this.scroller.stopAnimation();
				this._listPos = 0;
			}		}

		public updateView() {
			
			if (this.list.scrollV) {
				this._listPos = this.list.scrollV;
			}
			
			this.changedIndex(null);
			this.validateNow();
			this.list.scrollV = this._listPos;
			// this.once(egret.Event.ENTER_FRAME, ()=>{
			// 	this.list.scrollV = this._listPos;
			// }, this);
				
			this.lb_capacity.text ="容量："+ this.backpackModel.capacity + "/" + this.backpackModel.maxCapacity;
		}

		public checkGuide() {
			// App.GuideManager.bindClickBtn(this.btn_smelt,1008,2);
			// App.GuideManager.checkGuide(1008);
		}

		public removeGuide() {
			// App.GuideManager.removeClickBtn(1008,2);
		}

		/**
		 * 打开窗口
		 * openParam.index 打开第几页
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			// App.Socket.send(14001,{});
			if(this.com_baseview){
				this.com_baseview.winVo = this.winVo;
			}
			let event = new eui.ItemTapEvent("");
			event.itemIndex = 0;
			if (openParam && openParam.index != null) {
				event.itemIndex = openParam.idex;
			}

			if (this.isCreated) {
				this.changedIndex(event);
			}
			App.EventSystem.addEventListener(PanelNotify.HERO_ON_HERO_BAG_UPDATE, this.updateView, this);
			this.checkGuide();
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
		public clear(data: any = null): void {
			super.clear();
			App.EventSystem.removeEventListener(PanelNotify.HERO_ON_HERO_BAG_UPDATE);
			this.removeGuide();
			if (this.com_baseview) {
				this.com_baseview.destroy();
			}
		}
		/**
		 * 销毁
		 */
		public destroy(): void {

		}
	}

	class backpackItem extends eui.ItemRenderer {
		public baseItem: customui.BaseItem;
		public constructor() {
			super();
			this.skinName = `<?xml version="1.0" encoding="utf-8"?>
				<e:Skin class="backpackItemSkin" width="100" height="125" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing" xmlns:customui="customui.*">
					<e:Group id="gp_main" left="0" right="0" top="0" bottom="0">
						<customui:BaseItem id="baseItem" width="90" height="90" horizontalCenter="0" top="0" anchorOffsetX="0" anchorOffsetY="0"/>
					</e:Group>
				</e:Skin>`;
			this.baseItem.setItemNameVisible(true);
			this.baseItem.setStopShowTips(true);
			this.baseItem.setItemNumVisible(true);
		}

		protected dataChanged() {
			this.baseItem.updateBaseItem(this.data.type, this.data.good_id, this.data.num);
			this.baseItem.setItemNameAtt({textColor:0xbfb294});
		}

	}
}

// module game {
// 	export class BackpackView extends BaseView {
// 		public gp_main: eui.Group;
// 		public img_close: eui.Image;
// 		public commonWin: customui.CommonWin;
// 		public btn_smelt: eui.Button;
// 		public btn_orange: eui.Button;
// 		public lb_capacity: eui.Label;
// 		public tabbar: eui.TabBar;
// 		public scroller: eui.Scroller;
// 		public vs_stack: eui.ViewStack;
// 		public pageView: PageView;

// 		public list: eui.List;
// 		private backpackModel: BackpackModel = BackpackModel.getInstance();
// 		public constructor(viewConf: WinManagerVO = null) {
// 			super(viewConf);
// 		}

// 		protected childrenCreated() {
// 			super.childrenCreated();
// 			this.img_close = this.commonWin.img_close;
// 			RES.getResAsync("bag_title_png", (texture) => {
// 				this.commonWin.img_title.source = texture;
// 			}, this);
// 			this.btn_smelt.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
// 				App.WinManager.openWin(WinName.SMELT);
// 			}, this);
// 			this.btn_orange.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
// 				App.WinManager.openWin(WinName.POP_SMELT_ORANGE);
// 			}, this);

// 			App.BtnTipManager.addBtnTipItem(ConstBtnTipType.BACKPACK_SMELT,this.btn_smelt);
// 			App.BtnTipManager.addBtnTipItem(ConstBtnTipType.BACKPACK_SMELTORANGE,this.btn_orange);
// 			this.initView();
// 			this.validateNow();
// 		}

// 		private initView() {
// 			this.tabbar.dataProvider = new eui.ArrayCollection(["全部", "装备", "道具", "功能道具"]);
// 			this.tabbar.selectedIndex = 0;
// 			this.pageView = new PageView();
// 			this.pageView.setTabbarEnabled(true);
// 			this.pageView.itemRenderer = backpackGroup;
// 			this.pageView.horizontalCenter = 1;
// 			this.pageView.y = 135;
// 			this.pageView.height = 600;
// 			this.pageView.width = 600;
// 			this.gp_main.addChild(this.pageView);

// 			this.tabbar.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.changedIndex, this)

// 			this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
// 				App.WinManager.closeWin(WinName.BACKPACK);
// 			}, this);

// 			this.pageView.dataProvider = new eui.ArrayCollection([]);
// 			// let event = new eui.ItemTapEvent("");
// 			// event.itemIndex = 0;
// 			// this.changedIndex(event);
// 			this.updateView();
// 		}

// 		private itemTap(event: eui.ItemTapEvent) {
// 			let itemData = event.item;
// 			App.GlobalTips.showItemTips(itemData.type, itemData.good_id, itemData.id);

// 		}

// 		private changedIndex(event: eui.ItemTapEvent) {
// 			let backpackModel = BackpackModel.getInstance() as BackpackModel;
// 			let data: Array<any> = undefined;
// 			let index = event ? event.itemIndex : this.tabbar.selectedIndex;
// 			switch (index) {
// 				case 0: { //所有
// 					data = backpackModel.equipBackpack.concat(<EquipVO[]>backpackModel.itemBackpack, <EquipVO[]>backpackModel.chestBackpack);
// 					break;
// 				}
// 				case 1: {
// 					data = backpackModel.equipBackpack;
// 					break;
// 				}
// 				case 2: {
// 					data = backpackModel.itemBackpack;
// 					break;
// 				}
// 				case 3: {
// 					data = backpackModel.chestBackpack;
// 					break;
// 				}
// 			}
// 			let finalData = [];
// 			let count = Math.floor(data.length / 25);
// 			for (let i = 0; i < count; i++) {
// 				finalData.push(data.slice(i * 25, (i + 1) * 25));
// 			}
// 			if (count * 25 != data.length) {
// 				finalData.push(data.slice(count * 25, data.length));
// 			}
// 			if (!event) { //刷新当前页面
// 				let curIndex = this.pageView.currentIndex;
// 				this.pageView.dataProvider = new eui.ArrayCollection(finalData);
// 				this.pageView.currentIndex = curIndex;
// 			} else {
// 				this.pageView.dataProvider = new eui.ArrayCollection(finalData);
// 			}
// 		}

// 		public updateView() {
// 			this.changedIndex(null);
// 			this.lb_capacity.text = this.backpackModel.capacity + "/" + this.backpackModel.maxCapacity;
// 		}

// 		public checkGuide() {
// 			// App.GuideManager.bindClickBtn(this.btn_smelt,1008,2);
// 			// App.GuideManager.checkGuide(1008);
// 		}

// 		public removeGuide() {
// 			// App.GuideManager.removeClickBtn(1008,2);
// 		}

// 		/**
// 		 * 打开窗口
// 		 * openParam.index 打开第几页
// 		 */
// 		public openWin(openParam: any = null): void {
// 			super.openWin(openParam);
// 			// App.Socket.send(14001,{});
// 			let event = new eui.ItemTapEvent("");
// 			event.itemIndex = 0;
// 			if (openParam && openParam.index != null) {
// 				event.itemIndex = openParam.idex;
// 			}
// 			App.EventSystem.addEventListener(PanelNotify.HERO_ON_HERO_BAG_UPDATE, this.updateView, this);
// 			this.changedIndex(event);
// 			this.checkGuide();
// 			App.EventSystem.dispatchEvent(PanelNotify.BACKPACK_OPENWIN);
// 		}

// 		/**
// 		 * 关闭窗口
// 		 */
// 		public closeWin(callback): void {
// 			super.closeWin(callback);
// 		}

// 		/**
// 		 * 清理
// 		 */
// 		public clear(data: any = null): void {
// 			super.clear();
// 			App.EventSystem.removeEventListener(PanelNotify.HERO_ON_HERO_BAG_UPDATE);
// 			this.removeGuide();
// 			App.EventSystem.dispatchEvent(PanelNotify.BACKPACK_CLOSEWIN);
// 		}
// 		/**
// 		 * 销毁
// 		 */
// 		public destroy(): void {
// 			super.destroy();
// 		}
// 	}

// 	class backpackItem extends eui.ItemRenderer {
// 		public baseItem: customui.BaseItem;
// 		public constructor() {
// 			super();
// 			this.skinName = `<?xml version="1.0" encoding="utf-8"?>
// 				<e:Skin class="backpackItemSkin" width="100" height="125" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing" xmlns:customui="customui.*">
// 					<e:Group id="gp_main" left="0" right="0" top="0" bottom="0">
// 						<customui:BaseItem id="baseItem" width="100" height="100" horizontalCenter="0" top="0" anchorOffsetX="0" anchorOffsetY="0"/>
// 					</e:Group>
// 				</e:Skin>`;
// 			this.baseItem.lb_name.visible = true;
// 			this.baseItem.setStopShowTips(true);
// 		}

// 		protected dataChanged() {
// 			this.baseItem.updateBaseItem(this.data.type, this.data.good_id, this.data.num);
// 		}

// 	}

// 	class backpackGroup extends PageViewItem {
// 		public list: eui.List;
// 		public constructor() {
// 			super();
// 			this.skinName = `<?xml version="1.0" encoding="utf-8"?>
// 				<e:Skin class="backpackItemSkin" width="600" height="600" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing" xmlns:customui="customui.*">
// 					<e:List id="list" left="10" right="0" top="0" bottom="0">
						
// 					</e:List>
// 				</e:Skin>`;
// 			let layout = new eui.TileLayout();
// 			layout.requestedColumnCount = 5;
// 			layout.requestedRowCount = 5;
// 			layout.verticalGap = -4;
// 			layout.horizontalGap = 20;
// 			layout.horizontalAlign = egret.HorizontalAlign.JUSTIFY;
// 			this.list.layout = layout;
// 			this.list.itemRenderer = backpackItem;
// 			this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTap, this);
// 			// this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTap, this,false);
// 		}

// 		public reload(data) {
// 			this.list.dataProvider = new eui.ArrayCollection(data);
// 		}

// 		private itemTap(event: eui.ItemTapEvent) {
// 			let itemData = event.item;
// 			App.GlobalTips.showItemTips(itemData.type, itemData.good_id, itemData.id);

// 		}

// 	}
// }
/**
* module : 寻宝模块  橙装移动到这里来了
* author : zrj
*openParam: {index:代表打开哪个标签}
*/
module game {
	export class RaiderView extends BaseView {
		public gp_main: eui.Group;
		public commonWin: customui.CommonWin;
		public gp_raid: eui.Group;
		public gp_storage: eui.Group;
		public gp_orange : eui.Group;
		public gp_broadcast: eui.Group;
		public img_withdraw: eui.Image;
		public btn_buyone: eui.Button;
		public btn_buyten: eui.Button;
		public img_costone: eui.Image;
		public lb_costone: eui.Label;
		public img_costten: eui.Image;
		public lb_costten: eui.Label;
		public lb_capacity: eui.Label;
		public gp_bottom: eui.Group;
		public tabbar: eui.TabBar;
		public img_return : eui.Image;
		public img_title : eui.Image;
		public img_close : eui.Image;
		public gp_page : eui.Group;
		public forgeOrangeView : ForgeOrangeView;
		public pageView: PageView = new PageView();

		private _itemArray: Array<customui.BaseItem> = [];
		private heroModel: HeroModel = HeroModel.getInstance();
		private raiderModel: RaiderModel = RaiderModel.getInstance();
		private _rewardView : RaiderRewardView;
		private _lastModuleName : string;

		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.initView();
		}

		private initView() {
			this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeRaider, this);
			this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.returnPreview, this);
			this.tabbar.dataProvider = new eui.ArrayCollection(["寻宝", "橙装", "仓库"]);
			this.tabbar.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.changeIndex, this);
			this.tabbar.selectedIndex = 0;
			this.img_withdraw.addEventListener(egret.TouchEvent.TOUCH_TAP, this.withdrawAll, this);
			this.btn_buyone.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buyOne, this);
			this.btn_buyten.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buyTen, this);
			
			this.initRaiderEquip();
			this.initStorage();
			this.gp_raid.visible = true;
			this.gp_storage.visible = false;
			this.gp_orange.visible = false;
			// this.updateRaiderEquip();

		}

		private initRaiderEquip() {
			let posXArray = [100, 215, 505, 620];
			for (let i = 0; i < 12; i++) {
				let item = new customui.BaseItem();
				item.x = posXArray[i % 4];
				item.y = 60 + (Math.floor(i / 4)) * 130;
				this.gp_raid.addChild(item);
				this._itemArray.push(item);
			}

			//中间两个
			let item = new customui.BaseItem();
			item.x = 360;
			item.y = 140;
			this.gp_raid.addChild(item);
			this._itemArray.push(item);

			let item2 = new customui.BaseItem();
			item2.x = 360;
			item2.y = 305;
			this.gp_raid.addChild(item2);
			this._itemArray.push(item2);

			// for (let i = 0; i < this._itemArray.length; i++) {
			// 	this._itemArray[i].addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			// 		this._itemArray[i].showItemInfo();
			// 	}, this);
			// }

			//播报布局
			let layout = new eui.VerticalLayout();
			layout.gap = 20;
			layout.paddingLeft = 60;
			layout.paddingTop = 10;
			this.gp_broadcast.layout = layout;

		}

		private changeIndex(event: eui.ItemTapEvent) {
			let index = event.itemIndex;
			if (index == 0) {
				this.gp_raid.visible = true;
				this.gp_storage.visible = false;
				this.gp_orange.visible = false;
				this.updateRaiderEquip();
			} else if (index == 1) {
				// App.WinManager.openWin(WinName.FORGE_ORANGE, { lastModule: WinName.RAIDER });
				this.gp_raid.visible = false;
				this.gp_storage.visible = false;
				this.gp_orange.visible = true;
				this.updateOrangeView();
			} else if (index == 2) {
				this.gp_raid.visible = false;
				this.gp_storage.visible = true;
				this.gp_orange.visible = false;
				// this.updateStorage();
				App.Socket.send(26005, {});
			} else {
				this.gp_raid.visible = true;
				this.gp_storage.visible = false;
				this.updateRaiderEquip();
			}
		}

		private initStorage() {
			this.pageView.setTabbarEnabled(true);
			this.pageView.itemRenderer = RaiderStorageGroup;
			this.pageView.horizontalCenter = 0;
			this.pageView.width = this.gp_page.width;
			this.pageView.height = this.gp_page.height;
			this.gp_page.addChild(this.pageView);
			// this.pageView.left = this.pageView.right = this.pageView.top = this.pageView.bottom = 0;
			this.pageView.dataProvider = new eui.ArrayCollection([]);
			this.pageView.setTabbarOffset(-50);
		}

		//更新寻宝界面
		private updateRaiderEquip() {
			RES.getResAsync("raider_xunbao_title_png", (texture) => {
				this.commonWin.img_title.texture = texture;
			}, this);
			let temp = App.ConfigManager.getRaiderInfoByDay(this.raiderModel.curDay);
			let data = [];
			for( let i=0;i< temp.length;i++) {
				if (temp[i].career == this.heroModel.getCurHero().job || temp[i].career == 0) {
					data.push(temp[i]);
				}
			}
			for (let i = 0; i < this._itemArray.length; i++) {
				for (let k in data) {
					if (data[k].house_id == i + 1) {
						this._itemArray[i].updateBaseItem(data[k].type, data[k].item);
						if(data[k].house_id <=12) {
							this._itemArray[i].setItemNameVisible(true);
						}
						break;
					}
				}
			} 
			
			//寻宝记录
			this.gp_broadcast.removeChildren();
			for(let k in this.raiderModel.storageRecord) {
				let info = this.raiderModel.storageRecord[k];
				let itemInfo = undefined;
				if(info.good_type == ClientType.BASE_ITEM) {
					itemInfo = App.ConfigManager.getItemInfoById(info.good_id);
				} else {
					itemInfo = App.ConfigManager.getEquipById(info.good_id);
				}
				let label = new eui.Label();
				label.fontFamily = "SimHei";
				label.size = 24;
				label.textFlow= [{text:info.player_nick,style:{textColor:0x5cbcff}},{text:"获得了"},{text:itemInfo.name,style:{textColor:0xf6a527}}];
				this.gp_broadcast.addChild(label);
				label.left = 80;
			}

			let itemInfo = BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, App.ConfigManager.getConstConfigByType("TREASURE_GOODS").value);
			if (!itemInfo) {
				RES.getResAsync("common_yuanbao_png", (texture) => {
					this.img_costone.source = texture;
				}, this);
				this.lb_costone.text = String(App.ConfigManager.getConstConfigByType("TREASURE_GOLD").value);
			} else {
				RES.getResAsync(itemInfo.icon + "_png", (texture) => {
					this.img_costone.source = texture;
				}, this);
				this.lb_costone.text = "*1";
			}

			this.lb_costten.text = String(App.ConfigManager.getConstConfigByType("TREASURE_GOLDS").value);
		}

		//更新仓库
		public updateStorage() {
			RES.getResAsync("raider_cangku_title_png", (texture) => {
				this.commonWin.img_title.texture = texture;
			}, this);
			let finalData = [];
			let data = this.raiderModel.storageItem;
			let count = Math.floor(data.length / 25);
			for (let i = 0; i < count; i++) {
				finalData.push(data.slice(i * 25, (i + 1) * 25));
			}
			if (count * 25 != data.length) {
				finalData.push(data.slice(count * 25, data.length));
			}

			this.pageView.dataProvider = new eui.ArrayCollection(finalData);

			this.lb_capacity.text = "容量："+this.raiderModel.storageCapacity + "/" + App.ConfigManager.getConstConfigByType("TREASURE_WAREHOUSE").value;
		}

		//更新显示橙装界面
		public updateOrangeView() {
			RES.getResAsync("raider_chengzhuang_title_png", (texture) => {
				this.commonWin.img_title.texture = texture;
			}, this);
			this.forgeOrangeView.updateView(null);
		}

		public updateView() {
			this.updateRaiderEquip();
		}

		//打开寻宝奖励
		public openReward(data) {
			// if (this._rewardView && this._rewardView.parent) { //还存在奖励界面
			// 	PopUpManager.removePopUp(this._rewardView);
			// 	this._rewardView = undefined;
			// }
			// this._rewardView = new RaiderRewardView(data);
			// PopUpManager.addPopUp({obj:this._rewardView});
			App.WinManager.openWin(WinName.POP_RAIDER_REWARD,{data:data});
		}

		//从仓库中取出所有
		private withdrawAll() {
			App.Socket.send(26006, {});
		}

		private closeRaider() {
			App.WinManager.closeWin(WinName.RAIDER);
		}

		private returnPreview() {
			App.WinManager.closeWin(WinName.RAIDER);
			if (this._lastModuleName) {
				App.WinManager.openWin(this._lastModuleName);
			}
		}


		private buyOne() {
			App.Socket.send(26003,{});
		}

		private buyTen() {
			App.Socket.send(26004,{});
		}

		/**
		 * 打开窗口
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			if (openParam) {
				this._lastModuleName = openParam.lastModule; //上次打开模块
				if (openParam.index || openParam.index == 0) {
					let event = new eui.ItemTapEvent("");
					event.itemIndex = openParam.index;
					this.tabbar.selectedIndex = openParam.index;
					this.changeIndex(event);
				}
			}
			this.forgeOrangeView.openWin(openParam);
			App.EventSystem.addEventListener(PanelNotify.RAIDER_UPDATE_VIEW, this.updateView, this);
			App.EventSystem.addEventListener(PanelNotify.RAIDER_OPEN_REWARD, this.openReward, this);
			App.EventSystem.addEventListener(PanelNotify.RAIDER_UPDATE_STORAGE, this.updateStorage, this);
			App.Socket.send(26001, {});
		}

		/**
		 * 关闭窗口
		 */
		public closeWin(callback): void {
			super.closeWin(callback);
			this.forgeOrangeView.closeWin(callback);
		}

		/**
		 * 清理
		 */
		public clear(data: any = null): void {
			super.clear(data);
			this.forgeOrangeView.clear(data);
			App.EventSystem.removeEventListener(PanelNotify.RAIDER_UPDATE_VIEW);
			App.EventSystem.removeEventListener(PanelNotify.RAIDER_OPEN_REWARD);
			App.EventSystem.removeEventListener(PanelNotify.RAIDER_UPDATE_STORAGE);
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
			this.forgeOrangeView.destroy();
		}
	}

	class RaiderStorageItem extends eui.ItemRenderer {
		public baseItem: customui.BaseItem;
		public constructor() {
			super();
			this.skinName = `<?xml version="1.0" encoding="utf-8"?>
				<e:Skin class="RaiderStorageItemSkin" width="100" height="125" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing" xmlns:customui="customui.*">
					<e:Group id="gp_main" left="0" right="0" top="0" bottom="0">
						<customui:BaseItem id="baseItem" width="100" height="100" horizontalCenter="0" top="0" anchorOffsetX="0" anchorOffsetY="0"/>
					</e:Group>
				</e:Skin>`;
			this.baseItem.setItemNameVisible(true);
			// this.baseItem.setStopShowTips(true);
		}

		protected dataChanged() {
			this.baseItem.updateBaseItem(this.data.good_type, this.data.good_id, this.data.num);
			this.baseItem.setItemNameAtt({size:22});
			this.baseItem.setItemNameAtt({y:96});
		}

	}

	class RaiderStorageGroup extends PageViewItem {
		public list: eui.List;
		public constructor() {
			super();
			this.skinName = `<?xml version="1.0" encoding="utf-8"?>
				<e:Skin class="RaiderStorageGroupSkin" width="580" height="640" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing" xmlns:customui="customui.*">
					<e:List id="list" left="0" right="0" top="0" bottom="0">
						
					</e:List>
				</e:Skin>`;
			let layout = new eui.TileLayout();
			layout.requestedColumnCount = 5;
			layout.requestedRowCount = 5;
			layout.verticalGap = 0;
			layout.horizontalGap = 20;
			layout.horizontalAlign = egret.HorizontalAlign.JUSTIFY;
			this.list.layout = layout;
			this.list.itemRenderer = RaiderStorageItem;
			// this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTap, this);
		}

		public reload(data) {
			this.list.dataProvider = new eui.ArrayCollection(data);
		}

		private itemTap(event: eui.ItemTapEvent) {
			let itemData = event.item;
			App.GlobalTips.showItemTips(itemData.good_type, itemData.good_id, itemData.id);
		}

	}

}
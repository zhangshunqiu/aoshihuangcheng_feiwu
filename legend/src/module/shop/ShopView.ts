/**
 * module ： 商城模块视图
 * author : zrj
*/
module game {
	export class ShopView extends BaseView {
		public gp_main: eui.Group;
		public img_close: eui.Image;
		public img_return: eui.Image;
		public tabbar: eui.TabBar;
		public scroller: eui.Scroller;
		public gp_nexttime: eui.Group;
		public lb_nexttime: eui.Label;
		public lb_tip: eui.Label;
		public gp_refresh: eui.Group;
		public img_refresh: eui.Image;
		public lb_cost: eui.Label;
		public lb_over_tip: eui.Label;
		public img_girl:eui.Label;
		public lb_desc:eui.Label;
		public lb_preview:eui.Label;
		public comBaseBg:ComBaseViewBg;
		private list: eui.List = new eui.List();
		private shopModel: ShopModel = ShopModel.getInstance();
		private timeHandle: number; //当前倒计时handle
		private _offset = 0;//偏移量

		private _subview: ShopBuyWinView; //数量选择窗口
		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				App.WinManager.closeWin(WinName.SHOP);
			}, this);
			this.initView();
		}

		private initView() {
			this.comBaseBg.winVo = this.winVo;
			this.lb_preview.textFlow = [{ text: "极品预览", style: { underline: true } }];
			this.lb_preview.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
				WinManager.getInstance().openPopWin(WinName.POP_SHOP_PREVIEW);
			},this)
			this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				App.WinManager.closeWin(WinName.SHOP);
			}, this);
			//刷新神秘商店
			this.img_refresh.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				App.Socket.send(16004, {});
			}, this);

			let data = ["神秘商店", "限购商店", "道具商店"];
			this.tabbar.dataProvider = new eui.ArrayCollection(data);
			this.tabbar.addEventListener(eui.ItemTapEvent.ITEM_TAP, (event: eui.ItemTapEvent) => {
				if (event.itemIndex == null) {
					App.Socket.send(16001, {});
				} else if (event.itemIndex == 0) {
					App.Socket.send(16001, {});
				} else if (event.itemIndex == 1) {
					App.Socket.send(16002, {});
				} else if (event.itemIndex == 2) {

				}
				this.changedIndex(event.itemIndex);
			}, this);
			this.list.itemRenderer = ShopItem;
			this.scroller.viewport = this.list;
			this.scroller.verticalScrollBar.autoVisibility = false;
			this.scroller.verticalScrollBar.visible = false;
			this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
			this.list.layout = new eui.VerticalLayout();
			(this.list.layout as eui.VerticalLayout).gap = 5;
			this.list.dataProvider = new eui.ArrayCollection([{ "id": 1, "goods": 1, "money": 1, "number": 10 }]);
			this.tabbar.selectedIndex = 0;
			this.list.validateNow();
			this.validateNow();
		}

		private showBuyWin(data) {
			App.WinManager.openWin(WinName.POP_SHOP_BUY, { data: data });
			// if (!this._subview) {
			// 	this._subview = new ShopBuyWinView(data);
			// 	PopUpManager.addPopUp({ obj: this._subview });
			// } else if(this._subview){
			// 	PopUpManager.removePopUp(this._subview);
			// 	this._subview = undefined;
			// 	this._subview = new ShopBuyWinView(data);
			// 	PopUpManager.addPopUp({ obj: this._subview });
			// }else if (this._subview && this._subview.parent) {
			// 	PopUpManager.removePopUp(this._subview);
			// 	this._subview = undefined;
			// 	this._subview = new ShopBuyWinView(data);
			// 	PopUpManager.addPopUp({ obj: this._subview });
			// }
		}

		private closeBuyWin() {
			App.WinManager.closeWin(WinName.POP_SHOP_BUY);
			// if(this._subview){
			// 	PopUpManager.removePopUp(this._subview);
			// 	this._subview = undefined;
			// }else if (this._subview && this._subview.parent) {
			// 	PopUpManager.removePopUp(this._subview);
			// 	this._subview = undefined;
			// }
		}

		private changedIndex(index) {
			App.logzrj("index:  ", index);
			this.scroller.stopAnimation();
			this.scroller.bottom = 175;
			this.lb_over_tip.visible = false;
			if (this.timeHandle) {
				egret.clearInterval(this.timeHandle);
				this.lb_nexttime.text = "";
			}
			if (index == null) {
				this.updateMysteryShop();
			} else if (index == 0) {
				this.img_girl.visible = true;
				this.lb_desc.text = "点击刷新有\n惊喜哦!"
				this.lb_preview.visible = true;
				this.updateMysteryShop();
				this.checkGuide();
			} else if (index == 1) {
				this.lb_desc.text = "机不可失\n赶紧入手吧!"
				this.img_girl.visible = true;
				this.lb_preview.visible = false;
				this.updateLimitShop();
			} else if (index == 2) {
				this.lb_desc.text = ""
				this.img_girl.visible = false;
				this.lb_preview.visible = false;
				this.updateNormalShop();
				this.scroller.bottom = 35;
			}
			egret.callLater(() => {
				this.list.validateNow();
				this.scroller.viewport.scrollV = this._offset;
				this._offset = 0;
			}, this);

		}

		public updateView(data) {
			App.WinManager.closeWin(WinName.POP_SHOP_BUY);
			// if (this._subview && this._subview.parent) {
			// 	PopUpManager.removePopUp(this._subview);
			// 	this._subview = undefined;
			// }
			if (data) { //刷新商店数据
				if (this.tabbar.selectedIndex == data - 1) {
					this._offset = this.list.scrollV;
					this.changedIndex(data - 1);
				}
			} else { //购买物品
				// this.list.selectedIndex = -1;
			}

		}

		public updateMysteryShop() {
			this.list.dataProvider = new eui.ArrayCollection(this.shopModel.mysteryShop);
			this.list.validateNow();
			this.gp_nexttime.visible = true;
			this.lb_tip.visible = false;
			this.gp_refresh.visible = true;
			this.lb_cost.text = String(App.ConfigManager.getConstConfigByType("SHOP_GOLD")["value"] + App.ConfigManager.getConstConfigByType("SHOP_GOLD1")["value"] * this.shopModel.refreshNum);
			this.timeHandle = egret.setInterval(() => {
				this.shopModel.leftTime--;
				this.lb_nexttime.text = "距离下批刷新时间：" + GlobalUtil.getFormatBySecond1(this.shopModel.leftTime);
				if (this.shopModel.leftTime < 0) {
					if (this.timeHandle) {
						egret.clearInterval(this.timeHandle);
						this.lb_nexttime.text = "";
						App.Socket.send(16001, {});
					}
				}
			}, this, 1000);
			this.lb_nexttime.text = "距离下批刷新时间：" + GlobalUtil.getFormatBySecond1(this.shopModel.leftTime);
			if (this.shopModel.mysteryShop.length == 0) {
				this.lb_over_tip.visible = true;
			}
		}

		public updateLimitShop() {
			let data: Array<any> = App.ConfigManager.getLimitShopBatchByBatch(this.shopModel.limitNum);
			let final = [];
			let array1 = []; //有购买次数
			let array2 = []; //无购买次数
			data.forEach((value, index, array) => {
				let time = this.shopModel.getLimitInfoById(value.id);
				if (time && time.limit == value.limit) {
					array2.push(value);
				} else {
					array1.push(value);
				}
			}, this);
			final = array1.concat(array2);
			this.list.dataProvider = new eui.ArrayCollection(final);
			this.gp_nexttime.visible = true;
			// this.lb_tip.visible = true; 不要了
			this.gp_refresh.visible = false;
			this.timeHandle = egret.setInterval(() => {
				this.shopModel.limitLeftTime--;
				this.lb_nexttime.text = "距离下一批物品刷新时间：" + GlobalUtil.getFormatBySecond1(this.shopModel.limitLeftTime);
				if (this.shopModel.limitLeftTime < 0) {
					if (this.timeHandle) {
						egret.clearInterval(this.timeHandle);
						this.lb_nexttime.text = "";
						App.Socket.send(16001, {});
					}
				}
			}, this, 1000);
			this.lb_nexttime.text = "距离下一批物品刷新时间：" + GlobalUtil.getFormatBySecond1(this.shopModel.limitLeftTime);
		}

		public updateNormalShop() {
			if (this.shopModel.normalShop.length == 0) {
				let data = App.ConfigManager.normalShopConfig();
				let temp = [];
				for (let key in data) {
					temp.push(data[key]);
				}
				this.shopModel.normalShop = temp;
			}
			this.list.dataProvider = new eui.ArrayCollection(this.shopModel.normalShop);
			this.gp_nexttime.visible = false;
		}

		public checkGuide() {
			if (this.list.getElementAt(0)) {
				App.GuideManager.bindClickBtn(this.img_refresh, 1012, 2);
				App.GuideManager.bindClickBtn((<eui.Group>(<ShopItem>this.list.getElementAt(0)).getChildAt(0)).getChildByName("img_buy"), 1012, 3);
				App.GuideManager.checkGuide(1012);
			}
		}

		public removeGuide() {
			App.GuideManager.removeClickBtn(1012, 2);
			App.GuideManager.removeClickBtn(1012, 3);
		}
		/**
		 * 打开窗口
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			if (openParam && openParam.type) {
				if (openParam.type == ShopType.MYSTERY) {
					App.Socket.send(16001, {});
				} else if (openParam.type == ShopType.LIMIT) {
					App.Socket.send(16002, {});
				} else if (openParam.type == ShopType.NORMAL) {

				}
				this.changedIndex(openParam.type - 1);
				this.tabbar.selectedIndex = openParam.type - 1;
			} else {
				App.Socket.send(16001, {});
			}
			App.EventSystem.addEventListener(PanelNotify.SHOP_UPDATE_LIST, this.updateView, this);
			App.EventSystem.addEventListener(PanelNotify.SHOP_BUY_WIN, this.showBuyWin, this);
			App.EventSystem.addEventListener(PanelNotify.SHOP_CLOSE_BUY_WIN, this.closeBuyWin, this);
			// App.Socket.send(16001, {});
			// this.checkGuide();
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
			super.clear(data);
			App.EventSystem.removeEventListener(PanelNotify.SHOP_UPDATE_LIST);
			App.EventSystem.removeEventListener(PanelNotify.SHOP_BUY_WIN);
			App.EventSystem.removeEventListener(PanelNotify.SHOP_CLOSE_BUY_WIN);
			this.removeGuide();
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
		}
	}

	export class ShopItem extends eui.ItemRenderer {
		public gp_main: eui.Label;
		public shopBaseItem: ShopBaseItem;
		public lb_name: eui.Label;
		public lb_price: eui.Label;
		public img_money: eui.Image;
		public lb_count: eui.Label;
		public lb_cap: eui.Label;
		public lb_tip: eui.Label;
		public img_buy: eui.Image;
		public img_bg: eui.Image;
		public gp_sale: eui.Group;
		public bmlb_sale: eui.BitmapLabel;

		private shopModel: ShopModel = ShopModel.getInstance();
		private heroModel: HeroModel = HeroModel.getInstance();
		// private backpackModel : BackpackModel = BackpackModel.getInstance();
		private _moneyType: number;
		private _type: number;
		private _max: number = 0;
		public constructor() {
			super();
			this.skinName = "ShopItemSkin";
			this.img_buy.name = "img_buy";
			this.img_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				if (this._type == ShopType.MYSTERY) {
					App.Socket.send(16003, { type: this._type, id: this.data.id, num: 1 });
					return;
				}

				let goodId = this.data.good_id ? this.data.good_id : this.data.goods;  //商品id
				let price = Number(this.lb_price.text);
				let num = this.data.num ? this.data.num : 1;
				let data = { id: this.data.id, good_id: goodId, type: this._moneyType, max: this._max, price: price, shopType: this._type, num: num }
				App.EventSystem.dispatchEvent(PanelNotify.SHOP_BUY_WIN, data);
				// let view = new ShopBuyWinView({ id: this.data.id, good_id: goodId, type: this._moneyType, max: this._max, price: price, shopType: this._type });
				// PopUpManager.addPopUp({ obj: view });
			}, this);
		}

		protected dataChanged() {
			let itemInfo = undefined;
			this.img_money.visible = true;
			this.lb_price.visible = true;
			if (this.data.type != null) {  //神秘商店
				this._type = ShopType.MYSTERY;
				this._max = 1;
				if (this.data.type == ClientType.BASE_ITEM) {
					itemInfo = App.ConfigManager.itemConfig()[this.data.good_id];
					this.shopBaseItem.updateBaseItem(this.data.type, this.data.good_id, this.data.num);
					this.lb_cap.visible = false;
				} else if (this.data.type == ClientType.EQUIP) {
					itemInfo = App.ConfigManager.equipConfig()[this.data.good_id];
					this.shopBaseItem.updateBaseItem(this.data.type, this.data.good_id, this.data.num,this.data);
					// this.baseItem.equipInfo = this.data;
					this.shopBaseItem.setCarrerIconVisible(false);
					this.lb_cap.visible = true;
					this.shopBaseItem.setItemNumVisible(false);
					this.lb_cap.text = "评分：" + this.data.equip.score;
				}
				this.lb_tip.visible = false;
				this.lb_count.visible = false;
				if (this.data.discount == 100 || this.data.discount == 0) { //折扣
					// this.gp_sale.visible = false;
					// this.lb_price.text = this.data.price;
					this.shopBaseItem.setDiscountIcon(null);
				} else {
					var discount = this.data.discount / 10
					switch (discount) {
						case 5:
							this.shopBaseItem.setDiscountIcon("com_sign_agioFive");
							break;
						case 8:
							this.shopBaseItem.setDiscountIcon("com_sign_agioEight");
							break;
					}
					// this.gp_sale.visible = true;
					// this.bmlb_sale.text = String(this.data.discount / 10);
					// this.lb_price.text = String(Math.ceil(this.data.price * this.data.discount / 100));
				}
			} else if (this.data.batch != null) {  //限购商店
				this._type = ShopType.LIMIT;
				itemInfo = App.ConfigManager.itemConfig()[this.data.goods];
				this.shopBaseItem.updateBaseItem(1, this.data.goods, this.data.num);
				if (this.data.discount == 10 || this.data.discount == 0) {
					// this.gp_sale.visible = false;
					// this.lb_price.text = String(this.data.number);
					this.shopBaseItem.setDiscountIcon(null);
				} else {
					switch (this.data.discount) {
						case 5:
							this.shopBaseItem.setDiscountIcon("com_sign_agioFive");
							break;
						case 8:
							this.shopBaseItem.setDiscountIcon("com_sign_agioEight");
							break;
					}
					// this.gp_sale.visible = true;
					// this.bmlb_sale.text = String(this.data.discount);
					// this.lb_price.text = String(Math.ceil(this.data.number / 10 * this.data.discount));
				}
				this.lb_count.visible = true;
				this.lb_cap.visible = false;
				// this.lb_price.text = String(Math.ceil(this.data.number/this.data.discount));
				let left = this.data.limit//剩余次数
				let count = this.shopModel.getLimitInfoById(this.data.id); //已购买次数
				if (count) {
					left = this.data.limit - count.limit;
				}
				if (left == 0) { //没次数了
					UIActionManager.setGrey(this, true);
					this.img_buy.touchEnabled = false;
				} else {
					UIActionManager.setGrey(this, false);
					this.img_buy.touchEnabled = true;
				}
				this.lb_count.text = "本次限购" + left + "/" + this.data.limit;
				this._max = left;

				if (this.data.vip > App.RoleManager.roleInfo.vipLv) { //vip
					this.lb_tip.visible = true;
					this.lb_tip.text = "VIP" + this.data.vip + "以上可购买";
					this.lb_price.visible = false;
					this.img_money.visible = false;
				} else {
					this.lb_tip.visible = false;
					this.lb_price.visible = true;
					this.img_money.visible = true;
				}
			} else {  //普通商店
				this._type = ShopType.NORMAL;
				this._max = 0;
				itemInfo = App.ConfigManager.itemConfig()[this.data.goods];
				this.shopBaseItem.updateBaseItem(1, this.data.goods, this.data.num);
				this.gp_sale.visible = false;
				this.lb_count.visible = false;
				this.lb_cap.visible = false;
				this.lb_tip.visible = false;
				this.lb_price.text = this.data.number;
			}
			this.lb_name.text = itemInfo.name;
			if (this.data.money == 1) { //金币
				this._moneyType = 1;
				RES.getResAsync("common_jinbi_png", (texture) => {
					this.img_money.source = texture;
				}, this);
			} else if (this.data.money == 2) {//元宝
				this._moneyType = 2;
				RES.getResAsync("common_yuanbao_png", (texture) => {
					this.img_money.source = texture;
				}, this);
			} else if (this.data.money_type == 1) { //金币
				this._moneyType = 1;
				RES.getResAsync("common_jinbi_png", (texture) => {
					this.img_money.source = texture;
				}, this);
			} else if (this.data.money_type == 2) {//元宝
				this._moneyType = 2;
				RES.getResAsync("common_yuanbao_png", (texture) => {
					this.img_money.source = texture;
				}, this);
			}
		}
	}

}
/**
 * 商城子视图
 * author ： zrj
*/
module game {
	//批量购买弹窗
	export class ShopBuyWinView extends BaseView {
		public gp_main: eui.Group;
		public baseItem: customui.BaseItem;
		public img_close: eui.Image;
		public lb_name: eui.Label;
		public lb_price: eui.Label;
		public lb_desc: eui.Label;
		public lb_count: eui.Label;
		public lb_total: eui.Label;
		public img_money: eui.Image;
		public img_money2: eui.Image;
		public img_add: eui.Image;
		public img_mind: eui.Image;
		public img_add10: eui.Image;
		public img_mind10: eui.Image;
		public img_buy: eui.Image;

		private shopModel: ShopModel = ShopModel.getInstance();
		private _id: number; //商城商品id
		private _good_id: number; //表里的id
		private _type: number;
		private _max: number;
		private _price: number;
		private _shopType: number;
		private _num :number =1;
		private count: number = 0; //计数器，记录数量
		private _totalCount: number = 0; //总购买数量
		/**
		 * @param params 传构造参数 id：商品id   good_id:道具配置表的id   type：金钱类型  max：最大购买数量  price:单价  shopType:商店类型 num:图标内数量
		*/
		public constructor(params) {
			super(params);
			this._id = params.id;
			this._good_id = params.good_id;
			this._type = params.type;
			this._max = params.max;
			this._price = params.price;
			this._num = params.num;
			this._shopType = params.shopType;
			this.skinName = "ShopBuyWinSkin";
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				App.EventSystem.dispatchEvent(PanelNotify.SHOP_CLOSE_BUY_WIN);
				PopUpManager.removePopUp(this);
			}, this);
			this.initView();
		}

		private initView() {
			let itemInfo = App.ConfigManager.itemConfig()[this._good_id];
			this.lb_name.text = itemInfo.name;
			this.lb_desc.text = itemInfo.des;
			this.baseItem.updateBaseItem(1, this._good_id,this._num);
			this.lb_price.text = String(this._price);
			if (this._type == CurrencyType.COIN) {
				RES.getResAsync("common_jinbi_png", (texture) => {
					this.img_money.source = texture;
					this.img_money2.source = texture;
				}, this);
			} else {
				RES.getResAsync("common_yuanbao_png", (texture) => {
					this.img_money.source = texture;
					this.img_money2.source = texture;
				}, this);
			}
			//+1
			this.img_add.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				this.calculate(1);
			}, this)
			//-1
			this.img_mind.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				this.calculate(-1);
			}, this)
			//+10
			this.img_add10.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				this.calculate(10);
			}, this)
			//-10
			this.img_mind10.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				this.calculate(-10);
			}, this)

			this.img_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				App.Socket.send(16003, { type: this._shopType, id: this._id, num: this._totalCount });
			}, this)


			//默认是一个
			this.calculate(1);
		}

		private calculate(num) {
			let totalCount = this.count + num;
			if (totalCount <= 0) {
				totalCount = 1;
			} else if (this._max && totalCount > this._max) {
				totalCount = this._max;
			}
			totalCount = this.autoMax(totalCount);
			this.count = totalCount;
			this.lb_total.text = String(totalCount * this._price);
			this.lb_count.text = totalCount;
			this._totalCount = totalCount;
		}

		//自动计算到可买最大数量
		private autoMax(totalCount) {
			for (let i = totalCount; i >= 1; i--) {
				if (this._type == CurrencyType.COIN) {
					if (i * this._price <= App.RoleManager.roleWealthInfo.coin) {
						return i;
					}
				} else if (this._type == CurrencyType.GOLD) {
					if (i * this._price <= App.RoleManager.roleWealthInfo.gold) {
						return i;
					}
				}
			}
			return 1;
		}

		/**
		 * 打开窗口
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
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
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
		}
	}
}
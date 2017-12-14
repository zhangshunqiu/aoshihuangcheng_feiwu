/**
 * module : 道具提示弹窗
 * author : zrj
*/
module game {
	export class ItemTip extends BaseView {
		public gp_main: eui.Group;
        public baseItem : customui.BaseItem;
		public img_close : eui.Image;
        public lb_name : eui.Label;
        public lb_desc : eui.Label;
        public lb_way : eui.Label;
        public lb_sell : eui.Label;
		public lb_num : eui.Label;
		public btn_use : eui.Button;
		public btn_goto : eui.Button;
		public btn_sell : eui.Button;

		private _id : number;
		private _uuid : number;

		public constructor(id,uuid) {
			super();
			this.skinName="ItemTipSkin";
            this._id = id;
			this._uuid = uuid;
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.initView();
		}

		private initView() {
			(<eui.Label>this.btn_use.labelDisplay).textColor = 0xe4cea9;
			(<eui.Label>this.btn_sell.labelDisplay).textColor = 0xe4cea9;
			(<eui.Label>this.btn_goto.labelDisplay).textColor = 0xe4cea9;
			(<eui.Label>this.btn_use.labelDisplay).size = 24;
			(<eui.Label>this.btn_sell.labelDisplay).size = 24;
			(<eui.Label>this.btn_goto.labelDisplay).size = 24;
			this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP,(e:Event)=>{
                PopUpManager.removePopUp(this,0);
            },this);
			this.btn_use.addEventListener(egret.TouchEvent.TOUCH_TAP,(e:Event)=>{
                App.Socket.send(14003,{id:this._uuid,num:1});
            },this);
			this.btn_sell.addEventListener(egret.TouchEvent.TOUCH_TAP,(e:Event)=>{
                App.Socket.send(14004,{id:this._uuid,num:1});
            },this);

            let info = App.ConfigManager.itemConfig()[this._id];
            this.lb_name.text = info.name;
            this.lb_desc.text = info.des;
			this.lb_way.textFlow = [{text:"获取途径："},{text:info.out_path}];
            this.lb_sell.textFlow = [{text:"出售价格："+info.sale}];
            this.baseItem.updateBaseItem(1,this._id);
			let itemInfo = (BackpackModel.getInstance() as BackpackModel).getItemByTypeIdUuid(ClientType.BASE_ITEM,this._id,this._uuid);
			this.lb_num.textFlow = [{text:"拥有数量："},{text:itemInfo ? String(itemInfo.num) : "0"}];

			if (info.type == 0) { //普通道具
				this.btn_use.visible = false;
			} else if(info.type == 1 || info.type == 2) {
				this.btn_goto.visible = false;
			}
			if (!this._uuid) { //只是展示itemTip
				this.btn_sell.visible = false;
				this.btn_use.visible = false;
				this.btn_goto.visible = false;
				this.x += 75;
			}
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
			super.clear(data);
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
		}
	}
}
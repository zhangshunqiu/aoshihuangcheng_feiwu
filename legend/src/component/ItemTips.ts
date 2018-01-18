/**
 * module : 道具提示弹窗
 * author : lyg
*/
module game {
	export class ItemTips extends BaseView {
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

		private _updateHandle : number = 0; //更新界面

		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
		}

		protected childrenCreated() {
			super.childrenCreated();
		}

		private initView() {
			(<eui.Label>this.btn_use.labelDisplay).textColor = 0xe4cea9;
			(<eui.Label>this.btn_sell.labelDisplay).textColor = 0xe4cea9;
			(<eui.Label>this.btn_goto.labelDisplay).textColor = 0xe4cea9;
			(<eui.Label>this.btn_use.labelDisplay).size = 24;
			(<eui.Label>this.btn_sell.labelDisplay).size = 24;
			(<eui.Label>this.btn_goto.labelDisplay).size = 24;
			this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin,this);
			this.btn_use.addEventListener(egret.TouchEvent.TOUCH_TAP,(e:Event)=>{
                App.Socket.send(14003,{id:this._uuid,num:1});
            },this);
			this.btn_sell.addEventListener(egret.TouchEvent.TOUCH_TAP,(e:Event)=>{
                App.Socket.send(14004,{id:this._uuid,num:1});
            },this);
			this.btn_goto.addEventListener(egret.TouchEvent.TOUCH_TAP,(e:Event)=>{
				let info = App.ConfigManager.getItemInfoById(this._id);
                MainModuleJump.jumpToModule(info.open);
				this.closeWin();
            },this);

            let info = App.ConfigManager.itemConfig()[this._id];
            this.lb_name.text = info.name;
            this.lb_desc.text = info.des;
			this.lb_way.textFlow = [{text:"获取途径："},{text:info.out_path}];
            this.lb_sell.textFlow = [{text:"出售价格："+info.sale}];
            this.baseItem.updateBaseItem(1,this._id);
			if(this._id == 101 || this._id == 102 || this._id == 100) {
				if(this._id == 101) {
					var coin:number = RoleManager.getInstance().roleWealthInfo.coin;
					this.lb_num.textFlow = [{text:"拥有数量："},{text:String(coin)}];
				}else if(this._id == 102){
					var gold:number = RoleManager.getInstance().roleWealthInfo.gold;
					this.lb_num.textFlow = [{text:"拥有数量："},{text:String(gold)}];
				}else if(this._id == 100) {
					var exp:number = RoleManager.getInstance().roleInfo.exp;
					this.lb_num.textFlow = [{text:"拥有数量："},{text:String(exp)}];
				}
			}else {
				let itemInfo = (BackpackModel.getInstance() as BackpackModel).getItemByTypeIdUuid(ClientType.BASE_ITEM,this._id,this._uuid);
				this.lb_num.textFlow = [{text:"拥有数量："},{text:itemInfo ? String(itemInfo.num) : "0"}];
			}

			if (info.type == 0) { //普通道具
				this.btn_use.visible = false;
			} else if(info.type == 1 || info.type == 2) {
				this.btn_goto.visible = false;
			}
			if (!this._uuid) { //只是展示itemTip
				this.btn_sell.visible = false;
				this.btn_use.visible = false;
				this.btn_goto.visible = false;
				// this.x += 75;
			}
		}

		private updateView() {
			let itemInfo = (BackpackModel.getInstance() as BackpackModel).getItemByTypeIdUuid(ClientType.BASE_ITEM,this._id,this._uuid);
			this.lb_num.textFlow = [{text:"拥有数量："},{text:itemInfo ? String(itemInfo.num) : "0"}];
			if (!itemInfo) {
				this.closeWin();
			}
		}

		/**
		 * 打开窗口
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
            this._id = openParam.id;
			this._uuid = openParam.uuid;
			if (this._updateHandle == 0 && this._uuid) {
				this._updateHandle = App.EventSystem.addEventListener(PanelNotify.HERO_ON_HERO_BAG_UPDATE,this.updateView,this);
			}
            this.initView();
		}

		/**
		 * 关闭窗口
		 */
		public closeWin(): void {
			super.closeWin();
		}

		/**
		 * 清理
		 */
		public clear(data: any = null): void {
			super.clear(data);
			if (this._updateHandle != 0) {
				App.EventSystem.removeEventListener(PanelNotify.HERO_ON_HERO_BAG_UPDATE,this._updateHandle);
				this._updateHandle = 0;
			}
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
		}
	}
}
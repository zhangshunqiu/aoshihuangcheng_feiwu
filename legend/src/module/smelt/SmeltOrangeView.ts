/**
 * module : 橙装熔炼视图
 * author : zrj
*/
module game{
	export class SmeltOrangeView extends BaseView{
		public gp_main : eui.Group;
		public commonWin : customui.CommonWin;
		public img_smelt : eui.Image;
		public scroller : eui.Scroller;
        public lb_way1 : eui.Label;
        public lb_way2 : eui.Label;
        public list : eui.List
		private smeltModel : SmeltModel = SmeltModel.getInstance();
		private backpackModel : BackpackModel = BackpackModel.getInstance();

		public constructor(viewConf:WinManagerVO=null) {
            super(viewConf);
        }

		protected childrenCreated() {
            super.childrenCreated();
			
			RES.getResAsync("smelt_orange_title_png",(texture)=>{
			    this.commonWin.img_title.source = texture;
			},this);
            
			this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
            this.initView();
			this.updateView();
        }

        private initView() {
			this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
				App.WinManager.closeWin(WinName.SMELT_ORANGE);
            },this);
            this.lb_way1.textFlow = [{text:"获得橙装：寻宝",style:{underline:true}}];
            this.lb_way2.textFlow = [{text:"获得橙装：全民BOSS",style:{underline:true}}];
            this.list = new eui.List();
            this.list.itemRenderer = SmeltOrangeItem;
            this.scroller.viewport = this.list;
            // this.list.dataProvider = new eui.ArrayCollection([1,2,3,4,5]);
		}

		public updateView() {
			let data = this.backpackModel.getEquipByQuality(ConstQuality.ORANGE);
			this.list.dataProvider = new eui.ArrayCollection(data);

		}

		/**
		 * 打开窗口
		 */
		public openWin(openParam:any = null):void{
			super.openWin(openParam);
			App.EventSystem.addEventListener(PanelNotify.SMELT_ORANGE_EQUIP,this.updateView,this);
		}

		/**
		 * 关闭窗口
		 */
		public closeWin(callback):void{
			super.closeWin(callback);
		}

		/**
		 * 清理
		 */
		public clear(data:any = null):void{
			super.clear(data);
			App.EventSystem.removeEventListener(PanelNotify.SMELT_ORANGE_EQUIP);
		}
		/**
		 * 销毁
		 */
		public destroy():void{
			super.destroy();
		}
	}

    export class SmeltOrangeItem extends eui.ItemRenderer {
        public gp_main: eui.Label;
        public baseItem: customui.BaseItem;
        public lb_level: eui.Label;
        public lb_get: eui.Label;
        public btn_smelt: eui.Label;

        public constructor() {
            super();
            this.skinName = "SmeltOrangeItemSkin";
            this.btn_smelt.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                App.Socket.send(14015,{id:this.data.id});
            }, this);
        }

        protected dataChanged() {
			let itemInfo = App.ConfigManager.getEquipById(this.data.good_id);
			let smeltInfo = App.ConfigManager.getSmeltInfoById(itemInfo.smelt);
			let getInfo = App.ConfigManager.getItemInfoById(smeltInfo.goods_id);
            this.baseItem.updateBaseItem(ClientType.EQUIP,this.data.good_id);
			this.lb_level.text = "装备等级："+itemInfo.limit_lvl+"级";
			this.lb_get.text = "熔炼后可获得："+smeltInfo.stone+"个"+getInfo.name;
        }
    }
}
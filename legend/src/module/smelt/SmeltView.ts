/**
 * module ： 熔炼模块视图
 * author : zrj
*/
module game{
	export class SmeltView extends BaseView{
		public gp_main : eui.Group;
		public commonWin : customui.CommonWin;
		public btn_smelt : eui.Button;
		public labelDisplay : eui.Label;
		public cbox0 : eui.CheckBox;
		public cbox1 : eui.CheckBox;
		public cbox2 : eui.CheckBox;
		public cbox3 : eui.CheckBox;
		public cbox_keep : eui.CheckBox;
		public scroller : eui.Scroller;
		public gp_equip : eui.Group;

		private itemArray : Array<customui.BaseItem> = [];
		private smeltModel : SmeltModel = SmeltModel.getInstance();
		private TOTAL_COUNT = 25;

		public constructor(viewConf:WinManagerVO=null) {
            super(viewConf);
        }

		protected childrenCreated() {
            super.childrenCreated();
			RES.getResAsync("smelt_title_png",(texture)=>{
			this.commonWin.img_title.source = texture;
			},this);
			this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
			this.scroller.scrollPolicyV = eui.ScrollPolicy.OFF;
			this.smeltModel.selectedQuality[0] = true;
			//默认选白色
			this.cbox0.selected = true;
			this.smeltModel.selectedQuality[0] = true;
			this.cbox1.selected = true;
			this.smeltModel.selectedQuality[1] = true;
			this.cbox2.selected = true;
			this.smeltModel.selectedQuality[2] = true;
			this.cbox_keep.selected = true;
			this.cbox_keep.touchEnabled = false;
            this.initView();
			this.updateView();
			this.validateNow();
        }

        private initView() {
			this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
				App.WinManager.closeWin(WinName.SMELT);
            },this);

			let selectQuality = (quality,isSelected)=> {
				if (isSelected) {
					this.smeltModel.selectedQuality[quality] = true;
				} else {
					this.smeltModel.selectedQuality[quality] = false;
				}
				this.updateView();
			}
			
			this.cbox_keep.addEventListener(eui.UIEvent.CHANGE,(event:eui.UIEvent)=>{
				// console.log(event.target.selected);
			},this)
			this.cbox0.addEventListener(eui.UIEvent.CHANGE,(event:eui.UIEvent)=>{
				// console.log(event.target.selected);
				selectQuality.call(this,0,event.target.selected);
			},this)
			this.cbox1.addEventListener(eui.UIEvent.CHANGE,(event:eui.UIEvent)=>{
				// console.log(event.target.selected);
				selectQuality.call(this,1,event.target.selected);
			},this)
			this.cbox2.addEventListener(eui.UIEvent.CHANGE,(event:eui.UIEvent)=>{
				// console.log(event.target.selected);
				selectQuality.call(this,2,event.target.selected);
			},this)
			this.cbox3.addEventListener(eui.UIEvent.CHANGE,(event:eui.UIEvent)=>{
				// console.log(event.target.selected);
				selectQuality.call(this,3,event.target.selected);
			},this)

			this.btn_smelt.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
				if (this.smeltModel._dataArray.length == 0) {
					App.GlobalTips.showTips("没有可熔炼的装备！");
					return;
				}
				let a = this.smeltModel.selectedQuality[0] ? 1 :0;
				let b = this.smeltModel.selectedQuality[1] ? 1 :0;
				let c = this.smeltModel.selectedQuality[2] ? 1 :0;
				let d = this.smeltModel.selectedQuality[3] ? 1 :0;
				App.Socket.send(14011,[a,b,c,d,1]);
			},this)

			let layout = new eui.TileLayout();
			layout.requestedRowCount = 5;
			layout.requestedColumnCount = 5;
			layout.verticalGap = 30;
			layout.horizontalGap = 40;
			layout.horizontalAlign = egret.HorizontalAlign.CENTER;
			layout.verticalAlign = egret.VerticalAlign.MIDDLE;
			this.gp_equip.layout = layout;
			for(let i=0;i<this.TOTAL_COUNT;i++) {
				let item = new customui.BaseItem();
				item.img_bg.visible = true;
				this.itemArray.push(item);
				this.gp_equip.addChild(item);
			}

		}

		private handleSmeltSuccess() {
			for(let i=0;i<this.TOTAL_COUNT;i++) {
				if (this.smeltModel._dataArray[i]) { //有数据
					let effectMc = new EffectMovieClip();
					effectMc.playMCKey("effbsxqcg", "", 1, null, null, () => {
						if (effectMc.parent) {
							effectMc.parent.removeChild(effectMc);
						}
						effectMc.destroy();
					}, this);
					this.itemArray[i].addChild(effectMc);
					effectMc.x = 45;
					effectMc.y = 45;
				}
			}
			this.updateView();
		}

		public updateView() {
			this.smeltModel.FilterEquipByScore();
			this.smeltModel.filterEquip();
			// console.log("smelt updateView ",this.smeltModel._dataArray.length);
			for(let i=0;i<this.TOTAL_COUNT;i++) {
				if (this.smeltModel._dataArray[i]) { //有数据
					this.itemArray[i].updateBaseItem(ClientType.EQUIP,this.smeltModel._dataArray[i].good_id);					
				} else {
					this.itemArray[i].updateBaseItem(ClientType.EQUIP,0);
					this.itemArray[i].img_icon.source = "";
				}
			}
		}

		public checkGuide() {
			App.GuideManager.bindClickBtn(this.btn_smelt,1007,2);
			App.GuideManager.bindClickBtn(this.commonWin.img_close,1007,3);
			App.GuideManager.checkGuide(1007);
		}

		public removeGuide() {
			App.GuideManager.removeClickBtn(1007,2);
			App.GuideManager.removeClickBtn(1007,3);
		}

		/**
		 * 打开窗口
		 */
		public openWin(openParam:any = null):void{
			super.openWin(openParam);
			App.EventSystem.addEventListener(PanelNotify.SMELT_SMELT_EQUIP,this.handleSmeltSuccess,this);
			if (this.itemArray.length >0) {
				this.updateView();
			}

			this.checkGuide();
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
			App.EventSystem.removeEventListener(PanelNotify.SMELT_SMELT_EQUIP);
			this.removeGuide();
		}
		/**
		 * 销毁
		 */
		public destroy():void{
			super.destroy();
		}
	}
}
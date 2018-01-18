/**
 * module ： 转生模块视图
 * author : zrj
*/
module game {
	export class RebornView extends BaseView {
		public gp_main: eui.Group;
		public bmlb_cap: eui.BitmapLabel;
		public gp_middle: eui.Group;
		public lb_level: eui.Label;
		public lb_attr: eui.Label;
		public lb_attr_next: eui.Label;
		public gp_bottom: eui.Group;
		public lb_cost: eui.Label;
		public lb_own: eui.Label;
		public lb_get: eui.Label;
		public btn_upgrade: eui.Button;
		private _rebornMc:AMovieClip;//转生特效
		private _getCultivationMc:AMovieClip;//获取修为特效

		public gp_up:eui.Group;
		public gp_xiuwei:eui.Group;

		private heroModel: HeroModel = HeroModel.getInstance();
		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
			this.skinName = "RebornSkin";
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.initView();
			this.readyOpenWin();
		}

		private initView() {
			this.lb_get.textFlow = [{ text: "获取修为", style: { underline: true } }];
			this.lb_get.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				if (App.RoleManager.roleInfo.lv >= 80) {
					// let view = new RebornPointView();
					// PopUpManager.addPopUp({ obj: view });
					App.WinManager.openWin(WinName.POP_REBORN_POINT);
				} else {
					App.GlobalTips.showTips("80级开启");
				}
			}, this);

			this.btn_upgrade.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				App.Socket.send(20001, {});
			}, this);


			App.BtnTipManager.addBtnTipItem(ConstBtnTipType.ROLE_REBORN_CULTURE,this.gp_xiuwei,95,-5);
			App.BtnTipManager.addBtnTipItem(ConstBtnTipType.ROLE_REBORN_UP,this.gp_up,150,10);
            
			if (this._rebornMc == null) {
				this._rebornMc = new AMovieClip();
				this._rebornMc.x = 355;//this._rebornMc.x + 180;
				this._rebornMc.y = 395;//this._rebornMc.y - 20;
				this._rebornMc.scaleX =1.7;
				this._rebornMc.scaleY = 1.7;
				this._rebornMc.touchEnabled = false;
				this._rebornMc.visible = false;
				this.addChild(this._rebornMc);
				//this.addChildAt(this._canGetMc, 1);
			}
			if (this._getCultivationMc == null) {
				this._getCultivationMc = new AMovieClip();
				this._getCultivationMc.touchEnabled = false;
				this.lb_get.parent.addChild(this._getCultivationMc);
				this._getCultivationMc.x = 50;
				this._getCultivationMc.y = 15;
				this._getCultivationMc.visible = true;
				//this.addChildAt(this._canGetMc, 1);
			} 
			this._getCultivationMc.playMCKey("effhqxw");


			this.updateView();

		}
		private effctComplete(){
			this._rebornMc.visible = false;
		}

		private handleRebornSuccess() {
			this._rebornMc.visible = true;
			//this._rebornMc.playMCKey("effzs","",1);
			//this._rebornMc.playMCKey("effzs");
			this._rebornMc.playMCKey("effzs", "", 1, null, () => {
					this._rebornMc.frameRate = 8;
				}	, this);
			if (this._rebornMc.hasEventListener(egret.Event.COMPLETE) == false) {
					this._rebornMc.addEventListener(egret.Event.COMPLETE, this.effctComplete, this);
				}
			// let mc = new EffectMovieClip();
			// mc.x = this.width / 2;
			// mc.y = this.height / 3;
			// mc.playMCKey("effzhuansheng", "", 1, null, null, () => {
			// 	if (mc.parent) {
			// 		mc.parent.removeChild(mc);
			// 	}
			// 	mc.destroy();
			// }, this);
			//this.addChild(mc);
		}

		private updateView() {
			let curInfo = App.ConfigManager.getRebornAttrInfoById(RoleManager.getInstance().roleInfo.turn);
			let nextInfo = App.ConfigManager.getRebornAttrInfoById(RoleManager.getInstance().roleInfo.turn + 1);
			if (curInfo) {
				let textArrL = [];
				if (curInfo["ac"]) {
					textArrL.push({ text: "攻击" + "：" + curInfo["ac"], style: { textColor: 0xbfbfbf } });
					textArrL.push({ text: "\n" });
				}
				if (curInfo["hp"]) {
					textArrL.push({ text: ConstAttribute["hp"] + "：" + curInfo["hp"], style: { textColor: 0xbfbfbf } });
					textArrL.push({ text: "\n" });
				}
				if (curInfo["def"]) {
					textArrL.push({ text: ConstAttribute["def"] + "：" + curInfo["def"], style: { textColor: 0xbfbfbf } });
					textArrL.push({ text: "\n" });
				}
				if (curInfo["sdef"]) {
					textArrL.push({ text: ConstAttribute["sdef"] + "：" + curInfo["sdef"], style: { textColor: 0xbfbfbf } });
					textArrL.push({ text: "\n" });
				}
				textArrL.pop();
				this.lb_attr.x = 130;
				this.lb_attr.textFlow = textArrL;
				this.bmlb_cap.text = String(curInfo["grade"]);
			} else {
				this.lb_attr.x = 155;
				this.lb_attr.text = "未激活";
				this.bmlb_cap.text = String(0);
			}

			if (nextInfo) {
				let textArrR = [];
				if (nextInfo["ac"]) {
					textArrR.push({ text: "攻击" + "：" + nextInfo["ac"], style: { textColor: 0x0de903 } });
					textArrR.push({ text: "\n" });
				}
				if (nextInfo["hp"]) {
					textArrR.push({ text: ConstAttribute["hp"] + "：" + nextInfo["hp"], style: { textColor: 0x0de903 } });
					textArrR.push({ text: "\n" });
				}
				if (nextInfo["def"]) {
					textArrR.push({ text: ConstAttribute["def"] + "：" + nextInfo["def"], style: { textColor: 0x0de903 } });
					textArrR.push({ text: "\n" });
				}
				if (nextInfo["sdef"]) {
					textArrR.push({ text: ConstAttribute["sdef"] + "：" + nextInfo["sdef"], style: { textColor: 0x0de903 } });
					textArrR.push({ text: "\n" });
				}
				textArrR.pop();
				this.lb_attr_next.x = 500;
				this.lb_attr_next.textFlow = textArrR;
				this.lb_cost.text = nextInfo.need_num;
			} else {
				this.lb_attr_next.x = 525;
				this.lb_attr_next.text = "已满级";
				this.lb_cost.text = "0";
			}

			// this.bmlb_cap.text = String(RoleManager.getInstance().getHeroFightcap());
			this.lb_level.textFlow = [{ text: "当前转生等级：" }, { text: RoleManager.getInstance().roleInfo.turn + "转", style: { textColor: 0xff7200 } }];
			this.lb_own.text = String(RoleManager.getInstance().roleInfo.lifeExp);
		}

		/**
		 * 打开窗口
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			App.EventSystem.addEventListener(PanelNotify.REBORN_UPDATE_VIEW, this.updateView, this);
			App.EventSystem.addEventListener(PanelNotify.REBORN_SUCCESS, this.handleRebornSuccess, this);
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
			App.EventSystem.removeEventListener(PanelNotify.REBORN_UPDATE_VIEW);
			App.EventSystem.removeEventListener(PanelNotify.REBORN_SUCCESS);
			if (this._rebornMc) {
				this._rebornMc.visible = false;
				if (this._rebornMc.hasEventListener(egret.Event.COMPLETE)) {
					this._rebornMc.removeEventListener(egret.Event.COMPLETE, this.effctComplete, this);
				}
				this._rebornMc.stop();
				this._rebornMc.destroy();
				this._rebornMc = null;
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
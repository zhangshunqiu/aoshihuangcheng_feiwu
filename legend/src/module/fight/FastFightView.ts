/**
 * module : 快速战斗提示框
 * author : zrj
*/
module game {
	export class FastFightView extends BaseView {
		public gp_main: eui.Group;
		public img_confirm: eui.Image;
		public lb_content: eui.Label;
		public img_cost: eui.Image;
		public lb_cost: eui.Label;
		public img_close: eui.Image;
		public lb_time: eui.Label;

		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
			this.skinName = "FastFightSkin";
			// this.readyOpenWin();
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.initView();
			this.validateNow();
			App.Socket.send(13009,{});
		}

		private initView() {
			this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
				// PopUpManager.removePopUp(this);
				App.WinManager.closeWin(WinName.POP_FAST_FIGHT);
			}, this);
			this.img_confirm.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
				let okCB = function (selected) {
					console.log("okkkk", selected);
					App.Socket.send(13010,{});
					// PopUpManager.removePopUp(this);
					App.WinManager.closeWin(WinName.POP_FAST_FIGHT);

				}
				let cancelCB = function () {
					console.log("cancellll");
				}
				let textFlow = [{ text: "你将获得" }, { text: "30", style: { textColor: 0x00f828 }},{ text: "分钟的收益，确定进行快速战斗？" }]
				App.GlobalTips.showAlert({ style: AlertTipsStyle.COMMON, textFlow: textFlow, okCB: okCB, cancelCB: cancelCB, context: this, needCheckBox: false });
				// PopUpManager.removePopUp(this);
				App.WinManager.closeWin(WinName.POP_FAST_FIGHT);
			}, this);
			
			this.lb_cost.text = App.ConfigManager.getConstConfigByType("HOOK_RAID_ICON").value;
			this.lb_time.textFlow = [{ text: "当天剩余次数" }, { text: "1次", style: { textColor: 0x00f828 } }];
		}

		private updateView() {
			let vipInfo = App.ConfigManager.getVipInfoById(App.RoleManager.roleInfo.vipLv);
			let constTime = App.ConfigManager.getConstConfigByType("HOOK_RAID_TIMES").value;
			this.lb_content.textFlow = [{ text: "可获得" }, { text: "30", style: { textColor: 0x00f828 } }, { text: "分钟野外挂机收益\n每天可免费快速战斗" },
			{ text: String(App.ConfigManager.getConstConfigByType("QUICK_COMBAT").value), style: { textColor: 0x00f828 } }, { text: "次\n5分钟内" }, { text: "伤害倍率+20%\n", style: { textColor: 0x00f828 } }, { text: "每天凌晨4点重置次数\n" },
			{ text: "每天有" },{ text:constTime+"次快速战斗次数"},{text:"(当前VIP等级加成"+vipInfo.quick_fight+"次)", style: { textColor: 0x00f828 } }];
			this.lb_time.textFlow = [{ text: "当天剩余次数" }, { text: MainUIModel.getInstance().fastFightTime+"次", style: { textColor: 0x00f828 } }];
			if (constTime + vipInfo.quick_fight == MainUIModel.getInstance().fastFightTime) {
				this.img_cost.visible = false;
				this.lb_cost.visible = false;
			} else {
				this.img_cost.visible = true;
				this.lb_cost.visible = true;
			}
		}

		/**
		 * 打开窗口
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			App.EventSystem.addEventListener(PanelNotify.PLAYER_FASTFIGHT_INFO, this.updateView, this);
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
			App.EventSystem.removeEventListener(PanelNotify.PLAYER_FASTFIGHT_INFO);
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
		}
	}
}
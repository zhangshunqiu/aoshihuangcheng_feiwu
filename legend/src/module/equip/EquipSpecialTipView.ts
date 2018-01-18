/**
* module : 特殊装备模块
* author : zrj
*/
module game {
	export class EquipSpecialTipView extends BaseView {
		public lb_name: eui.Label;
		public lb_tip: eui.Label;
		public gp_attr: eui.Group;
		public lb_condition: eui.Label;
		public btn_active : eui.Button;
		public img_txt : eui.Image;

		private heroModel: HeroModel = HeroModel.getInstance();
		private _data: any;
		private _updateHandleId : number
		public constructor(data) {
			super(data);
			this.skinName = "EquipSpecialTipSkin";
			// this._data = data;
		}

		protected childrenCreated() {
			super.childrenCreated();
			// this.initView();
		}

		private initView() {
			this.btn_active.addEventListener(egret.TouchEvent.TOUCH_TAP,this.activeFragment,this);
			
			let specialInfo = this.heroModel.heroInfo[this._data.pos].getEquipSpecialByPart(this._data.part);
			let ringInfo = App.ConfigManager.getEquipSpecialById(specialInfo.id);
			let singleRingInfo = App.ConfigManager.getEquipSpecialFragmentById(ringInfo.ring_id[this._data.num - 1]);
			if (BossModel.getInstance().level >= singleRingInfo.condition) { //可激活
				this.lb_condition.visible = false;
				this.btn_active.visible = true;
				this.img_txt.visible = true;
			} else { //未激活或者已激活
				this.lb_condition.visible = true;
				this.btn_active.visible = false;
				this.img_txt.visible = false;
			}

			this.lb_name.text = singleRingInfo.name;
			this.lb_condition.text = "通关第" + singleRingInfo.condition + "个关卡可获得";

			let attribute = App.ConfigManager.getAttributeInfoById(singleRingInfo.add_id);
			let attrBase = EquipModel.getInstance().attributeFilter(attribute);
			let textArray = [];
			for (let key in attrBase) {
				if (this.heroModel.heroInfo[this._data.pos].job == CareerType.SOLDIER) {
					if (key != "mac" && key != "sc") {
						textArray.push({ text: ConstAttribute[key] + ": ", style: { textColor: 0x00f829 } }, { text: attrBase[key], style: { textColor: 0x00f829 } }, );
						let Label = new eui.Label();
						Label.size = 24;
						Label.fontFamily = "SimHei";
						Label.textFlow = textArray;
						this.gp_attr.addChild(Label);
					}
				} else if (this.heroModel.heroInfo[this._data.pos].job == CareerType.MAGES) {
					if (key != "ac" && key != "sc") {
						textArray.push({ text: ConstAttribute[key] + ": ", style: { textColor: 0x00f829 } }, { text: attrBase[key], style: { textColor: 0x00f829 } }, );
						let Label = new eui.Label();
						Label.size = 24;
						Label.fontFamily = "SimHei";
						Label.textFlow = textArray;
						this.gp_attr.addChild(Label);
					}
				} else if (this.heroModel.heroInfo[this._data.pos].job == CareerType.TAOIST) {
					if (key != "mac" && key != "ac") {
						textArray.push({ text: ConstAttribute[key] + ": ", style: { textColor: 0x00f829 } }, { text: attrBase[key], style: { textColor: 0x00f829 } }, );
						let Label = new eui.Label();
						Label.size = 24;
						Label.fontFamily = "SimHei";
						Label.textFlow = textArray;
						this.gp_attr.addChild(Label);
					}
				}
			};

			let layout = new eui.TileLayout();
			layout.requestedRowCount = 2;
			layout.requestedColumnCount = 2;
			layout.horizontalAlign = egret.HorizontalAlign.CENTER;
			layout.verticalAlign = egret.VerticalAlign.MIDDLE;
			layout.horizontalGap = 50;

			this.gp_attr.layout = layout;
			this.lb_tip.textFlow = [{ text: "点击空白区域可关闭窗口", style: { underline: true } }];
			this.validateNow();
		}

		//激活碎片
		public activeFragment() {
			App.Socket.send(15014, { id: this._data.id, pos:this._data.part, num: this._data.num });
		}

		public closeView() {
			// PopUpManager.removePopUp(this);
			App.WinManager.closeWin(WinName.POP_EQUIPSPECIAL_TIP);
		}

		public checkGuide() {
			// App.GuideManager.bindClickBtn(this.btn_active,1015,4);
			// App.GuideManager.checkGuide(1015);
		}

		public removeGuide() {
			// App.GuideManager.removeClickBtn(1015,4);
		}

		/**
		 * 打开窗口
		 * openParam参数  part : 特殊装备部位  isActive ：是否已经激活
		 * 
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			this._data = openParam.data;
			this.initView();
			if (!this._updateHandleId) {
				this._updateHandleId = App.EventSystem.addEventListener(PanelNotify.HERO_SPECIAL_EQUIP_UPDATE, this.closeView, this);
			}
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
			super.clear(data);
			if (this._updateHandleId) {
				App.EventSystem.removeEventListener(PanelNotify.HERO_SPECIAL_EQUIP_UPDATE, this._updateHandleId);
				this._updateHandleId = undefined;
			}
			this.removeGuide();
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
		}
	}
}
/**
 *  module : 装备视图
 * author ： zrj
*/
module game {
	export class EquipView extends BaseView {
		public gp_equip: eui.Group;
		public gp_tip: eui.Group;
		public img_close: eui.Image;
		public btn_show: eui.Button;
		public btn_change: eui.Button;
		public baseItem: customui.BaseItem;
		public lb_name: eui.Label;
		public lb_career: eui.Label;
		public lb_part: eui.Label;
		public lb_level: eui.Label;
		public lb_cap: eui.Label;
		public lb_base: eui.Label;
		public lb_great: eui.Label;
		public lb_strength: eui.Label;
		public lb_super: eui.Label;
		public lb_gem: eui.Label;
		public gp_scroll: eui.Group;
		public gp_base: eui.Group;
		public gp_great: eui.Group;
		public gp_super: eui.Group;
		public gp_strength: eui.Group;
		public gp_gem: eui.Group;

		private offset: number = 0;
		private type: number = 0;
		private id: number = 0;
		private uuid: number = 0;
		private part: number = 0;
		private info: any = {}; //服务端数据
		private baseInfo: any = {};
		private heroModel: HeroModel = HeroModel.getInstance();
		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
		}

		protected childrenCreated() {
			super.childrenCreated();

			this.btn_change.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
				App.WinManager.closeWin(WinName.EQUIP);
				let view = new EquipSelect(this.baseInfo.limit_career, this.part, this.baseInfo.sex);
				PopUpManager.addPopUp({ obj: view, effectType: 0 });
			}, this);

			this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
				App.WinManager.closeWin(WinName.EQUIP);
			}, this);

			this.initView();
		}

		private initView() {

		}

		private updateView() {
			if (!this.baseInfo) {
				return;
			}
			if (!this.info) {
				this.updateBaseView();
				return;
			}
			//显示服务端数据

			let info = this.baseInfo;
			let attribute = App.ConfigManager.getAttributeInfoById(info.base_att);
			// let attrBase = EquipModel.getInstance().attributeFilter(attribute);
			let attrBase = this.info.equip.base;
			this.lb_name.text = info.name;
			this.lb_cap.text = this.info.equip.score;
			this.baseItem.updateBaseItem(ClientType.EQUIP, info.id);
			this.lb_level.textFlow = [{ text: "需求等级：", style: { textColor: 0xf5d98f } }, { text: String(info.limit_lvl), style: { textColor: 0xd8cecc } }];
			this.lb_part.textFlow = [{ text: "部位：", style: { textColor: 0xf5d98f } }, { text: ConstEquipType[info.sub_type], style: { textColor: 0xd8cecc } }];
			this.lb_career.textFlow = [{ text: "职业：", style: { textColor: 0xf5d98f } }, { text: ConstCareer[info.limit_career], style: { textColor: 0xd8cecc } }];
			this.lb_base.lineSpacing = 2;
			let textArray = [];
			for (let key in attrBase) {
				let myKey = ConstAttributeArray[attrBase[key].key];
				textArray.push({ text: ConstAttribute[myKey] + ": ", style: { textColor: 0xc6be66 } }, { text: attrBase[key].value, style: { textColor: 0xc6bebb } },
					{ text: " + " + attrBase[key].add_value + "\n", style: { textColor: 0x23ff00 } });
			};
			this.lb_base.textFlow = textArray;
			this.offset = this.gp_base.height + 5;

			// if (true) { //有强化属性
			// 	this.gp_strength.visible = true;
			// 	this.gp_strength.y = this.offset;
			// 	this.lb_strength.textFlow = textArray
			// 	this.offset += this.gp_strength.height + 5;	
			// }

			let attrBaseOrange = this.info.equip.special;

			if (attrBaseOrange.length > 0) { //有极品属性
				this.gp_great.visible = true;
				this.gp_great.y = this.offset;
				let textArray2 = [];
				for (let key in attrBaseOrange) {
					let myKey = ConstAttributeArray[attrBaseOrange[key].key];
					textArray.push({ text: ConstAttribute[myKey] + ": ", style: { textColor: 0xc6be66 } }, { text: attrBaseOrange[key].value, style: { textColor: 0xc6bebb } },
						{ text: " + " + attrBaseOrange[key].add_value + "\n", style: { textColor: 0x23ff00 } });
				};
				this.lb_great.textFlow = textArray2;
				this.offset += this.gp_great.height + 5;
			}

			let attrBaseGod = this.info.equip.wash;
			if (attrBaseGod.length > 0) { //有神装属性
				this.gp_super.visible = true;
				this.gp_super.y = this.offset;
				let textArray3 = [];
				for (let key in attrBaseGod) {
					let myKey = ConstAttributeArray[attrBaseGod[key].key];
					textArray.push({ text: ConstAttribute[myKey] + ": ", style: { textColor: 0xc6be66 } }, { text: attrBaseGod[key].value, style: { textColor: 0xc6bebb } },
						{ text: " + " + attrBaseGod[key].add_value + "\n", style: { textColor: 0x23ff00 } });
				};

				this.lb_super.textFlow = textArray3;
				this.offset += this.gp_super.height + 5;
			}
		}

		//显示配置表里面的数据
		private updateBaseView() {
			//隐藏所有按钮
			this.btn_show.visible = false;
			this.btn_change.visible = false;

			let info = this.baseInfo;
			let attribute = App.ConfigManager.getAttributeInfoById(info.base_att);
			let attrBase = EquipModel.getInstance().attributeFilter(attribute);
			// let attrBase = this.info.equip.base;
			this.lb_name.text = info.name;
			this.lb_cap.text = "??????";
			this.baseItem.updateBaseItem(ClientType.EQUIP, info.id);
			this.lb_level.textFlow = [{ text: "需求等级：", style: { textColor: 0xf5d98f } }, { text: String(info.limit_lvl), style: { textColor: 0xd8cecc } }];
			this.lb_part.textFlow = [{ text: "部位：", style: { textColor: 0xf5d98f } }, { text: ConstEquipType[info.sub_type], style: { textColor: 0xd8cecc } }];
			this.lb_career.textFlow = [{ text: "职业：", style: { textColor: 0xf5d98f } }, { text: ConstCareer[info.limit_career], style: { textColor: 0xd8cecc } }];
			this.lb_base.lineSpacing = 2;
			let textArray = [];
			for (let key in attrBase) {
				textArray.push({ text: ConstAttribute[key] + ": ", style: { textColor: 0xc6be66 } }, { text: attrBase[key], style: { textColor: 0xc6bebb } },
					{ text: " + " + "?" + "\n", style: { textColor: 0x23ff00 } });
			};
			this.lb_base.textFlow = textArray;
			this.offset = this.gp_base.height + 5;

			// if (true) { //有强化属性
			// 	this.gp_strength.visible = true;
			// 	this.gp_strength.y = this.offset;
			// 	this.lb_strength.textFlow = textArray
			// 	this.offset += this.gp_strength.height + 5;	
			// }

			let attributeOrange = App.ConfigManager.getAttributeInfoById(this.baseInfo.best_att);

			if (attributeOrange) { //有极品属性
				let attrBaseOrange = EquipModel.getInstance().attributeFilter(attributeOrange);
				this.gp_great.visible = true;
				this.gp_great.y = this.offset;
				let textArray2 = [];
				for (let key in attrBaseOrange) {
					textArray.push({ text: ConstAttribute[key] + ": ", style: { textColor: 0xc6be66 } }, { text: attrBaseOrange[key], style: { textColor: 0xc6bebb } },
						{ text: " + " + "?" + "\n", style: { textColor: 0x23ff00 } });
				};
				this.lb_great.textFlow = textArray2;
				this.offset += this.gp_great.height + 5;
			}

			let attributeGod = App.ConfigManager.getAttributeInfoById(this.baseInfo.god_att);
			if (attributeGod) { //有神装属性
				let attrBaseGod = EquipModel.getInstance().attributeFilter(attributeGod);
				this.gp_super.visible = true;
				this.gp_super.y = this.offset;
				let textArray3 = [];
				for (let key in attrBaseGod) {
					textArray.push({ text: ConstAttribute[key] + ": ", style: { textColor: 0xc6be66 } }, { text: attrBaseGod[key], style: { textColor: 0xc6bebb } },
						{ text: " + " + "?" + "\n", style: { textColor: 0x23ff00 } });
				};

				this.lb_super.textFlow = textArray3;
				this.offset += this.gp_super.height + 5;
			}
		}
		/**
		 * 打开窗口
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			this.type = openParam.type ? openParam.type : 0; //type  0: 装备tip界面，没有更换功能。 1：具有更换装备功能
			this.id = openParam.id;
			this.uuid = openParam.uuid;
			this.part = openParam.part;
			if (!this.id) { //空界面

			} else {
				this.baseInfo = (EquipModel.getInstance() as EquipModel).getEquipInfoById(this.id);
				//透传过来的数据，可以是装备展示
				if (openParam.info) {
					this.info = openParam.info;
				} else {
					this.info = (BackpackModel.getInstance() as BackpackModel).getItemByTypeIdUuid(ClientType.EQUIP, this.id, this.uuid);
					if (!this.info) { //背包里没有，装备在身上了
						this.info = this.heroModel.getHeroEquipByPosPart(this.heroModel.curPos, this.heroModel.curPart);
					}
				}
				this.gp_equip.visible = true;
				// this.gp_tip.visible = false;
			}
			if (this.type == 0) {
				this.btn_change.visible = false;
			} else if (this.type == 1) {
				this.btn_change.visible = true;
			}
			this.updateView();
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
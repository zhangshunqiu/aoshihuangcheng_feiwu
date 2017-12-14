/**
 * module : 锻造模块子视图
 * author : zrj
*/
module game {
	//锻造装备信息
	export class ForgeEquipInfo extends BaseView {
		public baseItem: customui.BaseItem;
		public lb_part: eui.Label;
		public lb_career: eui.Label;
		public lb_level: eui.Label;
		public lb_left: eui.Label;
		public lb_right: eui.Label;

		private _id: number; //英雄id
		private _part: number; //部位
		private heroModel: HeroModel = HeroModel.getInstance();
		private forgeModel: ForgeModel = ForgeModel.getInstance();
		public constructor(id, part) {
			super();
			this.skinName = "ForgeEquipSkin";
			this._id = id;
			this._part = part;
		}

		protected childrenCreated() {
			super.childrenCreated();

			let equip = this.heroModel.heroInfo[this.heroModel.curPos].getPartInfoByPart(this._part);
			let curLevel = equip ? equip.lv : 0;
			// this.lb_left.text = "";
			if (curLevel > 0) {
				let forgeInfo2 = this.forgeModel.getStrengthByPartLevel(this._part, curLevel);
				let attribute2 = App.ConfigManager.attributeConfig()[forgeInfo2.attribute];
				let attrBase2 = EquipModel.getInstance().attributeFilter(attribute2);

				let textL2 = [];
				for (let key in attrBase2) {
					if (key == "ac" || key == "mac" || key == "sc") {
						if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.SOLDIER) {
							if (key == "ac") {
								textL2.push({ text: ConstAttribute[key] + "：" }, { text: attrBase2[key] });
								textL2.push({ text: "\n" });
							}
						} else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.MAGES) {
							if (key == "mac") {
								textL2.push({ text: ConstAttribute[key] + "：" }, { text: attrBase2[key] });
								textL2.push({ text: "\n" });
							}
						} else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.TAOIST) {
							if (key == "sc") {
								textL2.push({ text: ConstAttribute[key] + "：" }, { text: attrBase2[key] });
								textL2.push({ text: "\n" });
							}
						}
					} else {
						textL2.push({ text: ConstAttribute[key] + "：" }, { text: attrBase2[key] });
						textL2.push({ text: "\n" });
					}

				};
				this.lb_left.textFlow = textL2;
			} else {
				this.lb_left.textFlow = [{ text: "" }];
			}
			let forgeInfo = this.forgeModel.getStrengthByPartLevel(this._part, curLevel + 1);
			let attribute = App.ConfigManager.attributeConfig()[forgeInfo.attribute];
			let attrBase = EquipModel.getInstance().attributeFilter(attribute);
			let textL = [];
			let textR = [];
			for (let key in attrBase) {
				if (key == "ac" || key == "mac" || key == "sc") {
					if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.SOLDIER) {
						if (key == "ac") {
							textR.push({ text: ConstAttribute[key] + "：" + attrBase[key] });
							textR.push({ text: "\n" });
							if (this.lb_left.text == "") {
								textL.push({ text: ConstAttribute[key] + "：0\n" });
								this.lb_left.textFlow = textL;
							}
						}
					} else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.MAGES) {
						if (key == "mac") {
							textR.push({ text: ConstAttribute[key] + "：" + attrBase[key] });
							textR.push({ text: "\n" });
							if (this.lb_left.text == "") {
								textL.push({ text: ConstAttribute[key] + "：0\n" });
								this.lb_left.textFlow = textL;
							}
						}
					} else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.TAOIST) {
						if (key == "sc") {
							textR.push({ text: ConstAttribute[key] + "：" + attrBase[key] });
							textR.push({ text: "\n" });
							if (this.lb_left.text == "") {
								textL.push({ text: ConstAttribute[key] + "：0\n" });
								this.lb_left.textFlow = textL;
							}
						}
					}
				} else {
					textR.push({ text: ConstAttribute[key] + "：" + attrBase[key] });
					textR.push({ text: "\n" });
					if (this.lb_left.text == "") {
						textL.push({ text: ConstAttribute[key] + "：0\n" });
						this.lb_left.textFlow = textL;
					}
				}

			};
			this.lb_right.textFlow = textR;
			this.lb_part.text = ConstEquipType[EquipModel.getInstance().getTypeByPos(this._part)];
			this.lb_career.text = ConstCareer[this.heroModel.heroInfo[this.heroModel.curPos].job];
			this.lb_level.text = curLevel;
			if (this.heroModel.heroInfo[this.heroModel.curPos].equipExist(this._part) >= 0) { //有装备
				let equipInfo = this.heroModel.heroInfo[this.heroModel.curPos].getPartInfoByPart(this._part);
				this.baseItem.updateBaseItem(ClientType.EQUIP, equipInfo.good_id);
				this.baseItem.img_career.visible = false;
			} else {
				RES.getResAsync("common_default_png", (texture) => {
					this.baseItem.img_frame.source = texture;
				}, this);
				RES.getResAsync(ConstEquipIcon[this._part] + "_png", (texture) => {
					this.baseItem.img_icon.source = texture;
				}, this);
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

	//锻造星级信息
	export class ForgeStarInfo extends BaseView {
		public gp_main: eui.Group;
		public lb_cur1: eui.Label;
		public lb_cur2: eui.Label;
		public lb_attr1: eui.Label;
		public lb_attr2: eui.Label;
		public bmlb_star: eui.BitmapLabel;
		public img_status: eui.Image;

		private _id: number; //英雄id
		private heroModel: HeroModel = HeroModel.getInstance();
		private forgeModel: ForgeModel = ForgeModel.getInstance();
		public constructor(id) {
			super();
			this.skinName = "ForgeStarInfoSkin";
			this._id = id;
		}

		protected childrenCreated() {
			super.childrenCreated();
			let heroInfo = this.heroModel.heroInfo[this.heroModel.curPos];
			let level = null;
			heroInfo.equip_info.forEach((value, index, array) => {
				if (level == null && value.part <= 10) {
					level = value.star;
				} else if (level > value.star && value.part <= 10) {
					level = value.star;
				}
			}, this);
			if (level > 0) {
				let forgeInfo2 = this.forgeModel.getStarByPartLevel("", level);
				let attribute2 = App.ConfigManager.attributeConfig()[forgeInfo2.all_star];
				let attrBase2 = EquipModel.getInstance().attributeFilter(attribute2);
				// this.lb_attr1.text = "全身属性+" +attribute2["attribute_rate"] / 100 + "%";
				let text1 = [];
				let count1 = 1;
				for (let key in attrBase2) {
					let label = new eui.Label();
					label.size = 24;
					label.textColor = 0xbfbfbf;
					label.text = ConstAttribute[key] + "：+" + attrBase2[key];
					label.x = 8 + 185 * ((count1 - 1) % 2);
					label.y = 198 + Math.floor((count1 - 1) / 2) * 45;

					if (key == "ac" || key == "mac" || key == "sc") {
						if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.SOLDIER) {
							if (key == "ac") {
								this.gp_main.addChild(label);
								count1++;
							}
						} else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.MAGES) {
							if (key == "mac") {
								this.gp_main.addChild(label);
								count1++;
							}
						} else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.TAOIST) {
							if (key == "sc") {
								this.gp_main.addChild(label);
								count1++;
							}
						}
					} else {
						this.gp_main.addChild(label);
						count1++;
					}
				};
				this.lb_attr1.textFlow = text1;
			} else {
				this.lb_attr1.text = "未激活";
				this.lb_attr1.visible = true;
				RES.getResAsync("forge_txt_weijihuo_png", (texture) => {
					this.img_status.source = texture;
				}, this);
			}
			let forgeInfo = this.forgeModel.getStarByPartLevel("", level + 1);
			let attribute = App.ConfigManager.attributeConfig()[forgeInfo.all_star];
			let attrBase = EquipModel.getInstance().attributeFilter(attribute);
			let text = [];
			let count = 1;
			for (let key in attrBase) {
				let label = new eui.Label();
				label.size = 24;
				// label.textColor = 0xbfbfbf;
				label.textColor = 0x626262;
				label.text = ConstAttribute[key] + "：+" + attrBase[key];
				label.x = 8 + 185 * ((count - 1) % 2);
				label.y = 331 + Math.floor((count - 1) / 2) * 45;

				if (key == "ac" || key == "mac" || key == "sc") {
					if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.SOLDIER) {
						if (key == "ac") {
							this.gp_main.addChild(label);
							count++;
						}
					} else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.MAGES) {
						if (key == "mac") {
							this.gp_main.addChild(label);
							count++;
						}
					} else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.TAOIST) {
						if (key == "sc") {
							this.gp_main.addChild(label);
							count++;
						}
					}
				} else {
					this.gp_main.addChild(label);
					count++;
				}

			};
			this.lb_attr2.textFlow = text;
			// this.lb_attr2.text = "全身属性+" +attribute["attribute_rate"] / 100 + "%";

			this.bmlb_star.text = String(level);
			this.lb_cur1.textFlow = [{ text: "当前效果：全身升星" }, { text: "+" + level, style: { textColor: 0x21c42b } }];
			// this.lb_cur2.textFlow = [{ text: "下级效果：全身升星" }, { text: "+" + (level + 1), style: { textColor: 0x21c42b } }];
			this.lb_cur2.text = "下级效果：全身升星+" +(level + 1);
			this.lb_cur2.textColor = 0x626262;

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
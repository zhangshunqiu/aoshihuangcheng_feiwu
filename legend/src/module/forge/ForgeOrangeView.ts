/**
* module : 橙装锻造强化
* author : zrj
*/
module game {
	export class ForgeOrangeView extends BaseView {
		public gp_main: eui.Group;
		public commonWin: customui.CommonWin;
		public headComponent: game.HeroHeadComponentView;
		public gp_equip: eui.Group;
		public gp_middle: eui.Group;
		public gp_attr: eui.Group;
		public lb_attr: eui.Label;
		public lb_attr_next: eui.Label;
		public gp_arrow: eui.Group;
		public baseItem_left: customui.BaseItem;
		public baseItem_right: customui.BaseItem;
		public lb_get: eui.Label;
		public lb_cost: eui.Label;
		public img_upgrade: eui.Image;
		public img_return: eui.Image;
		public lb_tips: eui.Label;
		public img_select: eui.Image;

		private _equipArray: Array<customui.BaseItem> = [];
		private heroModel: HeroModel = HeroModel.getInstance();
		private forgeModel: ForgeModel = ForgeModel.getInstance();
		private _infoHandle: number;
		private _lastModuleName: string;
		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
			this.skinName = "ForgeOrangeEquipSkin";
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.initView();
		}

		private initView() {
			// RES.getResAsync("forge_shengjichengzhuang_title_png", (texture) => {
			// 	this.commonWin.img_title.source = texture;
			// }, this);
			// this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closePanel, this);
			// this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.returnPanel, this);
			this.lb_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showWay, this);
			this.img_upgrade.addEventListener(egret.TouchEvent.TOUCH_TAP, this.sendUpgradeRequest, this);

			this.lb_get.textFlow = [{ text: "获取精华", style: { underline: true } }];
			// this.baseItem_left.lb_name.visible = true;
			// this.baseItem_left.lb_name.top = -25;
			// this.baseItem_left.lb_name.textColor = 0xff8400;
			this.baseItem_left.setItemNameVisible(true);
			this.baseItem_left.setItemNameAtt({top:-25,textColor:0xff8400});
			// this.baseItem_right.lb_name.visible = true;
			// this.baseItem_right.lb_name.top = -25;
			// this.baseItem_right.lb_name.textColor = 0xff8400;
			this.baseItem_right.setItemNameVisible(true);
			this.baseItem_right.setItemNameAtt({top:-25,textColor:0xff8400});

			this.initEquip();
			this.updateView(null);
		}

		private initEquip() {
			this.img_select = new eui.Image();
			RES.getResAsync("equipping_choose_png", (texture) => {
				this.img_select.source = texture;
			}, this);
			for (let i = 1; i <= 10; i++) {
				let item = new customui.BaseItem();
				if (i % 2 != 0) {
					item.left = 50;
				} else {
					item.right = 50;
				}
				item.y = 54 + (Math.floor((i - 1) / 2) * (item.height + 25));
				//特殊处理衣服和头盔
				if (i == 2) { //衣服
					item.right = undefined;
					item.left = 50;
					item.y = 54 + (Math.floor((i + 1 - 1) / 2) * (item.height + 25));
				} else if (i == 3) { //头盔
					item.left = undefined;
					item.right = 50;
					item.y = 54 + (Math.floor((i - 1 - 1) / 2) * (item.height + 25));
				}
				let equipInfo = this.heroModel.heroInfo[this.heroModel.curPos].getPartInfoByPart(i);
				if (this.heroModel.heroInfo[this.heroModel.curPos].equipExist(i) >= 0) { //有装备

					item.updateBaseItem(ClientType.EQUIP, equipInfo.good_id, null, equipInfo);
					item.setCarrerIconVisible(false);
					item.setStrengthLvVisible(false);
				} else {
					item.updateBaseItem(ClientType.EQUIP, 0, null, equipInfo);
					// RES.getResAsync(ConstEquipIcon[i] + "_png", (texture) => {
					// 	item.img_icon.source = texture;
					// }, this);
					item.setItemIcon(ConstEquipIcon[i] + "_png");
					item.setStrengthLvVisible(false);
				}

				this.gp_equip.addChild(item);
				item.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
					this.forgeModel.curOrangePart = i;
					this.updateMiddleView();
				}, this);
				this._equipArray.push(item);
			}
			this.forgeModel.curOrangePart = 1;
		}

		//红点检测
		private checkRedDot() {
			this.forgeModel.orangeHeroRedDot.forEach((value, index, array) => {
				this.headComponent.setRedTips(index, value);
				for (let i = 1; i <= 10; i++) {
					let show = this.forgeModel.checkCanOrangeUpByPart(this.heroModel.curPos, i);
					if (show) {
						this._equipArray[i - 1].showRedTips(null);
					} else {
						this._equipArray[i - 1].hideRedTips();
					}
				}
			}, this)
		}

		//更新装备信息
		private updateEquip() {
			for (let i = 0; i < 10; i++) {
				let item = this._equipArray[i];
				let equipInfo = this.heroModel.heroInfo[this.heroModel.curPos].getPartInfoByPart(i + 1);
				if (this.heroModel.heroInfo[this.heroModel.curPos].equipExist(i + 1) >= 0) { //有装备
					item.updateBaseItem(ClientType.EQUIP, equipInfo.good_id, null, equipInfo);
					item.setCarrerIconVisible(false);
					item.setStarLvVisible(false);
					item.setStrengthLvVisible(false);
					item.setItemNameVisible(true);
					// item.lb_name.text = "";
				} else {
					item.updateBaseItem(ClientType.EQUIP, 0, null, equipInfo);
					item.setStarLvVisible(false);
					item.setStrengthLvVisible(false);
					// RES.getResAsync(ConstEquipIcon[i + 1] + "_png", (texture) => {
					// 	item.img_icon.source = texture;
					// }, this);
					item.setItemIcon(ConstEquipIcon[i + 1] + "_png");
					item.setItemNameVisible(false);
				}
			}
		}

		//更新中间面板
		private updateMiddleView() {
			if (this.img_select.parent) {
				this.img_select.parent.removeChild(this.img_select);
			}
			// this.img_select.x = this._equipArray[this.forgeModel.curOrangePart - 1].x - 50;
			this.img_select.left = this._equipArray[this.forgeModel.curOrangePart - 1].left - 5;
			this.img_select.right = this._equipArray[this.forgeModel.curOrangePart - 1].right - 5;
			this.img_select.y = this._equipArray[this.forgeModel.curOrangePart - 1].y - 50;
			this._equipArray[this.forgeModel.curOrangePart - 1].parent.addChild(this.img_select);
			this._equipArray[this.forgeModel.curOrangePart - 1].parent.setChildIndex(this.img_select, 0);

			let heroInfo = this.heroModel.heroInfo[this.heroModel.curPos];
			let equipVO = heroInfo.getEquipByPart(this.forgeModel.curOrangePart);
			if (!equipVO) {
				this.gp_middle.visible = false;
				this.lb_tips.visible = true;
				this.lb_tips.text = "该部位没有可升级的橙装";
				return;
			}
			let equipInfo = App.ConfigManager.getEquipById(equipVO.good_id);
			if (!equipInfo || equipInfo.upgrade == 0) {
				this.gp_middle.visible = false;
				this.lb_tips.visible = true;
				this.lb_tips.text = "该部位没有可升级的橙装";
				return;
			} else {
				this.gp_middle.visible = true;
				this.lb_tips.visible = false;
			}

			let attribute = App.ConfigManager.getAttributeInfoById(equipInfo.base_att);
			let attrBase = EquipModel.getInstance().attributeFilter(attribute);
			let textArray = [];
			for (let key in attrBase) {
				textArray.push({ text: ConstAttribute[key] + ": " }, { text: attrBase[key] });
				textArray.push({ text: "\n" });
			};
			textArray.pop();
			this.lb_attr.textFlow = textArray;

			//摆放箭头
			// this.gp_arrow.removeChildren();

			let nextInfo = App.ConfigManager.getEquipById(equipInfo.upgrade);
			let attributeNext = App.ConfigManager.getAttributeInfoById(nextInfo.base_att);
			let attrBaseNext = EquipModel.getInstance().attributeFilter(attributeNext);
			let textArrayNext = [];
			let count = 0;
			for (let key in attrBaseNext) {
				textArrayNext.push({ text: ConstAttribute[key] + ": " }, { text: attrBaseNext[key] });
				textArrayNext.push({ text: "\n" });
				let tempCount = count;
				// RES.getResAsync("forge_jiantou2_png", (texture) => {
				// 	let img = new eui.Image(texture);
				// 	img.horizontalCenter = 0;
				// 	img.y = 85 + tempCount * 32;
				// 	this.gp_arrow.addChild(img);
				// }, this);
				count++;
			};
			textArrayNext.pop();
			this.lb_attr_next.textFlow = textArrayNext;

			this.baseItem_left.updateBaseItem(ClientType.EQUIP, equipInfo.id);
			this.baseItem_right.updateBaseItem(ClientType.EQUIP, nextInfo.id);
			this.baseItem_left.setCarrerIconVisible(false);
			this.baseItem_right.setCarrerIconVisible(false);

			//橙装精华
			let itemInfo = BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, 11);
			if (!itemInfo) {
				itemInfo = { num: 0 };
			}
			if (itemInfo.num >= equipInfo.consumption) { //足够
				this.lb_cost.textFlow = [{ text: String(itemInfo.num), style: { textColor: 0x63d72a } }, { text: "/" + equipInfo.consumption, style: { textColor: 0xbfbfbf } }];
			} else {
				this.lb_cost.textFlow = [{ text: String(itemInfo.num), style: { textColor: 0xb90b0a } }, { text: "/" + equipInfo.consumption, style: { textColor: 0xbfbfbf } }];
			}

		}

		public updateView(data) {
			this.updateEquip();
			this.updateMiddleView();
			this.checkRedDot();
		}

		//关闭界面
		// private closePanel() {
		// 	App.WinManager.closeWin(WinName.FORGE_ORANGE);
		// }

		//关闭界面
		// private returnPanel() {
		// App.WinManager.closeWin(WinName.FORGE_ORANGE);
		// if (this._lastModuleName) {
		// 	App.WinManager.openWin(this._lastModuleName);
		// }
		// }

		private showWay() {
			// let view = new ItemWay(ClientType.BASE_ITEM, 11);
			// PopUpManager.addPopUp({ obj: view });
			App.GlobalTips.showItemWayTips(ClientType.BASE_ITEM, 11);
		}

		private sendUpgradeRequest() {
			App.Socket.send(15010, { id: this.heroModel.heroInfo[this.heroModel.curPos].id, part: this.forgeModel.curOrangePart });
		}

		/**
		 * 打开窗口
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			if (openParam) {
				this._lastModuleName = openParam.lastModule;
			}
			if (!this._infoHandle) {
				this._infoHandle = App.EventSystem.addEventListener(PanelNotify.HERO_ON_HERO_SELECT, this.updateView, this);
			}
			App.EventSystem.addEventListener(PanelNotify.FORGE_ORANGE_EQUIP, this.updateView, this);
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
			if (this._infoHandle) {
				App.EventSystem.removeEventListener(PanelNotify.HERO_ON_HERO_SELECT, this._infoHandle);
				this._infoHandle = undefined;
			}
			App.EventSystem.removeEventListener(PanelNotify.FORGE_ORANGE_EQUIP);
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
		}
	}
}
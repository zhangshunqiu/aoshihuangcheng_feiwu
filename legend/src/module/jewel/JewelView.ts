/**
 * module : 宝石模块界面
 * ahtuor : zrj
*/
module game {
	export class JewelView extends BaseView {
		public gp_main: eui.Group;
		public com_baseview: ComBaseViewBg;
		public gp_equip: eui.Group;
		public bmlb_cap: eui.BitmapLabel;
		public hero_head: game.HeroHeadComponentView;
		public img_master: eui.Image;
		public img_attr: eui.Image;
		public btn_combine: eui.Button;
		public btn_all: eui.Button;
		public baseItem_equip: customui.BaseItem;
		public img_atk: eui.Image;
		public img_hp: eui.Image;
		public img_def: eui.Image;
		public img_sdef: eui.Image;
		public lb_atk: eui.Label;
		public lb_hp: eui.Label;
		public lb_def: eui.Label;
		public lb_sdef: eui.Label;
		public lb_atk_up: eui.Label;
		public lb_hp_up: eui.Label;
		public lb_def_up: eui.Label;
		public lb_sdef_up: eui.Label;
		public btn_return: eui.Button;

		public gp_jewel: eui.Group;
		public gp_middle: eui.Group;
		public lb_attr: eui.Label;
		public lb_name: eui.Label;
		public img_select: eui.Image;

		private _handleId: number = 0;
		private _equipArray: Array<customui.BaseItem> = [];
		private _jewelArray: Array<eui.Image> = [];
		private _jewelLevelArray: Array<eui.Label> = [];
		private _jewelLevelTipArray: Array<eui.Label> = [];
		private _curPos: number = 0;
		private _curPart: number = 1;
		private _playEffectArray = []; //一键镶嵌的特效数组

		private heroModel: HeroModel = HeroModel.getInstance();
		private jewelModel: JewelModel = JewelModel.getInstance();
		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
		}

		protected childrenCreated() {
			super.childrenCreated();
			
			this.initView();
		}

		private initView() {

			this.img_master.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
				// let view = new JewelMasterView({ pos: this._curPos, part: this._curPart });
				// PopUpManager.addPopUp({ obj: view });
				App.WinManager.openWin(WinName.POP_JEWEL_MASTER, { data: { pos: this._curPos, part: this._curPart } });
			}, this);

			this.img_attr.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
				// let view = new JewelSuperView({ pos: this._curPos, part: this._curPart });
				// PopUpManager.addPopUp({ obj: view });
				App.WinManager.openWin(WinName.POP_JEWEL_SUPER, { data: { pos: this._curPos, part: this._curPart } });
			}, this);

			this.btn_all.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
				App.Socket.send(15008, { id: this.heroModel.heroInfo[this._curPos].id });
			}, this);

			this.btn_combine.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
				App.WinManager.openWin(WinName.SYNTHESIS, { lastModule: WinName.JEWEL });
			}, this);

			this.btn_return.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
				HeroModel.getInstance().curPos = this._curPos;
				App.WinManager.openWin(WinName.HERO);
			}, this);

			this._curPos = this.heroModel.curPos;
			this.initEquip();
			this.updateEquipView();

			App.BtnTipManager.addBtnTipItem(ConstBtnTipType.ROLE_RUBY_EMBED, this.btn_all);
			App.BtnTipManager.addBtnTipItem(ConstBtnTipType.ROLE_RUBY_COMNINE, this.btn_combine);
		}

		private initEquip() {
			this.img_select = new eui.Image();
			RES.getResAsync("equipping_choose_png", (texture) => {
				this.img_select.source = texture;
			}, this);

			egret.setTimeout(() => {
				this.img_select.x = 65;
			}, this, 80);

			for (let i = 1; i <= 10; i++) {
				let item = new customui.BaseItem();
				if (i % 2 != 0) {
					item.left = 70;
				} else {
					item.right = 70;
				}
				item.y = 34 + (Math.floor((i - 1) / 2) * (item.height + 17));
				//特殊处理衣服和头盔
				if (i == 2) { //衣服
					item.right = undefined;
					item.left = 70;
					item.y = 34 + (Math.floor((i + 1 - 1) / 2) * (item.height + 17));
				} else if (i == 3) { //头盔
					item.left = undefined;
					item.right = 70;
					item.y = 34 + (Math.floor((i - 1 - 1) / 2) * (item.height + 17));
				}
				let equipInfo = this.heroModel.heroInfo[this._curPos].getPartInfoByPart(i);
				if (this.heroModel.heroInfo[this._curPos].equipExist(i) >= 0) { //有装备

					item.updateBaseItem(ClientType.EQUIP, equipInfo.good_id, null);
					item.setCarrerIconVisible(false);
					item.setStrengthLvVisible(false);
				} else {
					item.updateBaseItem(ClientType.EQUIP, 0, null);
					// RES.getResAsync(ConstEquipIcon[i] + "_png", (texture) => {
					// 	item.img_icon.source = texture;
					// }, this);
					item.setItemIcon(ConstEquipIcon[i] + "_png");
					item.setStrengthLvVisible(false);
				}

				this.gp_equip.addChild(item);
				item.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
					if (i == this._curPart) {
						return;
					}
					this._curPart = i;
					this.setSelect();
					this.moveAnimate(i);
					// this.updateEquipView();
				}, this);
				this._equipArray.push(item);
			}

			this._jewelLevelArray.push(this.lb_atk);
			this._jewelLevelArray.push(this.lb_hp);
			this._jewelLevelArray.push(this.lb_def);
			this._jewelLevelArray.push(this.lb_sdef);
			this._jewelLevelTipArray.push(this.lb_atk_up);
			this._jewelLevelTipArray.push(this.lb_hp_up);
			this._jewelLevelTipArray.push(this.lb_def_up);
			this._jewelLevelTipArray.push(this.lb_sdef_up);

			this._jewelArray.push(this.img_atk);
			this._jewelArray.push(this.img_hp);
			this._jewelArray.push(this.img_def);
			this._jewelArray.push(this.img_sdef);
			this._jewelArray.forEach((value, index, array) => {
				value.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
					this.showJewelTip(index);
				}, this);
			}, this);
		}

		private checkRedDot() {
			this.jewelModel.heroheadRedPoint.forEach((value, index, array) => {
				this.hero_head.setRedTips(index, value);
			}, this)
			for (let i = 0; i < 10; i++) {
				if (this.jewelModel.equipPartRedPoint[this._curPos+1][i + 1]) {
					this._equipArray[i].showRedTips(true);
				} else {
					this._equipArray[i].hideRedTips();
				}

			}
		}

		private showJewelTip(index) {
			let jewelInfo = this.heroModel.heroInfo[this._curPos].getJewelInfoByPart(this._curPart);
			if (!jewelInfo[index].stone_id) {  //未激活
				this.showJewelWay(index);
			} else {
				let data = { heroId: this.heroModel.heroInfo[this._curPos].id, part: this._curPart, hole: jewelInfo[index].hole, id: jewelInfo[index].stone_id };
				// let view = new JewelTipView(data);
				// PopUpManager.addPopUp({ obj: view });
				App.WinManager.openWin(WinName.POP_JEWEL_TIP, { data: data });
			}


		}

		private showJewelWay(index) {
			let id = 1001;
			switch (index + 1) {
				case JewelType.ATTACK: {
					id = 1001;
					break;
				}
				case JewelType.LIFE: {
					id = 1101;
					break;
				}
				case JewelType.DEFENCE: {
					id = 1201;
					break;
				}
				case JewelType.MAGIC: {
					id = 1301;
					break;
				}

				default: break;
			}

			// let view = new ItemWay(ClientType.BASE_ITEM, id);
			// PopUpManager.addPopUp({ obj: view });
			App.GlobalTips.showItemWayTips(ClientType.BASE_ITEM, id);
		}

		//移动动画
		private moveAnimate(part) {
			let preItem = this._equipArray[part - 1];
			let item = new customui.BaseItem();
			item.x = preItem.x;
			item.y = preItem.y;
			item.updateBaseItem(ClientType.EQUIP, 0);
			// item.img_icon.source = preItem.img_icon.source;
			item.setItemIcon(preItem.getItemIcon());
			preItem.parent.addChild(item);
			egret.Tween.get(item).to({ x: 355, y: 175 }, 300, egret.Ease.sineOut).call(() => {
				if (item.parent) {
					item.parent.removeChild(item);
				}
				this.updateEquipView();
			}, this);
		}

		//选中框
		private setSelect() {
			if (this.img_select.parent) {
				this.img_select.parent.removeChild(this.img_select);
			}
			this.img_select.x = this._equipArray[this._curPart - 1].x - 50;
			this.img_select.y = this._equipArray[this._curPart - 1].y - 50;
			this._equipArray[this._curPart - 1].parent.addChild(this.img_select);
			this._equipArray[this._curPart - 1].parent.setChildIndex(this.img_select, 0);
		}

		private equipAnimate(info) {
			for (let k in info.hole) {
				let effectMc = new EffectMovieClip();
				effectMc.playMCKey("effbsxqcg", "", 1, null, null, () => {
					if (effectMc.parent) {
						effectMc.parent.removeChild(effectMc);
					}
					effectMc.destroy();
				}, this);
				this.gp_jewel.addChild(effectMc);
				effectMc.x = this._jewelArray[info.hole[k] - 1].x + 40;
				effectMc.y = this._jewelArray[info.hole[k] - 1].y + 40;
			}

			let effectMc2 = new EffectMovieClip();
			effectMc2.playMCKey("effbsxqcg", "", 1, null, null, () => {
				if (effectMc2.parent) {
					effectMc2.parent.removeChild(effectMc2);
				}
				effectMc2.destroy();
				if (this._playEffectArray.length > 0) {
					this.equipAnimate(this._playEffectArray[0]);
					this._playEffectArray.shift();
				} else {
					this.touchChildren = true;
				}
			}, this);
			this.gp_equip.addChild(effectMc2);
			effectMc2.x = this._equipArray[info.part - 1].x;
			effectMc2.y = this._equipArray[info.part - 1].y;

		}

		private upgradeAnimate(index) {
			let effectMc = new EffectMovieClip();
			effectMc.playMCKey("effbssj", "", 1, null, null, () => {
				if (effectMc.parent) {
					effectMc.parent.removeChild(effectMc);
				}
				effectMc.destroy();
			}, this);
			this.gp_jewel.addChild(effectMc);
			effectMc.x = this._jewelArray[index - 1].x + 38;
			effectMc.y = this._jewelArray[index - 1].y + 44;
		}

		public updateView(data) {
			if (data || data == 0) {
				this._curPos = data;
				this.updateEquip();
			}
			this.updateEquipView();
			// this.checkRedDot();
		}

		//接口成功返回，播放动画
		public upgradeSuccess(data) {
			if (data) {  //单个宝石升级
				this.upgradeAnimate(data.hole);
			}
			this.updateView(null);
		}

		//接口成功返回，播放动画
		public oneEquipSuccess(data) {
			if (data) {  //一键镶嵌
				let posArr = {};//四个位置 哪个位置升级了
				for (let k in data.stone_info) {
					let exist = false;
					for (let j in data.stone_info[k].sotne_list) {
						let info = data.stone_info[k].sotne_list[j];
						if (info.stone_id) {
							posArr[info.hole] = info.hole;
							exist = true;
						}
					}
					if (exist) {
						//特殊处理衣服和头盔
						if (this._playEffectArray.length > 0 && this._playEffectArray[this._playEffectArray.length - 1].part == 2 && data.stone_info[k].part == 3) {
							this._playEffectArray.splice(this._playEffectArray.length - 1, 0, { hole: posArr, part: data.stone_info[k].part });
						} else {
							this._playEffectArray.push({ hole: posArr, part: data.stone_info[k].part });
						}
					}
				}
				// for (let k in posArr) {

				// }
				if (this._playEffectArray.length > 0) {
					this.equipAnimate(this._playEffectArray[0]);
					this._playEffectArray.shift();
					this.touchChildren = false;
				} else {
					App.GlobalTips.showTips("没有可镶嵌的宝石");
				}
			}
			this.updateView(null);
		}

		//切换角色时 更新装备信息
		public updateEquip() {
			for (let i = 0; i < 10; i++) {
				let item = this._equipArray[i];
				let equipInfo = this.heroModel.heroInfo[this._curPos].getPartInfoByPart(i + 1);
				if (this.heroModel.heroInfo[this._curPos].equipExist(i + 1) >= 0) { //有装备
					item.updateBaseItem(ClientType.EQUIP, equipInfo.good_id, null, equipInfo);
					item.setCarrerIconVisible(false);
					item.setStarLvVisible(false);
				} else {
					item.updateBaseItem(ClientType.EQUIP, 0, null, equipInfo);
					item.setStarLvVisible(false);
					// RES.getResAsync(ConstEquipIcon[i + 1] + "_png", (texture) => {
					// 	item.img_icon.source = texture;
					// }, this);
					item.setItemIcon(ConstEquipIcon[i + 1] + "_png");
				}
			}
		}

		//更新整个界面
		private updateEquipView() {
			this.checkRedDot();
			let heroInfo = this.heroModel.heroInfo[this._curPos];
			let pos = heroInfo.equipExist(this._curPart);

			if (this._curPos <= this.heroModel.heroInfo.length - 1) {
				this.bmlb_cap.text = String(heroInfo.score);
			} else {
				this.bmlb_cap.text = "";
			}

			this.setSelect();

			if (pos >= 0) { //有装备
				this.baseItem_equip.updateBaseItem(ClientType.EQUIP, heroInfo.equip_info[pos].good_id, null);
				this.baseItem_equip.setStrengthLvVisible(false);
				this.baseItem_equip.setCarrerIconVisible(false);
			} else {
				this.baseItem_equip.updateBaseItem(ClientType.EQUIP, 0, null);
				this.baseItem_equip.setStrengthLvVisible(false);
				// RES.getResAsync(ConstEquipIcon[this._curPart] + "_png", (texture) => {
				// 	this.baseItem_equip.img_icon.source = texture;
				// }, this);
				this.baseItem_equip.setItemIcon(ConstEquipIcon[this._curPart] + "_png");
			}

			let jewelInfo = heroInfo.getJewelInfoByPart(this._curPart);
			let nameArr = [{ text: ConstJewelName[1] + "\n" }, { text: ConstJewelName[2] + "\n" }, { text: ConstJewelName[3] + "\n" }, { text: ConstJewelName[4] + "\n" }];
			let attrArr = [{ text: "未激活" + "\n", style: {} }, { text: "未激活" + "\n", style: {} }, { text: "未激活" + "\n", style: {} }, { text: "未激活" + "\n", style: {} }];
			for (let i = 0; i < jewelInfo.length; i++) {
				let info = App.ConfigManager.getJewelInfoById(jewelInfo[i].stone_id);
				if (info) {
					nameArr[i] = { text: info.name + "\n" };
					if (jewelInfo[i].hole == JewelType.ATTACK) {
						if (heroInfo.job == CareerType.SOLDIER) {
							attrArr[i] = { text: "+" + info["ac"] + "\n", style: { textColor: 0x0de903 } };
						} else if (heroInfo.job == CareerType.MAGES) {
							attrArr[i] = { text: "+" + info["mac"] + "\n", style: { textColor: 0x0de903 } };
						} else if (heroInfo.job == CareerType.TAOIST) {
							attrArr[i] = { text: "+" + info["sc"] + "\n", style: { textColor: 0x0de903 } };
						}
					} else if (jewelInfo[i].hole == JewelType.LIFE) {
						attrArr[i] = { text: "+" + info["hp"] + "\n", style: { textColor: 0x0de903 } };
					} else if (jewelInfo[i].hole == JewelType.DEFENCE) {
						attrArr[i] = { text: "+" + info["def"] + "\n", style: { textColor: 0x0de903 } };
					} else if (jewelInfo[i].hole == JewelType.MAGIC) {
						attrArr[i] = { text: "+" + info["sdef"] + "\n", style: { textColor: 0x0de903 } };
					}
					this.changeJewelGroup(i, true, jewelInfo[i].stone_id);
				} else {
					this.changeJewelGroup(i, false, jewelInfo[i].stone_id);
				}

			}
			this.lb_name.textFlow = nameArr;
			this.lb_attr.textFlow = attrArr;
			// let itemInfo = App.ConfigManager.getItemInfoById(jewelInfo.id);
		}

		//改变界面宝石状态
		private changeJewelGroup(index, status, id) {
			let info = App.ConfigManager.getItemInfoById(id);
			if (status) { //激活了
				this._jewelLevelArray[index].visible = true;
				this._jewelLevelArray[index].text = "LV." + info.limit_lv;
				RES.getResAsync(ConstJewelIcon[index + 1] + "_png", (texture) => {
					this._jewelArray[index].source = texture;
				}, this);
				// RES.getResAsync(ConstJewelIcon[index + 1].replace("_l_", "_s_") + "_png", (texture) => {
				// 	(<eui.Image>this.gp_middle.getChildAt(3 + index)).source = texture;
				// }, this);

				let numInfo = (BackpackModel.getInstance() as BackpackModel).getItemByTypeIdUuid(ClientType.BASE_ITEM, id);
				if (numInfo) {
					let maxLevel = App.ConfigManager.getConstConfigByType("JEWEL_LEVEL_MAX").value;
					let baseInfo = App.ConfigManager.getItemInfoById(id);
					if (numInfo.num >= 2 && baseInfo.limit_lv < maxLevel) {
						this._jewelLevelTipArray[index].visible = true;
					} else {
						this._jewelLevelTipArray[index].visible = false;
					}
				} else {
					this._jewelLevelTipArray[index].visible = false;
				}

			} else {
				this._jewelLevelTipArray[index].visible = false;
				this._jewelLevelArray[index].visible = false;
				RES.getResAsync(ConstJewelIcon[index + 1] + "_hui_png", (texture) => {
					this._jewelArray[index].source = texture;
				}, this);
				// RES.getResAsync(ConstJewelIcon[index + 1].replace("_l_", "_s_") + "_hui_png", (texture) => {
				// 	(<eui.Image>this.gp_middle.getChildAt(3 + index)).source = texture;
				// }, this);
			}
		}

		/**
		 * 打开窗口
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			if(this.com_baseview){
				this.com_baseview.winVo = this.winVo;
			}
			this.hero_head.readyOpen();
			if (this._handleId == 0) {
				this._handleId = App.EventSystem.addEventListener(PanelNotify.HERO_ON_HERO_SELECT, this.updateView, this);
			}
			App.EventSystem.addEventListener(PanelNotify.JEWEL_UPDATE_VIEW, this.upgradeSuccess, this);
			App.EventSystem.addEventListener(PanelNotify.JEWEL_UPDATE_ALL_VIEW, this.oneEquipSuccess, this);
			
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
			this.hero_head.clear();
			if (this._handleId != 0) {
				App.EventSystem.removeEventListener(PanelNotify.HERO_ON_HERO_SELECT, this._handleId);
				this._handleId = 0;
			}
			App.EventSystem.removeEventListener(PanelNotify.JEWEL_UPDATE_VIEW);
			App.EventSystem.removeEventListener(PanelNotify.JEWEL_UPDATE_ALL_VIEW);
			if (this.com_baseview) {
				this.com_baseview.destroy();
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
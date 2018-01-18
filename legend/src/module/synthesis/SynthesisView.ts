/**
 * 合成模块视图
 * author : zrj
*/
module game {
	export class SynthesisView extends BaseView {
		public gp_main: eui.Group;
		public commonWin: customui.CommonWin;
		public gp_top: eui.Group;
		public baseItem1: customui.BaseItem;
		public baseItem2: customui.BaseItem;
		public baseItem3: customui.BaseItem;
		public baseItem4: customui.BaseItem;
		public gp_middle: eui.Group;
		public baseItem_left: customui.BaseItem;
		public baseItem_right: customui.BaseItem;
		public gp_preview: eui.Group;
		public lb_rate: eui.Label;
		public lb_attr: eui.Label;
		public lb_attr_next: eui.Label;
		public img_cur: eui.Image;
		public img_next: eui.Image;
		public img_all: eui.Image;
		public img_synthesis: eui.Image;
		public scroller: eui.Scroller;
		public gp_bottom: eui.Group;
		public btn_jewel: eui.Button;
		public btn_wing: eui.Button;
		public btn_equip: eui.Button;
		public btn_item: eui.Button;
		public img_return: eui.Image;
		public img_arrow: eui.Image;

		public list: eui.List = new eui.List();

		private _preIndex: number; //之前第几页
		private _curIndex: number; //当前第几页
		private _curJewelType: number = 1; //当前类型
		private _curWingType: number = 1; //当前类型
		private _curEquipType: number = 1; //当前类型
		private _curID: number; //当前需要合成物品id
		private _curSelect: number = 0; //当前选中第几个
		private _itemArray: Array<customui.BaseItem> = [];
		private _effectArray: Array<any> = []; //一键合成特效数组
		private _lastModuleName: string; //上一个模块
		private heroModel: HeroModel = HeroModel.getInstance();
		private synthesisModel: SynthesisModel = SynthesisModel.getInstance();
		private backpackModel: BackpackModel = BackpackModel.getInstance();

		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.initView();
		}

		private initView() {
			RES.getResAsync("compound_hecheng_title_png", (texture) => {
				this.commonWin.img_title.texture = texture;
			}, this);

			this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				App.WinManager.closeWin(WinName.SYNTHESIS);
			}, this);

			this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeView, this);

			this.img_all.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				App.Socket.send(14014, { type: this._curIndex, to_good_id: this._curID });
			}, this);

			this.img_synthesis.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				App.Socket.send(14013, { type: this._curIndex, to_good_id: this._curID });
			}, this);

			this.btn_jewel.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				this._curID = undefined;
				this._curSelect = 0;
				this.updateView(1);
			}, this);

			this.btn_wing.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				this._curID = undefined;
				this._curSelect = 0;
				this.updateView(2);
			}, this);

			this.btn_equip.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				this._curID = undefined;
				this._curSelect = 0;
				this.updateView(3);
			}, this);

			this.btn_item.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				this._curID = undefined;
				this._curSelect = 0;
				this.updateView(4);
			}, this);

			this.baseItem_right.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				App.GlobalTips.showItemTips(ClientType.BASE_ITEM, this._curID, null);
			}, this);

			this.baseItem_left.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				let info = App.ConfigManager.getSynthesisInfoById(this._curID);
				App.GlobalTips.showItemTips(ClientType.BASE_ITEM, info.need, null);
			}, this);

			this._itemArray.push(this.baseItem1);
			this._itemArray.push(this.baseItem2);
			this._itemArray.push(this.baseItem3);
			this._itemArray.push(this.baseItem4);

			this._itemArray.forEach((value, index, array) => {
				value.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
					if (this._curIndex == ConstSynthesisType.JEWEL) {
						if (this._curJewelType == index + 1) {
							return;
						}
						this._curJewelType = index + 1;
					} else if (this._curIndex == ConstSynthesisType.WING) {
						if (this._curWingType == index + 1) {
							return;
						}
						this._curWingType = index + 1;
					} else if (this._curIndex == ConstSynthesisType.EQUIP) {
						if (this._curEquipType == index + 1) {
							return;
						}
						this._curEquipType = index + 1;
					}
					this.updateView(this._curIndex);
				}, this);
			}, this);

			this.list.itemRenderer = SynthesisItem;
			this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, (event: eui.ItemTapEvent) => {
				if (event.itemIndex != this._curSelect) {
					// this._curID = event.item.id;
					this._curSelect = event.itemIndex;
					this.updateView(this._curIndex);
					// (<SynthesisItem>event.currentTarget).img_item.source = RES.getRes("Login_btn_xuanz_png");
				}
			}, this);
			this.scroller.viewport = this.list;
			this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
			this.scroller.verticalScrollBar.autoVisibility = false;
			this.scroller.verticalScrollBar.visible = false;
			this.scroller.bounces = false;

			this._curIndex = this.synthesisModel.synthesisType;
			// this.updateView(this._curIndex);

			App.BtnTipManager.addBtnTipItem(ConstBtnTipType.ROLE_RUBY_COMNINE_GEMSTONE, this.btn_jewel);
			App.BtnTipManager.addBtnTipItem(ConstBtnTipType.ROLE_RUBY_COMNINE_WING, this.btn_wing);

		}

		private checkRedDot(type) {
			if (type == ConstSynthesisType.JEWEL) {
				this._itemArray.forEach((value, index, array) => {
					if (this.synthesisModel.jewelRedPoint[index]) {
						value.showRedTips(true);
					} else {
						value.hideRedTips();
					}
				}, this)
			} else if (type == ConstSynthesisType.WING) {
				this._itemArray.forEach((value, index, array) => {
					if (this.synthesisModel.wingRedPoint[index]) {
						value.showRedTips(true);
					} else {
						value.hideRedTips();
					}
				}, this)
			}
		}

		//合成成功特效
		private successAnimate(cb?: Function) {
			let effectMc = new EffectMovieClip();
			effectMc.playMCKey("effbsxqcg", "", 1, null, () => {
				effectMc.frameRate = 10;
			}, () => {
				App.logzrj(effectMc);
				if (effectMc.parent) {
					effectMc.parent.removeChild(effectMc);
				}
				if (cb) {
					egret.setTimeout(() => { cb.call(this) }, this, 150);
					// cb.call(this);
				}
				effectMc.destroy();
			}, this);
			this.gp_middle.addChild(effectMc);
			effectMc.x = this.baseItem_left.x;
			effectMc.y = this.baseItem_left.y;

			let effectMc2 = new EffectMovieClip();
			effectMc2.playMCKey("effbsxqcg", "", 1, null, () => {
				effectMc2.frameRate = 10;
			}, () => {
				if (effectMc2.parent) {
					effectMc2.parent.removeChild(effectMc2);
				}
				effectMc2.destroy();
			}, this);
			this.gp_middle.addChild(effectMc2);
			effectMc2.x = this.baseItem_right.x;
			effectMc2.y = this.baseItem_right.y;
		}

		//合成成功返回
		private handleSynthesisSuccess(data) {
			let callback = () => {
				// let view = new SynthesisSuccessView(data.to_good_id, 1);
				// PopUpManager.addPopUp({ obj: view });
				App.WinManager.openPopWin(WinName.POP_SYNTHESISSUCCESS, { id: data.to_good_id, num: 1 });
			}
			callback.bind(this);
			this.successAnimate(callback);
			this.updateView(data.type);
			// let view = new SynthesisSuccessView(data.to_good_id,1);
			// PopUpManager.addPopUp({obj:view});
		}

		private handleAllSynthesisSuccess(data) {
			this._effectArray = data.to_good_list;
			//特效播放完成返回
			let callback = () => {
				let item = this._effectArray.shift();
				if (this._effectArray.length > 0) {
					let info = App.ConfigManager.getItemInfoById(this._effectArray[0].good_id);
					let index = this.list.dataProvider.getItemIndex(info);
					this.successAnimate(callback);
					this._curSelect = index;
					this.updateView(data.type);
				} else {
					// let view = new SynthesisSuccessView(item.good_id, item.num);
					// PopUpManager.addPopUp({ obj: view });
					App.WinManager.openWin(WinName.POP_SYNTHESISSUCCESS, { id: item.good_id, num: item.num });
					this.touchChildren = true;
				}
			}
			callback.bind(this);
			if (this._effectArray.length > 0) {
				let info = App.ConfigManager.getItemInfoById(this._effectArray[0].good_id);
				let index = this.list.dataProvider.getItemIndex(info);
				this.successAnimate(callback);
				this._curSelect = index;
				this.updateView(data.type);
				this.touchChildren = false;
			} else {
				this.updateView(data.type);
			}
		}

		private updateView(index) {
			this.btn_item.currentState = "up";
			this.btn_jewel.currentState = "up";
			this.btn_equip.currentState = "up";
			this.btn_wing.currentState = "up";
			if (index == ConstSynthesisType.JEWEL) {
				this.updateJewelView();
				this.btn_jewel.currentState = "down";
			} else if (index == ConstSynthesisType.WING) {
				this.updateWingView();
				this.btn_wing.currentState = "down";
			} else if (index == ConstSynthesisType.EQUIP) {
				// this.updateEquipView();
				// this.btn_equip.currentState = "down";
			} else {
				this.updateJewelView();
				this.btn_jewel.currentState = "down";
			}
			this.checkRedDot(index);
		}

		private updateJewelView() {
			this._curIndex = 1;
			this._itemArray.forEach((value:customui.BaseItem, index, array) => {
				value.setItemIcon(ConstJewelIcon[index + 1] + "_hui");
				// RES.getResAsync(ConstJewelIcon[index + 1] + "_hui", (texture) => {
				// 	value.img_icon.source = texture;
				// }, this);
				if (this._curJewelType == index + 1) { //选中
					value.setSelect(true);
				} else {
					value.setSelect(false);
				}
			}, this)

			let data = App.ConfigManager.getItemInfoByTypeAndSubType(ItemType.RUBY, this._curJewelType);
			let offset = this.list.scrollV;
			this.list.dataProvider = new eui.ArrayCollection(data);
			this.list.selectedIndex = this._curSelect;
			this.list.validateNow();
			this.list.scrollV = offset;
			if (!this._curID) {
				this._curID = data[0].id;
			} else {
				this._curID = data[this._curSelect].id;
			}
			let info = App.ConfigManager.getSynthesisInfoById(this._curID);
			let preInfo = App.ConfigManager.getItemInfoById(info.need);
			let nextInfo = App.ConfigManager.getItemInfoById(info.id);
			let preAttr = App.ConfigManager.getJewelInfoById(info.need);
			let nextAttr = App.ConfigManager.getJewelInfoById(info.id);
			let itemInfo = this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, info.need);
			if (!itemInfo) {
				itemInfo = { num: 0 };
			}
			if (preAttr) { //拥有前一级
				this.lb_attr_next.visible = true;
				this.img_arrow.visible = true;
				this.lb_attr.horizontalCenter = -110;
				let textArrL = [];
				let textArrR = [];
				if (preInfo.sub_type == JewelType.ATTACK) {
					textArrL.push({ text: "攻击" + "：" + preAttr["ac"], style: { textColor: 0xbfbfbf } });
					textArrL.push({ text: "\n" });
				} else if (preInfo.sub_type == JewelType.LIFE) {
					textArrL.push({ text: ConstAttribute["hp"] + "：" + preAttr["hp"], style: { textColor: 0xbfbfbf } });
					textArrL.push({ text: "\n" });
				} else if (preInfo.sub_type == JewelType.DEFENCE) {
					textArrL.push({ text: ConstAttribute["def"] + "：" + preAttr["def"], style: { textColor: 0xbfbfbf } });
					textArrL.push({ text: "\n" });
				} else if (preInfo.sub_type == JewelType.MAGIC) {
					textArrL.push({ text: ConstAttribute["sdef"] + "：" + preAttr["sdef"], style: { textColor: 0xbfbfbf } });
					textArrL.push({ text: "\n" });
				}
				//拥有超级属性
				if (preInfo.super_attribute) {
					textArrL.push({ text: "超级属性" + "：" + String(preInfo.super_attribute / 100 + "%"), style: { textColor: 0xbfbfbf } });
					textArrL.push({ text: "\n" });
				} else if (nextInfo.super_attribute && !preInfo.super_attribute) {
					textArrL.push({ text: "超级属性" + "：" + "0%", style: { textColor: 0xbfbfbf } });
					textArrL.push({ text: "\n" });
				}
				textArrL.pop();
				this.lb_attr.textFlow = textArrL;
				this.lb_attr.bold = true;

				if (nextInfo.sub_type == JewelType.ATTACK) {
					textArrR.push({ text: nextAttr["ac"], style: { textColor: 0x0de903 } });
					textArrR.push({ text: "\n" });
				} else if (nextInfo.sub_type == JewelType.LIFE) {
					textArrR.push({ text: nextAttr["hp"], style: { textColor: 0x0de903 } });
					textArrR.push({ text: "\n" });
				} else if (nextInfo.sub_type == JewelType.DEFENCE) {
					textArrR.push({ text: nextAttr["def"], style: { textColor: 0x0de903 } });
					textArrR.push({ text: "\n" });
				} else if (nextInfo.sub_type == JewelType.MAGIC) {
					textArrR.push({ text: nextAttr["sdef"], style: { textColor: 0x0de903 } });
					textArrR.push({ text: "\n" });
				}
				if (nextInfo.super_attribute) {
					textArrR.push({ text: String(nextInfo.super_attribute / 100 + "%"), style: { textColor: 0x0de903 } });
					textArrR.push({ text: "\n" });
				}
				textArrR.pop();
				this.lb_attr_next.textFlow = textArrR;
				this.lb_attr_next.bold = true;
				this.img_cur.visible = true;
				this.img_next.horizontalCenter = 110;

			} else {
				let textArr = [];
				if (nextInfo.sub_type == JewelType.ATTACK) {
					textArr.push({ text: "攻击" + "：" + nextAttr["ac"], style: { textColor: 0x0de903 } });
					textArr.push({ text: "\n" });
				} else if (nextInfo.sub_type == JewelType.LIFE) {
					textArr.push({ text: ConstAttribute["hp"] + "：" + nextAttr["hp"], style: { textColor: 0x0de903 } });
					textArr.push({ text: "\n" });
				} else if (nextInfo.sub_type == JewelType.DEFENCE) {
					textArr.push({ text: ConstAttribute["def"] + "：" + nextAttr["def"], style: { textColor: 0x0de903 } });
					textArr.push({ text: "\n" });
				} else if (nextInfo.sub_type == JewelType.MAGIC) {
					textArr.push({ text: ConstAttribute["sdef"] + "：" + nextAttr["sdef"], style: { textColor: 0x0de903 } });
					textArr.push({ text: "\n" });
				}
				textArr.pop();
				this.lb_attr.horizontalCenter = 0;
				this.lb_attr.textFlow = textArr;
				this.lb_attr.bold = true;
				this.lb_attr_next.visible = false;
				this.img_arrow.visible = false;
				this.lb_attr.horizontalCenter = 0;
				this.img_cur.visible = false;
				this.img_next.horizontalCenter = 0;
			}

			this.baseItem_left.updateBaseItem(ClientType.BASE_ITEM, info.need);
			this.baseItem_right.updateBaseItem(ClientType.BASE_ITEM, info.id);
			this.baseItem_left.setItemNameVisible(true);
			this.baseItem_right.setItemNameVisible(true);

			if (itemInfo.num >= info.number) { //足够
				this.baseItem_left.setItemName([{ text: ConstJewelName[preInfo.sub_type] + "\n" }, { text: String(itemInfo.num), style: { textColor: 0x63d72a } }, { text: "/" + info.number, style: { textColor: 0xbfbfbf } }]);
				//判断是否是宝石碎片
				if (preInfo.type == ItemType.NORMAL) {
					this.baseItem_left.setItemName([{ text: preInfo.name + "\n" }, { text: String(itemInfo.num), style: { textColor: 0x63d72a } }, { text: "/" + info.number, style: { textColor: 0xbfbfbf } }]);
				}
			} else {
				this.baseItem_left.setItemName([{ text: ConstJewelName[preInfo.sub_type] + "\n" }, { text: String(itemInfo.num), style: { textColor: 0xb90b0a } }, { text: "/" + info.number, style: { textColor: 0xbfbfbf } }]);
				//判断是否是宝石碎片
				if (preInfo.type == ItemType.NORMAL) {
					this.baseItem_left.setItemName([{ text: preInfo.name + "\n" }, { text: String(itemInfo.num), style: { textColor: 0xb90b0a } }, { text: "/" + info.number, style: { textColor: 0xbfbfbf } }]);
				}
			}
			this._preIndex = this._curIndex;
		}

		private updateWingView() {
			this._curIndex = 2;
			this._itemArray.forEach((value:customui.BaseItem, index, array) => {
				// RES.getResAsync(ConstWingIcon[index + 1] + "", (texture) => {
				// 	value.img_icon.source = texture;
				// }, this);
				value.setItemIcon(ConstWingIcon[index + 1] + "");
				if (this._curWingType == index + 1) { //选中
					value.setSelect(true);
				} else {
					value.setSelect(false);
				}
			}, this)
			let data = App.ConfigManager.getItemInfoByTypeAndSubType(ItemType.WING, this._curWingType);
			let offset = this.list.scrollV;
			this.list.dataProvider = new eui.ArrayCollection(data);
			this.list.selectedIndex = this._curSelect;
			this.list.scrollV = offset;
			if (!this._curID) {
				this._curID = data[0].id;
			} else {
				this._curID = data[this._curSelect].id;
			}
			let info = App.ConfigManager.getSynthesisInfoById(this._curID);
			let preInfo = App.ConfigManager.getItemInfoById(info.need);
			let nextInfo = App.ConfigManager.getItemInfoById(info.id);
			let preAttr = App.ConfigManager.getWingAttrById(info.need);
			let nextAttr = App.ConfigManager.getWingAttrById(info.id);
			let itemInfo = this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, info.need);
			if (!itemInfo) {
				itemInfo = { num: 0 };
			}
			if (preAttr) { //拥有前一级
				this.lb_attr_next.visible = true;
				this.img_arrow.visible = true;
				this.lb_attr.horizontalCenter = -110;
				let textArrL = [];
				let textArrR = [];
				textArrL.push({ text: "评分" + "：" + preAttr["grade"] + "\n", style: { textColor: 0xbfbfbf } });
				if (preInfo.sub_type == WingEquipType.ZHENGYU) {
					textArrL.push({ text: "攻击" + "：" + preAttr["ac"], style: { textColor: 0xbfbfbf } });
					textArrL.push({ text: "\n" });
				} else if (preInfo.sub_type == WingEquipType.FUYU) {
					textArrL.push({ text: ConstAttribute["hp"] + "：" + preAttr["hp"], style: { textColor: 0xbfbfbf } });
					textArrL.push({ text: "\n" });
				} else if (preInfo.sub_type == WingEquipType.RONGYU) {
					textArrL.push({ text: ConstAttribute["def"] + "：" + preAttr["def"], style: { textColor: 0xbfbfbf } });
					textArrL.push({ text: "\n" });
				} else if (preInfo.sub_type == WingEquipType.XUYU) {
					textArrL.push({ text: ConstAttribute["sdef"] + "：" + preAttr["sdef"], style: { textColor: 0xbfbfbf } });
					textArrL.push({ text: "\n" });
				}
				textArrL.pop();
				this.lb_attr.textFlow = textArrL;
				this.lb_attr.bold = true;

				textArrR.push({ text: nextAttr["grade"] + "\n", style: { textColor: 0x0de903 } });
				if (nextInfo.sub_type == WingEquipType.ZHENGYU) {
					textArrR.push({ text: nextAttr["ac"], style: { textColor: 0x0de903 } });
					textArrR.push({ text: "\n" });
				} else if (nextInfo.sub_type == WingEquipType.FUYU) {
					textArrR.push({ text: nextAttr["hp"], style: { textColor: 0x0de903 } });
					textArrR.push({ text: "\n" });
				} else if (nextInfo.sub_type == WingEquipType.RONGYU) {
					textArrR.push({ text: nextAttr["def"], style: { textColor: 0x0de903 } });
					textArrR.push({ text: "\n" });
				} else if (nextInfo.sub_type == WingEquipType.XUYU) {
					textArrR.push({ text: nextAttr["sdef"], style: { textColor: 0x0de903 } });
					textArrR.push({ text: "\n" });
				}
				textArrR.pop();
				this.lb_attr_next.textFlow = textArrR;
				this.lb_attr_next.bold = true;
				this.img_cur.visible = true;
				this.img_next.horizontalCenter = 110;

			} else {
				let textArr = [];
				textArr.push({ text: "评分" + "：" + nextAttr["grade"] + "\n", style: { textColor: 0x0de903 } });
				if (nextInfo.sub_type == WingEquipType.ZHENGYU) {
					textArr.push({ text: "攻击" + "：" + nextAttr["ac"], style: { textColor: 0x0de903 } });
					textArr.push({ text: "\n" });
				} else if (nextInfo.sub_type == WingEquipType.FUYU) {
					textArr.push({ text: ConstAttribute["hp"] + "：" + nextAttr["hp"], style: { textColor: 0x0de903 } });
					textArr.push({ text: "\n" });
				} else if (nextInfo.sub_type == WingEquipType.RONGYU) {
					textArr.push({ text: ConstAttribute["def"] + "：" + nextAttr["def"], style: { textColor: 0x0de903 } });
					textArr.push({ text: "\n" });
				} else if (nextInfo.sub_type == WingEquipType.XUYU) {
					textArr.push({ text: ConstAttribute["sdef"] + "：" + nextAttr["sdef"], style: { textColor: 0x0de903 } });
					textArr.push({ text: "\n" });
				}
				textArr.pop();
				this.lb_attr.horizontalCenter = 0;
				this.lb_attr.textFlow = textArr;
				this.lb_attr.bold = true;
				this.lb_attr_next.visible = false;
				this.img_arrow.visible = false;
				this.lb_attr.horizontalCenter = 0;
				this.img_cur.visible = false;
				this.img_next.horizontalCenter = 0;
			}

			this.baseItem_left.updateBaseItem(ClientType.BASE_ITEM, info.need);
			this.baseItem_right.updateBaseItem(ClientType.BASE_ITEM, info.id);
			this.baseItem_left.setItemNameVisible(true);
			this.baseItem_right.setItemNameVisible(true);

			if (itemInfo.num >= info.number) { //足够
				this.baseItem_left.setItemName([{ text: preInfo.name + "\n" }, { text: String(itemInfo.num), style: { textColor: 0x63d72a } }, { text: "/" + info.number, style: { textColor: 0xbfbfbf } }]);
			} else {
				this.baseItem_left.setItemName([{ text: preInfo.name + "\n" }, { text: String(itemInfo.num), style: { textColor: 0xb90b0a } }, { text: "/" + info.number, style: { textColor: 0xbfbfbf } }]);
			}

			this._preIndex = this._curIndex;
		}

		private updateEquipView() {
			this._curIndex = 3;
		}

		//关闭窗口
		public closeView() {
			if (this._lastModuleName) {
				App.WinManager.openWin(this._lastModuleName);
			} else {
				App.WinManager.closeWin(WinName.SYNTHESIS);
			}
		}

		/**
		 * 打开窗口
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			if (openParam) {
				SynthesisModel.getInstance().synthesisType = openParam.type ? openParam.type : ConstSynthesisType.JEWEL;
				this._curIndex = openParam.type ? openParam.type : ConstSynthesisType.JEWEL;
				this._lastModuleName = openParam.lastModule;
			} else {
				SynthesisModel.getInstance().synthesisType = ConstSynthesisType.JEWEL;
			}
			this.updateView(this._curIndex);
			App.EventSystem.addEventListener(PanelNotify.SYNTHESIS_VIEW, this.handleSynthesisSuccess, this);
			// App.EventSystem.addEventListener(PanelNotify.SYNTHESIS_JEWEL_VIEW,this.handleSynthesisSuccess,this);
			// App.EventSystem.addEventListener(PanelNotify.SYNTHESIS_WING_VIEW,this.handleSynthesisSuccess,this);
			// App.EventSystem.addEventListener(PanelNotify.SYNTHESIS_EQUIP_VIEW,this.handleSynthesisSuccess,this);
			App.EventSystem.addEventListener(PanelNotify.SYNTHESIS_ALL_VIEW, this.handleAllSynthesisSuccess, this);
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
			App.EventSystem.removeEventListener(PanelNotify.SYNTHESIS_VIEW);
			// App.EventSystem.removeEventListener(PanelNotify.SYNTHESIS_JEWEL_VIEW);
			// App.EventSystem.removeEventListener(PanelNotify.SYNTHESIS_WING_VIEW);
			// App.EventSystem.removeEventListener(PanelNotify.SYNTHESIS_EQUIP_VIEW);
			App.EventSystem.removeEventListener(PanelNotify.SYNTHESIS_ALL_VIEW);
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
		}
	}

	export class SynthesisItem extends eui.ItemRenderer {
		public lb_name: eui.Label;
		public img_item: eui.Image;
		private _redBtnTips: BtnTips;

		private synthesisModel: SynthesisModel = SynthesisModel.getInstance();
		public constructor() {
			super();
			this.skinName = "SynthesisItemSkin";
		}

		protected dataChanged() {
			this.lb_name.text = this.data.name;
			this.lb_name.textColor = 0xf1d4b2;
			RES.getResAsync("common_btn_list_an_png", (texture) => {
				if (!this.selected) {
					this.img_item.source = texture;
				}
			}, this);

			if (this.selected) {
				RES.getResAsync("common_btn_list_liang_png", (texture) => {
					if (this.selected) {
						this.img_item.source = texture;
					}
				}, this);
				this.lb_name.textColor = 0xffc702;
			}
			if (this.data.type == ItemType.RUBY) {
				if (this.synthesisModel.jewelSubRedPoint[this.data.id]) {
					this.showRedTips(true);
				} else {
					this.hideRedTips();
				}
			} else if (this.data.type == ItemType.WING) {
				if (this.synthesisModel.wingSubRedPoint[this.data.id]) {
					this.showRedTips(true);
				} else {
					this.hideRedTips();
				}
			}

		}

		/**
         * 显示红点
         */
		public showRedTips(value: any) {
			if (this._redBtnTips == null) {
				this._redBtnTips = new BtnTips("", this);
			}
			this._redBtnTips.show(value);
		}
        /**
         * 隐藏红点
         */
		public hideRedTips() {
			if (this._redBtnTips) {
				this._redBtnTips.hide();
			}
		}
	}

	//合成成功弹框
	export class SynthesisSuccessView extends BaseView {
		public baseItem: customui.BaseItem;

		private _id: number;
		private _num: number;
		private _effect: EffectMovieClip;
		public constructor(openParam) {
			super(openParam);
			this.skinName = "SynthesisSuccessSkin";
			// this._id = openParam.id;
			// this._num = openParam.num;
		}

		protected childrenCreated() {
			super.childrenCreated();
			this._effect = new EffectMovieClip();
			this._effect.touchEnabled = false;
			this._effect.x = 205;
			this._effect.y = 40;
			this._effect.playMCKey("effhccgb", "", -1, null, () => {
			}, null, this);
			this.addChild(this._effect);
			this.setChildIndex(this._effect, 1);

			// this.baseItem.updateBaseItem(ClientType.BASE_ITEM, this._id, this._num);
			// this.baseItem.lb_name.visible = true;
		}

		public updateView() {
			this.baseItem.updateBaseItem(ClientType.BASE_ITEM, this._id, this._num);
			if (this._num > 1){
				this.baseItem.setItemNumVisible(true);
			}
		}

		/**
		 * 打开窗口
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			this._id = openParam.id;
			this._num = openParam.num;
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
			super.clear(data);
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
			this._effect.destroy();
		}

	}

}
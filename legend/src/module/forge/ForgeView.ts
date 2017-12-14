/**
 * module : 锻造模块视图
 * author ：zrj
*/
module game {
	export class ForgeView extends BaseView {
		public gp_main: eui.Group;
		public commonWin: customui.CommonWin;
		public headComponent: game.HeroHeadComponentView;
		public btn_strength: eui.Button;
		public btn_star: eui.Button;
		public btn_orange: eui.Button;
		public gp_strength: eui.Group;
		public gp_star: eui.Group;
		public gp_tab: eui.Group;
		public img_return: eui.Image;

		//强化
		public lb_num: eui.Label;
		public gp_equip: eui.Group;
		public img_forge: eui.Image;
		public img_all: eui.Image;
		public lb_left: eui.Label;
		public lb_left0: eui.Label;
		public lb_right: eui.Label;
		public label_get: eui.Label;
		public bmlb_cap: eui.BitmapLabel;
		public img_cost: eui.Image;

		//升星
		public img_attr: eui.Image;
		public img_starCost: eui.Image;
		public img_starUp: eui.Image;
		public baseItem: customui.BaseItem;
		public lb_starNum: eui.Label;
		public lb_starLeft: eui.Label;
		public lb_starRight: eui.Label;
		public lb_starGet: eui.Label;
		public lb_name: eui.Label;
		public lb_star: eui.Label;
		public gp_starEquip: eui.Group;
		public gp_attr: eui.Group;
		public lb_total: eui.Label;

		private _equipArray: Array<customui.BaseItem> = []; //强化数组
		private _equipStarArray: Array<customui.BaseItem> = []; //升星数组
		private _type: number = 1; //窗口类型
		private heroModel: HeroModel = HeroModel.getInstance();
		private forgeModel: ForgeModel = ForgeModel.getInstance();
		private backpackModel: BackpackModel = BackpackModel.getInstance();

		private img_select: eui.Image;  //选中框
		private _handleId: number = 0;  //动画效果id
		private _mc: EffectMovieClip; //熔炉动画特效
		// private _equipMC: EffectMovieClip; //装备部位动画特效
		private _dzmc: EffectMovieClip; //选择动画特效
		private _curPos: number;
		private _strengthCostId: number; //强化消耗物品id
		private _starCostId: number; //升星消耗物品id
		private _strengthCostNum: number; //强化消耗物品Num
		private _starCostNum: number; //升星消耗物品Num
		private _lastModule: string;
		private _isAll: boolean; //是否一键强化
		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
		}

		protected childrenCreated() {
			super.childrenCreated();
			RES.getResAsync("forge_duanzao_title_png", (texture) => {
				this.commonWin.img_title.source = texture;
			}, this);
			this.initView();
		}

		private initView() {

			//初始化动画
			this._mc = new EffectMovieClip();
			this._mc.x = 360;
			this._mc.y = 520;
			this._mc.playMCKey("dzlz", "", -1, null, () => {
				this._mc.frameRate = 7;
			}, null, this);
			this.gp_strength.addChild(this._mc);
			this.gp_strength.setChildIndex(this._mc, 2);

			this._dzmc = new EffectMovieClip();
			this._dzmc.x = 0;
			this._dzmc.y = -2;
			this._dzmc.anchorOffsetX = -75;
			this._dzmc.anchorOffsetY = -30;
			this._dzmc.playMCKey("dzxzk", "", 0, null, null, null, this);
			this.gp_tab.addChild(this._dzmc);
			this.gp_tab.setChildIndex(this._dzmc, 0);


			this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				App.WinManager.closeWin(WinName.FORGE);
			}, this);
			this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				// App.WinManager.closeWin(WinName.FORGE);
				// HeroModel.getInstance().curPos = ;
				if (this._lastModule) {
					App.WinManager.openWin(this._lastModule);
				} else {
					App.WinManager.closeWin(WinName.FORGE);
				}
			}, this);
			//强化
			this.img_forge.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				let info = this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, this._strengthCostId);
				if (!info) {
					info = { num: 0 };
				}
				if (info.num >= this._strengthCostNum) {
					this._isAll = false;
					App.Socket.send(15004, { id: this.heroModel.heroInfo[this.heroModel.curPos].id, part: this.forgeModel.curPart });
				} else {
					App.GlobalTips.showErrCodeTips(15001);
					// App.MsgUtils.addMidMsg("所需材料不足");
				}
				// App.Socket.send(15004, { id: this.heroModel.heroInfo[this.heroModel.curPos].id, part: this.forgeModel.curPart });
			}, this);
			//一键强化
			this.img_all.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				// App.Socket.send(15005, { id: this.heroModel.heroInfo[this.heroModel.curPos].id, part: this.forgeModel.curPart });
				this._curPos = this.forgeModel.curPart;
				let isShow = false;  //已经飘字
				let startPos = this.forgeModel.curPart; //初始part
				this.touchChildren = false; //设置不可点击
				this._isAll = true;
				for (let k = this.forgeModel.curPart; k <= 10; k++) {
					egret.setTimeout(() => {
						let info = this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, this._strengthCostId);
						if (!info) {
							info = { num: 0 };
						}
						if (!isShow && info.num >= this._strengthCostNum) {
							App.Socket.send(15004, { id: this.heroModel.heroInfo[this.heroModel.curPos].id, part: k });
						} else {
							if (!isShow) {  //道具不足第一次
								App.GlobalTips.showErrCodeTips(15001);
								// App.MsgUtils.addMidMsg("所需材料不足");
								isShow = true;
								this.touchChildren = true; //可点击了
								if (startPos != this.forgeModel.curPart) {
									this.animationStrength();
								}
								this._isAll = false;
							}
						}
						if (k >= 10) { //最后一个
							this.touchChildren = true;
							this._isAll = true;
						}
					}, this, 150 * (k - this.forgeModel.curPart));

				}
			}, this);
			//升星
			this.img_starUp.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				let info = this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, this._starCostId);
				if (!info) {
					info = { num: 0 };
				}
				if (info.num >= this._starCostNum) {
					App.Socket.send(15006, { id: this.heroModel.heroInfo[this.heroModel.curPos].id, part: this.forgeModel.curStarPart });
				} else {
					App.GlobalTips.showErrCodeTips(15001);
					// App.MsgUtils.addMidMsg("所需材料不足");
				}

			}, this);

			//获取道具
			this.label_get.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				let view = new ItemWay(ClientType.BASE_ITEM, this._strengthCostId);
				PopUpManager.addPopUp({ obj: view });
			}, this);
			//获取道具 升星用
			this.lb_starGet.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				let view = new ItemWay(ClientType.BASE_ITEM, this._starCostId);
				PopUpManager.addPopUp({ obj: view });
			}, this);

			//套装属性
			this.img_attr.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				let view = new ForgeStarInfo(this.heroModel.heroInfo[this.heroModel.curPos].id);
				PopUpManager.addPopUp({ obj: view });
			}, this);

			this.btn_strength.addEventListener(egret.TouchEvent.TOUCH_TAP, (event: TouchEvent) => {
				this.onShowStrength();
			}, this);

			this.btn_star.addEventListener(egret.TouchEvent.TOUCH_TAP, (event: TouchEvent) => {
				this.onShowStar();
			}, this);

			App.BtnTipManager.addBtnTipItem(ConstBtnTipType.FORGE_STRENGTH, this.btn_strength,140,0);
			App.BtnTipManager.addBtnTipItem(ConstBtnTipType.FORGE_STAR, this.btn_star);

			// this.btn_orange.addEventListener(egret.TouchEvent.TOUCH_TAP, (event: TouchEvent) => {
			// 	App.WinManager.openWin(WinName.FORGE_ORANGE,{lastModule:WinName.FORGE});
			// }, this);

			this.label_get.textFlow = [{ text: "获得道具", style: { underline: true } }];
			this.lb_starGet.textFlow = [{ text: "获得道具", style: { underline: true } }];
			this.initEquip();
			//默认选强化
			this.updateView();
			this.validateNow();
		}

		//红点显示
		private checkRedDot(viewNum) {
			this.headComponent.clearAllRedTips();
			if (viewNum == 1) { //强化
				this.forgeModel.strengthHeroRedDot.forEach((value, index, array) => {
					this.headComponent.setRedTips(index, value);
				}, this)
			} else {
				this.forgeModel.starHeroRedDot.forEach((value, index, array) => {
					this.headComponent.setRedTips(index, value);
					for (let i = 1; i <= 10; i++) {
						let show = this.forgeModel.checkCanStarupByPart(this.heroModel.curPos, i);
						if (show) {
							this._equipStarArray[i - 1].showRedTips(null);
						} else {
							this._equipStarArray[i - 1].hideRedTips();
						}
					}
				}, this)

			}
		}

		private onShowStrength() {
			this.btn_strength.currentState = "down";
			this.btn_star.currentState = "up";
			this._dzmc.x = this.btn_strength.x;
			this.gp_strength.visible = true;
			this.gp_star.visible = false;
			this.updateStrengthView();
			this._type = 1;
			this.checkRedDot(1);
		}

		private onShowStar() {
			this.btn_strength.currentState = "up";
			this.btn_star.currentState = "down";
			this._dzmc.x = this.btn_star.x;
			this.gp_strength.visible = false;
			this.gp_star.visible = true;
			this.updateStarView();
			this._type = 2;
			this.checkRedDot(2);
		}

		//强化动画效果
		private animationStrength() {

			//强化飘字
			let mc = new EffectMovieClip();
			mc.x = this.width / 2;
			mc.y = this.height / 3;
			if (this._isAll) {
				if (this.touchChildren){ //能点击了
					mc.playMCKey("effqhcg2", "", 1, null, null, () => {
						if (mc.parent) {
							mc.parent.removeChild(mc);
						}
						mc.destroy();
					}, this);
				}
			} else {
				mc.playMCKey("effqhcg1", "", 1, null, null, () => {
					if (mc.parent) {
						mc.parent.removeChild(mc);
					}
					mc.destroy();
				}, this);
			}
			this.addChild(mc);

			//强化成功位置
			let part = this.forgeModel.curPart - 1 - 1; //上个强化位置
			if (part == -1) {
				part = 9;
			}
			let curItem = this._equipArray[part];
			let mc2 = new EffectMovieClip();
			mc2.x = curItem.width / 2;
			mc2.y = curItem.height / 2;
			// mc2.anchorOffsetX = -100;
			// mc2.anchorOffsetY = -100;
			mc2.playMCKey("dqhcg", "", 1, null, null, () => {
				if (mc2.parent) {
					mc2.parent.removeChild(mc2);
				}
				mc2.destroy();
			}, this);
			curItem.addChild(mc2);


			// this.lb_left.x = 170;
			// this.lb_right.x = 340;
			egret.Tween.get(this.lb_left).to({ x: 330, alpha: 0 }, 200, egret.Ease.sineOut).call(() => {
				this.lb_left.x = 250;
				this.lb_left.alpha = 1;
			}, this)
			egret.Tween.get(this.lb_right).to({ x: 500, alpha: 0 }, 200, egret.Ease.sineOut).call(() => {
				this.lb_right.x = 420;
				this.lb_right.alpha = 1;
			}, this)

			// this._mc.gotoAndPlay(1,1);

			// if (!this._curPos) {
			// 	this.onShowStrength();
			// 	return;
			// }
			// this.touchChildren = false;
			// let total = this.forgeModel.curPart;
			// let timeHandle = undefined;
			// if (this.forgeModel.curPart == 1) {  //转了一圈
			// 	total = this.forgeModel.curPart + 10;
			// }
			// timeHandle = egret.setInterval(() => {
			// 	// console.log("ggggg",this._curPos,total);
			// 	if (this._curPos < total) {
			// 		// if (this.img_select.parent) {
			// 		// 	this.img_select.parent.removeChild(this.img_select);
			// 		// }
			// 		// this.img_select.x = this._equipArray[this._curPos - 1].x - 50;
			// 		// this.img_select.y = this._equipArray[this._curPos - 1].y - 50;
			// 		// this._equipArray[this._curPos - 1].parent.addChild(this.img_select);
			// 		// this._equipArray[this._curPos - 1].parent.setChildIndex(this.img_select, 0);
			// 		this.forgeModel.updateStrengthPart({ part: this._curPos });
			// 		this.onShowStrength();
			// 	} else {
			// 		this.forgeModel.updateStrengthPart({ part: this._curPos });
			// 		this._curPos = undefined;
			// 		egret.clearInterval(timeHandle);
			// 		this.onShowStrength();
			// 		this.touchChildren = true;
			// 	}
			// 	this._curPos++;
			// }, this, 200);
		}

		//升星动画
		private animationStar() {
			let mc = new EffectMovieClip();
			mc.x = this.width / 2;
			mc.y = this.height / 3;
			mc.playMCKey("sxcg", "", 1, null, null, () => {
				if (mc.parent) {
					mc.parent.removeChild(mc);
				}
				mc.destroy();
			}, this);
			this.addChild(mc);

			// this.lb_starLeft.x = 25;
			// this.lb_starRight.x = 175;
			egret.Tween.get(this.lb_starLeft).to({ x: 185, alpha: 0 }, 200, egret.Ease.sineOut).call(() => {
				this.lb_starLeft.x = 105;
				this.lb_starLeft.alpha = 1;
			}, this)
			egret.Tween.get(this.lb_starRight).to({ x: 335, alpha: 0 }, 200, egret.Ease.sineOut).call(() => {
				this.lb_starRight.x = 255;
				this.lb_starRight.alpha = 1;
			}, this)
		}

		private initEquip() {
			this.img_select = new eui.Image();
			RES.getResAsync("equipping_choose_png", (texture) => {
				this.img_select.source = texture;
			}, this);
			// let pos = [[360, 50], [225, 100], [495, 100], [130, 205], [590, 205], [130, 330], [590, 330], [225, 435], [495, 435], [360, 480]];
			let pos = [[360, 50], [225, 100], [130, 205], [130, 330], [225, 435], [360, 480], [495, 435], [590, 330], [590, 205], [495, 100]];
			//强化装备item初始化
			for (let i = 0; i < 10; i++) {
				let item = new customui.BaseItem();
				item.x = pos[i][0];
				item.y = pos[i][1];
				this._equipArray.push(item);
				let equipInfo = this.heroModel.heroInfo[this.heroModel.curPos].getPartInfoByPart(i + 1);
				if (this.heroModel.heroInfo[this.heroModel.curPos].equipExist(i + 1) >= 0) { //有装备

					item.updateBaseItem(ClientType.EQUIP, equipInfo.good_id, null, equipInfo);
					item.img_career.visible = false;
					item.lb_star.visible = false;
				} else {
					item.updateBaseItem(ClientType.EQUIP, 0, null, equipInfo);
					RES.getResAsync(ConstEquipIcon[i + 1] + "_png", (texture) => {
						item.img_icon.source = texture;
					}, this);
					item.lb_star.visible = false;
				}


				this.gp_equip.addChild(item);
				item.addEventListener(egret.TouchEvent.TOUCH_TAP, (event) => { //显示详情
					let view = new ForgeEquipInfo(this.heroModel.heroInfo[this.heroModel.curPos].id, i + 1);
					PopUpManager.addPopUp({ obj: view });
				}, this);

			}

			let tempLv = 999999;
			this.heroModel.heroInfo[this.heroModel.curPos].equip_info.forEach((value, index, array) => {
				if (!this.forgeModel.curPart && value.part <= 10) {
					this.forgeModel.curPart = value.part;
					tempLv = value.lv;
				} else if (this.forgeModel.curPart == value.part) {
					tempLv = value.lv;
				} else if (tempLv > value.lv && value.part <= 10) {
					this.forgeModel.curPart = value.part;
					tempLv = value.lv;
				}
			}, this);

			//升星装备初始化
			for (let i = 1; i <= 10; i++) {
				let item = new customui.BaseItem();
				item.width = item.height = 90;
				item.img_bg.visible = true;
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
				let equipInfo = this.heroModel.heroInfo[this.heroModel.curPos].getPartInfoByPart(i);
				if (this.heroModel.heroInfo[this.heroModel.curPos].equipExist(i) >= 0) { //有装备

					item.updateBaseItem(ClientType.EQUIP, equipInfo.good_id, null, equipInfo);
					item.img_career.visible = false;
					item.lb_strength.visible = false;
				} else {
					item.updateBaseItem(ClientType.EQUIP, 0, null, equipInfo);
					RES.getResAsync(ConstEquipIcon[i] + "_png", (texture) => {
						item.img_icon.source = texture;
					}, this);
					item.lb_strength.visible = false;
				}

				this.gp_starEquip.addChild(item);
				item.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
					// this.forgeModel.curStarPart = i;
					// this.updateStarView();
					if (i == this.forgeModel.curStarPart) {
						return;
					}
					this.forgeModel.curStarPart = i;;
					this.setSelect();
					this.moveAnimate(i);
				}, this);
				this._equipStarArray.push(item);
			}
			this.forgeModel.curStarPart = 1;
		}

		//移动动画
		private moveAnimate(part) {
			let preItem = this._equipStarArray[part - 1];
			let item = new customui.BaseItem();
			item.x = preItem.x;
			item.y = preItem.y;
			item.updateBaseItem(ClientType.EQUIP, 0);
			item.img_icon.source = preItem.img_icon.source;
			preItem.parent.addChild(item);
			egret.Tween.get(item).to({ x: 360, y: 150 }, 300, egret.Ease.sineOut).call(() => {
				if (item.parent) {
					item.parent.removeChild(item);
				}
				this.updateStarView();
			}, this);
		}

		//选中框
		private setSelect() {
			if (this.img_select.parent) {
				this.img_select.parent.removeChild(this.img_select);
			}
			this.img_select.x = this._equipStarArray[this.forgeModel.curStarPart - 1].x - 50;
			this.img_select.y = this._equipStarArray[this.forgeModel.curStarPart - 1].y - 50;
			this._equipStarArray[this.forgeModel.curStarPart - 1].parent.addChild(this.img_select);
			this._equipStarArray[this.forgeModel.curStarPart - 1].parent.setChildIndex(this.img_select, 0);
		}

		//更新装备信息
		public updateEquip() {
			for (let i = 0; i < 10; i++) {
				let item = this._equipArray[i];
				let item2 = this._equipStarArray[i];
				let equipInfo = this.heroModel.heroInfo[this.heroModel.curPos].getPartInfoByPart(i + 1);
				if (this.heroModel.heroInfo[this.heroModel.curPos].equipExist(i + 1) >= 0) { //有装备

					item.updateBaseItem(ClientType.EQUIP, equipInfo.good_id, null, equipInfo);
					item.img_career.visible = false;
					item.lb_star.visible = false;
					item2.updateBaseItem(ClientType.EQUIP, equipInfo.good_id, null, equipInfo);
					item2.img_career.visible = false;
					item2.lb_strength.visible = false;
				} else {
					item.updateBaseItem(ClientType.EQUIP, 0, null, equipInfo);
					item2.updateBaseItem(ClientType.EQUIP, 0, null, equipInfo);
					item.lb_star.visible = false;
					item2.lb_strength.visible = false;
					RES.getResAsync(ConstEquipIcon[i + 1] + "_png", (texture) => {
						item.img_icon.source = texture;
						item2.img_icon.source = texture;
					}, this);
				}
			}
		}

		public updateView() {
			if (!this.visible) {
				return;
			}
			this.updateEquip();
			if (this._type == 1) {
				let tempLv = 999999;
				this.heroModel.heroInfo[this.heroModel.curPos].equip_info.forEach((value, index, array) => {
					if (!this.forgeModel.curPart && value.part <= 10) {
						this.forgeModel.curPart = value.part;
						tempLv = value.lv;
					} else if (this.forgeModel.curPart == value.part) {
						tempLv = value.lv;
					} else if (tempLv > value.lv && value.part <= 10) {
						this.forgeModel.curPart = value.part;
						tempLv = value.lv;
					}
				}, this);
				this.onShowStrength();
				// this.animation();
			} else if (this._type == 2) {
				this.onShowStar();
			}
		}

		//更新强化界面
		public updateStrengthView() {
			if (this.img_select.parent) {
				this.img_select.parent.removeChild(this.img_select);
			}
			this.img_select.x = this._equipArray[this.forgeModel.curPart - 1].x - 50;
			this.img_select.y = this._equipArray[this.forgeModel.curPart - 1].y - 50;
			this._equipArray[this.forgeModel.curPart - 1].parent.addChild(this.img_select);
			this._equipArray[this.forgeModel.curPart - 1].parent.setChildIndex(this.img_select, 0);

			let equip = this.heroModel.heroInfo[this.heroModel.curPos].getPartInfoByPart(this.forgeModel.curPart);
			let curLevel = equip ? equip.lv : 0;
			// this.lb_left.text = "";
			if (curLevel > 0) {
				let forgeInfo = this.forgeModel.getStrengthByPartLevel(this.forgeModel.curPart, curLevel);
				let attribute = App.ConfigManager.attributeConfig()[forgeInfo.attribute];
				let attrBase = EquipModel.getInstance().attributeFilter(attribute);

				let textL = [];
				for (let key in attrBase) {
					if (key == "ac" || key == "mac" || key == "sc") {
						if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.SOLDIER) {
							if (key == "ac") {
								textL.push({ text: attrBase[key] });
								textL.push({ text: "\n" });
							}
						} else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.MAGES) {
							if (key == "mac") {
								textL.push({ text: attrBase[key] });
								textL.push({ text: "\n" });
							}
						} else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.TAOIST) {
							if (key == "sc") {
								textL.push({ text: attrBase[key] });
								textL.push({ text: "\n" });
							}
						}
					} else {
						textL.push({ text: attrBase[key] });
						textL.push({ text: "\n" });
					}

				};
				textL.pop();
				this.lb_left.textFlow = textL;
			} else {
				this.lb_left.textFlow = [{ text: "" }];
			}
			this.nextInfo();
			this.bmlb_cap.text = String(this.heroModel.heroInfo[this.heroModel.curPos].score);
		}

		/**
		 * 下一级信息
		*/
		public nextInfo() {
			let equip = this.heroModel.heroInfo[this.heroModel.curPos].getPartInfoByPart(this.forgeModel.curPart);
			let curLevel = equip ? equip.lv : 0;
			let forgeInfo = this.forgeModel.getStrengthByPartLevel(this.forgeModel.curPart, curLevel + 1);
			if (!forgeInfo) { //没有下一等级

				return;
			}
			let costInfo = (forgeInfo.consume.substring(1, forgeInfo.consume.length - 1)).split(",");
			let itemInfo = this.backpackModel.getItemByTypeIdUuid(1, costInfo[0]);
			let itemConfig = App.ConfigManager.itemConfig()[costInfo[0]];
			let attribute = App.ConfigManager.attributeConfig()[forgeInfo.attribute];
			let attrBase = EquipModel.getInstance().attributeFilter(attribute);

			this._strengthCostId = Number(costInfo[0]);
			this._strengthCostNum = Number(costInfo[1]);
			if (!itemInfo) {
				itemInfo = { num: 0 };
			}
			RES.getResAsync(itemConfig.icon + "_png", (texture) => {
				this.img_cost.source = texture
			}, this);

			if (itemInfo.num >= costInfo[1]) { //足够
				this.lb_num.textFlow = [{ text: String(itemInfo.num), style: { textColor: 0x63d72a } }, { text: "/" + costInfo[1], style: { textColor: 0xbfbfbf } }];
			} else {
				this.lb_num.textFlow = [{ text: String(itemInfo.num), style: { textColor: 0xb90b0a } }, { text: "/" + costInfo[1], style: { textColor: 0xbfbfbf } }];
			}

			let textL = [];
			let textL0 = [];
			let textR = [];
			for (let key in attrBase) {
				if (key == "ac" || key == "mac" || key == "sc") {
					if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.SOLDIER) {
						if (key == "ac") {
							textR.push({ text: attrBase[key] });
							textR.push({ text: "\n" });
							textL0.push({ text: ConstAttribute[key] });
							textL0.push({ text: "\n" });
							if (this.lb_left.text == "") {
								textL.push({ text: "0" });
								textL.push({ text: "\n" });
							}
						}
					} else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.MAGES) {
						if (key == "mac") {
							textR.push({ text: attrBase[key] });
							textR.push({ text: "\n" });
							textL0.push({ text: ConstAttribute[key] });
							textL0.push({ text: "\n" });
							if (this.lb_left.text == "") {
								textL.push({ text: "0" });
								textL.push({ text: "\n" });
							}
						}
					} else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.TAOIST) {
						if (key == "sc") {
							textR.push({ text: attrBase[key] });
							textR.push({ text: "\n" });
							textL0.push({ text: ConstAttribute[key] });
							textL0.push({ text: "\n" });
							if (this.lb_left.text == "") {
								textL.push({ text: "0" });
								textL.push({ text: "\n" });
							}
						}
					}
				} else {
					textR.push({ text: attrBase[key] });
					textR.push({ text: "\n" });
					textL0.push({ text: ConstAttribute[key] });
					textL0.push({ text: "\n" });
					if (this.lb_left.text == "") {
						textL.push({ text: "0" });
						textL.push({ text: "\n" });
					}
				}
			};
			if (textL.length > 0) {
				textL.pop();
				this.lb_left.textFlow = textL;
			}
			textL0.pop();
			textR.pop();
			this.lb_left0.textFlow = textL0;
			this.lb_right.textFlow = textR;
		}

		//更新升星界面
		public updateStarView() {
			if (this.img_select.parent) {
				this.img_select.parent.removeChild(this.img_select);
			}
			this.img_select.x = this._equipStarArray[this.forgeModel.curStarPart - 1].x - 50;
			this.img_select.y = this._equipStarArray[this.forgeModel.curStarPart - 1].y - 50;
			this._equipStarArray[this.forgeModel.curStarPart - 1].parent.addChild(this.img_select);
			this._equipStarArray[this.forgeModel.curStarPart - 1].parent.setChildIndex(this.img_select, 0);

			let heroInfo = this.heroModel.heroInfo[this.heroModel.curPos];
			let pos = heroInfo.equipExist(this.forgeModel.curStarPart);
			let equip = heroInfo.getPartInfoByPart(this.forgeModel.curStarPart);
			let curLevel = equip ? equip.star : 0;
			if (curLevel > 0) {
				let forgeInfo2 = this.forgeModel.getStarByPartLevel(this.forgeModel.curStarPart, curLevel);
				let attribute2 = App.ConfigManager.attributeConfig()[forgeInfo2.attribute];
				let textL2 = [];
				textL2.push({ text: String(attribute2["attribute_rate"] / 100) + "%" });
				this.lb_starLeft.textFlow = textL2;
			} else {
				this.lb_starLeft.textFlow = [{ text: "" }];
			}

			let forgeInfo = this.forgeModel.getStarByPartLevel(this.forgeModel.curStarPart, curLevel + 1);
			let maxLevel = false;
			if (!forgeInfo) { //没有下一等级
				// this.showStarMax(curLevel);
				maxLevel = true;
				forgeInfo = this.forgeModel.getStarByPartLevel(this.forgeModel.curStarPart, curLevel);
				this.gp_attr.visible = false;
				this.lb_total.visible = true;
				// return;
			} else {
				this.gp_attr.visible = true;
				this.lb_total.visible = false;
			}
			let costInfo = (forgeInfo.consume.substring(1, forgeInfo.consume.length - 1)).split(",");
			let itemInfo = this.backpackModel.getItemByTypeIdUuid(1, costInfo[0]);
			let itemConfig = App.ConfigManager.itemConfig()[costInfo[0]];
			let attribute = App.ConfigManager.attributeConfig()[forgeInfo.attribute];

			this._starCostId = Number(costInfo[0]);
			this._starCostNum = Number(costInfo[1]);
			if (!itemInfo) {
				itemInfo = { num: 0 };
			}
			if (maxLevel) {
				costInfo[1] = 0;
			}
			RES.getResAsync(itemConfig.icon + "_png", (texture) => {
				this.img_starCost.source = texture
			}, this);

			if (itemInfo.num >= costInfo[1]) { //足够
				this.lb_starNum.textFlow = [{ text: String(itemInfo.num), style: { textColor: 0x63d72a } }, { text: "/" + costInfo[1], style: { textColor: 0xbfbfbf } }];
			} else {
				this.lb_starNum.textFlow = [{ text: String(itemInfo.num), style: { textColor: 0xb90b0a } }, { text: "/" + costInfo[1], style: { textColor: 0xbfbfbf } }];
			}

			let textL = [];
			let textR = [];
			textR.push({ text: attribute["attribute_rate"] / 100 + "%" });
			if (this.lb_starLeft.text == "") {
				textL.push({ text: "0%" });
				this.lb_starLeft.textFlow = textL;
			}
			this.lb_starRight.textFlow = textR;
			this.lb_total.textFlow = textR;
			let equipInfo = this.heroModel.heroInfo[this.heroModel.curPos].getPartInfoByPart(this.forgeModel.curStarPart);
			if (pos >= 0) { //有装备
				let equipInfo2 = App.ConfigManager.equipConfig()[heroInfo.equip_info[pos].good_id];
				this.baseItem.updateBaseItem(ClientType.EQUIP, heroInfo.equip_info[pos].good_id, null, equipInfo);
				this.baseItem.lb_strength.visible = false;
				this.lb_name.text = equipInfo2.name;
				this.lb_name.textColor = ConstTextColor[equipInfo2.quality];
				this.baseItem.img_career.visible = false;
			} else {
				this.lb_name.text = ConstEquipType[EquipModel.getInstance().getTypeByPos(this.forgeModel.curStarPart)];
				// this.baseItem.updateBaseItem(ClientType.EQUIP , 0);
				this.baseItem.updateBaseItem(ClientType.EQUIP, 0, null, equipInfo);
				this.baseItem.lb_strength.visible = false;
				this.baseItem.img_frame.source = RES.getRes("common_default_png");
				RES.getResAsync(ConstEquipIcon[this.forgeModel.curStarPart] + "_png", (texture) => {
					this.baseItem.img_icon.source = texture;
				}, this);
			}
			this.lb_star.text = "星级+" + curLevel;

		}

		private showStarMax(curLevel) {
			this.gp_attr.visible = false;
			this.lb_total.visible = true;
			let forgeInfo = this.forgeModel.getStarByPartLevel(this.forgeModel.curStarPart, curLevel);
		}

		public checkGuide() {
			App.GuideManager.bindClickBtn(this.img_all, 1009, 2);
			App.GuideManager.bindClickBtn(this.commonWin.img_close, 1009, 3);
			App.GuideManager.checkGuide(1009);
		}

		public removeGuide() {
			App.GuideManager.removeClickBtn(1009, 2);
			App.GuideManager.removeClickBtn(1009, 3);
		}

		/**
		 * 打开窗口
		 * param.type : 默认是1强化，传2是升星
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			if (openParam && openParam.type) {
				this._type = openParam.type;
				this.updateView();
				// this.headComponent.openWin(openParam);
			} else {
				this._type = 1;
				this.updateView();
				// this.headComponent.openWin(openParam);
			}
			if (openParam && openParam.lastModule) {
				this._lastModule = openParam.lastModule;
			}
			if (!this._handleId) {
				this._handleId = App.EventSystem.addEventListener(PanelNotify.HERO_ON_HERO_SELECT, this.updateView, this);
			}
			App.EventSystem.addEventListener(PanelNotify.FORGE_STRENGTH_EQUIP, this.animationStrength, this);
			App.EventSystem.addEventListener(PanelNotify.FORGE_STAR_EQUIP, this.animationStar, this);
			this.headComponent.readyOpen();
			this.checkGuide();
		}

		/**
		 * 关闭窗口
		 */
		public closeWin(callback): void {
			super.closeWin(callback);
			// this.forgeModel.curPart = undefined;
		}

		/**
		 * 清理
		 */
		public clear(data: any = null): void {
			super.clear(data);
			if (this._handleId) {
				App.EventSystem.removeEventListener(PanelNotify.HERO_ON_HERO_SELECT, this._handleId);
				this._handleId = undefined;
			}
			App.EventSystem.removeEventListener(PanelNotify.FORGE_STRENGTH_EQUIP);
			App.EventSystem.removeEventListener(PanelNotify.FORGE_STAR_EQUIP);
			this.headComponent.clear();
			this._lastModule = undefined;
			this.removeGuide();
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			this._mc.destroy();
			this._dzmc.destroy();
		}
	}
}
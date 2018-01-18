/**
* module : 特殊装备模块
* author : zrj
*/
module game {
	export class EquipSpecialView extends BaseView {
		public gp_main: eui.Group;
		public commonWin: customui.CommonWin;
		public hero_head: game.HeroHeadComponentView;
		public gp_ring: eui.Group;
		public gp_ring_attr: eui.Group;
		public lb_ring_attr: eui.Label;
		public lb_ring_attr_next: eui.Label;
		public gp_ring_fragment: eui.Group;
		public img_ring_fragment0: eui.Image;
		public img_ring_fragment1: eui.Image;
		public img_ring_fragment2: eui.Image;
		public img_ring_fragment3: eui.Image;
		public lb_ring_fragment0: eui.Label;
		public lb_ring_fragment1: eui.Label;
		public lb_ring_fragment2: eui.Label;
		public lb_ring_fragment3: eui.Label;
		public lb_ring_tip: eui.Label;
		public lb_ring_desc: eui.Label;
		public gp_other: eui.Group;
		public gp_other_attr: eui.Group;
		public lb_other_attr: eui.Label;
		public lb_other_attr_next: eui.Label;
		public gp_star: eui.Group;
		public img_star0: eui.Image;
		public img_star1: eui.Image;
		public img_star2: eui.Image;
		public img_star3: eui.Image;
		public img_star4: eui.Image;
		public img_star5: eui.Image;
		public img_star6: eui.Image;
		public img_star7: eui.Image;
		public img_star8: eui.Image;
		public img_star9: eui.Image;
		public pb_exp: eui.ProgressBar;
		public lb_other_cost: eui.Label;
		public btn_other_upgrade: eui.Button;
		public img_other_txt: eui.Image;
		public gp_tip: eui.Group;
		public btn_active: eui.Button;
		public lb_active_desc: eui.Label;
		public img_icon: eui.Image;
		public lb_name: eui.Label;
		public img_return: eui.Image;
		public gp_effect: eui.Group;
		public lb_active_condition: eui.Label;

		private heroModel: HeroModel = HeroModel.getInstance();
		private _handleId: number;
		private _updateHandleId: number;
		private _curPart: number; //当前特殊装备的位置
		private _curPos: number //当前选中英雄位置
		private _ringFragment: Array<eui.Label> = [];
		private _mcEffect: EffectMovieClip;
		private _ringImg: Array<eui.Image> = [];
		private _starArray: Array<eui.Image> = [];
		private _enough: boolean = false;
		private _costId: number;
		private _fragmentActiveMc0: AMovieClip;//可激活特效
		private _fragmentActiveMc1: AMovieClip;//可激活特效
		private _fragmentActiveMc2: AMovieClip;//可激活特效
		private _fragmentActiveMc3: AMovieClip;//可激活特效
		private _ringActiveEffs: Array<AMovieClip> = [];
		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
		}

		protected childrenCreated() {
			super.childrenCreated();

			this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeView, this);
			this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeView, this);
			this.btn_active.addEventListener(egret.TouchEvent.TOUCH_TAP, this.activeEquip, this);
			this.lb_ring_fragment0.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { this.activeRingFragment(1) }, this);
			this.lb_ring_fragment1.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { this.activeRingFragment(2) }, this);
			this.lb_ring_fragment2.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { this.activeRingFragment(3) }, this);
			this.lb_ring_fragment3.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { this.activeRingFragment(4) }, this);
			this.btn_other_upgrade.addEventListener(egret.TouchEvent.TOUCH_TAP, this.upgradeEquip, this);

			this.initView();
		}

		private initView() {
			this._mcEffect = new EffectMovieClip();
			this._mcEffect.x = 150;
			this._mcEffect.y = 200;
			this.gp_effect.addChild(this._mcEffect);
			this.gp_other.visible = false;
			this.gp_ring.visible = false;
			this.gp_tip.visible = false;


			this._curPos = this.heroModel.curPos;
			this._ringFragment.push(this.lb_ring_fragment0);
			this._ringFragment.push(this.lb_ring_fragment1);
			this._ringFragment.push(this.lb_ring_fragment2);
			this._ringFragment.push(this.lb_ring_fragment3);
			this._ringImg.push(this.img_ring_fragment0);
			this._ringImg.push(this.img_ring_fragment1);
			this._ringImg.push(this.img_ring_fragment2);
			this._ringImg.push(this.img_ring_fragment3);
			this._starArray.push(this.img_star0);
			this._starArray.push(this.img_star1);
			this._starArray.push(this.img_star2);
			this._starArray.push(this.img_star3);
			this._starArray.push(this.img_star4);
			this._starArray.push(this.img_star5);
			this._starArray.push(this.img_star6);
			this._starArray.push(this.img_star7);
			this._starArray.push(this.img_star8);
			this._starArray.push(this.img_star9);

			this.addActiveEff();
			// this.updateView(this._curPos);
			this.validateNow();
		}
		private addActiveEff() {

			if (this._ringActiveEffs.length == 0) {
				this._ringActiveEffs.push(this._fragmentActiveMc0);//可激活特效
				this._ringActiveEffs.push(this._fragmentActiveMc1);
				this._ringActiveEffs.push(this._fragmentActiveMc2);
				this._ringActiveEffs.push(this._fragmentActiveMc3);
			}

			for (let i = 0; i < this._ringActiveEffs.length; i++) {
				if (this._ringActiveEffs[i] == null) {
					this._ringActiveEffs[i] = new AMovieClip();
					this._ringImg[i].parent.addChild(this._ringActiveEffs[i]);
					this._ringActiveEffs[i].touchEnabled = false;
					this._ringActiveEffs[i].scaleX = 1.6;
					this._ringActiveEffs[i].x = this._ringImg[i].x+174;
					this._ringActiveEffs[i].y = this._ringImg[i].y+27;
				}
				this._ringActiveEffs[i].visible = false;

			}
		}
		private clearActiveEff() {

			for (let i = 0; i < this._ringActiveEffs.length; i++) {
				if (this._ringActiveEffs[i]) {
					this._ringActiveEffs[i].stop();
					this._ringActiveEffs[i].destroy();
					this._ringActiveEffs[i] = null;
				}
			}
			this._ringActiveEffs.splice(0);

		}
		private updateView(data) {
			if (data || data == 0) {
				this._curPos = data;
			}

			if (this._curPart == ConstSpecialEquipPart.PARA_RING || this._curPart == ConstSpecialEquipPart.BODY_RING) {
				RES.getResAsync("equip_sp_shenjiejinjie_title_png", (texture) => {
					this.commonWin.img_title.texture = texture;
				}, this);
			} else {
				RES.getResAsync("equip_sp_zhenxizhuangbeishengji_title_png", (texture) => {
					this.commonWin.img_title.texture = texture;
				}, this);
			}

			//特效
			this._mcEffect.playMCKey(ConstSpecialEquipEffect[this._curPart], "", -1, null, () => {
				this._mcEffect.frameRate = 8;
			}, null, this);

			let specialInfo = this.heroModel.heroInfo[this._curPos].getEquipSpecialByPart(this._curPart);
			if (specialInfo.id) { //已经激活
				let info = App.ConfigManager.getEquipSpecialById(specialInfo.id);
				if (this._curPart == ConstSpecialEquipPart.PARA_RING || this._curPart == ConstSpecialEquipPart.BODY_RING) {
					this.gp_ring.visible = true;
					this.gp_other.visible = false;
					this.updateRingView();
				} else {
					this.gp_other.visible = true;
					this.gp_ring.visible = false;
					this.updateOtherView();
				}
				this.gp_tip.visible = false;
			} else {
				this.gp_tip.visible = true;
				this.gp_other.visible = false;
				this.gp_ring.visible = false;
				let info = App.ConfigManager.getEquipSpecialByPartLevel(this._curPart, 0);
				this.lb_active_desc.text = info.des;
				if (info.condition && typeof info.condition == "number") {
					let sceneInfo = App.ConfigManager.getHookSceneConfigByLevel(info.condition);
					this.lb_active_condition.text = "通关关卡" + sceneInfo.name + "解锁";
					if (info.condition_level) {
						this.lb_active_condition.text += "\n等级达到" + info.condition_level + "级解锁";
					}
				} else if (info.condition_level) {
					this.lb_active_condition.text = "等级达到" + info.condition_level + "级解锁";
				}

				this.lb_name.text = info.name;
			}
		}

		//戒指
		private updateRingView() {
			let specialInfo = this.heroModel.heroInfo[this._curPos].getEquipSpecialByPart(this._curPart);
			let ringInfo = App.ConfigManager.getEquipSpecialById(specialInfo.id);
			let nextInfo = App.ConfigManager.getEquipSpecialById(ringInfo.next_id);
			this.lb_name.text = ringInfo.name;
			if (0 && ringInfo.next_id) { //不走这里
				for (let i = 0; i < 4; i++) {
					let singleRingInfo = App.ConfigManager.getEquipSpecialFragmentById(nextInfo.ring_id[i]);
					this._ringFragment[i].text = singleRingInfo.name;
					if (specialInfo.getpieceByKey(ringInfo.ring_id[i])) { //激活了
						this._ringFragment[i].textFlow = [{ text: this._ringFragment[i].text, style: { underline: true, textColor: 0x00f829 } }, { text: "已激活", style: { underline: true, textColor: 0xd7852f } }];
					} else if (BossModel.getInstance().level >= singleRingInfo.condition) {
						this._ringFragment[i].textFlow = [{ text: this._ringFragment[i].text, style: { underline: true, textColor: 0x00f829 } }, { text: "可激活", style: { underline: true, textColor: 0xffea01 } }];
					} else {

					}
				}

			} else {
				if (ringInfo.next_id) {
					this.gp_ring_fragment.visible = true;
					for (let i = 0; i < 4; i++) {
						let singleRingInfo = App.ConfigManager.getEquipSpecialFragmentById(ringInfo.ring_id[i]);
						this._ringFragment[i].text = singleRingInfo.name;
						if (specialInfo.getpieceByKey(ringInfo.ring_id[i])) { //激活了
							this._ringActiveEffs[i].visible = false;
							this._ringActiveEffs[i].stop();
							this._ringFragment[i].textFlow = [{ text: this._ringFragment[i].text, style: { underline: true, textColor: 0x00f829 } }, { text: "已激活", style: { underline: true, textColor: 0xd7852f } }];

						} else if (BossModel.getInstance().level >= singleRingInfo.condition) {
							this._ringFragment[i].textFlow = [{ text: this._ringFragment[i].text, style: { underline: true, textColor: 0x00f829 } }, { text: "可激活", style: { underline: true, textColor: 0xffea01 } }];
							this._ringActiveEffs[i].visible = true;
							this._ringActiveEffs[i].playMCKey("effanniu");
						} else {
							this._ringActiveEffs[i].visible = false;
							this._ringActiveEffs[i].stop();
						}
					}
				} else {
					this.gp_ring_fragment.visible = false;
				}
			}

			//属性
			let attribute = App.ConfigManager.getAttributeInfoById(ringInfo.add_id);
			let attrBase = EquipModel.getInstance().attributeFilter(attribute);
			let textArray = [];
			for (let key in attrBase) {
				if (this.heroModel.heroInfo[this._curPos].job == CareerType.SOLDIER) {
					if (key != "mac" && key != "sc") {
						textArray.push({ text: ConstAttribute[key] + ": ", style: { textColor: 0xc6be66 } }, { text: attrBase[key], style: { textColor: 0xc6bebb } },
							{ text: "\n" });
					}
				} else if (this.heroModel.heroInfo[this._curPos].job == CareerType.MAGES) {
					if (key != "ac" && key != "sc") {
						textArray.push({ text: ConstAttribute[key] + ": ", style: { textColor: 0xc6be66 } }, { text: attrBase[key], style: { textColor: 0xc6bebb } },
							{ text: "\n" });
					}
				} else if (this.heroModel.heroInfo[this._curPos].job == CareerType.TAOIST) {
					if (key != "mac" && key != "ac") {
						textArray.push({ text: ConstAttribute[key] + ": ", style: { textColor: 0xc6be66 } }, { text: attrBase[key], style: { textColor: 0xc6bebb } },
							{ text: "\n" });
					}
				}
			};
			if (textArray.length > 0) {
				textArray.pop();
			}
			this.lb_ring_attr.textFlow = textArray;
			if (ringInfo.next_id) {
				// let nextInfo = App.ConfigManager.getEquipSpecialById(ringInfo.next_id);
				let attribute2 = App.ConfigManager.getAttributeInfoById(nextInfo.add_id);
				let attrBase2 = EquipModel.getInstance().attributeFilter(attribute2);
				let textArray2 = [];
				for (let key in attrBase2) {
					if (this.heroModel.heroInfo[this._curPos].job == CareerType.SOLDIER) {
						if (key != "mac" && key != "sc") {
							textArray2.push({ text: ConstAttribute[key] + ": ", style: { textColor: 0xbfbfbf } }, { text: attrBase2[key], style: { textColor: 0xc6bebb } },
								{ text: "\n" });
						}
					} else if (this.heroModel.heroInfo[this._curPos].job == CareerType.MAGES) {
						if (key != "ac" && key != "sc") {
							textArray2.push({ text: ConstAttribute[key] + ": ", style: { textColor: 0xbfbfbf } }, { text: attrBase2[key], style: { textColor: 0xc6bebb } },
								{ text: "\n" });
						}
					} else if (this.heroModel.heroInfo[this._curPos].job == CareerType.TAOIST) {
						if (key != "mac" && key != "ac") {
							textArray2.push({ text: ConstAttribute[key] + ": ", style: { textColor: 0xbfbfbf } }, { text: attrBase2[key], style: { textColor: 0xc6bebb } },
								{ text: "\n" });
						}
					}
				};
				if (textArray2.length > 0) {
					textArray2.pop();
				}
				this.lb_ring_attr_next.textFlow = textArray2;
			} else {
				this.lb_ring_attr_next.text = "满级";
			}


		}
		//其他
		private updateOtherView() {
			let specialInfo = this.heroModel.heroInfo[this._curPos].getEquipSpecialByPart(this._curPart);
			let otherInfo = App.ConfigManager.getEquipSpecialById(specialInfo.id);
			let afterLevel = otherInfo.level % 10;  //激活星星数
			this.lb_name.text = otherInfo.name;
			if (afterLevel == 0 && otherInfo.level != 0) {
				afterLevel = 10;
			}
			for (let i = 0; i < this._starArray.length; i++) {
				if (i + 1 <= afterLevel) {
					this._starArray[i].visible = true;
				} else {
					this._starArray[i].visible = false;
				}
			}
			this.pb_exp.value = 100 * afterLevel / this._starArray.length;

			if (otherInfo.next_id) {
				let nextInfo = App.ConfigManager.getEquipSpecialById(otherInfo.next_id);
				let cost = nextInfo.item[0];  //消耗
				let itemInfo = (BackpackModel.getInstance() as BackpackModel).getItemByTypeIdUuid(cost[1], cost[0]);
				this._costId = cost[0];
				if (!itemInfo) {
					itemInfo = { num: 0 };
				}
				if (itemInfo.num >= cost[2]) { //足够
					this._enough = true;
					this.lb_other_cost.textFlow = [{ text: "需要消耗碎片数：" }, { text: String(itemInfo.num), style: { textColor: 0x63d72a } }, { text: "/" + cost[2], style: { textColor: 0xbfbfbf } }];
					RES.getResAsync("equip_sp_txt_shengji_png", (texture) => {
						this.img_other_txt.texture = texture;
					}, this);
				} else {
					this._enough = false;
					this.lb_other_cost.textFlow = [{ text: "需要消耗碎片数：" }, { text: String(itemInfo.num), style: { textColor: 0xb90b0a } }, { text: "/" + cost[2], style: { textColor: 0xbfbfbf } }];
					RES.getResAsync("equip_sp_txt_huoqusuipian_png", (texture) => {
						this.img_other_txt.texture = texture;
					}, this);
				}
			} else {
				this.lb_other_cost.text = "";
			}

			//属性
			let attribute = App.ConfigManager.getAttributeInfoById(otherInfo.add_id);
			let attrBase = EquipModel.getInstance().attributeFilter(attribute);
			let textArray = [];
			for (let key in attrBase) {
				if (this.heroModel.heroInfo[this._curPos].job == CareerType.SOLDIER) {
					if (key != "mac" && key != "sc") {
						textArray.push({ text: ConstAttribute[key] + ": ", style: { textColor: 0xbfbfbf } }, { text: attrBase[key], style: { textColor: 0x00f829 } },
							{ text: "\n" });
					}
				} else if (this.heroModel.heroInfo[this._curPos].job == CareerType.MAGES) {
					if (key != "ac" && key != "sc") {
						textArray.push({ text: ConstAttribute[key] + ": ", style: { textColor: 0xbfbfbf } }, { text: attrBase[key], style: { textColor: 0x00f829 } },
							{ text: "\n" });
					}
				} else if (this.heroModel.heroInfo[this._curPos].job == CareerType.TAOIST) {
					if (key != "mac" && key != "ac") {
						textArray.push({ text: ConstAttribute[key] + ": ", style: { textColor: 0xbfbfbf } }, { text: attrBase[key], style: { textColor: 0x00f829 } },
							{ text: "\n" });
					}
				}
			};
			this.lb_other_attr.textFlow = textArray;
			if (otherInfo.next_id) {
				let nextInfo2 = App.ConfigManager.getEquipSpecialById(otherInfo.next_id);
				let attribute2 = App.ConfigManager.getAttributeInfoById(nextInfo2.add_id);
				let attrBase2 = EquipModel.getInstance().attributeFilter(attribute2);
				let textArray2 = [];
				for (let key in attrBase2) {
					if (this.heroModel.heroInfo[this._curPos].job == CareerType.SOLDIER) {
						if (key != "mac" && key != "sc") {
							textArray2.push({ text: ConstAttribute[key] + ": ", style: { textColor: 0xc6be66 } }, { text: attrBase2[key], style: { textColor: 0x00f829 } },
								{ text: "\n" });
						}
					} else if (this.heroModel.heroInfo[this._curPos].job == CareerType.MAGES) {
						if (key != "ac" && key != "sc") {
							textArray2.push({ text: ConstAttribute[key] + ": ", style: { textColor: 0xc6be66 } }, { text: attrBase2[key], style: { textColor: 0x00f829 } },
								{ text: "\n" });
						}
					} else if (this.heroModel.heroInfo[this._curPos].job == CareerType.TAOIST) {
						if (key != "mac" && key != "ac") {
							textArray2.push({ text: ConstAttribute[key] + ": ", style: { textColor: 0xc6be66 } }, { text: attrBase2[key], style: { textColor: 0x00f829 } },
								{ text: "\n" });
						}
					}
				};
				this.lb_other_attr_next.textFlow = textArray2;
			} else {
				this.lb_other_attr_next.text = "已满级";
			}
		}

		//关闭当前界面
		private closeView() {
			App.WinManager.closeWin(WinName.EQUIP_SPECIAL);
			App.WinManager.openWin(WinName.HERO);
		}

		//激活特殊装备
		private activeEquip() {
			App.Socket.send(15012, { id: this.heroModel.heroInfo[this._curPos].id, pos: this._curPart });
		}

		//激活戒指碎片
		private activeRingFragment(pos) {
			// let specialInfo = this.heroModel.heroInfo[this._curPos].getEquipSpecialByPart(this._curPart);
			// let ringInfo = App.ConfigManager.getEquipSpecialById(specialInfo.id);
			// let singleRingInfo = App.ConfigManager.getEquipSpecialFragmentById(ringInfo.ring_id[pos - 1]);
			// if (BossModel.getInstance().level >= singleRingInfo.condition) {
			// 	App.Socket.send(15014, { id: this.heroModel.heroInfo[this._curPos].id, pos: this._curPart, num: pos });
			// } else {
			// 	let view = new EquipSpecialTipView({ pos: this._curPos, part: this._curPart, num: pos });
			// 	PopUpManager.addPopUp({ obj: view });
			// }
			// let view = new EquipSpecialTipView({id: this.heroModel.heroInfo[this._curPos].id, pos: this._curPos, part: this._curPart, num: pos });
			// PopUpManager.addPopUp({ obj: view });
			App.WinManager.openWin(WinName.POP_EQUIPSPECIAL_TIP, { data: { id: this.heroModel.heroInfo[this._curPos].id, pos: this._curPos, part: this._curPart, num: pos } });
		}

		//特殊装备升级 
		private upgradeEquip() {
			if (this._enough) {
				App.Socket.send(15013, { id: this.heroModel.heroInfo[this._curPos].id, pos: this._curPart });
			} else {
				App.GlobalTips.showItemWayTips(ClientType.BASE_ITEM, this._costId);
			}
		}

		public checkGuide() {
			App.GuideManager.bindClickBtn(this.btn_active, 1015, 2);
			App.GuideManager.bindClickBtn(this.commonWin.img_close, 1015, 3);
			// App.GuideManager.bindClickBtn(this._ringImg[0],1015,3);
			App.GuideManager.checkGuide(1015);
		}

		public removeGuide() {
			App.GuideManager.removeClickBtn(1015, 2);
			App.GuideManager.removeClickBtn(1015, 3);
		}

		/**
		 * 打开窗口
		 * openParam参数  part : 特殊装备部位  isActive ：是否已经激活
		 * 
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			if (!openParam) {
				openParam = {};
				openParam.part = ConstSpecialEquipPart.PARA_RING;
				openParam.isActive = false;
			}
			this._curPart = openParam.part;
			if (openParam.isActive) {
				if (openParam.part == ConstSpecialEquipPart.PARA_RING || openParam.part == ConstSpecialEquipPart.BODY_RING) {
					this.gp_ring.visible = true;
				} else {
					this.gp_other.visible = true;
				}
			} else {
				this.gp_tip.visible = true;
			}
			if (!this._handleId) {
				this._handleId = App.EventSystem.addEventListener(PanelNotify.HERO_ON_HERO_SELECT, this.updateView, this);
			}
			if (!this._updateHandleId) {
				this._updateHandleId = App.EventSystem.addEventListener(PanelNotify.HERO_SPECIAL_EQUIP_UPDATE, this.updateView, this);
			}
			this.hero_head.open(openParam);
			this.hero_head.readyOpen(openParam);
			this.updateView(this._curPos);
			this.checkGuide();
			//this.addActiveEff();
		}

		/**
		 * 关闭窗口
		 */
		public closeWin(callback): void {
			super.closeWin(callback);
			this.removeGuide();
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
			if (this._updateHandleId) {
				App.EventSystem.removeEventListener(PanelNotify.HERO_SPECIAL_EQUIP_UPDATE, this._updateHandleId);
				this._updateHandleId = undefined;
			}
			this.hero_head.clear(data);
			this.clearActiveEff()
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
			this._mcEffect.destroy();
		}
	}
}
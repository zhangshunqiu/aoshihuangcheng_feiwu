//升星子页面
//author：zrj
module game{
    export class ForgeStarView extends BaseChildView {

       public img_starCostIcon:eui.Image;
		public baseItem:customui.BaseItem;
		public baseItem_result:customui.BaseItem;
		public lb_star:eui.Label;
		public gp_attr:eui.Group;
		public lb_starLeft:eui.Label;
		public lb_starRight:eui.Label;
		public lb_total:eui.Label;
		public lb_starNum:eui.Label;
		public lb_starGet:eui.Label;
		public btn_upStar:eui.Button;
		public img_starCost:eui.Image;
		public img_attr:eui.Image;
		public gp_starEquip:eui.Group;



        private backpackModel: BackpackModel = BackpackModel.getInstance();
        private heroModel: HeroModel = HeroModel.getInstance();
        private forgeModel: ForgeModel = ForgeModel.getInstance();
        private _starCostId: number; //升星消耗物品id
        private _handleId: number = 0;  
		private _starCostNum: number; //升星消耗物品Num
        private _equipStarArray: Array<customui.BaseItem> = []; //升星数组


        public constructor(skinName: string) {
            super(skinName);
            this.skinName = "ForgeStarSkin"
        }

        protected childrenCreated() {
            super.childrenCreated();

            //升星
            this.btn_upStar.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
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

            //获取道具 升星用
			this.lb_starGet.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				// let view = new ItemWay(ClientType.BASE_ITEM, this._starCostId);
				// PopUpManager.addPopUp({ obj: view });
				App.GlobalTips.showItemWayTips(ClientType.BASE_ITEM, this._starCostId);
			}, this);

            //套装属性
			this.img_attr.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				// let view = new ForgeStarInfo(this.heroModel.heroInfo[this.heroModel.curPos].id);
				// PopUpManager.addPopUp({ obj: view });
				App.WinManager.openWin(WinName.POP_FORGE_STAR);
			}, this);

            this.lb_starGet.textFlow = [{ text: "获得道具", style: { underline: true } }];

            	//升星装备初始化
			for (let i = 1; i <= 10; i++) {
				let item = new customui.BaseItem();
				item.width = item.height = 90;

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
					item.setStrengthLvVisible(false);
					item.setCarrerIconVisible(false);
				} else {
					item.updateBaseItem(ClientType.EQUIP, 0, null, equipInfo);
					// RES.getResAsync(ConstEquipIcon[i] + "_png", (texture) => {
					// 	item.img_icon.source = texture;
					// }, this);
					item.setItemIcon(ConstEquipIcon[i] + "_png");
					item.setStrengthLvVisible(false);
				}

				this.gp_starEquip.addChild(item);
				item.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
					// this.forgeModel.curStarPart = i;
					// this.updateStarView();
					if (i == this.forgeModel.curStarPart) {
						return;
					}
					this.forgeModel.curStarPart = i;;
					// this.setSelect();
					// this.moveAnimate(i);
					this.updateStarView();
				}, this);
				this._equipStarArray.push(item);
			}
			this.forgeModel.curStarPart = 1;
        }

        //移动动画
		// private moveAnimate(part) {
		// 	let preItem = this._equipStarArray[part - 1];
		// 	let item = new customui.BaseItem();
		// 	item.x = preItem.x;
		// 	item.y = preItem.y;
		// 	item.updateBaseItem(ClientType.EQUIP, 0);
		// 	// item.img_icon.source = preItem.img_icon.source;
		// 	item.setItemIcon(preItem.getItemIcon());
		// 	preItem.parent.addChild(item);
		// 	egret.Tween.get(item).to({ x: 253, y: 305 }, 300, egret.Ease.sineOut).call(() => {
		// 		if (item.parent) {
		// 			item.parent.removeChild(item);
		// 		}
		// 		this.updateStarView();
		// 	}, this);
		// }

        //更新升星界面
		public updateStarView() {
			this._equipStarArray.forEach((value,index,arr)=>{
				value.setSelect(false);
			},this)
			this._equipStarArray[this.forgeModel.curStarPart-1].setSelect(true);
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
				this.img_starCost.source = texture;
				this.img_starCostIcon.source = texture;
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
				this.baseItem.setStrengthLvVisible(false);
				this.baseItem.setCarrerIconVisible(false);
			} else {
				this.baseItem.updateBaseItem(ClientType.EQUIP, 0, null, equipInfo);
				this.baseItem.setStrengthLvVisible(false);
				this.baseItem.updateBaseItem(ClientType.EQUIP,0);
				this.baseItem.setItemIcon(ConstEquipIcon[this.forgeModel.curStarPart] + "_png");
			}
			if (pos >= 0) { //有装备
				let equipInfo2 = App.ConfigManager.equipConfig()[heroInfo.equip_info[pos].good_id];
				this.baseItem_result.updateBaseItem(ClientType.EQUIP, heroInfo.equip_info[pos].good_id, null, equipInfo);
				this.baseItem_result.setStrengthLvVisible(false);
				this.baseItem_result.setCarrerIconVisible(false);
			} else {
				this.baseItem_result.updateBaseItem(ClientType.EQUIP, 0, null, equipInfo);
				this.baseItem_result.setStrengthLvVisible(false);
				this.baseItem_result.updateBaseItem(ClientType.EQUIP,0);
				this.baseItem_result.setItemIcon(ConstEquipIcon[this.forgeModel.curStarPart] + "_png");
			}
			this.lb_star.text = "星级+" + curLevel;

		}

		public checkRedDot(heroPos:number):void {
			for (let i = 1; i <= 10; i++) {
				let show = this.forgeModel.checkCanStarupByPart(heroPos, i);
				if (show) {
					this._equipStarArray[i - 1].showRedTips(null);
				} else {
					this._equipStarArray[i - 1].hideRedTips();
				}
			}
		}

        public updateView() {
			this.updateEquip();
            this.updateStarView();
		}

        //更新装备信息
		public updateEquip() {
			for (let i = 0; i < 10; i++) {
				let item2 = this._equipStarArray[i];
				let equipInfo = this.heroModel.heroInfo[this.heroModel.curPos].getPartInfoByPart(i + 1);
				if (this.heroModel.heroInfo[this.heroModel.curPos].equipExist(i + 1) >= 0) { //有装备
					item2.updateBaseItem(ClientType.EQUIP, equipInfo.good_id, null, equipInfo);
					item2.setCarrerIconVisible(false);
					item2.setStrengthLvVisible(false);
				} else {
					item2.updateBaseItem(ClientType.EQUIP, 0, null, equipInfo);
					item2.setStrengthLvVisible(false);
					item2.setItemIcon(ConstEquipIcon[i + 1] + "_png");
				}
			}
		}

        //升星动画
		private animationStar() {
			

			// this.lb_starLeft.x = 25;
			// this.lb_starRight.x = 175;
			egret.Tween.get(this.lb_starLeft).to({ x: 185, alpha: 0 }, 200, egret.Ease.sineOut).call(() => {
				this.lb_starLeft.x = 248;
				this.lb_starLeft.alpha = 1;
			}, this)
			egret.Tween.get(this.lb_starRight).to({ x: 335, alpha: 0 }, 200, egret.Ease.sineOut).call(() => {
				this.lb_starRight.x = 398;
				this.lb_starRight.alpha = 1;
			}, this)

			let mc1 = new EffectMovieClip();
			mc1.x = 370;
			mc1.y = 440;
			mc1.playMCKey("effzzxt", "", 1, null, null, () => {
				if (mc1.parent) {
					mc1.parent.removeChild(mc1);
				}
				mc1.destroy();

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
			}, this);
			this.addChild(mc1);
		}

        /**
         * 打开窗口
         */
        public open(openParam: any = null): void {
            super.open(openParam);
            if (!this._handleId) {
				this._handleId = App.EventSystem.addEventListener(PanelNotify.HERO_ON_HERO_SELECT, this.updateView, this);
			}
            App.EventSystem.addEventListener(PanelNotify.FORGE_STAR_EQUIP, this.animationStar, this);

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
            App.EventSystem.removeEventListener(PanelNotify.FORGE_STAR_EQUIP);

        }
        /**
         * 销毁
         */
        public destroy(): void {
            super.destroy();
        }

    }
}

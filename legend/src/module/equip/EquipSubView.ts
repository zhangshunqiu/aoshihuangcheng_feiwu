/*
 * module : 装备子视图
 * author : zrj
*/
module game {
    export class EquipSelect extends BaseView {
        public gp_main: eui.Group;
        public img_close: eui.Image;
        public scroller: eui.Scroller;
        public list: eui.List;
        public gp_tip: eui.Group;

        private _part: number = 1;
        private _career: number = 1;
        private _sex: number = 1;
        private heroModel: HeroModel = HeroModel.getInstance();
        public constructor(career, type, sex?) {
            super();
            this.skinName = "EquipSelectSkin";
            this._part = type;  //装备部位
            this._career = career;
            this._sex = sex ? sex : 0;
            this.readyOpenWin();
        }

        protected childrenCreated() {
            super.childrenCreated();
            App.EventSystem.addEventListener(PanelNotify.HERO_CLOSE_EQUIP_SELECT, () => {
                PopUpManager.removePopUp(this);
            }, this);
            this.initView();
        }

        private initView() {
            this.gp_tip.visible = false;
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
                PopUpManager.removePopUp(this, 0);
            }, this);
            this.list = new eui.List();
            this.list.itemRenderer = EquipSelectItem;
            this.scroller.viewport = this.list;
            this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, (e: eui.ItemTapEvent) => {
                // console.log("gggg");
            }, this);
            this.updateView();
        }

        public updateView() {
            let temp: Array<any> = (BackpackModel.getInstance() as BackpackModel).getEquipByCareerPart(this._career, this._part);
            // temp.part = this._part;
            let finalArr = [];
            let temp1 = [];
            let temp2 = [];
            for (let i = 0; i < temp.length; i++) {
                let info = App.ConfigManager.equipConfig()[temp[i].good_id];
                if (info.sex == 0 || info.sex == this.heroModel.heroInfo[this.heroModel.curPos].sex) {
                    if (info.limit_lvl > App.RoleManager.roleInfo.lv) {
                        temp2.push(temp[i]);
                    } else {
                        temp1.push(temp[i]);
                    }
                    // finalArr.push(temp[i]);
                }
            }
            finalArr = temp1.concat(temp2);
            if (finalArr.length == 0) {
                this.gp_tip.visible = true;
            } else {
                this.gp_tip.visible = false;
                this.gp_main.visible = true;
                EquipModel.getInstance().sortEquipByCap(finalArr);
                //装备在身上的也要展示
                let equip = this.heroModel.heroInfo[this.heroModel.curPos].getEquipByPart(this._part);
                if (equip) {
                    finalArr.splice(0, 0, new EquipVO(equip));
                }

                let data = new eui.ArrayCollection(finalArr);
                this.list.dataProvider = data;
                this.list.selectedIndex = 0;
                this.list.validateNow();
                this.changeList(0);
            }


        }

        public changeList(index) {
        }

        private checkGuide() {
            if(this.list.numElements){
                App.GuideManager.bindClickBtn((<eui.Group>(<EquipSelectItem>this.list.getElementAt(0)).getChildAt(0)).getChildByName("btn_select"),1000,3);
                App.GuideManager.bindClickBtn((<eui.Group>(<EquipSelectItem>this.list.getElementAt(0)).getChildAt(0)).getChildByName("btn_select"),1002,3);
                App.GuideManager.checkGuide(1000);
                App.GuideManager.checkGuide(1002);
            }
        }

        private removeGuide() {
            App.GuideManager.removeClickBtn(1000,3);
            App.GuideManager.removeClickBtn(1002,3);
        }

         /**
		 * 打开窗口
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
            this.validateNow();
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
            this.removeGuide();
        }
		/**
		 * 销毁
		 */
        public destroy(): void {
            super.destroy();
            App.EventSystem.removeEventListener(PanelNotify.HERO_CLOSE_EQUIP_SELECT);
        }
    }

    export class EquipSelectItem extends eui.ItemRenderer {
        public gp_main: eui.Label;
        public baseItem: customui.BaseItem;
        public lb_level: eui.Label;
        public lb_name: eui.Label;
        public lb_cap: eui.Label;
        public lb_attr: eui.Label;
        public btn_select: eui.Label;
        public bmlb_cap: eui.BitmapLabel;
        public img_equiped: eui.Image;

        public equipedId: number;// 如果已经装备武器，则是已经装备武器id，
        private heroModel: HeroModel = HeroModel.getInstance();
        public constructor() {
            super();
            this.skinName = "EquipSelectItem";
            this.btn_select.name = "btn_select";
            let equipInfo = this.heroModel.heroInfo[this.heroModel.curPos].getEquipByPart(this.heroModel.curPart);

            if (equipInfo) {
                this.equipedId = equipInfo.id;
            }

            this.btn_select.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                let heroModel = HeroModel.getInstance() as HeroModel;
                let heroInfo = heroModel.heroInfo[heroModel.curPos];
                let baseInfo = App.ConfigManager.equipConfig()[this.data.good_id];
                if (baseInfo.limit_lvl > App.RoleManager.roleInfo.lv) {
                    App.GlobalTips.showTips("等级达到" + baseInfo.limit_lvl + "级可穿戴");
                    return;
                }
                App.Socket.send(15002, { id: heroInfo.id, part: heroModel.curPart, player_good_id: this.data.id });
                App.EventSystem.dispatchEvent(PanelNotify.HERO_CLOSE_EQUIP_SELECT);
            }, this);
        }

        protected dataChanged() {
            let baseInfo = App.ConfigManager.equipConfig()[this.data.good_id];
            this.lb_name.text = baseInfo.name;
            this.lb_level.text = "等级" + baseInfo.limit_lvl;
            this.lb_attr.lineSpacing = 8;
            // this.lb_cap.text = "评分：";
            this.bmlb_cap.text = this.data.score;
            this.baseItem.updateBaseItem(2, this.data.good_id);
            let textArray = [];
            textArray.push({ text: "【基础属性】：\n", style: { textColor: 0xd47e33, size: 18 } });
            let attribute = App.ConfigManager.attributeConfig()[baseInfo.base_att];
            // let attrBase = EquipModel.getInstance().attributeFilter(attribute);
            let attrBase = (<EquipVO>this.data).base;
            let count = 0;
            let colorArray = [0xc98f12, 0x2f66a9, 0x149a21, 0x8d1b1b];
            for (let key in attrBase) {
                let myKey = ConstAttributeArray[attrBase[key].key];
                textArray.push({ text: "\t" + ConstAttribute[myKey] + "：", style: { textColor: 0xffd237, size: 18 } }, { text: attrBase[key].value, style: { textColor: 0xded9d6, size: 18 } },
                    { text: "+" + attrBase[key].add_value, style: { textColor: 0xded9d6, size: 18 } });
                count++;
                if (count % 2 == 0) {
                    textArray.push({ text: "\n" });
                }
            };
            this.lb_attr.textFlow = textArray;
            if (this.data.id == this.equipedId) {
                this.img_equiped.visible = true;
                this.btn_select.visible = false;
            } else {
                this.img_equiped.visible = false;
                this.btn_select.visible = true;
            }
            if (baseInfo.limit_lvl > App.RoleManager.roleInfo.lv) {
                this.lb_level.textColor = 0xf63527;
            } else {
                this.lb_level.textColor = 0xbfbfbf;
            }
        }
    }

}
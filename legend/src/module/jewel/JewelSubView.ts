/**
 * module : 宝石模块子视图
 * author : zrj
 */
module game {
	/**
	 * 宝石属性
	*/
    export class JewelTipView extends BaseView {
        public gp_main: eui.Group;
        public lb_name: eui.Label;
        public lb_level: eui.Label;
        public lb_num: eui.Label;
        public lb_desc: eui.Label;
        public baseItem: customui.BaseItem;
        public btn_upgrade: eui.Button;

        private _handleId : number;
        private _data;
        private heroModel: HeroModel = HeroModel.getInstance() as HeroModel;
        public constructor(data) {
            super(data);
            this.skinName = "JewelTipSkin";
            this._data = data;
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.initView();
            this._handleId = App.EventSystem.addEventListener(PanelNotify.JEWEL_UPDATE_VIEW, this.handleUpgrade, this);
        }

        private initView() {
            this.btn_upgrade.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                App.Socket.send(15009, { id: this._data.heroId, part: this._data.part, hole: this._data.hole });
            }, this);
            RES.getResAsync(ConstJewelIcon[this._data.hole] + "_png", (texture) => {
                this.baseItem.img_icon.source = texture;
            }, this);

            if (this._data.id) {
                let jewelInfo = App.ConfigManager.itemConfig()[this._data.id];
                let numInfo = (BackpackModel.getInstance() as BackpackModel).getItemByTypeIdUuid(ClientType.BASE_ITEM, this._data.id);
                if (numInfo) {
                    if (numInfo.num >= 2) {
                        this.btn_upgrade.visible = true;
                    } else {
                        this.btn_upgrade.visible = false;
                    }
                } else {
                    numInfo = { num: 0 };
                    this.btn_upgrade.visible = false;
                }
                this.lb_name.text = jewelInfo.name;
                this.lb_level.textFlow = [{ text: "等    级：" }, { text: String(jewelInfo.limit_lv), style: { textColor: 0xe19b2d } }];
                this.lb_num.textFlow = [{ text: "背包数量：" }, { text: String(numInfo.num), style: { textColor: 0x75fffd } }];;
                this.lb_desc.text = jewelInfo.des;
            } else { //未激活
                this.btn_upgrade.visible = false;
                this.lb_name.text = ConstJewelName[this._data.hole];
                this.lb_level.textFlow = [{ text: "等    级：" }, { text: String(0), style: { textColor: 0xe19b2d } }];
                this.lb_num.textFlow = [{ text: "背包数量：" }, { text: String(0), style: { textColor: 0x75fffd } }];;
                this.lb_desc.text = "";
            }


        }

        private handleUpgrade() {
            PopUpManager.removePopUp(this);
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
            if (this._handleId) {
                App.EventSystem.removeEventListener(PanelNotify.JEWEL_UPDATE_VIEW,this._handleId);
                this._handleId = undefined;
            }
            
        }
    }

    /**
	 * 宝石大师属性
	*/
    export class JewelMasterView extends BaseView {
        public gp_main: eui.Group;
        public lb_cur: eui.Label;
        public lb_attr: eui.Label;
        public lb_cur1: eui.Label;
        public lb_attr1: eui.Label;
        public img_status: eui.Image;
        public bmlb_level: eui.BitmapLabel;

        private _data;
        private heroModel: HeroModel = HeroModel.getInstance() as HeroModel;
        public constructor(data) {
            super();
            this.skinName = "JewelMasterSkin";
            this._data = data;
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.initView();
        }

        private initView() {
            let jewelInfo = this.heroModel.heroInfo[this._data.pos].jewelDic;
            let total = 0;
            for (let i = 0; i < jewelInfo.length; i++) {
                for (let j in jewelInfo[i].sotne_list) {
                    let info = jewelInfo[i].sotne_list[j];
                    if (info.stone_id) {
                        let itemInfo = App.ConfigManager.itemConfig()[info.stone_id];
                        total += itemInfo.limit_lv;
                    }

                }
            }
            let level = Math.floor(total / 5) * 5;

            if (level > 0) {
                let attrInfo2 = App.ConfigManager.getJewelAllInfoByLevel(level);
                let attribute2 = App.ConfigManager.getJewelInfoById(attrInfo2.attribute_jewel);
                let attrBase2 = EquipModel.getInstance().attributeFilter(attribute2);
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
                this.lb_attr.textFlow = text1;
            } else {
                this.lb_attr.text = "未激活";
                this.lb_attr.visible = true;
                RES.getResAsync("forge_txt_weijihuo_png", (texture) => {
                    this.img_status.source = texture;
                }, this);
            }

            //下一级
            let attrInfo = App.ConfigManager.getJewelAllInfoByLevel(level + 5);
            if (!attrInfo) {
                this.lb_attr1.visible = true;
                this.lb_attr1.text = "已满级";
                return;
            }
            let attribute = App.ConfigManager.getJewelInfoById(attrInfo.attribute_jewel);
            let attrBase = EquipModel.getInstance().attributeFilter(attribute);
            let text = [];
            let count = 1;
            for (let key in attrBase) {
                let label = new eui.Label();
                label.size = 24;
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
            this.bmlb_level.text = String(level);
            this.lb_attr1.textFlow = text;
            this.lb_cur.textFlow = [{ text: "当前效果：全身宝石等级" }, { text: "+" + level, style: { textColor: 0x21c42b } }];
            // this.lb_cur1.textFlow = [{ text: "下级效果：全身宝石等级" }, { text: "+" + (level + 5), style: { textColor: 0x21c42b } }];
            this.lb_cur1.text = "下级效果：全身宝石等级+" +(level + 5);
            this.lb_cur1.textColor = 0x626262;
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

    /**
	 * 宝石超级属性
	*/
    export class JewelSuperView extends BaseView {
        public gp_main: eui.Group;
        public lb_attr: eui.Label;
        public lb_attr1: eui.Label;

        private _data;
        private heroModel: HeroModel = HeroModel.getInstance() as HeroModel;
        public constructor(data) {
            super();
            this.skinName = "JewelSuperSkin";
            this._data = data;
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.initView();
        }

        private initView() {
            let jewelInfo = this.heroModel.heroInfo[this._data.pos].jewelDic;
            let value = [0, 0, 0, 0];
            let totalValue = [0, 0, 0, 0];
            for (let i = 0; i < jewelInfo.length; i++) {
                for (let j in jewelInfo[i].sotne_list) {
                    let info = jewelInfo[i].sotne_list[j];
                    if (info.stone_id) {
                        let itemInfo = App.ConfigManager.itemConfig()[info.stone_id];
                        let attribute = App.ConfigManager.getJewelInfoById(itemInfo.attribute_jewel); //宝石属性
                        if (itemInfo.sub_type == JewelType.ATTACK) {
                            if (this.heroModel.heroInfo[this._data.pos].job == CareerType.SOLDIER) {
                                totalValue[0] += attribute["ac"];
                            } else if (this.heroModel.heroInfo[this._data.pos].job == CareerType.MAGES) {
                                totalValue[0] += attribute["mac"];
                            } else if (this.heroModel.heroInfo[this._data.pos].job == CareerType.TAOIST) {
                                totalValue[0] += attribute["sc"];
                            }
                        } else if (itemInfo.sub_type == JewelType.LIFE) {
                            totalValue[1] += attribute["hp"];

                        } else if (itemInfo.sub_type == JewelType.DEFENCE) {
                            totalValue[2] += attribute["def"];

                        } else if (itemInfo.sub_type == JewelType.MAGIC) {
                            totalValue[3] += attribute["sdef"];
                        }
                        value[itemInfo.sub_type - 1] += itemInfo.super_attribute;
                    }
                }
            }

            //全身属性
            let total = 0;
            for (let i = 0; i < jewelInfo.length; i++) {
                for (let j in jewelInfo[i].sotne_list) {
                    let info = jewelInfo[i].sotne_list[j];
                    if (info.stone_id) {
                        let itemInfo = App.ConfigManager.itemConfig()[info.stone_id];
                        total += itemInfo.limit_lv;
                    }

                }
            }
            let level = Math.floor(total / 5) * 5;

            if (level > 0) {
                let attrInfo2 = App.ConfigManager.getJewelAllInfoByLevel(level);
                let attribute2 = App.ConfigManager.getJewelInfoById(attrInfo2.attribute_jewel);
                let attrBase2 = EquipModel.getInstance().attributeFilter(attribute2);
                let text1 = [];
                for (let key in attrBase2) {
                    if (key == "ac" || key == "mac" || key == "sc") {
                        if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.SOLDIER) {
                            if (key == "ac") {
                                totalValue[0] += attrBase2["ac"];
                            }
                        } else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.MAGES) {
                            if (key == "mac") {
                                totalValue[0] += attrBase2["ac"];
                            }
                        } else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.TAOIST) {
                            if (key == "sc") {
                                totalValue[0] += attrBase2["ac"];
                            }
                        }
                    } else {
                        if (key == "hp") {
                            totalValue[1] += attrBase2["hp"];
                        } else if (key == "def") {
                            totalValue[2] += attrBase2["def"];
                        } else if (key == "sdef") {
                            totalValue[3] += attrBase2["sdef"];
                        }
                    }
                };
            } else {

            }

            let text1 = [];
            let text2 = [];
            for (let i = 0; i < 4; i++) {
                text1.push({ text: ConstJewelName[i + 1] + "+" + value[i] / 100 + "%" + "\n" });
                text2.push({ text: ConstJewelName[i + 1] + "+" + totalValue[i] + "(+" + Math.floor(totalValue[i] * value[i] / 10000) + ")" + "\n" });
            }
            this.lb_attr.textFlow = text1;
            this.lb_attr1.textFlow = text2;
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
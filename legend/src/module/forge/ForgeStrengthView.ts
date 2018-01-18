//锻造强化子页面
//author：zrj
class ForgeStrengthView extends BaseChildView {
    public gp_main: eui.Group;
    public gp_strength: eui.Group;
    public gp_display: eui.Group;
    public gp_part: eui.Group;
    public gp_part_line: eui.Group;
    public gp_equip: eui.Group;
    public lb_num: eui.Label;
    public img_cost: eui.Image;
    public label_get: eui.Label;
    public btn_forge: eui.Button;
    public btn_all: eui.Button;
    public gp_attr: eui.Group;
    public lb_left0: eui.Label;
    public lb_left: eui.Label;
    public lb_right: eui.Label;

    private _equipArray: Array<customui.BaseItem> = [];  //部位数组
    private _partIconArray: Array<eui.Image> = [];  //模型上图片
    private _partIconLineArray: Array<eui.Image> = [];  //模型线
    private _strengthCostId: number; //强化消耗物品id
    private _strengthCostNum: number; //强化消耗物品Num
    private _isAll: boolean; //是否一键强化

    private heroModel: game.HeroModel = game.HeroModel.getInstance();
    private forgeModel: game.ForgeModel = game.ForgeModel.getInstance();
    private backpackModel: game.BackpackModel = game.BackpackModel.getInstance();

    public constructor(skinName: string) {
        super(skinName);
        this.skinName = "ForgeStrengthSkin"
    }

    protected childrenCreated() {
        super.childrenCreated();
        this.initView();
    }

    private initView() {
        for (let i = 0; i < 10; i++) {
            let child = this.gp_part.getChildAt(i);
            this._partIconArray.push(<eui.Image>child);

            let child2 = this.gp_part_line.getChildAt(i);
            this._partIconLineArray.push(<eui.Image>child2);
        }

        //获取道具
        this.btn_forge.addEventListener(egret.TouchEvent.TOUCH_TAP,this.strengthOne,this);
        this.btn_all.addEventListener(egret.TouchEvent.TOUCH_TAP,this.strengthAll,this);

        this.label_get.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            App.GlobalTips.showItemWayTips(ClientType.BASE_ITEM, this._strengthCostId);
        }, this);
        this.label_get.textFlow = [{ text: "获得道具", style: { underline: true } }];

        this.initEquip();
    }

    private initEquip() {
        //强化装备item初始化
        for (let i = 1; i <= 10; i++) {
            let item = new customui.BaseItem();
            item.setStopShowTips(true);
            item.setStrengthLvVisible(true);
            if (i % 2 != 0) {
                item.left = 40;
            } else {
                item.right = 40;
            }
            item.y = 65 + (Math.floor((i - 1) / 2) * (item.height + 18));
            //特殊处理衣服和头盔
            if (i == 2) { //衣服
                item.right = undefined;
                item.left = 40;
                item.y = 65 + (Math.floor((i + 1 - 1) / 2) * (item.height + 18));
            } else if (i == 3) { //头盔
                item.left = undefined;
                item.right = 40;
                item.y = 65 + (Math.floor((i - 1 - 1) / 2) * (item.height + 18));
            }

            this._equipArray.push(item);
            let equipInfo = this.heroModel.heroInfo[this.heroModel.curPos].getPartInfoByPart(i);
            if (this.heroModel.heroInfo[this.heroModel.curPos].equipExist(i) >= 0) { //有装备

                item.updateBaseItem(ClientType.EQUIP, equipInfo.good_id, null, equipInfo);
                item.setCarrerIconVisible(false);
                item.setStarLvVisible(false);
            } else {
                item.updateBaseItem(ClientType.EQUIP, 0, null, equipInfo);
                // RES.getResAsync(ConstEquipIcon[i + 1] + "_png", (texture) => {
                // 	item.img_icon.source = texture;
                // }, this);
                item.setItemIcon(ConstEquipIcon[i] + "_png");
                item.setStarLvVisible(false);
            }


            this.gp_equip.addChild(item);
        }
    }

    //强化一次
    private strengthOne() {
        let info = this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, this._strengthCostId);
        if (!info) {
            info = { num: 0 };
        }
        if (info.num >= this._strengthCostNum) {
            this._isAll = false;
            App.Socket.send(15004, { id: this.heroModel.heroInfo[this.heroModel.curPos].id, part: this.forgeModel.curPart });
        } else {
            App.GlobalTips.showErrCodeTips(15001);
        }
    }

    //强化全部
    private strengthAll() {
        let info = this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, this._strengthCostId);
        if (!info) {
            info = { num: 0 };
        }
        if (info.num >= this._strengthCostNum) {
            this._isAll = true;
            App.Socket.send(15005, { id: this.heroModel.heroInfo[this.heroModel.curPos].id, part: this.forgeModel.curPart });
        } else {
            App.GlobalTips.showErrCodeTips(15001);
        }
    }


    //强化动画效果
    private animationStrength() {

        //强化飘字
        let mc = new EffectMovieClip();
        mc.x = this.width / 2;
        mc.y = this.height / 3;
        if (this._isAll) {
            if (this.touchChildren) { //能点击了
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
        mc2.playMCKey("dqhcg", "", 1, null, null, () => {
            if (mc2.parent) {
                mc2.parent.removeChild(mc2);
            }
            mc2.destroy();
        }, this);
        curItem.addChild(mc2);

        egret.Tween.get(this.lb_left).to({ x: 330, alpha: 0 }, 200, egret.Ease.sineOut).call(() => {
            this.lb_left.x = 250;
            this.lb_left.alpha = 1;
        }, this)
        egret.Tween.get(this.lb_right).to({ x: 500, alpha: 0 }, 200, egret.Ease.sineOut).call(() => {
            this.lb_right.x = 420;
            this.lb_right.alpha = 1;
        }, this)
    }

    //更新装备信息
    public updateEquip() {
        for (let i = 0; i < 10; i++) {
            let item = this._equipArray[i];
            let equipInfo = this.heroModel.heroInfo[this.heroModel.curPos].getPartInfoByPart(i + 1);
            if (this.heroModel.heroInfo[this.heroModel.curPos].equipExist(i + 1) >= 0) { //有装备

                item.updateBaseItem(ClientType.EQUIP, equipInfo.good_id, null, equipInfo);
                item.setCarrerIconVisible(false);
                // item.setStrengthLvVisible(false);
                item.setStarLvVisible(false);
            } else {
                item.updateBaseItem(ClientType.EQUIP, 0, null, equipInfo);
                item.setStarLvVisible(false);
                item.setItemIcon(ConstEquipIcon[i + 1] + "_png");
            }
        }
    }

    //检测当前强化到哪
    private checkStrengthPart() {
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
    }

    //选中框
    private setSelect() {
        this._partIconArray.forEach((value,index,arr)=>{
            value.visible = false;
        },this)
        this._partIconArray[this.forgeModel.curPart-1].visible = true;
        this._partIconLineArray.forEach((value,index,arr)=>{
            value.visible = false;
        },this)
        this._partIconLineArray[this.forgeModel.curPart-1].visible = true;
    }

    //更新强化界面
    public updateStrengthView() {
        this.setSelect();
        let equip = this.heroModel.heroInfo[this.heroModel.curPos].getPartInfoByPart(this.forgeModel.curPart);
        let curLevel = equip ? equip.lv : 0;
        // this.lb_left.text = "";
        if (curLevel > 0) {
            let forgeInfo = this.forgeModel.getStrengthByPartLevel(this.forgeModel.curPart, curLevel);
            let attribute = App.ConfigManager.attributeConfig()[forgeInfo.attribute];
            let attrBase = game.EquipModel.getInstance().attributeFilter(attribute);

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
        let attrBase = game.EquipModel.getInstance().attributeFilter(attribute);

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

    //更新界面
    public updateView() {
        this.updateEquip();
        this.checkStrengthPart();
        this.updateStrengthView();
    }

    /**
     * 打开窗口
     */
    public open(openParam: any = null): void {
        super.open(openParam);
        App.EventSystem.addEventListener(PanelNotify.FORGE_STRENGTH_EQUIP, this.animationStrength, this);
    }

    /**
     * 清理
     */
    public clear(data: any = null): void {
        super.clear(data);
        App.EventSystem.removeEventListener(PanelNotify.FORGE_STRENGTH_EQUIP);
    }
    /**
     * 销毁
     */
    public destroy(): void {
        super.destroy();
    }

}
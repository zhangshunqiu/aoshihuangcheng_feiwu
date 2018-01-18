var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//锻造强化子页面
//author：zrj
var ForgeStrengthView = (function (_super) {
    __extends(ForgeStrengthView, _super);
    function ForgeStrengthView(skinName) {
        var _this = _super.call(this, skinName) || this;
        _this._equipArray = []; //部位数组
        _this._partIconArray = []; //模型上图片
        _this._partIconLineArray = []; //模型线
        _this.heroModel = game.HeroModel.getInstance();
        _this.forgeModel = game.ForgeModel.getInstance();
        _this.backpackModel = game.BackpackModel.getInstance();
        _this.skinName = "ForgeStrengthSkin";
        return _this;
    }
    ForgeStrengthView.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.initView();
    };
    ForgeStrengthView.prototype.initView = function () {
        var _this = this;
        for (var i = 0; i < 10; i++) {
            var child = this.gp_part.getChildAt(i);
            this._partIconArray.push(child);
            var child2 = this.gp_part_line.getChildAt(i);
            this._partIconLineArray.push(child2);
        }
        //获取道具
        this.btn_forge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.strengthOne, this);
        this.btn_all.addEventListener(egret.TouchEvent.TOUCH_TAP, this.strengthAll, this);
        this.label_get.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            App.GlobalTips.showItemWayTips(ClientType.BASE_ITEM, _this._strengthCostId);
        }, this);
        this.label_get.textFlow = [{ text: "获得道具", style: { underline: true } }];
        this.initEquip();
    };
    ForgeStrengthView.prototype.initEquip = function () {
        //强化装备item初始化
        for (var i = 1; i <= 10; i++) {
            var item = new customui.BaseItem();
            item.setStopShowTips(true);
            item.setStrengthLvVisible(true);
            if (i % 2 != 0) {
                item.left = 40;
            }
            else {
                item.right = 40;
            }
            item.y = 65 + (Math.floor((i - 1) / 2) * (item.height + 18));
            //特殊处理衣服和头盔
            if (i == 2) {
                item.right = undefined;
                item.left = 40;
                item.y = 65 + (Math.floor((i + 1 - 1) / 2) * (item.height + 18));
            }
            else if (i == 3) {
                item.left = undefined;
                item.right = 40;
                item.y = 65 + (Math.floor((i - 1 - 1) / 2) * (item.height + 18));
            }
            this._equipArray.push(item);
            var equipInfo = this.heroModel.heroInfo[this.heroModel.curPos].getPartInfoByPart(i);
            if (this.heroModel.heroInfo[this.heroModel.curPos].equipExist(i) >= 0) {
                item.updateBaseItem(ClientType.EQUIP, equipInfo.good_id, null, equipInfo);
                item.setCarrerIconVisible(false);
                item.setStarLvVisible(false);
            }
            else {
                item.updateBaseItem(ClientType.EQUIP, 0, null, equipInfo);
                // RES.getResAsync(ConstEquipIcon[i + 1] + "_png", (texture) => {
                // 	item.img_icon.source = texture;
                // }, this);
                item.setItemIcon(ConstEquipIcon[i] + "_png");
                item.setStarLvVisible(false);
            }
            this.gp_equip.addChild(item);
        }
    };
    //强化一次
    ForgeStrengthView.prototype.strengthOne = function () {
        var info = this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, this._strengthCostId);
        if (!info) {
            info = { num: 0 };
        }
        if (info.num >= this._strengthCostNum) {
            this._isAll = false;
            App.Socket.send(15004, { id: this.heroModel.heroInfo[this.heroModel.curPos].id, part: this.forgeModel.curPart });
        }
        else {
            App.GlobalTips.showErrCodeTips(15001);
        }
    };
    //强化全部
    ForgeStrengthView.prototype.strengthAll = function () {
        var info = this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, this._strengthCostId);
        if (!info) {
            info = { num: 0 };
        }
        if (info.num >= this._strengthCostNum) {
            this._isAll = true;
            App.Socket.send(15005, { id: this.heroModel.heroInfo[this.heroModel.curPos].id, part: this.forgeModel.curPart });
        }
        else {
            App.GlobalTips.showErrCodeTips(15001);
        }
    };
    //强化动画效果
    ForgeStrengthView.prototype.animationStrength = function () {
        var _this = this;
        //强化飘字
        var mc = new EffectMovieClip();
        mc.x = this.width / 2;
        mc.y = this.height / 3;
        if (this._isAll) {
            if (this.touchChildren) {
                mc.playMCKey("effqhcg2", "", 1, null, null, function () {
                    if (mc.parent) {
                        mc.parent.removeChild(mc);
                    }
                    mc.destroy();
                }, this);
            }
        }
        else {
            mc.playMCKey("effqhcg1", "", 1, null, null, function () {
                if (mc.parent) {
                    mc.parent.removeChild(mc);
                }
                mc.destroy();
            }, this);
        }
        this.addChild(mc);
        //强化成功位置
        var part = this.forgeModel.curPart - 1 - 1; //上个强化位置
        if (part == -1) {
            part = 9;
        }
        var curItem = this._equipArray[part];
        var mc2 = new EffectMovieClip();
        mc2.x = curItem.width / 2;
        mc2.y = curItem.height / 2;
        mc2.playMCKey("dqhcg", "", 1, null, null, function () {
            if (mc2.parent) {
                mc2.parent.removeChild(mc2);
            }
            mc2.destroy();
        }, this);
        curItem.addChild(mc2);
        egret.Tween.get(this.lb_left).to({ x: 330, alpha: 0 }, 200, egret.Ease.sineOut).call(function () {
            _this.lb_left.x = 250;
            _this.lb_left.alpha = 1;
        }, this);
        egret.Tween.get(this.lb_right).to({ x: 500, alpha: 0 }, 200, egret.Ease.sineOut).call(function () {
            _this.lb_right.x = 420;
            _this.lb_right.alpha = 1;
        }, this);
    };
    //更新装备信息
    ForgeStrengthView.prototype.updateEquip = function () {
        for (var i = 0; i < 10; i++) {
            var item = this._equipArray[i];
            var equipInfo = this.heroModel.heroInfo[this.heroModel.curPos].getPartInfoByPart(i + 1);
            if (this.heroModel.heroInfo[this.heroModel.curPos].equipExist(i + 1) >= 0) {
                item.updateBaseItem(ClientType.EQUIP, equipInfo.good_id, null, equipInfo);
                item.setCarrerIconVisible(false);
                // item.setStrengthLvVisible(false);
                item.setStarLvVisible(false);
            }
            else {
                item.updateBaseItem(ClientType.EQUIP, 0, null, equipInfo);
                item.setStarLvVisible(false);
                item.setItemIcon(ConstEquipIcon[i + 1] + "_png");
            }
        }
    };
    //检测当前强化到哪
    ForgeStrengthView.prototype.checkStrengthPart = function () {
        var _this = this;
        var tempLv = 999999;
        this.heroModel.heroInfo[this.heroModel.curPos].equip_info.forEach(function (value, index, array) {
            if (!_this.forgeModel.curPart && value.part <= 10) {
                _this.forgeModel.curPart = value.part;
                tempLv = value.lv;
            }
            else if (_this.forgeModel.curPart == value.part) {
                tempLv = value.lv;
            }
            else if (tempLv > value.lv && value.part <= 10) {
                _this.forgeModel.curPart = value.part;
                tempLv = value.lv;
            }
        }, this);
    };
    //选中框
    ForgeStrengthView.prototype.setSelect = function () {
        this._partIconArray.forEach(function (value, index, arr) {
            value.visible = false;
        }, this);
        this._partIconArray[this.forgeModel.curPart - 1].visible = true;
        this._partIconLineArray.forEach(function (value, index, arr) {
            value.visible = false;
        }, this);
        this._partIconLineArray[this.forgeModel.curPart - 1].visible = true;
    };
    //更新强化界面
    ForgeStrengthView.prototype.updateStrengthView = function () {
        this.setSelect();
        var equip = this.heroModel.heroInfo[this.heroModel.curPos].getPartInfoByPart(this.forgeModel.curPart);
        var curLevel = equip ? equip.lv : 0;
        // this.lb_left.text = "";
        if (curLevel > 0) {
            var forgeInfo = this.forgeModel.getStrengthByPartLevel(this.forgeModel.curPart, curLevel);
            var attribute = App.ConfigManager.attributeConfig()[forgeInfo.attribute];
            var attrBase = game.EquipModel.getInstance().attributeFilter(attribute);
            var textL = [];
            for (var key in attrBase) {
                if (key == "ac" || key == "mac" || key == "sc") {
                    if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.SOLDIER) {
                        if (key == "ac") {
                            textL.push({ text: attrBase[key] });
                            textL.push({ text: "\n" });
                        }
                    }
                    else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.MAGES) {
                        if (key == "mac") {
                            textL.push({ text: attrBase[key] });
                            textL.push({ text: "\n" });
                        }
                    }
                    else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.TAOIST) {
                        if (key == "sc") {
                            textL.push({ text: attrBase[key] });
                            textL.push({ text: "\n" });
                        }
                    }
                }
                else {
                    textL.push({ text: attrBase[key] });
                    textL.push({ text: "\n" });
                }
            }
            ;
            textL.pop();
            this.lb_left.textFlow = textL;
        }
        else {
            this.lb_left.textFlow = [{ text: "" }];
        }
        this.nextInfo();
    };
    /**
     * 下一级信息
    */
    ForgeStrengthView.prototype.nextInfo = function () {
        var _this = this;
        var equip = this.heroModel.heroInfo[this.heroModel.curPos].getPartInfoByPart(this.forgeModel.curPart);
        var curLevel = equip ? equip.lv : 0;
        var forgeInfo = this.forgeModel.getStrengthByPartLevel(this.forgeModel.curPart, curLevel + 1);
        if (!forgeInfo) {
            return;
        }
        var costInfo = (forgeInfo.consume.substring(1, forgeInfo.consume.length - 1)).split(",");
        var itemInfo = this.backpackModel.getItemByTypeIdUuid(1, costInfo[0]);
        var itemConfig = App.ConfigManager.itemConfig()[costInfo[0]];
        var attribute = App.ConfigManager.attributeConfig()[forgeInfo.attribute];
        var attrBase = game.EquipModel.getInstance().attributeFilter(attribute);
        this._strengthCostId = Number(costInfo[0]);
        this._strengthCostNum = Number(costInfo[1]);
        if (!itemInfo) {
            itemInfo = { num: 0 };
        }
        RES.getResAsync(itemConfig.icon + "_png", function (texture) {
            _this.img_cost.source = texture;
        }, this);
        if (itemInfo.num >= costInfo[1]) {
            this.lb_num.textFlow = [{ text: String(itemInfo.num), style: { textColor: 0x63d72a } }, { text: "/" + costInfo[1], style: { textColor: 0xbfbfbf } }];
        }
        else {
            this.lb_num.textFlow = [{ text: String(itemInfo.num), style: { textColor: 0xb90b0a } }, { text: "/" + costInfo[1], style: { textColor: 0xbfbfbf } }];
        }
        var textL = [];
        var textL0 = [];
        var textR = [];
        for (var key in attrBase) {
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
                }
                else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.MAGES) {
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
                }
                else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.TAOIST) {
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
            }
            else {
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
        ;
        if (textL.length > 0) {
            textL.pop();
            this.lb_left.textFlow = textL;
        }
        textL0.pop();
        textR.pop();
        this.lb_left0.textFlow = textL0;
        this.lb_right.textFlow = textR;
    };
    //更新界面
    ForgeStrengthView.prototype.updateView = function () {
        this.updateEquip();
        this.checkStrengthPart();
        this.updateStrengthView();
    };
    /**
     * 打开窗口
     */
    ForgeStrengthView.prototype.open = function (openParam) {
        if (openParam === void 0) { openParam = null; }
        _super.prototype.open.call(this, openParam);
        App.EventSystem.addEventListener(PanelNotify.FORGE_STRENGTH_EQUIP, this.animationStrength, this);
    };
    /**
     * 清理
     */
    ForgeStrengthView.prototype.clear = function (data) {
        if (data === void 0) { data = null; }
        _super.prototype.clear.call(this, data);
        App.EventSystem.removeEventListener(PanelNotify.FORGE_STRENGTH_EQUIP);
    };
    /**
     * 销毁
     */
    ForgeStrengthView.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    return ForgeStrengthView;
}(BaseChildView));
__reflect(ForgeStrengthView.prototype, "ForgeStrengthView");
//# sourceMappingURL=ForgeStrengthView.js.map
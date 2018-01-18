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
/**
* module : 橙装锻造强化
* author : zrj
*/
var game;
(function (game) {
    var ForgeOrangeView = (function (_super) {
        __extends(ForgeOrangeView, _super);
        function ForgeOrangeView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._equipArray = [];
            _this.heroModel = game.HeroModel.getInstance();
            _this.forgeModel = game.ForgeModel.getInstance();
            _this.skinName = "ForgeOrangeEquipSkin";
            return _this;
        }
        ForgeOrangeView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.initView();
        };
        ForgeOrangeView.prototype.initView = function () {
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
            this.baseItem_left.setItemNameAtt({ top: -25, textColor: 0xff8400 });
            // this.baseItem_right.lb_name.visible = true;
            // this.baseItem_right.lb_name.top = -25;
            // this.baseItem_right.lb_name.textColor = 0xff8400;
            this.baseItem_right.setItemNameVisible(true);
            this.baseItem_right.setItemNameAtt({ top: -25, textColor: 0xff8400 });
            this.initEquip();
            this.updateView(null);
        };
        ForgeOrangeView.prototype.initEquip = function () {
            var _this = this;
            this.img_select = new eui.Image();
            RES.getResAsync("equipping_choose_png", function (texture) {
                _this.img_select.source = texture;
            }, this);
            var _loop_1 = function (i) {
                var item = new customui.BaseItem();
                if (i % 2 != 0) {
                    item.left = 50;
                }
                else {
                    item.right = 50;
                }
                item.y = 54 + (Math.floor((i - 1) / 2) * (item.height + 25));
                //特殊处理衣服和头盔
                if (i == 2) {
                    item.right = undefined;
                    item.left = 50;
                    item.y = 54 + (Math.floor((i + 1 - 1) / 2) * (item.height + 25));
                }
                else if (i == 3) {
                    item.left = undefined;
                    item.right = 50;
                    item.y = 54 + (Math.floor((i - 1 - 1) / 2) * (item.height + 25));
                }
                var equipInfo = this_1.heroModel.heroInfo[this_1.heroModel.curPos].getPartInfoByPart(i);
                if (this_1.heroModel.heroInfo[this_1.heroModel.curPos].equipExist(i) >= 0) {
                    item.updateBaseItem(ClientType.EQUIP, equipInfo.good_id, null, equipInfo);
                    item.setCarrerIconVisible(false);
                    item.setStrengthLvVisible(false);
                }
                else {
                    item.updateBaseItem(ClientType.EQUIP, 0, null, equipInfo);
                    // RES.getResAsync(ConstEquipIcon[i] + "_png", (texture) => {
                    // 	item.img_icon.source = texture;
                    // }, this);
                    item.setItemIcon(ConstEquipIcon[i] + "_png");
                    item.setStrengthLvVisible(false);
                }
                this_1.gp_equip.addChild(item);
                item.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                    _this.forgeModel.curOrangePart = i;
                    _this.updateMiddleView();
                }, this_1);
                this_1._equipArray.push(item);
            };
            var this_1 = this;
            for (var i = 1; i <= 10; i++) {
                _loop_1(i);
            }
            this.forgeModel.curOrangePart = 1;
        };
        //红点检测
        ForgeOrangeView.prototype.checkRedDot = function () {
            var _this = this;
            this.forgeModel.orangeHeroRedDot.forEach(function (value, index, array) {
                _this.headComponent.setRedTips(index, value);
                for (var i = 1; i <= 10; i++) {
                    var show = _this.forgeModel.checkCanOrangeUpByPart(_this.heroModel.curPos, i);
                    if (show) {
                        _this._equipArray[i - 1].showRedTips(null);
                    }
                    else {
                        _this._equipArray[i - 1].hideRedTips();
                    }
                }
            }, this);
        };
        //更新装备信息
        ForgeOrangeView.prototype.updateEquip = function () {
            for (var i = 0; i < 10; i++) {
                var item = this._equipArray[i];
                var equipInfo = this.heroModel.heroInfo[this.heroModel.curPos].getPartInfoByPart(i + 1);
                if (this.heroModel.heroInfo[this.heroModel.curPos].equipExist(i + 1) >= 0) {
                    item.updateBaseItem(ClientType.EQUIP, equipInfo.good_id, null, equipInfo);
                    item.setCarrerIconVisible(false);
                    item.setStarLvVisible(false);
                    item.setStrengthLvVisible(false);
                    item.setItemNameVisible(true);
                    // item.lb_name.text = "";
                }
                else {
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
        };
        //更新中间面板
        ForgeOrangeView.prototype.updateMiddleView = function () {
            if (this.img_select.parent) {
                this.img_select.parent.removeChild(this.img_select);
            }
            // this.img_select.x = this._equipArray[this.forgeModel.curOrangePart - 1].x - 50;
            this.img_select.left = this._equipArray[this.forgeModel.curOrangePart - 1].left - 5;
            this.img_select.right = this._equipArray[this.forgeModel.curOrangePart - 1].right - 5;
            this.img_select.y = this._equipArray[this.forgeModel.curOrangePart - 1].y - 50;
            this._equipArray[this.forgeModel.curOrangePart - 1].parent.addChild(this.img_select);
            this._equipArray[this.forgeModel.curOrangePart - 1].parent.setChildIndex(this.img_select, 0);
            var heroInfo = this.heroModel.heroInfo[this.heroModel.curPos];
            var equipVO = heroInfo.getEquipByPart(this.forgeModel.curOrangePart);
            if (!equipVO) {
                this.gp_middle.visible = false;
                this.lb_tips.visible = true;
                this.lb_tips.text = "该部位没有可升级的橙装";
                return;
            }
            var equipInfo = App.ConfigManager.getEquipById(equipVO.good_id);
            if (!equipInfo || equipInfo.upgrade == 0) {
                this.gp_middle.visible = false;
                this.lb_tips.visible = true;
                this.lb_tips.text = "该部位没有可升级的橙装";
                return;
            }
            else {
                this.gp_middle.visible = true;
                this.lb_tips.visible = false;
            }
            var attribute = App.ConfigManager.getAttributeInfoById(equipInfo.base_att);
            var attrBase = game.EquipModel.getInstance().attributeFilter(attribute);
            var textArray = [];
            for (var key in attrBase) {
                textArray.push({ text: ConstAttribute[key] + ": " }, { text: attrBase[key] });
                textArray.push({ text: "\n" });
            }
            ;
            textArray.pop();
            this.lb_attr.textFlow = textArray;
            //摆放箭头
            // this.gp_arrow.removeChildren();
            var nextInfo = App.ConfigManager.getEquipById(equipInfo.upgrade);
            var attributeNext = App.ConfigManager.getAttributeInfoById(nextInfo.base_att);
            var attrBaseNext = game.EquipModel.getInstance().attributeFilter(attributeNext);
            var textArrayNext = [];
            var count = 0;
            for (var key in attrBaseNext) {
                textArrayNext.push({ text: ConstAttribute[key] + ": " }, { text: attrBaseNext[key] });
                textArrayNext.push({ text: "\n" });
                var tempCount = count;
                // RES.getResAsync("forge_jiantou2_png", (texture) => {
                // 	let img = new eui.Image(texture);
                // 	img.horizontalCenter = 0;
                // 	img.y = 85 + tempCount * 32;
                // 	this.gp_arrow.addChild(img);
                // }, this);
                count++;
            }
            ;
            textArrayNext.pop();
            this.lb_attr_next.textFlow = textArrayNext;
            this.baseItem_left.updateBaseItem(ClientType.EQUIP, equipInfo.id);
            this.baseItem_right.updateBaseItem(ClientType.EQUIP, nextInfo.id);
            this.baseItem_left.setCarrerIconVisible(false);
            this.baseItem_right.setCarrerIconVisible(false);
            //橙装精华
            var itemInfo = game.BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, 11);
            if (!itemInfo) {
                itemInfo = { num: 0 };
            }
            if (itemInfo.num >= equipInfo.consumption) {
                this.lb_cost.textFlow = [{ text: String(itemInfo.num), style: { textColor: 0x63d72a } }, { text: "/" + equipInfo.consumption, style: { textColor: 0xbfbfbf } }];
            }
            else {
                this.lb_cost.textFlow = [{ text: String(itemInfo.num), style: { textColor: 0xb90b0a } }, { text: "/" + equipInfo.consumption, style: { textColor: 0xbfbfbf } }];
            }
        };
        ForgeOrangeView.prototype.updateView = function (data) {
            this.updateEquip();
            this.updateMiddleView();
            this.checkRedDot();
        };
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
        ForgeOrangeView.prototype.showWay = function () {
            // let view = new ItemWay(ClientType.BASE_ITEM, 11);
            // PopUpManager.addPopUp({ obj: view });
            App.GlobalTips.showItemWayTips(ClientType.BASE_ITEM, 11);
        };
        ForgeOrangeView.prototype.sendUpgradeRequest = function () {
            App.Socket.send(15010, { id: this.heroModel.heroInfo[this.heroModel.curPos].id, part: this.forgeModel.curOrangePart });
        };
        /**
         * 打开窗口
         */
        ForgeOrangeView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (openParam) {
                this._lastModuleName = openParam.lastModule;
            }
            if (!this._infoHandle) {
                this._infoHandle = App.EventSystem.addEventListener(PanelNotify.HERO_ON_HERO_SELECT, this.updateView, this);
            }
            App.EventSystem.addEventListener(PanelNotify.FORGE_ORANGE_EQUIP, this.updateView, this);
        };
        /**
         * 关闭窗口
         */
        ForgeOrangeView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        ForgeOrangeView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._infoHandle) {
                App.EventSystem.removeEventListener(PanelNotify.HERO_ON_HERO_SELECT, this._infoHandle);
                this._infoHandle = undefined;
            }
            App.EventSystem.removeEventListener(PanelNotify.FORGE_ORANGE_EQUIP);
        };
        /**
         * 销毁
         */
        ForgeOrangeView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return ForgeOrangeView;
    }(BaseView));
    game.ForgeOrangeView = ForgeOrangeView;
    __reflect(ForgeOrangeView.prototype, "game.ForgeOrangeView");
})(game || (game = {}));
//# sourceMappingURL=ForgeOrangeView.js.map
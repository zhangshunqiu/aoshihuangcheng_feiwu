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
//升星子页面
//author：zrj
var game;
(function (game) {
    var ForgeStarView = (function (_super) {
        __extends(ForgeStarView, _super);
        function ForgeStarView(skinName) {
            var _this = _super.call(this, skinName) || this;
            _this.backpackModel = game.BackpackModel.getInstance();
            _this.heroModel = game.HeroModel.getInstance();
            _this.forgeModel = game.ForgeModel.getInstance();
            _this._handleId = 0;
            _this._equipStarArray = []; //升星数组
            _this.skinName = "ForgeStarSkin";
            return _this;
        }
        ForgeStarView.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            //升星
            this.btn_upStar.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                var info = _this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, _this._starCostId);
                if (!info) {
                    info = { num: 0 };
                }
                if (info.num >= _this._starCostNum) {
                    App.Socket.send(15006, { id: _this.heroModel.heroInfo[_this.heroModel.curPos].id, part: _this.forgeModel.curStarPart });
                }
                else {
                    App.GlobalTips.showErrCodeTips(15001);
                    // App.MsgUtils.addMidMsg("所需材料不足");
                }
            }, this);
            //获取道具 升星用
            this.lb_starGet.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                // let view = new ItemWay(ClientType.BASE_ITEM, this._starCostId);
                // PopUpManager.addPopUp({ obj: view });
                App.GlobalTips.showItemWayTips(ClientType.BASE_ITEM, _this._starCostId);
            }, this);
            //套装属性
            this.img_attr.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                // let view = new ForgeStarInfo(this.heroModel.heroInfo[this.heroModel.curPos].id);
                // PopUpManager.addPopUp({ obj: view });
                App.WinManager.openWin(WinName.POP_FORGE_STAR);
            }, this);
            this.lb_starGet.textFlow = [{ text: "获得道具", style: { underline: true } }];
            var _loop_1 = function (i) {
                var item = new customui.BaseItem();
                item.width = item.height = 90;
                if (i % 2 != 0) {
                    item.left = 70;
                }
                else {
                    item.right = 70;
                }
                item.y = 34 + (Math.floor((i - 1) / 2) * (item.height + 17));
                //特殊处理衣服和头盔
                if (i == 2) {
                    item.right = undefined;
                    item.left = 70;
                    item.y = 34 + (Math.floor((i + 1 - 1) / 2) * (item.height + 17));
                }
                else if (i == 3) {
                    item.left = undefined;
                    item.right = 70;
                    item.y = 34 + (Math.floor((i - 1 - 1) / 2) * (item.height + 17));
                }
                var equipInfo = this_1.heroModel.heroInfo[this_1.heroModel.curPos].getPartInfoByPart(i);
                if (this_1.heroModel.heroInfo[this_1.heroModel.curPos].equipExist(i) >= 0) {
                    item.updateBaseItem(ClientType.EQUIP, equipInfo.good_id, null, equipInfo);
                    item.setStrengthLvVisible(false);
                    item.setCarrerIconVisible(false);
                }
                else {
                    item.updateBaseItem(ClientType.EQUIP, 0, null, equipInfo);
                    // RES.getResAsync(ConstEquipIcon[i] + "_png", (texture) => {
                    // 	item.img_icon.source = texture;
                    // }, this);
                    item.setItemIcon(ConstEquipIcon[i] + "_png");
                    item.setStrengthLvVisible(false);
                }
                this_1.gp_starEquip.addChild(item);
                item.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                    // this.forgeModel.curStarPart = i;
                    // this.updateStarView();
                    if (i == _this.forgeModel.curStarPart) {
                        return;
                    }
                    _this.forgeModel.curStarPart = i;
                    ;
                    // this.setSelect();
                    // this.moveAnimate(i);
                    _this.updateStarView();
                }, this_1);
                this_1._equipStarArray.push(item);
            };
            var this_1 = this;
            //升星装备初始化
            for (var i = 1; i <= 10; i++) {
                _loop_1(i);
            }
            this.forgeModel.curStarPart = 1;
        };
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
        ForgeStarView.prototype.updateStarView = function () {
            var _this = this;
            this._equipStarArray.forEach(function (value, index, arr) {
                value.setSelect(false);
            }, this);
            this._equipStarArray[this.forgeModel.curStarPart - 1].setSelect(true);
            var heroInfo = this.heroModel.heroInfo[this.heroModel.curPos];
            var pos = heroInfo.equipExist(this.forgeModel.curStarPart);
            var equip = heroInfo.getPartInfoByPart(this.forgeModel.curStarPart);
            var curLevel = equip ? equip.star : 0;
            if (curLevel > 0) {
                var forgeInfo2 = this.forgeModel.getStarByPartLevel(this.forgeModel.curStarPart, curLevel);
                var attribute2 = App.ConfigManager.attributeConfig()[forgeInfo2.attribute];
                var textL2 = [];
                textL2.push({ text: String(attribute2["attribute_rate"] / 100) + "%" });
                this.lb_starLeft.textFlow = textL2;
            }
            else {
                this.lb_starLeft.textFlow = [{ text: "" }];
            }
            var forgeInfo = this.forgeModel.getStarByPartLevel(this.forgeModel.curStarPart, curLevel + 1);
            var maxLevel = false;
            if (!forgeInfo) {
                // this.showStarMax(curLevel);
                maxLevel = true;
                forgeInfo = this.forgeModel.getStarByPartLevel(this.forgeModel.curStarPart, curLevel);
                this.gp_attr.visible = false;
                this.lb_total.visible = true;
                // return;
            }
            else {
                this.gp_attr.visible = true;
                this.lb_total.visible = false;
            }
            var costInfo = (forgeInfo.consume.substring(1, forgeInfo.consume.length - 1)).split(",");
            var itemInfo = this.backpackModel.getItemByTypeIdUuid(1, costInfo[0]);
            var itemConfig = App.ConfigManager.itemConfig()[costInfo[0]];
            var attribute = App.ConfigManager.attributeConfig()[forgeInfo.attribute];
            this._starCostId = Number(costInfo[0]);
            this._starCostNum = Number(costInfo[1]);
            if (!itemInfo) {
                itemInfo = { num: 0 };
            }
            if (maxLevel) {
                costInfo[1] = 0;
            }
            RES.getResAsync(itemConfig.icon + "_png", function (texture) {
                _this.img_starCost.source = texture;
                _this.img_starCostIcon.source = texture;
            }, this);
            if (itemInfo.num >= costInfo[1]) {
                this.lb_starNum.textFlow = [{ text: String(itemInfo.num), style: { textColor: 0x63d72a } }, { text: "/" + costInfo[1], style: { textColor: 0xbfbfbf } }];
            }
            else {
                this.lb_starNum.textFlow = [{ text: String(itemInfo.num), style: { textColor: 0xb90b0a } }, { text: "/" + costInfo[1], style: { textColor: 0xbfbfbf } }];
            }
            var textL = [];
            var textR = [];
            textR.push({ text: attribute["attribute_rate"] / 100 + "%" });
            if (this.lb_starLeft.text == "") {
                textL.push({ text: "0%" });
                this.lb_starLeft.textFlow = textL;
            }
            this.lb_starRight.textFlow = textR;
            this.lb_total.textFlow = textR;
            var equipInfo = this.heroModel.heroInfo[this.heroModel.curPos].getPartInfoByPart(this.forgeModel.curStarPart);
            if (pos >= 0) {
                var equipInfo2 = App.ConfigManager.equipConfig()[heroInfo.equip_info[pos].good_id];
                this.baseItem.updateBaseItem(ClientType.EQUIP, heroInfo.equip_info[pos].good_id, null, equipInfo);
                this.baseItem.setStrengthLvVisible(false);
                this.baseItem.setCarrerIconVisible(false);
            }
            else {
                this.baseItem.updateBaseItem(ClientType.EQUIP, 0, null, equipInfo);
                this.baseItem.setStrengthLvVisible(false);
                this.baseItem.updateBaseItem(ClientType.EQUIP, 0);
                this.baseItem.setItemIcon(ConstEquipIcon[this.forgeModel.curStarPart] + "_png");
            }
            if (pos >= 0) {
                var equipInfo2 = App.ConfigManager.equipConfig()[heroInfo.equip_info[pos].good_id];
                this.baseItem_result.updateBaseItem(ClientType.EQUIP, heroInfo.equip_info[pos].good_id, null, equipInfo);
                this.baseItem_result.setStrengthLvVisible(false);
                this.baseItem_result.setCarrerIconVisible(false);
            }
            else {
                this.baseItem_result.updateBaseItem(ClientType.EQUIP, 0, null, equipInfo);
                this.baseItem_result.setStrengthLvVisible(false);
                this.baseItem_result.updateBaseItem(ClientType.EQUIP, 0);
                this.baseItem_result.setItemIcon(ConstEquipIcon[this.forgeModel.curStarPart] + "_png");
            }
            this.lb_star.text = "星级+" + curLevel;
        };
        ForgeStarView.prototype.checkRedDot = function (heroPos) {
            for (var i = 1; i <= 10; i++) {
                var show = this.forgeModel.checkCanStarupByPart(heroPos, i);
                if (show) {
                    this._equipStarArray[i - 1].showRedTips(null);
                }
                else {
                    this._equipStarArray[i - 1].hideRedTips();
                }
            }
        };
        ForgeStarView.prototype.updateView = function () {
            this.updateEquip();
            this.updateStarView();
        };
        //更新装备信息
        ForgeStarView.prototype.updateEquip = function () {
            for (var i = 0; i < 10; i++) {
                var item2 = this._equipStarArray[i];
                var equipInfo = this.heroModel.heroInfo[this.heroModel.curPos].getPartInfoByPart(i + 1);
                if (this.heroModel.heroInfo[this.heroModel.curPos].equipExist(i + 1) >= 0) {
                    item2.updateBaseItem(ClientType.EQUIP, equipInfo.good_id, null, equipInfo);
                    item2.setCarrerIconVisible(false);
                    item2.setStrengthLvVisible(false);
                }
                else {
                    item2.updateBaseItem(ClientType.EQUIP, 0, null, equipInfo);
                    item2.setStrengthLvVisible(false);
                    item2.setItemIcon(ConstEquipIcon[i + 1] + "_png");
                }
            }
        };
        //升星动画
        ForgeStarView.prototype.animationStar = function () {
            var _this = this;
            // this.lb_starLeft.x = 25;
            // this.lb_starRight.x = 175;
            egret.Tween.get(this.lb_starLeft).to({ x: 185, alpha: 0 }, 200, egret.Ease.sineOut).call(function () {
                _this.lb_starLeft.x = 248;
                _this.lb_starLeft.alpha = 1;
            }, this);
            egret.Tween.get(this.lb_starRight).to({ x: 335, alpha: 0 }, 200, egret.Ease.sineOut).call(function () {
                _this.lb_starRight.x = 398;
                _this.lb_starRight.alpha = 1;
            }, this);
            var mc1 = new EffectMovieClip();
            mc1.x = 370;
            mc1.y = 440;
            mc1.playMCKey("effzzxt", "", 1, null, null, function () {
                if (mc1.parent) {
                    mc1.parent.removeChild(mc1);
                }
                mc1.destroy();
                var mc = new EffectMovieClip();
                mc.x = _this.width / 2;
                mc.y = _this.height / 3;
                mc.playMCKey("sxcg", "", 1, null, null, function () {
                    if (mc.parent) {
                        mc.parent.removeChild(mc);
                    }
                    mc.destroy();
                }, _this);
                _this.addChild(mc);
            }, this);
            this.addChild(mc1);
        };
        /**
         * 打开窗口
         */
        ForgeStarView.prototype.open = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.open.call(this, openParam);
            if (!this._handleId) {
                this._handleId = App.EventSystem.addEventListener(PanelNotify.HERO_ON_HERO_SELECT, this.updateView, this);
            }
            App.EventSystem.addEventListener(PanelNotify.FORGE_STAR_EQUIP, this.animationStar, this);
        };
        /**
         * 清理
         */
        ForgeStarView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._handleId) {
                App.EventSystem.removeEventListener(PanelNotify.HERO_ON_HERO_SELECT, this._handleId);
                this._handleId = undefined;
            }
            App.EventSystem.removeEventListener(PanelNotify.FORGE_STAR_EQUIP);
        };
        /**
         * 销毁
         */
        ForgeStarView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return ForgeStarView;
    }(BaseChildView));
    game.ForgeStarView = ForgeStarView;
    __reflect(ForgeStarView.prototype, "game.ForgeStarView");
})(game || (game = {}));
//# sourceMappingURL=ForgeStarView.js.map
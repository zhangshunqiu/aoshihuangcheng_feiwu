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
 * module : 宝石模块子视图
 * author : zrj
 */
var game;
(function (game) {
    /**
     * 宝石属性
    */
    var JewelTipView = (function (_super) {
        __extends(JewelTipView, _super);
        function JewelTipView(data) {
            var _this = _super.call(this, data) || this;
            _this.heroModel = game.HeroModel.getInstance();
            _this.skinName = "JewelTipSkin";
            return _this;
            // this._data = data;
        }
        JewelTipView.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            // this.initView();
            this.btn_upgrade.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.Socket.send(15009, { id: _this._data.heroId, part: _this._data.part, hole: _this._data.hole });
            }, this);
        };
        JewelTipView.prototype.initView = function () {
            // RES.getResAsync(ConstJewelIcon[this._data.hole] + "_png", (texture) => {
            //     this.baseItem.img_icon.source = texture;
            // }, this);
            this.baseItem.setItemIcon(ConstJewelIcon[this._data.hole] + "_png");
            if (this._data.id) {
                var jewelInfo = App.ConfigManager.itemConfig()[this._data.id];
                var numInfo = game.BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, this._data.id);
                if (numInfo) {
                    var maxLevel = App.ConfigManager.getConstConfigByType("JEWEL_LEVEL_MAX").value;
                    var baseInfo = App.ConfigManager.getItemInfoById(this._data.id);
                    if (numInfo.num >= 2 && baseInfo.limit_lv < maxLevel) {
                        this.btn_upgrade.visible = true;
                    }
                    else {
                        this.btn_upgrade.visible = false;
                    }
                }
                else {
                    numInfo = { num: 0 };
                    this.btn_upgrade.visible = false;
                }
                this.lb_name.text = jewelInfo.name;
                this.lb_level.textFlow = [{ text: "等    级：" }, { text: String(jewelInfo.limit_lv), style: { textColor: 0xe19b2d } }];
                this.lb_num.textFlow = [{ text: "背包数量：" }, { text: String(numInfo.num), style: { textColor: 0x75fffd } }];
                ;
                this.lb_desc.text = jewelInfo.des;
            }
            else {
                this.btn_upgrade.visible = false;
                this.lb_name.text = ConstJewelName[this._data.hole];
                this.lb_level.textFlow = [{ text: "等    级：" }, { text: String(0), style: { textColor: 0xe19b2d } }];
                this.lb_num.textFlow = [{ text: "背包数量：" }, { text: String(0), style: { textColor: 0x75fffd } }];
                ;
                this.lb_desc.text = "";
            }
        };
        JewelTipView.prototype.handleUpgrade = function () {
            // PopUpManager.removePopUp(this);
            App.WinManager.closeWin(WinName.POP_JEWEL_TIP);
        };
        /**
         * 打开窗口
         */
        JewelTipView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this._data = openParam.data;
            this.initView();
            this._handleId = App.EventSystem.addEventListener(PanelNotify.JEWEL_UPDATE_VIEW, this.handleUpgrade, this);
        };
        /**
         * 关闭窗口
         */
        JewelTipView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        JewelTipView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._handleId) {
                App.EventSystem.removeEventListener(PanelNotify.JEWEL_UPDATE_VIEW, this._handleId);
                this._handleId = undefined;
            }
        };
        /**
         * 销毁
         */
        JewelTipView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return JewelTipView;
    }(BaseView));
    game.JewelTipView = JewelTipView;
    __reflect(JewelTipView.prototype, "game.JewelTipView");
    /**
     * 宝石大师属性
    */
    var JewelMasterView = (function (_super) {
        __extends(JewelMasterView, _super);
        function JewelMasterView(data) {
            var _this = _super.call(this, data) || this;
            _this.heroModel = game.HeroModel.getInstance();
            _this.skinName = "JewelMasterSkin";
            return _this;
            // this._data = data;
        }
        JewelMasterView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            // this.initView();
        };
        JewelMasterView.prototype.initView = function () {
            var _this = this;
            var jewelInfo = this.heroModel.heroInfo[this._data.pos].jewelDic;
            var total = 0;
            for (var i = 0; i < jewelInfo.length; i++) {
                for (var j in jewelInfo[i].sotne_list) {
                    var info = jewelInfo[i].sotne_list[j];
                    if (info.stone_id) {
                        var itemInfo = App.ConfigManager.itemConfig()[info.stone_id];
                        total += itemInfo.limit_lv;
                    }
                }
            }
            var level = Math.floor(total / 5) * 5;
            if (level > 0) {
                var attrInfo2 = App.ConfigManager.getJewelAllInfoByLevel(level);
                var attribute2 = App.ConfigManager.getJewelInfoById(attrInfo2.attribute_jewel);
                var attrBase2 = game.EquipModel.getInstance().attributeFilter(attribute2);
                var text1 = [];
                var count1 = 1;
                for (var key in attrBase2) {
                    var label = new eui.Label();
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
                        }
                        else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.MAGES) {
                            if (key == "mac") {
                                this.gp_main.addChild(label);
                                count1++;
                            }
                        }
                        else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.TAOIST) {
                            if (key == "sc") {
                                this.gp_main.addChild(label);
                                count1++;
                            }
                        }
                    }
                    else {
                        this.gp_main.addChild(label);
                        count1++;
                    }
                }
                ;
                this.lb_attr.textFlow = text1;
            }
            else {
                this.lb_attr.text = "未激活";
                this.lb_attr.visible = true;
                RES.getResAsync("forge_txt_weijihuo_png", function (texture) {
                    _this.img_status.source = texture;
                }, this);
            }
            //下一级
            var attrInfo = App.ConfigManager.getJewelAllInfoByLevel(level + 5);
            if (!attrInfo) {
                this.lb_attr1.visible = true;
                this.lb_attr1.text = "已满级";
                return;
            }
            var attribute = App.ConfigManager.getJewelInfoById(attrInfo.attribute_jewel);
            var attrBase = game.EquipModel.getInstance().attributeFilter(attribute);
            var text = [];
            var count = 1;
            for (var key in attrBase) {
                var label = new eui.Label();
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
                    }
                    else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.MAGES) {
                        if (key == "mac") {
                            this.gp_main.addChild(label);
                            count++;
                        }
                    }
                    else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.TAOIST) {
                        if (key == "sc") {
                            this.gp_main.addChild(label);
                            count++;
                        }
                    }
                }
                else {
                    this.gp_main.addChild(label);
                    count++;
                }
            }
            ;
            this.bmlb_level.text = String(level);
            this.lb_attr1.textFlow = text;
            this.lb_cur.textFlow = [{ text: "当前效果：全身宝石等级" }, { text: "+" + level, style: { textColor: 0x21c42b } }];
            // this.lb_cur1.textFlow = [{ text: "下级效果：全身宝石等级" }, { text: "+" + (level + 5), style: { textColor: 0x21c42b } }];
            this.lb_cur1.text = "下级效果：全身宝石等级+" + (level + 5);
            this.lb_cur1.textColor = 0x626262;
        };
        /**
         * 打开窗口
         */
        JewelMasterView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this._data = openParam.data;
            this.initView();
        };
        /**
         * 关闭窗口
         */
        JewelMasterView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        JewelMasterView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
        };
        /**
         * 销毁
         */
        JewelMasterView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return JewelMasterView;
    }(BaseView));
    game.JewelMasterView = JewelMasterView;
    __reflect(JewelMasterView.prototype, "game.JewelMasterView");
    /**
     * 宝石超级属性
    */
    var JewelSuperView = (function (_super) {
        __extends(JewelSuperView, _super);
        function JewelSuperView(data) {
            var _this = _super.call(this, data) || this;
            _this.heroModel = game.HeroModel.getInstance();
            _this.skinName = "JewelSuperSkin";
            return _this;
            // this._data = data;
        }
        JewelSuperView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            // this.initView();
        };
        JewelSuperView.prototype.initView = function () {
            var jewelInfo = this.heroModel.heroInfo[this._data.pos].jewelDic;
            var value = [0, 0, 0, 0];
            var totalValue = [0, 0, 0, 0];
            for (var i = 0; i < jewelInfo.length; i++) {
                for (var j in jewelInfo[i].sotne_list) {
                    var info = jewelInfo[i].sotne_list[j];
                    if (info.stone_id) {
                        var itemInfo = App.ConfigManager.itemConfig()[info.stone_id];
                        var attribute = App.ConfigManager.getJewelInfoById(itemInfo.attribute_jewel); //宝石属性
                        if (itemInfo.sub_type == JewelType.ATTACK) {
                            if (this.heroModel.heroInfo[this._data.pos].job == CareerType.SOLDIER) {
                                totalValue[0] += attribute["ac"];
                            }
                            else if (this.heroModel.heroInfo[this._data.pos].job == CareerType.MAGES) {
                                totalValue[0] += attribute["mac"];
                            }
                            else if (this.heroModel.heroInfo[this._data.pos].job == CareerType.TAOIST) {
                                totalValue[0] += attribute["sc"];
                            }
                        }
                        else if (itemInfo.sub_type == JewelType.LIFE) {
                            totalValue[1] += attribute["hp"];
                        }
                        else if (itemInfo.sub_type == JewelType.DEFENCE) {
                            totalValue[2] += attribute["def"];
                        }
                        else if (itemInfo.sub_type == JewelType.MAGIC) {
                            totalValue[3] += attribute["sdef"];
                        }
                        value[itemInfo.sub_type - 1] += itemInfo.super_attribute;
                    }
                }
            }
            //全身属性
            var total = 0;
            for (var i = 0; i < jewelInfo.length; i++) {
                for (var j in jewelInfo[i].sotne_list) {
                    var info = jewelInfo[i].sotne_list[j];
                    if (info.stone_id) {
                        var itemInfo = App.ConfigManager.itemConfig()[info.stone_id];
                        total += itemInfo.limit_lv;
                    }
                }
            }
            var level = Math.floor(total / 5) * 5;
            if (level > 0) {
                var attrInfo2 = App.ConfigManager.getJewelAllInfoByLevel(level);
                var attribute2 = App.ConfigManager.getJewelInfoById(attrInfo2.attribute_jewel);
                var attrBase2 = game.EquipModel.getInstance().attributeFilter(attribute2);
                var text1_1 = [];
                for (var key in attrBase2) {
                    if (key == "ac" || key == "mac" || key == "sc") {
                        if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.SOLDIER) {
                            if (key == "ac") {
                                totalValue[0] += attrBase2["ac"];
                            }
                        }
                        else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.MAGES) {
                            if (key == "mac") {
                                totalValue[0] += attrBase2["ac"];
                            }
                        }
                        else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.TAOIST) {
                            if (key == "sc") {
                                totalValue[0] += attrBase2["ac"];
                            }
                        }
                    }
                    else {
                        if (key == "hp") {
                            totalValue[1] += attrBase2["hp"];
                        }
                        else if (key == "def") {
                            totalValue[2] += attrBase2["def"];
                        }
                        else if (key == "sdef") {
                            totalValue[3] += attrBase2["sdef"];
                        }
                    }
                }
                ;
            }
            else {
            }
            var text1 = [];
            var text2 = [];
            for (var i = 0; i < 4; i++) {
                text1.push({ text: ConstJewelName[i + 1] + "+" + value[i] / 100 + "%" + "\n" });
                text2.push({ text: ConstJewelName[i + 1] + "+" + totalValue[i] + "(+" + Math.floor(totalValue[i] * value[i] / 10000) + ")" + "\n" });
            }
            this.lb_attr.textFlow = text1;
            this.lb_attr1.textFlow = text2;
        };
        /**
         * 打开窗口
         */
        JewelSuperView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this._data = openParam.data;
            this.initView();
        };
        /**
         * 关闭窗口
         */
        JewelSuperView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        JewelSuperView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
        };
        /**
         * 销毁
         */
        JewelSuperView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return JewelSuperView;
    }(BaseView));
    game.JewelSuperView = JewelSuperView;
    __reflect(JewelSuperView.prototype, "game.JewelSuperView");
})(game || (game = {}));
//# sourceMappingURL=JewelSubView.js.map
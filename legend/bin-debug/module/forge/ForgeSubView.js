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
 * module : 锻造模块子视图
 * author : zrj
*/
var game;
(function (game) {
    //锻造装备信息
    var ForgeEquipInfo = (function (_super) {
        __extends(ForgeEquipInfo, _super);
        function ForgeEquipInfo(config) {
            var _this = _super.call(this, config) || this;
            _this.heroModel = game.HeroModel.getInstance();
            _this.forgeModel = game.ForgeModel.getInstance();
            _this.skinName = "ForgeEquipSkin";
            return _this;
            // this._id = id;
            // this._part = part;
        }
        ForgeEquipInfo.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
        };
        ForgeEquipInfo.prototype.initView = function () {
            var equip = this.heroModel.heroInfo[this.heroModel.curPos].getPartInfoByPart(this._part);
            var curLevel = equip ? equip.lv : 0;
            // this.lb_left.text = "";
            if (curLevel > 0) {
                var forgeInfo2 = this.forgeModel.getStrengthByPartLevel(this._part, curLevel);
                var attribute2 = App.ConfigManager.attributeConfig()[forgeInfo2.attribute];
                var attrBase2 = game.EquipModel.getInstance().attributeFilter(attribute2);
                var textL2 = [];
                for (var key in attrBase2) {
                    if (key == "ac" || key == "mac" || key == "sc") {
                        if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.SOLDIER) {
                            if (key == "ac") {
                                textL2.push({ text: ConstAttribute[key] + "：" }, { text: attrBase2[key] });
                                textL2.push({ text: "\n" });
                            }
                        }
                        else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.MAGES) {
                            if (key == "mac") {
                                textL2.push({ text: ConstAttribute[key] + "：" }, { text: attrBase2[key] });
                                textL2.push({ text: "\n" });
                            }
                        }
                        else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.TAOIST) {
                            if (key == "sc") {
                                textL2.push({ text: ConstAttribute[key] + "：" }, { text: attrBase2[key] });
                                textL2.push({ text: "\n" });
                            }
                        }
                    }
                    else {
                        textL2.push({ text: ConstAttribute[key] + "：" }, { text: attrBase2[key] });
                        textL2.push({ text: "\n" });
                    }
                }
                ;
                this.lb_left.textFlow = textL2;
            }
            else {
                this.lb_left.textFlow = [{ text: "" }];
            }
            var forgeInfo = this.forgeModel.getStrengthByPartLevel(this._part, curLevel + 1);
            var attribute = App.ConfigManager.attributeConfig()[forgeInfo.attribute];
            var attrBase = game.EquipModel.getInstance().attributeFilter(attribute);
            var textL = [];
            var textR = [];
            for (var key in attrBase) {
                if (key == "ac" || key == "mac" || key == "sc") {
                    if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.SOLDIER) {
                        if (key == "ac") {
                            textR.push({ text: ConstAttribute[key] + "：" + attrBase[key] });
                            textR.push({ text: "\n" });
                            if (this.lb_left.text == "") {
                                textL.push({ text: ConstAttribute[key] + "：0\n" });
                                this.lb_left.textFlow = textL;
                            }
                        }
                    }
                    else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.MAGES) {
                        if (key == "mac") {
                            textR.push({ text: ConstAttribute[key] + "：" + attrBase[key] });
                            textR.push({ text: "\n" });
                            if (this.lb_left.text == "") {
                                textL.push({ text: ConstAttribute[key] + "：0\n" });
                                this.lb_left.textFlow = textL;
                            }
                        }
                    }
                    else if (this.heroModel.heroInfo[this.heroModel.curPos].job == CareerType.TAOIST) {
                        if (key == "sc") {
                            textR.push({ text: ConstAttribute[key] + "：" + attrBase[key] });
                            textR.push({ text: "\n" });
                            if (this.lb_left.text == "") {
                                textL.push({ text: ConstAttribute[key] + "：0\n" });
                                this.lb_left.textFlow = textL;
                            }
                        }
                    }
                }
                else {
                    textR.push({ text: ConstAttribute[key] + "：" + attrBase[key] });
                    textR.push({ text: "\n" });
                    if (this.lb_left.text == "") {
                        textL.push({ text: ConstAttribute[key] + "：0\n" });
                        this.lb_left.textFlow = textL;
                    }
                }
            }
            ;
            this.lb_right.textFlow = textR;
            this.lb_part.text = ConstEquipType[game.EquipModel.getInstance().getTypeByPos(this._part)];
            this.lb_career.text = ConstCareer[this.heroModel.heroInfo[this.heroModel.curPos].job];
            this.lb_level.text = curLevel;
            if (this.heroModel.heroInfo[this.heroModel.curPos].equipExist(this._part) >= 0) {
                var equipInfo = this.heroModel.heroInfo[this.heroModel.curPos].getPartInfoByPart(this._part);
                this.baseItem.updateBaseItem(ClientType.EQUIP, equipInfo.good_id);
                this.baseItem.setCarrerIconVisible(false);
            }
            else {
                // RES.getResAsync("common_default_png", (texture) => {
                // 	this.baseItem.img_frame.source = texture;
                // }, this);
                // RES.getResAsync(ConstEquipIcon[this._part] + "_png", (texture) => {
                // 	this.baseItem.img_icon.source = texture;
                // }, this);
                this.baseItem.updateBaseItem(ClientType.EQUIP, 0);
                this.baseItem.setItemIcon(ConstEquipIcon[this._part] + "_png");
            }
        };
        /**
         * 打开窗口
         */
        ForgeEquipInfo.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this._id = openParam.id;
            this._part = openParam.part;
            this.initView();
        };
        /**
         * 关闭窗口
         */
        ForgeEquipInfo.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        ForgeEquipInfo.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
        };
        /**
         * 销毁
         */
        ForgeEquipInfo.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return ForgeEquipInfo;
    }(BaseView));
    game.ForgeEquipInfo = ForgeEquipInfo;
    __reflect(ForgeEquipInfo.prototype, "game.ForgeEquipInfo");
    //锻造星级信息
    var ForgeStarInfo = (function (_super) {
        __extends(ForgeStarInfo, _super);
        function ForgeStarInfo(config) {
            var _this = _super.call(this, config) || this;
            _this.heroModel = game.HeroModel.getInstance();
            _this.forgeModel = game.ForgeModel.getInstance();
            _this.skinName = "ForgeStarInfoSkin";
            return _this;
            // this._id = id;
        }
        ForgeStarInfo.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            var heroInfo = this.heroModel.heroInfo[this.heroModel.curPos];
            var level = null;
            heroInfo.equip_info.forEach(function (value, index, array) {
                if (level == null && value.part <= 10) {
                    level = value.star;
                }
                else if (level > value.star && value.part <= 10) {
                    level = value.star;
                }
            }, this);
            if (level > 0) {
                var forgeInfo2 = this.forgeModel.getStarByPartLevel("", level);
                var attribute2 = App.ConfigManager.attributeConfig()[forgeInfo2.all_star];
                var attrBase2 = game.EquipModel.getInstance().attributeFilter(attribute2);
                // this.lb_attr1.text = "全身属性+" +attribute2["attribute_rate"] / 100 + "%";
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
                this.lb_attr1.textFlow = text1;
            }
            else {
                this.lb_attr1.text = "未激活";
                this.lb_attr1.visible = true;
                RES.getResAsync("forge_txt_weijihuo_png", function (texture) {
                    _this.img_status.source = texture;
                }, this);
            }
            this.bmlb_star.text = String(level);
            this.lb_cur1.textFlow = [{ text: "当前效果：全身升星" }, { text: "+" + level, style: { textColor: 0x21c42b } }];
            //下一级
            var forgeInfo = this.forgeModel.getStarByPartLevel("", level + 1);
            if (!forgeInfo) {
                this.lb_attr2.textFlow = [];
                this.lb_cur2.text = "下级效果：已满级";
                return;
            }
            var attribute = App.ConfigManager.attributeConfig()[forgeInfo.all_star];
            var attrBase = game.EquipModel.getInstance().attributeFilter(attribute);
            var text = [];
            var count = 1;
            for (var key in attrBase) {
                var label = new eui.Label();
                label.size = 24;
                // label.textColor = 0xbfbfbf;
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
            this.lb_attr2.textFlow = text;
            // this.lb_attr2.text = "全身属性+" +attribute["attribute_rate"] / 100 + "%";
            // this.lb_cur2.textFlow = [{ text: "下级效果：全身升星" }, { text: "+" + (level + 1), style: { textColor: 0x21c42b } }];
            this.lb_cur2.text = "下级效果：全身升星+" + (level + 1);
            this.lb_cur2.textColor = 0x626262;
        };
        /**
         * 打开窗口
         */
        ForgeStarInfo.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
        };
        /**
         * 关闭窗口
         */
        ForgeStarInfo.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        ForgeStarInfo.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
        };
        /**
         * 销毁
         */
        ForgeStarInfo.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return ForgeStarInfo;
    }(BaseView));
    game.ForgeStarInfo = ForgeStarInfo;
    __reflect(ForgeStarInfo.prototype, "game.ForgeStarInfo");
})(game || (game = {}));
//# sourceMappingURL=ForgeSubView.js.map
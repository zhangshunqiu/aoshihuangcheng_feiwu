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
 *  module : 装备视图
 * author ： zrj
*/
var game;
(function (game) {
    var EquipView = (function (_super) {
        __extends(EquipView, _super);
        function EquipView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this.offset = 0;
            _this.type = 0;
            _this.id = 0;
            _this.uuid = 0;
            _this.part = 0;
            _this.info = {}; //服务端数据
            _this.baseInfo = {};
            _this.heroModel = game.HeroModel.getInstance();
            _this.forgeModel = game.ForgeModel.getInstance();
            return _this;
        }
        EquipView.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            this.btn_change.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                App.WinManager.closeWin(WinName.EQUIP);
                // let view = new EquipSelect(this.baseInfo.limit_career, this.part, this.baseInfo.sex);
                // PopUpManager.addPopUp({ obj: view, effectType: 0 });
                App.WinManager.openWin(WinName.POP_EQUIP_SELECT, { career: _this.baseInfo.limit_career, type: _this.part, sex: _this.baseInfo.sex });
            }, this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                App.WinManager.closeWin(WinName.EQUIP);
            }, this);
            this.btn_show.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                //App.WinManager.openWin(WinName.CHAT,{show_id:this.id}); //此功能先不做了
            }, this);
            this.initView();
        };
        EquipView.prototype.initView = function () {
        };
        EquipView.prototype.updateView = function () {
            if (!this.baseInfo) {
                return;
            }
            if (!this.info) {
                this.updateBaseView();
                return;
            }
            //显示服务端数据
            var info = this.baseInfo;
            var attribute = App.ConfigManager.getAttributeInfoById(info.base_att);
            // let attrBase = EquipModel.getInstance().attributeFilter(attribute);
            var attrBase = this.info.equip.base;
            this.lb_name.text = info.name;
            this.lb_name.textColor = ConstTextColor[info.quality];
            this.lb_cap.text = this.info.equip.score;
            this.bmlb_fightcap.text = this.info.equip.score;
            this.baseItem.updateBaseItem(ClientType.EQUIP, info.id);
            this.lb_level.textFlow = [{ text: "需求等级：", style: { textColor: 0xf5d98f } }, { text: String(info.limit_lvl), style: { textColor: 0xd8cecc } }];
            this.lb_part.textFlow = [{ text: "部位：", style: { textColor: 0xbfb294 } }, { text: ConstEquipType[info.sub_type], style: { textColor: 0xecc176 } }];
            this.lb_career.textFlow = [{ text: "职位：", style: { textColor: 0xbfb294 } }, { text: ConstCareer[info.limit_career], style: { textColor: 0xecc176 } }];
            this.lb_base.lineSpacing = 2;
            var textArray = [];
            for (var key in attrBase) {
                var myKey = ConstAttributeArray[attrBase[key].key];
                textArray.push({ text: ConstAttributeTwo[myKey] + ": ", style: { textColor: 0xbfb294 } }, { text: attrBase[key].value, style: { textColor: 0xbfb294 } }, { text: " + " + attrBase[key].add_value + "\n", style: { textColor: 0x00f828 } });
            }
            ;
            this.lb_base.textFlow = textArray;
            this.offset = this.gp_base.y + this.gp_base.height;
            if (textArray.length > 12) {
                this.height += (textArray.length - 12) / 3 * 24;
            }
            var equip = this.heroModel.heroInfo[this.heroModel.curPos].getPartInfoByPart(this.part);
            if (equip && equip.lv) {
                this.gp_strength.visible = true;
                this.gp_strength.y = this.offset;
                var textArrayStrength = [];
                var forgeInfo = this.forgeModel.getStrengthByPartLevel(this.part, equip.lv);
                var attributeStrength = App.ConfigManager.attributeConfig()[forgeInfo.attribute];
                var attrBaseStr = game.EquipModel.getInstance().attributeFilter(attributeStrength);
                for (var key in attrBaseStr) {
                    if (equip.part == ConstEquipPart.WEAPON) {
                        if (key == "ac" || key == "mac" || key == "sc") {
                            if (info.limit_career == CareerType.SOLDIER) {
                                if (key == "ac") {
                                    textArrayStrength.push({ text: ConstAttributeTwo[key] + ": ", style: { textColor: 0xbfb294 } }, { text: attrBaseStr[key], style: { textColor: 0xbfb294 } }, { text: "\n", style: { textColor: 0x23ff00 } });
                                }
                            }
                            else if (info.limit_career == CareerType.MAGES) {
                                if (key == "mac") {
                                    textArrayStrength.push({ text: ConstAttributeTwo[key] + ": ", style: { textColor: 0xbfb294 } }, { text: attrBaseStr[key], style: { textColor: 0xbfb294 } }, { text: "\n", style: { textColor: 0x23ff00 } });
                                }
                            }
                            else if (info.limit_career == CareerType.TAOIST) {
                                if (key == "sc") {
                                    textArrayStrength.push({ text: ConstAttributeTwo[key] + ": ", style: { textColor: 0xbfb294 } }, { text: attrBaseStr[key], style: { textColor: 0xbfb294 } }, { text: "\n", style: { textColor: 0x23ff00 } });
                                }
                            }
                        }
                        else {
                            textArrayStrength.push({ text: ConstAttributeTwo[key] + ": ", style: { textColor: 0xbfb294 } }, { text: attrBaseStr[key], style: { textColor: 0xbfb294 } }, { text: "\n", style: { textColor: 0x23ff00 } });
                        }
                    }
                    else {
                        textArrayStrength.push({ text: ConstAttributeTwo[key] + ": ", style: { textColor: 0xbfb294 } }, { text: attrBaseStr[key], style: { textColor: 0xbfb294 } }, { text: "\n", style: { textColor: 0x23ff00 } });
                    }
                }
                ;
                this.lb_strength.textFlow = textArrayStrength;
                this.offset += this.gp_strength.height;
            }
            if (equip && equip.star) {
                this.gp_great.visible = true;
                this.gp_great.y = this.offset;
                var textArrayStar = [];
                var forgeInfo2 = this.forgeModel.getStarByPartLevel(this.forgeModel.curStarPart, equip.star);
                var attribute2 = App.ConfigManager.attributeConfig()[forgeInfo2.attribute];
                var attrBaseStar = game.EquipModel.getInstance().attributeFilter(attribute2);
                for (var key in attrBase) {
                    var myKey = ConstAttributeArray[attrBase[key].key];
                    var finalValue = Math.ceil((attrBase[key].value + attrBase[key].add_value) * attrBaseStar.attribute_rate / 10000);
                    textArrayStar.push({ text: ConstAttributeTwo[myKey] + ": ", style: { textColor: 0xbfb294 } }, { text: String(finalValue), style: { textColor: 0xbfb294 } }, { text: "\n", style: { textColor: 0x23ff00 } });
                }
                ;
                // for (let key in attrBaseStar) {
                // 	textArrayStar.push({ text: ConstAttributeTwo[key] + ": ", style: { textColor: 0xc6be66 } }, { text: attrBaseStar[key], style: { textColor: 0xc6bebb } },
                // 		{ text: "\n", style: { textColor: 0x23ff00 } });
                // };
                this.lb_great.textFlow = textArrayStar;
                this.offset += this.gp_great.height;
                if (textArrayStar.length > 12) {
                    this.height += (textArrayStar.length - 12) / 3 * 24;
                }
            }
            // let attrBaseOrange = this.info.equip.special;
            // if (attrBaseOrange.length > 0) { //有极品属性
            // 	this.gp_great.visible = true;
            // 	this.gp_great.y = this.offset;
            // 	let textArray2 = [];
            // 	for (let key in attrBaseOrange) {
            // 		let myKey = ConstAttributeArray[attrBaseOrange[key].key];
            // 		textArray.push({ text: ConstAttributeTwo[myKey] + ": ", style: { textColor: 0xc6be66 } }, { text: attrBaseOrange[key].value, style: { textColor: 0xc6bebb } },
            // 			{ text: " + " + attrBaseOrange[key].add_value + "\n", style: { textColor: 0x23ff00 } });
            // 	};
            // 	this.lb_great.textFlow = textArray2;
            // 	this.offset += this.gp_great.height + 5;
            // }
            var attrBaseGod = this.info.equip.wash;
            if (attrBaseGod && attrBaseGod.length > 0) {
                this.gp_super.visible = true;
                this.gp_super.y = this.offset;
                var textArray3 = [];
                for (var key in attrBaseGod) {
                    var myKey = ConstAttributeArray[attrBaseGod[key].key];
                    textArray3.push({ text: ConstAttributeTwo[myKey] + ": ", style: { textColor: 0xbfb294 } }, { text: attrBaseGod[key].value, style: { textColor: 0xbfb294 } }, { text: " + " + attrBaseGod[key].add_value + "\n", style: { textColor: 0x00f828 } });
                }
                ;
                this.lb_super.textFlow = textArray3;
                this.offset += this.gp_super.height;
            }
            var jewelInfo = this.heroModel.heroInfo[this.heroModel.curPos].getJewelInfoByPart(this.part);
            var jewelActive = false;
            if (jewelInfo) {
                for (var i = 0; i < jewelInfo.length; i++) {
                    var info_1 = App.ConfigManager.getJewelInfoById(jewelInfo[i].stone_id);
                    if (info_1) {
                        jewelActive = true;
                    }
                }
            }
            if (jewelActive) {
                var heroInfo = this.heroModel.heroInfo[this.heroModel.curPos];
                this.gp_gem.visible = true;
                this.gp_gem.y = this.offset;
                var textArrayJewel = [];
                for (var i = 0; i < jewelInfo.length; i++) {
                    var info_2 = App.ConfigManager.getJewelInfoById(jewelInfo[i].stone_id);
                    if (info_2) {
                        if (jewelInfo[i].hole == JewelType.ATTACK) {
                            if (heroInfo.job == CareerType.SOLDIER) {
                                textArrayJewel.push({ text: ConstAttributeTwo["ac"] + "：", style: { textColor: 0xbfb294 } }, { text: info_2["ac"] + "\n", style: { textColor: 0xbfb294 } });
                            }
                            else if (heroInfo.job == CareerType.MAGES) {
                                textArrayJewel.push({ text: ConstAttributeTwo["mac"] + "：", style: { textColor: 0xbfb294 } }, { text: info_2["mac"] + "\n", style: { textColor: 0xbfb294 } });
                            }
                            else if (heroInfo.job == CareerType.TAOIST) {
                                textArrayJewel.push({ text: ConstAttributeTwo["sc"] + "：", style: { textColor: 0xbfb294 } }, { text: info_2["sc"] + "\n", style: { textColor: 0xbfb294 } });
                            }
                        }
                        else if (jewelInfo[i].hole == JewelType.LIFE) {
                            textArrayJewel.push({ text: ConstAttributeTwo["hp"] + "：", style: { textColor: 0xbfb294 } }, { text: info_2["hp"] + "\n", style: { textColor: 0xbfb294 } });
                        }
                        else if (jewelInfo[i].hole == JewelType.DEFENCE) {
                            textArrayJewel.push({ text: ConstAttributeTwo["def"] + "：", style: { textColor: 0xbfb294 } }, { text: info_2["def"] + "\n", style: { textColor: 0xbfb294 } });
                        }
                        else if (jewelInfo[i].hole == JewelType.MAGIC) {
                            textArrayJewel.push({ text: ConstAttributeTwo["sdef"] + "：", style: { textColor: 0xbfb294 } }, { text: info_2["sdef"] + "\n", style: { textColor: 0xbfb294 } });
                        }
                    }
                }
                this.lb_gem.textFlow = textArrayJewel;
                this.offset += this.gp_gem.height;
            }
        };
        //显示配置表里面的数据
        EquipView.prototype.updateBaseView = function () {
            //隐藏所有按钮
            this.btn_show.visible = false;
            this.btn_change.visible = false;
            var info = this.baseInfo;
            var attribute = App.ConfigManager.getAttributeInfoById(info.base_att);
            var attrBase = game.EquipModel.getInstance().attributeFilter(attribute);
            // let attrBase = this.info.equip.base;
            this.lb_name.text = info.name;
            this.lb_cap.text = "??????";
            this.baseItem.updateBaseItem(ClientType.EQUIP, info.id);
            this.lb_level.textFlow = [{ text: "需求等级：", style: { textColor: 0xf5d98f } }, { text: String(info.limit_lvl), style: { textColor: 0xd8cecc } }];
            this.lb_part.textFlow = [{ text: "部位：", style: { textColor: 0xf5d98f } }, { text: ConstEquipType[info.sub_type], style: { textColor: 0xd8cecc } }];
            this.lb_career.textFlow = [{ text: "职位：", style: { textColor: 0xf5d98f } }, { text: ConstCareer[info.limit_career], style: { textColor: 0xd8cecc } }];
            this.lb_base.lineSpacing = 2;
            var textArray = [];
            for (var key in attrBase) {
                textArray.push({ text: ConstAttributeTwo[key] + ": ", style: { textColor: 0xc6be66 } }, { text: attrBase[key], style: { textColor: 0xc6bebb } }, { text: " + " + "?" + "\n", style: { textColor: 0x23ff00 } });
            }
            ;
            this.lb_base.textFlow = textArray;
            this.offset = this.gp_base.height + 5;
            // if (true) { //有强化属性
            // 	this.gp_strength.visible = true;
            // 	this.gp_strength.y = this.offset;
            // 	this.lb_strength.textFlow = textArray
            // 	this.offset += this.gp_strength.height + 5;	
            // }
            var attributeOrange = App.ConfigManager.getAttributeInfoById(this.baseInfo.best_att);
            if (attributeOrange) {
                var attrBaseOrange = game.EquipModel.getInstance().attributeFilter(attributeOrange);
                this.gp_great.visible = true;
                this.gp_great.y = this.offset;
                var textArray2 = [];
                for (var key in attrBaseOrange) {
                    textArray.push({ text: ConstAttributeTwo[key] + ": ", style: { textColor: 0xc6be66 } }, { text: attrBaseOrange[key], style: { textColor: 0xc6bebb } }, { text: " + " + "?" + "\n", style: { textColor: 0x23ff00 } });
                }
                ;
                this.lb_great.textFlow = textArray2;
                this.offset += this.gp_great.height + 5;
            }
            var attributeGod = App.ConfigManager.getAttributeInfoById(this.baseInfo.god_att);
            if (attributeGod) {
                var attrBaseGod = game.EquipModel.getInstance().attributeFilter(attributeGod);
                this.gp_super.visible = true;
                this.gp_super.y = this.offset;
                var textArray3 = [];
                for (var key in attrBaseGod) {
                    textArray.push({ text: ConstAttributeTwo[key] + ": ", style: { textColor: 0xc6be66 } }, { text: attrBaseGod[key], style: { textColor: 0xc6bebb } }, { text: " + " + "?" + "\n", style: { textColor: 0x23ff00 } });
                }
                ;
                this.lb_super.textFlow = textArray3;
                this.offset += this.gp_super.height + 5;
            }
        };
        /**
         * 打开窗口
         */
        EquipView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this.type = openParam.type ? openParam.type : 0; //type  0: 装备tip界面，没有更换功能。 1：具有更换装备功能
            this.id = openParam.id;
            this.uuid = openParam.uuid;
            this.part = openParam.part;
            if (!this.id) {
            }
            else {
                this.baseInfo = game.EquipModel.getInstance().getEquipInfoById(this.id);
                //透传过来的数据，可以是装备展示
                if (openParam.info) {
                    this.info = openParam.info;
                    this.btn_show.visible = false;
                }
                else {
                    this.info = game.BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.EQUIP, this.id, this.uuid);
                    if (!this.info && this.type == 1) {
                        this.info = this.heroModel.getHeroEquipByPosPart(this.heroModel.curPos, this.heroModel.curPart);
                    }
                }
                this.gp_equip.visible = true;
                // this.gp_tip.visible = false;
            }
            if (this.type == 0) {
                this.btn_change.visible = false;
            }
            else if (this.type == 1) {
                this.btn_change.visible = true;
            }
            this.baseItem.setStopShowTips(true);
            this.updateView();
        };
        /**
         * 关闭窗口
         */
        EquipView.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        /**
         * 清理
         */
        EquipView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
        };
        /**
         * 销毁
         */
        EquipView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return EquipView;
    }(BaseView));
    game.EquipView = EquipView;
    __reflect(EquipView.prototype, "game.EquipView");
})(game || (game = {}));
//# sourceMappingURL=EquipView.js.map
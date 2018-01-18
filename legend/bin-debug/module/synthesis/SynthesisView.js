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
 * 合成模块视图
 * author : zrj
*/
var game;
(function (game) {
    var SynthesisView = (function (_super) {
        __extends(SynthesisView, _super);
        function SynthesisView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this.list = new eui.List();
            _this._curJewelType = 1; //当前类型
            _this._curWingType = 1; //当前类型
            _this._curEquipType = 1; //当前类型
            _this._curSelect = 0; //当前选中第几个
            _this._itemArray = [];
            _this._effectArray = []; //一键合成特效数组
            _this.heroModel = game.HeroModel.getInstance();
            _this.synthesisModel = game.SynthesisModel.getInstance();
            _this.backpackModel = game.BackpackModel.getInstance();
            return _this;
        }
        SynthesisView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.initView();
        };
        SynthesisView.prototype.initView = function () {
            var _this = this;
            RES.getResAsync("compound_hecheng_title_png", function (texture) {
                _this.commonWin.img_title.texture = texture;
            }, this);
            this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.closeWin(WinName.SYNTHESIS);
            }, this);
            this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeView, this);
            this.img_all.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.Socket.send(14014, { type: _this._curIndex, to_good_id: _this._curID });
            }, this);
            this.img_synthesis.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.Socket.send(14013, { type: _this._curIndex, to_good_id: _this._curID });
            }, this);
            this.btn_jewel.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this._curID = undefined;
                _this._curSelect = 0;
                _this.updateView(1);
            }, this);
            this.btn_wing.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this._curID = undefined;
                _this._curSelect = 0;
                _this.updateView(2);
            }, this);
            this.btn_equip.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this._curID = undefined;
                _this._curSelect = 0;
                _this.updateView(3);
            }, this);
            this.btn_item.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this._curID = undefined;
                _this._curSelect = 0;
                _this.updateView(4);
            }, this);
            this.baseItem_right.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.GlobalTips.showItemTips(ClientType.BASE_ITEM, _this._curID, null);
            }, this);
            this.baseItem_left.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                var info = App.ConfigManager.getSynthesisInfoById(_this._curID);
                App.GlobalTips.showItemTips(ClientType.BASE_ITEM, info.need, null);
            }, this);
            this._itemArray.push(this.baseItem1);
            this._itemArray.push(this.baseItem2);
            this._itemArray.push(this.baseItem3);
            this._itemArray.push(this.baseItem4);
            this._itemArray.forEach(function (value, index, array) {
                value.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                    if (_this._curIndex == ConstSynthesisType.JEWEL) {
                        if (_this._curJewelType == index + 1) {
                            return;
                        }
                        _this._curJewelType = index + 1;
                    }
                    else if (_this._curIndex == ConstSynthesisType.WING) {
                        if (_this._curWingType == index + 1) {
                            return;
                        }
                        _this._curWingType = index + 1;
                    }
                    else if (_this._curIndex == ConstSynthesisType.EQUIP) {
                        if (_this._curEquipType == index + 1) {
                            return;
                        }
                        _this._curEquipType = index + 1;
                    }
                    _this.updateView(_this._curIndex);
                }, _this);
            }, this);
            this.list.itemRenderer = SynthesisItem;
            this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, function (event) {
                if (event.itemIndex != _this._curSelect) {
                    // this._curID = event.item.id;
                    _this._curSelect = event.itemIndex;
                    _this.updateView(_this._curIndex);
                    // (<SynthesisItem>event.currentTarget).img_item.source = RES.getRes("Login_btn_xuanz_png");
                }
            }, this);
            this.scroller.viewport = this.list;
            this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
            this.scroller.verticalScrollBar.autoVisibility = false;
            this.scroller.verticalScrollBar.visible = false;
            this.scroller.bounces = false;
            this._curIndex = this.synthesisModel.synthesisType;
            // this.updateView(this._curIndex);
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.ROLE_RUBY_COMNINE_GEMSTONE, this.btn_jewel);
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.ROLE_RUBY_COMNINE_WING, this.btn_wing);
        };
        SynthesisView.prototype.checkRedDot = function (type) {
            var _this = this;
            if (type == ConstSynthesisType.JEWEL) {
                this._itemArray.forEach(function (value, index, array) {
                    if (_this.synthesisModel.jewelRedPoint[index]) {
                        value.showRedTips(true);
                    }
                    else {
                        value.hideRedTips();
                    }
                }, this);
            }
            else if (type == ConstSynthesisType.WING) {
                this._itemArray.forEach(function (value, index, array) {
                    if (_this.synthesisModel.wingRedPoint[index]) {
                        value.showRedTips(true);
                    }
                    else {
                        value.hideRedTips();
                    }
                }, this);
            }
        };
        //合成成功特效
        SynthesisView.prototype.successAnimate = function (cb) {
            var _this = this;
            var effectMc = new EffectMovieClip();
            effectMc.playMCKey("effbsxqcg", "", 1, null, function () {
                effectMc.frameRate = 10;
            }, function () {
                App.logzrj(effectMc);
                if (effectMc.parent) {
                    effectMc.parent.removeChild(effectMc);
                }
                if (cb) {
                    egret.setTimeout(function () { cb.call(_this); }, _this, 150);
                    // cb.call(this);
                }
                effectMc.destroy();
            }, this);
            this.gp_middle.addChild(effectMc);
            effectMc.x = this.baseItem_left.x;
            effectMc.y = this.baseItem_left.y;
            var effectMc2 = new EffectMovieClip();
            effectMc2.playMCKey("effbsxqcg", "", 1, null, function () {
                effectMc2.frameRate = 10;
            }, function () {
                if (effectMc2.parent) {
                    effectMc2.parent.removeChild(effectMc2);
                }
                effectMc2.destroy();
            }, this);
            this.gp_middle.addChild(effectMc2);
            effectMc2.x = this.baseItem_right.x;
            effectMc2.y = this.baseItem_right.y;
        };
        //合成成功返回
        SynthesisView.prototype.handleSynthesisSuccess = function (data) {
            var callback = function () {
                // let view = new SynthesisSuccessView(data.to_good_id, 1);
                // PopUpManager.addPopUp({ obj: view });
                App.WinManager.openPopWin(WinName.POP_SYNTHESISSUCCESS, { id: data.to_good_id, num: 1 });
            };
            callback.bind(this);
            this.successAnimate(callback);
            this.updateView(data.type);
            // let view = new SynthesisSuccessView(data.to_good_id,1);
            // PopUpManager.addPopUp({obj:view});
        };
        SynthesisView.prototype.handleAllSynthesisSuccess = function (data) {
            var _this = this;
            this._effectArray = data.to_good_list;
            //特效播放完成返回
            var callback = function () {
                var item = _this._effectArray.shift();
                if (_this._effectArray.length > 0) {
                    var info = App.ConfigManager.getItemInfoById(_this._effectArray[0].good_id);
                    var index = _this.list.dataProvider.getItemIndex(info);
                    _this.successAnimate(callback);
                    _this._curSelect = index;
                    _this.updateView(data.type);
                }
                else {
                    // let view = new SynthesisSuccessView(item.good_id, item.num);
                    // PopUpManager.addPopUp({ obj: view });
                    App.WinManager.openWin(WinName.POP_SYNTHESISSUCCESS, { id: item.good_id, num: item.num });
                    _this.touchChildren = true;
                }
            };
            callback.bind(this);
            if (this._effectArray.length > 0) {
                var info = App.ConfigManager.getItemInfoById(this._effectArray[0].good_id);
                var index = this.list.dataProvider.getItemIndex(info);
                this.successAnimate(callback);
                this._curSelect = index;
                this.updateView(data.type);
                this.touchChildren = false;
            }
            else {
                this.updateView(data.type);
            }
        };
        SynthesisView.prototype.updateView = function (index) {
            this.btn_item.currentState = "up";
            this.btn_jewel.currentState = "up";
            this.btn_equip.currentState = "up";
            this.btn_wing.currentState = "up";
            if (index == ConstSynthesisType.JEWEL) {
                this.updateJewelView();
                this.btn_jewel.currentState = "down";
            }
            else if (index == ConstSynthesisType.WING) {
                this.updateWingView();
                this.btn_wing.currentState = "down";
            }
            else if (index == ConstSynthesisType.EQUIP) {
                // this.updateEquipView();
                // this.btn_equip.currentState = "down";
            }
            else {
                this.updateJewelView();
                this.btn_jewel.currentState = "down";
            }
            this.checkRedDot(index);
        };
        SynthesisView.prototype.updateJewelView = function () {
            var _this = this;
            this._curIndex = 1;
            this._itemArray.forEach(function (value, index, array) {
                value.setItemIcon(ConstJewelIcon[index + 1] + "_hui");
                // RES.getResAsync(ConstJewelIcon[index + 1] + "_hui", (texture) => {
                // 	value.img_icon.source = texture;
                // }, this);
                if (_this._curJewelType == index + 1) {
                    value.setSelect(true);
                }
                else {
                    value.setSelect(false);
                }
            }, this);
            var data = App.ConfigManager.getItemInfoByTypeAndSubType(ItemType.RUBY, this._curJewelType);
            var offset = this.list.scrollV;
            this.list.dataProvider = new eui.ArrayCollection(data);
            this.list.selectedIndex = this._curSelect;
            this.list.validateNow();
            this.list.scrollV = offset;
            if (!this._curID) {
                this._curID = data[0].id;
            }
            else {
                this._curID = data[this._curSelect].id;
            }
            var info = App.ConfigManager.getSynthesisInfoById(this._curID);
            var preInfo = App.ConfigManager.getItemInfoById(info.need);
            var nextInfo = App.ConfigManager.getItemInfoById(info.id);
            var preAttr = App.ConfigManager.getJewelInfoById(info.need);
            var nextAttr = App.ConfigManager.getJewelInfoById(info.id);
            var itemInfo = this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, info.need);
            if (!itemInfo) {
                itemInfo = { num: 0 };
            }
            if (preAttr) {
                this.lb_attr_next.visible = true;
                this.img_arrow.visible = true;
                this.lb_attr.horizontalCenter = -110;
                var textArrL = [];
                var textArrR = [];
                if (preInfo.sub_type == JewelType.ATTACK) {
                    textArrL.push({ text: "攻击" + "：" + preAttr["ac"], style: { textColor: 0xbfbfbf } });
                    textArrL.push({ text: "\n" });
                }
                else if (preInfo.sub_type == JewelType.LIFE) {
                    textArrL.push({ text: ConstAttribute["hp"] + "：" + preAttr["hp"], style: { textColor: 0xbfbfbf } });
                    textArrL.push({ text: "\n" });
                }
                else if (preInfo.sub_type == JewelType.DEFENCE) {
                    textArrL.push({ text: ConstAttribute["def"] + "：" + preAttr["def"], style: { textColor: 0xbfbfbf } });
                    textArrL.push({ text: "\n" });
                }
                else if (preInfo.sub_type == JewelType.MAGIC) {
                    textArrL.push({ text: ConstAttribute["sdef"] + "：" + preAttr["sdef"], style: { textColor: 0xbfbfbf } });
                    textArrL.push({ text: "\n" });
                }
                //拥有超级属性
                if (preInfo.super_attribute) {
                    textArrL.push({ text: "超级属性" + "：" + String(preInfo.super_attribute / 100 + "%"), style: { textColor: 0xbfbfbf } });
                    textArrL.push({ text: "\n" });
                }
                else if (nextInfo.super_attribute && !preInfo.super_attribute) {
                    textArrL.push({ text: "超级属性" + "：" + "0%", style: { textColor: 0xbfbfbf } });
                    textArrL.push({ text: "\n" });
                }
                textArrL.pop();
                this.lb_attr.textFlow = textArrL;
                this.lb_attr.bold = true;
                if (nextInfo.sub_type == JewelType.ATTACK) {
                    textArrR.push({ text: nextAttr["ac"], style: { textColor: 0x0de903 } });
                    textArrR.push({ text: "\n" });
                }
                else if (nextInfo.sub_type == JewelType.LIFE) {
                    textArrR.push({ text: nextAttr["hp"], style: { textColor: 0x0de903 } });
                    textArrR.push({ text: "\n" });
                }
                else if (nextInfo.sub_type == JewelType.DEFENCE) {
                    textArrR.push({ text: nextAttr["def"], style: { textColor: 0x0de903 } });
                    textArrR.push({ text: "\n" });
                }
                else if (nextInfo.sub_type == JewelType.MAGIC) {
                    textArrR.push({ text: nextAttr["sdef"], style: { textColor: 0x0de903 } });
                    textArrR.push({ text: "\n" });
                }
                if (nextInfo.super_attribute) {
                    textArrR.push({ text: String(nextInfo.super_attribute / 100 + "%"), style: { textColor: 0x0de903 } });
                    textArrR.push({ text: "\n" });
                }
                textArrR.pop();
                this.lb_attr_next.textFlow = textArrR;
                this.lb_attr_next.bold = true;
                this.img_cur.visible = true;
                this.img_next.horizontalCenter = 110;
            }
            else {
                var textArr = [];
                if (nextInfo.sub_type == JewelType.ATTACK) {
                    textArr.push({ text: "攻击" + "：" + nextAttr["ac"], style: { textColor: 0x0de903 } });
                    textArr.push({ text: "\n" });
                }
                else if (nextInfo.sub_type == JewelType.LIFE) {
                    textArr.push({ text: ConstAttribute["hp"] + "：" + nextAttr["hp"], style: { textColor: 0x0de903 } });
                    textArr.push({ text: "\n" });
                }
                else if (nextInfo.sub_type == JewelType.DEFENCE) {
                    textArr.push({ text: ConstAttribute["def"] + "：" + nextAttr["def"], style: { textColor: 0x0de903 } });
                    textArr.push({ text: "\n" });
                }
                else if (nextInfo.sub_type == JewelType.MAGIC) {
                    textArr.push({ text: ConstAttribute["sdef"] + "：" + nextAttr["sdef"], style: { textColor: 0x0de903 } });
                    textArr.push({ text: "\n" });
                }
                textArr.pop();
                this.lb_attr.horizontalCenter = 0;
                this.lb_attr.textFlow = textArr;
                this.lb_attr.bold = true;
                this.lb_attr_next.visible = false;
                this.img_arrow.visible = false;
                this.lb_attr.horizontalCenter = 0;
                this.img_cur.visible = false;
                this.img_next.horizontalCenter = 0;
            }
            this.baseItem_left.updateBaseItem(ClientType.BASE_ITEM, info.need);
            this.baseItem_right.updateBaseItem(ClientType.BASE_ITEM, info.id);
            this.baseItem_left.setItemNameVisible(true);
            this.baseItem_right.setItemNameVisible(true);
            if (itemInfo.num >= info.number) {
                this.baseItem_left.setItemName([{ text: ConstJewelName[preInfo.sub_type] + "\n" }, { text: String(itemInfo.num), style: { textColor: 0x63d72a } }, { text: "/" + info.number, style: { textColor: 0xbfbfbf } }]);
                //判断是否是宝石碎片
                if (preInfo.type == ItemType.NORMAL) {
                    this.baseItem_left.setItemName([{ text: preInfo.name + "\n" }, { text: String(itemInfo.num), style: { textColor: 0x63d72a } }, { text: "/" + info.number, style: { textColor: 0xbfbfbf } }]);
                }
            }
            else {
                this.baseItem_left.setItemName([{ text: ConstJewelName[preInfo.sub_type] + "\n" }, { text: String(itemInfo.num), style: { textColor: 0xb90b0a } }, { text: "/" + info.number, style: { textColor: 0xbfbfbf } }]);
                //判断是否是宝石碎片
                if (preInfo.type == ItemType.NORMAL) {
                    this.baseItem_left.setItemName([{ text: preInfo.name + "\n" }, { text: String(itemInfo.num), style: { textColor: 0xb90b0a } }, { text: "/" + info.number, style: { textColor: 0xbfbfbf } }]);
                }
            }
            this._preIndex = this._curIndex;
        };
        SynthesisView.prototype.updateWingView = function () {
            var _this = this;
            this._curIndex = 2;
            this._itemArray.forEach(function (value, index, array) {
                // RES.getResAsync(ConstWingIcon[index + 1] + "", (texture) => {
                // 	value.img_icon.source = texture;
                // }, this);
                value.setItemIcon(ConstWingIcon[index + 1] + "");
                if (_this._curWingType == index + 1) {
                    value.setSelect(true);
                }
                else {
                    value.setSelect(false);
                }
            }, this);
            var data = App.ConfigManager.getItemInfoByTypeAndSubType(ItemType.WING, this._curWingType);
            var offset = this.list.scrollV;
            this.list.dataProvider = new eui.ArrayCollection(data);
            this.list.selectedIndex = this._curSelect;
            this.list.scrollV = offset;
            if (!this._curID) {
                this._curID = data[0].id;
            }
            else {
                this._curID = data[this._curSelect].id;
            }
            var info = App.ConfigManager.getSynthesisInfoById(this._curID);
            var preInfo = App.ConfigManager.getItemInfoById(info.need);
            var nextInfo = App.ConfigManager.getItemInfoById(info.id);
            var preAttr = App.ConfigManager.getWingAttrById(info.need);
            var nextAttr = App.ConfigManager.getWingAttrById(info.id);
            var itemInfo = this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, info.need);
            if (!itemInfo) {
                itemInfo = { num: 0 };
            }
            if (preAttr) {
                this.lb_attr_next.visible = true;
                this.img_arrow.visible = true;
                this.lb_attr.horizontalCenter = -110;
                var textArrL = [];
                var textArrR = [];
                textArrL.push({ text: "评分" + "：" + preAttr["grade"] + "\n", style: { textColor: 0xbfbfbf } });
                if (preInfo.sub_type == WingEquipType.ZHENGYU) {
                    textArrL.push({ text: "攻击" + "：" + preAttr["ac"], style: { textColor: 0xbfbfbf } });
                    textArrL.push({ text: "\n" });
                }
                else if (preInfo.sub_type == WingEquipType.FUYU) {
                    textArrL.push({ text: ConstAttribute["hp"] + "：" + preAttr["hp"], style: { textColor: 0xbfbfbf } });
                    textArrL.push({ text: "\n" });
                }
                else if (preInfo.sub_type == WingEquipType.RONGYU) {
                    textArrL.push({ text: ConstAttribute["def"] + "：" + preAttr["def"], style: { textColor: 0xbfbfbf } });
                    textArrL.push({ text: "\n" });
                }
                else if (preInfo.sub_type == WingEquipType.XUYU) {
                    textArrL.push({ text: ConstAttribute["sdef"] + "：" + preAttr["sdef"], style: { textColor: 0xbfbfbf } });
                    textArrL.push({ text: "\n" });
                }
                textArrL.pop();
                this.lb_attr.textFlow = textArrL;
                this.lb_attr.bold = true;
                textArrR.push({ text: nextAttr["grade"] + "\n", style: { textColor: 0x0de903 } });
                if (nextInfo.sub_type == WingEquipType.ZHENGYU) {
                    textArrR.push({ text: nextAttr["ac"], style: { textColor: 0x0de903 } });
                    textArrR.push({ text: "\n" });
                }
                else if (nextInfo.sub_type == WingEquipType.FUYU) {
                    textArrR.push({ text: nextAttr["hp"], style: { textColor: 0x0de903 } });
                    textArrR.push({ text: "\n" });
                }
                else if (nextInfo.sub_type == WingEquipType.RONGYU) {
                    textArrR.push({ text: nextAttr["def"], style: { textColor: 0x0de903 } });
                    textArrR.push({ text: "\n" });
                }
                else if (nextInfo.sub_type == WingEquipType.XUYU) {
                    textArrR.push({ text: nextAttr["sdef"], style: { textColor: 0x0de903 } });
                    textArrR.push({ text: "\n" });
                }
                textArrR.pop();
                this.lb_attr_next.textFlow = textArrR;
                this.lb_attr_next.bold = true;
                this.img_cur.visible = true;
                this.img_next.horizontalCenter = 110;
            }
            else {
                var textArr = [];
                textArr.push({ text: "评分" + "：" + nextAttr["grade"] + "\n", style: { textColor: 0x0de903 } });
                if (nextInfo.sub_type == WingEquipType.ZHENGYU) {
                    textArr.push({ text: "攻击" + "：" + nextAttr["ac"], style: { textColor: 0x0de903 } });
                    textArr.push({ text: "\n" });
                }
                else if (nextInfo.sub_type == WingEquipType.FUYU) {
                    textArr.push({ text: ConstAttribute["hp"] + "：" + nextAttr["hp"], style: { textColor: 0x0de903 } });
                    textArr.push({ text: "\n" });
                }
                else if (nextInfo.sub_type == WingEquipType.RONGYU) {
                    textArr.push({ text: ConstAttribute["def"] + "：" + nextAttr["def"], style: { textColor: 0x0de903 } });
                    textArr.push({ text: "\n" });
                }
                else if (nextInfo.sub_type == WingEquipType.XUYU) {
                    textArr.push({ text: ConstAttribute["sdef"] + "：" + nextAttr["sdef"], style: { textColor: 0x0de903 } });
                    textArr.push({ text: "\n" });
                }
                textArr.pop();
                this.lb_attr.horizontalCenter = 0;
                this.lb_attr.textFlow = textArr;
                this.lb_attr.bold = true;
                this.lb_attr_next.visible = false;
                this.img_arrow.visible = false;
                this.lb_attr.horizontalCenter = 0;
                this.img_cur.visible = false;
                this.img_next.horizontalCenter = 0;
            }
            this.baseItem_left.updateBaseItem(ClientType.BASE_ITEM, info.need);
            this.baseItem_right.updateBaseItem(ClientType.BASE_ITEM, info.id);
            this.baseItem_left.setItemNameVisible(true);
            this.baseItem_right.setItemNameVisible(true);
            if (itemInfo.num >= info.number) {
                this.baseItem_left.setItemName([{ text: preInfo.name + "\n" }, { text: String(itemInfo.num), style: { textColor: 0x63d72a } }, { text: "/" + info.number, style: { textColor: 0xbfbfbf } }]);
            }
            else {
                this.baseItem_left.setItemName([{ text: preInfo.name + "\n" }, { text: String(itemInfo.num), style: { textColor: 0xb90b0a } }, { text: "/" + info.number, style: { textColor: 0xbfbfbf } }]);
            }
            this._preIndex = this._curIndex;
        };
        SynthesisView.prototype.updateEquipView = function () {
            this._curIndex = 3;
        };
        //关闭窗口
        SynthesisView.prototype.closeView = function () {
            if (this._lastModuleName) {
                App.WinManager.openWin(this._lastModuleName);
            }
            else {
                App.WinManager.closeWin(WinName.SYNTHESIS);
            }
        };
        /**
         * 打开窗口
         */
        SynthesisView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (openParam) {
                game.SynthesisModel.getInstance().synthesisType = openParam.type ? openParam.type : ConstSynthesisType.JEWEL;
                this._curIndex = openParam.type ? openParam.type : ConstSynthesisType.JEWEL;
                this._lastModuleName = openParam.lastModule;
            }
            else {
                game.SynthesisModel.getInstance().synthesisType = ConstSynthesisType.JEWEL;
            }
            this.updateView(this._curIndex);
            App.EventSystem.addEventListener(PanelNotify.SYNTHESIS_VIEW, this.handleSynthesisSuccess, this);
            // App.EventSystem.addEventListener(PanelNotify.SYNTHESIS_JEWEL_VIEW,this.handleSynthesisSuccess,this);
            // App.EventSystem.addEventListener(PanelNotify.SYNTHESIS_WING_VIEW,this.handleSynthesisSuccess,this);
            // App.EventSystem.addEventListener(PanelNotify.SYNTHESIS_EQUIP_VIEW,this.handleSynthesisSuccess,this);
            App.EventSystem.addEventListener(PanelNotify.SYNTHESIS_ALL_VIEW, this.handleAllSynthesisSuccess, this);
        };
        /**
         * 关闭窗口
         */
        SynthesisView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        SynthesisView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            App.EventSystem.removeEventListener(PanelNotify.SYNTHESIS_VIEW);
            // App.EventSystem.removeEventListener(PanelNotify.SYNTHESIS_JEWEL_VIEW);
            // App.EventSystem.removeEventListener(PanelNotify.SYNTHESIS_WING_VIEW);
            // App.EventSystem.removeEventListener(PanelNotify.SYNTHESIS_EQUIP_VIEW);
            App.EventSystem.removeEventListener(PanelNotify.SYNTHESIS_ALL_VIEW);
        };
        /**
         * 销毁
         */
        SynthesisView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return SynthesisView;
    }(BaseView));
    game.SynthesisView = SynthesisView;
    __reflect(SynthesisView.prototype, "game.SynthesisView");
    var SynthesisItem = (function (_super) {
        __extends(SynthesisItem, _super);
        function SynthesisItem() {
            var _this = _super.call(this) || this;
            _this.synthesisModel = game.SynthesisModel.getInstance();
            _this.skinName = "SynthesisItemSkin";
            return _this;
        }
        SynthesisItem.prototype.dataChanged = function () {
            var _this = this;
            this.lb_name.text = this.data.name;
            this.lb_name.textColor = 0xf1d4b2;
            RES.getResAsync("common_btn_list_an_png", function (texture) {
                if (!_this.selected) {
                    _this.img_item.source = texture;
                }
            }, this);
            if (this.selected) {
                RES.getResAsync("common_btn_list_liang_png", function (texture) {
                    if (_this.selected) {
                        _this.img_item.source = texture;
                    }
                }, this);
                this.lb_name.textColor = 0xffc702;
            }
            if (this.data.type == ItemType.RUBY) {
                if (this.synthesisModel.jewelSubRedPoint[this.data.id]) {
                    this.showRedTips(true);
                }
                else {
                    this.hideRedTips();
                }
            }
            else if (this.data.type == ItemType.WING) {
                if (this.synthesisModel.wingSubRedPoint[this.data.id]) {
                    this.showRedTips(true);
                }
                else {
                    this.hideRedTips();
                }
            }
        };
        /**
         * 显示红点
         */
        SynthesisItem.prototype.showRedTips = function (value) {
            if (this._redBtnTips == null) {
                this._redBtnTips = new BtnTips("", this);
            }
            this._redBtnTips.show(value);
        };
        /**
         * 隐藏红点
         */
        SynthesisItem.prototype.hideRedTips = function () {
            if (this._redBtnTips) {
                this._redBtnTips.hide();
            }
        };
        return SynthesisItem;
    }(eui.ItemRenderer));
    game.SynthesisItem = SynthesisItem;
    __reflect(SynthesisItem.prototype, "game.SynthesisItem");
    //合成成功弹框
    var SynthesisSuccessView = (function (_super) {
        __extends(SynthesisSuccessView, _super);
        function SynthesisSuccessView(openParam) {
            var _this = _super.call(this, openParam) || this;
            _this.skinName = "SynthesisSuccessSkin";
            return _this;
            // this._id = openParam.id;
            // this._num = openParam.num;
        }
        SynthesisSuccessView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this._effect = new EffectMovieClip();
            this._effect.touchEnabled = false;
            this._effect.x = 205;
            this._effect.y = 40;
            this._effect.playMCKey("effhccgb", "", -1, null, function () {
            }, null, this);
            this.addChild(this._effect);
            this.setChildIndex(this._effect, 1);
            // this.baseItem.updateBaseItem(ClientType.BASE_ITEM, this._id, this._num);
            // this.baseItem.lb_name.visible = true;
        };
        SynthesisSuccessView.prototype.updateView = function () {
            this.baseItem.updateBaseItem(ClientType.BASE_ITEM, this._id, this._num);
            if (this._num > 1) {
                this.baseItem.setItemNumVisible(true);
            }
        };
        /**
         * 打开窗口
         */
        SynthesisSuccessView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this._id = openParam.id;
            this._num = openParam.num;
            this.updateView();
        };
        /**
         * 关闭窗口
         */
        SynthesisSuccessView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        SynthesisSuccessView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
        };
        /**
         * 销毁
         */
        SynthesisSuccessView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this._effect.destroy();
        };
        return SynthesisSuccessView;
    }(BaseView));
    game.SynthesisSuccessView = SynthesisSuccessView;
    __reflect(SynthesisSuccessView.prototype, "game.SynthesisSuccessView");
})(game || (game = {}));
//# sourceMappingURL=SynthesisView.js.map
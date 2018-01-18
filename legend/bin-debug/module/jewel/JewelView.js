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
 * module : 宝石模块界面
 * ahtuor : zrj
*/
var game;
(function (game) {
    var JewelView = (function (_super) {
        __extends(JewelView, _super);
        function JewelView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._handleId = 0;
            _this._equipArray = [];
            _this._jewelArray = [];
            _this._jewelLevelArray = [];
            _this._jewelLevelTipArray = [];
            _this._curPos = 0;
            _this._curPart = 1;
            _this._playEffectArray = []; //一键镶嵌的特效数组
            _this.heroModel = game.HeroModel.getInstance();
            _this.jewelModel = game.JewelModel.getInstance();
            return _this;
        }
        JewelView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.initView();
        };
        JewelView.prototype.initView = function () {
            var _this = this;
            this.img_master.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                // let view = new JewelMasterView({ pos: this._curPos, part: this._curPart });
                // PopUpManager.addPopUp({ obj: view });
                App.WinManager.openWin(WinName.POP_JEWEL_MASTER, { data: { pos: _this._curPos, part: _this._curPart } });
            }, this);
            this.img_attr.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                // let view = new JewelSuperView({ pos: this._curPos, part: this._curPart });
                // PopUpManager.addPopUp({ obj: view });
                App.WinManager.openWin(WinName.POP_JEWEL_SUPER, { data: { pos: _this._curPos, part: _this._curPart } });
            }, this);
            this.btn_all.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                App.Socket.send(15008, { id: _this.heroModel.heroInfo[_this._curPos].id });
            }, this);
            this.btn_combine.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                App.WinManager.openWin(WinName.SYNTHESIS, { lastModule: WinName.JEWEL });
            }, this);
            this.btn_return.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                game.HeroModel.getInstance().curPos = _this._curPos;
                App.WinManager.openWin(WinName.HERO);
            }, this);
            this._curPos = this.heroModel.curPos;
            this.initEquip();
            this.updateEquipView();
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.ROLE_RUBY_EMBED, this.btn_all);
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.ROLE_RUBY_COMNINE, this.btn_combine);
        };
        JewelView.prototype.initEquip = function () {
            var _this = this;
            this.img_select = new eui.Image();
            RES.getResAsync("equipping_choose_png", function (texture) {
                _this.img_select.source = texture;
            }, this);
            egret.setTimeout(function () {
                _this.img_select.x = 65;
            }, this, 80);
            var _loop_1 = function (i) {
                var item = new customui.BaseItem();
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
                var equipInfo = this_1.heroModel.heroInfo[this_1._curPos].getPartInfoByPart(i);
                if (this_1.heroModel.heroInfo[this_1._curPos].equipExist(i) >= 0) {
                    item.updateBaseItem(ClientType.EQUIP, equipInfo.good_id, null);
                    item.setCarrerIconVisible(false);
                    item.setStrengthLvVisible(false);
                }
                else {
                    item.updateBaseItem(ClientType.EQUIP, 0, null);
                    // RES.getResAsync(ConstEquipIcon[i] + "_png", (texture) => {
                    // 	item.img_icon.source = texture;
                    // }, this);
                    item.setItemIcon(ConstEquipIcon[i] + "_png");
                    item.setStrengthLvVisible(false);
                }
                this_1.gp_equip.addChild(item);
                item.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                    if (i == _this._curPart) {
                        return;
                    }
                    _this._curPart = i;
                    _this.setSelect();
                    _this.moveAnimate(i);
                    // this.updateEquipView();
                }, this_1);
                this_1._equipArray.push(item);
            };
            var this_1 = this;
            for (var i = 1; i <= 10; i++) {
                _loop_1(i);
            }
            this._jewelLevelArray.push(this.lb_atk);
            this._jewelLevelArray.push(this.lb_hp);
            this._jewelLevelArray.push(this.lb_def);
            this._jewelLevelArray.push(this.lb_sdef);
            this._jewelLevelTipArray.push(this.lb_atk_up);
            this._jewelLevelTipArray.push(this.lb_hp_up);
            this._jewelLevelTipArray.push(this.lb_def_up);
            this._jewelLevelTipArray.push(this.lb_sdef_up);
            this._jewelArray.push(this.img_atk);
            this._jewelArray.push(this.img_hp);
            this._jewelArray.push(this.img_def);
            this._jewelArray.push(this.img_sdef);
            this._jewelArray.forEach(function (value, index, array) {
                value.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                    _this.showJewelTip(index);
                }, _this);
            }, this);
        };
        JewelView.prototype.checkRedDot = function () {
            var _this = this;
            this.jewelModel.heroheadRedPoint.forEach(function (value, index, array) {
                _this.hero_head.setRedTips(index, value);
            }, this);
            for (var i = 0; i < 10; i++) {
                if (this.jewelModel.equipPartRedPoint[this._curPos + 1][i + 1]) {
                    this._equipArray[i].showRedTips(true);
                }
                else {
                    this._equipArray[i].hideRedTips();
                }
            }
        };
        JewelView.prototype.showJewelTip = function (index) {
            var jewelInfo = this.heroModel.heroInfo[this._curPos].getJewelInfoByPart(this._curPart);
            if (!jewelInfo[index].stone_id) {
                this.showJewelWay(index);
            }
            else {
                var data = { heroId: this.heroModel.heroInfo[this._curPos].id, part: this._curPart, hole: jewelInfo[index].hole, id: jewelInfo[index].stone_id };
                // let view = new JewelTipView(data);
                // PopUpManager.addPopUp({ obj: view });
                App.WinManager.openWin(WinName.POP_JEWEL_TIP, { data: data });
            }
        };
        JewelView.prototype.showJewelWay = function (index) {
            var id = 1001;
            switch (index + 1) {
                case JewelType.ATTACK: {
                    id = 1001;
                    break;
                }
                case JewelType.LIFE: {
                    id = 1101;
                    break;
                }
                case JewelType.DEFENCE: {
                    id = 1201;
                    break;
                }
                case JewelType.MAGIC: {
                    id = 1301;
                    break;
                }
                default: break;
            }
            // let view = new ItemWay(ClientType.BASE_ITEM, id);
            // PopUpManager.addPopUp({ obj: view });
            App.GlobalTips.showItemWayTips(ClientType.BASE_ITEM, id);
        };
        //移动动画
        JewelView.prototype.moveAnimate = function (part) {
            var _this = this;
            var preItem = this._equipArray[part - 1];
            var item = new customui.BaseItem();
            item.x = preItem.x;
            item.y = preItem.y;
            item.updateBaseItem(ClientType.EQUIP, 0);
            // item.img_icon.source = preItem.img_icon.source;
            item.setItemIcon(preItem.getItemIcon());
            preItem.parent.addChild(item);
            egret.Tween.get(item).to({ x: 355, y: 175 }, 300, egret.Ease.sineOut).call(function () {
                if (item.parent) {
                    item.parent.removeChild(item);
                }
                _this.updateEquipView();
            }, this);
        };
        //选中框
        JewelView.prototype.setSelect = function () {
            if (this.img_select.parent) {
                this.img_select.parent.removeChild(this.img_select);
            }
            this.img_select.x = this._equipArray[this._curPart - 1].x - 50;
            this.img_select.y = this._equipArray[this._curPart - 1].y - 50;
            this._equipArray[this._curPart - 1].parent.addChild(this.img_select);
            this._equipArray[this._curPart - 1].parent.setChildIndex(this.img_select, 0);
        };
        JewelView.prototype.equipAnimate = function (info) {
            var _this = this;
            var _loop_2 = function (k) {
                var effectMc = new EffectMovieClip();
                effectMc.playMCKey("effbsxqcg", "", 1, null, null, function () {
                    if (effectMc.parent) {
                        effectMc.parent.removeChild(effectMc);
                    }
                    effectMc.destroy();
                }, this_2);
                this_2.gp_jewel.addChild(effectMc);
                effectMc.x = this_2._jewelArray[info.hole[k] - 1].x + 40;
                effectMc.y = this_2._jewelArray[info.hole[k] - 1].y + 40;
            };
            var this_2 = this;
            for (var k in info.hole) {
                _loop_2(k);
            }
            var effectMc2 = new EffectMovieClip();
            effectMc2.playMCKey("effbsxqcg", "", 1, null, null, function () {
                if (effectMc2.parent) {
                    effectMc2.parent.removeChild(effectMc2);
                }
                effectMc2.destroy();
                if (_this._playEffectArray.length > 0) {
                    _this.equipAnimate(_this._playEffectArray[0]);
                    _this._playEffectArray.shift();
                }
                else {
                    _this.touchChildren = true;
                }
            }, this);
            this.gp_equip.addChild(effectMc2);
            effectMc2.x = this._equipArray[info.part - 1].x;
            effectMc2.y = this._equipArray[info.part - 1].y;
        };
        JewelView.prototype.upgradeAnimate = function (index) {
            var effectMc = new EffectMovieClip();
            effectMc.playMCKey("effbssj", "", 1, null, null, function () {
                if (effectMc.parent) {
                    effectMc.parent.removeChild(effectMc);
                }
                effectMc.destroy();
            }, this);
            this.gp_jewel.addChild(effectMc);
            effectMc.x = this._jewelArray[index - 1].x + 38;
            effectMc.y = this._jewelArray[index - 1].y + 44;
        };
        JewelView.prototype.updateView = function (data) {
            if (data || data == 0) {
                this._curPos = data;
                this.updateEquip();
            }
            this.updateEquipView();
            // this.checkRedDot();
        };
        //接口成功返回，播放动画
        JewelView.prototype.upgradeSuccess = function (data) {
            if (data) {
                this.upgradeAnimate(data.hole);
            }
            this.updateView(null);
        };
        //接口成功返回，播放动画
        JewelView.prototype.oneEquipSuccess = function (data) {
            if (data) {
                var posArr = {}; //四个位置 哪个位置升级了
                for (var k in data.stone_info) {
                    var exist = false;
                    for (var j in data.stone_info[k].sotne_list) {
                        var info = data.stone_info[k].sotne_list[j];
                        if (info.stone_id) {
                            posArr[info.hole] = info.hole;
                            exist = true;
                        }
                    }
                    if (exist) {
                        //特殊处理衣服和头盔
                        if (this._playEffectArray.length > 0 && this._playEffectArray[this._playEffectArray.length - 1].part == 2 && data.stone_info[k].part == 3) {
                            this._playEffectArray.splice(this._playEffectArray.length - 1, 0, { hole: posArr, part: data.stone_info[k].part });
                        }
                        else {
                            this._playEffectArray.push({ hole: posArr, part: data.stone_info[k].part });
                        }
                    }
                }
                // for (let k in posArr) {
                // }
                if (this._playEffectArray.length > 0) {
                    this.equipAnimate(this._playEffectArray[0]);
                    this._playEffectArray.shift();
                    this.touchChildren = false;
                }
                else {
                    App.GlobalTips.showTips("没有可镶嵌的宝石");
                }
            }
            this.updateView(null);
        };
        //切换角色时 更新装备信息
        JewelView.prototype.updateEquip = function () {
            for (var i = 0; i < 10; i++) {
                var item = this._equipArray[i];
                var equipInfo = this.heroModel.heroInfo[this._curPos].getPartInfoByPart(i + 1);
                if (this.heroModel.heroInfo[this._curPos].equipExist(i + 1) >= 0) {
                    item.updateBaseItem(ClientType.EQUIP, equipInfo.good_id, null, equipInfo);
                    item.setCarrerIconVisible(false);
                    item.setStarLvVisible(false);
                }
                else {
                    item.updateBaseItem(ClientType.EQUIP, 0, null, equipInfo);
                    item.setStarLvVisible(false);
                    // RES.getResAsync(ConstEquipIcon[i + 1] + "_png", (texture) => {
                    // 	item.img_icon.source = texture;
                    // }, this);
                    item.setItemIcon(ConstEquipIcon[i + 1] + "_png");
                }
            }
        };
        //更新整个界面
        JewelView.prototype.updateEquipView = function () {
            this.checkRedDot();
            var heroInfo = this.heroModel.heroInfo[this._curPos];
            var pos = heroInfo.equipExist(this._curPart);
            if (this._curPos <= this.heroModel.heroInfo.length - 1) {
                this.bmlb_cap.text = String(heroInfo.score);
            }
            else {
                this.bmlb_cap.text = "";
            }
            this.setSelect();
            if (pos >= 0) {
                this.baseItem_equip.updateBaseItem(ClientType.EQUIP, heroInfo.equip_info[pos].good_id, null);
                this.baseItem_equip.setStrengthLvVisible(false);
                this.baseItem_equip.setCarrerIconVisible(false);
            }
            else {
                this.baseItem_equip.updateBaseItem(ClientType.EQUIP, 0, null);
                this.baseItem_equip.setStrengthLvVisible(false);
                // RES.getResAsync(ConstEquipIcon[this._curPart] + "_png", (texture) => {
                // 	this.baseItem_equip.img_icon.source = texture;
                // }, this);
                this.baseItem_equip.setItemIcon(ConstEquipIcon[this._curPart] + "_png");
            }
            var jewelInfo = heroInfo.getJewelInfoByPart(this._curPart);
            var nameArr = [{ text: ConstJewelName[1] + "\n" }, { text: ConstJewelName[2] + "\n" }, { text: ConstJewelName[3] + "\n" }, { text: ConstJewelName[4] + "\n" }];
            var attrArr = [{ text: "未激活" + "\n", style: {} }, { text: "未激活" + "\n", style: {} }, { text: "未激活" + "\n", style: {} }, { text: "未激活" + "\n", style: {} }];
            for (var i = 0; i < jewelInfo.length; i++) {
                var info = App.ConfigManager.getJewelInfoById(jewelInfo[i].stone_id);
                if (info) {
                    nameArr[i] = { text: info.name + "\n" };
                    if (jewelInfo[i].hole == JewelType.ATTACK) {
                        if (heroInfo.job == CareerType.SOLDIER) {
                            attrArr[i] = { text: "+" + info["ac"] + "\n", style: { textColor: 0x0de903 } };
                        }
                        else if (heroInfo.job == CareerType.MAGES) {
                            attrArr[i] = { text: "+" + info["mac"] + "\n", style: { textColor: 0x0de903 } };
                        }
                        else if (heroInfo.job == CareerType.TAOIST) {
                            attrArr[i] = { text: "+" + info["sc"] + "\n", style: { textColor: 0x0de903 } };
                        }
                    }
                    else if (jewelInfo[i].hole == JewelType.LIFE) {
                        attrArr[i] = { text: "+" + info["hp"] + "\n", style: { textColor: 0x0de903 } };
                    }
                    else if (jewelInfo[i].hole == JewelType.DEFENCE) {
                        attrArr[i] = { text: "+" + info["def"] + "\n", style: { textColor: 0x0de903 } };
                    }
                    else if (jewelInfo[i].hole == JewelType.MAGIC) {
                        attrArr[i] = { text: "+" + info["sdef"] + "\n", style: { textColor: 0x0de903 } };
                    }
                    this.changeJewelGroup(i, true, jewelInfo[i].stone_id);
                }
                else {
                    this.changeJewelGroup(i, false, jewelInfo[i].stone_id);
                }
            }
            this.lb_name.textFlow = nameArr;
            this.lb_attr.textFlow = attrArr;
            // let itemInfo = App.ConfigManager.getItemInfoById(jewelInfo.id);
        };
        //改变界面宝石状态
        JewelView.prototype.changeJewelGroup = function (index, status, id) {
            var _this = this;
            var info = App.ConfigManager.getItemInfoById(id);
            if (status) {
                this._jewelLevelArray[index].visible = true;
                this._jewelLevelArray[index].text = "LV." + info.limit_lv;
                RES.getResAsync(ConstJewelIcon[index + 1] + "_png", function (texture) {
                    _this._jewelArray[index].source = texture;
                }, this);
                // RES.getResAsync(ConstJewelIcon[index + 1].replace("_l_", "_s_") + "_png", (texture) => {
                // 	(<eui.Image>this.gp_middle.getChildAt(3 + index)).source = texture;
                // }, this);
                var numInfo = game.BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, id);
                if (numInfo) {
                    var maxLevel = App.ConfigManager.getConstConfigByType("JEWEL_LEVEL_MAX").value;
                    var baseInfo = App.ConfigManager.getItemInfoById(id);
                    if (numInfo.num >= 2 && baseInfo.limit_lv < maxLevel) {
                        this._jewelLevelTipArray[index].visible = true;
                    }
                    else {
                        this._jewelLevelTipArray[index].visible = false;
                    }
                }
                else {
                    this._jewelLevelTipArray[index].visible = false;
                }
            }
            else {
                this._jewelLevelTipArray[index].visible = false;
                this._jewelLevelArray[index].visible = false;
                RES.getResAsync(ConstJewelIcon[index + 1] + "_hui_png", function (texture) {
                    _this._jewelArray[index].source = texture;
                }, this);
                // RES.getResAsync(ConstJewelIcon[index + 1].replace("_l_", "_s_") + "_hui_png", (texture) => {
                // 	(<eui.Image>this.gp_middle.getChildAt(3 + index)).source = texture;
                // }, this);
            }
        };
        /**
         * 打开窗口
         */
        JewelView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (this.com_baseview) {
                this.com_baseview.winVo = this.winVo;
            }
            this.hero_head.readyOpen();
            if (this._handleId == 0) {
                this._handleId = App.EventSystem.addEventListener(PanelNotify.HERO_ON_HERO_SELECT, this.updateView, this);
            }
            App.EventSystem.addEventListener(PanelNotify.JEWEL_UPDATE_VIEW, this.upgradeSuccess, this);
            App.EventSystem.addEventListener(PanelNotify.JEWEL_UPDATE_ALL_VIEW, this.oneEquipSuccess, this);
        };
        /**
         * 关闭窗口
         */
        JewelView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        JewelView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
            this.hero_head.clear();
            if (this._handleId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.HERO_ON_HERO_SELECT, this._handleId);
                this._handleId = 0;
            }
            App.EventSystem.removeEventListener(PanelNotify.JEWEL_UPDATE_VIEW);
            App.EventSystem.removeEventListener(PanelNotify.JEWEL_UPDATE_ALL_VIEW);
            if (this.com_baseview) {
                this.com_baseview.destroy();
            }
        };
        /**
         * 销毁
         */
        JewelView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return JewelView;
    }(BaseView));
    game.JewelView = JewelView;
    __reflect(JewelView.prototype, "game.JewelView");
})(game || (game = {}));
//# sourceMappingURL=JewelView.js.map
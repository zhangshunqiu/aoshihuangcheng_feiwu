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
 * module : 英雄模块
 * author ：zrj
*/
var game;
(function (game) {
    var HeroView = (function (_super) {
        __extends(HeroView, _super);
        function HeroView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this.equipArray = [];
            _this._specialArray = []; //6件特殊装备
            _this._specialArrayEffect = []; //6件特殊装备
            _this.heroModel = game.HeroModel.getInstance();
            _this.curPos = 0;
            _this._handleId = 0;
            _this._skillHandleId = 0;
            return _this;
        }
        HeroView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            // RES.getResAsync("equipping_biaoti_png", (texture) => {
            // 	this.com_baseview.img_title.texture = texture;
            // }, this);
            // this.img_close = this.com_baseview.img_close;
            this.initView();
        };
        HeroView.prototype.initView = function () {
            var _this = this;
            this.btn_role.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                // App.WinManager.openWin(WinName.WING);
                _this.gp_equip.visible = true;
                _this.gp_reborn.visible = false;
                _this.gp_skill.visible = false;
                _this.btn_role.currentState = "down";
                _this.btn_skill.currentState = "up";
                _this.btn_reborn.currentState = "up";
                // RES.getResAsync("equipping_biaoti_png", (texture) => {
                // 	this.com_baseview.img_title.texture = texture;
                // }, this);
                _this.updateEquipView();
            }, this);
            // this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
            // 	App.WinManager.closeWin(WinName.HERO);
            // }, this);
            this.img_detail.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openHeroAttribute, this);
            this.btn_ruby.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                App.WinManager.openWin(WinName.JEWEL);
            }, this);
            this.btn_artifact.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                App.WinManager.openWin(WinName.ARTIFACT);
            }, this);
            this.btn_orange.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                App.WinManager.openWin(WinName.RAIDER, { lastModule: WinName.HERO, index: 1 });
            }, this);
            //一键换装
            this.btn_reloading.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                var arr = [];
                var tempDic = _this.heroModel.changeBestEquip(_this.heroModel.curPos);
                for (var key in tempDic) {
                    if (tempDic[key]) {
                        arr.push({ part: Number(key), player_good_id: tempDic[key].id });
                    }
                }
                App.Socket.send(15015, { id: _this.heroModel.getCurHero().id, wear_list: arr });
            }, this);
            this.btn_skill.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                _this.gp_equip.visible = false;
                _this.gp_reborn.visible = false;
                _this.gp_skill.visible = true;
                //去拿技能数据
                App.Socket.send(12001, _this.heroModel.heroInfo[_this.curPos].id);
                _this.btn_skill.currentState = "down";
                _this.btn_reborn.currentState = "up";
                _this.btn_role.currentState = "up";
                // RES.getResAsync("skill_title_png", (texture) => {
                // 	this.com_baseview.img_title.texture = texture;
                // }, this);
            }, this);
            this.btn_reborn.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                if (!_this._rebornView) {
                    _this._rebornView = new game.RebornView();
                    _this.gp_reborn.addChild(_this._rebornView);
                }
                _this.hero_head.visible = false;
                _this.gp_equip.visible = false;
                _this.gp_reborn.visible = true;
                _this.gp_skill.visible = false;
                //去拿转生数据
                _this.btn_skill.currentState = "up";
                _this.btn_reborn.currentState = "down";
                _this.btn_role.currentState = "up";
                // RES.getResAsync("reborn_zhuansheng_title_png", (texture) => {
                // 	this.com_baseview.img_title.texture = texture;
                // }, this);
            }, this);
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.ROLE_SKILL, this.btn_skill);
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.ROLE_EQUIP, this.btn_role);
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.ROLE_RUBY, this.btn_ruby);
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.ROLE_REBORN, this.btn_reborn);
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.ROLE_ORANGEEQUIP, this.btn_orange);
            this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                if (_this.gp_equip.visible) {
                    App.WinManager.closeWin(WinName.HERO);
                }
                _this.gp_equip.visible = true;
                _this.gp_skill.visible = false;
                _this.gp_reborn.visible = false;
                _this.hero_head.visible = true;
                _this.btn_reborn.currentState = "up";
                _this.btn_skill.currentState = "up";
                // RES.getResAsync("equipping_juese_title_png", (texture) => {
                // 	this.com_baseview.img_title.texture = texture;
                // }, this);
            }, this);
            if (this.heroModel.curPos != undefined) {
                this.curPos = this.heroModel.curPos;
            }
            this.btn_role.currentState = "down";
            this.gp_equip.visible = true;
            this.gp_skill.visible = false;
            this.gp_reborn.visible = false;
            this.bgEffanniu();
            this.initEquip();
            this.initSpecialEquip();
            this.updateEquipView();
            this.updateSpecialEquipView();
            this.updateModelView();
            this.validateNow();
            this.combatEff();
        };
        HeroView.prototype.combatEff = function () {
            this._combatEff = new EffectMovieClip();
            this._combatEff.x = 123;
            this._combatEff.y = 10;
            this._combatEff.scaleX = 1;
            this._combatEff.scaleY = 1;
            this.gp_combat.addChildAt(this._combatEff, 1);
            this._combatEff.playMCKey("effjspf", "", -1, null, null, null, this);
            this._combatEff.frameRate = 10;
        };
        HeroView.prototype.bgEffanniu = function () {
            var _this = this;
            this._bgEffanniu = new EffectMovieClip();
            this._bgEffanniu.x = -148;
            this._bgEffanniu.y = -210;
            this.gp_reloading.addChild(this._bgEffanniu);
            this._bgEffanniu.playMCKey("effttyyjhz", "", -1, null, function () {
                _this._bgEffanniu.frameRate = 10;
            }, null, this);
            // this._bgEffanniu.frameRate = 10;
        };
        HeroView.prototype.initEquip = function () {
            var _this = this;
            var _loop_1 = function (i) {
                var item = new customui.BaseItem();
                item.setItemNameVisible(true);
                item.setItemNameAtt({ y: 88 }); //改一下显示位置
                item.width = item.height = 90;
                if (i % 2 != 0) {
                    item.left = 50;
                }
                else {
                    item.right = 50;
                }
                item.y = 34 + (Math.floor((i - 1) / 2) * (item.height + 17));
                //特殊处理衣服和头盔
                if (i == 2) {
                    item.right = undefined;
                    item.left = 50;
                    item.y = 34 + (Math.floor((i + 1 - 1) / 2) * (item.height + 17));
                }
                else if (i == 3) {
                    item.left = undefined;
                    item.right = 50;
                    item.y = 34 + (Math.floor((i - 1 - 1) / 2) * (item.height + 17));
                }
                this_1.gp_equip.addChild(item);
                item.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                    if (_this.heroModel.heroInfo.length <= _this.heroModel.curPos) {
                        return;
                    }
                    _this.openEquip(i);
                }, this_1);
                this_1.equipArray.push(item);
            };
            var this_1 = this;
            for (var i = 1; i <= 10; i++) {
                _loop_1(i);
            }
        };
        HeroView.prototype.initSpecialEquip = function () {
            var _this = this;
            var _loop_2 = function (i) {
                //装备框
                var item = new customui.BaseItem();
                item.setItemNameAtt({ y: 88 }); //改一下位置
                item.setItemNameAtt({ textColor: 0xffa200 });
                item.width = item.height = 90;
                //特效
                var effect = new EffectMovieClip();
                effect.scaleX = effect.scaleY = 0.4;
                effect.x = 45;
                effect.y = 50;
                effect.touchEnabled = false;
                effect.playMCKey(ConstSpecialEquipEffect[i], "", -1, null, function () {
                    effect.frameRate = 8;
                }, null, this_2);
                item.addChild(effect);
                this_2._specialArrayEffect.push(effect);
                if (i <= 4) {
                    if (i % 2 != 0) {
                        item.left = 160;
                    }
                    else {
                        item.right = 160;
                    }
                    item.y = 462 + (Math.floor((i - 1) / 2) * (item.height + 17));
                }
                else if (i == 5) {
                    item.left = 50;
                    item.y = 34 + 5 * (item.height + 17);
                    effect.scaleX = effect.scaleY = 0.5;
                    // effect.x = 50;
                    effect.y = 45;
                }
                else if (i == 6) {
                    item.right = 50;
                    item.y = 34 + 5 * (item.height + 17);
                    effect.scaleX = effect.scaleY = 0.5;
                    // effect.x = 50;
                    effect.y = 45;
                }
                this_2.gp_equip.addChild(item);
                item.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                    _this.openSpecialEquip(i);
                }, this_2);
                this_2._specialArray.push(item);
            };
            var this_2 = this;
            for (var i = 1; i <= 6; i++) {
                _loop_2(i);
            }
        };
        //装备相关
        HeroView.prototype.openEquip = function (part) {
            game.HeroModel.getInstance().curPart = part;
            var info = game.HeroModel.getInstance().getHeroEquipByPosPart(this.curPos, part);
            var type = game.EquipModel.getInstance().getTypeByPos(part);
            var career = this.heroModel.heroInfo[this.heroModel.curPos].job;
            // let career = 1;
            if (info) {
                App.WinManager.openWin(WinName.EQUIP, { type: 1, id: info.good_id, uuid: info.id, part: part });
            }
            else {
                // let view = new EquipSelect(career, part, this.heroModel.heroInfo[this.heroModel.curPos].sex);
                // PopUpManager.addPopUp({ obj: view, effectType: 0 });
                App.WinManager.openWin(WinName.POP_EQUIP_SELECT, { career: career, type: part, sex: this.heroModel.heroInfo[this.heroModel.curPos].sex });
                // App.GlobalTips.showTips("没有可穿戴装备");
            }
        };
        //打开特殊装备
        HeroView.prototype.openSpecialEquip = function (part) {
            var info = game.HeroModel.getInstance().getHeroSpecialEquipByPosPart(this.curPos, part);
            if (info && info.id) {
                App.WinManager.openWin(WinName.EQUIP_SPECIAL, { part: part, isActive: true });
            }
            else {
                App.WinManager.openWin(WinName.EQUIP_SPECIAL, { part: part, isActive: false });
            }
        };
        HeroView.prototype.checkRedDot = function () {
            var _this = this;
            this.hero_head.clearAllRedTips();
            if (this.gp_equip.visible) {
                this.heroModel.heroHeadRedDot.forEach(function (value, index, array) {
                    var value2 = _this.heroModel.heroHeadRedDot2[index];
                    _this.hero_head.setRedTips(index, value || value2);
                }, this);
                //红点显示
                this._bgEffanniu.visible = false;
                for (var i = 1; i <= 10; i++) {
                    if (this.heroModel.heroEquipPartRedDot[this.curPos][i - 1]) {
                        this.equipArray[i - 1].showRedTips(true);
                        this._bgEffanniu.visible = true;
                    }
                    else {
                        this.equipArray[i - 1].hideRedTips();
                        if (!this._bgEffanniu.visible) {
                            this._bgEffanniu.visible = false;
                        }
                    }
                }
                for (var i = 1; i <= 6; i++) {
                    if (this.heroModel.heroSpecialEquipPartRedDot[this.curPos][i - 1]) {
                        this._specialArray[i - 1].showRedTips(true);
                    }
                    else {
                        this._specialArray[i - 1].hideRedTips();
                    }
                }
                this.heroModel.checkNewPartner();
                if (this.heroModel.heroHeadFrame[0]) {
                    this.hero_head.setNewPartnerTip(0, true);
                }
                else {
                    this.hero_head.setNewPartnerTip(0, false);
                }
                if (this.heroModel.heroHeadFrame[1]) {
                    this.hero_head.setNewPartnerTip(1, true);
                }
                else {
                    this.hero_head.setNewPartnerTip(1, false);
                }
            }
            else if (this.gp_skill.visible) {
                game.SkillModel.getInstance().heroHeadRedDot.forEach(function (value, index, array) {
                    var value2 = _this.heroModel.heroHeadRedDot2[index];
                    _this.hero_head.setRedTips(index, value || value2);
                }, this);
                this.heroModel.checkNewPartner();
                if (this.heroModel.heroHeadFrame[0]) {
                    this.hero_head.setNewPartnerTip(0, true);
                }
                else {
                    this.hero_head.setNewPartnerTip(0, false);
                }
                if (this.heroModel.heroHeadFrame[1]) {
                    this.hero_head.setNewPartnerTip(1, true);
                }
                else {
                    this.hero_head.setNewPartnerTip(1, false);
                }
            }
        };
        HeroView.prototype.updateView = function (data) {
            this.curPos = data;
            if (this.gp_equip.visible) {
                this.updateEquipView();
                this.updateSpecialEquipView();
                this.updateModelView();
                // this.checkRedDot();
            }
            else if (this.gp_skill.visible) {
                this.skillPanel.changeList();
                this.checkRedDot();
            }
        };
        HeroView.prototype.updateEquipView = function () {
            this.checkRedDot();
            if (this.curPos <= this.heroModel.heroInfo.length - 1) {
                this.bmlb_cap.text = String(this.heroModel.heroInfo[this.curPos].score);
            }
            else {
                this.bmlb_cap.text = "";
            }
            for (var i = 1; i <= 10; i++) {
                var info = game.HeroModel.getInstance().getHeroEquipByPosPart(this.curPos, i);
                if (info) {
                    var baseInfo = game.EquipModel.getInstance().getEquipInfoById(info.good_id);
                    this.equipArray[i - 1].updateBaseItem(ClientType.EQUIP, baseInfo.id, null, info);
                    this.equipArray[i - 1].setCarrerIconVisible(false);
                    this.equipArray[i - 1].setItemName("Lv." + baseInfo.limit_lvl);
                    this.equipArray[i - 1].setItemNameAtt({ textColor: 0xbfb294, size: 20 });
                    this.equipArray[i - 1].setItemNameVisible(true);
                    // this.equipArray[i - 1].lb_type.visible = false;
                    //转生 
                    if (baseInfo.reincarnation != 0) {
                        this.equipArray[i - 1].setItemName(baseInfo.reincarnation + "转");
                    }
                }
                else {
                    var partInfo = this.heroModel.heroInfo[this.heroModel.curPos].getPartInfoByPart(i);
                    this.equipArray[i - 1].updateBaseItem(ClientType.EQUIP, 0, null, partInfo);
                    // this.equipArray[i - 1].lb_type.visible = true;
                    this.equipArray[i - 1].setItemNameVisible(false);
                    this.equipArray[i - 1].setItemIcon(ConstEquipIcon[i]);
                    var type = game.EquipModel.getInstance().getTypeByPos(i);
                    // this.equipArray[i - 1].lb_type.text = ConstEquipType[type];
                    var pos = this.curPos;
                    // RES.getResAsync("equipping_jiahao_png", (texture) => {
                    // 	if (this.heroModel.getHeroEquipByPosPart(pos, i)) {
                    // 		return;
                    // 	}
                    // 	this.equipArray[i - 1].setItemIcon(texture);
                    // 	this.equipArray[i - 1].img_icon.visible = true;
                    // 	this.equipArray[i - 1].img_frame.source = RES.getRes("common_default_png");
                    // }, this);
                }
            }
        };
        HeroView.prototype.updateSpecialEquipView = function () {
            for (var i = 1; i <= 6; i++) {
                var info = game.HeroModel.getInstance().getHeroSpecialEquipByPosPart(this.curPos, i);
                if (info) {
                    UIActionManager.setGrey(this._specialArrayEffect[i - 1], false);
                    this._specialArray[i - 1].updateBaseItem(ClientType.EQUIP, 0, null);
                    // this._specialArray[i - 1].lb_name.visible = false;
                    this._specialArray[i - 1].setItemName(ConstSpecialEquipType[i]);
                    this._specialArray[i - 1].setItemIcon("");
                }
                else {
                    // let partInfo = this.heroModel.heroInfo[this.heroModel.curPos].getPartInfoByPart(i);
                    UIActionManager.setGrey(this._specialArrayEffect[i - 1], true);
                    this._specialArray[i - 1].updateBaseItem(ClientType.EQUIP, 0, null);
                    // this._specialArray[i - 1].lb_name.visible = false;
                    this._specialArray[i - 1].setItemName(ConstSpecialEquipType[i]);
                    this._specialArray[i - 1].setItemIcon("");
                }
            }
        };
        //更新人物和武器模型
        HeroView.prototype.updateModelView = function () {
            var _this = this;
            var heroInfo = this.heroModel.heroInfo[this.heroModel.curPos];
            var wingId = heroInfo.getWingModelId();
            var weaponId = heroInfo.getWeaponModelId();
            var clothId = heroInfo.getClothModelId();
            if (wingId) {
                RES.getResAsync(wingId + "_png", function (texture) {
                    _this.img_wing.source = texture;
                    _this.img_wing.touchEnabled = false;
                }, this);
            }
            else {
                this.img_wing.source = "";
            }
            if (weaponId) {
                RES.getResAsync(weaponId + "_png", function (texture) {
                    _this.img_weapon.source = texture;
                    _this.img_weapon.touchEnabled = false;
                }, this);
            }
            else {
                this.img_weapon.source = "";
            }
            if (clothId) {
                RES.getResAsync(clothId + "_png", function (texture) {
                    _this.img_body.source = texture;
                    _this.img_body.touchEnabled = false;
                }, this);
            }
            else {
                if (heroInfo.sex == ConstSex.MAN) {
                    RES.getResAsync("1700" + "_png", function (texture) {
                        _this.img_body.source = texture;
                        _this.img_body.touchEnabled = false;
                    }, this);
                }
                else {
                    RES.getResAsync("1800" + "_png", function (texture) {
                        _this.img_body.source = texture;
                        _this.img_body.touchEnabled = false;
                    }, this);
                }
            }
        };
        //技能相关
        HeroView.prototype.closeSkillPanel = function () {
            this.gp_skill.visible = false;
            this.gp_equip.visible = true;
            // RES.getResAsync("equiping_title_png", (texture) => {
            // 	this.com_baseview.img_title.texture = texture;
            // }, this);
            this.btn_skill.currentState = "up";
            this.updateView(this.curPos);
        };
        //打开详细属性
        HeroView.prototype.openHeroAttribute = function () {
            var view = new game.HeroAttributeView();
            EventSystem.getInstance().dispatchEvent(WinManagerEvent.WIN_ADD, new WinManagerEvent(new WinManagerVO("", "", WinLay.MODULE_LAY), view));
        };
        HeroView.prototype.checkGuide = function () {
            //引导装备武器
            App.GuideManager.bindClickBtn(this.equipArray[0], 1000, 2);
            App.GuideManager.bindClickBtn(this.img_close, 1000, 4);
            App.GuideManager.checkGuide(1000);
            //引导装备衣服
            App.GuideManager.bindClickBtn(this.equipArray[1], 1002, 2);
            App.GuideManager.bindClickBtn(this.img_close, 1002, 4);
            App.GuideManager.checkGuide(1002);
            //引导技能升级
            App.GuideManager.bindClickBtn(this.img_close, 1005, 3);
            App.GuideManager.checkGuide(1005);
        };
        HeroView.prototype.removeGuide = function () {
            App.GuideManager.removeClickBtn(1000, 2);
            App.GuideManager.removeClickBtn(1000, 4);
            App.GuideManager.removeClickBtn(1002, 2);
            App.GuideManager.removeClickBtn(1002, 4);
            App.GuideManager.removeClickBtn(1005, 3);
            this.skillPanel.removeGuide();
        };
        /**
         * 打开窗口
         * @ openParam.type   1:角色  2：技能  4:重生
         */
        HeroView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            // App.Socket.send(15001,{});
            this.hero_head.readyOpen();
            if (this.com_baseview) {
                this.com_baseview.winVo = this.winVo;
            }
            if (openParam && openParam.type) {
                if (openParam.type == 1) {
                }
                else if (openParam.type == 2) {
                    this.btn_skill.dispatchEvent(new egret.TouchEvent(egret.TouchEvent.TOUCH_TAP));
                }
                else if (openParam.type == 4) {
                    this.btn_reborn.dispatchEvent(new egret.TouchEvent(egret.TouchEvent.TOUCH_TAP));
                }
            }
            if (!this._handleId) {
                this._handleId = App.EventSystem.addEventListener(PanelNotify.HERO_ON_HERO_SELECT, this.updateView, this);
            }
            if (!this._skillHandleId) {
                this._skillHandleId = App.EventSystem.addEventListener(PanelNotify.HERO_UPDATE_SKILL_PANEL, this.checkRedDot, this);
            }
            App.EventSystem.addEventListener(PanelNotify.HERO_CLOSE_SKILL_PANEL, this.closeSkillPanel, this);
            App.EventSystem.addEventListener(PanelNotify.HERO_ACTIVE_SPECIAL, this.updateSpecialEquipView, this);
            this.checkGuide();
        };
        /**
         * 关闭窗口
         */
        HeroView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        HeroView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            this.hero_head.clear();
            if (this.com_baseview) {
                this.com_baseview.destroy();
            }
            if (this._handleId) {
                App.EventSystem.removeEventListener(PanelNotify.HERO_ON_HERO_SELECT, this._handleId);
                this._handleId = undefined;
            }
            if (this._skillHandleId) {
                App.EventSystem.removeEventListener(PanelNotify.HERO_UPDATE_SKILL_PANEL, this._skillHandleId);
                this._skillHandleId = undefined;
            }
            App.EventSystem.removeEventListener(PanelNotify.HERO_CLOSE_SKILL_PANEL);
            App.EventSystem.removeEventListener(PanelNotify.HERO_ACTIVE_SPECIAL);
            this.removeGuide();
        };
        /**
         * 销毁
         */
        HeroView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            if (this._bgEffanniu) {
                this._bgEffanniu.destroy();
                this._bgEffanniu = null;
                delete this._bgEffanniu;
            }
            this._specialArrayEffect.forEach(function (value, index, array) {
                value.destroy();
            }, this);
            if (this._combatEff) {
                this._combatEff.parent.removeChild(this._combatEff);
                this._combatEff.destroy();
                this._combatEff = null;
            }
        };
        return HeroView;
    }(BaseView));
    game.HeroView = HeroView;
    __reflect(HeroView.prototype, "game.HeroView");
})(game || (game = {}));
//# sourceMappingURL=HeroView.js.map
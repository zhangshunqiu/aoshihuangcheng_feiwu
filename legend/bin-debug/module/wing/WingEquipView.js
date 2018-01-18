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
var game;
(function (game) {
    var WingEquipView = (function (_super) {
        __extends(WingEquipView, _super);
        function WingEquipView(skinName) {
            var _this = _super.call(this, "WingEquipSkin") || this;
            _this.wingModel = game.WingModel.getInstance();
            _this.backpackModel = game.BackpackModel.getInstance();
            _this._eventId1 = 0; //事件id
            _this._changeHeroEventId = 0; //事件id;
            return _this;
        }
        WingEquipView.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            this.btn_wear.addEventListener(egret.TouchEvent.TOUCH_TAP, this.wearEquip, this); //一键穿戴羽翼装备
            this.img_zhengyu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openZhengyuTip, this); //打开正羽提示框
            this.img_fuyu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openFuyuTip, this); //打开副羽提示框
            this.img_rongyu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openRongyuTip, this); //打开绒羽提示框
            this.img_xuyu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openXuyuTip, this); //打开须羽提示框
            this.img_perfectWing.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openWingPerfectTip, this); //打开完美神羽提示框
            this.img_wingSkill.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openWingEquipSkill, this); //打开羽翼技能
            this.btn_compose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.wingEquipCompose, this);
            this.img_zhengyu_bg.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.getWingEquipWay(201);
            }, this);
            this.img_fuyu_bg.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.getWingEquipWay(301);
            }, this);
            this.img_rongyu_bg.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.getWingEquipWay(401);
            }, this);
            this.img_xuyu_bg.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.getWingEquipWay(501);
            }, this);
            // this.updateWingEquip();
            this.changeHero(game.HeroModel.getInstance().curPos);
        };
        /**
         * 切换英雄
         */
        WingEquipView.prototype.changeHero = function (curPos) {
            this.wingModel.wingInfo = this.wingModel.wingInfoObj[game.HeroModel.getInstance().heroInfo[curPos].id];
            this.wingModel.wingInfo.currentStar = this.wingModel.wingInfo.star || 0;
            this.wingModel.wingInfo.currentWingEquip = this.wingModel.wingInfo.wingEquip;
            this.updateWingEquip();
        };
        /**
         * 判断攻击类型，物理、法术、道术
         */
        WingEquipView.prototype.judgeAttackType = function () {
            var attackName;
            var attackType;
            switch (game.HeroModel.getInstance().heroInfo[game.HeroModel.getInstance().curPos].job) {
                case 1:
                    attackName = ConstAttribute.ac;
                    attackType = "ac";
                    break;
                case 2:
                    attackName = ConstAttribute.mac;
                    attackType = "mac";
                    break;
                case 3:
                    attackName = ConstAttribute.sc;
                    attackType = "sc";
                    break;
            }
            return [attackName, attackType];
        };
        WingEquipView.prototype.updateWingEquip = function () {
            // this.btlb_equipScore.text = //羽翼装备评分
            this.img_wing.source = this.wingModel.wingInfo.photo + "_png"; //更新羽翼图片
            var wingEquip = this.wingModel.wingInfo.wingEquip;
            for (var i = 0; i < wingEquip.length; i++) {
                switch (wingEquip[i].pos) {
                    case 1:
                        if (wingEquip[i].good_id) {
                            this.img_zhengyu.visible = true;
                            this.img_zhengyu_bg.visible = false;
                            this.img_zhengyuframe.source = QualityFrame[this.wingModel.wingInfo.WingEquipStep.zhengyuQuality];
                            // this.lb_zhengyu.text = this.wingModel.wingInfo.WingEquipStep.zhengyuStep + "阶";
                            this.img_zhengyuStepText.source = "wing_" + (wingEquip[i].good_id - 200) + "_png";
                            if (this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, wingEquip[i].good_id)) {
                                if (this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, wingEquip[i].good_id).num >= 2) {
                                    this.gp_zhengyuStep.visible = true;
                                }
                                else {
                                    this.gp_zhengyuStep.visible = false;
                                }
                            }
                            else {
                                this.gp_zhengyuStep.visible = false;
                            }
                        }
                        else {
                            this.img_zhengyu.visible = false;
                            this.img_zhengyu_bg.visible = true;
                            this.img_zhengyuframe.source = "common_default_png";
                            this.img_zhengyuStepText.source = "";
                            // this.lb_zhengyu.text = "";
                            this.gp_zhengyuStep.visible = false;
                        }
                        break;
                    case 2:
                        if (wingEquip[i].good_id) {
                            this.img_fuyu.visible = true;
                            this.img_fuyu_bg.visible = false;
                            this.img_fuyuframe.source = QualityFrame[this.wingModel.wingInfo.WingEquipStep.fuyuQuality];
                            this.img_fuyuStepText.source = "wing_" + (wingEquip[i].good_id - 300) + "_png";
                            // this.lb_fuyu.text = this.wingModel.wingInfo.WingEquipStep.fuyuStep + "阶";
                            if (this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, wingEquip[i].good_id)) {
                                if (this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, wingEquip[i].good_id).num >= 2) {
                                    this.gp_fuyuStep.visible = true;
                                }
                                else {
                                    this.gp_fuyuStep.visible = false;
                                }
                            }
                            else {
                                this.gp_fuyuStep.visible = false;
                            }
                        }
                        else {
                            this.img_fuyu.visible = false;
                            this.img_fuyu_bg.visible = true;
                            this.img_fuyuframe.source = "common_default_png";
                            this.img_fuyuStepText.source = "";
                            // this.lb_fuyu.text = "";
                            this.gp_fuyuStep.visible = false;
                        }
                        break;
                    case 3:
                        if (wingEquip[i].good_id) {
                            this.img_rongyu.visible = true;
                            this.img_rongyu_bg.visible = false;
                            this.img_rongyuframe.source = QualityFrame[this.wingModel.wingInfo.WingEquipStep.rongyuQuality];
                            this.img_rongyuStepText.source = "wing_" + (wingEquip[i].good_id - 400) + "_png";
                            // this.lb_rongyu.text = this.wingModel.wingInfo.WingEquipStep.rongyuStep + "阶";
                            if (this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, wingEquip[i].good_id)) {
                                if (this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, wingEquip[i].good_id).num >= 2) {
                                    this.gp_rongyuStep.visible = true;
                                }
                                else {
                                    this.gp_rongyuStep.visible = false;
                                }
                            }
                            else {
                                this.gp_rongyuStep.visible = false;
                            }
                        }
                        else {
                            this.img_rongyu.visible = false;
                            this.img_rongyu_bg.visible = true;
                            this.img_rongyuframe.source = "common_default_png";
                            this.img_rongyuStepText.source = "";
                            // this.lb_rongyu.text = "";
                            this.gp_rongyuStep.visible = false;
                        }
                        break;
                    case 4:
                        if (wingEquip[i].good_id) {
                            this.img_xuyu.visible = true;
                            this.img_xuyu_bg.visible = false;
                            this.img_xuyuframe.source = QualityFrame[this.wingModel.wingInfo.WingEquipStep.xuyuQuality];
                            this.img_xuyuStepText.source = "wing_" + (wingEquip[i].good_id - 500) + "_png";
                            // this.lb_xuyu.text = this.wingModel.wingInfo.WingEquipStep.xuyuStep + "阶";
                            if (this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, wingEquip[i].good_id)) {
                                if (this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, wingEquip[i].good_id).num >= 2) {
                                    this.gp_xuyuStep.visible = true;
                                }
                                else {
                                    this.gp_xuyuStep.visible = false;
                                }
                            }
                            else {
                                this.gp_xuyuStep.visible = false;
                            }
                        }
                        else {
                            this.img_xuyu.visible = false;
                            this.img_xuyu_bg.visible = true;
                            this.img_xuyuframe.source = "common_default_png";
                            this.img_xuyuStepText.source = "";
                            // this.lb_xuyu.text = "";
                            this.gp_xuyuStep.visible = false;
                        }
                        break;
                }
                if (this.wingModel.wingInfo.currentWingEquip[i] && wingEquip[i].good_id != this.wingModel.wingInfo.currentWingEquip[i].good_id) {
                    this.wingEquipWearMc(wingEquip[i].pos);
                }
            }
            this.updateWingEquipAttr();
            this.wingModel.wingInfo.currentWingEquip = this.wingModel.wingInfo.wingEquip;
        };
        WingEquipView.prototype.wingEquipWearMc = function (pos) {
            switch (pos) {
                case 1:
                    if (this._zhengyuMc == null) {
                        this._zhengyuMc = new AMovieClip();
                    }
                    this.gp_zhengyu.addChild(this._zhengyuMc);
                    this._zhengyuMc.playMCKey("efftyicon", "", 1);
                    this._zhengyuMc.x = 45;
                    this._zhengyuMc.y = 45;
                    if (this._zhengyuMc.hasEventListener(egret.Event.COMPLETE) == false) {
                        this._zhengyuMc.addEventListener(egret.Event.COMPLETE, this.removeZhengyuMc, this);
                    }
                    break;
                case 2:
                    if (this._fuyuMc == null) {
                        this._fuyuMc = new AMovieClip();
                    }
                    this.gp_fuyu.addChild(this._fuyuMc);
                    this._fuyuMc.playMCKey("efftyicon", "", 1);
                    this._fuyuMc.x = 45;
                    this._fuyuMc.y = 45;
                    if (this._fuyuMc.hasEventListener(egret.Event.COMPLETE) == false) {
                        this._fuyuMc.addEventListener(egret.Event.COMPLETE, this.removeFuyuMc, this);
                    }
                    break;
                case 3:
                    if (this._rongyuMc == null) {
                        this._rongyuMc = new AMovieClip();
                    }
                    this.gp_rongyu.addChild(this._rongyuMc);
                    this._rongyuMc.playMCKey("efftyicon", "", 1);
                    this._rongyuMc.x = 45;
                    this._rongyuMc.y = 45;
                    if (this._rongyuMc.hasEventListener(egret.Event.COMPLETE) == false) {
                        this._rongyuMc.addEventListener(egret.Event.COMPLETE, this.removeRongyuMc, this);
                    }
                    break;
                case 4:
                    if (this._xuyuMc == null) {
                        this._xuyuMc = new AMovieClip();
                    }
                    this.gp_xuyu.addChild(this._xuyuMc);
                    this._xuyuMc.playMCKey("efftyicon", "", 1);
                    this._xuyuMc.x = 45;
                    this._xuyuMc.y = 45;
                    if (this._xuyuMc.hasEventListener(egret.Event.COMPLETE) == false) {
                        this._xuyuMc.addEventListener(egret.Event.COMPLETE, this.removeXuyuMc, this);
                    }
                    break;
            }
        };
        WingEquipView.prototype.removeZhengyuMc = function () {
            if (this._zhengyuMc) {
                if (this._zhengyuMc.parent) {
                    this._zhengyuMc.parent.removeChild(this._zhengyuMc);
                }
                this._zhengyuMc.destroy();
                this._zhengyuMc = null;
            }
        };
        WingEquipView.prototype.removeFuyuMc = function () {
            if (this._fuyuMc) {
                if (this._fuyuMc.parent) {
                    this._fuyuMc.parent.removeChild(this._fuyuMc);
                }
                this._fuyuMc.destroy();
                this._fuyuMc = null;
            }
        };
        WingEquipView.prototype.removeRongyuMc = function () {
            if (this._rongyuMc) {
                if (this._rongyuMc.parent) {
                    this._rongyuMc.parent.removeChild(this._rongyuMc);
                }
                this._rongyuMc.destroy();
                this._rongyuMc = null;
            }
        };
        WingEquipView.prototype.removeXuyuMc = function () {
            if (this._xuyuMc) {
                if (this._xuyuMc.parent) {
                    this._xuyuMc.parent.removeChild(this._xuyuMc);
                }
                this._xuyuMc.destroy();
                this._xuyuMc = null;
            }
        };
        /**
         * 战斗力特效
         */
        WingEquipView.prototype.joinCombatEff = function () {
            var _this = this;
            if (this._combatEff == null) {
                this._combatEff = new EffectMovieClip();
            }
            this._combatEff.x = 190;
            this._combatEff.y = 40;
            this.gp_combat.addChild(this._combatEff);
            this._combatEff.playMCKey("effjspf", "", -1, null, function () {
                _this._combatEff.frameRate = 10;
            }, null, this);
        };
        WingEquipView.prototype.getWingEquipWay = function (goodId) {
            App.GlobalTips.showItemWayTips(ClientType.BASE_ITEM, goodId);
        };
        WingEquipView.prototype.updateWingEquipAttr = function () {
            var attackType = this.judgeAttackType();
            var wingAttr = this.wingModel.wingInfo.wingEquipAttr;
            if (this.wingModel.wingInfo.perfectWing) {
                this.lb_hpEquip.text = ConstAttribute.hp + "+" + wingAttr.hp + "+" + Math.ceil(this.wingModel.wingInfo.perfectWingRate * wingAttr.hp);
                this.lb_attackEquip.text = attackType[0] + "+" + wingAttr[attackType[1]] + "+" + Math.ceil(this.wingModel.wingInfo.perfectWingRate * wingAttr[attackType[1]]);
                this.lb_physicsDefenseEquip.text = ConstAttribute.def + "+" + wingAttr.def + "+" + Math.ceil(this.wingModel.wingInfo.perfectWingRate * wingAttr.def);
                this.lb_magicDefenseEquip.text = ConstAttribute.sdef + "+" + wingAttr.sdef + "+" + Math.ceil(this.wingModel.wingInfo.perfectWingRate * wingAttr.sdef);
                this.btlb_equipScore.text = wingAttr.grade + Math.ceil(this.wingModel.wingInfo.perfectWingRate * wingAttr.grade);
            }
            else {
                this.lb_hpEquip.text = ConstAttribute.hp + "+" + wingAttr.hp;
                this.lb_attackEquip.text = attackType[0] + "+" + wingAttr[attackType[1]];
                this.lb_physicsDefenseEquip.text = ConstAttribute.def + "+" + wingAttr.def;
                this.lb_magicDefenseEquip.text = ConstAttribute.sdef + "+" + wingAttr.sdef;
                this.btlb_equipScore.text = wingAttr.grade;
            }
        };
        WingEquipView.prototype.openZhengyuTip = function () {
            var attackType = this.judgeAttackType();
            App.WinManager.openWin(WinName.WING_EQUIP_TIP);
            var obj = { pos: 1, name: ConstWingName[1], step: this.wingModel.wingInfo.WingEquipStep.zhengyuStep, goStep: this.gp_zhengyuStep.visible, attack: attackType[0] + "：" + this.wingModel.wingInfo.wingEquipAttr[attackType[1]], score: this.wingModel.wingInfo.wingEquipAttr.zhengyuScore, source: ConstWingIcon[1], frameSource: QualityFrame[this.wingModel.wingInfo.WingEquipStep.zhengyuQuality], attackType: attackType[1] };
            App.EventSystem.dispatchEvent(PanelNotify.WING_EQUIP_TIP, obj);
        };
        WingEquipView.prototype.openFuyuTip = function () {
            App.WinManager.openWin(WinName.WING_EQUIP_TIP);
            var obj = { pos: 2, name: ConstWingName[2], step: this.wingModel.wingInfo.WingEquipStep.fuyuStep, goStep: this.gp_fuyuStep.visible, attack: ConstAttribute.hp + "：" + this.wingModel.wingInfo.wingEquipAttr.hp, score: this.wingModel.wingInfo.wingEquipAttr.fuyuScore, source: ConstWingIcon[2], frameSource: QualityFrame[this.wingModel.wingInfo.WingEquipStep.fuyuQuality], attackType: "hp" };
            App.EventSystem.dispatchEvent(PanelNotify.WING_EQUIP_TIP, obj);
        };
        WingEquipView.prototype.openRongyuTip = function () {
            App.WinManager.openWin(WinName.WING_EQUIP_TIP);
            var obj = { pos: 3, name: ConstWingName[3], step: this.wingModel.wingInfo.WingEquipStep.rongyuStep, goStep: this.gp_rongyuStep.visible, attack: ConstAttribute.def + "：" + this.wingModel.wingInfo.wingEquipAttr.def, score: this.wingModel.wingInfo.wingEquipAttr.rongyuScore, source: ConstWingIcon[3], frameSource: QualityFrame[this.wingModel.wingInfo.WingEquipStep.rongyuQuality], attackType: "def" };
            App.EventSystem.dispatchEvent(PanelNotify.WING_EQUIP_TIP, obj);
        };
        WingEquipView.prototype.openXuyuTip = function () {
            App.WinManager.openWin(WinName.WING_EQUIP_TIP);
            var obj = { pos: 4, name: ConstWingName[4], step: this.wingModel.wingInfo.WingEquipStep.xuyuStep, goStep: this.gp_xuyuStep.visible, attack: ConstAttribute.sdef + "：" + this.wingModel.wingInfo.wingEquipAttr.sdef, score: this.wingModel.wingInfo.wingEquipAttr.xuyuScore, source: ConstWingIcon[4], frameSource: QualityFrame[this.wingModel.wingInfo.WingEquipStep.xuyuQuality], attackType: "sdef" };
            App.EventSystem.dispatchEvent(PanelNotify.WING_EQUIP_TIP, obj);
        };
        WingEquipView.prototype.openWingPerfectTip = function () {
            App.WinManager.openWin(WinName.WING_PERFECT_TIP);
        };
        WingEquipView.prototype.openWingEquipSkill = function () {
            App.WinManager.openWin(WinName.WING_SKILL);
        };
        WingEquipView.prototype.wingEquipCompose = function () {
            App.WinManager.openWin(WinName.SYNTHESIS, { type: ConstSynthesisType.WING, lastModule: WinName.WING });
        };
        /**
         * 穿戴羽翼装备
         */
        WingEquipView.prototype.wearEquip = function () {
            App.Socket.send(15025, { id: this.wingModel.wingInfo.heroId });
            this.wingModel.replaceWingEquip = false;
        };
        /**
         * 打开窗口
         */
        WingEquipView.prototype.open = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.open.call(this, openParam);
            this.updateWingEquip();
            this.joinCombatEff();
            if (this._changeHeroEventId == 0) {
                this._changeHeroEventId = App.EventSystem.addEventListener(PanelNotify.HERO_CHANGE, this.changeHero, this);
            }
            if (this._eventId1 == 0) {
                this._eventId1 = App.EventSystem.addEventListener(PanelNotify.WING_INFO_UPDATE, this.updateWingEquip, this); //翅膀数据变化就刷新界面 
            }
        };
        /**
         * 清理
         */
        WingEquipView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._eventId1 != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WING_INFO_UPDATE, this._eventId1);
                this._eventId1 = 0;
            }
            if (this._changeHeroEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.HERO_CHANGE, this._changeHeroEventId);
                this._changeHeroEventId = 0;
            }
            if (this._combatEff) {
                this._combatEff.destroy();
                if (this._combatEff.parent) {
                    this._combatEff.parent.removeChild(this._combatEff);
                }
                this._combatEff = null;
            }
            this.removeZhengyuMc();
            this.removeFuyuMc();
            this.removeRongyuMc();
            this.removeXuyuMc();
        };
        /**
         * 销毁
         */
        WingEquipView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return WingEquipView;
    }(BaseChildView));
    game.WingEquipView = WingEquipView;
    __reflect(WingEquipView.prototype, "game.WingEquipView");
})(game || (game = {}));
//# sourceMappingURL=WingEquipView.js.map
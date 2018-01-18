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
 * module : 英雄模块控制器
 * author : zrj
*/
var game;
(function (game) {
    var HeroController = (function (_super) {
        __extends(HeroController, _super);
        function HeroController() {
            var _this = _super.call(this) || this;
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化协议
         */
        HeroController.prototype.initProtocol = function () {
            this.registerProtocal(15001, this.heroInfoR, this);
            this.registerProtocal(15002, this.putonEquipR, this);
            this.registerProtocal(15003, this.takeoffEquipR, this);
            this.registerProtocal(15011, this.handleNewPartnerR, this);
            this.registerProtocal(15012, this.handleSpecialEquipActive, this);
            this.registerProtocal(15013, this.handleSpecialEquipLevelUp, this);
            this.registerProtocal(15014, this.handleSpecialEquipFragment, this);
            this.registerProtocal(15015, this.handleAkeychange, this);
            this.registerProtocal(12001, this.handleSkillListR, this);
            this.registerProtocal(12003, this.handleSkillAllUp, this);
            this.registerProtocal(12004, this.handleSkillUpgrageR, this);
        };
        HeroController.prototype.heroInfoR = function (data) {
            this.dispatchEvent(PanelNotify.PLAYER_COMBAT_UPDATE, data);
            game.HeroModel.getInstance().updateHeroInfo(data.hero);
            game.WingModel.getInstance().updateHeroInfo(data.hero);
            App.logzrj("data.hero= ", data.hero);
            if (game.HeroModel.getInstance().isEquipPuton) {
                game.HeroModel.getInstance().isEquipPuton = false;
                game.HeroModel.getInstance().checkBetterEquipRedDotAll();
            }
            if (game.HeroModel.getInstance().isSpecialEquip) {
                game.HeroModel.getInstance().isSpecialEquip = false;
                game.HeroModel.getInstance().checkSpecialEquipRedDotAll();
            }
            this.dispatchEvent(PanelNotify.HERO_ON_HERO_SELECT, game.HeroModel.getInstance().curPos);
            this.dispatchEvent(PanelNotify.PLAYER_UPDATE_PLAYER_INFO);
        };
        HeroController.prototype.putonEquipR = function () {
            // this.dispatchEvent(PanelNotify.HERO_ON_HERO_SELECT,HeroModel.getInstance().curPos);
            game.HeroModel.getInstance().isEquipPuton = true;
        };
        HeroController.prototype.takeoffEquipR = function () {
            // this.dispatchEvent(PanelNotify.HERO_ON_HERO_SELECT,HeroModel.getInstance().curPos);
        };
        /**
         * 新伙伴返回
        */
        HeroController.prototype.handleNewPartnerR = function (data) {
            game.HeroModel.getInstance().addNewHero(data.hero);
            game.WingModel.getInstance().updateHeroInfo(game.HeroModel.getInstance().heroInfo);
            game.HeroModel.getInstance().checkBetterEquipRedDotAll();
            game.SkillModel.getInstance().checkSkillCanUpgradeAll();
            this.dispatchEvent(PanelNotify.HERO_NEW_PARTNER);
            this.dispatchEvent(PanelNotify.HERO_ON_HERO_SELECT, game.HeroModel.getInstance().curPos);
            this.dispatchEvent(PanelNotify.PLAYER_UPDATE_PLAYER_INFO);
        };
        /**
         * 特殊装备激活
        */
        HeroController.prototype.handleSpecialEquipActive = function (data) {
            App.logzrj("data:", data);
            // HeroModel.getInstance().checkSpecialEquipRedDotAll();
            game.HeroModel.getInstance().isSpecialEquip = true;
            this.dispatchEvent(PanelNotify.HERO_SPECIAL_EQUIP_UPDATE);
            this.dispatchEvent(PanelNotify.HERO_ACTIVE_SPECIAL);
        };
        /**
         * 特殊装备升级
        */
        HeroController.prototype.handleSpecialEquipLevelUp = function (data) {
            App.logzrj("data:", data);
            // HeroModel.getInstance().checkSpecialEquipRedDotAll();
            game.HeroModel.getInstance().isSpecialEquip = true;
            this.dispatchEvent(PanelNotify.HERO_SPECIAL_EQUIP_UPDATE);
        };
        /**
         * 特殊装备碎片激活
        */
        HeroController.prototype.handleSpecialEquipFragment = function (data) {
            App.logzrj("data:", data);
            // HeroModel.getInstance().checkSpecialEquipRedDotAll();
            game.HeroModel.getInstance().isSpecialEquip = true;
            this.dispatchEvent(PanelNotify.HERO_SPECIAL_EQUIP_UPDATE);
        };
        /**
         * 一键换装
         */
        HeroController.prototype.handleAkeychange = function (data) {
            App.logzsq();
            game.HeroModel.getInstance().isEquipPuton = true;
        };
        /**
         * 一键升级技能
         */
        HeroController.prototype.handleSkillAllUp = function (data) {
            game.SkillModel.getInstance().updateSkillInfo(data);
            this.dispatchEvent(PanelNotify.HERO_UPDATE_SKILL_PANEL);
        };
        /**
         * 技能列表
        */
        HeroController.prototype.handleSkillListR = function (data) {
            game.SkillModel.getInstance().updateSkillInfo(data);
            this.dispatchEvent(PanelNotify.HERO_UPDATE_SKILL_PANEL);
        };
        /**
         * 升级技能返回
        */
        HeroController.prototype.handleSkillUpgrageR = function (data) {
            game.SkillModel.getInstance().upgradeSkillByData(data);
            this.dispatchEvent(PanelNotify.HERO_UPDATE_SKILL_PANEL);
            game.SkillModel.getInstance().checkSkillCanUpgradeAll();
            // App.Socket.send(12001,HeroModel.getInstance().heroInfo[HeroModel.getInstance().curPos].id);
        };
        /**
         * 销毁
         */
        HeroController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        /**
         * 清理
         */
        HeroController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        return HeroController;
    }(BaseController));
    game.HeroController = HeroController;
    __reflect(HeroController.prototype, "game.HeroController");
})(game || (game = {}));
//# sourceMappingURL=HeroController.js.map
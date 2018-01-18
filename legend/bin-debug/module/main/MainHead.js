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
    var MainHead = (function (_super) {
        __extends(MainHead, _super);
        function MainHead() {
            var _this = _super.call(this) || this;
            _this.heroModel = game.HeroModel.getInstance();
            _this._hideFightInfoEventId = 0;
            _this.skinName = "MainHeadSkin";
            return _this;
        }
        MainHead.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.initView();
            this._infoHandle = App.EventSystem.addEventListener(PanelNotify.PLAYER_UPDATE_PLAYER_INFO, this.updateBaseInfo, this);
            this._updateAreaHandle = App.EventSystem.addEventListener(SceneEventType.SCENE_INIT_COMPLETE, this.updateArea, this);
            if (this._hideFightInfoEventId == 0) {
                this._hideFightInfoEventId = App.EventSystem.addEventListener(PanelNotify.MAIN_HIDE_FIGHT_INFO, this.hideFightInfo, this);
            }
        };
        MainHead.prototype.initView = function () {
            // this.img_rank.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            //     App.WinManager.openWin(WinName.RANK);
            // },this);
            this.img_vip.touchEnabled = true;
            this.img_vip.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.openWin(WinName.VIP);
            }, this);
            this.btn_addCoin.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.GlobalTips.showItemWayTips(0, 101);
            }, this);
            this.btn_addGold.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                game.RechargeOpenManager.getInstance().openRechargeView();
            }, this);
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.VIPGIFT, this.img_vip, 70, 5);
            this.joinCombatEff();
        };
        MainHead.prototype.joinCombatEff = function () {
            var _this = this;
            this._combatEff = new EffectMovieClip();
            this._combatEff.x = 230;
            this._combatEff.y = 28;
            this._combatEff.scaleX = 1;
            this._combatEff.scaleY = 1;
            this.addChildAt(this._combatEff, 1);
            this._combatEff.playMCKey("effjspf", "", -1, null, function () {
                _this._combatEff.frameRate = 10;
            }, null, this);
        };
        MainHead.prototype.updateBaseInfo = function () {
            var baseInfo = App.RoleManager.roleInfo;
            var wealthInfo = App.RoleManager.roleWealthInfo;
            this.lb_lv.text = baseInfo.lv + "";
            this.lb_name.text = baseInfo.name;
            if (baseInfo.turn) {
                this.lb_turn.visible = true;
                this.lb_turnText.visible = true;
                this.lb_turn.text = baseInfo.turn + "";
            }
            else {
                this.lb_turn.visible = false;
                this.lb_turnText.visible = false;
            }
            this.lb_coin.text = String(wealthInfo.coin);
            this.lb_gold.text = String(wealthInfo.gold);
            this.lb_coin.text = GlobalUtil.fixNum(wealthInfo.coin);
            this.lb_gold.text = GlobalUtil.fixNum(wealthInfo.gold);
            this.bmlb_vip.text = String(baseInfo.vipLv);
            this.bmlb_fightcap.text = String(App.RoleManager.getHeroFightcap());
        };
        MainHead.prototype.upateMoney = function () {
        };
        MainHead.prototype.updateArea = function () {
            var hookSceneId = RoleManager.getInstance().roleInfo.hookSceneId;
            var sceneInfo = App.ConfigManager.getSceneConfigById(hookSceneId);
            var sceneExpInfo = App.ConfigManager.getAllExpConfigById(hookSceneId);
            this.lb_level.text = sceneInfo.lv_limit;
            // this.lb_area.text = sceneInfo.name;
            if (sceneExpInfo) {
                this.lb_info_exp.text = GlobalUtil.fixNum(sceneExpInfo.online_exp * 60);
                this.lb_perHour.x = this.lb_info_exp.x + this.lb_info_exp.width;
                this.lb_info_money.text = GlobalUtil.fixNum(sceneExpInfo.online_gold * 60);
            }
            else {
            }
        };
        MainHead.prototype.hideFightInfo = function (bool) {
            // if(bool) {
            //     this.gp_fight_info.visible = false;
            // } else {
            //     this.gp_fight_info.visible = true;
            // }
        };
        MainHead.prototype.openWin = function (openParam) {
            _super.prototype.openWin.call(this, openParam);
        };
        MainHead.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        MainHead.prototype.clear = function () {
            _super.prototype.clear.call(this);
            if (this._hideFightInfoEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.MAIN_HIDE_FIGHT_INFO, this._hideFightInfoEventId);
                this._hideFightInfoEventId = 0;
            }
        };
        MainHead.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            App.EventSystem.removeEventListener(PanelNotify.PLAYER_UPDATE_PLAYER_INFO, this._infoHandle);
            App.EventSystem.removeEventListener(SceneEventType.SCENE_INIT_COMPLETE, this._updateAreaHandle);
            if (this._combatEff) {
                this._combatEff.parent.removeChild(this._combatEff);
                this._combatEff.destroy();
                this._combatEff = null;
            }
        };
        return MainHead;
    }(BaseView));
    game.MainHead = MainHead;
    __reflect(MainHead.prototype, "game.MainHead");
})(game || (game = {}));
//# sourceMappingURL=MainHead.js.map
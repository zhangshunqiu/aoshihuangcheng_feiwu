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
 * Author: liuyonggen
 * 世界boss挑战时窗口 2017/12/4
 */
var game;
(function (game) {
    var WorldBossFight = (function (_super) {
        __extends(WorldBossFight, _super);
        function WorldBossFight(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._worldBossInfo = {};
            _this._worldBossEventId = 0;
            _this._hurtRankTimer = 0;
            _this._hurtRankEventId = 0;
            _this._leftTimeTimer = 0;
            _this._worldBossModel = game.WorldBossModel.getInstance();
            return _this;
        }
        WorldBossFight.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            this.img_cheer.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.openWin(WinName.WORLDBOSS_CHEER, _this._worldBossInfo.worldBossItem);
            }, this);
            this.img_reward.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.openWin(WinName.WORLDBOSS_REWARD, _this._worldBossInfo.worldBossItem);
            }, this);
            this.btn_shield.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                if (_this.btn_shield.currentState == "up") {
                    _this.btn_shield.currentState = "down";
                    SceneManager.getInstance().setOtherPlayerVisible(false);
                }
                else {
                    _this.btn_shield.currentState = "up";
                    SceneManager.getInstance().setOtherPlayerVisible(true);
                }
            }, this);
            this.btn_showOrHide.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showOrHide, this);
        };
        WorldBossFight.prototype.showOrHide = function () {
            if (this.btn_showOrHide.currentState == "up") {
                this.btn_showOrHide.currentState = "down";
                this.gp_rankAll.visible = false;
                this.img_rankBg.height = 60;
                this.gp_myHurt.y = 102;
            }
            else {
                this.btn_showOrHide.currentState = "up";
                this.gp_rankAll.visible = true;
                this.img_rankBg.height = 178;
                this.gp_myHurt.y = 217;
            }
        };
        WorldBossFight.prototype.initView = function () {
            this.img_icon.source = this._worldBossInfo.worldBossItem.icon + "_png";
            var bossId = this._worldBossInfo.worldBossItem.monster_list[0][2];
            var bossInfo = App.ConfigManager.getMonsterById(bossId);
            this.lb_bossName.text = bossInfo.name;
            this.lb_bossLv.text = bossInfo.lv;
        };
        WorldBossFight.prototype.updateView = function (bossInfo) {
            // App.loglyg("bossssssssssssss",bossInfo);
            this.pb_hp.maximum = bossInfo.hp;
            this.pb_hp.value = bossInfo.curHp;
        };
        WorldBossFight.prototype.updateRankView = function (data) {
            var _this = this;
            for (var i = 0; i < 5; i++) {
                if (data.hurt_list.length > i) {
                    this["gp_rank" + i].visible = true;
                    this["lb_rank" + i].text = data.hurt_list[i].rank;
                    this["lb_name" + i].text = data.hurt_list[i].nick;
                    this["lb_hurt" + i].text = data.hurt_list[i].hurt;
                }
                else {
                    this["gp_rank" + i].visible = false;
                }
            }
            this.lb_myHurt.text = data.self_hurt;
            if (data.left_time <= 60) {
                if (this._leftTimeTimer == 0) {
                    var nowTime_1 = data.left_time;
                    this.gp_countDown.visible = true;
                    App.GlobalTimer.addSchedule(1000, 0, function () {
                        _this.lb_time.text = nowTime_1-- + "";
                        if (nowTime_1 == 0) {
                            _this.gp_countDown.visible = false;
                            if (_this._leftTimeTimer != 0) {
                                App.GlobalTimer.remove(_this._leftTimeTimer);
                                _this._leftTimeTimer = 0;
                            }
                        }
                    }, this);
                }
            }
        };
        WorldBossFight.prototype.updateHurtRank = function () {
            App.Socket.send(36010, {});
        };
        WorldBossFight.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (typeof openParam == "number") {
                this._worldBossInfo.worldBossItem = this._worldBossModel.worldBossInfo[openParam];
            }
            else {
                this._worldBossInfo = openParam;
            }
            this.initView();
            if (this._worldBossEventId == 0) {
                this._worldBossEventId = App.EventSystem.addEventListener(SceneEventType.BOSS_INFO, this.updateView, this);
            }
            if (this._hurtRankTimer == 0) {
                this._hurtRankTimer = App.GlobalTimer.addSchedule(2000, 0, this.updateHurtRank, this);
            }
            if (this._hurtRankEventId == 0) {
                this._worldBossEventId = App.EventSystem.addEventListener(PanelNotify.WORLDBOSS_HURT_RANK_UPDATE, this.updateRankView, this);
            }
            if (this._leftTimeTimer != 0) {
                App.GlobalTimer.remove(this._leftTimeTimer);
                this._leftTimeTimer = 0;
            }
            App.EventSystem.dispatchEvent(PanelNotify.MAIN_HIDE_FIGHT_INFO, true);
        };
        WorldBossFight.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        /**
         * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
         */
        WorldBossFight.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._worldBossEventId != 0) {
                App.EventSystem.removeEventListener(SceneEventType.BOSS_INFO, this._worldBossEventId);
                this._worldBossEventId = 0;
            }
            if (this._hurtRankTimer != 0) {
                App.GlobalTimer.remove(this._hurtRankTimer);
                this._hurtRankTimer = 0;
            }
            if (this._hurtRankEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WORLDBOSS_HURT_RANK_UPDATE, this._hurtRankEventId);
                this._hurtRankEventId = 0;
            }
            App.EventSystem.dispatchEvent(PanelNotify.MAIN_HIDE_FIGHT_INFO, false);
        };
        /**
         * 销毁
         */
        WorldBossFight.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return WorldBossFight;
    }(BaseView));
    game.WorldBossFight = WorldBossFight;
    __reflect(WorldBossFight.prototype, "game.WorldBossFight");
})(game || (game = {}));
//# sourceMappingURL=WorldBossFight.js.map
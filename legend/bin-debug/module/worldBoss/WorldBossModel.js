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
 * 世界boss系统数据模型 2017/12/4
 */
var game;
(function (game) {
    var WorldBossModel = (function (_super) {
        __extends(WorldBossModel, _super);
        function WorldBossModel() {
            var _this = _super.call(this) || this;
            _this.worldBossInfo = {};
            _this.worldBossItemGroup = {};
            _this.maxTimesLimit = 0; //最大挑战次数
            _this.killRecord = []; //击杀记录
            _this.killReward = [];
            _this.joinReward = [];
            _this.getInfo();
            return _this;
        }
        WorldBossModel.prototype.getInfo = function () {
            this.worldBossInfo = App.ConfigManager.getWorldBossInfoById();
            this.maxTimesLimit = App.ConfigManager.getConstConfigByType("WORLD_BOSS_NUM").value;
        };
        WorldBossModel.prototype.updateWorldBossInfo = function (data) {
            if (data.bosses.length < 3) {
                if (this.pbWorldBossInfo) {
                    for (var i = 0; i < this.pbWorldBossInfo.bosses.length; i++) {
                        for (var j = 0; j < data.bosses.length; j++) {
                            if (data.bosses[j].scene_id == this.pbWorldBossInfo.bosses[i].scene_id) {
                                this.pbWorldBossInfo.bosses[i] = data.bosses[j];
                                break;
                            }
                        }
                        break;
                    }
                }
                else {
                    this.pbWorldBossInfo = data;
                }
                this.judgeFitBoss(data.bosses);
            }
            else {
                this.pbWorldBossInfo = data;
            }
        };
        /**
         * 判断哪个boss适合推荐给玩家
         */
        WorldBossModel.prototype.judgeFitBoss = function (bosses) {
            var maxLimitLv;
            var maxLimitTurn;
            if (this.revive) {
                var nowBossInfo = App.ConfigManager.getWorldBossInfoById(this.revive.scene_id);
                maxLimitLv = nowBossInfo.lv_limit;
                maxLimitTurn = nowBossInfo.transmigration;
            }
            else {
                maxLimitLv = 10;
                maxLimitTurn = 1;
            }
            for (var i = 0; i < bosses.length; i++) {
                if (bosses[i].notice == 1) {
                    var bossInfo = App.ConfigManager.getWorldBossInfoById(bosses[i].scene_id);
                    if (bossInfo.lv_limit) {
                        if (bossInfo.lv_limit <= App.RoleManager.roleInfo.lv) {
                            if (bossInfo.lv_limit >= maxLimitLv) {
                                maxLimitLv = bossInfo.lv_limit;
                                this.revive = bosses[i];
                            }
                        }
                    }
                    else {
                        if (bossInfo.transmigration <= App.RoleManager.roleInfo.turn) {
                            if (bossInfo.transmigration >= maxLimitTurn) {
                                maxLimitTurn = bossInfo.transmigration;
                                this.revive = bosses[i];
                            }
                        }
                    }
                }
            }
        };
        /**
         * boss复活是否推送给玩家
         * @return {boolean} true为推送
         */
        WorldBossModel.prototype.showBossRevive = function () {
            var times = App.ConfigManager.getConstConfigByType("WORLD_BOSS_BAY_NUM").value;
            var vipTimes = App.ConfigManager.getVipInfoById(App.RoleManager.roleInfo.vipLv).bay_boss;
            var allTimes = times - this.pbWorldBossInfo.buy_times + vipTimes;
            if (!this.revive) {
                return false;
            }
            else if (this.pbWorldBossInfo.left_times <= 0 && allTimes <= 0) {
                return false;
            }
            else if (SceneUtil.isBossScene(SceneModel.getInstance().sceneId) || SceneUtil.isActivityScene(SceneModel.getInstance().sceneId)) {
                return false;
            }
            else {
                return true;
            }
        };
        WorldBossModel.prototype.changeToPage = function (obj) {
            var killReward = [];
            var joinReward = [];
            var count = Math.floor(obj.reward1.length / 8);
            for (var i = 0; i < count; i++) {
                killReward.push(obj.reward1.slice(i * 8, (i + 1) * 8));
            }
            if (count * 8 != obj.reward1.length) {
                killReward.push(obj.reward1.slice(count * 8, obj.reward1.length));
            }
            var count1 = Math.floor(obj.reward2.length / 8);
            for (var i = 0; i < count1; i++) {
                joinReward.push(obj.reward2.slice(i * 8, (i + 1) * 8));
            }
            if (count1 * 8 != obj.reward2.length) {
                joinReward.push(obj.reward2.slice(count1 * 8, obj.reward2.length));
            }
            obj.killReward = killReward;
            obj.joinReward = joinReward;
            return obj;
        };
        /**
         * 清理
         */
        WorldBossModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        /**
         * 销毁
         */
        WorldBossModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            //销毁处理
        };
        return WorldBossModel;
    }(BaseModel));
    game.WorldBossModel = WorldBossModel;
    __reflect(WorldBossModel.prototype, "game.WorldBossModel");
})(game || (game = {}));
//# sourceMappingURL=WorldBossModel.js.map
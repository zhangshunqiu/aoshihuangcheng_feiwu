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
 * Boss模块数据模型  2017/11/13
 */
var game;
(function (game) {
    var BossModel = (function (_super) {
        __extends(BossModel, _super);
        function BossModel() {
            var _this = _super.call(this) || this;
            _this.ranking = []; //关卡排名
            _this.dropOutItem = []; //掉落物品
            _this.level = 0; //当前关卡
            _this.challengeTime = 0; //挑战次数
            _this.award = ''; //通关奖励
            _this._backpackModel = game.BackpackModel.getInstance();
            _this._heroModel = game.HeroModel.getInstance();
            _this.exp = App.RoleManager.roleInfo.exp; //人物当前经验
            _this.lv = App.RoleManager.roleInfo.lv; //人物当前等级 
            _this.upLevelExp = 999999;
            _this.wave = 0; //小怪波数
            _this.waveAll = 3; //小怪总波数
            _this.sceneId = 20001; //场景id
            _this.showDrop = []; //展示的掉落物品
            _this.dropItem = [];
            _this.upLevelTime = 0; //挂机升级所需时间；
            _this.bossRewardLevel = 0; //领取到10关boss奖励最高关卡
            _this.getBossRewardNum = 0; //可领取通关奖励的次数；
            _this.hookId = 0; //挂机场景id
            _this.rank = 0; //挑战世界boss时的排名
            _this.dropOutItem = [];
            return _this;
        }
        BossModel.prototype.challengeBossResult = function (data) {
            this.result = Number(data.result);
            if (data.list.length) {
                this.dropItem = data.list;
                this.bossInfo.exp = data.list[data.list.length - 1].num;
            }
            this.hookId = data.hook_id;
        };
        BossModel.prototype.updateSceneInfo = function () {
            if (App.RoleManager.roleInfo.hookSceneId < 40000 && App.RoleManager.roleInfo.hookSceneId > 30000) {
                return;
            }
            this.sceneInfo = App.ConfigManager.getSceneConfigById(App.RoleManager.roleInfo.hookSceneId);
            this.level = this.sceneInfo.lv_limit;
            this.waveAll = this.sceneInfo.monster_list.length;
            this.getInfo();
        };
        BossModel.prototype.updateBossRewardInfo = function (data) {
            this.bossRewardLevel = data;
            this.getBossRewardNum = Math.floor((this.sceneInfo.lv_limit - 1 - this.bossRewardLevel) / 10);
            this.getPassReward();
        };
        BossModel.prototype.getPassReward = function () {
            this.bossRewardLevel += 10;
            if (this.getBossRewardNum > 0) {
                var tenReward = App.ConfigManager.getSceneConfigById(40000 + this.bossRewardLevel).ten_reward[0];
                if (tenReward) {
                    var passRewardId = tenReward[1];
                    this.passReward = App.ConfigManager.getItemInfoById(passRewardId);
                }
            }
        };
        BossModel.prototype.getInfo = function () {
            this.showDrop = [];
            this.sceneBossInfo = App.ConfigManager.getSceneConfigById(40000 + this.sceneInfo.lv_limit); //获取场景信息
            var bossID = this.sceneBossInfo.monster_list[0][2];
            if (this.sceneInfo.scene_id < 40000) {
                if (this.sceneInfo.event_boss_list[0]) {
                    var meetBossId = this.sceneInfo.event_boss_list[0][2];
                    this.meetBossInfo = App.ConfigManager.getMonsterById(meetBossId);
                }
            }
            this.bossInfo = App.ConfigManager.getMonsterById(bossID); //获取boss信息
            for (var i = 1; i < 6; i++) {
                var showItem = App.ConfigManager.getConstConfigByType("BOSS_SHOW_REWARD" + i);
                var dropItem = { type: ClientType.BASE_ITEM, good_id: showItem.value };
                this.showDrop.push(dropItem);
            }
            var tenReward = App.ConfigManager.getSceneConfigById(40000 + Math.ceil(this.sceneInfo.lv_limit / 10) * 10).ten_reward[0];
            var currentPassRewardId = tenReward ? tenReward[1] : 1;
            this.currentPassReward = App.ConfigManager.getItemInfoById(currentPassRewardId);
            this.lastIncomePromote = App.ConfigManager.getAllExpConfigById(20000 + this.sceneInfo.lv_limit);
            if (this.sceneInfo.lv_limit == App.ConfigManager.getConstConfigByType("BOSS_MAX").value) {
                this.incomePromote = App.ConfigManager.getAllExpConfigById(20000 + this.sceneInfo.lv_limit);
            }
            else {
                this.incomePromote = App.ConfigManager.getAllExpConfigById(20000 + this.sceneInfo.lv_limit + 1);
            }
            var upLevel = App.ConfigManager.getExpConfigByLv(Number(App.RoleManager.roleInfo.lv) + 1);
            if (upLevel) {
                this.upLevelExp = upLevel.exp;
            }
            this.upLevelTime = Math.floor((this.upLevelExp - this.exp) / (this.incomePromote.offline_exp / 30));
        };
        BossModel.prototype.updateRanking = function () {
        };
        return BossModel;
    }(BaseModel));
    game.BossModel = BossModel;
    __reflect(BossModel.prototype, "game.BossModel");
})(game || (game = {}));
//# sourceMappingURL=BossModel.js.map
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
 * Author: lihe
 * Email： hersletter@qq.com
 * 福利数据层逻辑 2017/06/20.
 */
var game;
(function (game) {
    var LabberHegemonyModel = (function (_super) {
        __extends(LabberHegemonyModel, _super);
        function LabberHegemonyModel() {
            var _this = _super.call(this) || this;
            //match enemy
            _this.match_list = [];
            _this.reward_list = [];
            _this.tier_reward_list = [];
            _this.rank_reward_List = [];
            return _this;
        }
        LabberHegemonyModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        LabberHegemonyModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        LabberHegemonyModel.prototype.updateLabberHegemonyInfo = function (data) {
            this.hegemony_name = RoleManager.getInstance().roleInfo.name;
            this.is_winingstreak = (data.win_streak >= 2);
            this.tier = data.grade;
            this.lv = data.lv;
            this.star = data.star;
            this.win_match = data.margin;
            this.my_rank = data.rank;
            this.wining_rate = data.p_win;
            this.left_num = data.left_times;
            this.left_total = data.max_times;
            this.left_buy_times = data.left_buy_times;
            App.BtnTipManager.setTypeValue(ConstBtnTipType.AREAN_LABBER, this.left_num > 0);
        };
        LabberHegemonyModel.prototype.getMatchEnemyInfo = function (data) {
            this.match_enemy = new game.LabberMatchVo();
            this.match_list.splice(0);
            var enemy = data.enemy;
            this.match_enemy.name = enemy.name;
            this.match_enemy.career = enemy.career;
            this.match_enemy.sex = enemy.sex;
            this.match_enemy.p_win = enemy.p_win;
            this.match_enemy.tier = enemy.grade;
            this.match_enemy.lv = enemy.lv;
            for (var i = 0; i < data.list.length; i++) {
                var info = new game.LabberMatchVo();
                info.name = data.list[i].name;
                info.career = data.list[i].career;
                info.sex = data.list[i].sex;
                info.p_win = data.list[i].p_win;
                info.tier = data.list[i].grade;
                info.lv = data.list[i].lv;
                this.match_list.push(info);
            }
        };
        LabberHegemonyModel.prototype.getLabberRewardInfo = function (data) {
            this.tier_reward_list = App.ConfigManager.getLabberTierRewardInfo();
            this.rank_reward_List = App.ConfigManager.getLabberRankRewardInfo();
            //this.tier_reward_list = App.ConfigManager.getLabberRankRewardInfo();
            this.reward_list.splice(0);
            this.my_tier = data.myGrade;
            this.my_lv = data.myLv;
            this.my_margin = data.myMargin;
            for (var i = 0; i < this.rank_reward_List.length; i++) {
                var info = new game.LabberRewardVo();
                if (i < data.list.length) {
                    info.name = data.list[i].name;
                    info.player_id = data.list[i].player_id;
                    info.rank = data.list[i].rank;
                    info.tier = data.list[i].grade;
                    info.lv = data.list[i].lv;
                    info.margin = data.list[i].margin;
                }
                else {
                    info.player_id = -1;
                    info.rank = i + 1;
                }
                info.reward_id = this.rank_reward_List[i][1];
                info.reward_num = this.rank_reward_List[i][2];
                this.reward_list.push(info);
            }
        };
        LabberHegemonyModel.prototype.getHegemonyResultInfo = function (data) {
            this.result = data.res;
            this.old_tier = data.old_grade;
            this.old_lv = data.old_lv;
            this.old_star = data.old_star;
            this.new_tier = data.new_grade;
            this.new_lv = data.new_lv;
            this.new_star = data.new_star;
            this.star_res = data.star_res;
            this.surprise_list = data.surprise_list;
            var info = App.ConfigManager.getLabberMatchReward(this.result + 1, this.new_tier);
            this.surprise_list.unshift({ type: info[0], id: info[1], num: info[2] });
        };
        return LabberHegemonyModel;
    }(BaseModel));
    game.LabberHegemonyModel = LabberHegemonyModel;
    __reflect(LabberHegemonyModel.prototype, "game.LabberHegemonyModel");
})(game || (game = {}));
//# sourceMappingURL=LabberHegemonyModel.js.map
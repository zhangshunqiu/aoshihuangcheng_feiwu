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
 * 技能数据模型
 * author : zrj
*/
var game;
(function (game) {
    var SkillModel = (function (_super) {
        __extends(SkillModel, _super);
        function SkillModel() {
            var _this = _super.call(this) || this;
            // public skillInfo : Array<Array<any>> = [[],[],[]]; //按照英雄顺序存储
            // public curData: any = {}; //当前升级技能data
            _this.heroModel = game.HeroModel.getInstance();
            _this.heroHeadRedDot = [false, false, false]; //英雄头部红点
            return _this;
        }
        //技能数据
        SkillModel.prototype.updateSkillInfo = function (data) {
            var _this = this;
            //初始化
            this.heroModel.heroInfo.forEach(function (value, index, array) {
                if (value.id == data.hero_id) {
                    if (!value.skillDic) {
                        value.skillDic = {};
                        var info = _this.getSkillByCareer(value.job);
                        var result = [];
                        info.forEach(function (v, i, a) {
                            value.skillDic[v.id] = 0;
                        }, _this);
                    }
                    for (var key in data.list) {
                        value.skillDic[data.list[key].skill_id] = data.list[key].skill_lv;
                    }
                    // console.log(value)
                }
            }, this);
        };
        //升级技能
        SkillModel.prototype.upgradeSkillByData = function (data) {
            this.heroModel.heroInfo.forEach(function (value, index, array) {
                if (value.id == data.hero_id) {
                    value.skillDic[data.skill_id] = data.skill_lv;
                }
            }, this);
        };
        SkillModel.prototype.getSkillByCareer = function (career) {
            var info = App.ConfigManager.skillTreeConfig();
            var existKey = {};
            var result = [];
            for (var key in info) {
                if (info[key].career == career) {
                    if (!existKey[info[key].id]) {
                        result.push(info[key]);
                        existKey[info[key].id] = true;
                    }
                }
            }
            return result;
        };
        SkillModel.prototype.getSkillUpgrageByIdLevel = function (id, level) {
            var info = App.ConfigManager.skillTreeConfig();
            for (var key in info) {
                if (info[key].id == id && info[key].lv == level) {
                    return info[key];
                }
            }
        };
        //拿skill表的数据，战斗用
        SkillModel.prototype.getSkillInfoByIdLevel = function (id, level) {
            var info = App.ConfigManager.skillConfig();
            for (var key in info) {
                if (info[key].skill_id == id && info[key].skill_lv == level) {
                    return info[key];
                }
            }
        };
        //技能升级红点
        SkillModel.prototype.checkSkillCanUpgradeRedDot = function (pos) {
            var heroModel = game.HeroModel.getInstance();
            this.heroHeadRedDot[pos] = false;
            for (var key in this.heroModel.heroInfo[pos].skillDic) {
                var info = this.getSkillUpgrageByIdLevel(key, this.heroModel.heroInfo[pos].skillDic[key]);
                var nextInfo = this.getSkillUpgrageByIdLevel(key, this.heroModel.heroInfo[pos].skillDic[key] + 1);
                if (!info) {
                }
                if (!nextInfo) {
                }
                else {
                    if (App.RoleManager.roleInfo.lv > nextInfo.open_lv && App.RoleManager.roleInfo.lv >= nextInfo.lv && App.RoleManager.roleWealthInfo.coin >= nextInfo.cost_coin) {
                        this.heroHeadRedDot[pos] = true;
                    }
                    else {
                    }
                }
            }
        };
        //技能升级红点
        SkillModel.prototype.checkSkillCanUpgradeAll = function () {
            var _this = this;
            var heroModel = game.HeroModel.getInstance();
            heroModel.heroInfo.forEach(function (value, index, array) {
                _this.checkSkillCanUpgradeRedDot(index);
            }, this);
            App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_SKILL, false);
            this.heroHeadRedDot.forEach(function (value, index, array) {
                if (value) {
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_SKILL, true);
                }
            }, this);
        };
        SkillModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        SkillModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return SkillModel;
    }(BaseModel));
    game.SkillModel = SkillModel;
    __reflect(SkillModel.prototype, "game.SkillModel");
})(game || (game = {}));
//# sourceMappingURL=SkillModel.js.map
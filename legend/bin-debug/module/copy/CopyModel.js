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
* 副本系统数据模型 2017/11/27
*/
var game;
(function (game) {
    var CopyModel = (function (_super) {
        __extends(CopyModel, _super);
        function CopyModel() {
            var _this = _super.call(this) || this;
            _this.bossCopyInfoArr = [];
            _this.materialCopyInfoArr = [];
            _this.challengeInfo = {}; //挑战次数信息
            _this.topId = 0; //爬塔的最高关卡
            _this.bossLimitTimes = {}; //boss副本挑战次数限制
            _this.materialLimitTimes = {}; //boss副本挑战次数限制
            _this.canChallenge = { bossBool: 0, materialBool: 0 };
            _this.getInfo();
            return _this;
        }
        CopyModel.prototype.getInfo = function () {
            this.bossCopyInfo = App.ConfigManager.getBossCopyInfo();
            for (var k in this.bossCopyInfo) {
                this.bossLimitTimes[k] = this.bossCopyInfo[k].times_limit;
            }
            this.bossCopyInfoArr = this.sortChallengeArr(this.bossCopyInfo, ConstCopyType.Boss);
            this.materialCopyInfo = App.ConfigManager.getMaterialCopyInfo();
            this.materialCopyInfoArr = this.sortChallengeArr(this.materialCopyInfo, ConstCopyType.Material);
            for (var k in this.materialCopyInfo) {
                this.materialLimitTimes[k] = this.materialCopyInfo[k].times_limit;
            }
        };
        CopyModel.prototype.updateInfo = function (data) {
            this.challengeInfo[data.type] = data.list;
            if (data.type == 1) {
                if (data.list.length) {
                    for (var i = 0; i < data.list.length; i++) {
                        this.bossCopyInfo[data.list[i].id].times_limit = this.bossLimitTimes[data.list[i].id];
                        this.bossCopyInfo[data.list[i].id].times_limit -= data.list[i].times;
                    }
                    this.bossCopyInfoArr = this.sortChallengeArr(this.bossCopyInfo, ConstCopyType.Boss);
                }
            }
            else if (data.type == 2) {
                if (data.list.length) {
                    for (var i = 0; i < data.list.length; i++) {
                        this.materialCopyInfo[data.list[i].id].times_limit = this.materialLimitTimes[data.list[i].id];
                        this.materialCopyInfo[data.list[i].id].times_limit -= data.list[i].times;
                        var sweep = App.ConfigManager.getConstConfigByType("MATERIAL_SWEEP_NUM").value;
                        var vipSweep = App.ConfigManager.getVipInfoById(App.RoleManager.roleInfo.vipLv).transcript;
                        this.materialCopyInfo[data.list[i].id].sweep = sweep + vipSweep - data.list[i].sweep_times;
                    }
                    this.materialCopyInfoArr = this.sortChallengeArr(this.materialCopyInfo, ConstCopyType.Material);
                }
            }
            else {
                data.top_id = data.top_id || 30199;
                data.top_id++;
                this.topId = data.top_id;
                this.challengeCopyInfo0 = App.ConfigManager.getChallengeCopyInfoBySceneId(data.top_id);
                this.challengeCopyInfo1 = App.ConfigManager.getChallengeCopyInfoBySceneId(data.top_id + 1);
                this.challengeCopyInfo2 = App.ConfigManager.getChallengeCopyInfoBySceneId(data.top_id + 2);
                var bossId = this.challengeCopyInfo0.monster_list[0][2];
                this.bossInfo = App.ConfigManager.getMonsterById(bossId);
            }
        };
        CopyModel.prototype.sortChallengeArr = function (obj, type) {
            var _canChallengeBoss = [];
            var _alreadyChallengeBoss = [];
            var _cannotChallengeBoss = [];
            var materialBool = 0;
            for (var k in obj) {
                var judge = void 0;
                if (type == ConstCopyType.Boss) {
                    judge = (App.RoleManager.roleInfo.lv >= obj[k].lv_limit) && obj[k].lv_limit != 0 ||
                        (App.RoleManager.roleInfo.turn >= obj[k].transmigration && obj[k].transmigration);
                }
                else if (type == ConstCopyType.Material) {
                    judge = App.RoleManager.roleInfo.lv >= obj[k].lv_limit;
                }
                if (judge) {
                    if (obj[k].times_limit > 0) {
                        _canChallengeBoss.push(obj[k]);
                        materialBool = _canChallengeBoss.length;
                    }
                    else if (type == ConstCopyType.Material && obj[k].sweep > 0) {
                        _canChallengeBoss.push(obj[k]);
                    }
                    else {
                        _alreadyChallengeBoss.push(obj[k]);
                    }
                }
                else {
                    _cannotChallengeBoss.push(obj[k]);
                }
            }
            if (type == ConstCopyType.Boss) {
                this.canChallenge.bossBool = _canChallengeBoss.length;
            }
            else if (type == ConstCopyType.Material) {
                this.canChallenge.materialBool = materialBool;
            }
            var Arr = [];
            Arr = _canChallengeBoss.concat(_alreadyChallengeBoss, _cannotChallengeBoss);
            return Arr;
        };
        /**
         * 清理
         */
        CopyModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        /**
         * 销毁
         */
        CopyModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            //销毁处理
        };
        return CopyModel;
    }(BaseModel));
    game.CopyModel = CopyModel;
    __reflect(CopyModel.prototype, "game.CopyModel");
})(game || (game = {}));
//# sourceMappingURL=CopyModel.js.map
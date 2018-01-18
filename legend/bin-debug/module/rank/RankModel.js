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
 * Author: yangyipeng                                  （必须加上，知道是谁做的）
 * 排行榜模块模型
 */
var game;
(function (game) {
    var RankModel = (function (_super) {
        __extends(RankModel, _super);
        function RankModel() {
            var _this = _super.call(this) || this;
            _this._rankObj = {};
            return _this;
        }
        Object.defineProperty(RankModel.prototype, "curViewRankType", {
            get: function () {
                return this._curRankType;
            },
            set: function (type) {
                this._curViewRankType = type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RankModel.prototype, "rankObj", {
            get: function () {
                return this._rankObj;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RankModel.prototype, "curRankType", {
            get: function () {
                return this._curRankType;
            },
            enumerable: true,
            configurable: true
        });
        RankModel.prototype.rankCombat = function (data) {
            this._curRankType = ConstRankName.COMBAT;
            this._rankObj[ConstRankName.COMBAT] = {};
            this._rankObj[ConstRankName.COMBAT]["model"] = [];
            this._rankObj[ConstRankName.COMBAT]["model"].push(data.weapon_id);
            this._rankObj[ConstRankName.COMBAT]["model"].push(data.closth_id);
            this._rankObj[ConstRankName.COMBAT]["model"].push(data.wing_id);
            this._rankObj[ConstRankName.COMBAT]["my_rank"] = data.my_rank;
            this._rankObj[ConstRankName.COMBAT]["worShip"] = data.worship;
            var firstTop = data.list.shift();
            var _rankTopVo = new game.RankVo(firstTop, "战斗力: " + firstTop.combat);
            var rankTop = new eui.ArrayCollection([_rankTopVo]);
            this._rankObj[ConstRankName.COMBAT]["topRank"] = rankTop;
            var _arr = data.list;
            var rankVoArr = new eui.ArrayCollection();
            for (var i = 0; i < _arr.length; i++) {
                var combat = "战斗力: " + _arr[i].combat;
                var _rankVo = new game.RankVo(_arr[i], combat);
                rankVoArr.addItem(_rankVo);
            }
            this._rankObj[ConstRankName.COMBAT]["rankArr"] = rankVoArr;
        };
        RankModel.prototype.rankLevel = function (data) {
            this._curRankType = ConstRankName.LEVEL;
            this._rankObj[ConstRankName.LEVEL] = {};
            this._rankObj[ConstRankName.LEVEL]["model"] = [];
            this._rankObj[ConstRankName.LEVEL]["model"].push(data.weapon_id);
            this._rankObj[ConstRankName.LEVEL]["model"].push(data.closth_id);
            this._rankObj[ConstRankName.LEVEL]["model"].push(data.wing_id);
            this._rankObj[ConstRankName.LEVEL]["my_rank"] = data.my_rank;
            this._rankObj[ConstRankName.LEVEL]["worShip"] = data.worship;
            var firstTop = data.list.shift();
            var _rankTopVo = new game.RankVo(firstTop);
            var rankTop = new eui.ArrayCollection([_rankTopVo]);
            this._rankObj[ConstRankName.LEVEL]["topRank"] = rankTop;
            var _arr = data.list;
            var rankVoArr = new eui.ArrayCollection();
            for (var i = 0; i < _arr.length; i++) {
                var _rankVo = new game.RankVo(_arr[i]);
                rankVoArr.addItem(_rankVo);
            }
            this._rankObj[ConstRankName.LEVEL]["rankArr"] = rankVoArr;
        };
        RankModel.prototype.rankFighter = function (data) {
            this._curRankType = ConstRankName.FIGHTER;
            this._rankObj[ConstRankName.FIGHTER] = {};
            this._rankObj[ConstRankName.FIGHTER]["model"] = [];
            this._rankObj[ConstRankName.FIGHTER]["model"].push(data.weapon_id);
            this._rankObj[ConstRankName.FIGHTER]["model"].push(data.closth_id);
            this._rankObj[ConstRankName.FIGHTER]["model"].push(data.wing_id);
            this._rankObj[ConstRankName.FIGHTER]["my_rank"] = data.my_rank;
            this._rankObj[ConstRankName.FIGHTER]["worShip"] = data.worship;
            var firstTop = data.list.shift();
            var _rankTopVo = new game.RankVo(firstTop, "战斗力: " + firstTop.combat);
            var rankTop = new eui.ArrayCollection([_rankTopVo]);
            this._rankObj[ConstRankName.FIGHTER]["topRank"] = rankTop;
            var _arr = data.list;
            var rankVoArr = new eui.ArrayCollection();
            for (var i = 0; i < _arr.length; i++) {
                var combat = "战斗力: " + _arr[i].combat;
                var _rankVo = new game.RankVo(_arr[i], combat);
                rankVoArr.addItem(_rankVo);
            }
            this._rankObj[ConstRankName.FIGHTER]["rankArr"] = rankVoArr;
        };
        RankModel.prototype.rankMagic = function (data) {
            this._curRankType = ConstRankName.MAGIC;
            this._rankObj[ConstRankName.MAGIC] = {};
            this._rankObj[ConstRankName.MAGIC]["model"] = [];
            this._rankObj[ConstRankName.MAGIC]["model"].push(data.weapon_id);
            this._rankObj[ConstRankName.MAGIC]["model"].push(data.closth_id);
            this._rankObj[ConstRankName.MAGIC]["model"].push(data.wing_id);
            this._rankObj[ConstRankName.MAGIC]["my_rank"] = data.my_rank;
            this._rankObj[ConstRankName.MAGIC]["worShip"] = data.worship;
            var firstTop = data.list.shift();
            var _rankTopVo = new game.RankVo(firstTop, "战斗力: " + firstTop.combat);
            var rankTop = new eui.ArrayCollection([_rankTopVo]);
            this._rankObj[ConstRankName.MAGIC]["topRank"] = rankTop;
            var _arr = data.list;
            var rankVoArr = new eui.ArrayCollection();
            for (var i = 0; i < _arr.length; i++) {
                var combat = "战斗力: " + _arr[i].combat;
                var _rankVo = new game.RankVo(_arr[i], combat);
                rankVoArr.addItem(_rankVo);
            }
            this._rankObj[ConstRankName.MAGIC]["rankArr"] = rankVoArr;
        };
        RankModel.prototype.rankTaoist = function (data) {
            this._curRankType = ConstRankName.TAOIST;
            this._rankObj[ConstRankName.TAOIST] = {};
            this._rankObj[ConstRankName.TAOIST]["model"] = [];
            this._rankObj[ConstRankName.TAOIST]["model"].push(data.weapon_id);
            this._rankObj[ConstRankName.TAOIST]["model"].push(data.closth_id);
            this._rankObj[ConstRankName.TAOIST]["model"].push(data.wing_id);
            this._rankObj[ConstRankName.TAOIST]["my_rank"] = data.my_rank;
            this._rankObj[ConstRankName.TAOIST]["worShip"] = data.worship;
            var firstTop = data.list.shift();
            var _rankTopVo = new game.RankVo(firstTop, "战斗力: " + firstTop.combat);
            var rankTop = new eui.ArrayCollection([_rankTopVo]);
            this._rankObj[ConstRankName.TAOIST]["topRank"] = rankTop;
            var _arr = data.list;
            var rankVoArr = new eui.ArrayCollection();
            for (var i = 0; i < _arr.length; i++) {
                var combat = "战斗力: " + _arr[i].combat;
                var _rankVo = new game.RankVo(_arr[i], combat);
                rankVoArr.addItem(_rankVo);
            }
            this._rankObj[ConstRankName.TAOIST]["rankArr"] = rankVoArr;
        };
        RankModel.prototype.rankKill = function (data) {
            this._curRankType = ConstRankName.KILL;
            this._rankObj[ConstRankName.KILL] = {};
            this._rankObj[ConstRankName.KILL]["model"] = [];
            this._rankObj[ConstRankName.KILL]["model"].push(data.weapon_id);
            this._rankObj[ConstRankName.KILL]["model"].push(data.closth_id);
            this._rankObj[ConstRankName.KILL]["model"].push(data.wing_id);
            this._rankObj[ConstRankName.KILL]["my_rank"] = data.my_rank;
            this._rankObj[ConstRankName.KILL]["worShip"] = data.worship;
            var firstTop = data.list.shift();
            var _rankTopVo = new game.RankVo(firstTop, "杀戮值: " + firstTop.kill);
            var rankTop = new eui.ArrayCollection([_rankTopVo]);
            this._rankObj[ConstRankName.KILL]["topRank"] = rankTop;
            var _arr = data.list;
            var rankVoArr = new eui.ArrayCollection();
            for (var i = 0; i < _arr.length; i++) {
                var kill = "杀戮值: " + _arr[i].kill;
                var _rankVo = new game.RankVo(_arr[i], kill);
                rankVoArr.addItem(_rankVo);
            }
            this._rankObj[ConstRankName.KILL]["rankArr"] = rankVoArr;
        };
        RankModel.prototype.rankMemal = function (data) {
            this._curRankType = ConstRankName.MEMAL;
            this._rankObj[ConstRankName.MEMAL] = {};
            this._rankObj[ConstRankName.MEMAL]["model"] = [];
            this._rankObj[ConstRankName.MEMAL]["model"].push(data.weapon_id);
            this._rankObj[ConstRankName.MEMAL]["model"].push(data.closth_id);
            this._rankObj[ConstRankName.MEMAL]["model"].push(data.wing_id);
            this._rankObj[ConstRankName.MEMAL]["my_rank"] = data.my_rank;
            this._rankObj[ConstRankName.MEMAL]["worShip"] = data.worship;
            var firstTop = data.list.shift();
            var _rankTopVo = new game.RankVo(firstTop, "勋章等级: " + firstTop.medal_lv);
            var rankTop = new eui.ArrayCollection([_rankTopVo]);
            this._rankObj[ConstRankName.MEMAL]["topRank"] = rankTop;
            var _arr = data.list;
            var rankVoArr = new eui.ArrayCollection();
            for (var i = 0; i < _arr.length; i++) {
                var medal = "勋章等级: " + _arr[i].medal_lv;
                var _rankVo = new game.RankVo(_arr[i], medal);
                rankVoArr.addItem(_rankVo);
            }
            this._rankObj[ConstRankName.MEMAL]["rankArr"] = rankVoArr;
        };
        RankModel.prototype.rankKing = function (data) {
            // 		message pbRankArenaPlayer{
            // 	optional int32 player_id	= 1;
            // 	optional string name		= 2;
            // 	optional int32 month_card	= 3;	// 0无月卡 1有月卡
            // 	optional int32 vip			= 4;
            // 	optional int32 grade		= 5;	// 段
            // 	optional int32 lv			= 6;	// 段位等级
            // 	optional int32 margin		= 7;	// 净胜场
            // 	optional int32 rank			= 8;	// 排名
            // }
            // message pbRankArena{
            // 	optional int32 my_rank		= 1; // 我的排名
            // 	optional int32 worship		= 2; // 膜拜状态 （1可膜拜 2已膜拜）
            // 	repeated pbRankArenaPlayer list	= 3; // 上榜玩家列表
            // 	optional int32 sex			= 4;	// 第一名性别
            // 	optional int32 weapon_id	= 5;	// 第一名武器
            // 	optional int32 wing_id		= 6;	// 第一名翅膀
            // 	optional int32 closth_id	= 7;	// 第一名衣服
            // }
            this._curRankType = ConstRankName.KING;
            this._rankObj[ConstRankName.KING] = {};
            this._rankObj[ConstRankName.KING]["model"] = [];
            this._rankObj[ConstRankName.KING]["model"].push(data.weapon_id);
            this._rankObj[ConstRankName.KING]["model"].push(data.closth_id);
            this._rankObj[ConstRankName.KING]["model"].push(data.wing_id);
            this._rankObj[ConstRankName.KING]["my_rank"] = data.my_rank;
            this._rankObj[ConstRankName.KING]["worShip"] = data.worship;
            var firstTop = data.list.shift();
            var _rankTopVo = new game.RankVo(firstTop, firstTop.margin + "场");
            var rankTop = new eui.ArrayCollection([_rankTopVo]);
            this._rankObj[ConstRankName.KING]["topRank"] = rankTop;
            var _arr = data.list;
            var rankVoArr = new eui.ArrayCollection();
            for (var i = 0; i < _arr.length; i++) {
                var marginNum = _arr[i].margin + "场";
                var _rankVo = new game.RankVo(_arr[i], marginNum);
                rankVoArr.addItem(_rankVo);
            }
            this._rankObj[ConstRankName.KING]["rankArr"] = rankVoArr;
        };
        RankModel.prototype.worship = function (result) {
            var index = result - 1;
            var rankType = ConstRankIndex[index];
            this._rankObj[rankType] = {};
            this._rankObj[rankType]["worShip"] = 2; //不能再膜拜了
        };
        RankModel.prototype.setWorShip = function (canWorShip, rankType) {
            switch (rankType) {
                case ConstRankName.COMBAT:
                    if (this._rankObj[rankType] == null) {
                        this._rankObj[rankType] = {};
                        this._rankObj[rankType]["worShip"] = canWorShip;
                    }
                    break;
                case ConstRankName.LEVEL:
                    if (this._rankObj[rankType] == null) {
                        this._rankObj[rankType] = {};
                        this._rankObj[rankType]["worShip"] = canWorShip;
                    }
                    break;
                case ConstRankName.FIGHTER:
                    if (this._rankObj[rankType] == null) {
                        this._rankObj[rankType] = {};
                        this._rankObj[rankType]["worShip"] = canWorShip;
                    }
                    break;
                case ConstRankName.MAGIC:
                    if (this._rankObj[rankType] == null) {
                        this._rankObj[rankType] = {};
                        this._rankObj[rankType]["worShip"] = canWorShip;
                    }
                    break;
                case ConstRankName.TAOIST:
                    if (this._rankObj[rankType] == null) {
                        this._rankObj[rankType] = {};
                        this._rankObj[rankType]["worShip"] = canWorShip;
                    }
                    break;
                case ConstRankName.KILL:
                    if (this._rankObj[rankType] == null) {
                        this._rankObj[rankType] = {};
                        this._rankObj[rankType]["worShip"] = canWorShip;
                    }
                    break;
                case ConstRankName.MEMAL:
                    if (this._rankObj[rankType] == null) {
                        this._rankObj[rankType] = {};
                        this._rankObj[rankType]["worShip"] = canWorShip;
                    }
                    break;
                case ConstRankName.KING:
                    if (this._rankObj[rankType] == null) {
                        this._rankObj[rankType] = {};
                        this._rankObj[rankType]["worShip"] = canWorShip;
                    }
                    break;
                default:
                    break;
            }
        };
        /**
         * 清理
         */
        RankModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        /**
         * 销毁
         */
        RankModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            //销毁处理
        };
        return RankModel;
    }(BaseModel));
    game.RankModel = RankModel;
    __reflect(RankModel.prototype, "game.RankModel");
})(game || (game = {}));
//# sourceMappingURL=RankModel.js.map
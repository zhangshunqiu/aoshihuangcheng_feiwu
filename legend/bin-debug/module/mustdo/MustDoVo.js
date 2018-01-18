/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 每日必做Vo 2017/06/20.
 */
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var TaskVo = (function () {
        function TaskVo() {
        }
        return TaskVo;
    }());
    game.TaskVo = TaskVo;
    __reflect(TaskVo.prototype, "game.TaskVo");
    var ChestVo = (function () {
        function ChestVo() {
        }
        return ChestVo;
    }());
    game.ChestVo = ChestVo;
    __reflect(ChestVo.prototype, "game.ChestVo");
    var AchieveVo = (function () {
        function AchieveVo() {
        }
        return AchieveVo;
    }());
    game.AchieveVo = AchieveVo;
    __reflect(AchieveVo.prototype, "game.AchieveVo");
    var MedalRankVo = (function () {
        function MedalRankVo() {
        }
        return MedalRankVo;
    }());
    game.MedalRankVo = MedalRankVo;
    __reflect(MedalRankVo.prototype, "game.MedalRankVo");
    var TitleVo = (function () {
        function TitleVo() {
        }
        return TitleVo;
    }());
    game.TitleVo = TitleVo;
    __reflect(TitleVo.prototype, "game.TitleVo");
})(game || (game = {}));
//# sourceMappingURL=MustDoVo.js.map
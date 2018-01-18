/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 福利Vo 2017/06/20.
 */
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var WelfareLvVo = (function () {
        function WelfareLvVo() {
        }
        return WelfareLvVo;
    }());
    game.WelfareLvVo = WelfareLvVo;
    __reflect(WelfareLvVo.prototype, "game.WelfareLvVo");
    var WelfareRewardVo = (function () {
        function WelfareRewardVo() {
        }
        return WelfareRewardVo;
    }());
    game.WelfareRewardVo = WelfareRewardVo;
    __reflect(WelfareRewardVo.prototype, "game.WelfareRewardVo");
})(game || (game = {}));
//# sourceMappingURL=WelfareVo.js.map
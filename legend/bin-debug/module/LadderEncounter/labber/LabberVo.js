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
    var LabberRewardVo = (function () {
        function LabberRewardVo() {
        }
        return LabberRewardVo;
    }());
    game.LabberRewardVo = LabberRewardVo;
    __reflect(LabberRewardVo.prototype, "game.LabberRewardVo");
    var LabberMatchVo = (function () {
        function LabberMatchVo() {
        }
        LabberMatchVo.prototype.getCareerIcon = function () {
            return GlobalUtil.getCareerPic(this.sex, this.career);
        };
        LabberMatchVo.prototype.getTierName = function () {
            return GlobalUtil.getTierName(this.tier);
        };
        LabberMatchVo.prototype.getWiningRateText = function () {
            return this.p_win + "%";
        };
        return LabberMatchVo;
    }());
    game.LabberMatchVo = LabberMatchVo;
    __reflect(LabberMatchVo.prototype, "game.LabberMatchVo");
})(game || (game = {}));
//# sourceMappingURL=LabberVo.js.map
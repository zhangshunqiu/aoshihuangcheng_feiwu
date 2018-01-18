var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var InvestUtil = (function () {
        function InvestUtil() {
        }
        InvestUtil.getFormatBySecond1 = function (t) {
            if (t === void 0) { t = 0; }
            var days = Math.floor(t / 60 / 60 / 24); //计算剩余的天数 
            var hours = Math.floor(t / 60 / 60 % 24); //计算剩余的小时 
            var minst = Math.floor(t / 60 % 60); //计算剩余的分钟 
            var dys;
            var hors;
            var mins;
            if (days == 0) {
                dys = "00";
            }
            else if (days < 10) {
                dys = "0" + days;
            }
            else {
                dys = "" + days;
            }
            if (hours == 0) {
                hors = "00";
            }
            else if (hours < 10) {
                hors = "0" + hours;
            }
            else {
                hors = "" + hours;
            }
            if (minst == 0) {
                mins = "00";
            }
            else if (minst < 10) {
                mins = "0" + minst;
            }
            else {
                mins = "" + minst;
            }
            return dys + "天" + hors + "小时" + mins + "分钟";
        };
        return InvestUtil;
    }());
    game.InvestUtil = InvestUtil;
    __reflect(InvestUtil.prototype, "game.InvestUtil");
})(game || (game = {}));
//# sourceMappingURL=InvestUtil.js.map
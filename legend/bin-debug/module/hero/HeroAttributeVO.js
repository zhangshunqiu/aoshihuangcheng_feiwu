var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    //英雄详细属性信息
    var HeroAttributeVO = (function () {
        function HeroAttributeVO(data) {
            this.updateInfo(data);
        }
        HeroAttributeVO.prototype.updateInfo = function (info) {
            this.key = ConstAttributeArray[info.key];
            this.value = info.value;
            this.addValue = info.add_value;
        };
        return HeroAttributeVO;
    }());
    game.HeroAttributeVO = HeroAttributeVO;
    __reflect(HeroAttributeVO.prototype, "game.HeroAttributeVO");
})(game || (game = {}));
//# sourceMappingURL=HeroAttributeVO.js.map
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var InvestVo = (function () {
        function InvestVo(config, data) {
            if (data === void 0) { data = false; }
            this.id = config.id;
            this.gold = config.gold;
            this.level = config.level;
            this.turn = config.transmigration;
            this.get = data;
        }
        return InvestVo;
    }());
    game.InvestVo = InvestVo;
    __reflect(InvestVo.prototype, "game.InvestVo");
})(game || (game = {}));
//# sourceMappingURL=InvestVo.js.map
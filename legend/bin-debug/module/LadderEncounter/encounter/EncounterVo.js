var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var EncounterLogVo = (function () {
        function EncounterLogVo() {
        }
        return EncounterLogVo;
    }());
    game.EncounterLogVo = EncounterLogVo;
    __reflect(EncounterLogVo.prototype, "game.EncounterLogVo");
})(game || (game = {}));
//# sourceMappingURL=EncounterVo.js.map
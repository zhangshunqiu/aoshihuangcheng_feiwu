var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var SignItemVo = (function () {
        function SignItemVo() {
            this.canSign = false;
        }
        return SignItemVo;
    }());
    game.SignItemVo = SignItemVo;
    __reflect(SignItemVo.prototype, "game.SignItemVo");
})(game || (game = {}));
//# sourceMappingURL=SignItemVo.js.map
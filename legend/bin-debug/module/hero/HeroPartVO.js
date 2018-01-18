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
var game;
(function (game) {
    //英雄装备部位信息
    var HeroPartVO = (function (_super) {
        __extends(HeroPartVO, _super);
        function HeroPartVO(data) {
            return _super.call(this, data) || this;
        }
        HeroPartVO.prototype.updateInfo = function (info) {
            _super.prototype.updateInfo.call(this, info);
            this.lv = info.lv;
            this.part = info.part;
            this.star = info.star;
        };
        return HeroPartVO;
    }(game.EquipVO));
    game.HeroPartVO = HeroPartVO;
    __reflect(HeroPartVO.prototype, "game.HeroPartVO");
})(game || (game = {}));
//# sourceMappingURL=HeroPartVO.js.map
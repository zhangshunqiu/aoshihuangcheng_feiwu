var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * module : 特殊装备数据VO
 * author : zrj
*/
var game;
(function (game) {
    var EquipSpecialVO = (function () {
        function EquipSpecialVO(data) {
            this.updateInfo(data);
        }
        EquipSpecialVO.prototype.updateInfo = function (info) {
            this.pos = info.pos;
            this.id = info.id;
            this.piece = info.peaces;
        };
        EquipSpecialVO.prototype.getpieceByKey = function (key) {
            for (var k in this.piece) {
                if (this.piece[k] == key) {
                    return this.piece[k];
                }
            }
        };
        return EquipSpecialVO;
    }());
    game.EquipSpecialVO = EquipSpecialVO;
    __reflect(EquipSpecialVO.prototype, "game.EquipSpecialVO");
})(game || (game = {}));
//# sourceMappingURL=EquipSpecialVO.js.map
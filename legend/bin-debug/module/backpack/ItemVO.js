var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * module : 道具数据模型VO
 * author : zrj
*/
var game;
(function (game) {
    var ItemVO = (function () {
        function ItemVO(data) {
            this.updateInfo(data);
        }
        ItemVO.prototype.updateInfo = function (info) {
            this.type = info.type;
            this.id = info.id;
            this.good_id = info.good_id;
            this.num = info.num;
            this.equip = info.equip;
        };
        return ItemVO;
    }());
    game.ItemVO = ItemVO;
    __reflect(ItemVO.prototype, "game.ItemVO");
})(game || (game = {}));
//# sourceMappingURL=ItemVO.js.map
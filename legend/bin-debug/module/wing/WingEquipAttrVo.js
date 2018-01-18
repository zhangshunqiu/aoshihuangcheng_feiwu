var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Author: liuyonggen
 * 翅膀装备属性数据结构 2017/11/16
 */
var game;
(function (game) {
    var WingEquipAttrVo = (function () {
        function WingEquipAttrVo() {
            this.hp = 0; //生命值
            this.ac = 0; //物理攻击
            this.mac = 0; //魔法攻击
            this.sc = 0; //道术攻击
            this.def = 0; //物理防御
            this.sdef = 0; //魔法防御
            this.grade = 0; //评分
            this.zhengyuScore = 0; //正羽评分
            this.fuyuScore = 0; //副羽评分
            this.rongyuScore = 0; //绒羽评分
            this.xuyuScore = 0; //须羽评分
        }
        return WingEquipAttrVo;
    }());
    game.WingEquipAttrVo = WingEquipAttrVo;
    __reflect(WingEquipAttrVo.prototype, "game.WingEquipAttrVo");
})(game || (game = {}));
//# sourceMappingURL=WingEquipAttrVo.js.map
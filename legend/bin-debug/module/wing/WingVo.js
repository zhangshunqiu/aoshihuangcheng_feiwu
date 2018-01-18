var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Author: liuyonggen
 * 翅膀模块数据Vo  2017/11/16
 */
var game;
(function (game) {
    var WingVo = (function () {
        function WingVo() {
            this.wingEquip = []; //羽翼装备 是一个对象数组 0正羽，1副羽，2绒羽，3须羽
            this.wingEquipAttr = new game.WingEquipAttrVo(); //羽翼装备属性之和
            this.WingEquipStep = {}; //羽翼各部分装备阶数
            this.wingEquipGoStep = {}; //羽翼装备能否升阶
            this.replaceWingEquip = false; //是否有可替换的羽翼装备
            this.perfectWing = 0; //完美羽翼阶数
        }
        return WingVo;
    }());
    game.WingVo = WingVo;
    __reflect(WingVo.prototype, "game.WingVo");
})(game || (game = {}));
//# sourceMappingURL=WingVo.js.map
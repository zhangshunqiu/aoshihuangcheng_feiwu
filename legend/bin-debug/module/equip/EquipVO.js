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
/**
 * module : 装备数据VO
 * author : zrj
*/
var game;
(function (game) {
    var EquipVO = (function (_super) {
        __extends(EquipVO, _super);
        function EquipVO(data) {
            return _super.call(this, data) || this;
        }
        EquipVO.prototype.updateInfo = function (info) {
            _super.prototype.updateInfo.call(this, info);
            this.score = this.equip.score;
            this.base = this.equip.base;
            this.special = this.equip.special;
            this.wash = this.equip.wash;
        };
        EquipVO.prototype.getBaseByKey = function (key) {
            for (var k in this.base) {
                if (this.base[k].key == key) {
                    return this.base[k];
                }
            }
        };
        EquipVO.prototype.getSpecialByKey = function (key) {
            for (var k in this.special) {
                if (this.special[k].key == key) {
                    return this.special[k];
                }
            }
        };
        EquipVO.prototype.getWashByKey = function (key) {
            for (var k in this.wash) {
                if (this.wash[k].key == key) {
                    return this.wash[k];
                }
            }
        };
        return EquipVO;
    }(game.ItemVO));
    game.EquipVO = EquipVO;
    __reflect(EquipVO.prototype, "game.EquipVO");
})(game || (game = {}));
//# sourceMappingURL=EquipVO.js.map
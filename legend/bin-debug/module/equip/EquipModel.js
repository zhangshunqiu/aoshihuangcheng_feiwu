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
 * module : 装备模块数据模型
 * author : zrj
*/
var game;
(function (game) {
    var EquipModel = (function (_super) {
        __extends(EquipModel, _super);
        function EquipModel() {
            var _this = _super.call(this) || this;
            _this.equipInfo = [];
            _this.equipInfo = [];
            return _this;
        }
        /**
         * 根据部位获得装备类型
        */
        EquipModel.prototype.getTypeByPos = function (pos) {
            var type = 1; //装备类型
            if (pos <= 4) {
                type = pos;
            }
            else if (pos == 5 || pos == 6) {
                type = 5;
            }
            else if (pos == 7 || pos == 8) {
                type = 6;
            }
            else if (pos > 8) {
                type = pos - 2;
            }
            return type;
        };
        /**
         * 根据装备类型获得部位
        */
        EquipModel.prototype.getPosByType = function (type) {
            var pos = undefined; //装备位置
            if (type <= 4) {
                pos = type;
            }
            else if (type == 5) {
                pos = [5, 6];
            }
            else if (type == 6) {
                pos = [7, 8];
            }
            else if (type > 6) {
                pos = type + 2;
            }
            return pos;
        };
        EquipModel.prototype.attributeFilter = function (attrInfo) {
            var attr = {};
            for (var key in attrInfo) {
                if (key != "id" && key != "name" && key != "att_type" && key != "level" && attrInfo[key] != 0) {
                    attr[key] = attrInfo[key];
                }
            }
            return attr;
        };
        EquipModel.prototype.getEquipInfoById = function (id) {
            var _table = App.ConfigManager.equipConfig();
            for (var key in _table) {
                var info = _table[key];
                if (info.id == id) {
                    return info;
                }
            }
            return null;
        };
        EquipModel.prototype.getEquipArrayByType = function (type) {
            var _table = App.ConfigManager.equipConfig();
            var arr = [];
            for (var key in _table) {
                var info = _table[key];
                if (info.sub_type == type) {
                    arr.push(info);
                }
            }
            return arr;
        };
        EquipModel.prototype.sortEquipByCap = function (array) {
            array.sort(function (a, b) {
                if (a.score > b.score) {
                    return -1;
                }
                return 1;
            });
        };
        //检测更好的装备
        EquipModel.prototype.checkBetterEquip = function (pos, part, equipInfo) {
            var heroModel = game.HeroModel.getInstance();
            var myEquipInfo = heroModel.getHeroEquipByPosPart(pos, part);
            var baseInfo = App.ConfigManager.equipConfig[equipInfo.good_id];
            if (!myEquipInfo && App.RoleManager.roleInfo.lv >= baseInfo.level && baseInfo.sex == heroModel.heroInfo[pos].sex) {
                return true;
            }
            else {
                if (equipInfo.score > myEquipInfo.score && App.RoleManager.roleInfo.lv >= baseInfo.level && baseInfo.sex == heroModel.heroInfo[pos].sex) {
                    return true;
                }
                else {
                    return false;
                }
            }
        };
        EquipModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        EquipModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return EquipModel;
    }(BaseModel));
    game.EquipModel = EquipModel;
    __reflect(EquipModel.prototype, "game.EquipModel");
})(game || (game = {}));
//# sourceMappingURL=EquipModel.js.map
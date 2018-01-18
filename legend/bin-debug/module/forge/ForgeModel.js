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
 * module : 锻造模块数据模型
 * author : zrj
*/
var game;
(function (game) {
    var ForgeModel = (function (_super) {
        __extends(ForgeModel, _super);
        function ForgeModel() {
            var _this = _super.call(this) || this;
            _this.strengthHeroRedDot = [false, false, false]; //强化的英雄红点记录;
            _this.starHeroRedDot = [false, false, false]; //升星的英雄红点记录;
            _this.orangeHeroRedDot = [false, false, false]; //橙装升级的英雄红点记录;
            return _this;
        }
        ForgeModel.prototype.updateStrengthPart = function (data) {
            this.curPart = data.part + 1;
            if (this.curPart > 10) {
                this.curPart = ConstEquipPart.WEAPON;
            }
        };
        ForgeModel.prototype.updateStarPart = function (data) {
            this.curStarPart = data.part;
            if (this.curStarPart > 10) {
                this.curStarPart = ConstEquipPart.WEAPON;
            }
        };
        /**
         * 强化
        */
        ForgeModel.prototype.getStrengthByPartLevel = function (part, level) {
            var key = "1" + (part >= 10 ? String(part) : "0" + part) + (level > 100 ? String(level) : level >= 10 ? "0" + String(level) : "00" + String(level));
            return App.ConfigManager.castConfig()[key];
        };
        /**
         * 升星
        */
        ForgeModel.prototype.getStarByPartLevel = function (part, level) {
            // let key = "2" + (part>=10?String(part):"0"+part) + (level > 100 ? String(level) : level > 10 ? "0" + String(level) : "00" + String(level));
            var key = "200" + (level > 100 ? String(level) : level >= 10 ? "0" + String(level) : "00" + String(level));
            return App.ConfigManager.castConfig()[key];
        };
        ForgeModel.prototype.checkCanStrength = function (pos) {
            var _this = this;
            var heroModel = game.HeroModel.getInstance();
            var tempLv = 999999;
            heroModel.heroInfo[pos].equip_info.forEach(function (value, index, array) {
                if (!_this.curPart && value.part <= 10) {
                    _this.curPart = value.part;
                    tempLv = value.lv;
                }
                else if (_this.curPart == value.part) {
                    tempLv = value.lv;
                }
                else if (tempLv > value.lv && value.part <= 10) {
                    _this.curPart = value.part;
                    tempLv = value.lv;
                }
            }, this);
            //判断等级
            if (App.RoleManager.roleInfo.lv <= tempLv) {
                return false;
            }
            var equip = heroModel.heroInfo[pos].getPartInfoByPart(this.curPart);
            var curLevel = equip ? equip.lv : 0;
            var forgeInfo = this.getStrengthByPartLevel(this.curPart, curLevel + 1);
            var costInfo = (forgeInfo.consume.substring(1, forgeInfo.consume.length - 1)).split(",");
            var itemInfo = game.BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, costInfo[0]);
            if (!itemInfo) {
                itemInfo = { num: 0 };
            }
            if (itemInfo.num >= costInfo[1]) {
                // return true;
                this.strengthHeroRedDot[pos] = true;
                App.BtnTipManager.setTypeValue(ConstBtnTipType.FORGE_STRENGTH, true);
                return true;
            }
            else {
                this.strengthHeroRedDot[pos] = false;
                App.BtnTipManager.setTypeValue(ConstBtnTipType.FORGE_STRENGTH, false);
                return false;
            }
        };
        ForgeModel.prototype.checkCanStarup = function (pos) {
            var heroInfo = game.HeroModel.getInstance().heroInfo[pos];
            this.starHeroRedDot[pos] = false;
            App.BtnTipManager.setTypeValue(ConstBtnTipType.FORGE_STAR, false);
            for (var i = 1; i <= 10; i++) {
                var part = i;
                var equip = heroInfo.getPartInfoByPart(part);
                var curLevel = equip ? equip.star : 0;
                var forgeInfo = this.getStarByPartLevel(part, curLevel + 1);
                var maxLevel = false;
                if (!forgeInfo) {
                    // return false;
                    continue;
                }
                var costInfo = (forgeInfo.consume.substring(1, forgeInfo.consume.length - 1)).split(",");
                var itemInfo = game.BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, costInfo[0]);
                var itemConfig = App.ConfigManager.itemConfig()[costInfo[0]];
                if (!itemInfo) {
                    itemInfo = { num: 0 };
                }
                if (maxLevel) {
                    costInfo[1] = 0;
                }
                if (itemInfo.num >= costInfo[1]) {
                    // return true;
                    this.starHeroRedDot[pos] = true;
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.FORGE_STAR, true);
                    return;
                }
                else {
                    // return false;
                }
            }
        };
        //根据具体部位去判断
        ForgeModel.prototype.checkCanStarupByPart = function (pos, part) {
            var heroInfo = game.HeroModel.getInstance().heroInfo[pos];
            var equip = heroInfo.getPartInfoByPart(part);
            var curLevel = equip ? equip.star : 0;
            var forgeInfo = this.getStarByPartLevel(part, curLevel + 1);
            var maxLevel = false;
            if (!forgeInfo) {
                return false;
            }
            var costInfo = (forgeInfo.consume.substring(1, forgeInfo.consume.length - 1)).split(",");
            var itemInfo = game.BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, costInfo[0]);
            var itemConfig = App.ConfigManager.itemConfig()[costInfo[0]];
            if (!itemInfo) {
                itemInfo = { num: 0 };
            }
            if (maxLevel) {
                costInfo[1] = 0;
            }
            if (itemInfo.num >= costInfo[1]) {
                return true;
            }
            else {
                return false;
            }
        };
        //橙装升级
        ForgeModel.prototype.checkCanOrangeUp = function (pos) {
            var heroInfo = game.HeroModel.getInstance().heroInfo[pos];
            this.orangeHeroRedDot[pos] = false;
            App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_ORANGEEQUIP, false);
            for (var i = 1; i <= 10; i++) {
                if (this.checkCanOrangeUpByPart(pos, i)) {
                    this.orangeHeroRedDot[pos] = true;
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_ORANGEEQUIP, true);
                    break;
                }
            }
        };
        //根据具体部位去判断
        ForgeModel.prototype.checkCanOrangeUpByPart = function (pos, part) {
            var heroInfo = game.HeroModel.getInstance().heroInfo[pos];
            var equipVO = heroInfo.getEquipByPart(part);
            if (!equipVO) {
                return false;
            }
            var equipInfo = App.ConfigManager.getEquipById(equipVO.good_id);
            if (!equipInfo || equipInfo.upgrade == 0) {
                return false;
            }
            var nextInfo = App.ConfigManager.getEquipById(equipInfo.upgrade);
            if (!nextInfo) {
                return false;
            }
            if (App.RoleManager.roleInfo.turn < nextInfo.reincarnation) {
                return false;
            }
            else if (App.RoleManager.roleInfo.lv < nextInfo.limit_lvl) {
                return false;
            }
            //橙装精华
            var itemInfo = game.BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, 11);
            if (!itemInfo) {
                itemInfo = { num: 0 };
            }
            if (itemInfo.num >= equipInfo.consumption) {
                return true;
            }
            else {
                return false;
            }
        };
        ForgeModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        ForgeModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return ForgeModel;
    }(BaseModel));
    game.ForgeModel = ForgeModel;
    __reflect(ForgeModel.prototype, "game.ForgeModel");
})(game || (game = {}));
//# sourceMappingURL=ForgeModel.js.map
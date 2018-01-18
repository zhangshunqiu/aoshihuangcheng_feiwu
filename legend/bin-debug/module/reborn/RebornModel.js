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
 * 转生模块数据模型
 * author : zrj
*/
var game;
(function (game) {
    var RebornModel = (function (_super) {
        __extends(RebornModel, _super);
        function RebornModel() {
            return _super.call(this) || this;
        }
        RebornModel.prototype.getExchangeInfoByType = function (type) {
            for (var k in this.exchangeInfo) {
                if (this.exchangeInfo[k].type == type) {
                    return this.exchangeInfo[k];
                }
            }
        };
        //能否重生
        RebornModel.prototype.checkCanReborn = function () {
            var nextInfo = App.ConfigManager.getRebornAttrInfoById(RoleManager.getInstance().roleInfo.turn + 1);
            if (nextInfo) {
                if (App.RoleManager.roleInfo.lifeExp >= nextInfo.need_num) {
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_REBORN_UP, true);
                }
                else {
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_REBORN_UP, false);
                }
            }
            else {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_REBORN_UP, false);
            }
            if (!this.checkCanExchangeLevel() && !this.checkCanExchangeExpert() && !this.checkCanExchangeSuper()) {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_REBORN_CULTURE, false);
            }
            else {
                if (nextInfo) {
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_REBORN_CULTURE, true);
                }
                else {
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_REBORN_CULTURE, false);
                }
            }
        };
        //降低等级
        RebornModel.prototype.checkCanExchangeLevel = function () {
            var nextInfo = App.ConfigManager.getRebornAttrInfoById(RoleManager.getInstance().roleInfo.turn + 1);
            if (!nextInfo) {
                return false;
            }
            if (App.ConfigManager.getConstConfigByType("TRANSMI_CONVERT_NUM").value > this.getExchangeInfoByType(ConstRebornExchangeType.LEVEL).used_times) {
                if (App.RoleManager.roleInfo.lv > 80) {
                    return true;
                }
            }
            return false;
        };
        //高级转生丹次数
        RebornModel.prototype.checkCanExchangeExpert = function () {
            var nextInfo = App.ConfigManager.getRebornAttrInfoById(RoleManager.getInstance().roleInfo.turn + 1);
            if (!nextInfo) {
                return false;
            }
            if (App.ConfigManager.getConstConfigByType("TRANSMI_EXPERP_NUM").value > this.getExchangeInfoByType(ConstRebornExchangeType.REDUCE).used_times) {
                var itemInfo = game.BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, 19);
                if (itemInfo) {
                    return true;
                }
            }
            return false;
        };
        //超级转生丹次数
        RebornModel.prototype.checkCanExchangeSuper = function () {
            var nextInfo = App.ConfigManager.getRebornAttrInfoById(RoleManager.getInstance().roleInfo.turn + 1);
            if (!nextInfo) {
                return false;
            }
            if (App.ConfigManager.getConstConfigByType("TRANSMI_SUPER_NUM").value > this.getExchangeInfoByType(ConstRebornExchangeType.SUPER).used_times) {
                var itemInfo = game.BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, 20);
                if (itemInfo) {
                    return true;
                }
            }
            return false;
        };
        RebornModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        RebornModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return RebornModel;
    }(BaseModel));
    game.RebornModel = RebornModel;
    __reflect(RebornModel.prototype, "game.RebornModel");
})(game || (game = {}));
//# sourceMappingURL=RebornModel.js.map
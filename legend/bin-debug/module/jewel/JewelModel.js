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
 * module : 宝石数据模块
 * author : zrj
*/
var game;
(function (game) {
    var JewelModel = (function (_super) {
        __extends(JewelModel, _super);
        function JewelModel() {
            var _this = _super.call(this) || this;
            _this.heroheadRedPoint = [false, false, false];
            _this.equipPartRedPoint = { 1: {}, 2: {}, 3: {}, 4: {} };
            _this.heroModel = game.HeroModel.getInstance();
            return _this;
        }
        JewelModel.prototype.checkCanUpgradeByPos = function (pos, part) {
            var heroInfo = this.heroModel.heroInfo[pos];
            var jewelInfo = heroInfo.getJewelInfoByPart(part);
            for (var i = 0; i < jewelInfo.length; i++) {
                var info = App.ConfigManager.getJewelInfoById(jewelInfo[i].stone_id);
                if (info) {
                    var numInfo = game.BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, jewelInfo[i].stone_id);
                    if (numInfo) {
                        var maxLevel = App.ConfigManager.getConstConfigByType("JEWEL_LEVEL_MAX").value;
                        var baseInfo = App.ConfigManager.getItemInfoById(jewelInfo[i].stone_id);
                        if (numInfo.num >= 2 && baseInfo.limit_lv < maxLevel) {
                            return true;
                        }
                        else {
                            // return false;
                        }
                    }
                    else {
                        // return false;
                    }
                }
                else {
                    // return false;
                }
            }
            return false;
        };
        JewelModel.prototype.checkCanUpgradeAll = function () {
            for (var i = 0; i < this.heroModel.heroInfo.length; i++) {
                this.heroheadRedPoint[i] = false;
                for (var k = 1; k <= 10; k++) {
                    if (this.checkCanUpgradeByPos(i, k)) {
                        this.heroheadRedPoint[i] = true;
                        this.equipPartRedPoint[i + 1][k] = true;
                    }
                    else {
                        this.equipPartRedPoint[i + 1][k] = false;
                        // this.heroheadRedPoint[i] = false;
                    }
                }
            }
            // App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_RUBY_EMBED, false);
            // for (let i = 0; i < this.heroheadRedPoint.length; i++) {
            // 	if (this.heroheadRedPoint[i]) {
            // 		App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_RUBY_EMBED, true);
            // 		break;
            // 	}
            // }
        };
        JewelModel.prototype.checkCanEmble = function (pos) {
            var heroInfo = this.heroModel.heroInfo[pos];
            for (var k = 1; k <= 10; k++) {
                var jewelInfo = heroInfo.getJewelInfoByPart(k);
                for (var i = 0; i < jewelInfo.length; i++) {
                    var info = App.ConfigManager.getJewelInfoById(jewelInfo[i].stone_id);
                    if (info) {
                        //
                    }
                    else {
                        var jewelArray = game.BackpackModel.getInstance().getItemArrayByTypeAndSubType(ItemType.RUBY, i + 1);
                        if (jewelArray.length > 0) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        JewelModel.prototype.checkCanEmbleAll = function () {
            App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_RUBY_EMBED, false);
            for (var i = 0; i < this.heroModel.heroInfo.length; i++) {
                if (this.checkCanEmble(i)) {
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_RUBY_EMBED, true);
                    this.heroheadRedPoint[i] = true;
                }
            }
        };
        JewelModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        JewelModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return JewelModel;
    }(BaseModel));
    game.JewelModel = JewelModel;
    __reflect(JewelModel.prototype, "game.JewelModel");
})(game || (game = {}));
//# sourceMappingURL=JewelModel.js.map
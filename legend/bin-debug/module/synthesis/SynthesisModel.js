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
 * 合成模块数据模型
 * author ： zrj
*/
var game;
(function (game) {
    var SynthesisModel = (function (_super) {
        __extends(SynthesisModel, _super);
        function SynthesisModel() {
            var _this = _super.call(this) || this;
            _this.synthesisType = 1;
            _this.jewelRedPoint = [false, false, false, false];
            _this.wingRedPoint = [false, false, false, false];
            _this.jewelSubRedPoint = {};
            _this.wingSubRedPoint = {};
            return _this;
        }
        SynthesisModel.prototype.checkJewelCanSynthesisByType = function (type) {
            var data = App.ConfigManager.getItemInfoByTypeAndSubType(ItemType.RUBY, type);
            var exist = false;
            for (var i = 0; i < data.length; i++) {
                var info = App.ConfigManager.getSynthesisInfoById(data[i].id);
                var itemInfo = game.BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, info.need);
                if (!itemInfo) {
                    itemInfo = { num: 0 };
                }
                if (itemInfo.num >= info.number) {
                    this.jewelSubRedPoint[data[i].id] = true;
                    exist = true;
                }
                else {
                    this.jewelSubRedPoint[data[i].id] = false;
                }
            }
            return exist;
        };
        SynthesisModel.prototype.checkJewelCanSynthesisAll = function () {
            if (this.checkJewelCanSynthesisByType(JewelType.ATTACK)) {
                this.jewelRedPoint[0] = true;
            }
            else {
                this.jewelRedPoint[0] = false;
            }
            if (this.checkJewelCanSynthesisByType(JewelType.LIFE)) {
                this.jewelRedPoint[1] = true;
            }
            else {
                this.jewelRedPoint[1] = false;
            }
            if (this.checkJewelCanSynthesisByType(JewelType.DEFENCE)) {
                this.jewelRedPoint[2] = true;
            }
            else {
                this.jewelRedPoint[2] = false;
            }
            if (this.checkJewelCanSynthesisByType(JewelType.MAGIC)) {
                this.jewelRedPoint[3] = true;
            }
            else {
                this.jewelRedPoint[3] = false;
            }
            App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_RUBY_COMNINE_GEMSTONE, false);
            for (var i = 0; i < this.jewelRedPoint.length; i++) {
                if (this.jewelRedPoint[i]) {
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_RUBY_COMNINE_GEMSTONE, true);
                    break;
                }
            }
        };
        SynthesisModel.prototype.checkWingCanSynthesisByType = function (type) {
            var data = App.ConfigManager.getItemInfoByTypeAndSubType(ItemType.WING, type);
            var exist = false;
            for (var i = 0; i < data.length; i++) {
                var info = App.ConfigManager.getSynthesisInfoById(data[i].id);
                var itemInfo = game.BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, info.need);
                if (!itemInfo) {
                    itemInfo = { num: 0 };
                }
                if (itemInfo.num >= info.number) {
                    this.wingSubRedPoint[data[i].id] = true;
                    exist = true;
                }
                else {
                    this.wingSubRedPoint[data[i].id] = false;
                }
            }
            return exist;
        };
        SynthesisModel.prototype.checkWingCanSynthesisAll = function () {
            if (this.checkWingCanSynthesisByType(WingEquipType.ZHENGYU)) {
                this.wingRedPoint[0] = true;
            }
            else {
                this.wingRedPoint[0] = false;
            }
            if (this.checkWingCanSynthesisByType(WingEquipType.FUYU)) {
                this.wingRedPoint[1] = true;
            }
            else {
                this.wingRedPoint[1] = false;
            }
            if (this.checkWingCanSynthesisByType(WingEquipType.RONGYU)) {
                this.wingRedPoint[2] = true;
            }
            else {
                this.wingRedPoint[2] = false;
            }
            if (this.checkWingCanSynthesisByType(WingEquipType.XUYU)) {
                this.wingRedPoint[3] = true;
            }
            else {
                this.wingRedPoint[3] = false;
            }
            App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_RUBY_COMNINE_WING, false);
            for (var i = 0; i < this.jewelRedPoint.length; i++) {
                if (this.wingRedPoint[i]) {
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_RUBY_COMNINE_WING, true);
                    break;
                }
            }
        };
        SynthesisModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        SynthesisModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return SynthesisModel;
    }(BaseModel));
    game.SynthesisModel = SynthesisModel;
    __reflect(SynthesisModel.prototype, "game.SynthesisModel");
})(game || (game = {}));
//# sourceMappingURL=SynthesisModel.js.map
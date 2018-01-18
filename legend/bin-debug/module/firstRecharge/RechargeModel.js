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
 * Author: yangyipeng         （必须加上，知道是谁做的）
 * 充值模块模型 2017/06/20.
 */
var game;
(function (game) {
    var RechargeModel = (function (_super) {
        __extends(RechargeModel, _super);
        function RechargeModel() {
            return _super.call(this) || this;
        }
        Object.defineProperty(RechargeModel.prototype, "rechargeViewData", {
            get: function () {
                return this._rechargeViewData;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 常规充值页面数据
         */
        RechargeModel.prototype.updateRechargeViewData = function (data) {
            var rechargeVo = new game.RechargeVo();
            rechargeVo.gold = data.up_gold;
            rechargeVo.vip = data.vip;
            var chargeConfig = ConfigManager.getInstance().getChargeInfo();
            var chargeList = data.list;
            //首冲多少人民币对应奖励元宝
            var chargeArr = [];
            for (var key in chargeConfig) {
                var flag = true;
                var rmb = chargeConfig[key]["rmb"];
                for (var i = 0; i < chargeList.length; i++) {
                    if (rmb == chargeList[i]["rmb"] && chargeList[i]["ext_gold"] != 0) {
                        chargeArr.push([chargeConfig[key], true]); //充值可以赠送元宝
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    chargeArr.push([chargeConfig[key], false]); //充值不可以再赠送元宝
                }
            }
            var rechargeDataArr = new eui.ArrayCollection(chargeArr);
            rechargeVo.rechargeList = rechargeDataArr;
            this._rechargeViewData = rechargeVo;
        };
        /**
         * 清理
         */
        RechargeModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        /**
         * 销毁
         */
        RechargeModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            //销毁处理
        };
        return RechargeModel;
    }(BaseModel));
    game.RechargeModel = RechargeModel;
    __reflect(RechargeModel.prototype, "game.RechargeModel");
})(game || (game = {}));
//# sourceMappingURL=RechargeModel.js.map
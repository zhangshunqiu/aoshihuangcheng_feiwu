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
 * Author: YANGYIPENG          （必须加上，知道是谁做的）
 * 投资模块模型 2017/06/20.
 */
var game;
(function (game) {
    var InvestModel = (function (_super) {
        __extends(InvestModel, _super);
        function InvestModel() {
            var _this = _super.call(this) || this;
            _this._isBuy = false;
            return _this;
        }
        Object.defineProperty(InvestModel.prototype, "listData", {
            get: function () {
                return this._listData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InvestModel.prototype, "isBuy", {
            get: function () {
                return this._isBuy;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InvestModel.prototype, "leftTime", {
            get: function () {
                return this._leftTime;
            },
            enumerable: true,
            configurable: true
        });
        InvestModel.prototype.investDataUpdate = function (data) {
            // message pbInvestment{
            // optional int32 buy  = 1;               //是否已购买1是0否
            // optional int32 left_time  = 2;         //剩余时间(秒数)
            // repeated pbItem items = 3;             //已领取列表
            this._isBuy = data.buy;
            this._leftTime = new Date().getSeconds() + data.left_time;
            var investList = [];
            data.items.forEach(function (item, index) {
                investList.push(item.id);
            });
            var investConfig = ConfigManager.getInstance().getInvestInfo();
            var _arr = [];
            for (var key in investConfig) {
                if (investList.indexOf(Number(key)) != -1) {
                    var investVo = new game.InvestVo(investConfig[key], true); //true已经领取
                    _arr.push(investVo);
                }
                else {
                    var investVo = new game.InvestVo(investConfig[key], false); //false还没有领取
                    _arr.push(investVo);
                }
            }
            this._listData = new eui.ArrayCollection(_arr);
        };
        InvestModel.prototype.investBuy = function (data) {
            if (data.result) {
                this._isBuy = true;
            }
        };
        InvestModel.prototype.investReward = function (id) {
            var investList = this._listData.source;
            for (var i = 0; i < investList.length; i++) {
                if (investList[i].id == id) {
                    investList[i].get = true;
                    this._listData.refresh();
                    break;
                }
                // this._listData.refresh();
            }
        };
        /**
         * 清理
         */
        InvestModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        /**
         * 销毁
         */
        InvestModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            //销毁处理
        };
        return InvestModel;
    }(BaseModel));
    game.InvestModel = InvestModel;
    __reflect(InvestModel.prototype, "game.InvestModel");
})(game || (game = {}));
//# sourceMappingURL=InvestModel.js.map
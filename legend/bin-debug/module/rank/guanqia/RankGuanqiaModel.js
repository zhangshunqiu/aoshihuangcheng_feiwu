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
 * Author: yangyipeng
 * 关卡排行榜模块模型
 */
var game;
(function (game) {
    var RankGuanqiaModel = (function (_super) {
        __extends(RankGuanqiaModel, _super);
        function RankGuanqiaModel() {
            return _super.call(this) || this;
        }
        Object.defineProperty(RankGuanqiaModel.prototype, "rankArr", {
            get: function () {
                return this._rankArr;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RankGuanqiaModel.prototype, "myRank", {
            get: function () {
                return this._myRank;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RankGuanqiaModel.prototype, "rankListArr", {
            get: function () {
                return this._rankListArr;
            },
            enumerable: true,
            configurable: true
        });
        RankGuanqiaModel.prototype.ReceiveGuanqiaData = function (data) {
            //我的排名
            this._myRank = data.my_rank;
            //关卡列表
            var arr = [];
            var list = data.list;
            for (var i = 0; i < list.length; i++) {
                var guanqiaListVo = new GuanqiaListVo();
                guanqiaListVo.combat = this.fixNum(list[i].combat); //进位
                guanqiaListVo.name = list[i].name;
                guanqiaListVo.guanqia = list[i].layer;
                guanqiaListVo.rank = list[i].rank;
                guanqiaListVo.month_card = list[i].month_card;
                guanqiaListVo.vipLv = list[i].vip;
                arr.push(guanqiaListVo);
            }
            this._rankListArr = new eui.ArrayCollection(arr);
            this._rankArr = arr;
        };
        RankGuanqiaModel.prototype.fixNum = function (num) {
            if (num / 1000000 >= 1) {
                var _num = num / 10000;
                return _num.toFixed(1) + "万";
            }
            else {
                return num + "";
            }
        };
        /**
         * 清理
         */
        RankGuanqiaModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        /**
         * 销毁
         */
        RankGuanqiaModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            //销毁处理
        };
        return RankGuanqiaModel;
    }(BaseModel));
    game.RankGuanqiaModel = RankGuanqiaModel;
    __reflect(RankGuanqiaModel.prototype, "game.RankGuanqiaModel");
    var GuanqiaListVo = (function () {
        function GuanqiaListVo() {
        }
        return GuanqiaListVo;
    }());
    game.GuanqiaListVo = GuanqiaListVo;
    __reflect(GuanqiaListVo.prototype, "game.GuanqiaListVo");
})(game || (game = {}));
//# sourceMappingURL=RankGuanqiaModel.js.map
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
 * 幸运转盘模块模型 2017/06/20.
 */
var game;
(function (game) {
    var FortuneModel = (function (_super) {
        __extends(FortuneModel, _super);
        function FortuneModel() {
            return _super.call(this) || this;
        }
        Object.defineProperty(FortuneModel.prototype, "leftTime", {
            // private _result:number;
            get: function () {
                return this._leftTime;
            },
            set: function (time) {
                this._leftTime = time;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FortuneModel.prototype, "useTimes", {
            get: function () {
                return this._useTimes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FortuneModel.prototype, "gold", {
            get: function () {
                return this._gold;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FortuneModel.prototype, "maxGold", {
            get: function () {
                return this._maxGold;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FortuneModel.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        FortuneModel.prototype.fortuneViewData = function (data) {
            this._leftTime = data.left_time;
            this._useTimes = data.use_times;
        };
        FortuneModel.prototype.fortunePoolData = function (data) {
            // 	optional int32 gold		= 1;	// 充值数
            // 	optional int32 max_gold	= 2;	// 满值数
            // 	optional string name	= 3;	// 上次幸运玩家名
            this._gold = data.gold;
            this._maxGold = data.max_gold;
            this._name = data.name;
        };
        // public setFortuneResult(data):void
        // {   
        //     if(data){
        //         this._result = data;
        //     }
        // }
        /**
         * 清理
         */
        FortuneModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        /**
         * 销毁
         */
        FortuneModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            //销毁处理
        };
        return FortuneModel;
    }(BaseModel));
    game.FortuneModel = FortuneModel;
    __reflect(FortuneModel.prototype, "game.FortuneModel");
})(game || (game = {}));
//# sourceMappingURL=FortuneModel.js.map
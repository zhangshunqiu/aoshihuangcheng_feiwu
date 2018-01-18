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
 * 夺宝数据模型
*/
var game;
(function (game) {
    var RaiderModel = (function (_super) {
        __extends(RaiderModel, _super);
        function RaiderModel() {
            var _this = _super.call(this) || this;
            _this.storageRecord = []; //寻宝展示记录
            _this.curDay = 1; //当前开服时间
            _this.storageItem = []; //仓库内物品
            _this.time = 1; //一次还是10次
            return _this;
        }
        RaiderModel.prototype.updateStorageInfo = function (data) {
            this.storageItem = data;
            ;
            this.storageCapacity = data.length;
        };
        RaiderModel.prototype.updatestorageRecord = function (data) {
            this.storageRecord = [];
            //最多5条
            for (var k in data) {
                this.storageRecord.push(data[k]);
                if (this.storageRecord.length > 5) {
                    this.storageRecord.shift();
                }
            }
        };
        RaiderModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        RaiderModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return RaiderModel;
    }(BaseModel));
    game.RaiderModel = RaiderModel;
    __reflect(RaiderModel.prototype, "game.RaiderModel");
})(game || (game = {}));
//# sourceMappingURL=RaiderModel.js.map
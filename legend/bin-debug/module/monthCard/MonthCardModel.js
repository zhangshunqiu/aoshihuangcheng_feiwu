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
 * Author: liuyonggen
 * 月卡系统数据模型 2017/11/24
 */
var game;
(function (game) {
    var MonthCardModel = (function (_super) {
        __extends(MonthCardModel, _super);
        function MonthCardModel() {
            var _this = _super.call(this) || this;
            _this.leftTime = 0; //月卡剩余时间
            _this.leftTimeDay = 0;
            _this.leftTimeHour = 0;
            _this.day = 0; //月卡领取当前天数
            _this.rewardNum = 0; //未领取的奖励数
            _this.buyNum = 0; // 购买次数
            _this.rewardList = []; //购买奖励数组
            _this.initInfo();
            return _this;
        }
        MonthCardModel.prototype.updateInfo = function (data) {
            this.leftTime = data.left_time;
            this.day = data.day;
            this.rewardNum = data.reward_num;
            this.leftTimeDay = Math.floor(this.leftTime / (3600 * 24));
            this.leftTimeHour = Math.floor((this.leftTime / 3600) % 24);
        };
        MonthCardModel.prototype.updateBuyNum = function (data) {
            this.buyNum = data;
            this.rewardList = [];
            if (data == 1) {
                this.rewardList.push([1, 102, this.monthCardInfo.gold]);
                this.rewardList.push(this.monthCardInfo.reward[0]);
            }
            else if (data == 2) {
                this.rewardList.push([1, 102, this.monthCardInfo.gold]);
            }
        };
        MonthCardModel.prototype.initInfo = function () {
            this.monthCardInfo = App.ConfigManager.getMonthCardInfoById(1);
        };
        /**
         * 清理
         */
        MonthCardModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        /**
         * 销毁
         */
        MonthCardModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            //销毁处理
        };
        return MonthCardModel;
    }(BaseModel));
    game.MonthCardModel = MonthCardModel;
    __reflect(MonthCardModel.prototype, "game.MonthCardModel");
})(game || (game = {}));
//# sourceMappingURL=MonthCardModel.js.map
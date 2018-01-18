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
 * 活动数据模型
*/
var game;
(function (game) {
    var ActivityModel = (function (_super) {
        __extends(ActivityModel, _super);
        function ActivityModel() {
            var _this = _super.call(this) || this;
            _this.dailyRankInfo = {}; //每日竞技
            _this.limitGiftInfo = {}; //限购礼包
            _this.dailyRechargeInfo = {}; //每日累充
            _this.continueRechargeInfo = {}; //连续充值
            _this.totalRechargeInfo = {}; //累计充值
            _this.perferentialGiftInfo = {}; //特惠礼包
            _this.redDotDict = {}; //红点字典，key为活动id
            return _this;
        }
        //更新限购礼包信息
        ActivityModel.prototype.updateLimitGiftInfo = function (data) {
            for (var key in this.limitGiftInfo.list) {
                if (this.limitGiftInfo.list[key].id == data.id) {
                    this.limitGiftInfo.list[key].left_num = data.left_num;
                    break;
                }
                // App.logzrj("data   ",key,this.limitGiftInfo.list[key]);
            }
            // App.logzrj("list",this.limitGiftInfo.list);
        };
        //更新累计充值信息
        ActivityModel.prototype.updateTotalRecharge = function (data) {
            this.totalRechargeInfo["left_time"] = data.left_time;
            this.totalRechargeInfo["charge"] = data.charge;
            this.totalRechargeInfo["state"] = data.state; // 状态 （0不能领 1可领 2已领
            this.checkActicityRedDot(4);
        };
        //更新每日累充信息
        ActivityModel.prototype.updateDailyRechargeInfo = function (data) {
            for (var key in this.dailyRechargeInfo.list) {
                if (this.dailyRechargeInfo.list[key].id == data.id) {
                    this.dailyRechargeInfo.list[key].state = 2;
                    break;
                }
            }
            this.sortDailyRecharge();
            this.checkActicityRedDot(5);
        };
        //排序每日累充
        ActivityModel.prototype.sortDailyRecharge = function () {
            var final = [];
            var array3 = []; //未达成
            var array1 = []; //可领
            var array2 = []; //已领
            this.dailyRechargeInfo.list.forEach(function (value, index, array) {
                if (value.state == 0) {
                    array3.push(value);
                }
                else if (value.state == 1) {
                    array1.push(value);
                }
                else {
                    array2.push(value);
                }
            }, this);
            final = array1.concat(array3, array2);
            this.dailyRechargeInfo.list = final;
        };
        //更新连续充值信息
        ActivityModel.prototype.updateContinueRechargeInfo = function (data) {
            for (var key in this.continueRechargeInfo.list) {
                if (this.continueRechargeInfo.list[key].id == data.id) {
                    this.continueRechargeInfo.list[key].state = 2;
                    break;
                }
            }
            this.sortContinueRecharge();
        };
        //排序连续充值 0不能领 1可领 2已领
        ActivityModel.prototype.sortContinueRecharge = function () {
            var final = [];
            var array3 = []; //未达成
            var array1 = []; //可领
            var array2 = []; //已领
            this.continueRechargeInfo.list.forEach(function (value, index, array) {
                if (value.state == 0) {
                    array3.push(value);
                }
                else if (value.state == 1) {
                    array1.push(value);
                }
                else {
                    array2.push(value);
                }
            }, this);
            final = array1.concat(array3, array2);
            this.continueRechargeInfo.list = final;
        };
        ActivityModel.prototype.updatePerferentialGiftInfo = function (data) {
            this.perferentialGiftInfo = data;
        };
        /**
         * 活动红点检测，id为活动id
        */
        ActivityModel.prototype.checkActicityRedDot = function (id) {
            switch (id) {
                case 4: {
                    if (this.totalRechargeInfo["state"] == 1) {
                        this.redDotDict[4] = true;
                        App.BtnTipManager.setTypeValue(ConstBtnTipType.ACTIVITY_AllRECHARGE, true);
                    }
                    else {
                        this.redDotDict[4] = false;
                        App.BtnTipManager.setTypeValue(ConstBtnTipType.ACTIVITY_AllRECHARGE, false);
                    }
                    break;
                }
                case 5: {
                    for (var key in this.dailyRechargeInfo.list) {
                        if (this.dailyRechargeInfo.list[key].state == 1) {
                            this.redDotDict[5] = true;
                            App.BtnTipManager.setTypeValue(ConstBtnTipType.ACTIVITY_DAILYRECHARGE, true);
                            return;
                        }
                    }
                    this.redDotDict[5] = false;
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.ACTIVITY_DAILYRECHARGE, false);
                    break;
                }
            }
        };
        ActivityModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        ActivityModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return ActivityModel;
    }(BaseModel));
    game.ActivityModel = ActivityModel;
    __reflect(ActivityModel.prototype, "game.ActivityModel");
})(game || (game = {}));
//# sourceMappingURL=ActivityModel.js.map
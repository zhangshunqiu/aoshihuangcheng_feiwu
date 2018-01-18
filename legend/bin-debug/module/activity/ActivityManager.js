var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 活动模块配置
 * 格式 ----->  活动id : 配置信息 {id:活动id,icon:活动图标, nameIcon:活动名称, view:类名}
*/
var ActivityConfig = {
    1: { id: 1, icon: "activity_icon_meirijingji_png", nameIcon: "", view: "game.ActivityDailyRank" },
    2: { id: 2, icon: "activity_icon_xiangoulibao_png", nameIcon: "", view: "game.ActivityLimitGift" },
    3: { id: 3, icon: "activity_icon_tehuilibao_png", nameIcon: "", view: "game.ActivityPreferentialGift" },
    4: { id: 4, icon: "activity_icon_leijichongzhi_png", nameIcon: "", view: "game.ActivityTotalRecharge" },
    5: { id: 5, icon: "activity_icon_meirileichong_png", nameIcon: "", view: "game.ActivityDailyRecharge" },
    6: { id: 6, icon: "activity_icon_lianxuchongzhi_png", nameIcon: "", view: "game.ActivityContinueRecharge" },
};
/**
 * 活动模块管理器
 * author ： zrj
 *
*/
var ActivityManager = (function () {
    function ActivityManager() {
        this.activityDict = []; //所有开启中的活动模块
    }
    ActivityManager.getInstance = function () {
        if (this._instance == null) {
            this._instance = new ActivityManager();
        }
        return this._instance;
    };
    Object.defineProperty(ActivityManager.prototype, "curActivityId", {
        get: function () {
            return this._curActivityId;
        },
        enumerable: true,
        configurable: true
    });
    //更新活动列表
    ActivityManager.prototype.updateActivityDict = function (data) {
        this.activityDict = data;
        this.sortActivity(); //排序 
        if (!this._curActivityId && this.activityDict.length > 0) {
            this._curActivityId = this.activityDict[0];
        }
        App.EventSystem.dispatchEvent(PanelNotify.ACTIVITY_UPDATE_MAIN_VIEW);
    };
    //打开活动页面
    ActivityManager.prototype.openActivity = function (activityId) {
        if (activityId && activityId == this._curActivityId) {
        }
        else if (activityId) {
            if (App.WinManager.isOpen(WinName.ACTIVITY)) {
                App.EventSystem.dispatchEvent(PanelNotify.ACTIVITY_CHANGE_VIEW, { id: activityId });
            }
            else {
                App.WinManager.openWin(WinName.ACTIVITY, { id: activityId });
            }
            this._curActivityId = activityId;
        }
        else {
            this._curActivityId = undefined;
            App.WinManager.openWin(WinName.ACTIVITY);
        }
    };
    //关闭活动模块
    ActivityManager.prototype.closeActivity = function () {
        this._curActivityId = undefined;
        // App.WinManager.closeWin(WinName.ACTIVITY);
    };
    //活动根据优先级排序
    ActivityManager.prototype.sortActivity = function () {
    };
    return ActivityManager;
}());
__reflect(ActivityManager.prototype, "ActivityManager");
//# sourceMappingURL=ActivityManager.js.map
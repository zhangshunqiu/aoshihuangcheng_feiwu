
/**
 * 活动模块配置
 * 格式 ----->  活动id : 配置信息 {id:活动id,icon:活动图标, nameIcon:活动名称, view:类名}
*/
const ActivityConfig = {
	1: { id: 1, icon: "activity_icon_meirijingji_png", nameIcon: "", view: "game.ActivityDailyRank" },
	2: { id: 2, icon: "activity_icon_xiangoulibao_png", nameIcon: "", view: "game.ActivityLimitGift" },
	3: { id: 3, icon: "activity_icon_tehuilibao_png", nameIcon: "", view: "game.ActivityPreferentialGift" },
	4: { id: 4, icon: "activity_icon_leijichongzhi_png", nameIcon: "", view: "game.ActivityTotalRecharge" },
	5: { id: 5, icon: "activity_icon_meirileichong_png", nameIcon: "", view: "game.ActivityDailyRecharge" },
	6: { id: 6, icon: "activity_icon_lianxuchongzhi_png", nameIcon: "", view: "game.ActivityContinueRecharge" },

}

/**
 * 活动模块管理器
 * author ： zrj
 * 
*/
class ActivityManager {

	public activityDict: Array<number> = []; //所有开启中的活动模块
	private _curActivityId: number; //当前显示的活动模块id
	// private _acitivtyMainView: game.ActivityMainView;

	private static _instance: ActivityManager;

	public static getInstance(): ActivityManager {
		if (this._instance == null) {
			this._instance = new ActivityManager();
		}
		return this._instance;
	}
	public constructor() {

	}

	public get curActivityId() {
		return this._curActivityId;
	}

	//更新活动列表
	public updateActivityDict(data) {
		this.activityDict = data;
		this.sortActivity();//排序 
		if (!this._curActivityId && this.activityDict.length > 0) {
			this._curActivityId = this.activityDict[0];
		}
		App.EventSystem.dispatchEvent(PanelNotify.ACTIVITY_UPDATE_MAIN_VIEW);
	}

	//打开活动页面
	public openActivity(activityId?: number) {
		if (activityId && activityId == this._curActivityId) { //已经打开

		} else if (activityId) {  //打开新的活动界面
			if (App.WinManager.isOpen(WinName.ACTIVITY)) {
				App.EventSystem.dispatchEvent(PanelNotify.ACTIVITY_CHANGE_VIEW, { id: activityId });
			} else {
				App.WinManager.openWin(WinName.ACTIVITY, { id: activityId });
			}
			this._curActivityId = activityId;
		} else { //没有这个Id，打开默认的
			this._curActivityId = undefined;
			App.WinManager.openWin(WinName.ACTIVITY);
		}
	}

	//关闭活动模块
	public closeActivity() {
		this._curActivityId = undefined;
		// App.WinManager.closeWin(WinName.ACTIVITY);
	}

	//活动根据优先级排序
	private sortActivity() {

	}
}
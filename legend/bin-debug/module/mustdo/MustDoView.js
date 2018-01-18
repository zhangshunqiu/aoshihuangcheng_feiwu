/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 每日必做UI界面逻辑 2017/06/20.
 */
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
var game;
(function (game) {
    // export class MyTabbar extends eui.TabBar
    // {
    // 	public setTapTabBar(index:number){
    //        this.setSelectedIndex(index,true);
    // 	}
    // }
    var MustDoView = (function (_super) {
        __extends(MustDoView, _super);
        function MustDoView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._mustdomodel = game.MustDoModel.getInstance();
            _this._curSelIndex = 0;
            return _this;
        }
        //activity
        // public scr_task: eui.Scroller;
        // public pgbar_activity: eui.ProgressBar;
        // public list_chest: Array<ActivityRewardItem> = [];
        // public activity_reward1: ActivityRewardItem;
        // public activity_reward2: ActivityRewardItem;
        // public activity_reward3: ActivityRewardItem;
        // public activity_reward4: ActivityRewardItem;
        // private _listtask: eui.List = new eui.List();
        // private _eventid_activity: number = 0;
        //medal
        // public pgbar_medalvalue: eui.ProgressBar;
        // public bt_view: eui.Image;
        // public btn_lvup: eui.Image;
        // public bt_untake: eui.Image;
        // public bt_getachieve: eui.Label;
        // public lb_pgtext: eui.Label;
        // public lb_rank: eui.Label;
        // public lb_lv: eui.Label;
        // public lb_honor: eui.Label;
        // public lb_power: eui.BitmapLabel;
        // public lb_untake: eui.Label;
        // public lb_hp: eui.Label;
        // public lb_attak: eui.Label;
        // public lb_dfphydic: eui.Label;
        // public lb_dfmagic: eui.Label;
        // public lb_nexthp: eui.Label;
        // public lb_nextak: eui.Label;
        // public lb_nextdfp: eui.Label;
        // public lb_nextdfm: eui.Label;
        // private _eventid_medal: number = 0;
        //achieve
        // public lb_achievepercent: eui.Label;
        // public lb_achievevalue: eui.Label;
        // public scr_achieve: eui.Scroller;
        // public bt_takeall: eui.Image;
        // private _listachieve: eui.List = new eui.List();
        // private _eventid_achieve: number = 0;
        // //title 
        // public lb_totalactivity: eui.Label;
        // public btn_lighten: eui.Image;
        // public scr_title: eui.Scroller;
        // private _listtitle: eui.List = new eui.List();
        // private _eventid_Title: number = 0;
        //private _btnTakeMc: AMovieClip;//成就值多少的特效
        //private _btnTakeAllMc: AMovieClip;//一键领取特效
        MustDoView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.closeWin(WinName.MUSTDO);
            }, this);
            this.bt_back.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.closeWin(WinName.MUSTDO);
            }, this);
            this.initView();
        };
        MustDoView.prototype.initBtnTips = function () {
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.TASK_MEDAL, this.rb_medal);
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.TASK_DAILY, this.rb_mustdo);
            //App.BtnTipManager.addBtnTipItem(ConstBtnTipType.TASK_ACHIEVE, this.rb_achieve);
        };
        MustDoView.prototype.initView = function () {
            var _this = this;
            this.initBtnTips();
            var radioGroup = new eui.RadioButtonGroup();
            radioGroup.addEventListener(eui.UIEvent.CHANGE, function (evt) {
                var radioGroup = evt.target;
                _this.changeMustDoState(radioGroup.selectedValue);
            }, this);
            this.rb_mustdo.group = radioGroup;
            this.rb_mustdo.value = 1;
            this.rb_mustdo.label = "每日必做";
            this.rb_mustdo.selected = true;
            this.rb_medal.group = radioGroup;
            this.rb_medal.label = "勋章";
            this.rb_medal.value = 0; //原本是和勋章在一起的，后来被拆到了别的地方 后来勋章又移过来了
            // this.rb_achieve.group = radioGroup;
            // this.rb_achieve.label = "成就";
            // this.rb_achieve.value = 2;
            // this.rb_medal.group = radioGroup;
            // this.rb_medal.label = "勋章";
            // this.rb_medal.value = 0;
            // //this._curgroup = this.gp_activity;
            // this.tab_medal.validateNow();
            // this.tab_medal.addEventListener(eui.UIEvent.CREATION_COMPLETE, this._onCreatComplete, this)
            // this.scr_task.viewport = this._listtask;
            // this.scr_task.scrollPolicyH = eui.ScrollPolicy.OFF;
            // this._listtask.itemRenderer = TaskItem;
            // this.list_chest.push(this.activity_reward1);
            // this.list_chest.push(this.activity_reward2);
            // this.list_chest.push(this.activity_reward3);
            // this.list_chest.push(this.activity_reward4);
            // this.scr_achieve.viewport = this._listachieve;
            // this.scr_task.scrollPolicyH = eui.ScrollPolicy.OFF;
            // this._listachieve.itemRenderer = TaskItem;
            // this.bt_takeall.addEventListener(egret.TouchEvent.TOUCH_TAP, this.takeAll, this);
            // this.scr_title.viewport = this._listtitle;
            // this.scr_title.scrollPolicyH = eui.ScrollPolicy.OFF;
            // this._listtitle.itemRenderer = TitleItem;
            // this.btn_lighten.addEventListener(egret.TouchEvent.TOUCH_TAP, this.lightenProperty, this);
            // this.bt_getachieve.textFlow = [{ text: "获得成就", style: { "underline": true } }]
            // this.btn_lvup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.medalLvUp, this);
            // this.bt_view.addEventListener(egret.TouchEvent.TOUCH_TAP, this.viewMedalRank, this);
            // this.bt_getachieve.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getAchieveWay, this);
            // this.bt_untake.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getUnTakeAchieve, this);
            // if (this._btnTakeMc == null) {                     //未领取成就值特效
            // 	this._btnTakeMc = new AMovieClip();
            // 	this.gp_medal.addChild(this._btnTakeMc);
            // 	this._btnTakeMc.x = this.bt_untake.x + 55;
            // 	this._btnTakeMc.y = this.bt_untake.y + 52;
            // 	this._btnTakeMc.touchEnabled = false;
            // }
            // this._btnTakeMc.visible = false;
            // if (this._btnTakeAllMc == null) {                     //一键领取特效
            // 	this._btnTakeAllMc = new AMovieClip();
            // 	this.gp_achieve.addChild(this._btnTakeAllMc);
            // 	this._btnTakeAllMc.touchEnabled = false;
            // 	this._btnTakeAllMc.x = this.bt_takeall.x + 151 / 2;
            // 	this._btnTakeAllMc.y = this.bt_takeall.y + 53 / 2;
            // }
            // this._btnTakeAllMc.visible = false;
        };
        /**
         * 打开窗口
        */
        MustDoView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            // App.Socket.send(16001,{});
            // if (this._eventid_activity == 0)
            // 	this._eventid_activity = App.EventSystem.addEventListener(PanelNotify.MUSTDO_UPDATEACTIVITY, this.updateActivity, this);
            // if (this._eventid_medal == 0)
            // 	this._eventid_medal = App.EventSystem.addEventListener(PanelNotify.MUSTDO_UPDATEMEDAL, this.updateMedal, this);
            // if (this._eventid_achieve == 0)
            // 	this._eventid_achieve = App.EventSystem.addEventListener(PanelNotify.MUSTDO_UPDATESACHIEVE, this.updateAchieve, this);
            // if (this._eventid_Title == 0)
            // 	this._eventid_Title = App.EventSystem.addEventListener(PanelNotify.MUSTDO_UPDATETITLE, this.updateTitle, this);
            //this.openActivity();
            // if (this._activity_view == null) {
            // 	this._activity_view = new ActivityTaskView("ActivityTaskSkin")
            // 	this.addChild(this._activity_view);
            // }
            // this._activity_view.readyOpen({ data: {} });
            // this._curSelView = this._activity_view;
            // this._curSelIndex = 1;
            if (openParam && openParam.index) {
                if (openParam.index == 2) {
                    this.changeMustDoState(this.rb_medal.value);
                    this.rb_medal.selected = true;
                }
            }
            else {
                this.changeMustDoState(this.rb_mustdo.value);
                this.rb_mustdo.selected = true;
            }
        };
        /**
         * 关闭窗口
         */
        MustDoView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        MustDoView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            // if (this._eventid_activity != 0) {
            // 	App.EventSystem.removeEventListener(PanelNotify.MUSTDO_UPDATEACTIVITY, this._eventid_activity);
            // 	this._eventid_activity = 0;
            // }
            // if (this._eventid_medal != 0) {
            // 	App.EventSystem.removeEventListener(PanelNotify.MUSTDO_UPDATEMEDAL, this._eventid_medal);
            // 	this._eventid_medal = 0;
            // }
            // if (this._eventid_achieve != 0) {
            // 	App.EventSystem.removeEventListener(PanelNotify.MUSTDO_UPDATESACHIEVE, this._eventid_achieve);
            // 	this._eventid_achieve = 0;
            // }
            // if (this._eventid_Title != 0) {
            // 	App.EventSystem.removeEventListener(PanelNotify.MUSTDO_UPDATETITLE, this._eventid_Title);
            // 	this._eventid_Title = 0;
            // }
            // if (this._btnTakeMc) {
            // 	this._btnTakeMc.stop();
            // 	this._btnTakeMc.destroy();
            // 	this._btnTakeMc = null;
            // }
            // if (this._btnTakeAllMc) {
            // 	this._btnTakeAllMc.stop();
            // 	this._btnTakeAllMc.destroy();
            // 	this._btnTakeAllMc = null;
            // }
            // for (let i = 0; i < this.list_chest.length; i++) {
            // 	this.list_chest[i].clearRewardEff();
            // }
        };
        /**
         * 销毁
         */
        MustDoView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        MustDoView.prototype.changeMustDoState = function (index) {
            var _this = this;
            if (this._curSelIndex == index) {
                return;
            }
            if (this._curSelView) {
                this._curSelView.clear();
            }
            //this._curgroup.visible = false;
            //this._btnTakeMc.stop();
            //this._btnTakeMc.visible = false;
            //this._btnTakeAllMc.stop();
            //this._btnTakeAllMc.visible = false;
            switch (index + 1) {
                case MustDoType.MEDAL:
                    RES.getResAsync("medal_xunzhang_title2_png", function (texture) {
                        _this.commonWin.img_title.texture = texture;
                    }, this);
                    if (this._medal_view == null) {
                        this._medal_view = new game.MustDoMedalView("MustDoMedalSkin");
                        this.addChild(this._medal_view);
                    }
                    this._medal_view.readyOpen({ data: {} });
                    this._curSelView = this._medal_view;
                    break;
                case MustDoType.ACTIVITY:
                    // this._curgroup = this.gp_activity;
                    // this._curgroup.visible = true;
                    if (this._activity_view == null) {
                        this._activity_view = new game.ActivityTaskView("ActivityTaskSkin");
                        this.addChild(this._activity_view);
                    }
                    this._activity_view.readyOpen({ data: {} });
                    this._curSelView = this._activity_view;
                    RES.getResAsync("task_meiribizuo_title_png", function (texture) {
                        _this.commonWin.img_title.texture = texture;
                    }, this);
                    //this.openActivity();
                    break;
            }
            //this._curtype = index;
            this._curSelIndex = index;
        };
        return MustDoView;
    }(BaseView));
    game.MustDoView = MustDoView;
    __reflect(MustDoView.prototype, "game.MustDoView");
    // export class TaskItem extends eui.ItemRenderer {
    // 	public lb_taskname: eui.Label;
    // 	public lb_reward: eui.Label;
    // 	public lb_progress: eui.Label;
    // 	public gp_finish: eui.Group;
    // 	public gp_goto: eui.Group;
    // 	public gp_take: eui.Group;
    // 	public bt_take: eui.Image;
    // 	public bt_goto: eui.Image;
    // 	public tv_data: TaskVo;;
    // 	public constructor() {
    // 		super();
    // 		this.skinName = "MustDoItemSkin";
    // 		this.gp_finish.visible = false;
    // 		this.gp_goto.visible = false;
    // 		this.gp_take.visible = false;
    // 		this.bt_take.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
    // 			this.getTaskReward();
    // 		}, this);
    // 		this.bt_goto.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
    // 			this.gotoTask();
    // 		}, this);
    // 	}
    // 	public getTaskReward() {
    // 		if (this.tv_data.type == MustDoType.ACTIVITY)
    // 			App.Socket.send(18002, { task_id: this.tv_data.task_id });
    // 		else if (this.tv_data.type == MustDoType.ACHIEVE)
    // 			App.Socket.send(19002, { achieve_id: this.tv_data.task_id });
    // 	}
    // 	public gotoTask() {
    // 		if (this.tv_data.type == MustDoType.ACTIVITY) {
    // 			let info = App.ConfigManager.getTaskDailyInfoById(this.tv_data.task_id);
    // 			MainModuleJump.jumpToModule(info.skip);
    // 		}
    // 		else if (this.tv_data.type == MustDoType.ACHIEVE) {
    // 			let info = App.ConfigManager.getAchieveInfoById(this.tv_data.task_id);
    // 			MainModuleJump.jumpToModule(info.skip);
    // 		}
    // 	}
    // 	public dataChanged() {
    // 		let tv: TaskVo = this.data as TaskVo;
    // 		this.tv_data = tv;
    // 		this.lb_taskname.text = tv.task_name;
    // 		if (tv.need_num > tv.finish_num)
    // 			this.lb_progress.textFlow = [{ text: tv.finish_num + "", style: { textColor: 0xf10000 } }, { text: "/" + tv.need_num, style: { textColor: 0xffffff } }];
    // 		else
    // 			this.lb_progress.textFlow = [{ text:  tv.need_num + "" }, { text: "/" + tv.need_num, style: { textColor: 0xffffff } }];//超过上限的显示为上限
    // 		//this.lb_progress.text = tv.finish_num + "/" + tv.need_num;//
    // 		if (tv.state == 2) {
    // 			this.lb_progress.text = "";
    // 		}
    // 		switch (tv.state) {
    // 			case 0:
    // 				this.gp_take.visible = false;
    // 				this.gp_finish.visible = false;
    // 				this.gp_goto.visible = true;
    // 				break;
    // 			case 1:
    // 				this.gp_take.visible = true;
    // 				this.gp_finish.visible = false;
    // 				this.gp_goto.visible = false;
    // 				break;
    // 			case 2:
    // 				this.gp_finish.visible = true;
    // 				this.gp_take.visible = false;
    // 				this.gp_goto.visible = false;
    // 				break;
    // 		}
    // 		let rewardtxt: string = "奖励：";
    // 		for (let i = 0; i < tv.reward_list.length; i++) {
    // 			let info = App.ConfigManager.getItemInfoById(tv.reward_list[i].id);
    // 			rewardtxt += (info.name + "" + tv.reward_list[i].num);
    // 			if (i < tv.reward_list.length - 1)
    // 				rewardtxt += ",";
    // 		}
    // 		this.lb_reward.text = rewardtxt;
    // 		//this.lb_reward.text 
    // 		//this.updateInfo(this.data);
    // 	}
    // }
})(game || (game = {}));
//# sourceMappingURL=MustDoView.js.map
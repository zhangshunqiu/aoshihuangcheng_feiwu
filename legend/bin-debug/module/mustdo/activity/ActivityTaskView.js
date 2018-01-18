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
 * Author: lihe
 * Email： hersletter@qq.com
 * 活跃任务界面 2017/06/20.
 */
var game;
(function (game) {
    /**
     *  活跃度任务界面
     */
    var ActivityTaskView = (function (_super) {
        __extends(ActivityTaskView, _super);
        function ActivityTaskView(skinName) {
            var _this = _super.call(this, "ActivityTaskSkin") || this;
            _this.list_chest = [];
            _this._listtask = new eui.List();
            _this._eventid_activity = 0;
            _this._mustdomodel = game.MustDoModel.getInstance();
            return _this;
        }
        ActivityTaskView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            //this.isCreated = true;
            this.scr_task.viewport = this._listtask;
            this.scr_task.scrollPolicyH = eui.ScrollPolicy.OFF;
            this._listtask.itemRenderer = ActivityTaskItem;
            this.list_chest.push(this.activity_reward1);
            this.list_chest.push(this.activity_reward2);
            this.list_chest.push(this.activity_reward3);
            this.list_chest.push(this.activity_reward4);
        };
        /**
         * 打开窗口
         */
        ActivityTaskView.prototype.open = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.open.call(this, openParam);
            if (this._eventid_activity == 0)
                this._eventid_activity = App.EventSystem.addEventListener(PanelNotify.MUSTDO_UPDATEACTIVITY, this.updateActivity, this);
            for (var i = 0; i < this.list_chest.length; i++) {
                this.list_chest[i].addRewardEff();
            }
            App.Socket.send(18001, null);
        };
        /**
         * 清理
         */
        ActivityTaskView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
            if (this._eventid_activity != 0) {
                App.EventSystem.removeEventListener(PanelNotify.MUSTDO_UPDATEACTIVITY, this._eventid_activity);
                this._eventid_activity = 0;
            }
            for (var i = 0; i < this.list_chest.length; i++) {
                this.list_chest[i].clearRewardEff();
            }
        };
        /**
         * 销毁
         */
        ActivityTaskView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        ActivityTaskView.prototype.updateActivity = function () {
            this._listtask.dataProvider = new eui.ArrayCollection(this._mustdomodel.taskList);
            this.pgbar_activity.value = this._mustdomodel.livenessNum; //* 100 / 120.00;
            this.pgbar_activity.maximum = 120;
            for (var i = 0; i < 4; i++) {
                if (i < this._mustdomodel.chestList.length) {
                    this.list_chest[i].livenesss = this._mustdomodel.chestList[i].liveness;
                    this.list_chest[i].item_id = this._mustdomodel.chestList[i].reward_id;
                    this.list_chest[i].item_num = this._mustdomodel.chestList[i].reward_num;
                    this.list_chest[i].state = this._mustdomodel.chestList[i].state;
                    this.list_chest[i].updateReward();
                }
            }
        };
        return ActivityTaskView;
    }(BaseChildView));
    game.ActivityTaskView = ActivityTaskView;
    __reflect(ActivityTaskView.prototype, "game.ActivityTaskView");
    var ActivityRewardItem = (function (_super) {
        __extends(ActivityRewardItem, _super);
        function ActivityRewardItem() {
            var _this = _super.call(this) || this;
            _this.skinName = "ActivityRewardItem";
            _this.btn_take.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.getAcyivityReward();
            }, _this);
            _this.baseItem.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.getAcyivityReward();
            }, _this);
            if (_this._canGetMc == null) {
                _this._canGetMc = new AMovieClip();
                _this._canGetMc.x = _this.img_token.x + 115 / 2;
                _this._canGetMc.y = _this.img_token.y + 31 / 2;
                _this._canGetMc.touchEnabled = false;
                _this.addChildAt(_this._canGetMc, 1);
            }
            _this.baseItem.setItemNameVisible(false);
            _this.baseItem.setItemNumVisible(false);
            _this.baseItem.setItemBg("sign_bg_daoju_png");
            return _this;
            // this.baseItem.lb_name.visible = false;
            // this.baseItem.img_frame.visible = false;
            // this.baseItem.img_icon.touchEnabled = false;
        }
        ActivityRewardItem.prototype.getAcyivityReward = function () {
            if (this.state != 1) {
                App.GlobalTips.showItemTips(ClientType.BASE_ITEM, this.item_id, null);
                return;
            }
            if (game.MustDoModel.getInstance().livenessNum >= this.livenesss)
                App.Socket.send(18003, { liveness: this.livenesss });
        };
        ActivityRewardItem.prototype.updateReward = function () {
            var _this = this;
            this.baseItem.setItemNumVisible(true);
            this.baseItem.updateBaseItem(ClientType.BASE_ITEM, this.item_id, this.item_num);
            this.baseItem.setItemBg("sign_bg_daoju_png");
            // this.baseItem.lb_name.visible = false;
            // this.baseItem.img_frame.visible = false;
            // this.baseItem.img_frame.width = 0;
            // this.baseItem.img_icon.touchEnabled = false;
            // this.baseItem.lb_num.visible = true;
            // this.baseItem.lb_num.text = this.item_num + "";
            switch (this.state) {
                case 0:
                    this.img_token.visible = false;
                    this._canGetMc.stop();
                    this._canGetMc.visible = false;
                    break;
                case 1:
                    this.img_token.visible = false;
                    this._canGetMc.visible = true;
                    this._canGetMc.playMCKey("efficonyuan", "", -1, null, function () {
                        _this._canGetMc.frameRate = 8;
                    }, this);
                    break;
                case 2:
                    this.img_token.visible = true;
                    this._canGetMc.stop();
                    this._canGetMc.visible = false;
                    break;
            }
        };
        ActivityRewardItem.prototype.addRewardEff = function () {
            if (this._canGetMc == null) {
                this._canGetMc = new AMovieClip();
                this._canGetMc.x = this.img_token.x + 115 / 2;
                this._canGetMc.y = this.img_token.y + 31 / 2;
                this._canGetMc.touchEnabled = false;
                this.addChildAt(this._canGetMc, 1);
            }
        };
        ActivityRewardItem.prototype.clearRewardEff = function () {
            if (this._canGetMc) {
                this._canGetMc.visible = false;
                this._canGetMc.stop();
                this._canGetMc.destroy();
                this._canGetMc = null;
            }
        };
        return ActivityRewardItem;
    }(eui.ItemRenderer));
    game.ActivityRewardItem = ActivityRewardItem;
    __reflect(ActivityRewardItem.prototype, "game.ActivityRewardItem");
    var ActivityTaskItem = (function (_super) {
        __extends(ActivityTaskItem, _super);
        function ActivityTaskItem() {
            var _this = _super.call(this) || this;
            _this.skinName = "MustDoItemSkin";
            _this.gp_finish.visible = false;
            _this.gp_goto.visible = false;
            _this.gp_take.visible = false;
            _this.bt_take.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.getTaskReward();
            }, _this);
            _this.bt_goto.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.gotoTask();
            }, _this);
            return _this;
        }
        ;
        ActivityTaskItem.prototype.getTaskReward = function () {
            if (this.tv_data.type == MustDoType.ACTIVITY)
                App.Socket.send(18002, { task_id: this.tv_data.task_id });
            else if (this.tv_data.type == MustDoType.ACHIEVE)
                App.Socket.send(19002, { achieve_id: this.tv_data.task_id });
        };
        ActivityTaskItem.prototype.gotoTask = function () {
            if (this.tv_data.type == MustDoType.ACTIVITY) {
                var info = App.ConfigManager.getTaskDailyInfoById(this.tv_data.task_id);
                MainModuleJump.jumpToModule(info.skip);
            }
            else if (this.tv_data.type == MustDoType.ACHIEVE) {
                var info = App.ConfigManager.getAchieveInfoById(this.tv_data.task_id);
                MainModuleJump.jumpToModule(info.skip);
            }
        };
        ActivityTaskItem.prototype.dataChanged = function () {
            var tv = this.data;
            this.tv_data = tv;
            this.lb_taskname.text = tv.task_name;
            if (tv.need_num > tv.finish_num)
                this.lb_progress.textFlow = [{ text: tv.finish_num + "", style: { textColor: 0xf10000 } }, { text: "/" + tv.need_num, style: { textColor: 0xffffff } }];
            else
                this.lb_progress.textFlow = [{ text: tv.need_num + "" }, { text: "/" + tv.need_num, style: { textColor: 0xffffff } }]; //超过上限的显示为上限
            //this.lb_progress.text = tv.finish_num + "/" + tv.need_num;//
            if (tv.state == 2) {
                this.lb_progress.text = "";
            }
            switch (tv.state) {
                case 0:
                    this.gp_take.visible = false;
                    this.gp_finish.visible = false;
                    this.gp_goto.visible = true;
                    break;
                case 1:
                    this.gp_take.visible = true;
                    this.gp_finish.visible = false;
                    this.gp_goto.visible = false;
                    break;
                case 2:
                    this.gp_finish.visible = true;
                    this.gp_take.visible = false;
                    this.gp_goto.visible = false;
                    break;
            }
            var rewardtxt = "奖励：";
            for (var i = 0; i < tv.reward_list.length; i++) {
                var info = App.ConfigManager.getItemInfoById(tv.reward_list[i].id);
                rewardtxt += (info.name + "" + tv.reward_list[i].num);
                if (i < tv.reward_list.length - 1)
                    rewardtxt += ",";
            }
            this.lb_reward.text = rewardtxt;
            //this.lb_reward.text 
            //this.updateInfo(this.data);
        };
        return ActivityTaskItem;
    }(eui.ItemRenderer));
    game.ActivityTaskItem = ActivityTaskItem;
    __reflect(ActivityTaskItem.prototype, "game.ActivityTaskItem");
})(game || (game = {}));
//# sourceMappingURL=ActivityTaskView.js.map
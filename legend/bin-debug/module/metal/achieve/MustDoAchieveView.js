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
 * 成就界面 2017/06/20.
 */
var game;
(function (game) {
    var MustDoAchieveView = (function (_super) {
        __extends(MustDoAchieveView, _super);
        function MustDoAchieveView(skinName) {
            var _this = _super.call(this, "MustDoAchieveSkin") || this;
            _this._listachieve = new eui.List();
            _this._eventid_achieve = 0;
            _this._mustdomodel = game.MustDoModel.getInstance();
            return _this;
        }
        MustDoAchieveView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            //this.isCreated = true;
            this.scr_achieve.viewport = this._listachieve;
            this.scr_achieve.scrollPolicyH = eui.ScrollPolicy.OFF;
            this._listachieve.itemRenderer = AchieveTaskItem;
            this.bt_takeall.addEventListener(egret.TouchEvent.TOUCH_TAP, this.takeAll, this);
            if (this._btnTakeAllMc == null) {
                this._btnTakeAllMc = new AMovieClip();
                this.addChild(this._btnTakeAllMc);
                this._btnTakeAllMc.touchEnabled = false;
                this._btnTakeAllMc.x = this.bt_takeall.x + 151 / 2;
                this._btnTakeAllMc.y = this.bt_takeall.y + 53 / 2;
            }
            this._btnTakeAllMc.visible = false;
        };
        /**
         * 打开窗口
         */
        MustDoAchieveView.prototype.open = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.open.call(this, openParam);
            if (this._btnTakeAllMc == null) {
                this._btnTakeAllMc = new AMovieClip();
                this.addChild(this._btnTakeAllMc);
                this._btnTakeAllMc.touchEnabled = false;
                this._btnTakeAllMc.x = this.bt_takeall.x + 151 / 2;
                this._btnTakeAllMc.y = this.bt_takeall.y + 53 / 2;
            }
            this._btnTakeAllMc.visible = false;
            if (this._eventid_achieve == 0)
                this._eventid_achieve = App.EventSystem.addEventListener(PanelNotify.MUSTDO_UPDATESACHIEVE, this.updateAchieve, this);
            App.Socket.send(19001, null);
        };
        /**
         * 清理
         */
        MustDoAchieveView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
            if (this._eventid_achieve != 0) {
                App.EventSystem.removeEventListener(PanelNotify.MUSTDO_UPDATESACHIEVE, this._eventid_achieve);
                this._eventid_achieve = 0;
            }
            if (this._btnTakeAllMc) {
                this._btnTakeAllMc.stop();
                this._btnTakeAllMc.destroy();
                this._btnTakeAllMc = null;
            }
        };
        /**
         * 销毁
         */
        MustDoAchieveView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        MustDoAchieveView.prototype.takeAll = function () {
            App.Socket.send(19003, null);
        };
        MustDoAchieveView.prototype.updateAchieve = function () {
            this._listachieve.dataProvider = new eui.ArrayCollection(this._mustdomodel.achievelist);
            this.lb_achievepercent.text = this._mustdomodel.achievepercent + "%";
            this.lb_achievevalue.text = this._mustdomodel.achievevalue + "";
            if (this._mustdomodel.has_can_get) {
                this._btnTakeAllMc.visible = true;
                this._btnTakeAllMc.playMCKey("effanniu");
            }
            else {
                this._btnTakeAllMc.stop();
                this._btnTakeAllMc.visible = false;
            }
        };
        return MustDoAchieveView;
    }(BaseChildView));
    game.MustDoAchieveView = MustDoAchieveView;
    __reflect(MustDoAchieveView.prototype, "game.MustDoAchieveView");
    var AchieveTaskItem = (function (_super) {
        __extends(AchieveTaskItem, _super);
        function AchieveTaskItem() {
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
        AchieveTaskItem.prototype.getTaskReward = function () {
            if (this.tv_data.type == MustDoType.ACTIVITY)
                App.Socket.send(18002, { task_id: this.tv_data.task_id });
            else if (this.tv_data.type == MustDoType.ACHIEVE)
                App.Socket.send(19002, { achieve_id: this.tv_data.task_id });
        };
        AchieveTaskItem.prototype.gotoTask = function () {
            if (this.tv_data.type == MustDoType.ACTIVITY) {
                var info = App.ConfigManager.getTaskDailyInfoById(this.tv_data.task_id);
                MainModuleJump.jumpToModule(info.skip);
            }
            else if (this.tv_data.type == MustDoType.ACHIEVE) {
                var info = App.ConfigManager.getAchieveInfoById(this.tv_data.task_id);
                MainModuleJump.jumpToModule(info.skip);
            }
        };
        AchieveTaskItem.prototype.dataChanged = function () {
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
        return AchieveTaskItem;
    }(eui.ItemRenderer));
    game.AchieveTaskItem = AchieveTaskItem;
    __reflect(AchieveTaskItem.prototype, "game.AchieveTaskItem");
})(game || (game = {}));
//# sourceMappingURL=MustDoAchieveView.js.map
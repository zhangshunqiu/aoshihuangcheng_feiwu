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
 * module: 每日竞技
 * author : zrj
*/
var game;
(function (game) {
    var ActivityDailyRank = (function (_super) {
        __extends(ActivityDailyRank, _super);
        function ActivityDailyRank(skinName) {
            var _this = _super.call(this, skinName) || this;
            _this.activityModel = game.ActivityModel.getInstance();
            _this._viewHandleId = 0;
            _this._curCondition = 0;
            _this._countDown = 0;
            _this._initRank = false;
            _this._rewardid_list = [];
            _this.skinName = "ActivityDailyRankSkin";
            return _this;
        }
        ActivityDailyRank.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            this.scroller.viewport = this.list;
            this.list.itemRenderer = ActivityDailyRankItem;
            this.lb_rank.textFlow = [{ text: "查看排名", style: { underline: true } }];
            this.baseItem_reward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getReward, this);
            this.lb_rank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showRank, this);
            this.btn_rank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showRank, this);
            this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeRank, this);
            this.closeRank();
            this.baseItem1.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                if (_this._rewardid_list.length > 0)
                    App.GlobalTips.showItemTips(ClientType.BASE_ITEM, _this._rewardid_list[0], null);
            }, this);
            this.baseItem2.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                if (_this._rewardid_list.length > 1)
                    App.GlobalTips.showItemTips(ClientType.BASE_ITEM, _this._rewardid_list[1], null);
            }, this);
            this.baseItem3.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                if (_this._rewardid_list.length > 2)
                    App.GlobalTips.showItemTips(ClientType.BASE_ITEM, _this._rewardid_list[2], null);
            }, this);
            this.baseItem4.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                if (_this._rewardid_list.length > 3)
                    App.GlobalTips.showItemTips(ClientType.BASE_ITEM, _this._rewardid_list[3], null);
            }, this);
        };
        ActivityDailyRank.prototype.updateView = function () {
            var _this = this;
            var activityData = this.activityModel.dailyRankInfo;
            var info = App.ConfigManager.getDaliyRankInfoById(activityData.rank_id);
            var canGet = false;
            var maxLevel = true;
            this.baseItem_reward.touchEnabled = false;
            this.baseItem_reward.touchChildren = false;
            for (var k in activityData.stage_list) {
                var data = activityData.stage_list[k];
                if (data.state == 0) {
                    maxLevel = false;
                    this._curCondition = data.condition;
                    break;
                }
                else if (data.state == 1) {
                    canGet = true;
                    maxLevel = false;
                    this._curCondition = data.condition;
                    break;
                }
                else if (data.state == 2) {
                    this._curCondition = data.condition;
                }
            }
            //App.loglh(this._curCondition);
            //阶段奖励
            for (var k in info.stage_reward_all) {
                if (info.stage_reward_all[k][0] == this._curCondition) {
                    // let baseItem = new customui.BaseItem();
                    // baseItem.updateBaseItem(info.stage_reward_all[k][1][0],info.stage_reward_all[k][1][1]);
                    // baseItem.verticalCenter = 0;
                    // baseItem.horizontalCenter = 0;
                    // this.gp_my.addChild(baseItem);
                    this.baseItem_reward.updateBaseItem(info.stage_reward_all[k][1][0], info.stage_reward_all[k][1][1], info.stage_reward_all[k][1][2]);
                    break;
                }
            }
            if (canGet) {
                this.baseItem_reward.touchEnabled = true;
                this.baseItem_reward.touchChildren = true;
            }
            if (maxLevel) {
            }
            this.lb_desc.text = info.des;
            this.lb_my_level.text = activityData.value;
            this.lb_my_rank.textFlow = [{ text: info.desc + "总" + info.unit + "：" }, { text: activityData.value + "", style: { textColor: 0xffa200 } }];
            this.lb_nextlevel.text = String(this._curCondition);
            this.lb_stageLv.textFlow = [{ text: info.desc + "总" + info.unit, style: { textColor: 0xBFBFBF } }];
            this.lb_myLv.textFlow = [{ text: "我的" + info.desc + info.unit, style: { textColor: 0xBFBFBF } }];
            //各个排名奖励
            this.baseItem1.updateBaseItem(info.reward1[0][0], info.reward1[0][1], info.reward1[0][2]);
            this._rewardid_list.push(info.reward1[0][1]);
            if (activityData.list.length > 0) {
                this.lb_level1.text = activityData.list[0].key + "级";
                this.lb_name1.text = activityData.list[0].name;
            }
            this.baseItem2.updateBaseItem(info.reward2[0][0], info.reward2[0][1], info.reward2[0][2]);
            this._rewardid_list.push(info.reward2[0][1]);
            if (activityData.list.length > 1) {
                this.lb_level2.text = activityData.list[1].key + "级";
                this.lb_name2.text = activityData.list[1].name;
            }
            this.baseItem3.updateBaseItem(info.reward3[0][0], info.reward3[0][1], info.reward3[0][2]);
            this._rewardid_list.push(info.reward3[0][1]);
            if (activityData.list.length > 2) {
                this.lb_level3.text = activityData.list[2].key + "级";
                this.lb_name3.text = activityData.list[2].name;
            }
            this.baseItem4.updateBaseItem(info.reward4[0][0], info.reward4[0][1], info.reward4[0][2]);
            this._rewardid_list.push(info.reward4[0][1]);
            //倒计时
            if (this._countDown) {
                App.GlobalTimer.remove(this._countDown);
                this._countDown = undefined;
            }
            this.lb_time.text = game.InvestUtil.getFormatBySecond1(this.activityModel.dailyRankInfo.left_time);
            this._countDown = App.GlobalTimer.addSchedule(1000, activityData.left_time, this.updateTime, this, function () {
                App.GlobalTimer.remove(_this._countDown);
                _this._countDown = undefined;
                App.Socket.send(30002, {});
            }, this);
            //排行榜
            if (!this._initRank) {
                this.initRank();
                this._initRank = true;
            }
        };
        ActivityDailyRank.prototype.updateTime = function () {
            this.activityModel.dailyRankInfo.left_time--;
            this.lb_time.text = game.InvestUtil.getFormatBySecond1(this.activityModel.dailyRankInfo.left_time);
        };
        ActivityDailyRank.prototype.getReward = function () {
            App.Socket.send(30003, { condition: this._curCondition });
        };
        ActivityDailyRank.prototype.initRank = function () {
            var listData = this.activityModel.dailyRankInfo.list;
            this.list.dataProvider = new eui.ArrayCollection(listData);
        };
        ActivityDailyRank.prototype.showRank = function () {
            this.gp_center.visible = false;
            this.gp_rank.visible = true;
        };
        ActivityDailyRank.prototype.closeRank = function () {
            this.gp_center.visible = true;
            this.gp_rank.visible = false;
        };
        /**
         * 打开窗口
         */
        ActivityDailyRank.prototype.open = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.open.call(this, openParam);
            // if (this._viewHandleId == 0) {
            // 	this._viewHandleId = App.EventSystem.addEventListener(PanelNotify.ACTIVITY_UPDATE_VIEW,this.updateView,this);
            // }
            App.Socket.send(30002, {});
        };
        /**
         * 清理
         */
        ActivityDailyRank.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            // if (this._viewHandleId != 0) {
            // 	App.EventSystem.removeEventListener(PanelNotify.ACTIVITY_UPDATE_VIEW,this._viewHandleId);
            // 	this._viewHandleId = 0;
            // }
            if (this._countDown) {
                App.GlobalTimer.remove(this._countDown);
                this._countDown = undefined;
            }
            this._initRank = false;
        };
        /**
         * 销毁
         */
        ActivityDailyRank.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return ActivityDailyRank;
    }(BaseChildView));
    game.ActivityDailyRank = ActivityDailyRank;
    __reflect(ActivityDailyRank.prototype, "game.ActivityDailyRank");
    var ActivityDailyRankItem = (function (_super) {
        __extends(ActivityDailyRankItem, _super);
        function ActivityDailyRankItem() {
            var _this = _super.call(this) || this;
            _this.activityModel = game.ActivityModel.getInstance();
            _this.skinName = "ActivityDailyRankItemSkin";
            var layout = new eui.HorizontalLayout();
            layout.gap = 10;
            layout.horizontalAlign = egret.HorizontalAlign.LEFT;
            layout.verticalAlign = egret.VerticalAlign.MIDDLE;
            _this.gp_reward.layout = layout;
            return _this;
        }
        ActivityDailyRankItem.prototype.dataChanged = function () {
            var _this = this;
            var activityData = this.activityModel.dailyRankInfo;
            var info = App.ConfigManager.getDaliyRankInfoById(activityData.rank_id);
            this.lb_rank.text = this.data.rank;
            this.lb_level.text = "总" + info.unit + "：" + this.data.key;
            this.lb_name.text = this.data.name;
            this.gp_reward.removeChildren();
            var item = new customui.BaseItem();
            this.gp_reward.addChild(item);
            this.img_rank.visible = true;
            if (this.data.rank == 1) {
                item.updateBaseItem(info.reward1[0][0], info.reward1[0][1], info.reward1[0][2]);
                RES.getResAsync("ranking list_1_png", function (texture) {
                    _this.img_rank.source = texture;
                }, this);
            }
            else if (this.data.rank == 2) {
                item.updateBaseItem(info.reward2[0][0], info.reward2[0][1], info.reward2[0][2]);
                RES.getResAsync("ranking list_2_png", function (texture) {
                    _this.img_rank.source = texture;
                }, this);
            }
            else if (this.data.rank == 3) {
                item.updateBaseItem(info.reward3[0][0], info.reward3[0][1], info.reward3[0][2]);
                RES.getResAsync("ranking list_3_png", function (texture) {
                    _this.img_rank.source = texture;
                }, this);
            }
            else {
                item.updateBaseItem(info.reward4[0][0], info.reward4[0][1], info.reward4[0][2]);
                this.img_rank.visible = false;
            }
        };
        return ActivityDailyRankItem;
    }(eui.ItemRenderer));
    game.ActivityDailyRankItem = ActivityDailyRankItem;
    __reflect(ActivityDailyRankItem.prototype, "game.ActivityDailyRankItem");
})(game || (game = {}));
//# sourceMappingURL=ActivityDailyRank.js.map
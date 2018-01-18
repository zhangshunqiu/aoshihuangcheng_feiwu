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
 * 天梯争霸界面 2017/06/20.
 */
var game;
(function (game) {
    var EncounterView = (function (_super) {
        __extends(EncounterView, _super);
        function EncounterView(skinName) {
            var _this = _super.call(this, "EncounterSkin") || this;
            _this._encounterInfoUpdateEventId = 0;
            _this._countDownTimer = 1110;
            _this._encounterModel = game.EncounterModel.getInstance();
            return _this;
        }
        EncounterView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.img_reward.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                // App.WinManager.openWin(WinName.ENCOUNTER_REWARD);   //每日奖励入口
                // PopUpManager.addPopUp({ obj: new EncounterRewardView(), effectType: 0 })
                WinManager.getInstance().openPopWin(WinName.POP_Encounter_Reward);
            }, this);
            this.btn_rank.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.openWin(WinName.RANK, ConstRankName.KILL); //遭遇战排行榜入口
            }, this);
            this.btn_fightRecord.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.openWin(WinName.ENCOUNTER_LOGS); //战斗记录入口
            }, this);
            this.img_question.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.GlobalTips.showAlert({
                    contentStyle: 1,
                    textFlow: [
                        { text: "1.成功击杀附近的玩家后可获得", style: { textColor: 0xbfbfbf } },
                        { text: "杀戮值、经验、金币、装备", style: { textColor: 0x00f829 } },
                        { text: "等大量奖励，同时增加", style: { textColor: 0xbfbfbf } },
                        { text: "25点PK值\n", style: { textColor: 0xf10000 } },
                        { text: "2.挑战失败会有部分奖励，不增加PK值\n", style: { textColor: 0xbfbfbf } },
                        { text: "3.PK值达到", style: { textColor: 0xbfbfbf } },
                        { text: "100", style: { textColor: 0xf10000 } },
                        { text: "不可继续挑战，PK值每", style: { textColor: 0xbfbfbf } },
                        { text: "1分钟减少1点\n", style: { textColor: 0x00f829 } },
                        { text: "4.当玩家PK值达到", style: { textColor: 0xbfbfbf } },
                        { text: "100", style: { textColor: 0xf10000 } },
                        { text: "时，玩家可以花费元宝消除PK值", style: { textColor: 0xbfbfbf } },
                        { text: "立即挑战", style: { textColor: 0x00f829 } },
                        { text: "，每4元宝可以消除1点PK值\n", style: { textColor: 0xbfbfbf } },
                        { text: "6.根据杀戮值可获得", style: { textColor: 0xbfbfbf } },
                        { text: "每日排名奖励", style: { textColor: 0xffea00 } },
                        { text: "，早上", style: { textColor: 0xbfbfbf } },
                        { text: "4点", style: { textColor: 0x00f829 } },
                        { text: "以邮件的方式发放\n", style: { textColor: 0xbfbfbf } },
                    ]
                    //     {
                    //         text: `
                    //     1.成功击杀附近的玩家后可获得杀戮值、经验、金币、装备等大量奖励，同时增加25点PK值\n
                    //     2.挑战失败会有部分奖励，不增加PK值\n
                    //     3.PK值达到100不可继续挑战，PK值每1分钟减少1点\n
                    //     4.当玩家PK值达到100时，玩家可以花费元宝消除PK值立即挑战，每4元宝可以消除1点PK值\n
                    //     6.根据杀戮值可获得每日排名奖励，早上4点以邮件的方式发放\n
                    //    `, style: { textColor: 0x4dfd54 }
                    //     }
                });
            }, this);
            this.initView();
        };
        EncounterView.prototype.setBtnRedTip = function () {
            if (this._encounterModel.pkNum >= 100 || this._encounterModel.playerList.length == 0) {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.AREAN_ENCOUNTER, false);
            }
            else {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.AREAN_ENCOUNTER, true);
            }
        };
        EncounterView.prototype.initView = function () {
            this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
            this.scroller.scrollPolicyV = eui.ScrollPolicy.OFF;
            this.scroller.verticalScrollBar.autoVisibility = false;
            this.scroller.verticalScrollBar.visible = false;
        };
        EncounterView.prototype.updateView = function () {
            this.setBtnRedTip();
            this.lb_killNum.text = this._encounterModel.killNum + "";
            this.lb_rank.text = this._encounterModel.rank + "";
            this.lb_pkNum.text = this._encounterModel.pkNum + "";
            this.lb_getPkValue.text = App.ConfigManager.getConstConfigByType("ENCOUNTER_PK_ADD").value;
            if (this._encounterModel.pkNum >= 100) {
                this.gp_pkText.visible = true;
                this.lb_pkTime.text = this._encounterModel.pkNum - 99 + "";
            }
            else {
                this.gp_pkText.visible = false;
            }
            var count = 0;
            var height = 0;
            for (var i = 0; i < this._encounterModel.playerList.length; i++) {
                var playerItem = new EncounterPlayerItem(this._encounterModel.playerList[i]);
                playerItem.x = -4;
                playerItem.y = playerItem.height * count++;
                this.gp_scrollerGroup.addChild(playerItem);
                height = playerItem.height;
            }
            this.gp_refreshEnemy.y = height * count;
            this.gp_scrollerGroup.addChild(this.gp_refreshEnemy);
            if (this._encounterModel.playerList.length < 4) {
                this.countDown();
                this.gp_refreshEnemy.visible = true;
            }
            else {
                this.gp_refreshEnemy.visible = false;
            }
        };
        EncounterView.prototype.countDown = function () {
            var _this = this;
            this.stopTimer();
            if (this._countDownTimer == 0 && this._encounterModel.refreshTime) {
                this._countDownTimer = App.GlobalTimer.addSchedule(1000, 0, function () {
                    _this._encounterModel.refreshTime--;
                    _this.lb_time.text = _this._encounterModel.refreshTime + "秒";
                    if (_this._encounterModel.refreshTime <= 0) {
                        App.Socket.send(38001, {});
                        _this.gp_refreshEnemy.visible = false;
                        _this.stopTimer();
                    }
                }, this);
            }
        };
        EncounterView.prototype.stopTimer = function () {
            if (this._countDownTimer != 0) {
                App.GlobalTimer.remove(this._countDownTimer);
                this._countDownTimer = 0;
            }
        };
        /**
         * 打开窗口
         */
        EncounterView.prototype.open = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.open.call(this, openParam);
            App.Socket.send(38001, {});
            if (this._encounterInfoUpdateEventId == 0) {
                this._encounterInfoUpdateEventId = App.EventSystem.addEventListener(PanelNotify.ENCOUNTER_INFO_UPDATE, this.updateView, this);
            }
        };
        // private pkReduceSuccess():void
        // {   //pk消除成功
        //     // App.Socket.send(38002, { type: this.data.type, id: this.data.id });
        // }
        /**
         * 清理
         */
        EncounterView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
            if (this._encounterInfoUpdateEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.ENCOUNTER_INFO_UPDATE, this._encounterInfoUpdateEventId);
                this._encounterInfoUpdateEventId = 0;
            }
            if (this._countDownTimer != 0) {
                App.GlobalTimer.remove(this._countDownTimer);
                this._countDownTimer = 0;
            }
        };
        /**
         * 销毁
         */
        EncounterView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return EncounterView;
    }(BaseChildView));
    game.EncounterView = EncounterView;
    __reflect(EncounterView.prototype, "game.EncounterView");
    var EncounterPlayerItem = (function (_super) {
        __extends(EncounterPlayerItem, _super);
        function EncounterPlayerItem(data) {
            var _this = _super.call(this) || this;
            _this._encounterPkReduceEventId = 0;
            _this._startChallengeSuccessEventId = 0;
            _this._encounterModel = game.EncounterModel.getInstance();
            _this.skinName = "EncounterPlayerItem";
            _this.data = data;
            return _this;
        }
        EncounterPlayerItem.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.btn_challenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchChallenge, this);
            this.updateView();
            if (this._encounterPkReduceEventId == 0) {
                this._encounterPkReduceEventId = App.EventSystem.addEventListener(PanelNotify.ENCOUNTER_PK_REDUCE_SUCCESS, this.pkReduceSuccess, this);
            }
            if (this._startChallengeSuccessEventId == 0) {
                this._startChallengeSuccessEventId = App.EventSystem.addEventListener(PanelNotify.ENCOUNTER_START_CHALLENGE_SUCCESS, function () {
                    App.WinManager.closeWin(WinName.HEGEMONY);
                }, this);
            }
        };
        EncounterPlayerItem.prototype.pkReduceSuccess = function () {
            if (this.data.type == game.EncounterModel.getInstance().curType &&
                game.EncounterModel.getInstance().curId == this.data.id) {
                App.Socket.send(38002, { type: this.data.type, id: this.data.id });
            }
        };
        EncounterPlayerItem.prototype.onTouchChallenge = function () {
            game.EncounterModel.getInstance().curId = this.data.id;
            game.EncounterModel.getInstance().curType = this.data.type;
            if (this._encounterModel.pkNum >= 100) {
                // App.WinManager.openWin()  //打开消除pk值窗口
                /**
                 * style:样式
                 * textFlow:有这个就不会处理content
                 * content:字符串内容
                 * okCB:点击ok的cb
                 * cancelCB:点击cancel的cb
                 * context:上下文
                 * needCheckBox:是否需要CheckBox
                 * title : 提示框标题 传图片资源名
                 */
                var cur_Pk = game.EncounterModel.getInstance().pkNum;
                var pk_gap = cur_Pk - 99;
                var costGold = pk_gap * 4; //花费的元宝
                var curGold = RoleManager.getInstance().roleWealthInfo.gold;
                var okCallback = function () {
                    if (curGold >= costGold) {
                        App.Socket.send(38005, {});
                    }
                    else {
                        App.GlobalTips.showTips("元宝不够，消除失败!");
                    }
                };
                App.GlobalTips.showAlert({
                    style: 0,
                    title: "",
                    // context:"",
                    textFlow: [{ text: "\u5F53\u524DPK\u503C\u8FBE\u5230" + cur_Pk + ",\u662F\u5426\u6D88\u8017" + costGold + "\u5143\u5B9D\u51CF\u5C11" + pk_gap + "\u70B9Pk\u503C\u7ACB\u5373\u6311\u6218", style: { textColor: 0x235454 } }],
                    okCB: okCallback
                });
            }
            else {
                App.Socket.send(38002, { type: this.data.type, id: this.data.id });
            }
        };
        EncounterPlayerItem.prototype.updateView = function () {
            var reward = [];
            this.img_icon.source = App.ConfigManager.getSmallHeroIconBySexAndJob(this.data.sex, this.data.job) + "_png";
            this.lb_name.text = this.data.nick;
            this.lb_lv.text = this.data.turn + "转" + this.data.lv + "级";
            reward = App.ConfigManager.getEncounterRewardByLvAndTurn(this.data.lv, this.data.turn);
            for (var i = 0; i < reward.length; i++) {
                if (reward[i][1] == 104) {
                    this.lb_achievementNum.text = reward[i][2];
                }
                else if (reward[i][1] == 18) {
                    this.lb_riseStar.text = reward[i][2];
                }
            }
        };
        /**
      * 打开窗口
      */
        EncounterPlayerItem.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
        };
        EncounterPlayerItem.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
            if (this._encounterPkReduceEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.ENCOUNTER_PK_REDUCE_SUCCESS, this._encounterPkReduceEventId);
                this._encounterPkReduceEventId = 0;
            }
            if (this._startChallengeSuccessEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.ENCOUNTER_START_CHALLENGE_SUCCESS, this._startChallengeSuccessEventId);
                this._startChallengeSuccessEventId = 0;
            }
        };
        /**
         * 销毁
         */
        EncounterPlayerItem.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return EncounterPlayerItem;
    }(BaseView));
    __reflect(EncounterPlayerItem.prototype, "EncounterPlayerItem");
})(game || (game = {}));
//# sourceMappingURL=EncounterView.js.map
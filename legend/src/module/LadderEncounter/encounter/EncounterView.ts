/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 天梯争霸界面 2017/06/20.
 */
module game {


    export class EncounterView extends BaseChildView {
        public img_reward: eui.Image;
        public btn_rank: eui.Button;
        public btn_fightRecord: eui.Button;
        public lb_killNum: eui.Label;
        public lb_rank: eui.Label;
        public lb_pkNum: eui.Label;
        public lb_pkTime: eui.Label;
        public gp_pkText: eui.Group;
        public lb_time: eui.Label;
        public scroller: eui.Scroller;
        public list: eui.List;
        public img_question: eui.Image;
        public gp_refreshEnemy: eui.Group;
        public gp_scrollerGroup: eui.Group;
        private _encounterInfoUpdateEventId: number = 0;
        private _countDownTimer: number = 1110;

        private _encounterModel: EncounterModel = EncounterModel.getInstance();

        public constructor(skinName: string) {
            super("EncounterSkin")
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.img_reward.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                // App.WinManager.openWin(WinName.ENCOUNTER_REWARD);   //每日奖励入口
                PopUpManager.addPopUp({ obj: new EncounterRewardView(), effectType: 0 })
            }, this);
            this.btn_rank.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                App.WinManager.openWin(WinName.RANK, ConstRankName.KILL);   //遭遇战排行榜入口
            }, this);
            this.btn_fightRecord.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                App.WinManager.openWin(WinName.ENCOUNTER_LOGS);  //战斗记录入口
            }, this);
            this.img_question.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
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
                })
            }, this);

            this.initView();
        }

        private initView() {

            this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
            this.scroller.scrollPolicyV = eui.ScrollPolicy.ON;
            this.scroller.verticalScrollBar.autoVisibility = false;
            this.scroller.verticalScrollBar.visible = false;
        }

        private updateView() {
            this.lb_killNum.text = this._encounterModel.killNum + "";
            this.lb_rank.text = this._encounterModel.rank + "";
            this.lb_pkNum.text = this._encounterModel.pkNum + "";
            if (this._encounterModel.pkNum >= 100) {
                this.gp_pkText.visible = true;
                this.lb_pkTime.text = this._encounterModel.pkNum - 99 + "";
            } else {
                this.gp_pkText.visible = false;
            }
            let count = 0
            let height = 0;
            for (let i: number = 0; i < this._encounterModel.playerList.length; i++) {
                let playerItem = new EncounterPlayerItem(this._encounterModel.playerList[i]);
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
            } else {
                this.gp_refreshEnemy.visible = false;
            }
        }

        private countDown() {
            this.stopTimer();
            if (this._countDownTimer == 0 && this._encounterModel.refreshTime) {
                this._countDownTimer = App.GlobalTimer.addSchedule(1000, 0, () => {
                    this._encounterModel.refreshTime--;
                    this.lb_time.text = this._encounterModel.refreshTime + "秒";
                    if (this._encounterModel.refreshTime <= 0) {
                        App.Socket.send(38001, {});
                        this.gp_refreshEnemy.visible = false;
                        this.stopTimer();
                    }
                }, this);
            }
        }

        private stopTimer() {
            if (this._countDownTimer != 0) {
                App.GlobalTimer.remove(this._countDownTimer);
                this._countDownTimer = 0;
            }
        }

        /**
         * 打开窗口
         */
        public open(openParam: any = null): void {
            super.open(openParam);
            App.Socket.send(38001, {});
            if (this._encounterInfoUpdateEventId == 0) {
                this._encounterInfoUpdateEventId = App.EventSystem.addEventListener(PanelNotify.ENCOUNTER_INFO_UPDATE, this.updateView, this);
            }

        }
        // private pkReduceSuccess():void
        // {   //pk消除成功
        //     // App.Socket.send(38002, { type: this.data.type, id: this.data.id });
        // }

        /**
         * 清理
         */
        public clear(data: any = null): void {
            super.clear();
            if (this._encounterInfoUpdateEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.ENCOUNTER_INFO_UPDATE, this._encounterInfoUpdateEventId);
                this._encounterInfoUpdateEventId = 0;
            }
            if (this._countDownTimer != 0) {
                App.GlobalTimer.remove(this._countDownTimer);
                this._countDownTimer = 0;
            }
        }
        /**
         * 销毁
         */
        public destroy(): void {
            super.destroy();

        }
    }

    class EncounterPlayerItem extends BaseView {
        public img_icon: eui.Image;
        public lb_name: eui.Label;
        public lb_lv: eui.Label;
        public lb_achievementNum: eui.Label;
        public lb_riseStar: eui.Label;
        public btn_challenge: eui.Button;
        public data: any;
        private _encounterPkReduceEventId: number = 0;

        public _encounterModel: EncounterModel = EncounterModel.getInstance();
        public constructor(data) {
            super();
            this.skinName = "EncounterPlayerItem";
            this.data = data;
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.btn_challenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchChallenge, this);
            this.updateView();
            if (this._encounterPkReduceEventId == 0) {
                this._encounterPkReduceEventId = App.EventSystem.addEventListener(PanelNotify.ENCOUNTER_PK_REDUCE_SUCCESS, this.pkReduceSuccess, this);
            }
        }
        private pkReduceSuccess(): void {
            if (this.data.type == (EncounterModel.getInstance() as EncounterModel).curType &&
                (EncounterModel.getInstance() as EncounterModel).curId == this.data.id) {
                App.Socket.send(38002, { type: this.data.type, id: this.data.id });
                App.WinManager.closeWin(WinName.HEGEMONY);
            }
        }

        private onTouchChallenge() {
            (EncounterModel.getInstance() as EncounterModel).curId = this.data.id;
            (EncounterModel.getInstance() as EncounterModel).curType = this.data.type;

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
                var cur_Pk: number = (EncounterModel.getInstance() as EncounterModel).pkNum;
                var pk_gap: number = cur_Pk - 99;
                var costGold: number = pk_gap * 4;//花费的元宝
                var curGold: number = RoleManager.getInstance().roleWealthInfo.gold;
                var okCallback: Function = function () {
                    if (curGold >= costGold) {
                        App.Socket.send(38005, {});
                    } else {
                        App.GlobalTips.showTips("元宝不够，消除失败!");
                    }
                };
                App.GlobalTips.showAlert({
                    style: 0,
                    title: "",
                    // context:"",
                    textFlow: [{ text: `当前PK值达到${cur_Pk},是否消耗${costGold}减少${pk_gap}点Pk值立即挑战`, style: { textColor: 0x235454 } }],
                    okCB: okCallback
                });

            } else {
                App.Socket.send(38002, { type: this.data.type, id: this.data.id });
                App.WinManager.closeWin(WinName.HEGEMONY);
            }
        }

        private updateView() {
            let reward = [];
            // if (this.data.type == 1) {
            //     // this.img_icon.source = App.ConfigManager.getHeroIconBySexAndJob(this.data.sex, this.data.job) + "_png";
                
            // } else {
            //     let info = App.ConfigManager.getRobotInfoById(this.data.id);
            //     this.lb_name.text = App.ConfigManager.getRandomNameBySex(info.sex);
            //     this.lb_lv.text = info.transmigration + "转" + info.level + "级";
            //     // this.img_icon.source = App.ConfigManager.getHeroIconBySexAndJob(info.sex, info.career) + "_png";
            //     reward = App.ConfigManager.getEncounterRewardByLvAndTurn(info.level, info.transmigration);
            // }
            this.lb_name.text = this.data.nick;
            this.lb_lv.text = this.data.turn + "转" + this.data.lv + "级";
            reward = App.ConfigManager.getEncounterRewardByLvAndTurn(this.data.lv, this.data.turn);
            for (let i: number = 0; i < reward.length; i++) {
                if (reward[i][1] == 104) {
                    this.lb_achievementNum.text = reward[i][2];
                } else if (reward[i][1] == 18) {
                    this.lb_riseStar.text = reward[i][2];
                }
            }
        }

        /**
      * 打开窗口
      */
        public openWin(openParam: any = null): void {
            super.openWin(openParam);

        }
        // private pkReduceSuccess():void
        // {   //pk消除成功
        //     // App.Socket.send(38002, { type: this.data.type, id: this.data.id });
        // }

        /**
         * 清理
         */
        public clear(data: any = null): void {
            super.clear();
            if (this._encounterPkReduceEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.ENCOUNTER_PK_REDUCE_SUCCESS, this._encounterPkReduceEventId);
                this._encounterPkReduceEventId = 0;
            }
        }
        /**
         * 销毁
         */
        public destroy(): void {
            super.destroy();

        }

    }


}
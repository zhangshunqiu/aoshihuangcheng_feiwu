/**
 * Author: liuyonggen
 * 月卡系统数据模型 2017/11/24
 */
module game {
    export class MonthCardView extends BaseView {
        public lb_hour: eui.Label;
        public lb_day: eui.Label;
        public img_close: eui.Image;
        public img_help: eui.Image;
        public img_back: eui.Image;
        public gp_wing: eui.Group;
        public btlb_dailyGold: eui.BitmapLabel;
        public btlb_allGold: eui.BitmapLabel;
        public btlb_hookExp: eui.BitmapLabel;
        public btlb_hookCoin: eui.BitmapLabel;
        public btlb_bag: eui.BitmapLabel;
        public btlb_achievement: eui.BitmapLabel;
        public gp_leftTime: eui.Group;
        public img_buy: eui.Image;
        private _timeUpdateEventId: number = 0;
        private _timer: number = 0;
        private _monthCardMc: AMovieClip;

        private _monthCardModel: MonthCardModel = MonthCardModel.getInstance();

        public constructor(viewConf:WinManagerVO = null) {
            super(viewConf);
        }

        public childrenCreated() {
            super.childrenCreated();
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_help.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                App.WinManager.openWin(WinName.MONTHCARD_INFO_TIP);
            }, this)
            this.monthCardFloat();
            this.initView();
        }

        private initView() {
            if(this._monthCardModel.rewardNum) {
                App.WinManager.openWin(WinName.MONTHCARD_DAILY_REWARD);
            }
            let monthCardInfo = this._monthCardModel.monthCardInfo;
            this.btlb_dailyGold.text = monthCardInfo.gold
            this.btlb_allGold.text = monthCardInfo.gold * 30 + "";
            this.btlb_hookExp.text = "+" + Math.floor(monthCardInfo.exp / 100) + "%";
            this.btlb_hookCoin.text = "+" + Math.floor(monthCardInfo.coin / 100) + "%";
            this.btlb_bag.text = "+" + monthCardInfo.bag;
            this.btlb_achievement.text = "+" + Math.floor(monthCardInfo.achievement / 100) + "%";
            this.joinMonthCardEffect();
        }
  
        private updateView() {
            if(this._monthCardModel.leftTime) {
                this.gp_leftTime.visible = true;
                this.lb_day.text = this._monthCardModel.leftTimeDay + '';
                this.lb_hour.text = this._monthCardModel.leftTimeHour + ""; 
            } else {
                this.gp_leftTime.visible = false;
            }
            if(this._monthCardModel.rewardNum > 0) {
                App.WinManager.openWin(WinName.MONTHCARD_DAILY_REWARD);
                App.BtnTipManager.setTypeValue(ConstBtnTipType.MOUTHCARD, true);
            }
        }

        private joinMonthCardEffect() {
            if(!this._monthCardMc) {
                this._monthCardMc = new AMovieClip();
            }
            this._monthCardMc.x = 340;
            this._monthCardMc.y = 350;
            this.gp_wing.addChild(this._monthCardMc);
            this._monthCardMc.playMCKey("effyueka");
        }

        private monthCardFloat() {
            egret.Tween.get(this.gp_wing).to({y:-10}, 1000, egret.Ease.sineInOut).to({y:10}, 1000, egret.Ease.sineInOut);
        }
   
        public openWin(openParam: any = null): void {
            super.openWin(openParam);
            App.Socket.send(25001, {});
            if(this._timeUpdateEventId === 0) {
                this._timeUpdateEventId = App.EventSystem.addEventListener(PanelNotify.MONTHCARD_INFO_UPDATE, this.updateView, this); 
            }
            if(this._timer === 0) {
                this._timer = App.GlobalTimer.addSchedule(2000, 0, this.monthCardFloat, this);
            }
        }

        public closeWin(): void {
		    super.closeWin();
	    }

        /**
         * 清理
         */
        public clear(data: any = null): void {
            super.clear(data);
            if(this._timeUpdateEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.MONTHCARD_INFO_UPDATE, this._timeUpdateEventId);
                this._timeUpdateEventId = 0;
            }
            if(this._timer != 0) {
                App.GlobalTimer.remove(this._timer);
                this._timer = 0;
            }
        }
        /**
         * 销毁
         */
        public destroy(): void {
            super.destroy();
            if (this._monthCardMc) {
                this._monthCardMc.destroy();
                this._monthCardMc = null;
            }
        }
    }
}

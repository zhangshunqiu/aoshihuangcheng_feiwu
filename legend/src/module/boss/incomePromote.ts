module game{
    export class incomePromote extends BaseView{
        public lb_lastExp: eui.Label;
		public lb_exp: eui.Label;
		public lb_lastCoin: eui.Label;
		public lb_coin: eui.Label;
		public lb_hour: eui.Label;
		public lb_minute: eui.Label;

		private _timerId: number = 0;
		private _bossModel: BossModel = BossModel.getInstance();

        public constructor(viewConf:WinManagerVO = null) {
            super(viewConf);
        }

		 protected childrenCreated() {
            super.childrenCreated();
			this.lb_lastExp.text = this._bossModel.lastIncomePromote.online_exp * 60 + '';
			this.lb_exp.text = this._bossModel.incomePromote.online_exp * 60 + '';
			this.lb_lastCoin.text = this._bossModel.lastIncomePromote.online_gold * 60 + '';
			this.lb_coin.text = this._bossModel.incomePromote.online_gold * 60 + '';
			this.lb_hour.text = Math.floor(this._bossModel.upLevelTime / 60) + "";
			this.lb_minute.text = this._bossModel.upLevelTime % 60 + '';
		 }

		 private closeIncomePromote() {
			 App.WinManager.closeWin(WinName.INCOME_PROMOTE);
		 }

        /**
		 * 打开窗口
		 */
		public openWin(openParam:any = null):void{
			super.openWin(openParam);
			if(this._timerId == 0) {
				this._timerId = App.GlobalTimer.addSchedule(4000, 1, this.closeIncomePromote, this, ()=>{}, this);
			}
		}

		/**
		 * 关闭窗口
		 */
		public closeWin(callback): void {
			super.closeWin(callback);
		}

		/**
		 * 清理
		 */
		public clear(data:any = null):void{
			super.clear();
			if(this._timerId != 0) {
				App.GlobalTimer.remove(this._timerId);
				this._timerId = 0;
			}
		}
		/**
		 * 销毁
		 */
		public destroy():void{
			super.destroy();
		}
    }
}
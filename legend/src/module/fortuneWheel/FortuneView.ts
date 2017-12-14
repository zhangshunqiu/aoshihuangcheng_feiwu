/**
 * Author: yangyipeng                                   
 * 幸运转盘模块视图窗口 2017/06/20.
 */
module game {
	export class FortuneView extends BaseView{
		public img_close:eui.Image;
		public img_return:eui.Image;
		public lb_leftTime:eui.Label;
		public lb_name:eui.Label;
		public progress:eui.ProgressBar;
		public lb_progress:eui.Label;
		public img_pointer:eui.Image;
		public img_fortuneBtn:eui.Group;
		public bitmap_cost:eui.BitmapLabel;
		public lb_desc:eui.Label;


		private _eventId1:number = 0;
		private _eventId2:number = 0;
		private _eventId3:number = 0;
		private _eventId4:number = 0;
		private _intervalId:number = 0;
		// private _setTimeOutId:number = 0;
		private _tween:egret.Tween;
		private _isRotating:boolean;
		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
		}

		/**
		 * 创建皮肤（初始化调用一次）
		 */
		public childrenCreated() {
			super.childrenCreated();
			this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeWin,this);
			this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeWin,this);
			this.img_fortuneBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.handlerFortuneStart,this);
			App.Socket.send(35002,{});//转盘池请求 只需要发一次
		}

		/**
		 * 打开窗口(每次打开App.WinManager.openWin(WinName.BACKPACK);都会调用)
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			
			var setTimeOutId = setTimeout(function() {
				App.Socket.send(35001,{});//转盘界面数据请求,延迟发送,不然和35002粘包
				clearTimeout(setTimeOutId);
			}, 100);
			
			if(this._eventId1 == 0)
			{
				this._eventId1 = App.EventSystem.addEventListener(PanelNotify.FORTUNE_VIEW_INFO_UPDATE,this.handlerUpdateView,this);
			}
			if(this._eventId2 == 0)
			{
				this._eventId2 = App.EventSystem.addEventListener(PanelNotify.FORTUNE_POOL_INFO_UPDATE,this.handlerUpdatePool,this);
			}
			if(this._eventId3 == 0)
			{
				this._eventId3 = App.EventSystem.addEventListener(PanelNotify.FORTUNE_WHEEL_START,this.handlerWheelStart,this);
			}
			if(this._eventId4 == 0)
			{
				this._eventId4 = App.EventSystem.addEventListener(PanelNotify.FORTUNE_WHEEL_STOP,this.handlerWheelStop,this);
			}
		}

		/**
		 * 点击转盘按钮
		 */
		private handlerFortuneStart():void
		{	
			if(this._isRotating)
			{
				return;
			}
			var vip:number = RoleManager.getInstance().roleInfo.vipLv;
			var gold:number = RoleManager.getInstance().roleWealthInfo.gold;
			var curTimes:number = (FortuneModel.getInstance() as FortuneModel).useTimes;
			if(curTimes == null){
				return;
			}
			var nextConfigData = ConfigManager.getInstance().getFortuneTimesInfoById(curTimes + 1);
			if(nextConfigData)
			{
				//配置表有下一次
				if(vip >= nextConfigData.vip && gold >= nextConfigData.gold)
				{
					App.Socket.send(35003,{});//转盘开始转
				}else{
					//飘字
					App.GlobalTips.showTips("vip等级不够或元宝不足");
				}
			}else{
				//飘字 
				App.GlobalTips.showTips("达到最多转动次数");
			}
		}
		

		/**
		 * 转盘开始转
		 */
		private handlerWheelStart(result):void
		{	
			this._isRotating = true;
			var finalAngle = ConstFortuneWheel[result];
			var randomAngle = (RandomUtils.getInstance() as RandomUtils).limit(10,12);
			finalAngle = finalAngle +  Math.round(randomAngle) * 360;
			if(this._tween == null)
			{
				this._tween = egret.Tween.get(this.img_pointer).to({ rotation: finalAngle}, 5000,egret.Ease.quadInOut).wait(200).call(this.rotateComplete, this);
			}
		}
		// private _isWinClose:boolean = false;
		private rotateComplete():void
		{	
			this._isRotating = false;
			App.Socket.send(35004,{});//转盘结束
			var timeOutId = setTimeout(function() {
				App.Socket.send(35001,{});//转盘界面数据重新请求
				clearTimeout(timeOutId);
			}, 100);
			
			if(this._tween)
			{
				egret.Tween.removeTweens(this.img_pointer);
				this._tween = null;
			}
		}

		private handlerWheelStop(result_gold):void
		{
			var resultView:FortuneResultView = new FortuneResultView(result_gold);
			PopUpManager.addPopUp({obj:resultView});
		}
		/**
		 * 视图数据更新
		 */
		private handlerUpdateView():void
		{
			var callBack = ()=>{
				var fortuneView:FortuneView = WinManager.getInstance().getWin(WinName.FORTUNE) as FortuneView;
				// var leftTime =  (FortuneModel.getInstance() as FortuneModel).leftTime - GlobalModel.getInstance().getTimer();
				var left_time =  (FortuneModel.getInstance() as FortuneModel).leftTime;
				left_time--;
				(FortuneModel.getInstance() as FortuneModel).leftTime = left_time;
				if(left_time<=0)
				{
					left_time = 0;
				}
				fortuneView.lb_leftTime.text = InvestUtil.getFormatBySecond1(left_time);
				fortuneView.lb_leftTime.textFlow = [
					{text:"剩余时间: ",style:{textColor:0xf87500}},
					{text:InvestUtil.getFormatBySecond1(left_time),style:{textColor:0x07E426}}
				];
			}
			if(this._intervalId != 0)
			{
				App.GlobalTimer.remove(this._intervalId);
			}
			this._intervalId =  App.GlobalTimer.addSchedule(1000, 0,callBack,this);

			var times:number = (FortuneModel.getInstance() as FortuneModel).useTimes;//已使用次数
			var timesConfigData = ConfigManager.getInstance().getFortuneTimesInfoById(times+1);
			if(timesConfigData)
			{
				var costGold:number = timesConfigData.gold;//下一次次数消耗元宝
				this.bitmap_cost.text = costGold + "";
			}else
			{
				// this.lb_cost.text = "达到转盘使用最多次数";
			}
		}

		/**
		 * 转盘池更新
		 */
		private handlerUpdatePool():void
		{	
			var name = (FortuneModel.getInstance() as FortuneModel).name;
			if(name == "")
			{
				this.lb_name.textFlow =[
					{text:"幸运玩家: "},{text:"未诞生",style:{textColor:0xFF1F1F}}
				]
			}else{
				this.lb_name.textFlow =[
					{text:"幸运玩家: "},{text:name,style:{textColor:0xFF1F1F}}
				]
			}
			var gold = (FortuneModel.getInstance() as FortuneModel).gold;
			var max_gold = (FortuneModel.getInstance() as FortuneModel).maxGold;
			if(max_gold)//max_gold为0时活动没开启
			{
				this.lb_progress.text = gold + "/" + max_gold;
				var progressValue = 100 * (gold/max_gold);
				this.progress.value = progressValue;

				var rewardGold:number = ConfigManager.getInstance().getFortuneRewardByMaxgold(max_gold)["gold"];
				this.lb_desc.textFlow = [
					{text:"当奖池总金额达到上限时，将在本轮转盘的参与者中抽取一位给与",style:{textColor:0xf87500}},
					{text:rewardGold + "",style:{textColor:0xffea01}},
					{text:"元宝奖励",style:{textColor:0xf87500}},
				];
			}
		}

		public closeWin():void
		{
			// this._isWinClose = true;
			WinManager.getInstance().closeWin(this.winVo.winName);
		}

		/**
		 * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
		 */
		public clear(data: any = null): void {
			super.clear(data);
			if(this._isRotating)
			{
				this.rotateComplete();
				this._isRotating = false;
			}
			if(this._eventId1 != 0)
			{
				App.EventSystem.removeEventListener(PanelNotify.FORTUNE_VIEW_INFO_UPDATE,this._eventId1);
				this._eventId1 = 0;
			}
			if(this._eventId2)
			{
				App.EventSystem.removeEventListener(PanelNotify.FORTUNE_POOL_INFO_UPDATE,this._eventId2);
				this._eventId2 = 0;
			}
			if(this._eventId3 !=0)
			{
				App.EventSystem.removeEventListener(PanelNotify.FORTUNE_WHEEL_START,this._eventId3);
				this._eventId3 = 0;
			}
			if(this._eventId4 != 0)
			{
				App.EventSystem.removeEventListener(PanelNotify.FORTUNE_WHEEL_STOP,this._eventId4);
				this._eventId4 = 0;
			}
			if(this._intervalId != 0)
			{
				App.GlobalTimer.remove(this._intervalId);
				this._intervalId = 0;
			}
			if(this._tween)
			{	//tween还存在的话证明还在转
				this.rotateComplete();
				egret.Tween.removeTweens(this.img_pointer);
				this._tween =null;
			}
			// this._isWinClose = null;
			
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
		}
	}
}
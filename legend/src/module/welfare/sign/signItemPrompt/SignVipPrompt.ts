module game {
	export class SignVipPrompt extends BaseView{
		private _signDataConfig:Object;//表中数据
		private _protocalId:number;//补签协议号，签到协议号
		private _numberArr:Array<string> = [null,null,"双","三","四","五"];

		public img_close:eui.Image;
		public lb_text:eui.Label;
		public img_refuse:eui.Image;
		public img_accept:eui.Image;

		public constructor(vo) {
			super(vo);
		}

		protected childrenCreated():void {
			this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeHandler,this);
			this.img_refuse.addEventListener(egret.TouchEvent.TOUCH_TAP,this.refuseHandler,this);
			this.img_accept.addEventListener(egret.TouchEvent.TOUCH_TAP,this.acceptHandler,this);
		}
	
		public openWin(openParam: any = null): void {
			super.openWin();
			this._signDataConfig = this.openData[0];
			this._protocalId = this.openData[1];
			this.showLabelText();
		}
		
		private showLabelText():void
		{
			// this.lb_text.text = "vip" + this._signData["vip"] + "可获取" + this._signData["multiple"] + "倍奖励";
			this.lb_text.textFlow = [{text:"vip" + this._signDataConfig["vip"],style:{textColor: 0xeb0601}},  
			{text:"可" ,style:{textColor: 0xf87500}},
			{text:this._numberArr[this._signDataConfig["multiple"]] + "倍" ,style:{textColor: 0x00f829}},
			{text:"领取签到奖励" ,style:{textColor: 0xf87500}}];
			
		}

		private closeHandler():void
		{
			// PopUpManager.removePopUp(this);
			WinManager.getInstance().closePopWin(WinName.POP_SIGN_VIP);
		}

		private refuseHandler():void
		{
			App.Socket.send(this._protocalId,{});
			// PopUpManager.removePopUp(this);
			WinManager.getInstance().closePopWin(WinName.POP_SIGN_VIP);
		}
		private acceptHandler():void
		{
			//弹vip充值框
			WinManager.getInstance().openWin(WinName.VIP);
			WinManager.getInstance().closeWin(WinName.POP_SIGN_VIP);
		}

		public clear():void
		{	
			super.clear();
		}

		public destroy():void
		{
			super.destroy();
		}
	}
}
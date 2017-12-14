module game {
	export class SignVipPrompt extends eui.Component{
		private _signData:Object;
		private _protocolId:number;
		private _numberArr:Array<string> = [null,null,"双","三","四","五"];

		private img_refuse:eui.Image;
		private img_accept:eui.Image;
		private img_close:eui.Image;
		private lb_text:eui.Label;

		public constructor(data:Object,protocolId:number) {
			super();
			this._signData = data;
			this._protocolId = protocolId;
			this.skinName = SignVipPromptSkin;
			this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeHandler,this);
			this.img_refuse.addEventListener(egret.TouchEvent.TOUCH_TAP,this.refuseHandler,this);
			this.img_accept.addEventListener(egret.TouchEvent.TOUCH_TAP,this.acceptHandler,this);
			this.addEventListener(eui.UIEvent.CREATION_COMPLETE,this.uiComplete,this);
		}

		private uiComplete():void
		{
			// this.lb_text.text = "vip" + this._signData["vip"] + "可获取" + this._signData["multiple"] + "倍奖励";
			this.lb_text.textFlow = [{text:"vip" + this._signData["vip"],style:{textColor: 0xeb0601}},  
			{text:"可" ,style:{textColor: 0xf87500}},
			{text:this._numberArr[this._signData["multiple"]] + "倍" ,style:{textColor: 0x00f829}},
			{text:"领取签到奖励" ,style:{textColor: 0xf87500}}];
			
		}

		private closeHandler():void
		{
			PopUpManager.removePopUp(this);
		}

		private refuseHandler():void
		{
			App.Socket.send(this._protocolId,{});
			PopUpManager.removePopUp(this);
		}

		private acceptHandler():void
		{
			//弹vip充值框

		}
	}
}
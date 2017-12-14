module game {
	export class ResignPrompt extends eui.Component{

		private _signData:Object;

		private lb_cancel:eui.Label;
		private lb_confirm:eui.Label;
		private img_close:eui.Image;
		private lb_text:eui.Label;

		public constructor(data) 
		{	
			super();
			this._signData = data;
			this.skinName = ResignPromptSkin;
			this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeHandler,this);
			this.lb_cancel.addEventListener(egret.TouchEvent.TOUCH_TAP,this.cancelHandler,this);
			this.lb_confirm.addEventListener(egret.TouchEvent.TOUCH_TAP,this.confirmHandler,this);
			this.addEventListener(eui.UIEvent.CREATION_COMPLETE,this.showViewUi,this);

		}

		private showViewUi():void
		{	
			var costMoney:Object = ConfigManager.getInstance().getConstConfigByType("SIGN_MONEY");
			this.lb_text.text = "是否花费" + costMoney["value"] + "元宝补签";
		}

		private closeHandler():void
		{
			PopUpManager.removePopUp(this);
		}

		private cancelHandler():void
		{
			PopUpManager.removePopUp(this);
		}

		private confirmHandler():void
		{
			if(App.RoleManager.roleInfo.vipLv < this._signData["vip"])
			{	
				//弹vip充值框
				var view = new SignVipPrompt(this._signData,23003);
				PopUpManager.addPopUp({obj:view});
				PopUpManager.removePopUp(this);
			}else{
				App.Socket.send(23003,{});
				PopUpManager.removePopUp(this);
			}
		}

		

	}
}
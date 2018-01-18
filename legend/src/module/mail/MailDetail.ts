/**
* Author: yangyipeng
* Email： hersletter@qq.com
* 邮件MailDetail UI视图层 2017/06/20.
*/
module game {
	export class MailDetail extends BaseView{

		private img_close:eui.Image;
		private img_return:eui.Image;
		private lb_content:eui.Label;
		private btn_reward:eui.Button;
		private img_reward1:eui.Image;
		private img_reward2:eui.Image;
		private list_items:eui.List;
		private gp_attachBtn:eui.Group;
		private lb_attachBtn:eui.Label;

		private _mailData:MailVO;
		private _eventId1:number = 0;
		public constructor(viewConf: WinManagerVO = null) 
		{
			super(viewConf);
			// this._mailData = this.openData;
			// this._mailData = data;
			// this.skinName = MailDetailSkin;
		}
		protected childrenCreated() 
		{
            super.childrenCreated();
			this.list_items.itemRenderer = MailBaseItem;
			this.list_items.itemRendererSkinName = MailBaseItemSkin;
			this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP,this.handlerCloseBtn,this);
			this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP,this.handlerCloseBtn,this);
			this.btn_reward.addEventListener(egret.TouchEvent.TOUCH_TAP,this.handlerReward,this);
        }

		public openWin(openParam: any = null): void {
			super.openWin();
			if(this._eventId1 == 0) {
				this._eventId1 = App.EventSystem.addEventListener(PanelNotify.MAIL_ATTACHMENT_SUCCESS,this.rewardSuccess,this);
			}
			this._mailData = this.openData;
			this.showViewUi();
			this.readMail();
		}

		private rewardSuccess():void {
			this.img_reward1.visible = false;
			this.img_reward2.visible = true;
			this.btn_reward.touchEnabled = false;
		}

		private showViewUi():void
		{	
			//邮件内容
			this.lb_content.textFlow =(new egret.HtmlTextParser).parser(this._mailData.content);
		
			//邮件附件显示
			if(this._mailData.reward.length > 0)
			{	
				this.list_items.dataProvider = this._mailData.reward;
			}
			//已领取后按钮样式
			if(this._mailData.isRead){
				this.img_reward1.visible = false;
				this.img_reward2.visible = true;
				this.btn_reward.touchEnabled = false;
			}
			//没有附件时按钮样式
			if(this._mailData.reward.length<=0)
			{	
				this.gp_attachBtn.visible = false;
				this.lb_attachBtn.visible = true;
			}else{
				this.gp_attachBtn.visible = true;
				this.lb_attachBtn.visible = false;
			}
		}


		/**
		 * 读取邮件,发送读取协议
		 */
		private readMail():void
		{
			if(!this._mailData.isRead && this._mailData.reward.length<=0){
				// (MailModel.getInstance() as MailModel).readMail(this._mailData.id);
				App.Socket.send(21002,{id:this._mailData.id});
			}else{
				return
			}
		}

		/**
		 * 领取附件内容
		 */
		private handlerReward():void
		{
			if(this._mailData.isRead){
				return
			}else{
				// (MailModel.getInstance() as MailModel).readMail(this._mailData.id);
				App.Socket.send(21003,{id:this._mailData.id})
			}
		}


		/**
		 * 界面返回
		 */
		private handlerCloseBtn():void
		{
			// PopUpManager.removePopUp(this,0);
			WinManager.getInstance().closePopWin(WinName.POP_MAILDETAIL);
		}


	

		public clear():void
		{	
			super.clear();
			this.img_close.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.handlerCloseBtn,this);
			this.img_return.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.handlerCloseBtn,this);
			if(this._eventId1 != 0) {
				App.EventSystem.removeEventListener(PanelNotify.MAIL_ATTACHMENT_SUCCESS,this._eventId1);
				this._eventId1 = 0;
			}
		}

		public destroy():void
		{
			super.destroy();
		}
		
	}
}
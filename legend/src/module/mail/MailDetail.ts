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

		public constructor(data,viewConf: WinManagerVO = null) 
		{
			super(viewConf);
			this._mailData = data;
			this.skinName = MailDetailSkin;
		}
		protected childrenCreated() 
		{
            super.childrenCreated();
			this.list_items.itemRenderer = MailBaseItem;
			this.list_items.itemRendererSkinName = MailBaseItemSkin;
			this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP,this.handlerCloseBtn,this);
			this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP,this.handlerCloseBtn,this);
			this.btn_reward.addEventListener(egret.TouchEvent.TOUCH_TAP,this.handlerReward,this);
			this.showViewUi();
			this.readMail();
			// this.lb_content.addEventListener( egret.TextEvent.LINK, function( evt:egret.TextEvent ){
			// 	let fun = eval(evt.text);
			// 	fun();
			// }, this );
			
        }

		public openWin(openParam: any = null): void {
			super.openWin();
		}

		private showViewUi():void
		{	
			//邮件内容
			this.lb_content.textFlow =(new egret.HtmlTextParser).parser(this._mailData.content);
			// this.lb_content.textFlow = [
			// 	{text:"sdfdsf",style:{"href" : "event:()=>{console.log('1111111111111111111');}"}},
			// 	{text:"sdfdsf",style:{"href" : "event:text event triggered"}}
			// ]
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
				(MailModel.getInstance() as MailModel).readMail(this._mailData.id);
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
				this.img_reward1.visible = false;
				this.img_reward2.visible = true;
				this.btn_reward.touchEnabled = false;
			}
		}


		/**
		 * 界面返回
		 */
		private handlerCloseBtn():void
		{
			PopUpManager.removePopUp(this,0);
		}


	

		public clear():void
		{	
			this.img_close.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.handlerCloseBtn,this);
			this.img_return.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.handlerCloseBtn,this);
			super.clear();
		}

		public destroy():void
		{
			super.destroy();
		}
		
	}
}
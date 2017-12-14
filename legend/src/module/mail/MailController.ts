/**
* Author: yangyipeng
* Email： hersletter@qq.com
* 邮件控制层 2017/06/20.
*/
module game {
	export class MailController extends BaseController{
		public constructor() {
			super();
			this.initProtocol();
		    this.initEventListener();
		}

		/**
		 * 初始化事件监听                                           
		 */
		protected initEventListener() {
			super.initEventListener();

		}

		/**
		 * 初始化协议
		 */
		protected initProtocol() {
			super.initProtocol();
			//协议监听示范 ,唯一，只能再一个地方监听
			this.registerProtocal(21001, this.getMailsList, this);
			this.registerProtocal(21003, this.mailRewardStatus, this);
			this.registerProtocal(21004, this.mailsReceiveStatus, this);
			this.registerProtocal(21005, this.getMail, this);
			this.registerProtocal(21006, this.getMailsList, this);
			

			//协议发送示范
			//this.sendProtocal(1000,{})
		}
		/**
		 * 收到邮件列表     
		 */
		private getMailsList(mailsData):void
		{	
			// console.log(mailsData[0][])
			(MailModel.getInstance() as MailModel).receiveMails(mailsData);
			App.EventSystem.dispatchEvent(PanelNotify.MAIL_INFO_UPDATE);
			this.updateMailTips();
		}

		/**
		 * 收到单条邮件
		 */
		private getMail(data):void
		{	
			 (MailModel.getInstance() as MailModel).receiveSingleMail(data);
			 App.EventSystem.dispatchEvent(PanelNotify.MAIL_INFO_UPDATE);
			 this.updateMailTips();
		}
		
		/**
		 * 领取邮件返回 // 成功返回 失败返回错误提示 邮件id
		 */
		private mailRewardStatus(data):void
		{
			if(data.res)
			{
				(MailModel.getInstance() as MailModel).mailAttachSingle(data.id);
				App.EventSystem.dispatchEvent(PanelNotify.MAIL_INFO_UPDATE);
				
			}else{
				console.log("领取附件失败,请检查你的背包");
			}
			this.updateMailTips();
		}

		/**
		 * 一键领取附件返回
		 */
		private mailsReceiveStatus(data):void
		{	
			if(data.length<=0)
			{	
				//一键领取了0个邮件
				return;
			}
			(MailModel.getInstance() as MailModel).mailAttachBundle(data);
			App.EventSystem.dispatchEvent(PanelNotify.MAIL_INFO_UPDATE);
			this.updateMailTips();
		}

		private updateMailTips(){
			var mailModel:MailModel = MailModel.getInstance();
			if(mailModel.hasNoReadMail()){
				App.BtnTipManager.setTypeValue(ConstBtnTipType.MAIL,true);
			}else{
				App.BtnTipManager.setTypeValue(ConstBtnTipType.MAIL,false);
			}
		}

		/**
		 * 清理
		 */
		public clear() {
			super.clear();
			//清理处理
			// if(this._broadEventId != 0){
			// 	this.removeEventListener(PanelNotify.BROADCAST_PLAY,this._broadEventId);
			// 	this._broadEventId = 0;
			// }
		}

		/**
		 * 销毁
		 */
		public destroy() {
			super.destroy();
			//销毁处理
		}
	}
}
/**
 * Author: yangyipeng                                   
 * 常规充值模块视图窗口 2017/06/20.
 */
module game {
	export class RechargeView extends BaseView{
		public btlb_vip:eui.BitmapLabel;
		public btlb_nextVip:eui.BitmapLabel;
		public gp_vip:eui.Group;
		public gp_gold:eui.Group;
		public lb_nextVip:eui.Label;
		public lb_gold:eui.Label;
		public gp_maxVip:eui.Group;
		public scroller:eui.Scroller;
		public list_rechargeItem:eui.List;
		public img_return:eui.Image;
		public img_close:eui.Image;




		private _eventId:number =0;

		/**
		 * 创建皮肤（初始化调用一次）
		 */
		public childrenCreated() {
			super.childrenCreated();
			this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeWin,this);
			this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeWin,this);
			this.gp_vip.addEventListener(egret.TouchEvent.TOUCH_TAP,this.showVip,this);
			this.list_rechargeItem.itemRenderer = RechargeListItem;
			this.scroller.verticalScrollBar.visible = false;		
			this.scroller.verticalScrollBar.autoVisibility = false;		
			
		}
		private showVip():void
		{
			WinManager.getInstance().openWin(WinName.VIP);
		}
		/**
		 * 打开窗口(每次打开App.WinManager.openWin(WinName.BACKPACK);都会调用)
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			App.Socket.send(28002,{});
			if(this._eventId == 0)
			{
				this._eventId = App.EventSystem.addEventListener(PanelNotify.RECHARGE_INFO_UPDATE,this.handlerUpdateView,this);
			}
			
		}

		public closeWin():void
		{
			WinManager.getInstance().closeWin(this.winVo.winName);
		}

		private handlerUpdateView():void
		{
			var rechargeVo:RechargeVo = (RechargeModel.getInstance() as RechargeModel).rechargeViewData;
			this.btlb_vip.text = rechargeVo.vip;
			if(rechargeVo.vip == 10) {
				this.btlb_nextVip.text = rechargeVo.vip ;
				this.gp_gold.visible = false;
				this.gp_maxVip.visible = true;
			}else {
				this.btlb_nextVip.text = rechargeVo.vip + 1;
				this.lb_nextVip.text = rechargeVo.vip + 1;
				this.lb_gold.text = rechargeVo.gold;
			}
			this.list_rechargeItem.dataProvider = rechargeVo.rechargeList;
		}

		

		/**
		 * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
		 */
		public clear(data: any = null): void {
			super.clear(data);
			if(this._eventId != 0 )
			{
				App.EventSystem.removeEventListener(PanelNotify.RECHARGE_INFO_UPDATE,this._eventId);
				this._eventId = 0;
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
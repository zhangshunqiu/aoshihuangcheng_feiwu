/**
* Author: yangyipeng
* Email： hersletter@qq.com
* 邮件UI视图层 2017/06/20.
*/
module game {
	export class MailView extends BaseView{
		private img_close:eui.Image;
		private list_content:eui.List;
		private img_return:eui.Image;
		private scroller:eui.Scroller;
		private btn_reward:eui.Button;
		private pageView:PageView;
		private gp_main0:eui.Group;
		private img_return0:eui.Image;
		private img_close0:eui.Image;
		private btn_reward0:eui.Button;
		private img_front:eui.Image;
		private img_back:eui.Image;
		private lb_pageNum:eui.Label;

		private _eventId:number =0 ;
		public constructor(viewConf: WinManagerVO = null) 
		{
			super(viewConf);
		}

		protected childrenCreated() {
            super.childrenCreated();

			this.img_close0.addEventListener(egret.TouchEvent.TOUCH_TAP,this.handlerCloseBtn,this);
			this.img_return0.addEventListener(egret.TouchEvent.TOUCH_TAP,this.handlerCloseBtn,this);
			this.btn_reward0.addEventListener(egret.TouchEvent.TOUCH_TAP,this.handlerReceiveReward,this);
			this.img_back.addEventListener(egret.TouchEvent.TOUCH_TAP,this.pageBackHandler,this)
			this.img_front.addEventListener(egret.TouchEvent.TOUCH_TAP,this.pageFrontHandler,this)
		
			this.pageView = new PageView();
			this.pageView.setTabbarEnabled(false);
			this.pageView.itemRenderer = MailGroup;
			this.pageView.horizontalCenter = 1;
			this.pageView.y = 135;
			this.pageView.height = 700;
			this.pageView.width = 570;
			this.gp_main0.addChild(this.pageView);

			if((MailModel.getInstance() as MailModel).mailArr.length <= 0)
			{
				// App.Socket.send(21001,{page:1});
				App.Socket.send(21006,{});
			}else{
				this.pageView.dataProvider =new eui.ArrayCollection((MailModel.getInstance() as MailModel).mailArr);
			}	
			this.showPageBtn();
			this.showPageNum();
			
        }

		public openWin(openParam: any = null):void 
		{
			super.openWin();
			if(this._eventId == 0)
			{
				this._eventId = App.EventSystem.addEventListener(PanelNotify.MAIL_INFO_UPDATE,this.HandlerMailChange,this);
			}
		}

		private calll():void
		{
			// console.log(123)
			this.showPageBtn();
			this.showPageNum();
		}

		private pageBackHandler():void
		{	
			this.pageView.currentIndex = this.pageView.currentIndex +1;
			this.showPageBtn();
			this.showPageNum();
			// this.pageView.slideAnimate(-1)
		}

		private pageFrontHandler():void
		{	
			// var len:number = (MailModel.getInstance() as MailModel).mailDataLength();
			// var maxPage:number = Math.floor(len/6);
			this.pageView.currentIndex = this.pageView.currentIndex -1;
			this.showPageBtn();
			this.showPageNum();
			
		}

		/**
		 * 显示翻页按钮
		 */
		private showPageBtn():void
		{	
			//this.pageView.currentIndex是从0开始的
			if(this.pageView.currentIndex <= 0)
			{
				this.img_front.visible = false;
			}else{
				this.img_front.visible = true;
			}

			var len:number = (MailModel.getInstance() as MailModel).mailDataLength();
			var maxPage:number = Math.floor(len/6);
			if(this.pageView.currentIndex+1 >= maxPage)
			{
				this.img_back.visible = false;
			}else{
				this.img_back.visible = true;
			}
		}

		/**
		 * 显示页码
		 */
		private showPageNum():void
		{
			var curPage:number = this.pageView.currentIndex + 1;
			var len:number = (MailModel.getInstance() as MailModel).mailDataLength();
			var totalPage:number = Math.floor(len/6);
			if(totalPage == 0)
			{
				totalPage =1;
			}
			this.lb_pageNum.text = curPage +" / " + totalPage;
		}

		private HandlerMailChange():void
		{
			this.pageView.dataProvider =new eui.ArrayCollection((MailModel.getInstance() as MailModel).mailArr);
			this.showPageBtn();
			this.showPageNum();
		}

		private handlerReceiveReward():void
		{
			App.Socket.send(21004,{});
		}

		// private getCurPage():number
		// {	
		// 	var page:number = Math.round((this.list_content.scrollV + this.scroller.height)/this.scroller.viewport.contentHeight);
		// 	return page+1;
		// }
	

		private handlerCloseBtn():void
		{
			App.WinManager.closeWin(WinName.MAIL);
		}

		

		// public closeWin(callback = null): void 
		// {
		// 	super.closeWin();
		// }

		public clear():void
		{	
			super.clear();
			this.img_close0.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.handlerCloseBtn,this);
			this.img_return0.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.handlerCloseBtn,this);
			this.btn_reward0.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.handlerReceiveReward,this);
			if(this._eventId>0)
			{
				App.EventSystem.removeEventListener(PanelNotify.MAIL_INFO_UPDATE,this._eventId);
				this._eventId = 0;

			}
			// this.scroller.removeEventListener(egret.Event.CHANGE,this.scrollerChange,this);
		}

		public destroy():void
		{
			super.destroy();
		}
	}

	class MailGroup extends PageViewItem {
		public list: eui.List;
		public constructor() {
			super();
			this.skinName = `<?xml version="1.0" encoding="utf-8"?>
				<e:Skin class="backpackItemSkin" width="570" height="700" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing" xmlns:customui="customui.*">
					<e:List id="list" left="0" right="0" top="0" bottom="0">
						
					</e:List>
				</e:Skin>`;
			let layout = new eui.VerticalLayout();
			// layout.requestedColumnCount = 5;
			// layout.requestedRowCount = 5;
			// layout.verticalGap = -4;
			// layout.horizontalGap = 20;
			layout.horizontalAlign = egret.HorizontalAlign.CENTER;
			this.list.layout = layout;
			// this.list.horizontalCenter = 1;
			this.list.itemRenderer = MailListItem;
			this.list.itemRendererSkinName = MailListItemSkin;
			this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTap, this);
			// this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTap, this,false);
		}

		public reload(data) {
			this.list.dataProvider = new eui.ArrayCollection(data);
		}

		private itemTap(event: eui.ItemTapEvent) {
			var itemData = event.item;
			var detailView = new MailDetail(itemData);
			PopUpManager.addPopUp({obj:detailView,effectType:1,dark:true});

		}

	}

	
}
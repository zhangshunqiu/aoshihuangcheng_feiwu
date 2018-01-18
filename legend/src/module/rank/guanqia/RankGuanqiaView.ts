/**
 * 关卡榜视图层	
 * author : 杨艺鹏
*/
module game {
	export class RankGuanqiaView extends BaseView{

		public img_close:eui.Image;
		public list_rank:eui.List;
		public lb_myRank:eui.Label;
		public img_return:eui.Image;

		private eventId:number = 0;

		public constructor(winManagerVO) {
			super(winManagerVO);
		}

		/**
		 * 创建皮肤（初始化调用一次）
		 */
		public childrenCreated() {
			super.childrenCreated();
			this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeWin,this);
			this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeWin,this);
			this.list_rank.itemRenderer = GuanqiaListItem;
		}

		/**
		 * 打开窗口(每次打开App.WinManager.openWin(WinName.BACKPACK);都会调用)
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			if(this.eventId == 0) {
				this.eventId = App.EventSystem.addEventListener(PanelNotify.RANK_GUANQIA_UPDATE,this.updateUi,this);
			}
			// App.Socket.send(27009,{});
			this.updateUi();
		}

		private updateUi():void {
			this.list_rank.dataProvider = (RankGuanqiaModel.getInstance() as RankGuanqiaModel).rankListArr;

			if((RankGuanqiaModel.getInstance() as RankGuanqiaModel).myRank == 100)
			{
				this.lb_myRank.textFlow = [{text:"我的排名: 未上榜",style:{textColor:0xffa200}} ];
			}else{
				this.lb_myRank.textFlow = [{text:"我的排名: "},{text:(RankGuanqiaModel.getInstance() as RankGuanqiaModel).myRank + "",style:{textColor:0xffa200}} ];
			}
		
		}

		public closeWin():void{
			WinManager.getInstance().closeWin(this.winVo.winName);
		}

		/**
		 * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
		 */
		public clear(data: any = null): void {
			super.clear(data);
			if(this.eventId != 0) {
				App.EventSystem.removeEventListener(PanelNotify.RANK_GUANQIA_UPDATE,this.eventId);
				this.eventId = 0;
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
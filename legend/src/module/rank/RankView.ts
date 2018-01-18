/**
 * 排行榜视图层	
 * author : 杨艺鹏
*/
module game {
	export class RankView extends BaseView{

		private img_close:eui.Image;
		private img_question:eui.Image;
		private img_return:eui.Image;
		private lb_myRank:eui.Label;
		private lb_worShip_exp:eui.Label;
		private lb_worShip_money:eui.Label;
		private btn_worShip:eui.Button;
		private img_gotten:eui.Image;
		private tabBar_rank:eui.TabBar;
		private list_rank:eui.List;
		private dataGp_rank:eui.DataGroup;

		private _eventId:number = 0;
		private _eventId1:number = 0;
		private _eventId2:number = 0;
	
		private _curRankType:string;//表示目前排行榜停留在哪个榜页面

		public get curRankType():string
		{
			return this._curRankType;
		}
		
		public constructor(vo:WinManagerVO) {
			super(vo);
		}

		protected childrenCreated():void
		{
			super.childrenCreated()
			this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeWin,this);
			this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeWin,this);
			this.img_question.addEventListener(egret.TouchEvent.TOUCH_TAP,this.questionHandler,this);
			this.btn_worShip.addEventListener(egret.TouchEvent.TOUCH_TAP,this.worshipHandler,this);
			//列表
			this.list_rank.itemRenderer = RankListItem;
			//dataGroup
			this.dataGp_rank.itemRenderer = RankTopView;
			//tabBar
			this.tabBar_rank.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.tabItemHandler,this)
			this.tabBar_rank.dataProvider = new eui.ArrayCollection(["战力榜", "等级榜", "战圣榜","法神榜","道尊榜","遭遇榜","勋章榜","王者榜"]);
			this.tabBar_rank.itemRendererSkinName = "RankButtonSkin";
		}

		public closeWin():void{
			WinManager.getInstance().closeWin(this.winVo.winName);
		}

		public openWin(openParam: any = null): void {
			super.openWin();
			if(this._eventId == 0){
				this._eventId = App.EventSystem.addEventListener(PanelNotify.RANK_INFO_UPDATE,this.handlerRankInfoUpdate,this);
			}
			if(this._eventId1 == 0){
				this._eventId1 = App.EventSystem.addEventListener(PanelNotify.RANK_WORSHIP_UPDATE,this.showWorShip,this);
			}
			if(this._eventId2 == 0){
				this._eventId2 = App.EventSystem.addEventListener(PanelNotify.RANK_INFO_NOTHING,this.handlerClearRank,this);
			}
			if(this.openData)
			{
				this._curRankType = this.openData;
			}else{
				this._curRankType = ConstRankName.COMBAT;
			}
			this.getRank();
			this.showWorShip();
		}

		private tabItemHandler(event: eui.ItemTapEvent):void
		{	
			this._curRankType = ConstRankIndex[event.itemIndex];
			this.getRank();
			this.showWorShip();
		}

		/**
		 * 排行榜controller回调
		*/
		private handlerRankInfoUpdate(data):void
		{	
			if(data === this._curRankType)
			{	
				// this.showRank();
				var rankItem = (RankModel.getInstance() as RankModel).rankObj[this._curRankType];
				this.list_rank.dataProvider = rankItem["rankArr"];
				this.dataGp_rank.dataProvider = rankItem["topRank"];
				if(rankItem["my_rank"] == 0)
				{
					this.lb_myRank.textFlow = [{text:"我的排名: 未上榜",style:{textColor:0xffa200}} ];
				}else{
					this.lb_myRank.textFlow = [{text:"我的排名: "},{text:rankItem["my_rank"],style:{textColor:0xffa200}} ];
				}
				this.showWorShip();
			}
			
		}

		private getRank():void
		{	
			this.tabBar_rank.selectedIndex = ConstRankIndex[this._curRankType];
			//请求
			switch(this._curRankType)
			{
			case ConstRankName.COMBAT:
					App.Socket.send(27001,{});
					break;
			case ConstRankName.LEVEL:
					App.Socket.send(27002,{});
					break;
			case ConstRankName.FIGHTER:
					App.Socket.send(27003,{});
					break;
			case ConstRankName.MAGIC:
					App.Socket.send(27004,{});
					break;
			case ConstRankName.TAOIST:
					App.Socket.send(27005,{});
					break;
			case ConstRankName.KILL:
					App.Socket.send(27006,{});
					break;
			case ConstRankName.MEMAL:
					App.Socket.send(27007,{});
					break;
			case ConstRankName.KING:
					App.Socket.send(27008,{});
					break;
			default:
					break;
			}
			
			
		}

		/**
		 * 膜拜结果回调
		 */
		// private handlerWorship():void {
		// 	var canWorShip = (RankModel.getInstance() as RankModel).rankObj[this._curRankType]["worShip"];
		// 	if(canWorShip == 1)
		// 	{	
		// 		//读表膜拜经验 膜拜金币
		// 		this.btn_worShip.visible = true;
		// 		this.img_gotten.visible = false;
		// 	}else{
		// 		this.btn_worShip.visible = false;
		// 		this.img_gotten.visible = true;
		// 	}
		// 	this.showWorShip();
		// }

		/**
		 * 显示膜拜信息
		 */
		private showWorShip():void
		{	
			//  message pbRankMedal{
			// 	 optional int32 my_rank		= 1; // 我的排名
			// 	 optional int32 worship		= 2; // 膜拜状态 （1可膜拜 2已膜拜）
			// 	 repeated pbRankMedalPlayer list	= 3; // 上榜玩家列表
			//  }
			//读表显示膜拜奖励
			var myLevel:number = RoleManager.getInstance().roleInfo.lv;
			var turn:number = RoleManager.getInstance().roleInfo.turn;
			var worShipConfig = ConfigManager.getInstance().getWorShipByIv([myLevel,turn]);
			var worShipData:Array<any> = worShipConfig["reward"];
			for(var i:number=0;i<worShipData.length;i++)
			{
				if(worShipData[i][1] == 100)
				{	
					this.lb_worShip_exp.text = this.fixNum(worShipData[i][2]);
				}
				if(worShipData[i][1] == 101)
				{
					this.lb_worShip_money.text = this.fixNum(worShipData[i][2]);
				}
			}

			//显示是否已膜拜过 膜拜状态（1可膜拜 2已膜拜）
			var canWorShip;
			if((RankModel.getInstance() as RankModel).rankObj[this._curRankType]){
				canWorShip = (RankModel.getInstance() as RankModel).rankObj[this._curRankType]["worShip"];
			}
			switch(canWorShip){
				case 1:
						this.btn_worShip.visible = true;
						this.img_gotten.visible = false;//没领取
						break;
				case 2:
						this.btn_worShip.visible = false;
						this.img_gotten.visible = true;//已领取
						break;
				default: //canWorShip为空的情况，该排行榜没有排名
						this.btn_worShip.visible = true;
						this.img_gotten.visible = false;//没领取
						break;
			}
			// if(canWorShip)
			// {	
			// 	this.btn_worShip.visible = true;
			// 	this.img_gotten.visible = false;//没领取
			// }else{
			// 	this.btn_worShip.visible = false;
			// 	this.img_gotten.visible = true;//已领取
			// }
		}

		private fixNum(num:number):string {
			if(num/1000000 >= 1) {
				var _num:number = num/10000;
				return _num.toFixed(1) + "万";
			}else {
				return num + "";
			}
		}
		
		/**
		 * 清空信息回调（当前排行榜没有排名的时候）
		 */
		private handlerClearRank(data):void {
			if(data === this._curRankType)
			{	
				this.list_rank.dataProvider = new eui.ArrayCollection([]);
				this.dataGp_rank.dataProvider = new eui.ArrayCollection([]);
				this.lb_myRank.textFlow = [{text:"我的排名: 未上榜",style:{textColor:0xffa200}} ];
				this.showWorShip();
			}
		}
		/**
		 * 膜拜
		 */
		private worshipHandler():void
		{	
			var index:string = ConstRankIndex[this._curRankType];
			App.Socket.send(27020,{rank:index+1})
		}

		private questionHandler():void
		{	
			WinManager.getInstance().openPopWin(WinName.POP_RANK_QUESTION)
		}

		/**
		 * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
		 */
		public clear(data: any = null): void {
			super.clear(data);
			if(this._eventId != 0)
			{
				App.EventSystem.removeEventListener(PanelNotify.RANK_INFO_UPDATE,this._eventId);
				this._eventId = 0;
			}
			if(this._eventId1 != 0)
			{
				App.EventSystem.removeEventListener(PanelNotify.RANK_WORSHIP_UPDATE,this._eventId1);
				this._eventId1 = 0;
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
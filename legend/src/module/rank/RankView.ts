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
		private _worShipEventId:number = 0;
		/**
		 * 表示目前排行榜停留在哪个榜页面
		 */
		private _curRankType:string;

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
			if(this._worShipEventId == 0){
				this._worShipEventId = App.EventSystem.addEventListener(PanelNotify.RANK_WORSHIP_UPDATE,this.worShip,this);
			}
			if(this.openData)
			{
				this._curRankType = this.openData;
			}else{
				this._curRankType = ConstRankName.COMBAT;
			}
			this.showRank();
		}

		private tabItemHandler(event: eui.ItemTapEvent):void
		{	
			this._curRankType = ConstRankIndex[event.itemIndex];
			this.showRank();
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
				this.worShip();
			}
			
		}

		private showRank():void
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
			// var rankItem = (RankModel.getInstance() as RankModel).rankObj[this._curRankType];
			// if(rankItem == null){
			// 	//请求
			// 	switch(this._curRankType)
			// 	{
			// 	case ConstRankName.COMBAT:
			// 			App.Socket.send(27001,{});
			// 			break;
			// 	case ConstRankName.LEVEL:
			// 			App.Socket.send(27002,{});
			// 			break;
			// 	case ConstRankName.FIGHTER:
			// 			App.Socket.send(27003,{});
			// 			break;
			// 	case ConstRankName.MAGIC:
			// 			App.Socket.send(27004,{});
			// 			break;
			// 	case ConstRankName.TAOIST:
			// 			App.Socket.send(27005,{});
			// 			break;
			// 	case ConstRankName.KILL:
			// 			App.Socket.send(27006,{});
			// 			break;
			// 	case ConstRankName.MEMAL:
			// 			App.Socket.send(27007,{});
			// 			break;
			// 	default:
			// 			break;
			// 	}
			// }else{
			// 	this.list_rank.dataProvider = rankItem["rankArr"];
			// 	this.dataGp_rank.dataProvider = rankItem["topRank"];

			// 	if(rankItem["my_rank"] == 0)
			// 	{
			// 		this.lb_myRank.textFlow = [{text:"我的排名: 未上榜",style:{textColor:0xffa200}} ];
			// 	}else{
			// 		this.lb_myRank.textFlow = [{text:"我的排名: "},{text:rankItem["my_rank"],style:{textColor:0xffa200}} ];
			// 	}
			// 	this.worShip();
			// }
			
		}


		/**
		 * 显示膜拜信息
		 */
		private worShip():void
		{	
			//  message pbRankMedal{
			// 	 optional int32 my_rank		= 1; // 我的排名
			// 	 optional int32 worship		= 2; // 膜拜状态 （1可膜拜 2已膜拜）
			// 	 repeated pbRankMedalPlayer list	= 3; // 上榜玩家列表
			//  }
			var myLevel:number = RoleManager.getInstance().roleInfo.lv;
			var worShipConfig = ConfigManager.getInstance().getWorShipByIv(myLevel);
			var worShipData:Array<any> = worShipConfig["reward"];
			for(var i:number=0;i<worShipData.length;i++)
			{
				if(worShipData[i][1] == 100)
				{	
					// var goodsConfig = ConfigManager.getInstance().getItemInfoById(100);
					this.lb_worShip_exp.text = worShipData[i][2] + "万";
				}
				if(worShipData[i][1] == 101)
				{
					this.lb_worShip_money.text = worShipData[i][2] + "万";
				}
			}

			var canWorShip = (RankModel.getInstance() as RankModel).rankObj[this._curRankType]["worShip"];
			if(canWorShip == 1)
			{	
				//读表膜拜经验 膜拜金币
				
				this.btn_worShip.visible = true;
				this.img_gotten.visible = false;
			}else{
				this.btn_worShip.visible = false;
				this.img_gotten.visible = true;
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
			var view:eui.Component = new eui.Component();
			view.skinName = "RankTipsSkin";
			// view["lb_content"]["textFlow"] = [{ text: "获取精华", style: { underline: true } }];
    		view["lb_content"]["textFlow"] =(new egret.HtmlTextParser).parser('<font color=0xB5B5B5 size=24>1.排行榜奖励每天</font>'
				+ '<font color=0x00f828 size=24 >4点</font>'
				+'<font color=0xB5B5B5 size=24>以邮件发送\n</font>'

				+'<font color=0xB5B5B5 size=24>2.称号奖励将会为玩家</font>'
				+ '<font color=0x00f828 size=24 >自动激活</font>'
				+'<font color=0xB5B5B5 size=24>有效期自激活起</font>'
				+ '<font color=0x00f828 size=24 >1天\n</font>'

				+'<font color=0xB5B5B5 size=24>3.膜拜将于每天早上</font>'
				+ '<font color=0x00f828 size=24 >4点</font>'
				+'<font color=0xB5B5B5 size=24>刷新，玩家可以膜拜自己\n</font>'
			);
			PopUpManager.addPopUp({obj:view,dark:true});
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
			if(this._worShipEventId != 0)
			{
				App.EventSystem.removeEventListener(PanelNotify.RANK_WORSHIP_UPDATE,this._worShipEventId);
				this._worShipEventId = 0;
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
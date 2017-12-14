/**
 * 排行榜listItem视图层	
 * author : 杨艺鹏
*/
module game{
	export class RankListItem extends eui.ItemRenderer{
		private img_honour:eui.Image;
		private lb_rank:eui.Label;
		// private lb_vip:eui.Label;
		private bitmap_vip:eui.BitmapLabel;
		private lb_level:eui.Label;
		private lb_rankData:eui.Label;
		private lb_name:eui.Label;
		private img_rankNum:eui.Image;
		private img_yue:eui.Image;
		private img_vip:eui.Image;

		public listType:string;
		public constructor() {
			super();
			this.skinName = RankListItemSkin;
		}

		protected dataChanged():void
		{	
			//称号图片
			this.showHonour();
			
			//排名图片
			this.rankNumPic();

			//月卡 + vip等级
			if(this.data.month_card)
			{
				this.img_yue.visible = true;
			}else{
				this.img_yue.visible = false;
			}
			if(this.data.vip)
			{	
				this.img_vip.visible = true;
				this.bitmap_vip.text = this.data.vip;
				this.img_yue.x = 0;
			}else
			{
				this.img_vip.visible = false;
				this.bitmap_vip.text = "";
				this.img_yue.x = 30;
			}

			//玩家等级
			if(this.data.lv)
			{	
				this.lb_level.visible = true;
				if(this.data.turn)
				{
					this.lb_level.text = this.data.turn + "转" + this.data.lv +"级";
				}else{
					this.lb_level.text = this.data.lv +"级";
				}
			}else{
				this.lb_level.visible = false;
			}
	
			//排行榜描述
			if(this.data.rankData)
			{
				this.lb_rankData.text = this.data.rankData;
			}else
			{
				this.lb_rankData.text = null;
			}
			//名字
			this.lb_name.text = this.data.name;
		}

		/**
		 * 显示称号
		 */
		private showHonour():void
		{
			var rankView:RankView = WinManager.getInstance().getWin(WinName.RANK) as RankView;
			var rankType:string = rankView.curRankType;
			if(this.data.rank<=10 && this.data.rank>1)
			{	
				this.img_honour.visible = true;
				switch(rankType)
				{
				case ConstRankName.COMBAT:
						this.img_honour.source = "ranking list_shidagaoshou_png";
						break;
				case ConstRankName.LEVEL:
						
						break;
				case ConstRankName.FIGHTER:
						
						break;
				case ConstRankName.MAGIC:
						
						break;
				case ConstRankName.TAOIST:
						
						break;
				case ConstRankName.KILL:
						this.img_honour.source = "ranking list_shidashashou_png";
						break;
				case ConstRankName.MEMAL:
						
						break;
				case ConstRankName.KING:
						switch(this.data.grade)
						{
							case 0:
								this.img_honour.source = "labber_huizhang_qingtong_png";
								break;
							case 1:
								this.img_honour.source = "labber_huizhang_huangjin_png";
								break;
							case 2:
								this.img_honour.source = "labber_huizhang_baiyin_png";
								break;
							case 3:
								this.img_honour.source = "labber_huizhang_zuanshi_png";
								break;							
						}
						break;
				default:
						break;
				}
			}else{
				this.img_honour.visible = false;
			}
		}

		/**
		 * 显示排名
		 */
		private rankNumPic():void
		{
			if(this.data.rank == 2)
			{
				this.img_rankNum.source = "ranking list_2_png";
				this.lb_rank.text = "";
			}
			else if(this.data.rank == 3)
			{
				this.img_rankNum.source = "ranking list_3_png";
				this.lb_rank.text = "";
			}else
			{
				this.lb_rank.text = this.data.rank;
			}
				
		}
	}
}
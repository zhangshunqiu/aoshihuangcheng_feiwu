/**
 * 排行榜listItem视图层	
 * author : 杨艺鹏
*/
module game{
	export class RankListItem extends eui.ItemRenderer{
		//普通榜（战力榜、遭遇榜。。。。。）
		public img_bg:eui.Image;
		public img_rankNum:eui.Image;
		public lb_rank:eui.Label;
		public lb_level:eui.Label;
		public lb_rankData:eui.Label;
		public lb_name:eui.Label;
		public img_honour:eui.Image;
		public gp_vip:eui.Group;
		public img_yue:eui.Image;
		public img_vip:eui.Image;
		public bitmap_vip:eui.BitmapLabel;

		//等级榜
		public img_bg_level:eui.Image;
		public img_rankNum_level:eui.Image;
		public lb_rank_level:eui.Label;
		public lb_lv_level:eui.Label;
		public lb_name_level:eui.Label;
		public gp_vip_level:eui.Group;
		public img_yue_level:eui.Image;
		public img_vip_level:eui.Image;
		public bitmap_vip_level:eui.BitmapLabel;



		//王者榜
		public img_bg_king:eui.Image;
		public img_rankNum_king:eui.Image;
		public lb_rank_king:eui.Label;
		public lb_margin_king:eui.Label;
		public lb_name_king:eui.Label;
		public img_grade_king:eui.Image;
		public lb_gradeLv_king:eui.Label;
		public gp_vip_king:eui.Group;
		public img_yue_king:eui.Image;
		public img_vip_king:eui.Image;
		public bitmap_vip_king:eui.BitmapLabel;


		private _rankVo:RankVo;

		public constructor() {
			super();
			this.skinName = RankListItemSkin;
		}

		protected childrenCreated():void {
			this.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
				App.WinManager.openPopWin(WinName.POP_PLAYER_MSG,this._rankVo.playerId);
			},this)
		}
		protected dataChanged():void {
			// this._rankVo = this.data;
			this.updateUi(this.data);
		}

		public updateUi(rankVo:RankVo):void{
			this._rankVo = rankVo;
			//显示对应排行榜皮肤
			this.showUi();
		}

		private showUi():void {
			var rankView:RankView = WinManager.getInstance().getWin(WinName.RANK) as RankView;
			var rankType:string = rankView.curRankType;
			switch(rankType) {
				case ConstRankName.COMBAT:
						this.showCommonUi();
						break;
				case ConstRankName.LEVEL:
						this.showLevelUi();
						break;
				case ConstRankName.FIGHTER:
						this.showCommonUi();
						break;
				case ConstRankName.MAGIC:
						this.showCommonUi();
						break;
				case ConstRankName.TAOIST:
						this.showCommonUi();
						break;
				case ConstRankName.KILL:
						this.showCommonUi();
						break;
				case ConstRankName.MEMAL:
						this.showCommonUi();
						break;
				case ConstRankName.KING:
						this.showKingUi();
						break;
				default:
						break;
			}
		}

		/**
		 * 显示普通榜
		 */
		private showCommonUi():void {
			this.skinName = RankListItemSkin;
			//称号图片
			this.showHonour();
		
			//名字
			if(this._rankVo.name)
			{
				this.lb_name.text = this._rankVo.name;
			}
			//月卡 + vip等级
			if(this._rankVo.month_card)
			{
				this.img_yue.visible = true;
			}else{
				this.img_yue.visible = false;
			}
			if(this._rankVo.vip)
			{	
				this.img_vip.visible = true;
				this.bitmap_vip.text = this._rankVo.vip + "";
			}else
			{
				this.img_vip.visible = false;
				this.bitmap_vip.text = "";
			}

			//玩家等级
			if(this._rankVo.lv)
			{	
				
				this.lb_level.visible = true;
				if(this._rankVo.turn)
				{
					this.lb_level.text = this._rankVo.turn + "转" + this._rankVo.lv +"级";
				}else{
					this.lb_level.text = this._rankVo.lv +"级";
				}
				
			}else{
				this.lb_level.visible = false;
			}
	
			//排行榜描述
			if(this._rankVo.rankData)
			{
				this.lb_rankData.text = this._rankVo.rankData;
			}else
			{
				this.lb_rankData.text = null;
			}

			//排名图标
			if(this._rankVo.rank == 1)
			{
				this.img_rankNum.source = "ranking list_1_png";
				this.lb_rank.text = "";
			}
			else if(this._rankVo.rank == 2)
			{
				this.img_rankNum.source = "ranking list_2_png";
				this.lb_rank.text = "";
			}
			else if(this._rankVo.rank == 3)
			{
				this.img_rankNum.source = "ranking list_3_png";
				this.lb_rank.text = "";
			}else
			{	
				this.img_rankNum.source = null;
				this.lb_rank.text = this._rankVo.rank + "";
			}
		}

		/**
		 * 显示等级榜
		 */
		private showLevelUi():void {
			this.skinName = "RankListItemLevel";
			//名字
			if(this._rankVo.name)
			{
				this.lb_name_level.text = this._rankVo.name;
			}
			//月卡 + vip等级
			if(this._rankVo.month_card)
			{
				this.img_yue_level.visible = true;
			}else{
				this.img_yue_level.visible = false;
			}
			if(this._rankVo.vip)
			{	
				this.img_vip_level.visible = true;
				this.bitmap_vip_level.text = this._rankVo.vip + "";
			}else
			{
				this.img_vip_level.visible = false;
				this.bitmap_vip_level.text = "";
			}
			//玩家等级
			if(this._rankVo.lv)
			{	
				this.lb_lv_level.visible = true;
				if(this._rankVo.turn)
				{
					this.lb_lv_level.text = this._rankVo.turn + "转" + this._rankVo.lv +"级";
				}else{
					this.lb_lv_level.text = this._rankVo.lv +"级";
				}
			}else{
				this.lb_lv_level.visible = false;
			}
			//排名图标
			if(this._rankVo.rank == 1)
			{
				this.img_rankNum_level.source = "ranking list_1_png";
				this.lb_rank_level.text = "";
			}
			else if(this._rankVo.rank == 2)
			{
				this.img_rankNum_level.source = "ranking list_2_png";
				this.lb_rank_level.text = "";
			}
			else if(this._rankVo.rank == 3)
			{
				this.img_rankNum_level.source = "ranking list_3_png";
				this.lb_rank_level.text = "";
			}else
			{	
				this.img_rankNum_level.source = null;
				this.lb_rank_level.text = this._rankVo.rank + "";
			}
		}

		/**
		 * 显示王者榜
		 */
		private showKingUi():void {
			this.skinName = "RankListItemKing";
			//段位图标
			switch(this._rankVo.grade)
			{
				case 0:
					this.img_grade_king.source = "labber_huizhang_qingtong_png";
					break;
				case 1:
					this.img_grade_king.source = "labber_huizhang_huangjin_png";
					break;
				case 2:
					this.img_grade_king.source = "labber_huizhang_baiyin_png";
					break;
				case 3:
					this.img_grade_king.source = "labber_huizhang_zuanshi_png";
					break;							
			}
			if(this._rankVo.gradeLv) {
				this.lb_gradeLv_king.text = this._rankVo.gradeLv + "";
			}
			//场数
			if(this._rankVo.rankData)
			{
				this.lb_margin_king.text = this._rankVo.rankData;
			}else
			{
				this.lb_margin_king.text = null;
			}
			//名字
			if(this._rankVo.name)
			{
				this.lb_name_king.text = this._rankVo.name;
			}
			//月卡 + vip等级
			if(this._rankVo.month_card)
			{
				this.img_yue_king.visible = true;
			}else{
				this.img_yue_king.visible = false;
			}
			if(this._rankVo.vip)
			{	
				this.img_vip_king.visible = true;
				this.bitmap_vip_king.text = this._rankVo.vip + "";
			}else
			{
				this.img_vip_king.visible = false;
				this.bitmap_vip_king.text = "";
			}
			//排名图标
			if(this._rankVo.rank == 1)
			{
				this.img_rankNum_king.source = "ranking list_1_png";
				this.lb_rank_king.text = "";
			}
			else if(this._rankVo.rank == 2)
			{
				this.img_rankNum_king.source = "ranking list_2_png";
				this.lb_rank_king.text = "";
			}
			else if(this._rankVo.rank == 3)
			{
				this.img_rankNum_king.source = "ranking list_3_png";
				this.lb_rank_king.text = "";
			}else
			{	
				this.img_rankNum_king.source = null;
				this.lb_rank_king.text = this._rankVo.rank + "";
			}
		}

		/**
		 * 显示称号
		 */
		private showHonour():void
		{
			var rankView:RankView = WinManager.getInstance().getWin(WinName.RANK) as RankView;
			var rankType:string = rankView.curRankType;
			if(this._rankVo.rank<=10 && this._rankVo.rank>1)
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
							
							break;
					default:
							break;
				}
			}else
			{
				this.img_honour.visible = false;
			}
		}

		
		public setFirstStyle():void
		{
			var rankView:RankView = WinManager.getInstance().getWin(WinName.RANK) as RankView;
			var rankType:string = rankView.curRankType;
			switch(rankType)
			{
				case ConstRankName.COMBAT:
						this.img_bg.alpha = 0.8;
						this.lb_name.textColor = 0xffea00;
						break;
				case ConstRankName.LEVEL:
						this.img_bg_level.alpha = 0.8;
						this.lb_name_level.textColor = 0xffea00;
						break;
				case ConstRankName.FIGHTER:
						this.img_bg.alpha = 0.8;
						this.lb_name.textColor = 0xffea00;
						break;
				case ConstRankName.MAGIC:
						this.img_bg.alpha = 0.8;
						this.lb_name.textColor = 0xffea00;
						break;
				case ConstRankName.TAOIST:
						this.img_bg.alpha = 0.8;
						this.lb_name.textColor = 0xffea00;
						break;
				case ConstRankName.KILL:
						this.img_bg.alpha = 0.8;
						this.lb_name.textColor = 0xffea00;
						break;
				case ConstRankName.MEMAL:
						this.img_bg.alpha = 0.8;
						this.lb_name.textColor = 0xffea00;
						break;
				case ConstRankName.KING:
						this.img_bg_king.alpha = 0.8;
						this.lb_name_king.textColor = 0xffea00;
						break;
				default:
						break;
			}
		}
		/**
		 * 显示排名
		 */
		// private rankNumPic():void
		// {	
		// 	if(this._rankVo.rank == 1)
		// 	{
		// 		this.img_rankNum.source = "ranking list_1_png";
		// 		this.lb_rank.text = "";
		// 	}
		// 	else if(this._rankVo.rank == 2)
		// 	{
		// 		this.img_rankNum.source = "ranking list_2_png";
		// 		this.lb_rank.text = "";
		// 	}
		// 	else if(this._rankVo.rank == 3)
		// 	{
		// 		this.img_rankNum.source = "ranking list_3_png";
		// 		this.lb_rank.text = "";
		// 	}else
		// 	{	
		// 		this.img_rankNum.source = null;
		// 		this.lb_rank.text = this._rankVo.rank + "";
		// 	}
		// }
	}
}
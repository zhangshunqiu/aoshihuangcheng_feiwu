module game {
	export class PlayerHeroAttr extends BaseView{
		
		public gp_main:eui.Group;
		public commonWin:customui.CommonWin;
		public bitmap_score:eui.BitmapLabel;
		public img_return:eui.Image;
		public lb_ac:eui.Label;
		public lb_hp:eui.Label;
		public lb_mp:eui.Label;
		public lb_def:eui.Label;
		public lb_sdef:eui.Label;
		public lb_crit:eui.Label;
		public lb_rcrit:eui.Label;
		public lb_paralysis:eui.Label;
		public lb_damage_offset_rate:eui.Label;
		public lb_damage_reduction:eui.Label;
		public lb_damage_deepen:eui.Label;
		public lb_hit_rate:eui.Label;
		public lb_dodge:eui.Label;
		public tabBar:eui.TabBar;

		private  _attrArray = ["ac", "mac","sc","hp", "mp", "def", "sdef", "crit", "rcrit", "hit_rate", "dodge", "damage_deepen", "damage_reduction", "paralysis", "damage_offset_rate"];

		public constructor(vo) {
			super(vo);
		}

		protected childrenCreated():void {
			this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
				WinManager.getInstance().closePopWin(WinName.POP_PLAYER_HERO_ATTR);
			},this);
			this.tabBar.itemRenderer = PlayerMsgTabItem;
			this.tabBar.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.tabItemHandler,this);
		}
		/**
		 * 打开窗口(每次打开App.WinManager.openWin(WinName.BACKPACK);都会调用)
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			this.initTabBar();
			this.showHeroMsg();
		}

		private tabItemHandler(event:eui.ItemTapEvent):void {
			if(event.itemIndex <= (PlayerMsgModel.getInstance() as PlayerMsgModel).heroNum) {
				(PlayerMsgModel.getInstance() as PlayerMsgModel).curPos = event.itemIndex;
				this.showHeroMsg();
				App.EventSystem.dispatchEvent(PanelNotify.PLAYER_HERO_ATTRIBUTE_INDEX_CHANGE);
			}
		}
		/**
		 * 显示英雄头像
		 */
		private initTabBar():void {
			var dataArr:Array<string> = (PlayerMsgModel.getInstance() as PlayerMsgModel).herosHeadPic();
			this.tabBar.dataProvider = new eui.ArrayCollection(dataArr);
		}

		

		/**
		 * 显示英雄信息
		 */
		private showHeroMsg():void {
			this.tabSelectIndex();
			this.showHeroAttr();
			this.showHeroScore();
		}
		
		/**
		 * 改变切换卡选中状态
		 */
		private tabSelectIndex():void {
			var index:number = (PlayerMsgModel.getInstance() as PlayerMsgModel).curPos;
			var items = this.tabBar.$children;
			for(var i:number=0;i<items.length;i++) {
				if(i == index) {
					(items[i] as PlayerMsgTabItem).img_select.visible = true;
				}else {
					(items[i] as PlayerMsgTabItem).img_select.visible = false;
				}
			}
		}
		
		/**
		 * 显示英雄战力
		 */
		private showHeroScore():void {
			var index:number = (PlayerMsgModel.getInstance() as PlayerMsgModel).curPos;
			var heroDatas = (PlayerMsgModel.getInstance() as PlayerMsgModel).heroList;
			var heroData = heroDatas[index];
			this.bitmap_score.text = heroData["score"];//英雄战力
		}
		/**
		 * 显示英雄属性
		 */
		private showHeroAttr():void {
			var index:number = (PlayerMsgModel.getInstance() as PlayerMsgModel).curPos;
			var heroDatas = (PlayerMsgModel.getInstance() as PlayerMsgModel).heroList;
			var heroData = heroDatas[index];
			var heroAttr = heroData["attribute"]
			for(var i:number=0;i<this._attrArray.length;i++) {
				var attrName:string = this._attrArray[i];
				switch(attrName) {
					// 	key = "ac";
					// } else if (heroInfo.job == CareerType.MAGES) {
					// 	key = "mac";
					// } else if (heroInfo.job == CareerType.TAOIST) {
					// 	key = "sc";
						
					case "ac":
							var key = ConstAttributeArray.indexOf(attrName);
							var value = (PlayerMsgModel.getInstance() as PlayerMsgModel).getAtrributeByKey(key,heroAttr)["value"];
							if(value){
								this.lb_ac.text = value + "";
							}
							break;
					case "mac":
							var key = ConstAttributeArray.indexOf(attrName);
							var value = (PlayerMsgModel.getInstance() as PlayerMsgModel).getAtrributeByKey(key,heroAttr)["value"];
							if(value) {
								this.lb_ac.text = value + "";
							}
							break;
					case "sc":
							var key = ConstAttributeArray.indexOf(attrName);
							var value = (PlayerMsgModel.getInstance() as PlayerMsgModel).getAtrributeByKey(key,heroAttr)["value"];
							if(value) {
								this.lb_ac.text = value + "";
							}
							break;
					case "hp":
							var key = ConstAttributeArray.indexOf(attrName);
							var value = (PlayerMsgModel.getInstance() as PlayerMsgModel).getAtrributeByKey(key,heroAttr)["value"];
							this.lb_hp.text = value + "";
							break;
					case "mp":
							var key = ConstAttributeArray.indexOf(attrName);
							var value = (PlayerMsgModel.getInstance() as PlayerMsgModel).getAtrributeByKey(key,heroAttr)["value"];
							this.lb_mp.text = value +"";
							break;
					case "def":
							var key = ConstAttributeArray.indexOf(attrName);
							var value = (PlayerMsgModel.getInstance() as PlayerMsgModel).getAtrributeByKey(key,heroAttr)["value"];
							this.lb_def.text = value+ "";
							break;
					case "sdef":
							var key = ConstAttributeArray.indexOf(attrName);
							var value = (PlayerMsgModel.getInstance() as PlayerMsgModel).getAtrributeByKey(key,heroAttr)["value"];
							this.lb_sdef.text = value +"";
							break;
					case "crit":
							var key = ConstAttributeArray.indexOf(attrName);
							var value = (PlayerMsgModel.getInstance() as PlayerMsgModel).getAtrributeByKey(key,heroAttr)["value"];
							this.lb_crit.text = value/100 + "%";
							break;
					case "rcrit":
							var key = ConstAttributeArray.indexOf(attrName);
							var value = (PlayerMsgModel.getInstance() as PlayerMsgModel).getAtrributeByKey(key,heroAttr)["value"];
							this.lb_rcrit.text =  value/100 + "%";
							break;
					case "hit_rate":
							var key = ConstAttributeArray.indexOf(attrName);
							var value = (PlayerMsgModel.getInstance() as PlayerMsgModel).getAtrributeByKey(key,heroAttr)["value"];
							this.lb_hit_rate.text =  value/100 + "%";
							break;
					case "dodge":
							var key = ConstAttributeArray.indexOf(attrName);
							var value = (PlayerMsgModel.getInstance() as PlayerMsgModel).getAtrributeByKey(key,heroAttr)["value"];
							this.lb_dodge.text =  value/100 + "%";
							break;
					case "damage_deepen":
							var key = ConstAttributeArray.indexOf(attrName);
							var value = (PlayerMsgModel.getInstance() as PlayerMsgModel).getAtrributeByKey(key,heroAttr)["value"];
							this.lb_damage_deepen.text =  value/100 + "%";
							break;
					case "damage_reduction":
							var key = ConstAttributeArray.indexOf(attrName);
							var value = (PlayerMsgModel.getInstance() as PlayerMsgModel).getAtrributeByKey(key,heroAttr)["value"];
							this.lb_damage_reduction.text =  value/100 + "%";
							break;
					case "paralysis":
							var key = ConstAttributeArray.indexOf(attrName);
							var value = (PlayerMsgModel.getInstance() as PlayerMsgModel).getAtrributeByKey(key,heroAttr)["value"];
							this.lb_paralysis.text =  value/100 + "%";
							break;
					case "damage_offset_rate":
							var key = ConstAttributeArray.indexOf(attrName);
							var value = (PlayerMsgModel.getInstance() as PlayerMsgModel).getAtrributeByKey(key,heroAttr)["value"];
							this.lb_damage_offset_rate.text =  value/100 + "%";
							break;
					default:
							break;
					
				}
			}
		
		}
		/**
		 * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
		 */
		public clear(data: any = null): void {
			super.clear(data);

		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
			
		}
		
	}
}
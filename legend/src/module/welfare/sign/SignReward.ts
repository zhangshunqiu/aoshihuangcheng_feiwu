/**
 * Author: yangyipeng
 * Email： 506977655@qq.com
 * 签到额外奖励view界面 2017/11/20.
 */
module game {
	export class SignReward extends eui.Component{

		private img_item:eui.Image;
		private img_bg:eui.Image;
		private img_state:eui.Image;
		private lb_day:eui.Label;
		private lb_num:eui.Label;

		private _movieClip:EffectMovieClip;
		private _rewardData;//服务端数据
		private _itemData;//表中数据
		private _num:number;

		public constructor(itemData,num) {
			super();
			this._num = num;
			this._itemData = itemData;
			this.skinName = SignRewardSkin;
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.removeSelf,this);
			this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.rewardTouch,this);
		}

		public getDay():void
		{
			return this._rewardData.day;
		}

		public set rewardData(rewardData)
		{
			this._rewardData = rewardData;
		}

		public showRewardUi():void
		{	
			
			this.showItem();
			this.showDay();

			switch(this._rewardData.state)
			{	
				//（0不能领， 1可领取 2已领取）
				case 0:
						this.img_state.visible = false;
						
					 break;
				case 1:	
						this.img_state.visible = false;
						if(this._movieClip==null)
						{
							this._movieClip = new EffectMovieClip();
							// this._movieClip.frameRate = 1;
							this._movieClip.x = this.width / 2;
							this._movieClip.y = this.height /3 ;
							this._movieClip.scaleX = 1;
							this._movieClip.scaleY = 1;
							this._movieClip.playMCKey("efficonyuan","",-1);
							this.addChild(this._movieClip);
						}
						break;
				case 2:	
						this.img_state.visible = true;
						if(this._movieClip)
						{
							this._movieClip.parent.removeChild(this._movieClip);
							this._movieClip.destroy();
							this._movieClip = null;
						}
						break;
				default:
						break;
			}
		}

	
		private rewardTouch():void
		{	
	
			switch(this._rewardData.state)
			{
				case 0:
					 	console.log("不能领")
					 break;
				case 1:
						App.Socket.send(23004,{day:this._rewardData.day});
						break;
				case 2:
					 	console.log("已经领")
						break;
				default:
						break;
			}
		}

		/**
		 * 显示天数
		 */
		private showDay():void
		{
			this.lb_day.text = this._itemData["id"] + "天";
			this.lb_day.textColor = ConstSignRewardTextColor[this._num];
		}
		/**
		 * 显示物品图标
		 */
		private showItem():void
		{	
			
			var itemArr = this._itemData["extra"][0];
			this.lb_num.text = itemArr[2];//数量
			var type = itemArr[0];//类型
			var good_id = itemArr[1];//物品ID
			var info;
			switch (type) {
              
                case ClientType.BASE_ITEM: 
					info = App.ConfigManager.itemConfig()[good_id]; 
					// var source = RES.getRes(String(info.icon) + "_png");
					RES.getResAsync(String(info.icon) + "_png", (texture) => {
						this.img_item.source = texture;
					}, this);
					break;
                case ClientType.EQUIP: 
					info = App.ConfigManager.itemConfig()[good_id]; 
					var source = RES.getRes(String(info.icon) + "_png");
					break;
              
                default: 
					break;
            }
		}

		private removeSelf():void
		{
			this.removeEventListener(eui.UIEvent.CREATION_COMPLETE,this.showRewardUi,this);
			this.removeEventListener(egret.Event.REMOVED_FROM_STAGE,this.removeSelf,this);
			this.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.rewardTouch,this);
			
		}
	}
}
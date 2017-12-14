/**
 * Author: yangyipeng
 * Email： 506977655@qq.com
 * 签到物品view界面 2017/11/20.
 */
module game {
	export class SignItem extends eui.Component{

		private _vipArr:Array<string> = [null,null,"双","三","四"];

		private  img_hasSigned:eui.Image;
	    private  img_buqian:eui.Image;
		private  img_qian:eui.Image;
		private  img_vipBg:eui.Image;
		private  img_item:eui.Image;
		private  bitmap_vip1:eui.BitmapLabel;
		private  bitmap_vip2:eui.BitmapLabel;
		private  gp_vip:eui.Group;
		private  lb_num:eui.Label;
		
		private _signItemData:Object;//表中的数据
		private _status:string;
		private _movieClip:EffectMovieClip;

		public constructor(data) {
			super();
			this._signItemData = data;
			this.skinName = SignItemSkin;
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.removeSelf,this);
			this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.touchHandler,this);

		}

		public set status(status:string)
		{
			this._status = status;
		}
		
		public get status():string
		{
			return this._status;
		}

		protected childrencreated():void
		{
			super.childrenCreated();
		}
		
		/**
		 * 展示SignItem界面样式
		 */
		public showUi():void
		{	
			if(!this.img_item.source){
				this.getItemIcon();
			}
			this.showVip();
			this.lb_num.text = this._signItemData["reward"][0][2];//物品数量

			switch(this._status)
			{	
				//已经签到了的
				case ConstSignItemStatus.hasSigned:
						this.img_buqian.visible = false;
						this.img_qian.visible = false;
						this.img_hasSigned.visible = true;
						if(this._movieClip)
						{
							this._movieClip.parent.removeChild(this._movieClip);
							this._movieClip.destroy();
							this._movieClip = null;
						}
						
						break;
				//可以签到的
				case ConstSignItemStatus.canSign:
						this.img_buqian.visible = false;
						this.img_qian.visible = true;
						this.img_hasSigned.visible = false;
						if(SignManager.getInstance().canSign(this))
						{	
							if(this._movieClip == null){
								this._movieClip = new EffectMovieClip();
								this._movieClip.frameRate = 1;
								this._movieClip.x = this.width / 2;
								this._movieClip.scaleX = 1.4;
								this._movieClip.scaleY = 1.4;
								this._movieClip.y = this.height / 2;
								// this._movieClip.playMCKey("efficon","",-1);
								this._movieClip.playMCKey("efficon","",-1,null,this.mcCallBack,null,this);
								this.addChild(this._movieClip);
							}
						}

						break;
				//补签的
				case ConstSignItemStatus.reSign:
						this.img_qian.visible = false;
						// this.img_buqian.visible = true;
						if(SignManager.getInstance().showResignIcon(this))
						{
							this.img_buqian.visible = true;
						}else{
							this.img_buqian.visible = false;
						}
						this.img_hasSigned.visible = false;
						break;
				//还不能签到的
				case ConstSignItemStatus.notSign:
						this.img_buqian.visible = false;
						this.img_qian.visible = false;
						this.img_hasSigned.visible = false;
						break;
				default:
						break;
			}
		}

		private mcCallBack():void
		{
			if(this._movieClip)
			{
				this._movieClip.frameRate = 8;
			}
		}	

		private touchHandler():void
		{
			switch(this._status)
			{
				case ConstSignItemStatus.hasSigned:
						//查看物品信息
						this.showItem();
						break;
				case ConstSignItemStatus.canSign:
						//弹签到框
						if(SignManager.getInstance().canSign(this))
						{
							this.toSign();
						}else{
							App.GlobalTips.showTips("请先领取上一个奖励");
						}
						break;
				case ConstSignItemStatus.reSign:
						//弹补签提示框
						if(SignManager.getInstance().canResign(this))
						{
							this.toResign();
						}else{
							if(this.img_buqian.visible == true)
							{
								App.GlobalTips.showTips("请先领取上一个奖励");
							}else{
								//查看物品信息
								this.showItem();
							}
						}
						break;
				case ConstSignItemStatus.notSign:
						//查看物品信息
						this.showItem();
						break;
				default:
						break;
			}
		}


		/**
		 * 显示vip等级
		 */
		private showVip():void
		{	
			this.gp_vip.visible = false;
			var vipLv:number = this._signItemData["vip"];
			if(vipLv<=0)
			{
				this.gp_vip.visible = false;
			}else
			{
				this.gp_vip.visible = true;
				this.bitmap_vip1.text = vipLv + "";
				this.bitmap_vip2.text = this._vipArr[this._signItemData["multiple"]];
			}
		}

		/**
		 * 显示物品图标
		 */
		private getItemIcon():void
		{	
			var itemArr = this._signItemData["reward"][0];
			var type = itemArr[0];
			var good_id = itemArr[1];
			var num = itemArr[2];
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
              
                default: break;
            }
		}

		/**
		 * 签到
		 */
		private toSign():void
		{	
				
			if(App.RoleManager.roleInfo.vipLv < this._signItemData["vip"])
			{	
				//弹vip充值框
				var view = new SignVipPrompt(this._signItemData,23002);
				PopUpManager.addPopUp({obj:view});
				
			}else{
				App.Socket.send(23002,{});
			}
		}

		/**
		 * 补签
		 */
		private toResign():void
		{	
				let okCB = function (selected) {
					if(App.RoleManager.roleInfo.vipLv < this._signItemData["vip"])
					{	
						//弹vip充值框
						var view = new SignVipPrompt(this._signItemData,23003);
						PopUpManager.addPopUp({obj:view});
					}else{
						App.Socket.send(23003,{});
					}
				}
				let cancelCB = function () {
					// console.log("cancellll");
				}
				var costMoney:Object = ConfigManager.getInstance().getConstConfigByType("SIGN_MONEY");
				let textFlow = [{ text:"是否花费" ,style: { textColor: 0xeb0601 }},{text:costMoney["value"] + "元宝",style: { textColor: 0xffd800 }},
				{text: "补签",style: { textColor: 0xeb0601 }}]
				App.GlobalTips.showAlert({ style: BaseTipsStyle.COMMON, textFlow: textFlow, okCB: okCB, cancelCB: cancelCB, context: this, needCheckBox: false });
		}
		/**
		 * 显示物品详细信息
		 */
		private showItem():void
		{	
			var rewardArr:Array<any> = this._signItemData["reward"][0];
			var type:number =rewardArr[0];
			var good_id:number = rewardArr[1];
			App.GlobalTips.showItemTips(type,good_id,null);
		}

		private removeSelf():void
		{
			if(this._movieClip)
			{	
				this._movieClip.destroy()
				this.removeChild(this._movieClip)
			}
			this.removeEventListener(egret.Event.REMOVED_FROM_STAGE,this.removeSelf,this);
			this.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.touchHandler,this);
			this.removeEventListener(eui.UIEvent.CREATION_COMPLETE,this.showUi,this);
		}
	}
}
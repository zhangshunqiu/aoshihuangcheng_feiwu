/**
 * Author: yangyipeng                                   
 * 首冲模块视图窗口 2017/06/20.
 */
module game {
	export class FirstRechargeView extends BaseView{
		
		public gp_rewardBtn:eui.Button;
		public img_close:eui.Image;
		public img_return:eui.Image;
		// public lb_bottom:eui.Label;
		public lb_artifact:eui.Label;
		// public lb_multiple:eui.Label;
		public list_charge:eui.List;
		public gp_reward:eui.Group;
		public gp_charge:eui.Group;


		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
		}

		/**
		 * 创建皮肤（初始化调用一次）
		 */
		public childrenCreated() {
			super.childrenCreated();
			this.list_charge.itemRenderer = FirstRechargeListItem;
			this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeWin,this);
			this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeWin,this);
			this.gp_rewardBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.handlerGetReward,this);
		}

		private handlerGetReward():void
		{
			App.Socket.send(28001,{});
		}
		
		/**
		 * 打开窗口(每次打开App.WinManager.openWin(WinName.BACKPACK);都会调用)
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			this.initView();
		}

		public closeWin():void
		{
			WinManager.getInstance().closeWin(this.winVo.winName);
		}

		private initView():void
		{
			var chargeConfig = ConfigManager.getInstance().getFirstChargeInfo()["1"];

			//首冲大礼包
			var chargeRewardArr:Array<any>= chargeConfig.reward;
			for(var i:number=0;i<chargeRewardArr.length;i++)
			{	
				(function(i,gp_reward){
					var type = chargeRewardArr[i][0];
					var good_id = chargeRewardArr[i][1];
					var num = chargeRewardArr[i][2];
					var baseItem:customui.BaseItem = new customui.BaseItem();
					baseItem.lb_name.visible = true;
					baseItem.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
						App.GlobalTips.showItemTips(type,good_id,null);
					},this)
					baseItem.updateBaseItem(type,good_id,num);
					baseItem.lb_name.textColor = 0xFA8100;
					gp_reward.addChild(baseItem);
					// console.log(this);//这个this是window
				})(i,this.gp_reward)
			}
			//战力暴涨多少
			this.lb_artifact.text = chargeConfig.grade;
			
			//根据传入参数判断显示逻辑
			if(this.openData)
			{	//1已充未领奖励
				this.gp_rewardBtn.visible = true;
				this.list_charge.visible = false;
				this.gp_charge.visible = false;
			}else{
				//0未首充 1已充未领奖励
				this.gp_rewardBtn.visible = false;
				this.list_charge.visible = true;
				this.gp_charge.visible = true;
				//首冲多少人民币对应奖励元宝
				var chargeArr:Array<number> = chargeConfig.charge_list;
				this.list_charge.dataProvider = new eui.ArrayCollection(chargeArr);
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
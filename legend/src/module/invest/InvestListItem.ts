/**
* Author: yangyipeng
* 投资ListItem视图层 2017/06/20.
*/
module game {
	export class InvestListItem extends eui.ItemRenderer{

		private lb_baseItem:customui.BaseItem;
		private lb_level:eui.Label;
		private lb_money:eui.Label;
		// private lb_cannotGet:eui.Label;
		// private lb_isGet:eui.Label;
		private img_get:eui.Image;
		private btn_worShip:eui.Button;
		private gp_cannot:eui.Group;
		private lb_num:eui.Label;

		private _rewardId:number;//是投资表里面的ID；
		public constructor() {
			super();
			this.skinName = "InvestListItemSkin";
			this.btn_worShip.addEventListener(egret.TouchEvent.TOUCH_TAP,this.getReward,this);
		}

		private getReward():void
		{
			if((InvestModel.getInstance() as InvestModel).isBuy) {
				App.Socket.send(34003,{id:this._rewardId});
			}else {
				App.GlobalTips.showTips("请先购买投资后领取奖励");
			}
		}

		protected dataChanged():void
		{	
			var curLv:number = RoleManager.getInstance().roleInfo.lv;
			var curTurn:number = RoleManager.getInstance().roleInfo.turn;
			this._rewardId = this.data.id;
			if(this.data.level)
			{
				this.lb_level.text = "等级达到" + this.data.level +"级可领取";
			}
			if(this.data.turn)
			{
				this.lb_level.text = "等级达到" + this.data.turn +"转可领取";
			}
			this.lb_money.text = "可领取" + this.data.gold +"元宝";
			this.lb_num.text =  this.data.gold;
			if(this.data.get)
			{	//已经领取
				this.img_get.visible = true;
				this.btn_worShip.visible = false;
				this.gp_cannot.visible = false;
			}else
			{	
				//判断level是否 达到领取level
				if(this.data.level)
				{
					if(curLv >= this.data.level)
					{	//可以领取
						this.img_get.visible = false;
						this.btn_worShip.visible = true;
						this.gp_cannot.visible = false;
					}else{
						//没达到等级（未达标）
						this.img_get.visible = false;
						this.btn_worShip.visible = false;
						this.gp_cannot.visible = true;
					}
				}
				//判断turn是否 达到领取turn
				if(this.data.turn)
				{
					if(curTurn >= this.data.turn)
					{	//可以领取
						this.img_get.visible = false;
						this.btn_worShip.visible = true;
						this.gp_cannot.visible = false;
					}else{
						//没达到等级（未达标）
						this.img_get.visible = false;
						this.btn_worShip.visible = false;
						this.gp_cannot.visible = true;
					}
				}
			}
		}
	}
}
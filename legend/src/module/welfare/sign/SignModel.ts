/**
 * Author: yangyipeng
 * Email： hersletter@qq.com
 * 签到数据层逻辑 2017/06/20.
 */
module game {
	export class SignModel extends BaseModel{

		private _itemsArr:eui.ArrayCollection = new eui.ArrayCollection([]);
		private _signDays:number;//已签到天数
		private _canSignDays:number;//可以签到天数
		private _rewardStatus:Array<any>=[{day:1,state:2},{day:1,state:2},{day:1,state:2},{day:1,state:2},{day:1,state:2}];//额外奖励
		private _hasData:boolean = false;//是否有数据，没有请求

		public constructor() {
			super();
		}

		public get signItemArr() {
			return this._itemsArr;
		}
		public get signDays():number
		{
			return this._signDays;
		}
		public get canSignDays():number
		{
			return this._canSignDays;
		}
		public get reward():Array<any>
		{
			return this._rewardStatus;
		}

		public get hasData():boolean
		{
			return this._hasData;
		}


		/**
		 * 拿到签到界面数据
		 * 
		 */
		public setSignViewData(data):void
		{	
			this._hasData = true;
			this._rewardStatus = data.extreward_list;
			
			var signConfigArr = [];
			for(var m:number = 1;m<=30;m++) {
				var signItemConfig = ConfigManager.getInstance().getSignInfoById(m);
				signConfigArr.push(signItemConfig);
			}
			this._signDays = data.signed_num;

			var hasSignDays:number = data.signed_num;
			var canSignDays:number = data.can_sign_num;
			var leftDays:number = 30 - hasSignDays - canSignDays;
			// var reSignDays:number = data.fix_num;
			// var leftDays:number = 30 - hasSignDays - canSignDays - reSignDays;
			var signItemArr = [];
			for(var i:number=0;i<hasSignDays;i++) {
				var signItemVo:SignItemVo = new SignItemVo();
				signItemVo.status = ConstSignItemStatus.hasSigned;
				signItemVo.signConfig = signConfigArr.shift();
				signItemArr.push(signItemVo);
			}
			for(var j:number =0;j<canSignDays;j++) {
				if(j ==0)
				{
					var signItemVo:SignItemVo = new SignItemVo();
					signItemVo.status = ConstSignItemStatus.canSign;
					signItemVo.signConfig = signConfigArr.shift();
					signItemVo.canSign = true;
				}else {
					var signItemVo:SignItemVo = new SignItemVo();
					signItemVo.signConfig = signConfigArr.shift();
					signItemVo.status = ConstSignItemStatus.canSign;
				}
				signItemArr.push(signItemVo);
			}
			for(var l:number =0;l<leftDays;l++) {
				var signItemVo:SignItemVo = new SignItemVo();
				signItemVo.signConfig = signConfigArr.shift();
				signItemVo.status = ConstSignItemStatus.notSign;
				signItemArr.push(signItemVo);
			}
			this._itemsArr = new eui.ArrayCollection(signItemArr);
		
		}

		/**
		 * 是否有签到奖励(处理红点的)
		 */
		public hasSignReward():boolean{
			for(var i:number = 0;i<this._rewardStatus.length;i++){
				var v:any = this._rewardStatus[i];
				if(v.state == 1){
					return true;
				}
			}
			if(this._canSignDays > 0){
				return true;
			}
			return false;
		}

		/**
		 * 清理
		 */
		public clear() {
			super.clear();
		}

		/**
		 * 销毁
		 */
		public destroy() {
			super.destroy();
			//销毁处理
		}

	
	}
}
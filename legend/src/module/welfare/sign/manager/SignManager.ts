module game {
	export class SignManager{

		private static _instance:SignManager;
		// private _signView:SignView;
		private _itemGroup:eui.Group;
		public constructor() {
		}
		public static getInstance():SignManager
		{
			if(this._instance == null)
			{
				this._instance = new SignManager();
			}
			return this._instance;
		}

		public set itemGroup(itemGroup:eui.Group)
		{
			this._itemGroup = itemGroup;
		}

		public clear():void
		{	
			this._itemGroup = null;
		}

		/**
		 * 是否可以签到
		 */
		public canSign(signItem:SignItem):boolean
		{
			if(this._itemGroup)
			{
				var index:number =  this._itemGroup.getChildIndex(signItem);
				if(index -1<0)
				{	
					//表明它是第一个
					return true;
				}
				var backSignItem:SignItem = this._itemGroup.getChildAt(index - 1) as SignItem;
			
				if(backSignItem.status === ConstSignItemStatus.canSign){
					return false;
				}else{
					return true;
				}
			}
		}
		/**
		 * 是否可以补签
		 */
		public canResign(signItem:SignItem):boolean
		{
			if(this._itemGroup)
			{
				var index:number =  this._itemGroup.getChildIndex(signItem);
				if(index -1<0)
				{	
					//表明它是第一个
					return true;
				}
				var backSignItem:SignItem = this._itemGroup.getChildAt(index - 1) as SignItem;
			
				if(backSignItem.status === ConstSignItemStatus.reSign||backSignItem.status === ConstSignItemStatus.canSign){
					return false;
				}else{
					return true;
				}
			}
		}

		/**
		 * 是否可以显示补签图标
		 */
		public showResignIcon(signItem:SignItem):boolean
		{	
			if(this._itemGroup)
			{
				var index:number =  this._itemGroup.getChildIndex(signItem);
				if(index -1 <0)
				{	
					//表明它是第一个
					return true;
				}
				var frontSignItem:SignItem = this._itemGroup.getChildAt(index -1) as SignItem;
				if(frontSignItem.status === ConstSignItemStatus.reSign){
					return false;
				}else{
					return true;
				}
				
			}
		}
	}
}
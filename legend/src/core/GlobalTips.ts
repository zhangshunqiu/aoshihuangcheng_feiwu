/**
 * Author: zhangshunqiu zrj
 * Email： 21102585@qq.com
 * 提示信息管理器
 * 
 * 说明：
 *  App.GlobalTips.showTips(); 中间文字提示
 * 	App.GlobalTips.showErrCodeTips(); 错误码返回提示
 * 	App.GlobalTips.showBroadcastTips(); 系统广播提示
 * 	App.GlobalTips.showAlert();         提示窗口提示
 * 	App.GlobalTips.showItemTips();      物品提示
 */
class GlobalTips {
	private _eventSystem:EventSystem;
	//文字提示相关
	private _textTipsItemList:Array<TextTipsItem>;
	private _textTipsQueue:Array<any>;
	private _textTipWinEvent:WinManagerEvent;
	private _maxTextTipNum:number = 10;
	private _maxTextTipQueueNum:number = 20;
	private _textTipsItemCache:Array<TextTipsItem>=[];

	//private _itemTipsList:Array<any>;

	//广播消息提示信息
	private _broadcastQueue:Array<any>;//广播消息队列

	private static _instance:GlobalTips;
	public static getInstance():GlobalTips {
        if(this._instance == null){
			this._instance = new GlobalTips();
		}
        return this._instance;
    }
	
	public constructor() {
		this._eventSystem = EventSystem.getInstance();
		this._textTipWinEvent = new WinManagerEvent(new WinManagerVO("", "", WinLay.EFFECT_LAY),null);
		this._textTipsQueue = [];
		this._textTipsItemList = [];
		this._broadcastQueue = [];
		//this._itemTipsList = [];
	}

	/**
	 * 清理
	 */
	public clear(){
		this._textTipsItemCache = [];
		this._textTipsQueue = [];
		for(var i:number = 0;i<this._textTipsItemList.length;i++){
			var item:TextTipsItem = this._textTipsItemList[i];
			item.destroy();
			if(item.parent){
				item.parent.removeChild(item);
			}
		}
		this._textTipsItemList = [];

		this._broadcastQueue = [];
		App.WinManager.closeWin(WinName.BROADCAST);

	}

	/**
	 * 错误码文字提示信息
	 */
	public showErrCodeTips(errorCode:number,suffixTips?: string){
		this.showTips(App.ConfigManager.getErrInfoById(errorCode).des + (suffixTips ? suffixTips : ""));
	}
	/**
	 * 中间的文字提示信息
	 */
	public showTips(data:any){
		if(this._textTipsItemList.length > this._maxTextTipNum ){
			if(this._textTipsQueue.length < this._maxTextTipQueueNum){
				this._textTipsQueue.push(data);
			}
			return;
		}
		var item:TextTipsItem;
		if(this._textTipsItemCache.length >0){
			item = this._textTipsItemCache.pop();
		}else{
			item = new TextTipsItem();
		}
		item.init(data);
		this._textTipsItemList.push(item);
		item.x = App.stageWidth / 2;
		item.y = App.stageHeight / 2;
		this._textTipWinEvent.setView(item);
		this._eventSystem.dispatchEvent(WinManagerEvent.WIN_ADD, this._textTipWinEvent);
		if (this._textTipsItemList.length > 1) { //有多个 
			for(var i:number = 0;i<this._textTipsItemList.length;i++){
				var view:TextTipsItem = this._textTipsItemList[i];
				egret.Tween.removeTweens(view);
				let offset = App.stageHeight / 2 - (this._textTipsItemList.length-i) * 52-40;
				egret.Tween.get(view).to({ y: offset }, 300);
				//egret.Tween.get(view).to({ y: offset }, 300).wait(500).call(this.removeTips, this);
			}
		}else{
			let offset = App.stageHeight / 2 - 52-40;
			egret.Tween.get(item).to({ y: offset }, 300);
		}
	}
	/**
	 * 移除文字提示
	 */
	public removeTips(){
		if(this._textTipsItemList.length >0){
			var item:TextTipsItem = this._textTipsItemList.shift();
			if(item.parent){
				item.parent.removeChild(item);
			}
			this._textTipsItemCache.push(item);
			// this._textTipWinEvent.setView(this._textTipsItemList.shift());
			// this._eventSystem.dispatchEvent(WinManagerEvent.WIN_REMOVE, this._textTipWinEvent);
		}
		if (this._textTipsItemList.length < 10) {
			for(let i=this._textTipsItemList.length; i<this._maxTextTipNum; i++) {
				if(this._textTipsQueue.length >0){
					this.showTips(this._textTipsQueue.shift());
				}
			}
		}

	}

	/**
	 * 物品提示面板
	 */
	public showItemTips(type: number, id: number, uuid: number){
		let view = undefined;
        switch (type) {
            case 1: {
                view = new game.ItemTip(id, uuid);
                break;
            }
            case 2: {
                App.WinManager.openWin(WinName.EQUIP, { type: 0, id: id, uuid: uuid });
                return;
            }

        }
        PopUpManager.addPopUp({ obj: view, effectType: 0 });
	}

	/**
	 * 物品获取途径提示面板
	 */
	public showItemWayTips(type: number, id: number){
		let view = new ItemWay(type, id);
		PopUpManager.addPopUp({ obj: view });
	}


	/**
	 * 提示面板
	 */
	public showAlert(params: any){
		let view = new BaseTips(params);
		PopUpManager.addPopUp({ obj: view });
	}


	/**
	 * 广播提示
	 */
	public showBroadcastTips(data:any = null){
		if(data){
			this._broadcastQueue.push(data);
			if(App.WinManager.isOpen(WinName.BROADCAST)){

			}else{
				App.WinManager.openWin(WinName.BROADCAST,this._broadcastQueue.shift());
			}
		}
	}
	/**
	 * 移除广播提示
	 */
	public removeBroadcastTips(){
		if(this._broadcastQueue.length > 0){
			App.WinManager.openWin(WinName.BROADCAST,this._broadcastQueue.shift());
		}else{
			App.WinManager.closeWin(WinName.BROADCAST);
		}
	}

}
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 按钮提示红点
 */
class BaseBtnTips extends egret.DisplayObjectContainer {
	private _bg:egret.Bitmap;
	private _label:egret.TextField;
	private _btnTipsType:number = 0;
	private _autoPosX:Boolean = false;
	private _timeOutId:number = 0;
	public constructor(type:number,parent:egret.DisplayObjectContainer,xx?:number,yy?:number) {
		super();
		this._btnTipsType = type;
		this.touchEnabled = false;
		parent.addChild(this);
		parent.setChildIndex(this,999);
		if(xx == undefined){
			this.x = parent.width - 10;
			this._autoPosX = true
		}else{
			this.x = xx;
			this._autoPosX = false;
		}
		if(yy == undefined){
			this.y =  10;
		}else{
			this.y = yy;
		}
		if(this._btnTipsType !=0){
			BtnTipManager.getInstance().setTypeItem(this._btnTipsType,this);
			// var data:any = BtnTipManager.getInstance().getTypeValue(this._btnTipsType)
			// if(data && data != 0){
			// 	this.show(data);
			// }else{
			// 	this.hide();
			// }
		}
		if(parent.width == 0 && this._autoPosX){
			this._timeOutId = egret.setTimeout(function () {
               if(this.parent){
					this.x = this.parent.width - 10;
				}
            }, this, 400)
		}
		if(this.hasEventListener(egret.Event.REMOVED_FROM_STAGE) == false){
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		}
	}
	private onRemoveFromStage(){
		this.close();
	}
	private loadComplete(event:any):void {
        this._bg.texture = <egret.Texture>event;
		this._bg.x = 0-this._bg.width/2;
		this._bg.y = 0-this._bg.height/2;
    }

	/**
	 * 显示
	 */
	public show(data:any = null){
		this.visible = true;
		if(this._bg == null){
			this._bg = new egret.Bitmap();
			this.addChild(this._bg);
			this._bg.touchEnabled = false;
			RES.getResAsync("com_redBg_png", this.loadComplete, this);
		}
		if(data && data != null){
			if(this._label == null){
				this._label = new egret.TextField();
				this._label.touchEnabled = false;
				this._label.size = 18;
				this.addChild(this._label);
			}
			if(typeof(data) == "string" || typeof(data) == "number"){
				this._label.text = String(data);
				this._label.x = 0-this._label.width/2;
				this._label.y = 0-this._label.height/2;
				this._label.visible = true;
			}else{
				if(this._label){
					this._label.visible = false;
				}
			}
			if(this._autoPosX && this.parent){
				this.x = this.parent.width - 10;
			}
		}else{
			if(this._label){
				this._label.visible = false;
			}
		}
	}
	/**
	 * 关闭
	 */
	public hide(){
		this.visible = false;
		if(this._timeOutId != 0){
			egret.clearTimeout(this._timeOutId);
			this._timeOutId = 0;
		}
	}
	/**
	 * 清理
	 */
	public close(){
		if(this._timeOutId != 0){
			egret.clearTimeout(this._timeOutId);
			this._timeOutId = 0;
		}
		BtnTipManager.getInstance().deleteTypeItem(this._btnTipsType);
	}
}
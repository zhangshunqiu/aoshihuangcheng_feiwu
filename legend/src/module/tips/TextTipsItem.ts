/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 文本提示
 */
class TextTipsItem extends egret.DisplayObjectContainer {
	private _bg:egret.Bitmap;
	private _label:egret.TextField;
	private _timeOutId:number = 0;
	private _bgWidth:number = 180;
	public constructor() {
		super();
		this._bg = new egret.Bitmap();
		this.addChild(this._bg);
		this._label = new egret.TextField();
		this.addChild(this._label);

		RES.getResAsync("common_bg_tips_png", this.loadComplete, this);
	}
	private loadComplete(event:any):void {
        this._bg.texture = <egret.Texture>event;
        //this.height = 50;
		//this._bg.$invalidate();
		this._bg.width = this._bgWidth;
		this._bg.scale9Grid = new egret.Rectangle(60, 15, 1, 1);
    }

	/**
	 * 初始化数据
	 */
	public init(data:any,color:number=null){
		if(data){
			if(typeof(data) == "string"){
				this._label.text = data;
			}else if(typeof(data) == "object"){
				this._label.textFlow = data;
			}
			if(color){
				this._label.textColor = color;
			}
			this._label.x = 0-this._label.width/2;
			this._label.y = 0-this._label.height/2
			this._bgWidth = Math.max(this._label.width +20,180) ;
			this._bg.width = this._bgWidth;
			this._bg.height = Math.min(this._label.height+20,50);
			this._bg.x = 0-this._bg.width/2;
			this._bg.y = 0-this._bg.height/2;
		}
		if(this._timeOutId !=0){
			egret.clearTimeout(this._timeOutId);
		}
		this._timeOutId = egret.setTimeout(this.destroy,this,1000);
		// this.x = App.stageWidth / 2;
		// this.y = App.stageHeight / 2;
	}


	public destroy(){
		egret.clearTimeout(this._timeOutId);
		GlobalTips.getInstance().removeTips();
	}

}
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 图标按钮 2017/09/20.
 */
class IconButton extends egret.DisplayObjectContainer {
	private _param:any;
	private _icon:egret.Bitmap;
	/**
	 * param 现在只有icon和id 以后加 {icon="ffff_png",id=12}
	 */
	public constructor(param:any) {
		super();
		this._param = param;
		this.touchEnabled = true;
		this.init(this._param);
	}

	private init(param:any){
		if(param && param.icon){
			if(this._icon == null){
				this._icon = new egret.Bitmap();
				this.addChild( this._icon);
				this._icon.cacheAsBitmap = true;
				//this._icon.x = -20;
				//this._icon.y = -20;
			}
			RES.getResAsync(param.icon,this.loadIconComplete,this);
		}
	}

	private loadIconComplete(event:any):void {
		var img: egret.Texture = <egret.Texture>event;
        if(img){
			this._icon.texture = img;
			//this._icon.x = 0-this._icon.width/2;
			//this._icon.y = 0-this._icon.height/2
		}
	}
	/**
	 * 获取按钮ID
	 */
	public getId():number{
		if(this._param && this._param.id){
			return this._param.id;
		}
		return null;
	}
	/**
	 * 清理
	 */
	public destroy(){
		//有动画就要清理
	}

}
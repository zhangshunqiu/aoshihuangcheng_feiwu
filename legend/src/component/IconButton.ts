/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 图标按钮 2017/09/20.
 */
class IconButton extends egret.DisplayObjectContainer {
	private _param:any;
	private _icon:egret.Bitmap;
	private _bg: egret.Bitmap;
	private _bgX: number;
	private _bgY: number;
	private _iconX: number;
	private _iconY: number;
	private OFFSET_XY: number = 0.02;
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
			if(this._bg == null){
				this._bg = new egret.Bitmap();
				this.addChild( this._bg);
				this._bg.visible = false;
				this._bg.cacheAsBitmap = true;
			}
			if(this._icon == null){
				this._icon = new egret.Bitmap();
				this.addChild( this._icon);
				this._icon.cacheAsBitmap = true;
				
				//this._icon.x = -20;
				//this._icon.y = -20;
			}
			RES.getResAsync(param.icon,this.loadIconComplete,this);
			RES.getResAsync("main_xuanzhongtexiao_png",this.loadBgComplete,this);
		}
	}

	private loadIconComplete(event:any):void {
		var img: egret.Texture = <egret.Texture>event;
        if(img){
			this._icon.texture = img;
			//this._icon.x = 0-this._icon.width/2;
			//this._icon.y = 0-this._icon.height/2
			this._bg.x = this._icon.width / 2;
			this._bg.y = this._icon.height / 2;
			this._iconX = this._icon.x;
			this._iconY = this._icon.y;
			this._bgX = this._bg.x;
			this._bgY = this._bg.y;
		}
	}

	private loadBgComplete(event:any):void {
		var img: egret.Texture = <egret.Texture>event;
        if(img){
			this._bg.texture = img;
			this._bg.anchorOffsetX = this._bg.width / 2;
			this._bg.anchorOffsetY = this._bg.height / 2;
			this._bg.x = this._icon.width / 2;
			this._bg.y = this._icon.height / 2;
			this._bgX = this._bg.x;
			this._bgY = this._bg.y;
			
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
	 * 获取图标
	 */
	public get icon() {
		return this._icon;
	}
	/**
	 * 获取图标背景
	 */
	public get bg() {
		return this._bg;
	}
	// /**
	//  * 设置图标位置
	//  * @param {number} x坐标(一个百分比)
	//  * @param {number} y坐标(一个百分比)
	//  */
	// public setIconPos(x: number, y: number) {
	// 	this._icon.x = this._iconX;
	// 	this._icon.y = this._iconY;
	// 	this._icon.x += x * this._icon.width;
	// 	this._icon.y += y * this._icon.height;
	// }
	// /**
	//  * 设置bg
	//  * @param {number} x坐标
	//  * @param {number} y坐标
	//  * @param {boolean} bg显隐
	//  */
	// public setBg(x: number, y: number, visible: boolean = false) {
	// 	this._bg.x = this._bgX;
	// 	this._bg.y = this._bgY;
	// 	this._bg.x += x * this._bg.width;
	// 	this._bg.y += y * this._bg.height;
	// 	this._bg.visible = visible;
	// }

	public setSelected(bool: boolean) {
		this._icon.x = this._iconX;
		this._icon.y = this._iconY;
		this._bg.x = this._bgX;
		this._bg.y = this._bgY;
		this._bg.visible = false;
		if (bool) {
			this._icon.x += this.OFFSET_XY * this._icon.width; 
			this._icon.y += this.OFFSET_XY * this._icon.height; 
			this._bg.x += this.OFFSET_XY * this._bg.width;
			this._bg.y += this.OFFSET_XY * this._bg.height;
			this._bg.visible = true;
		}
	}
	/**
	 * 清理
	 */
	public destroy(){
		//有动画就要清理
	}

}
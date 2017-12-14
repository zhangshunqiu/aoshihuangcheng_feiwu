/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 场景对象血条
 */
class SceneHpBar extends egret.DisplayObjectContainer {
	private _barBg:egret.Bitmap;
	private _bar:egret.Bitmap;
	private _barWidth:number;
	private _scaleBar:number;
	private _hpText:egret.TextField;
	public constructor(barWidth:number = 60,barurl:string ="sceneHpBar_png",bgurl:string="sceneHpBg_png") {
		super();
		this._barBg = new egret.Bitmap();
        this._barBg.texture = RES.getRes(bgurl);
        this.addChild(this._barBg);
		this._bar = new egret.Bitmap();
        this._bar.texture = RES.getRes(barurl);
        this.addChild(this._bar);
		this.setWidth(barWidth);
		this._barBg.y = 0-this._barBg.height/2;
		this._bar.y = 0-this._bar.height/2;

		if(this._hpText == null){
			this._hpText = new egret.TextField();
			this.addChild( this._hpText);
			//this._hpText.width = 150;
			this._hpText.height = 20;
			// this.nameText.width = 270;
			// this.nameText.height = 70;
			this._hpText.textColor = 0xffffff;
			this._hpText.textAlign = egret.HorizontalAlign.CENTER;
			//this._hpText.x = -75;
       		// this.nameText.verticalAlign = egret.VerticalAlign.MIDDLE;
			// this.nameText.strokeColor = 0x000000;
			// this.nameText.stroke = 1;
			//this.nameText.italic = true;
			this._hpText.size = 19;
			this._hpText.cacheAsBitmap = true;
			this._hpText.y = -28;
		}
	}
	

	public setWidth(value:number):void{
		if(this._barWidth != value){
			this._barWidth = value;
			this._barBg.scaleX = value/this._barBg.width;
			this._scaleBar = (value-2)/this._bar.width;
			
			this._barBg.x = 0-value/2;
			this._bar.x = this._barBg.x +1;
		}
	}

	public setValue(curValue:number,total:number):void{
		//this._bar.scaleX = Math.max(Math.min(curValue/total,1),0)*this._scaleBar;
		egret.Tween.get(this._bar).to( {scaleX:Math.max(Math.min(curValue/total,1),0)*this._scaleBar},200 , egret.Ease.sineOut );
		if(this._hpText){
			this._hpText.text = curValue+" / "+total;
			this._hpText.x = 0-this._hpText.width/2;
		}
	}
}
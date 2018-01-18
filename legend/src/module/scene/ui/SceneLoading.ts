/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 场景加载器 2017/06/20
 */
class SceneLoading extends egret.Sprite {
    private stageW:number = egret.MainContext.instance.stage.stageWidth;
    private stageH:number = egret.MainContext.instance.stage.stageHeight;
    private ww:number = 0;
    private hh:number = 0;

    private _textField:egret.TextField;
    private _bg:egret.Bitmap;
    public constructor() {
        super();
        this._bg = new egret.Bitmap();
        this.addChild(this._bg);
        this.createView();
        // RES.getResByUrl(ResUrlUtil.getLogoUrl(),this.logoLoadComplete,this,RES.ResourceItem.TYPE_IMAGE);
        RES.getResByUrl(ResUrlUtil.getLoadingBgUrl(),this.logoLoadComplete,this,RES.ResourceItem.TYPE_IMAGE); 
    }

    private logoLoadComplete(event:any):void {
        var img: egret.Texture = <egret.Texture>event;
        if(img){
            this._bg.texture = img;
            this.ww = this._bg.width;
            this.hh = this._bg.height;
            // this._bg.x = (this.stageW - this.ww)/2;
            this._bg.y = (this.stageH - this.hh)/2;
        }
    }

    private createView():void {
        this._textField = new egret.TextField();
        this.addChild(this._textField);
        //this.textField.x = 100;
        //this.textField.y = 0;
        this._textField.width = 480;
        this._textField.height = 100;
        this._textField.textAlign = "center";
        this._textField.size = 24;

        this._textField.x = (this.stageW - 480)/2;
        this._textField.y = (this.stageH -100)/2+ 240;
		this._textField.text = "场景加载中...   (0/0)";
    }

    public setProgress(current:number, total:number):void {
        this._textField.text = `场景加载中...  (${current}/${total})`;
    }
}
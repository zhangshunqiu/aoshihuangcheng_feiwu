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
    public constructor() {
        super();
        this.createView();
        RES.getResByUrl(ResUrlUtil.getLogoUrl(),this.logoLoadComplete,this)
    }

    private logoLoadComplete(event:any):void {
        var img: egret.Texture = <egret.Texture>event;
        var bitmap: egret.Bitmap = new egret.Bitmap(img);
        this.addChild(bitmap);
        this.ww = bitmap.width;
        this.hh = bitmap.height;
        bitmap.x = (this.stageW - this.ww)/2;
        bitmap.y = (this.stageH - this.hh)/2;
        //this.createView();
    }

    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    private textField:egret.TextField;

    private createView():void {
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        //this.textField.x = 100;
        //this.textField.y = 0;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";

        this.textField.x = (this.stageW - 480)/2;
        this.textField.y = (this.stageH)/2+200;
		this.textField.text = "场景加载中... 0/0";
    }

    public setProgress(current:number, total:number):void {
        this.textField.text = `场景加载中...${current}/${total}`;
    }
}
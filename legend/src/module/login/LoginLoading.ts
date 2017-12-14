/**
 * 登录加载中动画
 */
class LoginLoading extends egret.Sprite {
	private _loadingMc:AMovieClip;
	public constructor() {
		super();
		this.graphics.beginFill( 0x000000, 0.5);
        this.graphics.drawRect( 0, 0, App.stageWidth, App.stageHeight);
        this.graphics.endFill();

		if(this._loadingMc == null){
            this._loadingMc = new AMovieClip();
            this.addChild(this._loadingMc);
        }
        this._loadingMc.playMCKey("effloading");
        this._loadingMc.x = App.stageWidth/2;
        this._loadingMc.y = App.stageHeight/2;
	}

    /**
     * 销毁
     */
    public destroy() {
        if(this._loadingMc){
            this._loadingMc.destroy();
            if(this._loadingMc.parent){
                this._loadingMc.parent.removeChild(this._loadingMc);
            }
            this._loadingMc = null;
        }
    }
	

}
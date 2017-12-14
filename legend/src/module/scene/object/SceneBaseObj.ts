/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 场景显示对象基类 2017/06/20.
 */
class SceneBaseObj extends egret.DisplayObjectContainer {
	protected _sceneModel:SceneModel = SceneModel.getInstance();
	protected _objVo:any;
	protected shadow:egret.Bitmap; 

	protected bornEffMc:AMovieClip;//出生效果

	public constructor(objectVo:any = null) {
		super();
		this._objVo = objectVo;
	}

	/**
	 * 初始化
	 */
	public init(){
		
	}

	/**
	 * 播放出生效果效果
	 */
	protected playBornEff(bornEff:string=""){
		if(bornEff == ""){return};
		if(this.bornEffMc == null){
            this.bornEffMc = new AMovieClip();
			this.addChild(this.bornEffMc);
		}
		this.bornEffMc.playMCKey(bornEff,"",1);
		if(this.bornEffMc.hasEventListener(egret.Event.COMPLETE)== false){
			this.bornEffMc.addEventListener(egret.Event.COMPLETE, this.playBornEffComplete, this);
		}
	}
	//出生播放完成
	protected playBornEffComplete(e:egret.Event){
		if(this.bornEffMc){
			this.bornEffMc.removeEventListener(egret.Event.COMPLETE, this.playBornEffComplete, this);
			this.bornEffMc.destroy();
			if(this.bornEffMc.parent){
				this.bornEffMc.parent.removeChild(this.bornEffMc);
			}
			this.bornEffMc = null;
		}
	}


	protected showShadow(){
		if(this.shadow == null){
			this.shadow = new egret.Bitmap(RES.getRes("sceneObjShadow_png"));
			this.addChild(this.shadow);
		}else{
			this.shadow.texture = RES.getRes("sceneObjShadow_png");
		}
		this.shadow.x = 0-this.shadow.width/2;
		this.shadow.y = 0-this.shadow.height/2;
	}

	/**
	 * 更新位置
	 */
	public updatePosition(xx:number,yy:number){
		if(this.x == xx && this.y == yy){return;}
		xx = Math.min(this._sceneModel.sceneWidth,Math.max(0,xx));
		yy = Math.min(this._sceneModel.sceneHeight,Math.max(0,yy));
		this.x = xx;
		this.y = yy;
		this._objVo.posX = xx;
		this._objVo.posY = yy;
		var gx:number = Math.floor(xx/SceneModel.GRIDW);
		var gy:number = Math.floor(yy/SceneModel.GRIDH);
		if(gx == this._objVo.gridX && gy == this._objVo.gridY){
		}else{
			this.setGridPosition(gx,gy);
		}
	}

	/**
	 * 设置格子位置子类覆盖
	 */
	protected setGridPosition(gx:number,gy:number){
		this._objVo.gridX = gx;//Math.min(this._sceneModel.gridXNum-1,Math.max(0,gx));
		this._objVo.gridY = gy;//Math.min(this._sceneModel.gridYNum-1,Math.max(0,gy));
		if(this._sceneModel.curGridAlpha(this._objVo.gridX,this._objVo.gridY)){
			this.alpha = 0.7;
		}else{
			this.alpha = 1;
		}
	}

	/**
	 * 更新VO
	 */
	public updateVo(vo:any){
		this._objVo = vo;
	}

	/**
	 * 更新模型
	 */
	public updateAllModel(){
	
	}

	/**
	 * 设置VO
	 */
	public set vo(value:any) {
		this._objVo = value;
	}
	/**
	 * 获取VO
	 */
	public get vo():any {
		return this._objVo
	}
	
	/**
	 * 更新
	 */
	public update() {
		
	}
	/**
	 * 暂停
	 */
	public pause() {
		
	}
	/**
	 * 恢复暂停
	 */
	public resume() {
		
	}
	/**
	 * 销毁
	 */
	public destroy() {
		this.playBornEffComplete(null);
	}

}
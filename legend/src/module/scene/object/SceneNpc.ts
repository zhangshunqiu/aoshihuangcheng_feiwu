/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com  2017/6/20
 * 场景NPC对象
 */
class SceneNpc extends SceneBaseObj {
	public bodyMc:AMovieClip;
	public bodyUrl:string = "";
	protected nameText:egret.TextField;
	public constructor(objectVo:any) {
		super(objectVo);
	}

	/**
	 * 初始化
	 */
	public init(){
		this.showShadow();
		if(this.vo){
			this.updateBody(this.vo.bodyId,"");
			this.updateName(this.vo.name);
			this.x = this.vo.posX;
			this.y = this.vo.posY;
			this.setGridPosition(this.vo.gridX,this.vo.gridY);
		}
	}
	/**
	 * 更新VO
	 */
	public updateVo(vo:SceneNpcVo){
		this.vo = vo;
		this.init();
	}

	/**
	 * 设置格子位置
	 */
	protected setGridPosition(gx:number,gy:number){
		this._sceneModel.removeGridTablePos(this.vo);
		super.setGridPosition(gx,gy);
		this._sceneModel.addGridTablePos(this.vo);
	}

	/**
	  * 更新模型
	  */
	public updateBody(bodyUrl:string="",action:string="",scaleX:number = 1,times:number= -1):void{
		if(this.bodyMc == null){
            this.bodyMc = new AMovieClip();
			this.addChild(this.bodyMc);
		}
		this.bodyUrl = bodyUrl;
		this.bodyMc.playMCKey(bodyUrl,action,times);
		this.bodyMc.scaleX = scaleX;
	}
	/**
	  * 更新名称
	  */
	public updateName(text:string=""):void{
		if(this.nameText == null){
			this.nameText = new egret.TextField();
			this.addChild( this.nameText);
			// this.nameText.width = 270;
			// this.nameText.height = 70;
			this.nameText.textColor = 0xffffff;
			//this.nameText.textAlign = egret.HorizontalAlign.CENTER;
       		// this.nameText.verticalAlign = egret.VerticalAlign.MIDDLE;
			this.nameText.strokeColor = 0x000000;
			this.nameText.stroke = 1;
			//this.nameText.italic = true;
			this.nameText.size = 20;
			this.nameText.cacheAsBitmap = true;
		}
		this.nameText.text = this.vo.name;
		this.nameText.x = 0 - this.nameText.textWidth/2;
		this.nameText.y = 0 - this.nameText.textHeight/2-120;
	}

	/**
	 * 更新
	 */
	public update() {
		super.update();
	}
	/**
	 * 暂停
	 */
	public pause() {
		super.pause();
	}
	/**
	 * 恢复暂停
	 */
	public resume() {
		super.resume();
	}
	/**
	 * 销毁
	 */
	public destroy() {
		super.destroy();
	}

	/**
	 * 设置VO
	 */
	public set vo(value:SceneNpcVo) {
		this._objVo = value;
	}
	/**
	 * 获取VO
	 */
	public get vo():SceneNpcVo {
		return this._objVo
	}
}
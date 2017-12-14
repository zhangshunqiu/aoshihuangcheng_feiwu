/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com  2017/6/20
 * 场景技能效果
 */
class SceneSkillEff extends SceneBaseObj {
	public bodyMc:AMovieClip;
	public bodyUrl:string = "";
	public constructor(objectVo:any = null) {
		super(objectVo);
	}

	/**
	 * 初始化
	 */
	public init(){
		super.init();
		if(this.vo){
			this.updateBody(this.vo.bodyId,"");
			this.x = this.vo.posX;
			this.y = this.vo.posY;
			this.setGridPosition(this.vo.gridX,this.vo.gridY);
		}
	}

	/**
	 * 更新VO
	 */
	public updateVo(vo:SceneSkillEffVo){
		this.vo = vo;
		this.init();
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
	 * 更新
	 */
	public update() {
		super.update();
		if(this.vo.endTime < GlobalModel.getInstance().getTimer()){
		}
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
	 * 销毁 不要继承父类的
	 */
	public destroy() {
		super.destroy();
	}

	/**
	 * 设置VO
	 */
	public set vo(value:SceneSkillEffVo) {
		this._objVo = value;
	}
	/**
	 * 获取VO
	 */
	public get vo():SceneSkillEffVo {
		return this._objVo
	}
}
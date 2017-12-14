/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com  2017/6/20
 * 场景采集对象
 */
class SceneCollect extends SceneItem {
	public constructor(objectVo:any) {
		super(objectVo);
	}
	/**
	 * 初始化
	 */
	public init(){
		super.init();
	}

	/**
	 * 更新VO
	 */
	public updateVo(vo:SceneCollectVo){
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
	public updateBody(bodyUrl:string=""):void{
		if(this.bodyMc == null){
            this.bodyMc = new egret.Bitmap();
			this.addChild(this.bodyMc);
		}
		if(this.bodyUrl != bodyUrl){
			this.bodyUrl = bodyUrl;
			RES.getResAsync(bodyUrl,this.loadBodyComplete,this);
		}
	}
	public loadBodyComplete(data){
		this.bodyMc.texture = data;
        this.bodyMc.x = 0-this.bodyMc.width/2;
        this.bodyMc.y = 0-this.bodyMc.height/2;
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
			//this.nameText.size = 18;
			this.nameText.cacheAsBitmap = true;
		}
		this.nameText.text = this.vo.name;
		this.nameText.x = 0 - this.nameText.textWidth/2;
		//this.nameText.y = 0 - this.nameText.textHeight/2-40;

		this.nameText.italic = false;
		this.nameText.size = 20;
		this.nameText.y = 0 - this.nameText.textHeight/2 - 40;
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
	public set vo(value:SceneCollectVo) {
		this._objVo = value;
	}
	/**
	 * 获取VO
	 */
	public get vo():SceneCollectVo {
		return this._objVo
	}
}
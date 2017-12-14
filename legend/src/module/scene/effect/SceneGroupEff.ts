/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 群体技能效果 2017/10.
 * 用法：
 * var effVo:EffByTimeVo = new EffByTimeVo();
		effVo.atkPos = new point(this.x,this.y + 50);
		effVo.targetPos = new point(this.x+300,this.y + 50+100)
		App.EventSystem.dispatchEvent(SceneEventType.SHOW_GROUP_EFF,effVo)
 */
class SceneGroupEff extends BaseEff {
	protected vo:EffByTimeVo;
    private isComplete:boolean = false;
	public constructor(vo:EffByTimeVo) {
		super(vo);
		this.updateVo(vo);
	}

	/**
	 * 更新VO
	 */
	public updateVo(value:EffByTimeVo) {
        this.isComplete = false;
		this.vo = value;
		this.playMCKey(this.vo.effKey,"",1);
		this.x = this.vo.targetPos.x;
		this.y = this.vo.targetPos.y;
		//this.scaleX = this._dire.scale;
		// this.atkEffMc.addEventListener(egret.Event.COMPLETE, (e:egret.Event)=>{
		// 	}, this);

		if(this.hasEventListener(egret.Event.COMPLETE)== false){
			this.addEventListener(egret.Event.COMPLETE, this.playEffComplete, this);
		}
	}
	public playEffComplete(e:egret.Event){
		//App.logzsq("playEffComplete" )
		this.removeEventListener(egret.Event.COMPLETE, this.playEffComplete, this);
        this.isComplete = true;
	}


	/**
	 * 更新
	 */
	public update():boolean {
		if(this.vo.endTime < GlobalModel.getInstance().getTimer()){
			this.vo.callBackFun();
			return false;
		}
		return !this.isComplete;
	}

	/**
	 * 销毁
	 */
	public destroy() {
		this.removeEventListener(egret.Event.COMPLETE, this.playEffComplete, this);
		this.vo.destroy();
		super.destroy();
	}

}
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 飞行技能效果 2017/10.\
 * 用法：
 * var effVo:EffByPosVo = new EffByPosVo();
		effVo.atkPos = new point(this.x,this.y + 50);
		var ang:number = SceneUtil.getAngByDirect(this._dire.dire8);
		effVo.targetPos = new point(this.x-Math.cos(ang)*300,this.y + 50-Math.sin(ang)*300);
		if(Math.abs(effVo.targetPos.x - effVo.atkPos.x) < 20 && Math.abs(effVo.targetPos.y - effVo.atkPos.y) < 20){
			this.playGetHit();
		}else{
			App.EventSystem.dispatchEvent(SceneEventType.SHOW_FLY_EFF,effVo)
		}
 */ 
class SceneFlyEff extends BaseEff {
	protected vo:EffByPosVo;
	public constructor(vo:EffByPosVo) {
		super(vo);
		this.updateVo(vo);
	}

	/**
	 * 更新VO
	 */
	public updateVo(value:EffByPosVo) {
		this.vo = value;
		this.playMCKey(this.vo.effKey + this.vo.dire.dire,"");
		this.scaleX = this.vo.dire.scale;
		this.x = this.vo.atkPos.x;
		this.y = this.vo.atkPos.y;
		//var ang:number = 180 * Math.atan2(-this.y+this.vo.targetPos.y,-this.x+this.vo.targetPos.x) / Math.PI;
		//this.rotation = ang;
	}
	
	public playEffComplete(e:egret.Event){
		//this.removeEventListener(egret.Event.COMPLETE, this.playEffComplete, this);
	}


	/**
	 * 更新
	 */
	public update():boolean {
		if(Math.abs(this.vo.targetPos.x - this.x) < 20 && Math.abs(this.vo.targetPos.y - this.y) < 20){
			//this.destroy();
			this.vo.callBackFun();
			return false;
		}else{
			this.x = this.x+(this.vo.targetPos.x-this.x)/1.5;
			this.y = this.y+(this.vo.targetPos.y-this.y)/1.5;
		}
		return true;
	}

	/**
	 * 销毁
	 */
	public destroy() {
		super.destroy();
		this.vo.destroy();
	}

}
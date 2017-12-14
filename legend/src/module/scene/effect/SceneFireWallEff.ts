/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 火墙技能效果 2017/10.\
 */ 
class SceneFireWallEff extends BaseEff {
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
		this.playMCKey(this.vo.effKey,"",-1);
		this.x = this.vo.targetPos.x;
		this.y = this.vo.targetPos.y;
		//this.scaleX = this._dire.scale;
		// this.atkEffMc.addEventListener(egret.Event.COMPLETE, (e:egret.Event)=>{
		// 	}, this);
	}
	
	/**
	 * 更新
	 */
	public update():boolean {
		if(this.vo.endTime < GlobalModel.getInstance().getTimer()){
			this.vo.callBackFun();
			return false;
		}else{
			//根据火墙的位置产生伤害
		}
		return true;
	}

	/**
	 * 销毁
	 */
	public destroy() {
		this.vo.destroy();
		super.destroy();
	}

}
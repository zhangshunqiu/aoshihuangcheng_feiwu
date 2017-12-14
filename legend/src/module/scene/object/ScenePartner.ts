/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com  2017/6/20
 * 场景伙伴对象
 */
class ScenePartner extends ScenePlayer {
	public constructor(objectVo:any) {
		super(objectVo);
	}

		//更新移动次数和步长
	protected updateMoveStepTimes(pos:Array<number>,times:number,dire:DireScale){
		super.updateMoveStepTimes(pos,times,dire);
		// let sendData ={obj_type:this.vo.type,obj_id:this.vo.id,begin_x:Math.floor(this.vo.posX),begin_y:Math.floor(this.vo.posY),end_x:Math.floor(this.endPoint[0]),end_y:Math.floor(this.endPoint[1]),direction:this.vo.dire.dire8};
	   	// App.Socket.send(11002,sendData);
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
	public set vo(value:ScenePartnerVo) {
		this._objVo = value;
	}
	/**
	 * 获取VO
	 */
	public get vo():ScenePartnerVo {
		return this._objVo;
	}
}
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 场景宠物对象
 */
class ScenePet extends SceneMonster {
	public constructor(objectVo:any) {
		super(objectVo);
	}

	//更新移动次数和步长
	protected updateMoveStepTimes(pos:Array<number>,times:number,dire:DireScale){
		super.updateMoveStepTimes(pos,times,dire);
		// let sendData ={obj_type:this.vo.type,obj_id:this.vo.id,begin_x:Math.floor(this.x),begin_y:Math.floor(this.y),end_x:Math.floor(this.endPoint[0]),end_y:Math.floor(this.endPoint[1]),direction:this.vo.dire.dire8};
	   	// App.Socket.send(11002,sendData);
	}

	/**
	 * 设置VO
	 */
	public set vo(value:ScenePetVo) {
		this._objVo = value;
	}
	/**
	 * 获取VO
	 */
	public get vo():ScenePetVo {
		
		return this._objVo;
	}
}
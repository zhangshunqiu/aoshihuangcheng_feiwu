/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com  2017/6/20
 * 场景掉落物品的VO
 */
class SceneSkillEffVo extends BaseObjectVo {
	public endTime:number;
	public constructor() {
		super();
		this.type = SceneObjectType.SKILLEFF;
		//不需要使用格子坐标
		this.endTime = GlobalModel.getInstance().getTimer() +2000;
		
		//测试数据
		this.id = 9999;
		this.bodyId = "20041";
		this.posX = 400;
		this.posY = 400;
	}

	/**
	 * 清理
	 */
	public clear() {
		super.clear();
	}
}
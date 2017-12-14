/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com  2017/6/20
 * 场景搭档的VO
 */
class ScenePartnerVo extends ScenePlayerVo {
	public constructor() {
		super();
		this.type = SceneObjectType.PARTNER;
	}

	/**
	 * 清理
	 */
	public clear() {
		super.clear();
	}
}
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 场景显示对象基类 2017/09/20.
 */
class BaseEff extends AMovieClip {
	public constructor(objectVo:BaseEffVo = null) {
		super();
	}

     /**
	 * 获取ID
	 */
	public getId():number {
		return 0;
	}

    /**
	 * 更新VO
	 */
	public updateVo(value:BaseEffVo) {
		
	}
	
	/**
	 * 更新
	 */
	public update():boolean {
		return true
	}
	/**
	 * 暂停
	 */
	public pause() {
		
	}
	/**
	 * 恢复暂停
	 */
	public resume() {
		
	}
	/**
	 * 销毁
	 */
	public destroy() {
		super.destroy();
	}

}
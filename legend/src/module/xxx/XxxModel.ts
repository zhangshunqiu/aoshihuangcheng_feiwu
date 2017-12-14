/**
 * Author: zhangshunqiu                                      （必须加上，知道是谁做的）
 * Xxx模块模型 2017/06/20.
 */
class XxxModel extends BaseModel{  //model必须继承BaseModel
	public wingR:any = {};//说明要写
	private _heroVo:HeroVo;//说明要写，私有加下滑

	private _eventSystem:EventSystem = App.EventSystem;
	public constructor() { 
		super();
	}

	/**
	 * 英雄Vo
	 */
	public set heroVo(value:HeroVo) {
        this._heroVo = value;
    }
	/**
	 * 英雄Vo
	 */
	public get heroVo():HeroVo {
        return this._heroVo;
    }

	/**
	 * 更新其他数据
	 */
	public updateOther(data:any) {
		//处理更新数据
        this._eventSystem.dispatchEvent(PanelNotify.BOSS_CHALLENGE,{});
    }

	/**
	 *  获取其他数据
	 */
	public getOtherData(id:number):HeroVo {
		//处理获取数据
        return this._heroVo;
    }


	/**
	 * 清理
	 */
    public clear() {
        super.clear();
    }

    /**
     * 销毁
     */
    public destroy() {
        super.destroy();
        //销毁处理
    }

}
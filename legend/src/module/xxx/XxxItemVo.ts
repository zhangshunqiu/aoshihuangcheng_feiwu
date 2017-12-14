/**
 * Author: zhangshunqiu                                   
 * Xxx模块ItemVo 2017/06/20.
 */
class XxxItemVo {
	public wingR:any = {};//说明要写
	private _heroVo:HeroVo;//说明要写，私有加下滑线

	public constructor() {
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
    }

	/**
	 *  获取其他数据
	 */
	public getOtherData(id:number):HeroVo {
		//处理获取数据
        return this._heroVo;
    }


}
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com  2017/6/20
 * 时间效果VO
 */
class EffByTimeVo extends BaseEffVo{
    public beginTime:number = 0;//开始时间
    public endTime:number = 0;//结束时间
    public long:number = 0;//长度

	public constructor() {
        super();
        //this.effKey = "";
        this.endTime = GlobalModel.getInstance().getTimer() +2000;
	}

}
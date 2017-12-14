/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 效果VO基类 2017/10.
 */
class BaseEffVo {
    public static EFF_ID_ADD:number = 1; 
    public id:number;//id
    public effKey:string;//效果Key
    public atkVo:BaseObjectVo;//攻击者VO
    public targetVo:BaseObjectVo;//目标VO
    public atkPos:point;//攻击位置
    public targetPos:point;//目标位置
    public backFun:Function;//回掉函数
    public thisObject:any;//回掉函数对象
    public param:any;//参数
   // public direct:number = 0;
    public dire:DireScale;//方向
	public constructor() {
        BaseEffVo.EFF_ID_ADD++;
        this.id = BaseEffVo.EFF_ID_ADD;
	}

    public callBackFun(){
        if(this.backFun){
            if (this.param){
                this.backFun.call(this.thisObject,this.param);
            }else{
                this.backFun.call(this.thisObject);
            }
            this.thisObject = null;
            this.backFun = null;
        }  
    }

    public destroy(){
        if(this.backFun){
            this.thisObject = null;
            this.backFun = null;
            if(this.param){
                this.param = null;
            }
        }
        this.atkVo = null;
        this.targetVo = null;
    }
}
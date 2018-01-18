var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com  2017/6/20
 * 战斗buffVO
 */
var FBuffVo = (function () {
    function FBuffVo() {
        this.id = "0"; //唯一ID
        this.buffId = 0; //buffId
        this.bufftype = 0; //buff类型
        this.objId = 0; //目标对象ID
        this.objType = 0; //目标对象类型
        this.beginTime = 0; //开始时间
        this.endTime = 0; //结束时间
        this.effType = 7; //buff效果类型 见BuffEffType
        this.mcResId = "7160"; //效果资源ID
        FBuffVo.BUFFIDADD++;
        this.id = String(FBuffVo.BUFFIDADD);
        this.beginTime = GlobalModel.getInstance().getTimer();
        this.endTime = GlobalModel.getInstance().getTimer() + 100000;
    }
    /**
     * 初始化协议
     */
    FBuffVo.prototype.initProto = function (data) {
        this.buffId = data.buff_id;
        var config = App.ConfigManager.getBuffConfigById(this.buffId);
        if (config) {
            this.mcResId = config.effectbuffid;
            this.effType = config.effectid;
        }
        else {
            this.mcResId = "";
        }
    };
    // message pbHookBuff{
    // 		optional	int32	obj_type	=1;//对象类型
    // 		optional	int32	obj_id      =2;//对象id
    // 		optional    int32	buff_op		=3;//buff操作:1 添加,2 更新,3 删除
    // 		optional    int32   buff_id		=4;//buff_id
    // 		optional	int32   buff_time   =5;//倒计时
    // }
    /**
     * 是否移除
     */
    FBuffVo.prototype.isRemove = function (curTime) {
        if (curTime === void 0) { curTime = 0; }
        if (GlobalModel.getInstance().getTimer() <= this.endTime) {
            return false;
        }
        return true;
    };
    FBuffVo.BUFFIDADD = 1;
    return FBuffVo;
}());
__reflect(FBuffVo.prototype, "FBuffVo");
//# sourceMappingURL=FBuffVo.js.map
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 飞行技能效果 2017/10.\
 * 用法：
 * var effVo:EffByPosVo = new EffByPosVo();
        effVo.atkPos = new point(this.x,this.y + 50);
        var ang:number = SceneUtil.getAngByDirect(this._dire.dire8);
        effVo.targetPos = new point(this.x-Math.cos(ang)*300,this.y + 50-Math.sin(ang)*300);
        if(Math.abs(effVo.targetPos.x - effVo.atkPos.x) < 20 && Math.abs(effVo.targetPos.y - effVo.atkPos.y) < 20){
            this.playGetHit();
        }else{
            App.EventSystem.dispatchEvent(SceneEventType.SHOW_FLY_EFF,effVo)
        }
 */
var SceneFlyEff = (function (_super) {
    __extends(SceneFlyEff, _super);
    function SceneFlyEff(vo) {
        var _this = _super.call(this, vo) || this;
        _this.updateVo(vo);
        return _this;
    }
    /**
     * 更新VO
     */
    SceneFlyEff.prototype.updateVo = function (value) {
        this.vo = value;
        this.playMCKey(this.vo.effKey + this.vo.dire.dire, "");
        this.scaleX = this.vo.dire.scale;
        this.x = this.vo.atkPos.x;
        this.y = this.vo.atkPos.y;
        //var ang:number = 180 * Math.atan2(-this.y+this.vo.targetPos.y,-this.x+this.vo.targetPos.x) / Math.PI;
        //this.rotation = ang;
    };
    SceneFlyEff.prototype.playEffComplete = function (e) {
        //this.removeEventListener(egret.Event.COMPLETE, this.playEffComplete, this);
    };
    /**
     * 更新
     */
    SceneFlyEff.prototype.update = function () {
        if (Math.abs(this.vo.targetPos.x - this.x) < 20 && Math.abs(this.vo.targetPos.y - this.y) < 20) {
            //this.destroy();
            this.vo.callBackFun();
            return false;
        }
        else {
            this.x = this.x + (this.vo.targetPos.x - this.x) / 2.5;
            this.y = this.y + (this.vo.targetPos.y - this.y) / 2.5;
        }
        return true;
    };
    /**
     * 销毁
     */
    SceneFlyEff.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.vo.destroy();
    };
    return SceneFlyEff;
}(BaseEff));
__reflect(SceneFlyEff.prototype, "SceneFlyEff");
//# sourceMappingURL=SceneFlyEff.js.map
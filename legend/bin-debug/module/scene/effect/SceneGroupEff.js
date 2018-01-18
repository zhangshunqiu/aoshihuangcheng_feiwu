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
 * 群体技能效果 2017/10.
 * 用法：
 * var effVo:EffByTimeVo = new EffByTimeVo();
        effVo.atkPos = new point(this.x,this.y + 50);
        effVo.targetPos = new point(this.x+300,this.y + 50+100)
        App.EventSystem.dispatchEvent(SceneEventType.SHOW_GROUP_EFF,effVo)
 */
var SceneGroupEff = (function (_super) {
    __extends(SceneGroupEff, _super);
    function SceneGroupEff(vo) {
        var _this = _super.call(this, vo) || this;
        _this.isComplete = false;
        _this.updateVo(vo);
        return _this;
    }
    /**
     * 更新VO
     */
    SceneGroupEff.prototype.updateVo = function (value) {
        this.isComplete = false;
        this.vo = value;
        this.playMCKey(this.vo.effKey, "", 1);
        this.x = this.vo.targetPos.x;
        this.y = this.vo.targetPos.y;
        //this.scaleX = this._dire.scale;
        // this.atkEffMc.addEventListener(egret.Event.COMPLETE, (e:egret.Event)=>{
        // 	}, this);
        if (this.hasEventListener(egret.Event.COMPLETE) == false) {
            this.addEventListener(egret.Event.COMPLETE, this.playEffComplete, this);
        }
    };
    SceneGroupEff.prototype.playEffComplete = function (e) {
        //App.logzsq("playEffComplete" )
        this.removeEventListener(egret.Event.COMPLETE, this.playEffComplete, this);
        this.isComplete = true;
    };
    /**
     * 更新
     */
    SceneGroupEff.prototype.update = function () {
        if (this.vo.endTime < GlobalModel.getInstance().getTimer()) {
            this.vo.callBackFun();
            return false;
        }
        return !this.isComplete;
    };
    /**
     * 销毁
     */
    SceneGroupEff.prototype.destroy = function () {
        this.removeEventListener(egret.Event.COMPLETE, this.playEffComplete, this);
        this.vo.destroy();
        _super.prototype.destroy.call(this);
    };
    return SceneGroupEff;
}(BaseEff));
__reflect(SceneGroupEff.prototype, "SceneGroupEff");
//# sourceMappingURL=SceneGroupEff.js.map
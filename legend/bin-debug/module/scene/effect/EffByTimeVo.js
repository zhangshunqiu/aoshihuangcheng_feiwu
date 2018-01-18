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
 * Email： 21102585@qq.com  2017/6/20
 * 时间效果VO
 */
var EffByTimeVo = (function (_super) {
    __extends(EffByTimeVo, _super);
    function EffByTimeVo() {
        var _this = _super.call(this) || this;
        _this.beginTime = 0; //开始时间
        _this.endTime = 0; //结束时间
        _this.long = 0; //长度
        //this.effKey = "";
        _this.endTime = GlobalModel.getInstance().getTimer() + 2000;
        return _this;
    }
    return EffByTimeVo;
}(BaseEffVo));
__reflect(EffByTimeVo.prototype, "EffByTimeVo");
//# sourceMappingURL=EffByTimeVo.js.map
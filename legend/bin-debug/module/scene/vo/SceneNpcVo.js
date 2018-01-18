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
 * 场景Npc的VO
 */
var SceneNpcVo = (function (_super) {
    __extends(SceneNpcVo, _super);
    function SceneNpcVo() {
        var _this = _super.call(this) || this;
        _this.type = SceneObjectType.NPC;
        //测试数据
        _this.bodyId = "110315";
        _this.gridX = SceneModel.getInstance().getRandomGX();
        _this.gridY = SceneModel.getInstance().getRandomGY();
        _this.posX = SceneUtil.gridToPixelX(_this.gridX);
        _this.posY = SceneUtil.gridToPixelY(_this.gridY);
        _this.id = 1266;
        _this.name = "我是NPC";
        return _this;
    }
    SceneNpcVo.prototype.initProto = function (obj) {
        this.id = obj["obj_id"];
        this.type = obj["obj_type"];
        this.modelId = obj["mon_id"];
        this.gridX = Math.min(SceneModel.getInstance().gridXNum, obj["begin_x"]); //SceneUtil.pixelToGridX(obj["begin_x"]);
        this.gridY = Math.min(SceneModel.getInstance().gridYNum, obj["begin_y"]); //SceneUtil.pixelToGridY(obj["begin_y"]);
        this.posX = SceneUtil.gridToPixelX(this.gridX);
        this.posY = SceneUtil.gridToPixelY(this.gridY);
    };
    /**
     * 清理
     */
    SceneNpcVo.prototype.clear = function () {
        _super.prototype.clear.call(this);
    };
    return SceneNpcVo;
}(BaseObjectVo));
__reflect(SceneNpcVo.prototype, "SceneNpcVo");
//# sourceMappingURL=SceneNpcVo.js.map
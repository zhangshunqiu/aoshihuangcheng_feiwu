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
 * 场景宠物Vo
 */
var ScenePetVo = (function (_super) {
    __extends(ScenePetVo, _super);
    function ScenePetVo() {
        var _this = _super.call(this) || this;
        _this.type = SceneObjectType.PET;
        return _this;
    }
    ScenePetVo.prototype.initProto = function (obj) {
        _super.prototype.initProto.call(this, obj);
        if (this.ownerId) {
            var owerVo = SceneModel.getInstance().getSceneObjectVo(this.ownerId, this.ownerType);
            //宠物需要通过所属英雄赋主英雄的值
            if (owerVo) {
                this.mainOwnerId = owerVo.ownerId;
                this.pkMode = owerVo.pkMode;
                var arr = SceneUtil.getRoundWalkGrid(owerVo.gridX, owerVo.gridY, 1);
                if (arr) {
                    this.gridX = arr[0];
                    this.gridY = arr[1];
                }
                else {
                    this.gridX = owerVo.gridX;
                    this.gridY = owerVo.gridY;
                }
                this.posX = SceneUtil.gridToPixelX(this.gridX);
                this.posY = SceneUtil.gridToPixelY(this.gridY);
            }
        }
    };
    return ScenePetVo;
}(SceneMonsterVo));
__reflect(ScenePetVo.prototype, "ScenePetVo");
//# sourceMappingURL=ScenePetVo.js.map
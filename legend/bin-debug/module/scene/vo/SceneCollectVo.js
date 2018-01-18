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
 * 场景采集物的VO
 */
var SceneCollectVo = (function (_super) {
    __extends(SceneCollectVo, _super);
    function SceneCollectVo() {
        var _this = _super.call(this) || this;
        _this.ownerType = 3; // 对象主人类型
        _this.ownerId = 3; // 对象主人id
        _this.type = SceneObjectType.COLLECT;
        //测试数据
        _this.bodyId = "testCollect_png";
        _this.gridX = SceneModel.getInstance().getRandomGX();
        _this.gridY = SceneModel.getInstance().getRandomGY();
        _this.posX = SceneUtil.gridToPixelX(_this.gridX);
        _this.posY = SceneUtil.gridToPixelY(_this.gridY);
        _this.id = 1243;
        _this.name = "采集物";
        return _this;
    }
    /**
     * 从协议里初始化
     */
    // optional	int32 obj_type		= 1;		//对象类型
    // optional	int32 obj_id		= 2;        //对象id
    // optional	int32 obj_owner_type = 3;		// 对象主人类型
    // optional	int32 obj_owner_id	= 4;		// 对象主人id
    // optional	int32 mon_id		= 5;		// 怪物模板id
    // optional	int32 cur_hp		= 6;		//对象当前血量
    // optional	int32 cur_mp		= 7;		//对象当前魔法
    // optional	int32 hp			= 8;		//血量
    // optional	int32 mp			= 9;		//魔法
    // optional 	int32 begin_x 		= 10;       // 起始点x
    // optional 	int32 begin_y 		= 11;		// 起始点y
    SceneCollectVo.prototype.initProto = function (obj) {
        this.id = obj["obj_id"];
        this.type = obj["obj_type"];
        this.ownerType = obj["obj_owner_type"];
        this.ownerId = obj["obj_owner_id"];
        this.modelId = obj["mon_id"];
        this.gridX = obj["begin_x"]; //SceneUtil.pixelToGridX(obj["begin_x"]);
        this.gridY = obj["begin_y"]; //SceneUtil.pixelToGridY(obj["begin_y"]);
        this.posX = SceneUtil.gridToPixelX(this.gridX);
        this.posY = SceneUtil.gridToPixelY(this.gridY);
    };
    /**
     * 清理
     */
    SceneCollectVo.prototype.clear = function () {
        _super.prototype.clear.call(this);
    };
    return SceneCollectVo;
}(SceneItemVo));
__reflect(SceneCollectVo.prototype, "SceneCollectVo");
//# sourceMappingURL=SceneCollectVo.js.map
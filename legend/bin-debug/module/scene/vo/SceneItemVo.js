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
 * 场景掉落物品的VO
 */
var SceneItemVo = (function (_super) {
    __extends(SceneItemVo, _super);
    function SceneItemVo() {
        var _this = _super.call(this) || this;
        _this.num = 0; //物品数量
        _this.ownerId = 0; //归属玩家id
        _this.timeOut = 0; //归属失效时间
        _this.monsterId = 0; //掉落怪物ID
        _this.type = SceneObjectType.ITEM;
        //测试数据
        //this.bodyId = "gold_png";
        _this.gridX = SceneModel.getInstance().getRandomGX();
        _this.gridY = SceneModel.getInstance().getRandomGY();
        _this.posX = SceneUtil.gridToPixelX(_this.gridX);
        _this.posY = SceneUtil.gridToPixelY(_this.gridY);
        _this.id = _this.objectId;
        return _this;
        //this.name = "金币"+this.id;
    }
    /**
     * 从协议里初始化
     */
    // optional	int32 obj_type		= 1;		//对象类型
    // optional	int32 obj_id		= 2;        //对象id
    // optional int32 goods_id		= 3;		//道具id
    // optional	int32  x			= 4;		//坐标x
    // optional	int32  y			= 5;		//坐标y
    // optional	int32 goods_num		= 6;		//物品数量
    // optional	int32 own_id		= 7;		//归属玩家id
    // optional	int32 time_out		= 8;		//归属失效时间
    SceneItemVo.prototype.initProto = function (obj) {
        this.id = obj["obj_id"];
        this.type = obj["obj_type"];
        this.modelId = obj["goods_id"];
        this.num = obj["goods_num"];
        this.ownerId = obj["own_id"];
        this.timeOut = obj["time_out"];
        this.monsterId = obj["obj_mon_id"];
        var goodsconf = App.ConfigManager.getItemInfoById(this.modelId);
        if (goodsconf) {
        }
        else {
            goodsconf = App.ConfigManager.getEquipConfigById(Number(this.modelId));
        }
        this.bodyId = goodsconf.icon;
        if (this.modelId == "101") {
            this.name = String(this.num);
        }
        else {
            this.name = goodsconf.name;
        }
        var selfVo = SceneModel.getInstance().getMonsterVo(this.monsterId);
        if (!selfVo) {
            selfVo = SceneModel.getInstance().getSelfPlayerVo();
        }
        if (selfVo) {
            var nPos = SceneUtil.getRoundWalkGrid(selfVo.gridX, selfVo.gridY, selfVo.dire.dire8);
            if (nPos) {
                this.gridX = nPos[0];
                this.gridY = nPos[1];
            }
            else {
                this.gridX = selfVo.gridX;
                this.gridY = selfVo.gridY;
            }
        }
        else {
            this.gridX = SceneModel.getInstance().getRandomGX();
            this.gridY = SceneModel.getInstance().getRandomGY();
        }
        // this.gridX = obj["x"]; 
        // this.gridY = obj["y"];//SceneUtil.pixelToGridY(obj["y"]);
        this.posX = SceneUtil.gridToPixelX(this.gridX);
        this.posY = SceneUtil.gridToPixelY(this.gridY);
    };
    /**
     * 清理
     */
    SceneItemVo.prototype.clear = function () {
        _super.prototype.clear.call(this);
    };
    return SceneItemVo;
}(BaseObjectVo));
__reflect(SceneItemVo.prototype, "SceneItemVo");
//# sourceMappingURL=SceneItemVo.js.map
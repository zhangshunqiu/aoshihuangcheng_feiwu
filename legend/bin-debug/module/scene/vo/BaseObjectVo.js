var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 场景对象VO基类 2017/09/20.
 */
var BaseObjectVo = (function () {
    function BaseObjectVo() {
        this._objectId = 0; //实例对象唯一ID，关联这个对象的场景管理中用，其他不要使用；
        this.gridX = 0; //X位置格子
        this.gridY = 0; //Y位置格子
        this.scaleParam = 1; //缩放大小参数
        BaseObjectVo.OBJECT_ID = BaseObjectVo.OBJECT_ID + 1;
        this._objectId = BaseObjectVo.OBJECT_ID;
    }
    Object.defineProperty(BaseObjectVo.prototype, "objectId", {
        /**
         * 实例对象唯一ID，关联这个对象的场景管理中用，其他不要使用，只能获取，不能外部改变
         */
        get: function () {
            return this._objectId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseObjectVo.prototype, "posX", {
        get: function () {
            return this._posX;
        },
        set: function (value) {
            this._posX = value;
            //this.gridX = Math.floor(value/64);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseObjectVo.prototype, "posY", {
        get: function () {
            return this._posY;
        },
        set: function (value) {
            this._posY = value;
            //this.gridY = Math.floor(value/64);
        },
        enumerable: true,
        configurable: true
    });
    // public updatePos(xx:number,yy:number){
    // 	this._posX = xx;
    // 	this._posY = yy;
    // 	var xg:number = Math.floor(xx/64);
    // 	var yg:number = Math.floor(yy/64);
    // 	if(xg != this.gridX || yg != this.gridY){
    // 		this.gridX = xg;
    // 		this.gridY = yg;
    // 	}
    // }
    /**
     * 清理
     */
    BaseObjectVo.prototype.clear = function () {
    };
    BaseObjectVo.OBJECT_ID = 0;
    return BaseObjectVo;
}());
__reflect(BaseObjectVo.prototype, "BaseObjectVo");
//# sourceMappingURL=BaseObjectVo.js.map
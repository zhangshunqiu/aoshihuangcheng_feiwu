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
 * 场景显示对象基类 2017/06/20.
 */
var SceneBaseObj = (function (_super) {
    __extends(SceneBaseObj, _super);
    function SceneBaseObj(objectVo) {
        if (objectVo === void 0) { objectVo = null; }
        var _this = _super.call(this) || this;
        _this._sceneModel = SceneModel.getInstance();
        _this._objVo = objectVo;
        return _this;
    }
    /**
     * 初始化
     */
    SceneBaseObj.prototype.init = function () {
    };
    /**
     * 播放出生效果效果
     */
    SceneBaseObj.prototype.playBornEff = function (bornEff) {
        if (bornEff === void 0) { bornEff = ""; }
        if (bornEff == "") {
            return;
        }
        ;
        if (this.bornEffMc == null) {
            this.bornEffMc = new AMovieClip();
            this.addChild(this.bornEffMc);
        }
        this.bornEffMc.playMCKey(bornEff, "", 1);
        if (this.bornEffMc.hasEventListener(egret.Event.COMPLETE) == false) {
            this.bornEffMc.addEventListener(egret.Event.COMPLETE, this.playBornEffComplete, this);
        }
    };
    //出生播放完成
    SceneBaseObj.prototype.playBornEffComplete = function (e) {
        if (this.bornEffMc) {
            this.bornEffMc.removeEventListener(egret.Event.COMPLETE, this.playBornEffComplete, this);
            this.bornEffMc.destroy();
            if (this.bornEffMc.parent) {
                this.bornEffMc.parent.removeChild(this.bornEffMc);
            }
            this.bornEffMc = null;
        }
    };
    SceneBaseObj.prototype.showShadow = function (isSel) {
        if (isSel === void 0) { isSel = true; }
        var picUrl;
        if (isSel) {
            picUrl = "scene_shadowSel_png";
        }
        else {
            picUrl = "scene_shadow_png";
        }
        this.setPicShadow(picUrl);
    };
    //设置图片阴影
    SceneBaseObj.prototype.setPicShadow = function (picUrl) {
        if (picUrl === void 0) { picUrl = null; }
        if (picUrl && picUrl != "") {
            if (this.shadow == null) {
                this.shadow = new egret.Bitmap(RES.getRes(picUrl));
                this.addChild(this.shadow);
            }
            else {
                this.shadow.texture = RES.getRes(picUrl);
            }
            this.shadow.x = 0 - this.shadow.width / 2;
            this.shadow.y = 0 - this.shadow.height / 2;
        }
        else {
            if (this.shadow) {
                if (this.shadow.parent) {
                    this.shadow.parent.removeChild(this.shadow);
                }
                this.shadow = null;
            }
        }
    };
    //清理阴影
    SceneBaseObj.prototype.clearShadow = function () {
        this.setPicShadow();
    };
    //设置阴影显示
    SceneBaseObj.prototype.setShadowVisible = function (b) {
        if (this.shadow) {
            this.shadow.visible = b;
        }
    };
    /**
     * 更新位置
     */
    SceneBaseObj.prototype.updatePosition = function (xx, yy) {
        if (this.x == xx && this.y == yy) {
            return;
        }
        if (xx >= this._sceneModel.sceneWidth || yy >= this._sceneModel.sceneHeight) {
            return;
        }
        //xx = Math.min(this._sceneModel.sceneWidth,Math.max(0,xx));
        //yy = Math.min(this._sceneModel.sceneHeight,Math.max(0,yy));
        this.x = xx;
        this.y = yy;
        this._objVo.posX = xx;
        this._objVo.posY = yy;
        var gx = Math.floor(xx / SceneModel.GRIDW);
        var gy = Math.floor(yy / SceneModel.GRIDH);
        if (gx == this._objVo.gridX && gy == this._objVo.gridY) {
        }
        else {
            this.setGridPosition(gx, gy);
        }
    };
    /**
     * 设置格子位置子类覆盖
     */
    SceneBaseObj.prototype.setGridPosition = function (gx, gy) {
        this._objVo.gridX = gx; //Math.min(this._sceneModel.gridXNum-1,Math.max(0,gx));
        this._objVo.gridY = gy; //Math.min(this._sceneModel.gridYNum-1,Math.max(0,gy));
        if (this._sceneModel.curGridAlpha(this._objVo.gridX, this._objVo.gridY)) {
            this.alpha = 0.7;
        }
        else {
            this.alpha = 1;
        }
    };
    /**
     * 更新VO
     */
    SceneBaseObj.prototype.updateVo = function (vo) {
        this._objVo = vo;
    };
    /**
     * 更新模型
     */
    SceneBaseObj.prototype.updateAllModel = function () {
    };
    Object.defineProperty(SceneBaseObj.prototype, "vo", {
        /**
         * 获取VO
         */
        get: function () {
            return this._objVo;
        },
        /**
         * 设置VO
         */
        set: function (value) {
            this._objVo = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 更新
     */
    SceneBaseObj.prototype.update = function () {
    };
    /**
     * 暂停
     */
    SceneBaseObj.prototype.pause = function () {
    };
    /**
     * 恢复暂停
     */
    SceneBaseObj.prototype.resume = function () {
    };
    /**
     * 销毁
     */
    SceneBaseObj.prototype.destroy = function () {
        this.playBornEffComplete(null);
    };
    return SceneBaseObj;
}(egret.DisplayObjectContainer));
__reflect(SceneBaseObj.prototype, "SceneBaseObj");
//# sourceMappingURL=SceneBaseObj.js.map
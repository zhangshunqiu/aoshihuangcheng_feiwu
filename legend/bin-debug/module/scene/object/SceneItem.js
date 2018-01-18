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
 * 场景物品
 */
var SceneItem = (function (_super) {
    __extends(SceneItem, _super);
    function SceneItem(objectVo) {
        var _this = _super.call(this, objectVo) || this;
        _this.bodyUrl = "";
        _this.flyTargetPlayerId = 0; //物品飞到目标玩家的ID
        _this.isPlayFly = false;
        return _this;
    }
    /**
     * 初始化
     */
    SceneItem.prototype.init = function () {
        _super.prototype.init.call(this);
        if (this.vo) {
            this.updateBody(this.vo.bodyId + "_png");
            this.updateName(this.vo.name);
            //物品的位置初始化只能放这里
            var selfVo = SceneModel.getInstance().getMonsterVo(this.vo.monsterId);
            if (!selfVo) {
                selfVo = SceneModel.getInstance().getSelfPlayerVo();
            }
            var curx = selfVo.gridX;
            var cury = selfVo.gridY;
            var nx = curx;
            var ny = curx;
            for (var i = 0; i < DROP_ITEM_GRID_LIST.length; i++) {
                nx = DROP_ITEM_GRID_LIST[i][0] + curx;
                ny = DROP_ITEM_GRID_LIST[i][1] + cury;
                if (!this._sceneModel.getItemGridTableHasObj(nx, ny)) {
                    break;
                }
            }
            //App.logzsq(selfVo.gridX,selfVo.gridY,nx,ny)
            this.vo.gridX = nx;
            this.vo.gridY = ny;
            this.vo.posX = SceneUtil.gridToPixelX(this.vo.gridX);
            this.vo.posY = SceneUtil.gridToPixelY(this.vo.gridY);
            this.x = this.vo.posX;
            this.y = this.vo.posY;
            this.setGridPosition(this.vo.gridX, this.vo.gridY);
            this._sceneModel.addItemGridTablePos(this.vo);
        }
        this.isPlayFly = false;
        this.alpha = 1;
        this.scaleX = 1;
        this.scaleY = 1;
        if (this._sceneModel.pickItemType == PICK_ITEM_TYPE.get_by_fly) {
            egret.Tween.removeTweens(this);
            // let offset = App.stageHeight / 2 - (this._textTipsItemList.length-i) * 52-40;
            // egret.Tween.get(view).to({ y: offset }, 300);
            var vo;
            if (this._sceneModel.pickItemHeroId != 0) {
                vo = this._sceneModel.getPlayerVo(this._sceneModel.pickItemHeroId);
            }
            if (vo == undefined) {
                vo = this._sceneModel.getSelfPlayerVo();
            }
            this.flyTargetPlayerId = vo.id;
            if (vo) {
                var nnx = this.x + (this.x - vo.posX) / 10;
                var nny = this.y + (this.y - vo.posY + 60) / 10;
                //egret.Tween.get(this).wait(200+Math.random()*400).to({ y: nny,x:nnx}, 200).to({ y: vo.posY - 60,x:vo.posX, alpha:0.5,scaleX:0.5,scaleY:0.5}, 300).call(this.playFlyToTar, this);
                egret.Tween.get(this).wait(300 + Math.random() * 300).to({ y: nny, x: nnx }, 200).call(this.playFlyToTar, this);
            }
            else {
                egret.Tween.get(this).wait(500).call(this.removeSelf, this);
            }
            //this.isPlayFly = true;
        }
    };
    SceneItem.prototype.playFlyToTar = function () {
        egret.Tween.removeTweens(this);
        this.isPlayFly = true;
    };
    SceneItem.prototype.removeSelf = function () {
        SceneModel.getInstance().removeSceneObjectVo(this.vo);
        EventSystem.getInstance().dispatchEvent(SceneEventType.REMOVE_SCENE_OBJECT, this.vo);
    };
    /**
     * 更新VO
     */
    SceneItem.prototype.updateVo = function (vo) {
        this.vo = vo;
        this.init();
    };
    /**
     * 更新模型
     */
    SceneItem.prototype.updateBody = function (bodyUrl) {
        if (bodyUrl === void 0) { bodyUrl = ""; }
        if (this.bodyMc == null) {
            this.bodyMc = new egret.Bitmap();
            this.addChild(this.bodyMc);
            this.bodyMc.scaleX = 0.6;
            this.bodyMc.scaleY = 0.6;
        }
        if (this.bodyUrl != bodyUrl) {
            this.bodyUrl = bodyUrl;
            RES.getResAsync(bodyUrl, this.loadBodyComplete, this);
        }
    };
    SceneItem.prototype.loadBodyComplete = function (data) {
        this.bodyMc.texture = data;
        this.bodyMc.x = 0 - this.bodyMc.width / 2;
        this.bodyMc.y = 0 - this.bodyMc.height / 2;
    };
    /**
      * 更新名称
      */
    SceneItem.prototype.updateName = function (text) {
        if (text === void 0) { text = ""; }
        if (this.nameText == null) {
            this.nameText = new egret.TextField();
            this.addChild(this.nameText);
            // this.nameText.width = 270;
            // this.nameText.height = 70;
            this.nameText.textColor = 0xffffff;
            //this.nameText.textAlign = egret.HorizontalAlign.CENTER;
            // this.nameText.verticalAlign = egret.VerticalAlign.MIDDLE;
            this.nameText.strokeColor = 0x000000;
            this.nameText.stroke = 1;
            this.nameText.italic = true;
            this.nameText.size = 18;
            this.nameText.cacheAsBitmap = true;
        }
        this.nameText.text = this.vo.name;
        this.nameText.x = 0 - this.nameText.textWidth / 2;
        this.nameText.y = 0 - this.nameText.textHeight / 2 - 40;
    };
    /**
     * 更新
     */
    SceneItem.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.isPlayFly) {
            var vo = this._sceneModel.getPlayerVo(this.flyTargetPlayerId);
            if (vo) {
                var py = vo.posY - 60;
                if (SceneUtil.getDistance(this.x, this.y, vo.posX, py) > 12) {
                    this.x = this.x + (vo.posX - this.x) / 4;
                    this.y = this.y + (py - this.y) / 4;
                    this.alpha = this.alpha - 0.05;
                    this.scaleX = this.scaleX - 0.05;
                    this.scaleY = this.scaleY - 0.05;
                }
                else {
                    this.isPlayFly = false;
                    this.removeSelf();
                }
            }
            else {
                this.isPlayFly = false;
                this.removeSelf();
            }
        }
    };
    /**
     * 暂停
     */
    SceneItem.prototype.pause = function () {
        _super.prototype.pause.call(this);
    };
    /**
     * 恢复暂停
     */
    SceneItem.prototype.resume = function () {
        _super.prototype.resume.call(this);
    };
    /**
     * 销毁 不要继承父类的
     */
    SceneItem.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        egret.Tween.removeTweens(this);
    };
    Object.defineProperty(SceneItem.prototype, "vo", {
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
    return SceneItem;
}(SceneBaseObj));
__reflect(SceneItem.prototype, "SceneItem");
//# sourceMappingURL=SceneItem.js.map
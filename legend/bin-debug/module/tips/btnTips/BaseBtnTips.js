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
 * 按钮提示红点
 */
var BaseBtnTips = (function (_super) {
    __extends(BaseBtnTips, _super);
    function BaseBtnTips(type, parent, xx, yy) {
        var _this = _super.call(this) || this;
        _this._btnTipsType = 0;
        _this._autoPosX = false;
        _this._timeOutId = 0;
        _this._btnTipsType = type;
        _this.touchEnabled = false;
        parent.addChild(_this);
        parent.setChildIndex(_this, 999);
        if (xx == undefined) {
            _this.x = parent.width - 10;
            _this._autoPosX = true;
        }
        else {
            _this.x = xx;
            _this._autoPosX = false;
        }
        if (yy == undefined) {
            _this.y = 10;
        }
        else {
            _this.y = yy;
        }
        if (_this._btnTipsType != 0) {
            BtnTipManager.getInstance().setTypeItem(_this._btnTipsType, _this);
            // var data:any = BtnTipManager.getInstance().getTypeValue(this._btnTipsType)
            // if(data && data != 0){
            // 	this.show(data);
            // }else{
            // 	this.hide();
            // }
        }
        if (parent.width == 0 && _this._autoPosX) {
            if (_this._timeOutId == 0) {
                _this._timeOutId = egret.setTimeout(function () {
                    if (this.parent) {
                        this.x = this.parent.width - 10;
                    }
                }, _this, 400);
            }
        }
        if (_this.hasEventListener(egret.Event.REMOVED_FROM_STAGE) == false) {
            _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.onRemoveFromStage, _this);
        }
        return _this;
    }
    BaseBtnTips.prototype.onRemoveFromStage = function () {
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
        this.close();
    };
    BaseBtnTips.prototype.loadComplete = function (event) {
        this._bg.texture = event;
        this._bg.x = 0 - this._bg.width / 2;
        this._bg.y = 0 - this._bg.height / 2;
    };
    /**
     * 显示
     */
    BaseBtnTips.prototype.show = function (data) {
        if (data === void 0) { data = null; }
        this.visible = true;
        if (this._bg == null) {
            this._bg = new egret.Bitmap();
            this.addChild(this._bg);
            this._bg.touchEnabled = false;
            RES.getResAsync("com_redBg_png", this.loadComplete, this);
        }
        if (data && data != null) {
            if (this._label == null) {
                this._label = new egret.TextField();
                this._label.touchEnabled = false;
                this._label.size = 18;
                this.addChild(this._label);
            }
            if (typeof (data) == "string" || typeof (data) == "number") {
                this._label.text = String(data);
                this._label.x = 0 - this._label.width / 2;
                this._label.y = 0 - this._label.height / 2;
                this._label.visible = true;
            }
            else {
                if (this._label) {
                    this._label.visible = false;
                }
            }
            if (this._autoPosX && this.parent) {
                this.x = this.parent.width - 10;
            }
        }
        else {
            if (this._label) {
                this._label.visible = false;
            }
        }
    };
    /**
     * 关闭
     */
    BaseBtnTips.prototype.hide = function () {
        this.visible = false;
        if (this._timeOutId != 0) {
            egret.clearTimeout(this._timeOutId);
            this._timeOutId = 0;
        }
    };
    /**
     * 清理
     */
    BaseBtnTips.prototype.close = function () {
        if (this._timeOutId != 0) {
            egret.clearTimeout(this._timeOutId);
            this._timeOutId = 0;
        }
        BtnTipManager.getInstance().deleteTypeItem(this._btnTipsType);
    };
    return BaseBtnTips;
}(egret.DisplayObjectContainer));
__reflect(BaseBtnTips.prototype, "BaseBtnTips");
//# sourceMappingURL=BaseBtnTips.js.map
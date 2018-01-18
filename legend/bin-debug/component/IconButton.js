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
 * 图标按钮 2017/09/20.
 */
var IconButton = (function (_super) {
    __extends(IconButton, _super);
    /**
     * param 现在只有icon和id 以后加 {icon="ffff_png",id=12}
     */
    function IconButton(param) {
        var _this = _super.call(this) || this;
        _this.OFFSET_XY = 0.02;
        _this._param = param;
        _this.touchEnabled = true;
        _this.init(_this._param);
        return _this;
    }
    IconButton.prototype.init = function (param) {
        if (param && param.icon) {
            if (this._bg == null) {
                this._bg = new egret.Bitmap();
                this.addChild(this._bg);
                this._bg.visible = false;
                this._bg.cacheAsBitmap = true;
            }
            if (this._icon == null) {
                this._icon = new egret.Bitmap();
                this.addChild(this._icon);
                this._icon.cacheAsBitmap = true;
                //this._icon.x = -20;
                //this._icon.y = -20;
            }
            RES.getResAsync(param.icon, this.loadIconComplete, this);
            RES.getResAsync("main_xuanzhongtexiao_png", this.loadBgComplete, this);
        }
    };
    IconButton.prototype.loadIconComplete = function (event) {
        var img = event;
        if (img) {
            this._icon.texture = img;
            //this._icon.x = 0-this._icon.width/2;
            //this._icon.y = 0-this._icon.height/2
            this._bg.x = this._icon.width / 2;
            this._bg.y = this._icon.height / 2;
            this._iconX = this._icon.x;
            this._iconY = this._icon.y;
            this._bgX = this._bg.x;
            this._bgY = this._bg.y;
        }
    };
    IconButton.prototype.loadBgComplete = function (event) {
        var img = event;
        if (img) {
            this._bg.texture = img;
            this._bg.anchorOffsetX = this._bg.width / 2;
            this._bg.anchorOffsetY = this._bg.height / 2;
            this._bg.x = this._icon.width / 2;
            this._bg.y = this._icon.height / 2;
            this._bgX = this._bg.x;
            this._bgY = this._bg.y;
        }
    };
    /**
     * 获取按钮ID
     */
    IconButton.prototype.getId = function () {
        if (this._param && this._param.id) {
            return this._param.id;
        }
        return null;
    };
    Object.defineProperty(IconButton.prototype, "icon", {
        /**
         * 获取图标
         */
        get: function () {
            return this._icon;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IconButton.prototype, "bg", {
        /**
         * 获取图标背景
         */
        get: function () {
            return this._bg;
        },
        enumerable: true,
        configurable: true
    });
    // /**
    //  * 设置图标位置
    //  * @param {number} x坐标(一个百分比)
    //  * @param {number} y坐标(一个百分比)
    //  */
    // public setIconPos(x: number, y: number) {
    // 	this._icon.x = this._iconX;
    // 	this._icon.y = this._iconY;
    // 	this._icon.x += x * this._icon.width;
    // 	this._icon.y += y * this._icon.height;
    // }
    // /**
    //  * 设置bg
    //  * @param {number} x坐标
    //  * @param {number} y坐标
    //  * @param {boolean} bg显隐
    //  */
    // public setBg(x: number, y: number, visible: boolean = false) {
    // 	this._bg.x = this._bgX;
    // 	this._bg.y = this._bgY;
    // 	this._bg.x += x * this._bg.width;
    // 	this._bg.y += y * this._bg.height;
    // 	this._bg.visible = visible;
    // }
    IconButton.prototype.setSelected = function (bool) {
        this._icon.x = this._iconX;
        this._icon.y = this._iconY;
        this._bg.x = this._bgX;
        this._bg.y = this._bgY;
        this._bg.visible = false;
        if (bool) {
            this._icon.x += this.OFFSET_XY * this._icon.width;
            this._icon.y += this.OFFSET_XY * this._icon.height;
            this._bg.x += this.OFFSET_XY * this._bg.width;
            this._bg.y += this.OFFSET_XY * this._bg.height;
            this._bg.visible = true;
        }
    };
    /**
     * 清理
     */
    IconButton.prototype.destroy = function () {
        //有动画就要清理
    };
    return IconButton;
}(egret.DisplayObjectContainer));
__reflect(IconButton.prototype, "IconButton");
//# sourceMappingURL=IconButton.js.map
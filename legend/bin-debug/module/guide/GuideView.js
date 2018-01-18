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
var GuideView = (function (_super) {
    __extends(GuideView, _super);
    function GuideView() {
        var _this = _super.call(this) || this;
        _this.darkSprite = new egret.Sprite();
        _this.guideModel = GuideModel.getInstance();
        _this.maskArray = [];
        _this.skinName = "GuideViewSkin";
        return _this;
    }
    GuideView.prototype.childrenCreated = function () {
        var _this = this;
        _super.prototype.childrenCreated.call(this);
        // this.touchChildren = false;
        this.touchEnabled = false;
        this.btn_skip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.skipGuide, this);
        //初始化特效
        this._mc = new EffectMovieClip();
        this._mc.touchEnabled = false;
        this._mc.playMCKey("effxsyd", "", -1, null, function () {
            _this._mc.frameRate = 8;
        }, null, this);
        this.gp_main.addChild(this._mc);
        //初始化四个遮罩
        for (var i = 0; i <= 4; i++) {
            var gp = new eui.Group();
            gp.touchEnabled = true;
            gp.touchThrough = false;
            this.gp_main.addChild(gp);
            this.maskArray.push(gp);
            var rect = new eui.Rect();
            rect.fillColor = 0x000000;
            rect.fillAlpha = 0.6;
            rect.left = rect.right = rect.bottom = rect.top = 0;
            gp.addChild(rect);
        }
        this.gp_main.setChildIndex(this.gp_text, 998);
        this.gp_main.setChildIndex(this.btn_skip, 999);
        this.validateNow();
    };
    GuideView.prototype.updateGuide = function () {
        var _this = this;
        var guideInfo = App.ConfigManager.getGuideInfoByIdAndStep(App.GuideManager.curGuideId, App.GuideManager.curGuideStep);
        var obj = App.GuideManager.guideBtnDic[App.GuideManager.curGuideId][App.GuideManager.curGuideStep];
        var point = obj.localToGlobal();
        var width = guideInfo.width;
        var height = guideInfo.height;
        // App.logzrj("data",point,obj);
        //设置遮罩
        this.maskArray[0].x = this.maskArray[0].y = 0;
        this.maskArray[0].height = this.gp_main.height;
        this.maskArray[0].width = point.x;
        this.maskArray[1].x = point.x + width;
        this.maskArray[1].y = 0;
        this.maskArray[1].height = this.gp_main.height;
        this.maskArray[1].width = this.gp_main.width - point.x - width;
        this.maskArray[2].x = point.x;
        this.maskArray[2].y = 0;
        this.maskArray[2].height = point.y;
        this.maskArray[2].width = width;
        this.maskArray[3].x = point.x;
        this.maskArray[3].y = point.y + height;
        this.maskArray[3].height = this.gp_main.height - height - point.y;
        this.maskArray[3].width = width;
        this._mc.x = point.x + width / 2;
        this._mc.y = point.y + height / 2;
        // if(this._mc.parent) {
        //     this._mc.parent.removeChild(this._mc);
        //     obj.parent.addChild(this._mc);
        //     this._mc.x = obj.x;
        //     this._mc.y = obj.y;
        // }
        this.gp_text.y = point.y;
        this.lb_text.text = guideInfo.des;
        this.lb_text.validateNow();
        this.gp_text.width = this.lb_text.width + 25;
        if (point.x > App.stageWidth / 2) {
            this.gp_text.x = point.x + width / 2 - this.gp_text.width - 75;
            this.img_arrow.x = this.gp_text.width;
            RES.getResAsync("main_icon_xinshouzhiyin_right_png", function (texture) {
                _this.img_arrow.source = texture;
            }, this);
        }
        else {
            this.gp_text.x = point.x + width / 2 + 75;
            // this.lb_text.textAlign = "left";
            this.img_arrow.x = -50;
            RES.getResAsync("main_icon_xinshouzhiyin_left_png", function (texture) {
                _this.img_arrow.source = texture;
            }, this);
        }
    };
    // public finishStep(){
    // if (this.curDisplayObject.visible){
    //     this.curDisplayObject.dispatchEvent(new egret.TouchEvent(egret.TouchEvent.TOUCH_TAP));
    //     this.curDisplayObject.dispatchEvent(new egret.TouchEvent(egret.TouchEvent.TOUCH_BEGIN));
    //     this.curDisplayObject.dispatchEvent(new egret.TouchEvent(egret.TouchEvent.TOUCH_END));
    //     this.curDisplayObject.visible = false;
    //     App.GuideManager.NextStep();
    // } else {
    // }
    // }
    GuideView.prototype.skipGuide = function () {
        App.logzrj("skipppppp");
        App.GuideManager.nextGuide();
    };
    GuideView.prototype.showGuide = function () {
        if (this.visible) {
            return;
        }
        this.visible = true;
        this.updateGuide();
    };
    GuideView.prototype.hideGuide = function () {
        if (!this.visible) {
            return;
        }
        this.visible = false;
        // if (this._mc.parent) {
        //     this._mc.parent.removeChild(this._mc);
        // }
    };
    return GuideView;
}(eui.Component));
__reflect(GuideView.prototype, "GuideView");
//# sourceMappingURL=GuideView.js.map
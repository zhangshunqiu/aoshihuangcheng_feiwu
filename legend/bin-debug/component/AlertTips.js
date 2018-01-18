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
// 通用tips弹框基类
var AlertTips = (function (_super) {
    __extends(AlertTips, _super);
    /**
     * style:样式
     * textFlow:有这个就不会处理content
     * content:字符串内容
     * okCB:点击ok的cb
     * cancelCB:点击cancel的cb
     * cbThisObject:回掉函数对象上下文
     * okLab:确定按钮文本
     * canelLab：取消按钮文本
     * okCdTime：确定按钮倒计时时间（秒）
     * needCheckBox:是否需要CheckBox
     * title : 提示框标题 传图片资源名
     * contentStyle:文字内容是否居中 1:left 2:center 3:right
     */
    function AlertTips(viewConf) {
        if (viewConf === void 0) { viewConf = null; }
        var _this = _super.call(this, viewConf) || this;
        _this._timeEventId = 0;
        _this._style = 0 /* COMMON */; // AlertTipsStyle;
        _this._okLab = "确 定";
        _this._canelLab = "取 消";
        _this._needCheckBox = false;
        _this._title = "提 示";
        _this._contentStyle = 1;
        _this._okCdTime = 0;
        return _this;
    }
    AlertTips.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    AlertTips.prototype.initView = function () {
        this.cbox.visible = false;
        this.cbox.labelDisplay.textColor = 0x9b7c2c;
        if (this.lb_title) {
            this.lb_title.text = this._title;
        }
        switch (this._style) {
            case 0 /* COMMON */:
                this._canelBtn = new eui.Button();
                this._canelBtn.skinName = "skins.ComBtnRedSkin";
                //this._canelBtn.currentState = "up";
                this._canelBtn.label = this._canelLab; //"取 消"
                this.gp_btn.addChild(this._canelBtn);
                //UIActionManager.bindClickAction(this._canelBtn);
                this._canelBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCanelClick, this);
            default:
                this._okBtn = new eui.Button();
                this._okBtn.skinName = "skins.ComBtnRedSkin";
                //this._okBtn.currentState = "up";
                if (this._okCdTime > 0) {
                    this._okBtn.label = this._okLab + "(" + this._okCdTime + "S)";
                }
                else {
                    this._okBtn.label = this._okLab; //"确 定"
                }
                this.gp_btn.addChild(this._okBtn);
                //UIActionManager.bindClickAction(this._okBtn);
                this._okBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOKClick, this);
                break;
        }
        var layout = new eui.HorizontalLayout();
        layout.horizontalAlign = egret.HorizontalAlign.CENTER;
        layout.verticalAlign = egret.VerticalAlign.MIDDLE;
        layout.gap = 150;
        this.gp_btn.layout = layout;
        // 内容
        if (this._textFlow) {
            this.lb_content.textFlow = [{ text: "    " }].concat(this._textFlow);
        }
        else {
            this.lb_content.text = "    " + this._content;
        }
        var extHeight = 0;
        if (this._needCheckBox) {
            this.cbox.visible = true;
            // this.lb_content.verticalCenter = undefined;
            // this.lb_content.top = 110;
            // extHeight = 35;
        }
        else {
            this.cbox.visible = false;
            // this.lb_content.verticalCenter = 0;
        }
        // //文字内容是否居中
        switch (this._contentStyle) {
            case 1:
                this.lb_content.textAlign = "left";
                break;
            case 2:
                this.lb_content.textAlign = "cneter";
                break;
            case 3:
                this.lb_content.textAlign = "right";
                break;
        }
        // // this.gp_root.height = 220 + this.lb_content.numLines*(this.lb_content.size+this.lb_content.lineSpacing);
        // egret.setTimeout(() => {
        // 	this.gp_root.height = 235 + this.lb_content.height + extHeight;
        // }, this, 50);
    };
    AlertTips.prototype.onOKClick = function () {
        this.closeWin();
        if (this._okCB) {
            this._okCB.call(this._cbThisObject, this.cbox.selected);
        }
    };
    AlertTips.prototype.onCanelClick = function () {
        this.closeWin();
        if (this._cancelCB) {
            this._cancelCB.call(this._cbThisObject);
        }
    };
    /**
     * 打开窗口
     */
    AlertTips.prototype.openWin = function (params) {
        if (params === void 0) { params = null; }
        _super.prototype.openWin.call(this, params);
        if (params.style != undefined) {
            this._style = params.style;
        }
        if (params.textFlow) {
            this._textFlow = params.textFlow;
        }
        else {
            this._content = params.content;
        }
        if (params.title) {
            this._title = params.title;
        }
        if (params.contentStyle) {
            this._contentStyle = params.contentStyle;
        }
        if (params.okCB) {
            this._okCB = params.okCB;
        }
        if (params.cancelCB) {
            this._cancelCB = params.cancelCB;
        }
        if (params.context) {
            this._cbThisObject = params.context;
        }
        if (params.cbThisObject) {
            this._cbThisObject = params.cbThisObject;
        }
        if (params.okLab) {
            this._okLab = params.okLab;
        }
        if (params.canelLab) {
            this._canelLab = params.canelLab;
        }
        this._needCheckBox = params.needCheckBox;
        this.initView();
        if (params.okCdTime) {
            this._okCdTime = params.okCdTime;
            if (this._okCdTime > 0) {
                if (this._timeEventId != 0) {
                    App.GlobalTimer.remove(this._timeEventId);
                    this._timeEventId = 0;
                }
                if (this._timeEventId == 0) {
                    this._timeEventId = App.GlobalTimer.addSchedule(1000, -1, this.onUpdateTime, this);
                }
            }
        }
    };
    AlertTips.prototype.onUpdateTime = function () {
        this._okCdTime--;
        if (this._okCdTime <= 0) {
            if (this._timeEventId != 0) {
                App.GlobalTimer.remove(this._timeEventId);
                this._timeEventId = 0;
            }
            this.onOKClick();
        }
        if (this._okBtn) {
            this._okBtn.label = this._okLab + "(" + this._okCdTime + "S)";
        }
    };
    /**
     * 关闭窗口
     */
    AlertTips.prototype.closeWin = function () {
        _super.prototype.closeWin.call(this);
    };
    /**
     * 清理
     */
    AlertTips.prototype.clear = function (data) {
        if (data === void 0) { data = null; }
        _super.prototype.clear.call(this, data);
        this._cbThisObject = null;
        this._okCB = null;
        this._cancelCB = null;
        this._okCdTime = 0;
        if (this._timeEventId != 0) {
            App.GlobalTimer.remove(this._timeEventId);
            this._timeEventId = 0;
        }
    };
    /**
     * 销毁
     */
    AlertTips.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    return AlertTips;
}(BaseView));
__reflect(AlertTips.prototype, "AlertTips");
//# sourceMappingURL=AlertTips.js.map
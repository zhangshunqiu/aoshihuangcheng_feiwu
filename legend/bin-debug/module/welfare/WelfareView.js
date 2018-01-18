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
* Author: lihe
* Email： hersletter@qq.com
* 福利UI界面逻辑 2017/06/20.
*/
var game;
(function (game) {
    var WelfareView = (function (_super) {
        __extends(WelfareView, _super);
        function WelfareView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._curtype = WelfareType.Sign;
            _this._welfaredomodel = game.WelfareModel.getInstance();
            _this._curSelIndex = 0;
            return _this;
        }
        WelfareView.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.closeWin(WinName.WELFARE);
            }, this);
            RES.getResAsync("sign_fuli_title_png", function (texture) {
                _this.commonWin.img_title.texture = texture;
            }, this);
            this.initView();
        };
        WelfareView.prototype.initView = function () {
            var _this = this;
            this.bt_back.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.closeWin(WinName.WELFARE);
            }, this);
            this.btn_sign.addEventListener(egret.TouchEvent.TOUCH_TAP, function () { _this.changeWelfareState(WelfareType.Sign); }, this);
            this.btn_level.addEventListener(egret.TouchEvent.TOUCH_TAP, function () { _this.changeWelfareState(WelfareType.Level); }, this);
            this.btn_note.addEventListener(egret.TouchEvent.TOUCH_TAP, function () { _this.changeWelfareState(WelfareType.Note); }, this);
            this.btn_code.addEventListener(egret.TouchEvent.TOUCH_TAP, function () { _this.changeWelfareState(WelfareType.Code); }, this);
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.WELFARE_SIGN, this.btn_sign);
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.WELFARE_LEVEN, this.btn_level);
        };
        WelfareView.prototype.changeWelfareState = function (type) {
            if (this._curSelIndex == type) {
                return;
            }
            if (this._curSelView) {
                this._curSelView.clear();
            }
            switch (type) {
                case WelfareType.Sign:
                    if (this._sign_view == null) {
                        this._sign_view = new game.SignView("SignViewSkin");
                        this.addChild(this._sign_view);
                    }
                    this._sign_view.readyOpen({ data: {} });
                    this._curSelView = this._sign_view;
                    break;
                case WelfareType.Level:
                    if (this._lvpackage_view == null) {
                        this._lvpackage_view = new game.WelfareLvPackageView("WelfareLvPackageSkin");
                        this.addChild(this._lvpackage_view);
                    }
                    this._lvpackage_view.readyOpen({ data: {} });
                    this._curSelView = this._lvpackage_view;
                    break;
                case WelfareType.Note:
                    if (this._note_view == null) {
                        this._note_view = new game.WelfareNoteView("WelfareNoteSkin");
                        this.addChild(this._note_view);
                    }
                    this._note_view.readyOpen({ data: {} });
                    this._curSelView = this._note_view;
                    break;
                case WelfareType.Code:
                    break;
            }
            this._curSelIndex = type;
        };
        /**
         * 打开窗口
        */
        WelfareView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this.changeWelfareState(WelfareType.Sign);
        };
        /**
         * 关闭窗口
         */
        WelfareView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        WelfareView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
            this._curSelIndex = 0;
        };
        /**
         * 销毁
         */
        WelfareView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        //等级礼包
        // public openLevel() {
        // 	App.Socket.send(22001, null);
        // }
        // public updateLevel() {
        // 	this._list_levelpackage.dataProvider = new eui.ArrayCollection(this._welfaredomodel.lvList);
        // }
        // public openNote() {
        // 	let data = (LoginModel.getInstance() as LoginModel).getNotice();
        // 	this.lb_notetitle.textFlow = (new egret.HtmlTextParser).parser(data.top);
        // 	this.lb_notecontent.textFlow = (new egret.HtmlTextParser).parser(data.word);
        // }
        WelfareView.prototype.openCode = function () {
        };
        //签到
        WelfareView.prototype.openSign = function () {
            this.gp_sign.addChild(new game.SignView("SignViewSkin"));
        };
        return WelfareView;
    }(BaseView));
    game.WelfareView = WelfareView;
    __reflect(WelfareView.prototype, "game.WelfareView");
})(game || (game = {}));
//# sourceMappingURL=WelfareView.js.map
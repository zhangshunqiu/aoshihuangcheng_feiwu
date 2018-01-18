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
 * 称号界面 2017/06/20.
 */
var game;
(function (game) {
    /**
     *  活跃度任务界面
     */
    var MustDoTitleView = (function (_super) {
        __extends(MustDoTitleView, _super);
        function MustDoTitleView(skinName) {
            var _this = _super.call(this, "MustDoTitleSkin") || this;
            _this._listtitle = new eui.List();
            _this._eventid_Title = 0;
            _this._mustdomodel = game.MustDoModel.getInstance();
            return _this;
        }
        MustDoTitleView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            //this.isCreated = true;
            this.scr_title.viewport = this._listtitle;
            this.scr_title.scrollPolicyH = eui.ScrollPolicy.OFF;
            this._listtitle.itemRenderer = TitleItem;
            this.btn_lighten.addEventListener(egret.TouchEvent.TOUCH_TAP, this.lightenProperty, this);
        };
        /**
         * 打开窗口
         */
        MustDoTitleView.prototype.open = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.open.call(this, openParam);
            if (this._eventid_Title == 0)
                this._eventid_Title = App.EventSystem.addEventListener(PanelNotify.MUSTDO_UPDATETITLE, this.updateTitle, this);
            App.Socket.send(32001, null);
            App.BtnTipManager.setTypeValue(ConstBtnTipType.TASK_ACHIEVETITLE, false);
        };
        /**
         * 清理
         */
        MustDoTitleView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
            if (this._eventid_Title != 0) {
                App.EventSystem.removeEventListener(PanelNotify.MUSTDO_UPDATETITLE, this._eventid_Title);
                this._eventid_Title = 0;
            }
        };
        /**
         * 销毁
         */
        MustDoTitleView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        MustDoTitleView.prototype.updateTitle = function () {
            this._listtitle.dataProvider = new eui.ArrayCollection(this._mustdomodel.titleList);
            this.lb_totalactivity.text = this._mustdomodel.totalactivity + "";
        };
        MustDoTitleView.prototype.lightenProperty = function () {
            App.WinManager.openWin(WinName.MUSTDO_LIGHTEN);
        };
        return MustDoTitleView;
    }(BaseChildView));
    game.MustDoTitleView = MustDoTitleView;
    __reflect(MustDoTitleView.prototype, "game.MustDoTitleView");
    var TitleItem = (function (_super) {
        __extends(TitleItem, _super);
        function TitleItem() {
            var _this = _super.call(this) || this;
            _this._mustdomodel = game.MustDoModel.getInstance();
            _this.skinName = "MustDoTitleItemSkin";
            _this.cbx_use.addEventListener(eui.UIEvent.CHANGE, function (evt) {
                _this.useTitle(); //egret.log(evt.target.selected);
            }, _this);
            _this.cbx_show.addEventListener(eui.UIEvent.CHANGE, function (evt) {
                _this.showTitle(); //egret.log(evt.target.selected);
            }, _this);
            _this.cbx_show.groupName = "title";
            _this.img_icon.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.viewTitleDetail();
            }, _this);
            return _this;
        }
        TitleItem.prototype.viewTitleDetail = function () {
            this._mustdomodel.selectTitleId = this.tivo.title_id;
            this._mustdomodel.selectTitileVo = this.tivo;
            App.WinManager.openWin(WinName.MUSTDO_TITLEDETAIL);
        };
        TitleItem.prototype.useTitle = function () {
            this._mustdomodel.selectTitleId = this.tivo.title_id;
            App.Socket.send(32002, { id: this.tivo.title_id });
        };
        TitleItem.prototype.showTitle = function () {
            this._mustdomodel.selectTitleId = this.tivo.title_id;
            App.Socket.send(32003, { id: this.tivo.title_id });
        };
        TitleItem.prototype.dataChanged = function () {
            var tv = this.data;
            this.tivo = tv;
            if (tv.is_alive) {
                this.img_alive.visible = true;
                this.img_notactive.visible = false;
                this.lb_condition.text = " ";
                this.gp_show.visible = true;
                this.gp_use.visible = true;
                this.cbx_show.selected = tv.is_show;
                this.cbx_use.selected = tv.is_use;
            }
            else {
                this.img_alive.visible = false;
                this.img_notactive.visible = true;
                if (tv.active > 0)
                    this.lb_condition.text = "累积" + tv.active + "点成就可激活";
                else
                    this.lb_condition.text = tv.des;
                this.gp_show.visible = false;
                this.gp_use.visible = false;
            }
            this.img_icon.source = tv.icon + "_png";
            // RES.getResAsync(tv.icon+"_png", (texture) => {
            //     this.img_icon.texture = texture;
            // }, this);
        };
        return TitleItem;
    }(eui.ItemRenderer));
    game.TitleItem = TitleItem;
    __reflect(TitleItem.prototype, "game.TitleItem");
})(game || (game = {}));
//# sourceMappingURL=MustDoTitleView.js.map
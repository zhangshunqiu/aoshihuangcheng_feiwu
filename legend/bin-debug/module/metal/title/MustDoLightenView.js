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
 * 称号点亮属性界面 2017/06/20.
 */
var game;
(function (game) {
    var MustDoLightenView = (function (_super) {
        __extends(MustDoLightenView, _super);
        function MustDoLightenView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._mustdomodel = game.MustDoModel.getInstance();
            return _this;
        }
        MustDoLightenView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.closeWin(WinName.MUSTDO_LIGHTEN);
            }, this);
        };
        /**
         * 打开窗口
        */
        MustDoLightenView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this.lb_lightennum.text = "当前获得" + this._mustdomodel.activetitlenum + "个称号，获得点亮属性加成";
            this.lb_hp.textFlow = [{ text: ConstAttribute.hp + " " }, { text: "0", style: { textColor: 0x00f829 } }];
            this.lb_attack.textFlow = [{ text: "攻击 " }, { text: "0", style: { textColor: 0x00f829 } }];
            this.lb_def.textFlow = [{ text: ConstAttribute.def + " " }, { text: "0", style: { textColor: 0x00f829 } }];
            this.lb_sdef.textFlow = [{ text: ConstAttribute.sdef + " " }, { text: "0", style: { textColor: 0x00f829 } }];
            if (this._mustdomodel.activetitlenum > 0) {
                var att_id = (App.ConfigManager.getLightenPropertyByNum(this._mustdomodel.activetitlenum)).att_id;
                var info = App.ConfigManager.getTitleAttByAttId(att_id);
                if (info != null) {
                    this.lb_hp.textFlow = [{ text: ConstAttribute.hp + " " }, { text: info.hp, style: { textColor: 0x00f829 } }];
                    this.lb_attack.textFlow = [{ text: "攻击 " }, { text: info.ac, style: { textColor: 0x00f829 } }];
                    this.lb_def.textFlow = [{ text: ConstAttribute.def + " " }, { text: info.def, style: { textColor: 0x00f829 } }];
                    this.lb_sdef.textFlow = [{ text: ConstAttribute.sdef + " " }, { text: info.sdef, style: { textColor: 0x00f829 } }];
                }
            }
        };
        /**
         * 关闭窗口
         */
        MustDoLightenView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        MustDoLightenView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
        };
        /**
         * 销毁
         */
        MustDoLightenView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return MustDoLightenView;
    }(BaseView));
    game.MustDoLightenView = MustDoLightenView;
    __reflect(MustDoLightenView.prototype, "game.MustDoLightenView");
})(game || (game = {}));
//# sourceMappingURL=MustDoLightenView.js.map
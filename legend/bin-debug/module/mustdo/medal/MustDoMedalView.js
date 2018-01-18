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
 * 勋章界面 2017/06/20.
 */
var game;
(function (game) {
    var MustDoMedalView = (function (_super) {
        __extends(MustDoMedalView, _super);
        function MustDoMedalView(skinName) {
            var _this = _super.call(this, "MustDoMedalSkin") || this;
            _this._eventid_medal = 0;
            _this._mustdomodel = game.MustDoModel.getInstance();
            return _this;
        }
        MustDoMedalView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            //this.isCreated = true;
            this.bt_getachieve.textFlow = [{ text: "获得活跃", style: { "underline": true } }];
            this.btn_lvup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.medalLvUp, this);
            this.bt_view.addEventListener(egret.TouchEvent.TOUCH_TAP, this.viewMedalRank, this);
            this.bt_getachieve.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getAchieveWay, this);
            this.bt_untake.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getUnTakeAchieve, this);
            if (this._btnTakeMc == null) {
                this._btnTakeMc = new AMovieClip();
                this.addChild(this._btnTakeMc);
                this._btnTakeMc.x = this.bt_untake.x + 55;
                this._btnTakeMc.y = this.bt_untake.y + 52;
                this._btnTakeMc.touchEnabled = false;
            }
            this._btnTakeMc.visible = false;
        };
        /**
         * 打开窗口
         */
        MustDoMedalView.prototype.open = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.open.call(this, openParam);
            if (this._btnTakeMc == null) {
                this._btnTakeMc = new AMovieClip();
                this.addChild(this._btnTakeMc);
                this._btnTakeMc.x = this.bt_untake.x + 55;
                this._btnTakeMc.y = this.bt_untake.y + 52;
                this._btnTakeMc.touchEnabled = false;
            }
            this._btnTakeMc.visible = false;
            if (this._eventid_medal == 0)
                this._eventid_medal = App.EventSystem.addEventListener(PanelNotify.MUSTDO_UPDATEMEDAL, this.updateMedal, this);
            App.Socket.send(19005, null);
        };
        /**
         * 清理
         */
        MustDoMedalView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
            if (this._eventid_medal != 0) {
                App.EventSystem.removeEventListener(PanelNotify.MUSTDO_UPDATEMEDAL, this._eventid_medal);
                this._eventid_medal = 0;
            }
            if (this._btnTakeMc) {
                this._btnTakeMc.stop();
                this._btnTakeMc.destroy();
                this._btnTakeMc = null;
            }
        };
        /**
         * 销毁
         */
        MustDoMedalView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        MustDoMedalView.prototype.updateMedal = function () {
            this.lb_power.text = this._mustdomodel.achieve_power + "";
            this.lb_untake.text = this._mustdomodel.achieve_not_get + "";
            this.lb_lv.text = "Lv." + this._mustdomodel.achieve_lv;
            this.pgbar_medalvalue.maximum = this._mustdomodel.achieve_upgrade;
            this.pgbar_medalvalue.value = this._mustdomodel.achieve_own; // * 100 / this._mustdomodel.achieve_upgrade;
            this.lb_pgtext.text = this._mustdomodel.achieve_own + "/" + this._mustdomodel.achieve_upgrade;
            var value = this._mustdomodel.achieve_not_get * 100 / 8000;
            this._btnTakeMc.visible = true;
            if (value >= 0 && value < 25)
                this._btnTakeMc.visible = false;
            if (value >= 25 && value < 50)
                this._btnTakeMc.playMCKey("effcjz01");
            if (value >= 50 && value < 75)
                this._btnTakeMc.playMCKey("effcjz02");
            if (value >= 75 && value < 25)
                this._btnTakeMc.playMCKey("effcjz03");
            if (value >= 100)
                this._btnTakeMc.playMCKey("effcjz04");
            var rankstr = "";
            for (var i = 0; i < this._mustdomodel.achieveranklist.length; i++) {
                rankstr += this._mustdomodel.achieveranklist[i].rank_num + "." + this._mustdomodel.achieveranklist[i].name + "  Lv."
                    + this._mustdomodel.achieveranklist[i].lv + "\n";
            }
            this.lb_rank.text = rankstr;
            var curlv_info = App.ConfigManager.getMedalAttrInfoByLv(this._mustdomodel.achieve_lv);
            if (curlv_info != null) {
                this.lb_hp.text = ConstAttribute.hp + "：" + curlv_info.hp;
                this.lb_attak.text = "攻击：" + curlv_info.ac;
                this.lb_dfphydic.text = ConstAttribute.def + "：" + curlv_info.def;
                this.lb_dfmagic.text = ConstAttribute.sdef + "：" + curlv_info.sdef;
            }
            var nextlv_info = App.ConfigManager.getMedalAttrInfoByLv(this._mustdomodel.achieve_lv + 1);
            if (nextlv_info != null) {
                this.lb_nexthp.text = ConstAttribute.hp + "：" + nextlv_info.hp;
                this.lb_nextak.text = "攻击：" + nextlv_info.ac;
                this.lb_nextdfp.text = ConstAttribute.def + "：" + nextlv_info.def;
                this.lb_nextdfm.text = ConstAttribute.sdef + "：" + nextlv_info.sdef;
            }
            else {
                this.lb_nexthp.text = "已满级";
                this.lb_nextak.text = "已满级";
                this.lb_nextdfp.text = "已满级";
                this.lb_nextdfm.text = "已满级";
            }
        };
        MustDoMedalView.prototype.medalLvUp = function () {
            if (this._mustdomodel.achieve_own >= this._mustdomodel.achieve_upgrade)
                App.Socket.send(19006, null);
        };
        MustDoMedalView.prototype.viewMedalRank = function () {
            App.WinManager.openWin(WinName.RANK, ConstRankName.MEMAL);
        };
        MustDoMedalView.prototype.getUnTakeAchieve = function () {
            if (this._mustdomodel.month_card == 1)
                App.Socket.send(19004, null);
            else
                App.WinManager.openWin(WinName.MUSTDO_UNTAKE);
        };
        MustDoMedalView.prototype.getAchieveWay = function () {
            // let view = new ItemWay(ClientType.BASE_ITEM, 104);
            // PopUpManager.addPopUp({ obj: view });
            App.GlobalTips.showItemWayTips(ClientType.BASE_ITEM, 103);
        };
        return MustDoMedalView;
    }(BaseChildView));
    game.MustDoMedalView = MustDoMedalView;
    __reflect(MustDoMedalView.prototype, "game.MustDoMedalView");
})(game || (game = {}));
//# sourceMappingURL=MustDoMedalView.js.map
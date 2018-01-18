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
 * 天梯争霸界面 2017/06/20.
 */
var game;
(function (game) {
    var LabberView = (function (_super) {
        __extends(LabberView, _super);
        function LabberView(skinName) {
            var _this = _super.call(this, "LabberSkin") || this;
            _this._list_match = new eui.List();
            _this._labber_eventId = 0;
            _this._match_eventId = 0;
            _this._match_timeId = 0;
            _this.img_stars = [];
            _this._labbermodel = game.LabberHegemonyModel.getInstance();
            return _this;
        }
        LabberView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.btn_tips.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openHegemonyTips, this);
            this.btn_reward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openHegemonyReward, this);
            this.btn_match.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openHegemonyMatch, this);
            this.btn_buytimes.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buyHegemonyMatchTimes, this);
            this.btn_rank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openRanking, this);
            this.scr_match.viewport = this._list_match;
            this.scr_match.scrollPolicyH = eui.ScrollPolicy.OFF;
            this._list_match.itemRenderer = LabberMatchItem;
            this.img_stars.push(this.img_star1);
            this.img_stars.push(this.img_star2);
            this.img_stars.push(this.img_star3);
        };
        /**
         * 打开窗口
         */
        LabberView.prototype.open = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.open.call(this, openParam);
            if (this._labber_eventId == 0) {
                this._labber_eventId = App.EventSystem.addEventListener(PanelNotify.HEGEMONY_INFO_UPDATE, this.updateHegemonyInfo, this);
            }
            if (this._match_eventId == 0) {
                this._match_eventId = App.EventSystem.addEventListener(PanelNotify.HEGEMONY_MATCH_UPDATE, this.updataMatchInfo, this);
            }
            this.img_default.visible = true;
            App.Socket.send(37001, null);
        };
        /**
         * 清理
         */
        LabberView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
            if (this._labber_eventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.HEGEMONY_INFO_UPDATE, this._labber_eventId);
                this._labber_eventId = 0;
            }
            if (this._match_eventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.HEGEMONY_MATCH_UPDATE, this._match_eventId);
                this._match_eventId = 0;
            }
        };
        /**
         * 销毁
         */
        LabberView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        LabberView.prototype.openHegemonyTips = function () {
            App.WinManager.openWin(WinName.HEGEMONY_LABBER_TIPS);
        };
        LabberView.prototype.openHegemonyReward = function () {
            App.WinManager.openWin(WinName.HEGEMONY_LABBER_REWARD);
        };
        LabberView.prototype.openHegemonyMatch = function () {
            App.Socket.send(37002, null);
        };
        LabberView.prototype.openRanking = function () {
            App.WinManager.openWin(WinName.RANK, ConstRankName.KING);
        };
        LabberView.prototype.buyHegemonyMatchTimes = function () {
            if (this._labbermodel.left_num >= this._labbermodel.left_total) {
                var text = [{ text: "挑战次数已达到上限", style: { textColor: 0xffffff, size: 24, fontFamily: "SimHei" } }];
                App.GlobalTips.showTips(text);
                return;
            }
            var info = (App.ConfigManager.getLabberBuyTimeInfo());
            var okCB = function (selected) {
                App.Socket.send(37003, null);
            };
            var textFlow = [{ text: "确定花费", style: { textColor: 0xff8500 } }, { text: info.buy_gold + "元宝", style: { textColor: 0xffea01 } }, { text: "购买一次天梯挑战次数吗？", style: { textColor: 0xff8500 } }, { text: "\n今日已购买次数：" }, { text: (info.buy_num - this._labbermodel.left_buy_times) + "/" + info.buy_num, style: { textColor: 0x22a322 } }];
            App.GlobalTips.showAlert({ style: 0 /* COMMON */, textFlow: textFlow, okCB: okCB, context: this, needCheckBox: false });
        };
        LabberView.prototype.updateHegemonyInfo = function () {
            var _this = this;
            this.lb_name.text = this._labbermodel.hegemony_name;
            this.lb_tier.text = GlobalUtil.getTierName(this._labbermodel.tier);
            this.lb_tierdetail.text = GlobalUtil.getTierName(this._labbermodel.tier).substring(2, GlobalUtil.getTierName(this._labbermodel.tier).length) + GlobalUtil.getTierLvName(this._labbermodel.lv);
            this.lb_winmatch.text = this._labbermodel.win_match + "";
            this.lb_rank.text = this._labbermodel.my_rank + "";
            if (this._labbermodel.my_rank == 0)
                this.lb_rank.text = "未上榜";
            //this.lb_leftcount.text = this._labbermodel.left_num + "/" + this._labbermodel.left_total;
            this.lb_leftcount.textFlow = [{ text: this._labbermodel.left_num + "", style: { textColor: 0x00f829 } }, { text: "/" + this._labbermodel.left_total }];
            this.lb_winingrate.text = this._labbermodel.wining_rate + "%";
            var info = (App.ConfigManager.getLabberBuyTimeInfo());
            this.lb_recovertime.text = "（每" + (info.recover_time / 3600) + "小时恢复一次）";
            this.img_winingstreak.visible = this._labbermodel.is_winingstreak;
            for (var i = 0; i < this.img_stars.length; i++) {
                if (i < this._labbermodel.star)
                    this.img_stars[i].visible = true;
                else
                    this.img_stars[i].visible = false;
            }
            RES.getResAsync(GlobalUtil.getTierIcon(this._labbermodel.tier), function (texture) {
                _this.img_tier.source = texture;
                _this.img_tier.width = texture.textureWidth;
                _this.img_tier.height = texture.textureHeight;
            }, this);
            var str = GlobalUtil.getCareerPic(RoleManager.getInstance().roleInfo.sex, RoleManager.getInstance().roleInfo.career);
            RES.getResAsync(str, function (texture) {
                _this.img_career.source = texture;
                _this.img_career.width = texture.textureWidth / 2;
                _this.img_career.height = texture.textureHeight / 2;
            }, this);
        };
        LabberView.prototype.updataMatchInfo = function () {
            this.img_default.visible = true;
            this._match_time = 0;
            this._match_count = this._labbermodel.match_list.length;
            this._list_match.dataProvider = new eui.ArrayCollection(this._labbermodel.match_list);
            if (this._match_timeId == 0) {
                this._match_timeId = App.GlobalTimer.addSchedule(50, 0, this.matchTimerHandler, this);
            }
        };
        LabberView.prototype.matchTimerHandler = function () {
            this._match_time += 0.05;
            if (this.scr_match.viewport.scrollV >= (this._match_count - 1) * 450) {
                if (this._match_timeId != 0 && this._match_time >= 5) {
                    App.GlobalTimer.remove(this._match_timeId);
                    this._match_timeId = 0;
                    App.WinManager.closeWin(WinName.HEGEMONY);
                    App.WinManager.openWin(WinName.COUNTERDOWN);
                }
                //this.enterHegemony();
            }
            else {
                this.scr_match.viewport.scrollV += 50;
            }
        };
        return LabberView;
    }(BaseChildView));
    game.LabberView = LabberView;
    __reflect(LabberView.prototype, "game.LabberView");
    var LabberMatchItem = (function (_super) {
        __extends(LabberMatchItem, _super);
        function LabberMatchItem() {
            var _this = _super.call(this) || this;
            _this.skinName = "LabberMatchItemSkin";
            return _this;
        }
        LabberMatchItem.prototype.dataChanged = function () {
            var _this = this;
            var lv = this.data;
            this.lmv = lv;
            this.lb_tier.text = lv.getTierName();
            this.lb_name.text = lv.name;
            this.lb_pwin.text = lv.getWiningRateText();
            RES.getResAsync(lv.getCareerIcon(), function (texture) {
                _this.img_career.source = texture;
                _this.img_career.width = texture.textureWidth / 2;
                _this.img_career.height = texture.textureHeight / 2;
            }, this);
        };
        return LabberMatchItem;
    }(eui.ItemRenderer));
    game.LabberMatchItem = LabberMatchItem;
    __reflect(LabberMatchItem.prototype, "game.LabberMatchItem");
})(game || (game = {}));
//# sourceMappingURL=LabberView.js.map
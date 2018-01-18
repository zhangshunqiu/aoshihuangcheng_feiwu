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
 * 天梯争霸tips界面 2017/06/20.
 */
var game;
(function (game) {
    var LabberRewardView = (function (_super) {
        __extends(LabberRewardView, _super);
        function LabberRewardView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._list_reward = new eui.List();
            _this._reward_eventId = 0;
            _this._labbermodel = game.LabberHegemonyModel.getInstance();
            return _this;
        }
        LabberRewardView.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.closeWin(WinName.HEGEMONY_LABBER_REWARD);
            }, this);
            this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.closeWin(WinName.HEGEMONY_LABBER_REWARD);
            }, this);
            this.scr_reward.viewport = this._list_reward;
            this.scr_reward.scrollPolicyH = eui.ScrollPolicy.OFF;
            this._list_reward.itemRenderer = LabberRewardItem;
            // this._labbermodel.tier_reward_list = App.ConfigManager.getLabberTierRewardInfo();
            // this._labbermodel.rank_reward_List = App.ConfigManager.getLabberRankRewardInfo();
            this.item1.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.GlobalTips.showItemTips(ClientType.BASE_ITEM, _this._labbermodel.tier_reward_list[0][1], null);
            }, this);
            this.item2.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.GlobalTips.showItemTips(ClientType.BASE_ITEM, _this._labbermodel.tier_reward_list[1][1], null);
            }, this);
            this.item3.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.GlobalTips.showItemTips(ClientType.BASE_ITEM, _this._labbermodel.tier_reward_list[2][1], null);
            }, this);
            this.item4.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.GlobalTips.showItemTips(ClientType.BASE_ITEM, _this._labbermodel.tier_reward_list[3][1], null);
            }, this);
        };
        /**
       * 打开窗口
       */
        LabberRewardView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (this._reward_eventId == 0) {
                this._reward_eventId = App.EventSystem.addEventListener(PanelNotify.HEGEMONY_REWARD_UPDATE, this.updateRewardInfo, this);
            }
            App.Socket.send(37004, null);
            //this.updateRewardInfo();
        };
        /**
         * 关闭窗口
         */
        LabberRewardView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        LabberRewardView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._reward_eventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.HEGEMONY_REWARD_UPDATE, this._reward_eventId);
                this._reward_eventId = 0;
            }
        };
        /**
         * 销毁
         */
        LabberRewardView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        LabberRewardView.prototype.updateRewardInfo = function () {
            var _this = this;
            RES.getResAsync(GlobalUtil.getTierIcon(this._labbermodel.my_tier), function (texture) {
                _this.img_tier.source = texture;
                _this.img_tier.width = texture.width;
                _this.img_tier.height = texture.height;
            }, this);
            this.lb_lv.text = this._labbermodel.my_lv + "";
            this.lb_margin.text = this._labbermodel.my_margin + "";
            this.item1.setItemNumVisible(true);
            this.item2.setItemNumVisible(true);
            this.item3.setItemNumVisible(true);
            this.item4.setItemNumVisible(true);
            this.item1.updateBaseItem(ClientType.BASE_ITEM, this._labbermodel.tier_reward_list[0][1], this._labbermodel.tier_reward_list[0][2]);
            this.item2.updateBaseItem(ClientType.BASE_ITEM, this._labbermodel.tier_reward_list[1][1], this._labbermodel.tier_reward_list[1][2]);
            this.item3.updateBaseItem(ClientType.BASE_ITEM, this._labbermodel.tier_reward_list[2][1], this._labbermodel.tier_reward_list[2][2]);
            this.item4.updateBaseItem(ClientType.BASE_ITEM, this._labbermodel.tier_reward_list[3][1], this._labbermodel.tier_reward_list[3][2]);
            // this.item1.lb_num.visible = true;
            // this.item1.lb_num.text = this._labbermodel.tier_reward_list[0][2];
            // this.item2.lb_num.visible = true;
            // this.item2.lb_num.text = this._labbermodel.tier_reward_list[1][2];
            // this.item3.lb_num.visible = true;
            // this.item3.lb_num.text = this._labbermodel.tier_reward_list[2][2];
            // this.item4.lb_num.visible = true;
            // this.item4.lb_num.text = this._labbermodel.tier_reward_list[3][2];
            this._list_reward.dataProvider = new eui.ArrayCollection(this._labbermodel.reward_list);
        };
        return LabberRewardView;
    }(BaseView));
    game.LabberRewardView = LabberRewardView;
    __reflect(LabberRewardView.prototype, "game.LabberRewardView");
    var LabberRewardItem = (function (_super) {
        __extends(LabberRewardItem, _super);
        function LabberRewardItem() {
            var _this = _super.call(this) || this;
            _this.skinName = "LabberRewardItemSkin";
            _this.item.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.showRewardTips();
            }, _this);
            return _this;
        }
        LabberRewardItem.prototype.dataChanged = function () {
            var _this = this;
            var lv = this.data;
            this.lrv = lv;
            if (lv.player_id > 0) {
                this.lb_name.text = lv.name;
                this.lb_lv.text = lv.lv + "";
                this.lb_margin.text = lv.margin + "场";
                this.img_tier.visible = true;
                RES.getResAsync(GlobalUtil.getTierIcon(lv.tier), function (texture) {
                    _this.img_tier.source = texture;
                    _this.img_tier.width = texture.textureWidth;
                    _this.img_tier.height = texture.textureHeight;
                }, this);
            }
            else {
                this.lb_name.text = "珍稀奖励，等你来夺";
                this.lb_lv.text = "";
                this.lb_margin.text = "";
                this.img_tier.visible = false;
            }
            this.item.setItemNumVisible(true);
            this.item.updateBaseItem(ClientType.BASE_ITEM, lv.reward_id, lv.reward_num);
            // this.item.lb_num.visible = true;
            // this.item.lb_num.text = lv.reward_num + "";
            if (lv.rank == 1) {
                this.img_rank.visible = true;
                RES.getResAsync("ranking list_1_png", function (texture) {
                    _this.img_rank.source = texture;
                    _this.img_rank.width = texture.textureWidth;
                    _this.img_rank.height = texture.textureHeight;
                }, this);
            }
            else if (lv.rank == 2) {
                this.img_rank.visible = true;
                RES.getResAsync("ranking list_2_png", function (texture) {
                    _this.img_rank.source = texture;
                    _this.img_rank.width = texture.textureWidth;
                    _this.img_rank.height = texture.textureHeight;
                }, this);
            }
            else if (lv.rank == 3) {
                this.img_rank.visible = true;
                RES.getResAsync("ranking list_3_png", function (texture) {
                    _this.img_rank.source = texture;
                    _this.img_rank.width = texture.textureWidth;
                    _this.img_rank.height = texture.textureHeight;
                }, this);
            }
            else {
                this.img_rank.visible = false;
                this.lb_rank.text = lv.rank + "";
            }
        };
        LabberRewardItem.prototype.showRewardTips = function () {
            App.GlobalTips.showItemTips(ClientType.BASE_ITEM, this.lrv.reward_id, null);
        };
        return LabberRewardItem;
    }(eui.ItemRenderer));
    game.LabberRewardItem = LabberRewardItem;
    __reflect(LabberRewardItem.prototype, "game.LabberRewardItem");
})(game || (game = {}));
//# sourceMappingURL=LabberRewardView.js.map
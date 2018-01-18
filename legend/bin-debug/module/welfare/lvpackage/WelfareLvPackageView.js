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
 * 福利等级礼包界面 2017/06/20.
 */
var game;
(function (game) {
    /**
     *  等级礼包界面
     */
    var WelfareLvPackageView = (function (_super) {
        __extends(WelfareLvPackageView, _super);
        function WelfareLvPackageView(skinName) {
            var _this = _super.call(this, "WelfareLvPackageSkin") || this;
            _this._list_levelpackage = new eui.List();
            _this._eventid_level_up = 0; //等级礼包
            _this._welfaredomodel = game.WelfareModel.getInstance();
            return _this;
        }
        WelfareLvPackageView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            //this.isCreated = true;
            //等级礼包
            this.scr_levelpackage.viewport = this._list_levelpackage;
            this.scr_levelpackage.scrollPolicyH = eui.ScrollPolicy.OFF;
            this._list_levelpackage.itemRenderer = LevelPackageItem;
            this.btn_lvback.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.closeWin(WinName.WELFARE);
            }, this);
        };
        WelfareLvPackageView.prototype.updateLevel = function () {
            this._list_levelpackage.dataProvider = new eui.ArrayCollection(this._welfaredomodel.lvList);
        };
        /**
         * 打开窗口
         */
        WelfareLvPackageView.prototype.open = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.open.call(this, openParam);
            if (this._eventid_level_up == 0) {
                this._eventid_level_up = App.EventSystem.addEventListener(PanelNotify.WELFARE_UPDATELEVELLIST, this.updateLevel, this);
            }
            App.Socket.send(22001, null);
            this._list_levelpackage.dataProvider = new eui.ArrayCollection(this._welfaredomodel.lvList);
        };
        /**
         * 清理
         */
        WelfareLvPackageView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
            if (this._eventid_level_up != 0) {
                App.EventSystem.removeEventListener(PanelNotify.MUSTDO_UPDATEACTIVITY, this._eventid_level_up);
                this._eventid_level_up = 0;
            }
        };
        /**
         * 销毁
         */
        WelfareLvPackageView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return WelfareLvPackageView;
    }(BaseChildView));
    game.WelfareLvPackageView = WelfareLvPackageView;
    __reflect(WelfareLvPackageView.prototype, "game.WelfareLvPackageView");
    var LevelPackageItem = (function (_super) {
        __extends(LevelPackageItem, _super);
        function LevelPackageItem() {
            var _this = _super.call(this) || this;
            _this.skinName = "WelfareLvItemSkin";
            _this.btn_take.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.getLevelReward();
            }, _this);
            return _this;
        }
        LevelPackageItem.prototype.getLevelReward = function () {
            App.loglh("send 22002 !");
            App.Socket.send(22002, { id: this.wlv.id });
        };
        LevelPackageItem.prototype.dataChanged = function () {
            var wlv = this.data;
            var lvpackage_info = App.ConfigManager.getLvPackageInfoById(wlv.id);
            this.lb_name.text = lvpackage_info.lv + "级礼包";
            if (lvpackage_info.reincarnation > 0)
                this.lb_name.text = lvpackage_info.reincarnation + "转礼包";
            if (wlv.left_num > 0)
                this.lb_leftnum.textFlow = [{ text: wlv.left_num + "", style: { textColor: 0x00f828 } }];
            else if (wlv.left_num == 0)
                this.lb_leftnum.textFlow = [{ text: wlv.left_num + "", style: { textColor: 0xf20000 } }];
            else if (wlv.left_num == -1)
                this.lb_leftnum.textFlow = [{ text: "不限", style: { textColor: 0x00f828 } }];
            var rewardlist = [];
            rewardlist = lvpackage_info.reward;
            if (rewardlist.length > 0) {
                var reward1 = [];
                reward1 = rewardlist[0];
                if (reward1.length >= 3) {
                    this.baseItem1.setItemNumVisible(true);
                    this.baseItem1.updateBaseItem(ClientType.BASE_ITEM, reward1[1], reward1[2]);
                    // this.baseItem1.lb_num.visible = true;
                    // this.baseItem1.lb_num.text = reward1[2] + "";
                }
            }
            if (rewardlist.length > 1) {
                var reward2 = [];
                reward2 = rewardlist[1];
                if (reward2.length >= 3) {
                    this.baseItem2.setItemNumVisible(true);
                    this.baseItem2.updateBaseItem(ClientType.BASE_ITEM, reward2[1], reward2[2]);
                    // this.baseItem2.lb_num.visible = true;
                    // this.baseItem2.lb_num.text = reward2[2] + "";
                }
            }
            switch (wlv.state) {
                case 0:
                    this.btn_take.visible = false;
                    this.img_take.visible = true;
                    this.img_grey.visible = true;
                    this.img_token.visible = false;
                    break;
                case 1:
                    this.btn_take.visible = true;
                    this.img_take.visible = true;
                    this.img_grey.visible = false;
                    this.img_token.visible = false;
                    break;
                case 2:
                    this.btn_take.visible = false;
                    this.img_take.visible = false;
                    this.img_grey.visible = true;
                    this.img_token.visible = true;
                    break;
            }
            this.wlv = wlv;
        };
        return LevelPackageItem;
    }(eui.ItemRenderer));
    game.LevelPackageItem = LevelPackageItem;
    __reflect(LevelPackageItem.prototype, "game.LevelPackageItem");
})(game || (game = {}));
//# sourceMappingURL=WelfareLvPackageView.js.map
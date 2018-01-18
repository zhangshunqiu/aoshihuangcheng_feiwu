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
 * module ： 转生模块视图
 * author : zrj
*/
var game;
(function (game) {
    var RebornView = (function (_super) {
        __extends(RebornView, _super);
        function RebornView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this.heroModel = game.HeroModel.getInstance();
            _this.skinName = "RebornSkin";
            return _this;
        }
        RebornView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.initView();
            this.readyOpenWin();
        };
        RebornView.prototype.initView = function () {
            this.lb_get.textFlow = [{ text: "获取修为", style: { underline: true } }];
            this.lb_get.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                if (App.RoleManager.roleInfo.lv >= 80) {
                    // let view = new RebornPointView();
                    // PopUpManager.addPopUp({ obj: view });
                    App.WinManager.openWin(WinName.POP_REBORN_POINT);
                }
                else {
                    App.GlobalTips.showTips("80级开启");
                }
            }, this);
            this.btn_upgrade.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.Socket.send(20001, {});
            }, this);
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.ROLE_REBORN_CULTURE, this.gp_xiuwei, 95, -5);
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.ROLE_REBORN_UP, this.gp_up, 150, 10);
            if (this._rebornMc == null) {
                this._rebornMc = new AMovieClip();
                this._rebornMc.x = 355; //this._rebornMc.x + 180;
                this._rebornMc.y = 395; //this._rebornMc.y - 20;
                this._rebornMc.scaleX = 1.7;
                this._rebornMc.scaleY = 1.7;
                this._rebornMc.touchEnabled = false;
                this._rebornMc.visible = false;
                this.addChild(this._rebornMc);
                //this.addChildAt(this._canGetMc, 1);
            }
            if (this._getCultivationMc == null) {
                this._getCultivationMc = new AMovieClip();
                this._getCultivationMc.touchEnabled = false;
                this.lb_get.parent.addChild(this._getCultivationMc);
                this._getCultivationMc.x = 50;
                this._getCultivationMc.y = 15;
                this._getCultivationMc.visible = true;
                //this.addChildAt(this._canGetMc, 1);
            }
            this._getCultivationMc.playMCKey("effhqxw");
            this.updateView();
        };
        RebornView.prototype.effctComplete = function () {
            this._rebornMc.visible = false;
        };
        RebornView.prototype.handleRebornSuccess = function () {
            var _this = this;
            this._rebornMc.visible = true;
            //this._rebornMc.playMCKey("effzs","",1);
            //this._rebornMc.playMCKey("effzs");
            this._rebornMc.playMCKey("effzs", "", 1, null, function () {
                _this._rebornMc.frameRate = 8;
            }, this);
            if (this._rebornMc.hasEventListener(egret.Event.COMPLETE) == false) {
                this._rebornMc.addEventListener(egret.Event.COMPLETE, this.effctComplete, this);
            }
            // let mc = new EffectMovieClip();
            // mc.x = this.width / 2;
            // mc.y = this.height / 3;
            // mc.playMCKey("effzhuansheng", "", 1, null, null, () => {
            // 	if (mc.parent) {
            // 		mc.parent.removeChild(mc);
            // 	}
            // 	mc.destroy();
            // }, this);
            //this.addChild(mc);
        };
        RebornView.prototype.updateView = function () {
            var curInfo = App.ConfigManager.getRebornAttrInfoById(RoleManager.getInstance().roleInfo.turn);
            var nextInfo = App.ConfigManager.getRebornAttrInfoById(RoleManager.getInstance().roleInfo.turn + 1);
            if (curInfo) {
                var textArrL = [];
                if (curInfo["ac"]) {
                    textArrL.push({ text: "攻击" + "：" + curInfo["ac"], style: { textColor: 0xbfbfbf } });
                    textArrL.push({ text: "\n" });
                }
                if (curInfo["hp"]) {
                    textArrL.push({ text: ConstAttribute["hp"] + "：" + curInfo["hp"], style: { textColor: 0xbfbfbf } });
                    textArrL.push({ text: "\n" });
                }
                if (curInfo["def"]) {
                    textArrL.push({ text: ConstAttribute["def"] + "：" + curInfo["def"], style: { textColor: 0xbfbfbf } });
                    textArrL.push({ text: "\n" });
                }
                if (curInfo["sdef"]) {
                    textArrL.push({ text: ConstAttribute["sdef"] + "：" + curInfo["sdef"], style: { textColor: 0xbfbfbf } });
                    textArrL.push({ text: "\n" });
                }
                textArrL.pop();
                this.lb_attr.x = 130;
                this.lb_attr.textFlow = textArrL;
                this.bmlb_cap.text = String(curInfo["grade"]);
            }
            else {
                this.lb_attr.x = 155;
                this.lb_attr.text = "未激活";
                this.bmlb_cap.text = String(0);
            }
            if (nextInfo) {
                var textArrR = [];
                if (nextInfo["ac"]) {
                    textArrR.push({ text: "攻击" + "：" + nextInfo["ac"], style: { textColor: 0x0de903 } });
                    textArrR.push({ text: "\n" });
                }
                if (nextInfo["hp"]) {
                    textArrR.push({ text: ConstAttribute["hp"] + "：" + nextInfo["hp"], style: { textColor: 0x0de903 } });
                    textArrR.push({ text: "\n" });
                }
                if (nextInfo["def"]) {
                    textArrR.push({ text: ConstAttribute["def"] + "：" + nextInfo["def"], style: { textColor: 0x0de903 } });
                    textArrR.push({ text: "\n" });
                }
                if (nextInfo["sdef"]) {
                    textArrR.push({ text: ConstAttribute["sdef"] + "：" + nextInfo["sdef"], style: { textColor: 0x0de903 } });
                    textArrR.push({ text: "\n" });
                }
                textArrR.pop();
                this.lb_attr_next.x = 500;
                this.lb_attr_next.textFlow = textArrR;
                this.lb_cost.text = nextInfo.need_num;
            }
            else {
                this.lb_attr_next.x = 525;
                this.lb_attr_next.text = "已满级";
                this.lb_cost.text = "0";
            }
            // this.bmlb_cap.text = String(RoleManager.getInstance().getHeroFightcap());
            this.lb_level.textFlow = [{ text: "当前转生等级：" }, { text: RoleManager.getInstance().roleInfo.turn + "转", style: { textColor: 0xff7200 } }];
            this.lb_own.text = String(RoleManager.getInstance().roleInfo.lifeExp);
        };
        /**
         * 打开窗口
         */
        RebornView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            App.EventSystem.addEventListener(PanelNotify.REBORN_UPDATE_VIEW, this.updateView, this);
            App.EventSystem.addEventListener(PanelNotify.REBORN_SUCCESS, this.handleRebornSuccess, this);
        };
        /**
         * 关闭窗口
         */
        RebornView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        RebornView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            App.EventSystem.removeEventListener(PanelNotify.REBORN_UPDATE_VIEW);
            App.EventSystem.removeEventListener(PanelNotify.REBORN_SUCCESS);
            if (this._rebornMc) {
                this._rebornMc.visible = false;
                if (this._rebornMc.hasEventListener(egret.Event.COMPLETE)) {
                    this._rebornMc.removeEventListener(egret.Event.COMPLETE, this.effctComplete, this);
                }
                this._rebornMc.stop();
                this._rebornMc.destroy();
                this._rebornMc = null;
            }
        };
        /**
         * 销毁
         */
        RebornView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return RebornView;
    }(BaseView));
    game.RebornView = RebornView;
    __reflect(RebornView.prototype, "game.RebornView");
})(game || (game = {}));
//# sourceMappingURL=RebornView.js.map
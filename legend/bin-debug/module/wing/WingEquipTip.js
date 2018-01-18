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
 * Author liuyonggen
 * 翅膀装备属性弹窗  2017/11/16
 */
var game;
(function (game) {
    var WingEquipTip = (function (_super) {
        __extends(WingEquipTip, _super);
        function WingEquipTip(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._wingModel = game.WingModel.getInstance();
            _this._backpackModel = game.BackpackModel.getInstance();
            _this._eventId = 0;
            _this._wingEquipStepEventId = 0;
            return _this;
        }
        WingEquipTip.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.re_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.btn_goStep.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goStep, this);
        };
        WingEquipTip.prototype.openWingEquipTip = function (data) {
            this._data = data;
            this.lb_name.text = data.name;
            this.lb_step.text = data.step;
            this.btn_goStep.visible = data.goStep;
            this.lb_attack.text = data.attack;
            // this.lb_defense.text = data.defense;
            this.lb_equipScore.text = data.score;
            this.img_icon.source = data.source + "_png";
            this.img_icon_frame.source = data.frameSource;
        };
        WingEquipTip.prototype.goStep = function () {
            App.Socket.send(15026, { id: this._wingModel.wingInfo.heroId, pos: this._data.pos, good_id: this._wingModel.wingInfo.wingEquip[this._data.pos - 1].good_id });
        };
        WingEquipTip.prototype.onWingEquipStepSuccess = function () {
            this.lb_step.text = this._data.step + 1;
            this.btn_goStep.visible = false;
            this.lb_attack.text = this._wingModel.wingInfo.wingEquipAttr[this._data.attackType];
            switch (this._data.pos) {
                case 1:
                    this.lb_equipScore.text = this._wingModel.wingInfo.wingEquipAttr.zhengyuScore + "";
                    this.img_icon_frame.source = QualityFrame[this._wingModel.wingInfo.WingEquipStep.zhengyuQuality];
                    break;
                case 2:
                    this.lb_equipScore.text = this._wingModel.wingInfo.wingEquipAttr.fuyuScore + "";
                    this.img_icon_frame.source = QualityFrame[this._wingModel.wingInfo.WingEquipStep.fuyuQuality];
                    break;
                case 3:
                    this.lb_equipScore.text = this._wingModel.wingInfo.wingEquipAttr.rongyuScore + "";
                    this.img_icon_frame.source = QualityFrame[this._wingModel.wingInfo.WingEquipStep.rongyuQuality];
                    break;
                case 4:
                    this.lb_equipScore.text = this._wingModel.wingInfo.wingEquipAttr.xuyuScore + "";
                    this.img_icon_frame.source = QualityFrame[this._wingModel.wingInfo.WingEquipStep.xuyuQuality];
                    break;
            }
            this.joinEffect();
        };
        WingEquipTip.prototype.joinEffect = function () {
            if (this._wingEquipStepMc == null) {
                this._wingEquipStepMc = new AMovieClip();
            }
            this.gp_main.addChild(this._wingEquipStepMc);
            this._wingEquipStepMc.x = 177;
            this._wingEquipStepMc.y = 314;
            this._wingEquipStepMc.playMCKey("effsjcg", "", 1);
            if (this._wingEquipStepMc.hasEventListener(egret.Event.COMPLETE) == false) {
                this._wingEquipStepMc.addEventListener(egret.Event.COMPLETE, this.removeWingEquipStepMc, this);
            }
        };
        WingEquipTip.prototype.removeWingEquipStepMc = function () {
            if (this._wingEquipStepMc) {
                this._wingEquipStepMc.destroy();
                if (this._wingEquipStepMc.parent) {
                    this._wingEquipStepMc.parent.removeChild(this._wingEquipStepMc);
                }
                this._wingEquipStepMc = null;
            }
        };
        /**
         * 打开窗口
         */
        WingEquipTip.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (this._eventId == 0) {
                this._eventId = App.EventSystem.addEventListener(PanelNotify.WING_EQUIP_TIP, this.openWingEquipTip, this);
            }
            if (this._wingEquipStepEventId == 0) {
                this._wingEquipStepEventId = App.EventSystem.addEventListener(PanelNotify.WING_EQUIP_STEP_SUCCESS, this.onWingEquipStepSuccess, this);
            }
        };
        /**
         * 关闭窗口
         */
        WingEquipTip.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        /**
         * 清理
         */
        WingEquipTip.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._eventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WING_EQUIP_TIP, this._eventId);
                this._eventId = 0;
            }
            if (this._wingEquipStepEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WING_EQUIP_STEP_SUCCESS, this._wingEquipStepEventId);
                this._wingEquipStepEventId = 0;
            }
            this.removeWingEquipStepMc();
        };
        /**
         * 销毁
         */
        WingEquipTip.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return WingEquipTip;
    }(BaseView));
    game.WingEquipTip = WingEquipTip;
    __reflect(WingEquipTip.prototype, "game.WingEquipTip");
})(game || (game = {}));
//# sourceMappingURL=WingEquipTip.js.map
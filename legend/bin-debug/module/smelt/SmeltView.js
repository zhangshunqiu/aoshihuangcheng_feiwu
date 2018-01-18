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
 * module ： 熔炼模块视图
 * author : zrj
*/
var game;
(function (game) {
    var SmeltView = (function (_super) {
        __extends(SmeltView, _super);
        function SmeltView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this.itemArray = [];
            _this.smeltModel = game.SmeltModel.getInstance();
            _this.TOTAL_COUNT = 16;
            return _this;
        }
        SmeltView.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            RES.getResAsync("smelt_title_png", function (texture) {
                _this.commonWin.img_title.source = texture;
            }, this);
            this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
            this.scroller.scrollPolicyV = eui.ScrollPolicy.OFF;
            this.smeltModel.selectedQuality[0] = true;
            //默认选白色
            // this.cbox0.selected = true;
            this.smeltModel.selectedQuality[0] = true;
            // this.cbox1.selected = true;
            this.smeltModel.selectedQuality[1] = true;
            this.cbox2.selected = true;
            this.smeltModel.selectedQuality[2] = true;
            // this.cbox_keep.selected = true;
            // this.cbox_keep.touchEnabled = false;
            this.initView();
            this.updateView();
            this.validateNow();
        };
        SmeltView.prototype.initView = function () {
            var _this = this;
            this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                // App.WinManager.closeWin(WinName.SMELT);
                WinManager.getInstance().closePopWin(WinName.POP_SMELT);
            }, this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                // App.WinManager.closeWin(WinName.SMELT);
                WinManager.getInstance().closePopWin(WinName.POP_SMELT);
            }, this);
            var selectQuality = function (quality, isSelected) {
                if (isSelected) {
                    _this.smeltModel.selectedQuality[quality] = true;
                }
                else {
                    _this.smeltModel.selectedQuality[quality] = false;
                }
                // this.updateView();  //注释掉
            };
            // this.cbox_keep.addEventListener(eui.UIEvent.CHANGE,(event:eui.UIEvent)=>{
            // 	// console.log(event.target.selected);
            // },this)
            // this.cbox0.addEventListener(eui.UIEvent.CHANGE,(event:eui.UIEvent)=>{
            // 	// console.log(event.target.selected);
            // },this)
            // this.cbox1.addEventListener(eui.UIEvent.CHANGE,(event:eui.UIEvent)=>{
            // 	// console.log(event.target.selected);
            // },this)
            this.cbox2.addEventListener(eui.UIEvent.CHANGE, function (event) {
                // console.log(event.target.selected);
                selectQuality.call(_this, 0, event.target.selected);
                selectQuality.call(_this, 1, event.target.selected);
                selectQuality.call(_this, 2, event.target.selected);
                _this.updateView();
            }, this);
            this.cbox3.addEventListener(eui.UIEvent.CHANGE, function (event) {
                // console.log(event.target.selected);
                selectQuality.call(_this, 3, event.target.selected);
                _this.updateView();
            }, this);
            this.btn_smelt.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                if (_this.smeltModel._dataArray.length == 0) {
                    App.GlobalTips.showTips("没有可熔炼的装备！");
                    return;
                }
                // let a = this.smeltModel.selectedQuality[0] ? 1 :0;
                // let b = this.smeltModel.selectedQuality[1] ? 1 :0;
                // let c = this.smeltModel.selectedQuality[2] ? 1 :0;
                // let d = this.smeltModel.selectedQuality[3] ? 1 :0;
                var arr = [];
                for (var i = 0; i < _this.smeltModel.curSmeltArr.length; i++) {
                    arr.push(_this.smeltModel.curSmeltArr[i].id);
                }
                App.Socket.send(14011, { ids: arr });
            }, this);
            var layout = new eui.TileLayout();
            layout.requestedRowCount = 4;
            layout.requestedColumnCount = 4;
            layout.verticalGap = 35;
            layout.horizontalGap = 50;
            layout.horizontalAlign = egret.HorizontalAlign.CENTER;
            layout.verticalAlign = egret.VerticalAlign.MIDDLE;
            this.gp_equip.layout = layout;
            for (var i = 0; i < this.TOTAL_COUNT; i++) {
                var item = new customui.BaseItem();
                item.setStopShowTips(true);
                this.itemArray.push(item);
                this.gp_equip.addChild(item);
            }
        };
        SmeltView.prototype.handleSmeltSuccess = function () {
            var _loop_1 = function (i) {
                if (this_1.smeltModel._dataArray[i]) {
                    var effectMc_1 = new EffectMovieClip();
                    effectMc_1.playMCKey("effbsxqcg", "", 1, null, null, function () {
                        if (effectMc_1.parent) {
                            effectMc_1.parent.removeChild(effectMc_1);
                        }
                        effectMc_1.destroy();
                    }, this_1);
                    this_1.itemArray[i].addChild(effectMc_1);
                    effectMc_1.x = 45;
                    effectMc_1.y = 45;
                }
            };
            var this_1 = this;
            for (var i = 0; i < this.TOTAL_COUNT; i++) {
                _loop_1(i);
            }
            // this.smeltModel._dataArray.splice(0, this.smeltModel.curSmeltArr.length);
            this.updateView();
        };
        SmeltView.prototype.updateView = function () {
            this.smeltModel.FilterEquipByScore();
            this.smeltModel.filterEquip();
            this.smeltModel.sortByQuality();
            this.smeltModel.curSmeltArr = [];
            // console.log("smelt updateView ",this.smeltModel._dataArray.length);
            for (var i = 0; i < this.TOTAL_COUNT; i++) {
                if (this.smeltModel._dataArray[i]) {
                    this.itemArray[i].updateBaseItem(ClientType.EQUIP, this.smeltModel._dataArray[i].good_id);
                    this.smeltModel.curSmeltArr.push(this.smeltModel._dataArray[i]);
                }
                else {
                    this.itemArray[i].updateBaseItem(ClientType.EQUIP, 0);
                    this.itemArray[i].setItemIcon("");
                }
            }
        };
        SmeltView.prototype.checkGuide = function () {
            App.GuideManager.bindClickBtn(this.btn_smelt, 1007, 2);
            App.GuideManager.bindClickBtn(this.commonWin.img_close, 1007, 3);
            App.GuideManager.checkGuide(1007);
        };
        SmeltView.prototype.removeGuide = function () {
            App.GuideManager.removeClickBtn(1007, 2);
            App.GuideManager.removeClickBtn(1007, 3);
        };
        /**
         * 打开窗口
         */
        SmeltView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            App.EventSystem.addEventListener(PanelNotify.SMELT_SMELT_EQUIP, this.handleSmeltSuccess, this);
            if (this.itemArray.length > 0) {
                // this.smeltModel.filterEquip();
                // this.smeltModel.sortByQuality();
                this.updateView();
            }
            this.checkGuide();
        };
        /**
         * 关闭窗口
         */
        SmeltView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        SmeltView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            App.EventSystem.removeEventListener(PanelNotify.SMELT_SMELT_EQUIP);
            this.removeGuide();
        };
        /**
         * 销毁
         */
        SmeltView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return SmeltView;
    }(BaseView));
    game.SmeltView = SmeltView;
    __reflect(SmeltView.prototype, "game.SmeltView");
})(game || (game = {}));
//# sourceMappingURL=SmeltView.js.map
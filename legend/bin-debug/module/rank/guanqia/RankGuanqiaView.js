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
 * 关卡榜视图层
 * author : 杨艺鹏
*/
var game;
(function (game) {
    var RankGuanqiaView = (function (_super) {
        __extends(RankGuanqiaView, _super);
        function RankGuanqiaView(winManagerVO) {
            var _this = _super.call(this, winManagerVO) || this;
            _this.eventId = 0;
            return _this;
        }
        /**
         * 创建皮肤（初始化调用一次）
         */
        RankGuanqiaView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.list_rank.itemRenderer = game.GuanqiaListItem;
        };
        /**
         * 打开窗口(每次打开App.WinManager.openWin(WinName.BACKPACK);都会调用)
         */
        RankGuanqiaView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (this.eventId == 0) {
                this.eventId = App.EventSystem.addEventListener(PanelNotify.RANK_GUANQIA_UPDATE, this.updateUi, this);
            }
            // App.Socket.send(27009,{});
            this.updateUi();
        };
        RankGuanqiaView.prototype.updateUi = function () {
            this.list_rank.dataProvider = game.RankGuanqiaModel.getInstance().rankListArr;
            if (game.RankGuanqiaModel.getInstance().myRank == 100) {
                this.lb_myRank.textFlow = [{ text: "我的排名: 未上榜", style: { textColor: 0xffa200 } }];
            }
            else {
                this.lb_myRank.textFlow = [{ text: "我的排名: " }, { text: game.RankGuanqiaModel.getInstance().myRank + "", style: { textColor: 0xffa200 } }];
            }
        };
        RankGuanqiaView.prototype.closeWin = function () {
            WinManager.getInstance().closeWin(this.winVo.winName);
        };
        /**
         * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
         */
        RankGuanqiaView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this.eventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.RANK_GUANQIA_UPDATE, this.eventId);
                this.eventId = 0;
            }
        };
        /**
         * 销毁
         */
        RankGuanqiaView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return RankGuanqiaView;
    }(BaseView));
    game.RankGuanqiaView = RankGuanqiaView;
    __reflect(RankGuanqiaView.prototype, "game.RankGuanqiaView");
})(game || (game = {}));
//# sourceMappingURL=RankGuanqiaView.js.map
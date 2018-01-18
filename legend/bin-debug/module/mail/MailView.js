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
* Author: yangyipeng
* Email： hersletter@qq.com
* 邮件UI视图层 2017/06/20.
*/
var game;
(function (game) {
    var MailView = (function (_super) {
        __extends(MailView, _super);
        function MailView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._eventId = 0;
            return _this;
        }
        MailView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.img_close0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.handlerCloseBtn, this);
            this.img_return0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.handlerCloseBtn, this);
            this.btn_reward0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.handlerReceiveReward, this);
            this.img_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.pageBackHandler, this);
            this.img_front.addEventListener(egret.TouchEvent.TOUCH_TAP, this.pageFrontHandler, this);
            this.pageView = new PageView();
            this.pageView.setTabbarEnabled(false);
            this.pageView.itemRenderer = MailGroup;
            this.pageView.horizontalCenter = 1;
            this.pageView.y = 110;
            this.pageView.height = 700;
            this.pageView.width = 570;
            this.pageView.slideCallback = this.pageViewCallback.bind(this);
            this.gp_main0.addChild(this.pageView);
            if (game.MailModel.getInstance().mailArr.length <= 0) {
                // App.Socket.send(21001,{page:1});
                App.Socket.send(21006, {});
            }
            else {
                this.pageView.dataProvider = new eui.ArrayCollection(game.MailModel.getInstance().mailArr);
            }
            this.showPageBtn();
            this.showPageNum();
        };
        MailView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this);
            if (this._eventId == 0) {
                this._eventId = App.EventSystem.addEventListener(PanelNotify.MAIL_INFO_UPDATE, this.HandlerMailChange, this);
            }
        };
        MailView.prototype.pageViewCallback = function () {
            // console.log(123)
            this.showPageBtn();
            this.showPageNum();
        };
        /**
         * 翻后一页
         */
        MailView.prototype.pageBackHandler = function () {
            this.pageView.currentIndex = this.pageView.currentIndex + 1;
            this.showPageBtn();
            this.showPageNum();
            // this.pageView.slideAnimate(-1)
        };
        /**
         * 翻前一页
         */
        MailView.prototype.pageFrontHandler = function () {
            this.pageView.currentIndex = this.pageView.currentIndex - 1;
            this.showPageBtn();
            this.showPageNum();
        };
        /**
         * 显示翻页按钮
         */
        MailView.prototype.showPageBtn = function () {
            //this.pageView.currentIndex是从0开始的
            if (this.pageView.currentIndex <= 0) {
                this.img_front.visible = false;
            }
            else {
                this.img_front.visible = true;
            }
            var len = game.MailModel.getInstance().mailDataLength();
            var maxPage = Math.ceil(len / 6);
            if (this.pageView.currentIndex + 1 >= maxPage) {
                this.img_back.visible = false;
            }
            else {
                this.img_back.visible = true;
            }
        };
        /**
         * 显示页码
         */
        MailView.prototype.showPageNum = function () {
            var curPage = this.pageView.currentIndex + 1;
            var len = game.MailModel.getInstance().mailDataLength();
            var totalPage = Math.ceil(len / 6);
            if (totalPage <= 0) {
                totalPage = 1;
            }
            // if(totalPage == 0)
            // {
            // 	totalPage =1;
            // }
            this.lb_pageNum.text = curPage + " / " + totalPage;
        };
        /**
         * 邮件改变（数量增加）
         */
        MailView.prototype.HandlerMailChange = function () {
            this.pageView.dataProvider = new eui.ArrayCollection(game.MailModel.getInstance().mailArr);
            this.showPageBtn();
            this.showPageNum();
        };
        MailView.prototype.handlerReceiveReward = function () {
            App.Socket.send(21004, {});
        };
        // private getCurPage():number
        // {	
        // 	var page:number = Math.round((this.list_content.scrollV + this.scroller.height)/this.scroller.viewport.contentHeight);
        // 	return page+1;
        // }
        MailView.prototype.handlerCloseBtn = function () {
            App.WinManager.closeWin(WinName.MAIL);
        };
        // public closeWin(callback = null): void 
        // {
        // 	super.closeWin();
        // }
        MailView.prototype.clear = function () {
            _super.prototype.clear.call(this);
            this.img_close0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.handlerCloseBtn, this);
            this.img_return0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.handlerCloseBtn, this);
            this.btn_reward0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.handlerReceiveReward, this);
            if (this._eventId > 0) {
                App.EventSystem.removeEventListener(PanelNotify.MAIL_INFO_UPDATE, this._eventId);
                this._eventId = 0;
            }
            // this.scroller.removeEventListener(egret.Event.CHANGE,this.scrollerChange,this);
        };
        MailView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return MailView;
    }(BaseView));
    game.MailView = MailView;
    __reflect(MailView.prototype, "game.MailView");
    var MailGroup = (function (_super) {
        __extends(MailGroup, _super);
        function MailGroup() {
            var _this = _super.call(this) || this;
            _this.skinName = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n\t\t\t\t<e:Skin class=\"backpackItemSkin\" width=\"570\" height=\"700\" xmlns:e=\"http://ns.egret.com/eui\" xmlns:w=\"http://ns.egret.com/wing\" xmlns:customui=\"customui.*\">\n\t\t\t\t\t<e:Scroller left=\"0\" right=\"0\" top=\"0\" bottom=\"0\">\n\t\t\t\t\t\t<e:List id=\"list\" left=\"0\" right=\"0\" top=\"0\" bottom=\"0\">\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t</e:List>\n\t\t\t\t\t</e:Scroller>\n\t\t\t\t</e:Skin>";
            var layout = new eui.VerticalLayout();
            // layout.requestedColumnCount = 5;
            // layout.requestedRowCount = 5;
            // layout.verticalGap = -4;
            // layout.horizontalGap = 20;
            layout.horizontalAlign = egret.HorizontalAlign.CENTER;
            _this.list.layout = layout;
            // this.list.horizontalCenter = 1;
            _this.list.itemRenderer = game.MailListItem;
            _this.list.itemRendererSkinName = MailListItemSkin;
            _this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, _this.itemTap, _this);
            return _this;
            // this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTap, this,false);
        }
        MailGroup.prototype.reload = function (data) {
            this.list.dataProvider = new eui.ArrayCollection(data);
        };
        MailGroup.prototype.itemTap = function (event) {
            WinManager.getInstance().openPopWin(WinName.POP_MAILDETAIL, event.item);
            // var itemData = event.item;
            // var detailView = new MailDetail(itemData);
            // PopUpManager.addPopUp({obj:detailView,effectType:1,dark:true});
        };
        return MailGroup;
    }(PageViewItem));
    __reflect(MailGroup.prototype, "MailGroup");
})(game || (game = {}));
//# sourceMappingURL=MailView.js.map
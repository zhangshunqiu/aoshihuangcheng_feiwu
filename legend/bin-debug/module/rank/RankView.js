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
 * 排行榜视图层
 * author : 杨艺鹏
*/
var game;
(function (game) {
    var RankView = (function (_super) {
        __extends(RankView, _super);
        function RankView(vo) {
            var _this = _super.call(this, vo) || this;
            _this._eventId = 0;
            _this._eventId1 = 0;
            _this._eventId2 = 0;
            return _this;
        }
        Object.defineProperty(RankView.prototype, "curRankType", {
            get: function () {
                return this._curRankType;
            },
            enumerable: true,
            configurable: true
        });
        RankView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_question.addEventListener(egret.TouchEvent.TOUCH_TAP, this.questionHandler, this);
            this.btn_worShip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.worshipHandler, this);
            //列表
            this.list_rank.itemRenderer = game.RankListItem;
            //dataGroup
            this.dataGp_rank.itemRenderer = game.RankTopView;
            //tabBar
            this.tabBar_rank.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.tabItemHandler, this);
            this.tabBar_rank.dataProvider = new eui.ArrayCollection(["战力榜", "等级榜", "战圣榜", "法神榜", "道尊榜", "遭遇榜", "勋章榜", "王者榜"]);
            this.tabBar_rank.itemRendererSkinName = "RankButtonSkin";
        };
        RankView.prototype.closeWin = function () {
            WinManager.getInstance().closeWin(this.winVo.winName);
        };
        RankView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this);
            if (this._eventId == 0) {
                this._eventId = App.EventSystem.addEventListener(PanelNotify.RANK_INFO_UPDATE, this.handlerRankInfoUpdate, this);
            }
            if (this._eventId1 == 0) {
                this._eventId1 = App.EventSystem.addEventListener(PanelNotify.RANK_WORSHIP_UPDATE, this.showWorShip, this);
            }
            if (this._eventId2 == 0) {
                this._eventId2 = App.EventSystem.addEventListener(PanelNotify.RANK_INFO_NOTHING, this.handlerClearRank, this);
            }
            if (this.openData) {
                this._curRankType = this.openData;
            }
            else {
                this._curRankType = ConstRankName.COMBAT;
            }
            this.getRank();
            this.showWorShip();
        };
        RankView.prototype.tabItemHandler = function (event) {
            this._curRankType = ConstRankIndex[event.itemIndex];
            this.getRank();
            this.showWorShip();
        };
        /**
         * 排行榜controller回调
        */
        RankView.prototype.handlerRankInfoUpdate = function (data) {
            if (data === this._curRankType) {
                // this.showRank();
                var rankItem = game.RankModel.getInstance().rankObj[this._curRankType];
                this.list_rank.dataProvider = rankItem["rankArr"];
                this.dataGp_rank.dataProvider = rankItem["topRank"];
                if (rankItem["my_rank"] == 0) {
                    this.lb_myRank.textFlow = [{ text: "我的排名: 未上榜", style: { textColor: 0xffa200 } }];
                }
                else {
                    this.lb_myRank.textFlow = [{ text: "我的排名: " }, { text: rankItem["my_rank"], style: { textColor: 0xffa200 } }];
                }
                this.showWorShip();
            }
        };
        RankView.prototype.getRank = function () {
            this.tabBar_rank.selectedIndex = ConstRankIndex[this._curRankType];
            //请求
            switch (this._curRankType) {
                case ConstRankName.COMBAT:
                    App.Socket.send(27001, {});
                    break;
                case ConstRankName.LEVEL:
                    App.Socket.send(27002, {});
                    break;
                case ConstRankName.FIGHTER:
                    App.Socket.send(27003, {});
                    break;
                case ConstRankName.MAGIC:
                    App.Socket.send(27004, {});
                    break;
                case ConstRankName.TAOIST:
                    App.Socket.send(27005, {});
                    break;
                case ConstRankName.KILL:
                    App.Socket.send(27006, {});
                    break;
                case ConstRankName.MEMAL:
                    App.Socket.send(27007, {});
                    break;
                case ConstRankName.KING:
                    App.Socket.send(27008, {});
                    break;
                default:
                    break;
            }
        };
        /**
         * 膜拜结果回调
         */
        // private handlerWorship():void {
        // 	var canWorShip = (RankModel.getInstance() as RankModel).rankObj[this._curRankType]["worShip"];
        // 	if(canWorShip == 1)
        // 	{	
        // 		//读表膜拜经验 膜拜金币
        // 		this.btn_worShip.visible = true;
        // 		this.img_gotten.visible = false;
        // 	}else{
        // 		this.btn_worShip.visible = false;
        // 		this.img_gotten.visible = true;
        // 	}
        // 	this.showWorShip();
        // }
        /**
         * 显示膜拜信息
         */
        RankView.prototype.showWorShip = function () {
            //  message pbRankMedal{
            // 	 optional int32 my_rank		= 1; // 我的排名
            // 	 optional int32 worship		= 2; // 膜拜状态 （1可膜拜 2已膜拜）
            // 	 repeated pbRankMedalPlayer list	= 3; // 上榜玩家列表
            //  }
            //读表显示膜拜奖励
            var myLevel = RoleManager.getInstance().roleInfo.lv;
            var turn = RoleManager.getInstance().roleInfo.turn;
            var worShipConfig = ConfigManager.getInstance().getWorShipByIv([myLevel, turn]);
            var worShipData = worShipConfig["reward"];
            for (var i = 0; i < worShipData.length; i++) {
                if (worShipData[i][1] == 100) {
                    this.lb_worShip_exp.text = this.fixNum(worShipData[i][2]);
                }
                if (worShipData[i][1] == 101) {
                    this.lb_worShip_money.text = this.fixNum(worShipData[i][2]);
                }
            }
            //显示是否已膜拜过 膜拜状态（1可膜拜 2已膜拜）
            var canWorShip;
            if (game.RankModel.getInstance().rankObj[this._curRankType]) {
                canWorShip = game.RankModel.getInstance().rankObj[this._curRankType]["worShip"];
            }
            switch (canWorShip) {
                case 1:
                    this.btn_worShip.visible = true;
                    this.img_gotten.visible = false; //没领取
                    break;
                case 2:
                    this.btn_worShip.visible = false;
                    this.img_gotten.visible = true; //已领取
                    break;
                default://canWorShip为空的情况，该排行榜没有排名
                    this.btn_worShip.visible = true;
                    this.img_gotten.visible = false; //没领取
                    break;
            }
            // if(canWorShip)
            // {	
            // 	this.btn_worShip.visible = true;
            // 	this.img_gotten.visible = false;//没领取
            // }else{
            // 	this.btn_worShip.visible = false;
            // 	this.img_gotten.visible = true;//已领取
            // }
        };
        RankView.prototype.fixNum = function (num) {
            if (num / 1000000 >= 1) {
                var _num = num / 10000;
                return _num.toFixed(1) + "万";
            }
            else {
                return num + "";
            }
        };
        /**
         * 清空信息回调（当前排行榜没有排名的时候）
         */
        RankView.prototype.handlerClearRank = function (data) {
            if (data === this._curRankType) {
                this.list_rank.dataProvider = new eui.ArrayCollection([]);
                this.dataGp_rank.dataProvider = new eui.ArrayCollection([]);
                this.lb_myRank.textFlow = [{ text: "我的排名: 未上榜", style: { textColor: 0xffa200 } }];
                this.showWorShip();
            }
        };
        /**
         * 膜拜
         */
        RankView.prototype.worshipHandler = function () {
            var index = ConstRankIndex[this._curRankType];
            App.Socket.send(27020, { rank: index + 1 });
        };
        RankView.prototype.questionHandler = function () {
            WinManager.getInstance().openPopWin(WinName.POP_RANK_QUESTION);
        };
        /**
         * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
         */
        RankView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._eventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.RANK_INFO_UPDATE, this._eventId);
                this._eventId = 0;
            }
            if (this._eventId1 != 0) {
                App.EventSystem.removeEventListener(PanelNotify.RANK_WORSHIP_UPDATE, this._eventId1);
                this._eventId1 = 0;
            }
        };
        /**
         * 销毁
         */
        RankView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return RankView;
    }(BaseView));
    game.RankView = RankView;
    __reflect(RankView.prototype, "game.RankView");
})(game || (game = {}));
//# sourceMappingURL=RankView.js.map
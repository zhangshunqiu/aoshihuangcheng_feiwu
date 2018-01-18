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
 * 排行榜listItem视图层
 * author : 杨艺鹏
*/
var game;
(function (game) {
    var RankListItem = (function (_super) {
        __extends(RankListItem, _super);
        function RankListItem() {
            var _this = _super.call(this) || this;
            _this.skinName = RankListItemSkin;
            return _this;
        }
        RankListItem.prototype.childrenCreated = function () {
            var _this = this;
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.openPopWin(WinName.POP_PLAYER_MSG, _this._rankVo.playerId);
            }, this);
        };
        RankListItem.prototype.dataChanged = function () {
            // this._rankVo = this.data;
            this.updateUi(this.data);
        };
        RankListItem.prototype.updateUi = function (rankVo) {
            this._rankVo = rankVo;
            //显示对应排行榜皮肤
            this.showUi();
        };
        RankListItem.prototype.showUi = function () {
            var rankView = WinManager.getInstance().getWin(WinName.RANK);
            var rankType = rankView.curRankType;
            switch (rankType) {
                case ConstRankName.COMBAT:
                    this.showCommonUi();
                    break;
                case ConstRankName.LEVEL:
                    this.showLevelUi();
                    break;
                case ConstRankName.FIGHTER:
                    this.showCommonUi();
                    break;
                case ConstRankName.MAGIC:
                    this.showCommonUi();
                    break;
                case ConstRankName.TAOIST:
                    this.showCommonUi();
                    break;
                case ConstRankName.KILL:
                    this.showCommonUi();
                    break;
                case ConstRankName.MEMAL:
                    this.showCommonUi();
                    break;
                case ConstRankName.KING:
                    this.showKingUi();
                    break;
                default:
                    break;
            }
        };
        /**
         * 显示普通榜
         */
        RankListItem.prototype.showCommonUi = function () {
            this.skinName = RankListItemSkin;
            //称号图片
            this.showHonour();
            //名字
            if (this._rankVo.name) {
                this.lb_name.text = this._rankVo.name;
            }
            //月卡 + vip等级
            if (this._rankVo.month_card) {
                this.img_yue.visible = true;
            }
            else {
                this.img_yue.visible = false;
            }
            if (this._rankVo.vip) {
                this.img_vip.visible = true;
                this.bitmap_vip.text = this._rankVo.vip + "";
            }
            else {
                this.img_vip.visible = false;
                this.bitmap_vip.text = "";
            }
            //玩家等级
            if (this._rankVo.lv) {
                this.lb_level.visible = true;
                if (this._rankVo.turn) {
                    this.lb_level.text = this._rankVo.turn + "转" + this._rankVo.lv + "级";
                }
                else {
                    this.lb_level.text = this._rankVo.lv + "级";
                }
            }
            else {
                this.lb_level.visible = false;
            }
            //排行榜描述
            if (this._rankVo.rankData) {
                this.lb_rankData.text = this._rankVo.rankData;
            }
            else {
                this.lb_rankData.text = null;
            }
            //排名图标
            if (this._rankVo.rank == 1) {
                this.img_rankNum.source = "ranking list_1_png";
                this.lb_rank.text = "";
            }
            else if (this._rankVo.rank == 2) {
                this.img_rankNum.source = "ranking list_2_png";
                this.lb_rank.text = "";
            }
            else if (this._rankVo.rank == 3) {
                this.img_rankNum.source = "ranking list_3_png";
                this.lb_rank.text = "";
            }
            else {
                this.img_rankNum.source = null;
                this.lb_rank.text = this._rankVo.rank + "";
            }
        };
        /**
         * 显示等级榜
         */
        RankListItem.prototype.showLevelUi = function () {
            this.skinName = "RankListItemLevel";
            //名字
            if (this._rankVo.name) {
                this.lb_name_level.text = this._rankVo.name;
            }
            //月卡 + vip等级
            if (this._rankVo.month_card) {
                this.img_yue_level.visible = true;
            }
            else {
                this.img_yue_level.visible = false;
            }
            if (this._rankVo.vip) {
                this.img_vip_level.visible = true;
                this.bitmap_vip_level.text = this._rankVo.vip + "";
            }
            else {
                this.img_vip_level.visible = false;
                this.bitmap_vip_level.text = "";
            }
            //玩家等级
            if (this._rankVo.lv) {
                this.lb_lv_level.visible = true;
                if (this._rankVo.turn) {
                    this.lb_lv_level.text = this._rankVo.turn + "转" + this._rankVo.lv + "级";
                }
                else {
                    this.lb_lv_level.text = this._rankVo.lv + "级";
                }
            }
            else {
                this.lb_lv_level.visible = false;
            }
            //排名图标
            if (this._rankVo.rank == 1) {
                this.img_rankNum_level.source = "ranking list_1_png";
                this.lb_rank_level.text = "";
            }
            else if (this._rankVo.rank == 2) {
                this.img_rankNum_level.source = "ranking list_2_png";
                this.lb_rank_level.text = "";
            }
            else if (this._rankVo.rank == 3) {
                this.img_rankNum_level.source = "ranking list_3_png";
                this.lb_rank_level.text = "";
            }
            else {
                this.img_rankNum_level.source = null;
                this.lb_rank_level.text = this._rankVo.rank + "";
            }
        };
        /**
         * 显示王者榜
         */
        RankListItem.prototype.showKingUi = function () {
            this.skinName = "RankListItemKing";
            //段位图标
            switch (this._rankVo.grade) {
                case 0:
                    this.img_grade_king.source = "labber_huizhang_qingtong_png";
                    break;
                case 1:
                    this.img_grade_king.source = "labber_huizhang_huangjin_png";
                    break;
                case 2:
                    this.img_grade_king.source = "labber_huizhang_baiyin_png";
                    break;
                case 3:
                    this.img_grade_king.source = "labber_huizhang_zuanshi_png";
                    break;
            }
            if (this._rankVo.gradeLv) {
                this.lb_gradeLv_king.text = this._rankVo.gradeLv + "";
            }
            //场数
            if (this._rankVo.rankData) {
                this.lb_margin_king.text = this._rankVo.rankData;
            }
            else {
                this.lb_margin_king.text = null;
            }
            //名字
            if (this._rankVo.name) {
                this.lb_name_king.text = this._rankVo.name;
            }
            //月卡 + vip等级
            if (this._rankVo.month_card) {
                this.img_yue_king.visible = true;
            }
            else {
                this.img_yue_king.visible = false;
            }
            if (this._rankVo.vip) {
                this.img_vip_king.visible = true;
                this.bitmap_vip_king.text = this._rankVo.vip + "";
            }
            else {
                this.img_vip_king.visible = false;
                this.bitmap_vip_king.text = "";
            }
            //排名图标
            if (this._rankVo.rank == 1) {
                this.img_rankNum_king.source = "ranking list_1_png";
                this.lb_rank_king.text = "";
            }
            else if (this._rankVo.rank == 2) {
                this.img_rankNum_king.source = "ranking list_2_png";
                this.lb_rank_king.text = "";
            }
            else if (this._rankVo.rank == 3) {
                this.img_rankNum_king.source = "ranking list_3_png";
                this.lb_rank_king.text = "";
            }
            else {
                this.img_rankNum_king.source = null;
                this.lb_rank_king.text = this._rankVo.rank + "";
            }
        };
        /**
         * 显示称号
         */
        RankListItem.prototype.showHonour = function () {
            var rankView = WinManager.getInstance().getWin(WinName.RANK);
            var rankType = rankView.curRankType;
            if (this._rankVo.rank <= 10 && this._rankVo.rank > 1) {
                this.img_honour.visible = true;
                switch (rankType) {
                    case ConstRankName.COMBAT:
                        this.img_honour.source = "ranking list_shidagaoshou_png";
                        break;
                    case ConstRankName.LEVEL:
                        break;
                    case ConstRankName.FIGHTER:
                        break;
                    case ConstRankName.MAGIC:
                        break;
                    case ConstRankName.TAOIST:
                        break;
                    case ConstRankName.KILL:
                        this.img_honour.source = "ranking list_shidashashou_png";
                        break;
                    case ConstRankName.MEMAL:
                        break;
                    case ConstRankName.KING:
                        break;
                    default:
                        break;
                }
            }
            else {
                this.img_honour.visible = false;
            }
        };
        RankListItem.prototype.setFirstStyle = function () {
            var rankView = WinManager.getInstance().getWin(WinName.RANK);
            var rankType = rankView.curRankType;
            switch (rankType) {
                case ConstRankName.COMBAT:
                    this.img_bg.alpha = 0.8;
                    this.lb_name.textColor = 0xffea00;
                    break;
                case ConstRankName.LEVEL:
                    this.img_bg_level.alpha = 0.8;
                    this.lb_name_level.textColor = 0xffea00;
                    break;
                case ConstRankName.FIGHTER:
                    this.img_bg.alpha = 0.8;
                    this.lb_name.textColor = 0xffea00;
                    break;
                case ConstRankName.MAGIC:
                    this.img_bg.alpha = 0.8;
                    this.lb_name.textColor = 0xffea00;
                    break;
                case ConstRankName.TAOIST:
                    this.img_bg.alpha = 0.8;
                    this.lb_name.textColor = 0xffea00;
                    break;
                case ConstRankName.KILL:
                    this.img_bg.alpha = 0.8;
                    this.lb_name.textColor = 0xffea00;
                    break;
                case ConstRankName.MEMAL:
                    this.img_bg.alpha = 0.8;
                    this.lb_name.textColor = 0xffea00;
                    break;
                case ConstRankName.KING:
                    this.img_bg_king.alpha = 0.8;
                    this.lb_name_king.textColor = 0xffea00;
                    break;
                default:
                    break;
            }
        };
        return RankListItem;
    }(eui.ItemRenderer));
    game.RankListItem = RankListItem;
    __reflect(RankListItem.prototype, "game.RankListItem");
})(game || (game = {}));
//# sourceMappingURL=RankListItem.js.map
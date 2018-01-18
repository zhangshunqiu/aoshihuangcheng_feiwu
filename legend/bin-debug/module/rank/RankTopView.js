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
 * 排行榜第一名UI视图层
 * author : 杨艺鹏
*/
var game;
(function (game) {
    var RankTopView = (function (_super) {
        __extends(RankTopView, _super);
        function RankTopView() {
            var _this = _super.call(this) || this;
            _this.skinName = RankTopSkin;
            return _this;
            // App.EventSystem.addEventListener("rankk",this.setRankType,this)
        }
        RankTopView.prototype.dataChanged = function () {
            //排名图片
            // this.img_rankNum.source = "ranking list_1_png";
            //显示人物
            this.showHero();
            //称号（绝世杀神、。。。。）
            this.setHonor();
            this.rankListItem.updateUi(this.data);
            this.rankListItem.setFirstStyle();
        };
        RankTopView.prototype.showHero = function () {
            var _this = this;
            var rankView = WinManager.getInstance().getWin(WinName.RANK);
            var rankType = rankView.curRankType;
            var heroMsg = game.RankModel.getInstance().rankObj[rankType]["model"];
            if (heroMsg[0]) {
                RES.getResAsync(heroMsg[0] + "_png", function (texture) {
                    _this.img_weapon.source = texture;
                    _this.img_weapon.touchEnabled = false;
                }, this);
            }
            if (heroMsg[1]) {
                RES.getResAsync(heroMsg[0] + "_png", function (texture) {
                    _this.img_body.source = texture;
                    _this.img_body.touchEnabled = false;
                }, this);
            }
            if (heroMsg[2]) {
                RES.getResAsync(heroMsg[0] + "_png", function (texture) {
                    _this.img_wing.source = texture;
                    _this.img_wing.touchEnabled = false;
                }, this);
            }
        };
        RankTopView.prototype.setHonor = function () {
            var rankView = WinManager.getInstance().getWin(WinName.RANK);
            var rankType = rankView.curRankType;
            // var rankType:string = (RankModel.getInstance() as RankModel).curViewRankType;
            switch (rankType) {
                case ConstRankName.COMBAT:
                    this.img_honor.source = "ranking list_tianxaidiyi_png";
                    break;
                case ConstRankName.LEVEL:
                    this.img_honor.source = "";
                    break;
                case ConstRankName.FIGHTER:
                    this.img_honor.source = "";
                    break;
                case ConstRankName.MAGIC:
                    this.img_honor.source = "";
                    break;
                case ConstRankName.TAOIST:
                    this.img_honor.source = "";
                    break;
                case ConstRankName.KILL:
                    this.img_honor.source = "ranking list_dangshishashen_png";
                    break;
                case ConstRankName.MEMAL:
                    this.img_honor.source = "";
                    break;
                case ConstRankName.KING:
                    // switch(this.data.grade)
                    // {
                    // 	case 0:
                    // 		this.img_pic.source = "labber_huizhang_qingtong_png";
                    // 		break;
                    // 	case 1:
                    // 		this.img_pic.source = "labber_huizhang_huangjin_png";
                    // 		break;
                    // 	case 2:
                    // 		this.img_pic.source = "labber_huizhang_baiyin_png";
                    // 		break;
                    // 	case 3:
                    // 		this.img_pic.source = "labber_huizhang_zuanshi_png";
                    // 		break;							
                    // }
                    break;
                default:
                    break;
            }
        };
        return RankTopView;
    }(eui.ItemRenderer));
    game.RankTopView = RankTopView;
    __reflect(RankTopView.prototype, "game.RankTopView");
})(game || (game = {}));
//# sourceMappingURL=RankTopView.js.map
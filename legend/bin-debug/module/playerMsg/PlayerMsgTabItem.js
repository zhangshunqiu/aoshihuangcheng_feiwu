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
var game;
(function (game) {
    var PlayerMsgTabItem = (function (_super) {
        __extends(PlayerMsgTabItem, _super);
        function PlayerMsgTabItem() {
            var _this = _super.call(this) || this;
            _this.skinName = "PlayerMsgTabItemSkin";
            return _this;
            // this.img_head.scaleX = 0.7;
            // this.img_head.scaleY = 0.7;
        }
        PlayerMsgTabItem.prototype.dataChanged = function () {
            var _this = this;
            if (this.data) {
                var sex = this.data["sex"];
                var job = this.data["job"];
                var headKey = App.ConfigManager.getSmallHeroIconBySexAndJob(sex, job, 2);
                RES.getResAsync(headKey + "_png", function (texture) {
                    _this.img_head.source = texture;
                }, this);
                var careerTag = ConstCareerIcon[job];
                RES.getResAsync(careerTag, function (texture) {
                    _this.img_career.source = texture;
                    _this.img_career.visible = true;
                }, this);
                this.img_lock.visible = false;
            }
            else {
                this.img_lock.visible = true;
                this.img_career.visible = false;
            }
            if (this.itemIndex == game.PlayerMsgModel.getInstance().curPos) {
                this.img_select.visible = true;
            }
            // if(this.data) {
            // 	RES.getResAsync(this.data,(texture)=>{
            // 		this.img_head.source = texture;
            // 	},this);
            // 	this.img_lock.visible = false;
            // }else {
            // 	this.img_lock.visible = true;
            // }
        };
        return PlayerMsgTabItem;
    }(eui.ItemRenderer));
    game.PlayerMsgTabItem = PlayerMsgTabItem;
    __reflect(PlayerMsgTabItem.prototype, "game.PlayerMsgTabItem");
})(game || (game = {}));
//# sourceMappingURL=PlayerMsgTabItem.js.map
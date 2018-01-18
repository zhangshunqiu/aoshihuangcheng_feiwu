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
 * 神器数据模型
*/
var game;
(function (game) {
    var ArtifactModel = (function (_super) {
        __extends(ArtifactModel, _super);
        function ArtifactModel() {
            var _this = _super.call(this) || this;
            _this.artifactList = [];
            _this.initList();
            return _this;
        }
        ArtifactModel.prototype.initList = function () {
            var arr = App.ConfigManager.getArtifactArray();
            for (var i = 0; i < arr.length; i++) {
                this.artifactList.push(0);
            }
        };
        ArtifactModel.prototype.updateArtifactList = function (data) {
            // this.artifactList = [];
            var arr = App.ConfigManager.getArtifactArray();
            for (var i = 0; i < arr.length; i++) {
                var exist = undefined;
                for (var k = 0; k < data.length; k++) {
                    var info = App.ConfigManager.getArtifactInfoById(data[k].id);
                    if (info.type == arr[i].type) {
                        exist = data[k].id;
                        break;
                    }
                }
                if (exist) {
                    this.artifactList[i] = exist;
                }
                else {
                    // this.artifactList[i] = 0;
                }
            }
        };
        ArtifactModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        ArtifactModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return ArtifactModel;
    }(BaseModel));
    game.ArtifactModel = ArtifactModel;
    __reflect(ArtifactModel.prototype, "game.ArtifactModel");
})(game || (game = {}));
//# sourceMappingURL=ArtifactModel.js.map
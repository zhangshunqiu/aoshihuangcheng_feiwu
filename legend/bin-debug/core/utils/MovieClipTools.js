var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var MovieClipTools = (function () {
    function MovieClipTools() {
    }
    MovieClipTools.create = function (name, subname, doneCB, context) {
        var textureData;
        var texture;
        function onLoadTextureDataComplete(data) {
            textureData = data;
            RES.getResAsync(name + "_png", onLoadTextureComplete, this);
        }
        function onLoadTextureComplete(data) {
            texture = data;
            build();
        }
        function build() {
            MovieClipTools.factory = new egret.MovieClipDataFactory(textureData, texture);
            var myname = subname ? subname : "";
            var armature = new egret.MovieClip(MovieClipTools.factory.generateMovieClipData(myname));
            if (!armature) {
                App.GlobalTips.showTips("读取特效失败:" + name);
                return;
            }
            else {
                MovieClipTools.MCmap[name] = true;
                doneCB.call(context, armature);
            }
        }
        // if (!MovieClipTools.factory) {
        //     MovieClipTools.factory = new egret.MovieClipDataFactory();
        // }
        RES.getResAsync(name + "_json", onLoadTextureDataComplete, this);
    };
    MovieClipTools.createSync = function (name, subname) {
        if (!this.isExist(name)) {
            return;
        }
        var data = RES.getRes(name + "_json");
        var txtr = RES.getRes(name + "_png");
        var mcFactory = new egret.MovieClipDataFactory(data, txtr);
        var mc = new egret.MovieClip(mcFactory.generateMovieClipData());
        return mc;
    };
    MovieClipTools.isExist = function (name) {
        if (MovieClipTools.MCmap[name]) {
            return true;
        }
        return false;
    };
    MovieClipTools.MCmap = {};
    return MovieClipTools;
}());
__reflect(MovieClipTools.prototype, "MovieClipTools");
//# sourceMappingURL=MovieClipTools.js.map
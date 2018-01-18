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
    var BossComing = (function (_super) {
        __extends(BossComing, _super);
        function BossComing(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._timer = 0;
            return _this;
        }
        BossComing.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
        };
        BossComing.prototype.joinEffect = function () {
            var _this = this;
            // this._bossMc1 = new AMovieClip();
            this._bossMc2 = new AMovieClip();
            // this.gp_effect.addChild(this._bossMc1);
            // this._bossMc1.x = 360;
            // this._bossMc1.y = 518;
            this.gp_effect.addChild(this._bossMc2);
            this._bossMc2.x = 338;
            this._bossMc2.y = 300;
            // this._bossMc1.playMCKey("efftzboss01", "", 3, null, ()=>{
            //     this._bossMc1.frameRate = 10;
            // }, this);
            this._bossMc2.playMCKey("efftzboss02", "", 1);
            // this._bossMc1.addEventListener(egret.Event.COMPLETE, this.closeWin, this);
            this._bossMc2.addEventListener(egret.Event.COMPLETE, function () {
                _this._bossMc2.visible = false;
            }, this);
        };
        BossComing.prototype.joinFrameEffect = function () {
            var _this = this;
            var i = 5;
            var size = 0.2;
            egret.setTimeout(function () {
                if (_this._timer == 0) {
                    _this._timer = App.GlobalTimer.addSchedule(100, 5, function () {
                        _this.img_effect.alpha = size * i;
                        i--;
                    }, _this, _this.closeWin, _this);
                }
            }, this, 2000);
        };
        /**
         * 打开窗口
         */
        BossComing.prototype.openWin = function (openParam) {
            var _this = this;
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this.joinFrameEffect();
            egret.setTimeout(function () {
                _this.joinEffect();
            }, this, 600);
        };
        /**
         * 关闭窗口
         */
        BossComing.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        /**
         * 清理
         */
        BossComing.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._bossMc1) {
                this._bossMc1.removeEventListener(egret.Event.COMPLETE, this.closeWin, this);
                this._bossMc1.destroy();
                this._bossMc1 = null;
            }
            if (this._bossMc2) {
                this._bossMc2.destroy();
                this._bossMc2 = null;
            }
            if (this._timer != 0) {
                App.GlobalTimer.remove(this._timer);
                this._timer = 0;
            }
        };
        /**
         * 销毁
         */
        BossComing.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return BossComing;
    }(BaseView));
    game.BossComing = BossComing;
    __reflect(BossComing.prototype, "game.BossComing");
})(game || (game = {}));
//# sourceMappingURL=BossComing.js.map
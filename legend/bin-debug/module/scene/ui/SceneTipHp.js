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
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 场景气血提示 2017/06/20
 *
 */
var SceneTipsHp = (function (_super) {
    __extends(SceneTipsHp, _super);
    function SceneTipsHp() {
        var _this = _super.call(this) || this;
        SceneTipsHp.TIP_ID_ADD++;
        _this.id = SceneTipsHp.TIP_ID_ADD;
        _this.updateName();
        return _this;
    }
    SceneTipsHp.prototype.updateName = function () {
        if (this.nameText == null) {
            this.nameText = new egret.BitmapText();
            this.addChild(this.nameText);
            this.nameText.font = RES.getRes("numStyleHp_fnt");
            // this.nameText.width = 270;
            // this.nameText.height = 70;
            //this.nameText.textColor = 0xff0000;
            this.nameText.textAlign = egret.HorizontalAlign.CENTER;
            // this.nameText.verticalAlign = egret.VerticalAlign.MIDDLE;
            //this.nameText.strokeColor = 0x000000;
            //this.nameText.stroke = 1;
            //this.nameText.italic = true;
            //this.nameText.size = 26;
            this.nameText.cacheAsBitmap = true;
        }
        // if(this.nameText.text != this.vo.name){
        // 	this.nameText.text = this.vo.name+this.vo.id;
        // 	this.nameText.x = 0 - this.nameText.textWidth/2;
        // 	this.nameText.y = 0 - this.nameText.textHeight/2-24 -120;
        // }
    };
    /**
     * 设置文本
     * @param value 气血数值 >0加血 <0 掉血
     * @param type 类型 0正常气血  1 闪避 2暴击 3反弹
     */
    SceneTipsHp.prototype.setText = function (value, type) {
        if (type === void 0) { type = 0; }
        var str;
        if (value > 0) {
            str = "+" + String(value).replace("0", "a").replace("1", "b").replace("2", "c").replace("3", "d").replace("4", "e").replace("5", "f").replace("6", "g").replace("7", "h").replace("8", "i").replace("9", "j");
        }
        else {
            str = String(value);
        }
        if (type == 3 /* CRIT */) {
            this.nameText.text = "op" + str;
        }
        else if (type == 1 /* DODGE */) {
            this.nameText.text = "st";
        }
        else if (type == 4 /* REBOUND */) {
            this.nameText.text = "qr" + str;
        }
        else {
            this.nameText.text = str;
        }
    };
    SceneTipsHp.prototype.moveTo = function (ex, ey) {
        this.x = ex - 16 - this.nameText.width / 2,
            this.y = ey - 110 - Math.round(Math.random() * 20);
        this.yy = 1;
        this.ex = this.x;
        this.ey = this.y - 160;
    };
    /**
     * 更新
     */
    SceneTipsHp.prototype.update = function () {
        if (Math.abs(this.y - this.ey) < 5) {
            this.destroy();
            return false;
        }
        else {
            // this.x = Math.round(this.x+(this.ex - this.x)/5);
            this.y = Math.round(this.y + (this.ey - this.y) / 5);
        }
        return true;
    };
    SceneTipsHp.prototype.destroy = function () {
        //  this.x = 0;
        //  this.y = 0;
        if (this.parent)
            this.parent.removeChild(this);
        ObjectPool.push(this);
    };
    SceneTipsHp.TIP_ID_ADD = 1;
    return SceneTipsHp;
}(egret.DisplayObjectContainer));
__reflect(SceneTipsHp.prototype, "SceneTipsHp");
//# sourceMappingURL=SceneTipHp.js.map
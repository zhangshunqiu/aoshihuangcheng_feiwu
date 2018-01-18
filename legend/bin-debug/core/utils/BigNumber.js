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
var BigNumber = (function (_super) {
    __extends(BigNumber, _super);
    function BigNumber() {
        var _this = _super.call(this) || this;
        _this.thresholds = [100000000, 10000]; //阈值
        _this.thresholdsNames = ["Y", "W"]; //阈值
        _this.digits = 1; //精度
        return _this;
    }
    BigNumber.prototype.convert = function (input) {
        var out = undefined;
        if (typeof input === "string") {
            out = Number(input);
        }
        else {
            out = input;
        }
        var thresholdsName = undefined;
        for (var index in this.thresholds) {
            if (out >= this.thresholds[index]) {
                out = Number((out / this.thresholds[index]).toFixed(this.digits));
                thresholdsName = [this.thresholdsNames[index]];
                break;
            }
        }
        return thresholdsName ? out + thresholdsName : out.toString();
    };
    return BigNumber;
}(BaseClass));
__reflect(BigNumber.prototype, "BigNumber");
//# sourceMappingURL=BigNumber.js.map
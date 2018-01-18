var UIActionManager;
(function (UIActionManager) {
    UIActionManager.POP_ACTION_SPEED = 250;
    // effectType        0：没有动画 1:从中间轻微弹出 2：从中间猛烈弹出  3：从左向右 4：从右向左 5、从上到下 6、从下到上
    function playUIAction(panel, actionType, doneCB, doneCBContext, isReverse) {
        if (isReverse === void 0) { isReverse = false; }
        var popUpWidth = panel.width;
        var popUpHeight = panel.height;
        var leftX = App.stageWidth / 2 - popUpWidth / 2;
        var upY = App.stageHeight / 2 - popUpHeight / 2;
        var originX = panel.x;
        var originY = panel.y;
        var preAnchorOffsetX = panel.anchorOffsetX;
        var preAnchorOffsetY = panel.anchorOffsetY;
        var prex = panel.x;
        var prey = panel.y;
        var onComplete = function () {
            if (doneCB) {
                doneCB.call(doneCBContext);
            }
            panel.anchorOffsetX = preAnchorOffsetX;
            panel.anchorOffsetY = preAnchorOffsetY;
            panel.x = prex;
            panel.y = prey;
        };
        if (!isReverse) {
            // 正向
            switch (actionType) {
                case 0:
                    onComplete();
                    break;
                case 1:
                    panel.alpha = 0;
                    panel.scaleX = 0.5;
                    panel.scaleY = 0.5;
                    panel.anchorOffsetX = panel.width / 2;
                    panel.anchorOffsetY = panel.height / 2;
                    panel.x = App.stageWidth / 2;
                    panel.y = App.stageHeight / 2;
                    egret.Tween.get(panel).to({ alpha: 1, scaleX: 1, scaleY: 1 }, 300, egret.Ease.backOut).call(onComplete, doneCBContext);
                    break;
                case 2:
                    panel.alpha = 0;
                    panel.scaleX = 0.5;
                    panel.scaleY = 0.5;
                    panel.anchorOffsetX = panel.width / 2;
                    panel.anchorOffsetY = panel.height / 2;
                    panel.x = App.stageWidth / 2;
                    panel.y = App.stageHeight / 2;
                    egret.Tween.get(panel).to({ alpha: 1, scaleX: 1, scaleY: 1 }, 600, egret.Ease.elasticOut).call(onComplete, doneCBContext);
                    break;
                case 3:
                    panel.x = -popUpWidth;
                    egret.Tween.get(panel).to({ x: 0 }, UIActionManager.POP_ACTION_SPEED, egret.Ease.cubicOut).call(onComplete, doneCBContext);
                    break;
                case 4:
                    panel.x = popUpWidth;
                    egret.Tween.get(panel).to({ x: 0 }, UIActionManager.POP_ACTION_SPEED, egret.Ease.cubicOut).call(onComplete, doneCBContext);
                    break;
                case 5:
                    panel.y = originY - popUpHeight;
                    egret.Tween.get(panel).to({ y: originY }, UIActionManager.POP_ACTION_SPEED, egret.Ease.cubicOut).call(onComplete, doneCBContext);
                    break;
                case 6:
                    panel.y = originY + popUpHeight;
                    egret.Tween.get(panel).to({ y: originY }, UIActionManager.POP_ACTION_SPEED, egret.Ease.cubicOut).call(onComplete, doneCBContext);
                    break;
                default:
                    break;
            }
        }
        else {
            // 反向
            switch (actionType) {
                case 0:
                    onComplete();
                    break;
                case 1:
                    panel.anchorOffsetX = panel.width / 2;
                    panel.anchorOffsetY = panel.height / 2;
                    panel.x = App.stageWidth / 2;
                    panel.y = App.stageHeight / 2;
                    egret.Tween.get(panel).to({ alpha: 0, scaleX: 0, scaleY: 0 }, 300, egret.Ease.backIn).call(onComplete, doneCBContext);
                    break;
                case 2:
                    panel.anchorOffsetX = panel.width / 2;
                    panel.anchorOffsetY = panel.height / 2;
                    panel.x = App.stageWidth / 2;
                    panel.y = App.stageHeight / 2;
                    egret.Tween.get(panel).to({ alpha: 0, scaleX: 0, scaleY: 0 }, 300, egret.Ease.backIn).call(onComplete, doneCBContext);
                    break;
                case 3:
                    egret.Tween.get(panel).to({ x: panel.width }, 500, egret.Ease.cubicOut).call(onComplete, doneCBContext);
                    break;
                case 4:
                    egret.Tween.get(panel).to({ x: -panel.width }, 500, egret.Ease.cubicOut).call(onComplete, doneCBContext);
                    break;
                case 5:
                    egret.Tween.get(panel).to({ y: panel.height }, 500, egret.Ease.cubicOut).call(onComplete, doneCBContext);
                    break;
                case 6:
                    egret.Tween.get(panel).to({ y: -panel.height }, 500, egret.Ease.cubicOut).call(onComplete, doneCBContext);
                    break;
                default:
                    break;
            }
        }
    }
    UIActionManager.playUIAction = playUIAction;
    function bindClickAction(obj, changeAP) {
        if (changeAP === void 0) { changeAP = true; }
        var oldFilters = undefined;
        function revert() {
            obj.filters = oldFilters;
        }
        obj.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            oldFilters = obj.filters;
            UIActionManager.setOutLineEffect(obj);
        }, obj);
        obj.addEventListener(egret.TouchEvent.TOUCH_END, function () {
            revert();
        }, obj);
        obj.addEventListener(egret.TouchEvent.TOUCH_CANCEL, function () {
            revert();
        }, obj);
        obj.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, function () {
            revert();
        }, obj);
    }
    UIActionManager.bindClickAction = bindClickAction;
    // export function bindClickAction(obj: eui.UIComponent, changeAP = true) {
    //     let oringScaleX = obj.scaleX;
    //     let oringScaleY = obj.scaleY;
    //     if (changeAP) {
    //         let orginAOX = obj.anchorOffsetX;
    //         let orginAOY = obj.anchorOffsetY;
    //         obj.anchorOffsetX = obj.width / 2;
    //         obj.anchorOffsetY = obj.height / 2;
    //         obj.x = obj.x + (obj.anchorOffsetX - orginAOX);
    //         obj.y = obj.y + (obj.anchorOffsetY - orginAOY);
    //     }
    //     obj.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
    //         egret.Tween.get(obj).to({
    //             "scaleX": oringScaleX - 0.1 * oringScaleX,
    //             "scaleY": oringScaleY - 0.1 * oringScaleY,
    //         }, 40);
    //     }, obj)
    //     obj.addEventListener(egret.TouchEvent.TOUCH_END, function () {
    //         egret.Tween.get(obj).to({
    //             "scaleX": oringScaleX,
    //             "scaleY": oringScaleY,
    //         }, 40);
    //     }, obj)
    //     obj.addEventListener(egret.TouchEvent.TOUCH_CANCEL, function () {
    //         egret.Tween.get(obj).to({
    //             "scaleX": oringScaleX,
    //             "scaleY": oringScaleY,
    //         }, 40);
    //     }, obj)
    //     obj.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, function () {
    //         egret.Tween.get(obj).to({
    //             "scaleX": oringScaleX,
    //             "scaleY": oringScaleY,
    //         }, 40);
    //     }, obj)
    //     if (changeAP) {
    //         obj.addEventListener(eui.UIEvent.RESIZE, function () {
    //             // console.log("RESIZE in UIActionMgr");
    //             // console.log(obj.width, obj.height);
    //             let orginAOX = obj.anchorOffsetX;
    //             let orginAOY = obj.anchorOffsetY;
    //             obj.anchorOffsetX = obj.width / 2;
    //             obj.anchorOffsetY = obj.height / 2;
    //             obj.x = obj.x + (obj.anchorOffsetX - orginAOX);
    //             obj.y = obj.y + (obj.anchorOffsetY - orginAOY);
    //         }, obj);
    //     }
    // }
    function setGrey(obj, enable) {
        if (enable === void 0) { enable = true; }
        if (enable) {
            var colorMatrix = [
                0.3, 0.6, 0, 0, 0,
                0.3, 0.6, 0, 0, 0,
                0.3, 0.6, 0, 0, 0,
                0, 0, 0, 1, 0
            ];
            var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
            obj.filters = [colorFlilter];
        }
        else {
            obj.filters = [];
        }
    }
    UIActionManager.setGrey = setGrey;
    function setOutLineEffect(obj, enable) {
        if (enable === void 0) { enable = true; }
        if (!obj) {
            return;
        }
        if (enable) {
            var color = 0x33CCFF; /// 光晕的颜色，十六进制，不包含透明度
            var alpha = 0.8; /// 光晕的颜色透明度，是对 color 参数的透明度设定。有效值为 0.0 到 1.0。例如，0.8 设置透明度值为 80%。
            var blurX = 35; /// 水平模糊量。有效值为 0 到 255.0（浮点）
            var blurY = 35; /// 垂直模糊量。有效值为 0 到 255.0（浮点）
            var strength = 2; /// 压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
            var quality = 3 /* HIGH */; /// 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
            var inner = false; /// 指定发光是否为内侧发光，暂未实现
            var knockout = false; /// 指定对象是否具有挖空效果，暂未实现
            var glowFilter = new egret.GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout);
            obj.filters = [glowFilter];
        }
        else {
            obj.filters = [];
        }
    }
    UIActionManager.setOutLineEffect = setOutLineEffect;
    function blink(obj) {
        egret.Tween.get(obj).call(function () {
            UIActionManager.setOutLineEffect(obj);
        }).wait(100).call(function () {
            UIActionManager.setOutLineEffect(obj, false);
        }).wait(100).call(function () {
            UIActionManager.setOutLineEffect(obj);
        }).wait(100).call(function () {
            UIActionManager.setOutLineEffect(obj, false);
        });
    }
    UIActionManager.blink = blink;
    function shake(obj) {
        // let originAnX = obj.anchorOffsetX;
        // let originAnY = obj.anchorOffsetY;
        // AnchorUtil.calculateAndSetAr(obj);
        // // obj.validateNow();
        // // egret.Tween.get(obj).to({ rotation: -15 }, 100).to({ rotation: 0 }, 100).to({ rotation: 15 }, 100).to({ rotation: 0 }, 100).call(function () {
        // egret.Tween.get(obj).to({ rotation: 360 }, 2000).call(function () {
        //     obj.anchorOffsetX = originAnX;
        //     obj.anchorOffsetY = originAnY;
        //     // obj.validateNow();
        // });
    }
    UIActionManager.shake = shake;
    UIActionManager.BREATHE_COUNT = 0;
    function breathe(obj) {
        var originScaleX = obj.scaleX;
        var originScaleY = obj.scaleY;
        var randomDelay = ++UIActionManager.BREATHE_COUNT % 10 * 100;
        // console.log(randomDelay);
        egret.setTimeout(function () {
            egret.Tween.get(obj, { loop: true }).to({ scaleX: originScaleX + 0.01, scaleY: originScaleY + 0.02 }, 1000).to({ scaleX: originScaleX, scaleY: originScaleY }, 1000);
        }, this, randomDelay);
    }
    UIActionManager.breathe = breathe;
})(UIActionManager || (UIActionManager = {}));
//# sourceMappingURL=UIActionManager.js.map
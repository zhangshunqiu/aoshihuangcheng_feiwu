/**
  * 面板弹出管理类
  * by dily
  * (c) copyright 2014 - 2035
  * All Rights Reserved. 
  * 面板弹出的管理类
  */
module PopUpManager {

    export let popUpViewQueue = new Array<any>();

    /**
    * 添加面板方法
    * panel       		面板
    * dark        		背景是否变黑
    * opacity            背景变黑时的透明度
    * popUpWidth      	指定弹窗宽度，定位使用
    * popUpHeight      	指定弹窗高度，定位使用
    * onDarkClose      	点击压黑的关闭事件
    * clickDarkClose    是否允许点击背景关闭弹窗，默认true
    * closeCB           窗口关闭事件
    * context      	    上下文
    * effectType        0：没有动画 1:从中间轻微弹出 2：从中间猛烈弹出  3：从左向右 4：从右向左 5、从上到下 6、从下到上
    */
    export function addPopUp(params: any): void {
        let panel = params.obj
        let dark = true;
        if (params.dark != undefined) {
            dark = params.dark;
        }
        let clickBgClose = true;
        if (params.clickBgClose != undefined) {
            clickBgClose = params.clickBgClose;
        }
        let effectType = 1;
        if (params.effectType != undefined) {
            effectType = params.effectType;
        }

        let container:egret.DisplayObjectContainer = new egret.DisplayObjectContainer()
        

        panel.scaleX = 1;
        panel.scaleY = 1;
        panel.x = (App.stageWidth - panel.width) / 2;
        panel.y = (App.stageHeight - panel.height) / 2;
        panel.alpha = 1;

        let darkSprite = undefined;
        if (dark) {
            let opacity = 0.7;
            if (params.opacity != undefined) {
                opacity = params.opacity;
            }
            darkSprite = new egret.Sprite();
            darkSprite.graphics.clear();
            darkSprite.graphics.beginFill(0x000000, opacity);
            darkSprite.graphics.drawRect(0, 0, App.stageWidth, App.stageHeight);
            darkSprite.graphics.endFill();
            darkSprite.width = App.stageWidth;
            darkSprite.height = App.stageHeight;
            if (!container.contains(darkSprite)) {
                container.addChild(darkSprite);
            }
            darkSprite.touchEnabled = true;

            egret.Tween.get(darkSprite).to({ alpha: 1 }, 50);
            darkSprite.visible = true;

            if (clickBgClose) {
                if (params.clickDarkClose === true || params.clickDarkClose === undefined) {
                    darkSprite.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                        if (params.onDarkClose) {
                            params.onDarkClose.call(params.context);
                        }
                        PopUpManager.removePopUp(panel);
                    }, this);
                }
            }
        }

        container.addChild(panel);

       (EventSystem.getInstance() as EventSystem).dispatchEvent(WinManagerEvent.WIN_ADD,new WinManagerEvent(new WinManagerVO("","",WinLay.PANEL_LAY),container))

        popUpViewQueue.push({
            "obj": panel,
            "darkSprite": darkSprite,
            "parent":container,
            "closeCB": params.closeCB,
            "context": params.context,
        });

        // if (popUpWidth != 0) {
        //     panel.x = Utils.DeviceUtils.curWidth() / 2 - popUpWidth / 2;
        //     panel.y = Utils.DeviceUtils.curHeight() / 2 - popUpHeight / 2;
        // } else {
        //     popUpWidth = panel.width;
        //     popUpHeight = panel.height;
        // }

        UIActionManager.playUIAction(panel, effectType);
    }

    /**
    * 移除面板方法
    * panel       		面板
    * effectType        0：没有动画 1:从中间缩小消失 2：  3：从左向右 4：从右向左 5、从上到下 6、从下到上
    */
    export function removePopUp(panel, effectType: number = 0): void {

        let onComplete: Function = function () {
            for (let i = 0; i < popUpViewQueue.length; i++) {
                if (popUpViewQueue[i].obj === panel) {
                    if (popUpViewQueue[i].closeCB) {
                        popUpViewQueue[i].closeCB.call(popUpViewQueue[i].context);
                    }
                    popUpViewQueue.splice(i, 1);
                    break;
                }
            }
        };
        let vo:any;
        popUpViewQueue.forEach(function (item) {
            if (item.obj === panel) {
                vo = item;
                let darkSprite = item.darkSprite;
                if (darkSprite) {
                    egret.Tween.get(darkSprite).to({ alpha: 0 }, 100).call(function () {
                        // if (GameRootLay.gameLayer()._panelLay.contains(darkSprite)) {
                        //     GameRootLay.gameLayer()._panelLay.removeChild(darkSprite);
                        // }
                        onComplete.call(this);
                    }, this);
                }
            }
        });
        if(vo){
            if (effectType == 0) {
                (EventSystem.getInstance() as EventSystem).dispatchEvent(WinManagerEvent.WIN_REMOVE,new WinManagerEvent(new WinManagerVO("","",WinLay.PANEL_LAY),vo.parent));
            } else {
                UIActionManager.playUIAction(panel, effectType, function () {
                   (EventSystem.getInstance() as EventSystem).dispatchEvent(WinManagerEvent.WIN_REMOVE,new WinManagerEvent(new WinManagerVO("","",WinLay.PANEL_LAY),vo.parent));
                }, this, true);
            }
        }
    }

    // 移除到view对应的队列后停止
    export function clearViewQueue(view = undefined) {
        if (popUpViewQueue && popUpViewQueue.length > 0) {
            if (view) {
                for (let i = popUpViewQueue.length; i > 0; i--) {
                    if (popUpViewQueue[i].obj != view) {
                        (EventSystem.getInstance() as EventSystem).dispatchEvent(WinManagerEvent.WIN_REMOVE,new WinManagerEvent(new WinManagerVO("","",WinLay.PANEL_LAY),popUpViewQueue[i].parent));
                    } else {
                        break;
                    }
                }
            } else {
                for (let i = popUpViewQueue.length; i > 0; i--) {
                    (EventSystem.getInstance() as EventSystem).dispatchEvent(WinManagerEvent.WIN_REMOVE,new WinManagerEvent(new WinManagerVO("","",WinLay.PANEL_LAY),popUpViewQueue[i].parent));
                }
            }
        }
    }
}



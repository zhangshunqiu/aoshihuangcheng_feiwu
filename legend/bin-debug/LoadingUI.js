//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
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
var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        var _this = _super.call(this) || this;
        _this.stageW = egret.MainContext.instance.stage.stageWidth;
        _this.stageH = egret.MainContext.instance.stage.stageHeight;
        _this.ww = 0;
        _this.hh = 0;
        _this._bg = new egret.Bitmap();
        _this.addChild(_this._bg);
        _this.createView();
        RES.getResByUrl(ResUrlUtil.getLoadingBgUrl(), _this.logoLoadComplete, _this, RES.ResourceItem.TYPE_IMAGE);
        return _this;
    }
    LoadingUI.prototype.logoLoadComplete = function (event) {
        var img = event;
        if (img) {
            this._bg.texture = img;
            // this._bg.width = App.stageWidth;
            // this._bg.height = App.stageHeight;
            this.ww = this._bg.width;
            this.hh = this._bg.height;
            // this._bg.x = (this.stageW - this.ww)/2;
            this._bg.y = (this.stageH - this.hh) / 2;
        }
    };
    LoadingUI.prototype.createView = function () {
        this._textField = new egret.TextField();
        this.addChild(this._textField);
        //this.textField.x = 100;
        //this.textField.y = 0;
        this._textField.width = 480;
        this._textField.height = 100;
        this._textField.textAlign = "center";
        this._textField.size = 24;
        this._textField.x = (this.stageW - 480) / 2;
        this._textField.y = (this.stageH - 100) / 2 + 240;
    };
    LoadingUI.prototype.setProgress = function (current, total) {
        this._textField.text = "\u8D44\u6E90\u52A0\u8F7D\u4E2D...   (" + current + "/" + total + ")";
    };
    return LoadingUI;
}(egret.Sprite));
__reflect(LoadingUI.prototype, "LoadingUI");
// private textfield: egret.TextField;
//     /**
//      * 创建游戏场景
//      * Create a game scene
//      */
//     private createGameScene() {
//         let sky = this.createBitmapByName("bg_jpg");
//         this.addChild(sky);
//         let stageW = this.stage.stageWidth;
//         let stageH = this.stage.stageHeight;
//         sky.width = stageW;
//         sky.height = stageH;
//         let topMask = new egret.Shape();
//         topMask.graphics.beginFill(0x000000, 0.5);
//         topMask.graphics.drawRect(0, 0, stageW, 172);
//         topMask.graphics.endFill();
//         topMask.y = 33;
//         this.addChild(topMask);
//         let icon = this.createBitmapByName("egret_icon_png");
//         this.addChild(icon);
//         icon.x = 26;
//         icon.y = 33;
//         let line = new egret.Shape();
//         line.graphics.lineStyle(2, 0xffffff);
//         line.graphics.moveTo(0, 0);
//         line.graphics.lineTo(0, 117);
//         line.graphics.endFill();
//         line.x = 172;
//         line.y = 61;
//         this.addChild(line);
//         let colorLabel = new egret.TextField();
//         colorLabel.textColor = 0xffffff;
//         colorLabel.width = stageW - 172;
//         colorLabel.textAlign = "center";
//         colorLabel.text = "Hello Egret";
//         colorLabel.size = 24;
//         colorLabel.x = 172;
//         colorLabel.y = 80;
//         this.addChild(colorLabel);
//         let textfield = new egret.TextField();
//         this.addChild(textfield);
//         textfield.alpha = 0;
//         textfield.width = stageW - 172;
//         textfield.textAlign = egret.HorizontalAlign.CENTER;
//         textfield.size = 24;
//         textfield.textColor = 0xffffff;
//         textfield.x = 172;
//         textfield.y = 135;
//         this.textfield = textfield;
//         //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
//         // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
//         //RES.getResAsync("description_json", this.startAnimation, this);
//         let strings =  RES.getRes("description_json");
//         RES.getResAsync("test_txt", this.test, this);
//     }
//      private test(result: string) {
//          //RES.getVersionController().getVirtualUrl("test_txt");
//         //console.log(result+"_"+RES.getVersionController().getVirtualUrl("test_txt"));
//      }
//     /**
//      * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
//      * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
//      */
//     private createBitmapByName(name: string) {
//         let result = new egret.Bitmap();
//         let texture: egret.Texture = RES.getRes(name);
//         result.texture = texture;
//         return result;
//     }
//     /**
//      * 描述文件加载成功，开始播放动画
//      * Description file loading is successful, start to play the animation
//      */
//     private startAnimation(result: string[]) {
//         console.log(result);
//         let parser = new egret.HtmlTextParser();
//         let textflowArr = result.map(text => parser.parse(text));
//         let textfield = this.textfield;
//         let count = -1;
//         let change = () => {
//             count++;
//             if (count >= textflowArr.length) {
//                 count = 0;
//             }
//             let textFlow = textflowArr[count];
//             // 切换描述内容
//             // Switch to described content
//             textfield.textFlow = textFlow;
//             let tw = egret.Tween.get(textfield);
//             tw.to({ "alpha": 1 }, 200);
//             tw.wait(2000);
//             tw.to({ "alpha": 0 }, 200);
//             tw.call(change, this);
//         };
//         change();
//     } 
//# sourceMappingURL=LoadingUI.js.map
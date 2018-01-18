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
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.08u  0
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        var assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onActive = function () {
    };
    Main.prototype.onDeactivate = function () {
    };
    Main.prototype.onAddToStage = function (event) {
        // this.stage.addEventListener(egret.Event.ACTIVATE,this.onActive,this);
        // this.stage.addEventListener(egret.Event.DEACTIVATE,this.onDeactivate,this);
        this.stage.frameRate = 60;
        RES.setMaxLoadingThread(10);
        console.log("-- ADD TO STAGE");
        //渲染类型
        //<li>运行在Web上     egret.RuntimeType.WEB</li>
        //<li>运行在Native上     egret.RuntimeType.NATIVE</li>
        console.log("-- runtimeType =", egret.Capabilities.runtimeType);
        //系统
        //<li>苹果手机操作系统     "iOS"</li>
        // <li>安卓手机操作系统     "Android"</li>
        //<li>微软手机操作系统     "Windows Phone"</li>
        //<li>微软桌面操作系统     "Windows PC"</li>
        //<li>苹果桌面操作系统     "Mac OS"</li>
        //<li>未知操作系统        "Unknown"</li>
        console.log("--      os     =", egret.Capabilities.os);
        //是否移动手机和平板上
        console.log("--   isMobile  =", egret.Capabilities.isMobile);
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
            context.onUpdate = function () {
            };
        });
        egret.lifecycle.onPause = function () {
            if (egret.Capabilities.os == "Windows PC" || egret.Capabilities.os == "Mac OS") {
                egret.ticker.resume();
            }
            else {
                egret.ticker.pause();
            }
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        // let bg = new egret.Sprite();
        // bg.graphics.clear();
        // bg.graphics.beginFill(0x000000, 0.2);
        // bg.graphics.drawRect(0, 0, App.stageWidth, App.stageHeight);
        // bg.graphics.endFill();
        // this.addChild(bg);
        //设置加载进度界面
        //Config to load process interface
        if (this.loadingView == null) {
            this.loadingView = new LoadingUI();
            this.stage.addChild(this.loadingView);
        }
        // 注入
        //ResVersionManager.getInstance().init();
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json" + App.getUrlVersion(), "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    Main.prototype.onConfigComplete = function (event) {
        //console.log(event);
        RES.getResAsync("agent_json", function (obj) {
            if (this.loadingView) {
                this.loadingView.setProgress(0, 100);
            }
            App.agentConfig = obj;
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            var theme = new eui.Theme("resource/default.thm.json" + App.getUrlVersion(), this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
        }, this);
    };
    /**
    * 主题文件加载完成,开始预加载
    * Loading of theme configuration file is complete, start to pre-load the
    */
    Main.prototype.onThemeLoadComplete = function () {
        if (this.loadingView) {
            this.loadingView.setProgress(0, 100);
        }
        //console.log(navigator.userAgent);
        var groupName = "preload";
        var subGroups = ["preload_core", "preload_config", "preload_pic"];
        App.ResourceUtils.loadGroups(groupName, subGroups, this.onResourceLoadComplete, this.onResourceProgress, this);
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    Main.prototype.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            //this.stage.removeChild(this.loadingView);
            App.Init();
            console.log("-- INIT COMPLETE");
            McSourceCache.getInstance().initDefaultMc();
            this.createGameScene();
            egret.setTimeout(function () {
                this.stage.removeChild(this.loadingView);
                this.loadingView = null;
            }, this, 400);
        }
    };
    /**
     * preload资源组加载进度Z
     * loading process of preload resource
     */
    Main.prototype.onResourceProgress = function (itemsLoaded, itemsTotal) {
        // console.log("done", itemsLoaded, itemsTotal);
        if (this.loadingView) {
            this.loadingView.setProgress(itemsLoaded, itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    Main.prototype.createGameScene = function () {
        if (this.gameRootLay == undefined) {
            this.gameRootLay = new GameRootLay();
        }
        this.addChild(this.gameRootLay);
        MainController.getInstance().gameStart(this.gameRootLay);
        /*
        var tx:RichTextField = new RichTextField(200);
        //tx.multiline = true;
        var str:string =
            '没有任何格式初始文本，' +
            '<font fontfamily="Verdana" href="event:triggered" color="#0000ff" size="30">Verdana blue large</font>' +
            '<font color="#ff7f50" size="10">珊瑚色<b>局部加粗</b>小字体</font>' +
            '<href>Verdana blue large</href>' +
            '<i>斜体</i>'
        
        console.log( str);
        tx.textHtml = str;
        // var arr:any = new Array<egret.ITextElement>(
        //     { text:"这段文字有链接这段文qwert12345qwert12345", style: { "href" : "event:text event triggered" } },
        //     { text:" -32- ", style: {} },
        //     { text:" -32- ", style: {} },
        //     { text:" -32- ", style: {} },
        //     { text:" -32- ", style: {} },
        //     { text:" -32- ", style: {} },
        //     { text:" -32- ", style: {} },
        //     { text:"这段文字没链接", style: {} }
        // );
        // tx.textFlow = arr;

        tx.x = 0;
        tx.y = 0;
        this.addChild( tx );
        tx.touchEnabled = true;
        tx.addEventListener( egret.TextEvent.LINK, function( evt:egret.TextEvent ){
            console.log( evt.text );
        }, this );
        console.log(tx.width,tx.height);
        // var linelist:Array<egret.ILineElement> = tx.$getLinesArr();
        // console.log(arr);
        // for(var i:number = 0;i<linelist.length;i++){
        //     var item:egret.ILineElement = linelist[i];

        // }
        */
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map
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
class Main extends egret.DisplayObjectContainer {
    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;
    private gameRootLay: GameRootLay;
    public constructor() {
        super();

        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onActive() {
    }

    private onDeactivate() {
    }

    private onAddToStage(event: egret.Event) {
        // this.stage.addEventListener(egret.Event.ACTIVATE,this.onActive,this);
        // this.stage.addEventListener(egret.Event.DEACTIVATE,this.onDeactivate,this);
        console.log("-- ADD TO STAGE");
        //渲染类型
        //<li>运行在Web上     egret.RuntimeType.WEB</li>
        //<li>运行在Native上     egret.RuntimeType.NATIVE</li>
        console.log("-- runtimeType =",egret.Capabilities.runtimeType);
        //系统
        //<li>苹果手机操作系统     "iOS"</li>
        // <li>安卓手机操作系统     "Android"</li>
        //<li>微软手机操作系统     "Windows Phone"</li>
        //<li>微软桌面操作系统     "Windows PC"</li>
        //<li>苹果桌面操作系统     "Mac OS"</li>
        //<li>未知操作系统        "Unknown"</li>
        console.log("--      os     =",egret.Capabilities.os);
        //是否移动手机和平板上
        console.log("--   isMobile  =",egret.Capabilities.isMobile);

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
            context.onUpdate = () => {

            }
        })
        egret.lifecycle.onPause = () => {
            if(egret.Capabilities.os == "Windows PC" || egret.Capabilities.os == "Mac OS"){
                egret.ticker.resume();
            }else{
                egret.ticker.pause();
            }
        }
        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        // let bg = new egret.Sprite();
        // bg.graphics.clear();
        // bg.graphics.beginFill(0x000000, 0.2);
        // bg.graphics.drawRect(0, 0, App.stageWidth, App.stageHeight);
        // bg.graphics.endFill();
        // this.addChild(bg);

        //设置加载进度界面
        //Config to load process interface
        if(this.loadingView == null){
            this.loadingView = new LoadingUI();
            this.stage.addChild(this.loadingView);
        }
        // 注入
        //ResVersionManager.getInstance().init();

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json"+App.getUrlVersion(), "resource/");

    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        //console.log(event);
        RES.getResAsync("agent_json", function (obj) {
            if( this.loadingView){
                 this.loadingView.setProgress(80, 100);
            }
            App.agentConfig = obj;
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json"+App.getUrlVersion(), this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
        }, this);
    }

    /**
    * 主题文件加载完成,开始预加载
    * Loading of theme configuration file is complete, start to pre-load the 
    */
    private onThemeLoadComplete(): void {
        if(this.loadingView){
             this.loadingView.setProgress(0, 100);
        }
        //console.log(navigator.userAgent);
        let groupName = "preload";
        let subGroups = ["preload_core", "preload_config","preload_pic"];
        App.ResourceUtils.loadGroups(groupName, subGroups, this.onResourceLoadComplete, this.onResourceProgress, this);
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            //this.stage.removeChild(this.loadingView);
            App.Init();
            console.log("-- INIT COMPLETE");
            (McSourceCache.getInstance() as McSourceCache).initDefaultMc();
            this.createGameScene();
            egret.setTimeout(function () {
                this.stage.removeChild(this.loadingView);
                this.loadingView = null;
            }, this, 400)
        }
    }

    /**
     * preload资源组加载进度Z
     * loading process of preload resource
     */
    private onResourceProgress(itemsLoaded: number, itemsTotal: number): void {
        // console.log("done", itemsLoaded, itemsTotal);
        if(this.loadingView){
            this.loadingView.setProgress(itemsLoaded, itemsTotal);
        }
    }

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        if (this.gameRootLay == undefined) {
            this.gameRootLay = new GameRootLay();
        }
        this.addChild(this.gameRootLay);
        (MainController.getInstance() as MainController).gameStart(this.gameRootLay);
    }
}
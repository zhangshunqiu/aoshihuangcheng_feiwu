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
 * 主界面视图
 * author : zrj
 * 这个界面即使隐藏 也要监听数据的更新变化，因为通用飘字 数值改变等都是走这里
 */
var game;
(function (game) {
    var MainUI = (function (_super) {
        __extends(MainUI, _super);
        function MainUI(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            // public gp_chatlist : eui.Group;
            // public scr_chatlist: eui.Scroller;
            // public vp_chatlist: eui.Group;
            // private _uichatlist: Array<any> = [];
            // private _nextchatposiy: number = 0;
            // private _eventid_chatlist = 0;
            // private _eventid_onechat: number = 0;
            _this._eventIdBossResult = 0;
            _this._initSceneEventId = 0;
            _this._meetBossEventId = 0;
            _this._startChallengeMeetBossEventId = 0;
            _this._chatModel = game.ChatModel.getInstance();
            _this.mainUIModel = game.MainUIModel.getInstance();
            _this._topBtnList = [];
            _this._middleBtnList = [];
            _this._rightBtnList = [];
            _this.removeTopBtnEventId = 0;
            _this.addTopBtnEventId = 0;
            _this._sceneModel = SceneModel.getInstance();
            return _this;
        }
        MainUI.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            // game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_FIGHT);
            // Director.getInstance().changeScene();
            this.gp_boss.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                App.WinManager.openWin(WinName.BOSS);
                App.loglyg("挑战boss");
            }, this);
            this.btn_auto.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openAutoChallenge, this);
            // this.img_mooncard.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
            //     App.WinManager.openWin(WinName.MONTHCARD);
            // }, this);
            this.lb_tiaozhan.touchEnabled = false;
            this.gp_autoChallenge.touchEnabled = false;
            App.EventSystem.addEventListener(PanelNotify.MAIN_CLOSE_BUTTON, this.closeButton, this); //监听关闭上面和侧面按钮事件
            App.EventSystem.addEventListener(PanelNotify.MAIN_OPEN_BUTTON, this.openButton, this); //监听打开上面和侧面按钮事件
            App.EventSystem.addEventListener(PanelNotify.BOSS_WAVE_UPDATE, this.updateWave, this); //监听波数更新
            App.EventSystem.addEventListener(PanelNotify.HERO_BAG_NOT_ENOUGH, this.bagNotEnough, this); //背包满
            App.EventSystem.addEventListener(PanelNotify.HERO_COIN_NOT_ENOUGH, this.coinNotEnough, this); //金币不足
            App.EventSystem.addEventListener(PanelNotify.HERO_MONEY_NOT_ENOUGH, this.moneyNotEnough, this); //元宝不足
            this.openBossIconEffect();
            App.EventSystem.addEventListener(PanelNotify.PLAYER_OFFLINE_INFO, this.showOfflineInfo, this);
            // App.EventSystem.addEventListener(PanelNotify.PLAYER_FASTFIGHT_INFO, this.fastFightInfo, this);
            App.EventSystem.addEventListener(PanelNotify.PLAYER_FASTFIGHT_RESULT, this.fastFightResult, this);
            App.EventSystem.addEventListener(PanelNotify.PLAYER_COMBAT_UPDATE, this.showCombatChange, this); //战力更新事件
            // ChatController.getInstance().getChatList();
            // //聊天窗口
            // if (this._eventid_chatlist == 0)
            //     this._eventid_chatlist = App.EventSystem.addEventListener(PanelNotify.CHAT_LIST_UPDATE, this.playChatList, this);
            // if (this._eventid_onechat == 0){
            //     this._eventid_onechat = App.EventSystem.addEventListener(PanelNotify.CHAT_HAS_NEW_INFO, this.playOneChat, this);
            // }
            // this.scr_chatlist.viewport = this.vp_chatlist;
            // this.scr_chatlist.scrollPolicyH = eui.ScrollPolicy.OFF;
            // if (this._uichatlist.length < 1)
            //     this.playChatList()
            // this.img_chat.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {    //聊天模块入口
            //     App.WinManager.openWin(WinName.CHAT);
            // }, this);
            // this.img_mail.addEventListener(egret.TouchEvent.TOUCH_TAP,(e:Event)=>{
            //     App.WinManager.openWin(WinName.MAIL)
            // },this);
            // // this.img_mail.removeEventListener(egret.TouchEvent.TOUCH_TAP,)
            // this.img_welfare.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {    //福利模块入口
            //     App.WinManager.openWin(WinName.WELFARE);
            // }, this);
            // this.img_raid.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {    //寻宝模块入口
            //     App.WinManager.openWin(WinName.RAIDER);
            // }, this);  
            // this.img_mission.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {    //每日必做模块入口
            //     App.WinManager.openWin(WinName.MUSTDO);
            // }, this);
            // this.img_fastfight.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {    //快速战斗入口
            //     // let view = new FastFightView();
            //     // PopUpManager.addPopUp({ obj: view });
            //     App.WinManager.openWin(WinName.POP_FAST_FIGHT);
            // }, this);
            this.gp_meetBoss.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                var bossModel = game.BossModel.getInstance();
                App.WinManager.openWin(WinName.BOSS_MEET, {});
            }, this);
            //    this.img_copy.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{   //副本模块入口
            //        App.WinManager.openWin(WinName.COPY);
            //    }, this);
            //    this.btn_worldBoss.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{  // 世界boss入口
            //        App.WinManager.openWin(WinName.WORLDBOSS);
            //    }, this)
            //    this.btn_arena.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{  //竞技场
            //        App.WinManager.openWin(WinName.HEGEMONY);
            //    }, this)
            //    this.btn_metal.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{  //勋章
            //        App.WinManager.openWin(WinName.METAL);
            //    }, this)
            //    this.btn_daily.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{  //日常
            //          App.WinManager.openWin(WinName.MUSTDO);
            //    }, this)
            this.initView();
            App.WinManager.openWin(WinName.MAIN_BOTTOM);
            // App.Socket.send(14001, {});
            // App.Socket.send(15001, {});
            // Director.getInstance().changeScene();
            if (this._chatBtn == null) {
                this._chatBtn = new IconButton({ id: MainUIBtnType.CHAT, icon: "main_icon_liaotian_png", btnTipType: ConstBtnTipType.CHAT, winName: WinName.CHAT });
                this._chatBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                    App.WinManager.openWin(WinName.CHAT);
                }, this);
                this.gp_middle.addChild(this._chatBtn);
                this._chatBtn.x = 68 - 50;
                this._chatBtn.y = 920 - 50;
                App.BtnTipManager.addBtnTipItem(ConstBtnTipType.CHAT, this._chatBtn, 80, 10);
            }
            if (this._mailBtn == null) {
                this._mailBtn = new IconButton({ id: MainUIBtnType.MAIL, icon: "main_icon_youjian_png", btnTipType: ConstBtnTipType.MAIL, winName: WinName.MAIL });
                this._mailBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                    App.WinManager.openWin(WinName.MAIL);
                }, this);
                this.gp_middle.addChild(this._mailBtn);
                this._mailBtn.x = 68 - 50;
                this._mailBtn.y = 920 - 115;
                App.BtnTipManager.addBtnTipItem(ConstBtnTipType.MAIL, this._mailBtn, 80, 10);
            }
            if (this._fastFightBtn == null) {
                this._fastFightBtn = new IconButton({ id: MainUIBtnType.FASTFIGHT, icon: "main_icon_kuaisuzhandou_png", btnTipType: 0, winName: WinName.POP_FAST_FIGHT });
                this._fastFightBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                    App.WinManager.openWin(WinName.POP_FAST_FIGHT);
                }, this);
                this.gp_bottom_right.addChild(this._fastFightBtn);
                this._fastFightBtn.x = -5;
                this._fastFightBtn.y = -40;
            }
            if (this._arenaBtn == null) {
                this._arenaBtn = new IconButton({ id: MainUIBtnType.ARENA, icon: "main_icon_jingji_png", btnTipType: ConstBtnTipType.AREAN, winName: WinName.HEGEMONY });
                this._arenaBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                    App.WinManager.openWin(WinName.HEGEMONY);
                }, this);
                this.gp_bottom_right.addChild(this._arenaBtn);
                this._arenaBtn.x = -47;
                this._arenaBtn.y = 50;
            }
            if (this._worldBossBtn == null) {
                this._worldBossBtn = new IconButton({ id: MainUIBtnType.WORLDBOSS, icon: "main_icon_shijieboss_png", btnTipType: 0, winName: WinName.WORLDBOSS });
                this._worldBossBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                    App.WinManager.openWin(WinName.WORLDBOSS);
                }, this);
                this.gp_bottom_right.addChild(this._worldBossBtn);
                this._worldBossBtn.x = -30;
                this._worldBossBtn.y = 140;
            }
            this.updateTopBtn();
            this.updateMiddleBtn();
            this.updateRightBtn();
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.BOSS_CHALLENGE, this.gp_boss, 140, 15);
            //App.BtnTipManager.addBtnTipItem(ConstBtnTipType.COPY, this.img_copy);
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.AREAN, this.btn_arena);
            App.WinManager.openWin(WinName.CHATPORT);
        };
        MainUI.prototype.showCombatChange = function (changeData) {
            var heroVosAfter = changeData["hero"];
            var heroVosBefore = game.HeroModel.getInstance().heroInfo;
            if (heroVosBefore.length <= 0) {
                return;
            }
            else {
                App.GlobalTips.showCombatTips(heroVosBefore, heroVosAfter);
            }
        };
        MainUI.prototype.updateTopBtn = function () {
            for (var i = 0; i < this._topBtnList.length; i++) {
                var item = this._topBtnList[i];
                item.destroy();
                if (item.parent) {
                    item.parent.removeChild(item);
                }
            }
            this._topBtnList = [];
            for (var j = 0; j < MainUITopListConf.length; j++) {
                var d = MainUITopListConf[j];
                var item_1 = this.creatOneTopBtn(d);
                this.gp_activity.addChild(item_1);
                var pos = this.getTopBtnPos(j);
                item_1.x = pos.x;
                item_1.y = pos.y;
                this._topBtnList.push(item_1);
            }
        };
        MainUI.prototype.updateMiddleBtn = function () {
            for (var i = 0; i < this._middleBtnList.length; i++) {
                var item = this._middleBtnList[i];
                item.destroy();
                if (item.parent) {
                    item.parent.removeChild(item);
                }
            }
            this._middleBtnList = [];
            for (var j = 0; j < MainUIMiddleListConf.length; j++) {
                var d = MainUIMiddleListConf[j];
                var item_2 = this.creatOneTopBtn(d);
                this.gp_bottom_left.addChild(item_2);
                var pos = this.getMiddleBtnPos(j);
                item_2.x = pos.x;
                item_2.y = pos.y;
                this._middleBtnList.push(item_2);
            }
        };
        MainUI.prototype.updateRightBtn = function () {
            for (var i = 0; i < this._rightBtnList.length; i++) {
                var item = this._rightBtnList[i];
                item.destroy();
                if (item.parent) {
                    item.parent.removeChild(item);
                }
            }
            this._rightBtnList = [];
            for (var j = 0; j < MainUIRightListConf.length; j++) {
                var d = MainUIRightListConf[j];
                var item_3 = this.creatOneTopBtn(d);
                this.gp_bottom_right.addChild(item_3);
                var pos = this.getRightBtnPos(j);
                item_3.x = pos.x;
                item_3.y = pos.y;
                this._rightBtnList.push(item_3);
            }
        };
        MainUI.prototype.creatOneTopBtn = function (d) {
            var item = new IconButton(d);
            if (d.btnTipType != ConstBtnTipType.NULL) {
                App.BtnTipManager.addBtnTipItem(d.btnTipType, item, 70, 20);
            }
            item.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
                item.setSelected(true);
            }, this);
            item.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, function () {
                item.setSelected(false);
            }, this);
            item.addEventListener(egret.TouchEvent.TOUCH_END, function () {
                if (d.id == MainUIBtnType.FIRSTCHARGE) {
                    game.RechargeOpenManager.getInstance().openRechargeView();
                }
                else if (d.id == MainUIBtnType.ACTIVITY) {
                    ActivityManager.getInstance().openActivity();
                }
                else {
                    if (App.WinManager.isOpen(String(d.winName))) {
                        App.WinManager.closeWin(String(d.winName));
                    }
                    else {
                        App.WinManager.openWin(String(d.winName));
                    }
                }
                item.setSelected(false);
            }, this);
            return item;
        };
        /**
         * 根据ID移除按钮
         * @param id 按钮ID
         * App.EventSystem.dispatchEvent(PanelNotify.REMOVE_TOP_BTN, MainUIBtnType.ACTIVITY);
         */
        MainUI.prototype.removeTopBtnByID = function (id) {
            for (var j = 0; j < this._topBtnList.length; j++) {
                var item = this._topBtnList[j];
                if (item.getId() == id) {
                    item.destroy();
                    if (item.parent) {
                        item.parent.removeChild(item);
                    }
                    this._topBtnList.splice(j, 1);
                }
            }
            for (var j = 0; j < this._topBtnList.length; j++) {
                var item = this._topBtnList[j];
                var pos = this.getTopBtnPos(j);
                egret.Tween.get(item).to({ x: pos.x, y: pos.y }, 300);
            }
        };
        /**
         * 添加按钮
         * @param param =  {id:MainUIBtnType.ACTIVITY,index：1}
         * App.EventSystem.dispatchEvent(PanelNotify.ADD_TOP_BTN, {id:MainUIBtnType.ACTIVITY,index:1});
         */
        MainUI.prototype.addTopBtn = function (param) {
            for (var j = 0; j < this._topBtnList.length; j++) {
                var item = this._topBtnList[j];
                if (item.getId() == param.id) {
                    return;
                }
            }
            var isfind = false;
            for (var j = 0; j < MainUITopListConf.length; j++) {
                var d = MainUITopListConf[j];
                if (d.id == param.id) {
                    isfind = true;
                    var item_4 = this.creatOneTopBtn(d);
                    this.gp_activity.addChild(item_4);
                    var pos = this.getTopBtnPos(j);
                    item_4.x = pos.x;
                    item_4.y = pos.y;
                    this._topBtnList.splice(param.index, 0, item_4);
                    break;
                }
            }
            if (isfind) {
                for (var j = 0; j < this._topBtnList.length; j++) {
                    var item = this._topBtnList[j];
                    var pos = this.getTopBtnPos(j);
                    egret.Tween.get(item).to({ x: pos.x, y: pos.y }, 300);
                }
            }
        };
        MainUI.prototype.addMiddleBtn = function (param) {
            for (var j = 0; j < this._middleBtnList.length; j++) {
                var item = this._middleBtnList[j];
                if (item.getId() == param.id) {
                    return;
                }
            }
            var isfind = false;
            for (var j = 0; j < MainUIMiddleListConf.length; j++) {
                var d = MainUIMiddleListConf[j];
                if (d.id == param.id) {
                    isfind = true;
                    var item_5 = this.creatOneTopBtn(d);
                    this.gp_bottom_left.addChild(item_5);
                    var pos = this.getMiddleBtnPos(j);
                    item_5.x = pos.x;
                    item_5.y = pos.y;
                    this._middleBtnList.splice(param.index, 0, item_5);
                    break;
                }
            }
            if (isfind) {
                for (var j = 0; j < this._middleBtnList.length; j++) {
                    var item = this._middleBtnList[j];
                    var pos = this.getMiddleBtnPos(j);
                    egret.Tween.get(item).to({ x: pos.x, y: pos.y }, 300);
                }
            }
        };
        /**
         *  根据Id获取顶部按钮
         */
        MainUI.prototype.getTopBtnPos = function (j) {
            return new point((j % 8) * 87 + 15, Math.floor(j / 8) * 100);
        };
        /**
         *  根据Id获取顶部二层按钮
         */
        MainUI.prototype.getMiddleBtnPos = function (j) {
            return new point(-10, (j % 8) * 87 - 35);
        };
        /**
         *  根据Id获取右侧按钮
         */
        MainUI.prototype.getRightBtnPos = function (j) {
            return new point(0, (j % 8) * 87 - 220);
        };
        /**
         *  根据Id获取顶部按钮
         */
        MainUI.prototype.getTopBtnById = function (id) {
            for (var i = 0; i < this._topBtnList.length; i++) {
                var item = this._topBtnList[i];
                if (item.getId() == id) {
                    return item;
                }
            }
        };
        //     FORGE:2,//锻造系统
        // FORGE_STRENGTH:2,//锻造强化
        // FORGE_STAR:2,//锻造升星
        // ROLE:2,//角色系统（1类）
        // ROLE_WING:2,//角色翅膀
        // ROLE_WING_TRAIN:2,//角色翅膀培养
        // ROLE_WING_EQUIP:2,//角色翅膀装备
        // ROLE_SKILL:2,//角色技能
        // ROLE_RUBY:2,//角色宝石\
        // ROLE_RUBY_COMNINE:2,//角色宝石合成
        // ROLE_RUBY_COMNINE_GEMSTONE:2,//角色宝石合成宝石
        // ROLE_RUBY_COMNINE_WING:2,//角色宝石合成 羽翼
        // ROLE_RUBY_EMBED:2,//角色宝石镶嵌
        // ROLE_REBORN:2,//角色重生
        // ROLE_REBORN_UP:2,//角色重生提升
        // ROLE_REBORN_CULTURE:2,//角色重生获取修为
        // BACKPACK:2,//背包
        // BACKPACK_SMELT:2,//背包熔炼装备
        // BACKPACK_SMELTORANGE:2,//背包熔炼装备
        // BOSS:2,//BOSS模块
        // BOSS_CHALLENGE:2,//boss挑战
        // CHAT:2,//聊天
        // MAIL:2,//邮件
        // TASK:2,//每日必做，任务
        // TASK_MEDAL:2,//每日必做，任务 勋章
        // TASK_ACHIEVE:2,//每日必做，任务成就
        // TASK_DAILY:2,//每日必做，任务 每日必做
        // MOUTHCARD:2,//月卡
        // WELFARE:2,//福利
        // WELFARE_SIGN:2,//福利 签到
        // WELFARE_LEVEN:2,//福利 等级
        MainUI.prototype.initView = function () {
            this.btn_auto.labelDisplay.textColor = 0xe4cea9;
            this.btn_auto.labelDisplay.size = 24;
            this.joinBossIconEffect();
            this.closeBossIconEffect();
            this.requestServerData();
        };
        MainUI.prototype.updateWave = function () {
            this.pb_monsterWave.maximum = game.BossModel.getInstance().waveAll;
            this.pb_monsterWave.value = game.BossModel.getInstance().wave;
            if (game.BossModel.getInstance().waveAll <= game.BossModel.getInstance().wave) {
                this.openBossIconEffect();
                //波数已到，可以挑战boss
                App.EventSystem.dispatchEvent(PanelNotify.MAIN_BOSS_CAN_CHANLLENGE, true);
            }
            else {
                App.EventSystem.dispatchEvent(PanelNotify.MAIN_BOSS_CAN_CHANLLENGE, false);
                this.closeBossIconEffect();
            }
        };
        // //聊天窗口
        // //把收到的消息列表显示出来
        // public playChatList() {
        //     // _chatList
        //     for (let i = 0; i < this._chatModel.chatAllList.length; i++) {
        //         let item = new RichTextField;
        //         item.size = 18;
        //         item.textFlow = ChatUtil.getChatPortText(this._chatModel.chatAllList[i]);
        //         item.width = 420;
        //         //item.maxWidth = 420;
        //         item.lineSpacing = 10;
        //         this.vp_chatlist.addChild(item);
        //         item.$setY(this._nextchatposiy);
        //         item.x += 5;
        //         this._nextchatposiy += item.height + 10;
        //         this._uichatlist.push(item);
        //         this.vp_chatlist.height = 1000;
        //     }
        //     this.scr_chatlist.viewport.scrollV = this._nextchatposiy - this.scr_chatlist.height;
        // }
        // //有新消息加入
        // public playOneChat(data) {
        //     if (this._uichatlist.length > 100) {
        //         this._nextchatposiy -= this._uichatlist[0].height;
        //         for (let i = 0; i < this._uichatlist.length; i++) {
        //             this._uichatlist[i].y -= this._uichatlist[0].height;
        //             this.vp_chatlist.removeChild(this._uichatlist[0]);
        //         }
        //     }
        //     let item = new RichTextField;
        //     item.size = 18;
        //     item.textFlow = ChatUtil.getChatPortText(data);
        //     //item.maxWidth = 420;
        //     item.width = 420;
        //     item.lineSpacing = 10;
        //     this.vp_chatlist.addChild(item);
        //     item.$setY(this._nextchatposiy);
        //     item.x += 5;
        //     this._nextchatposiy += item.height + 10;
        //     this._uichatlist.push(item);
        //     this._uichatlist.shift();
        //     this.scr_chatlist.viewport.scrollV = this._nextchatposiy - this.scr_chatlist.height;
        // }
        MainUI.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        //离线挂机收益
        MainUI.prototype.showOfflineInfo = function () {
            if (this.mainUIModel.hookRewardInfo && this.mainUIModel.showOffline) {
                // let view = new MainOffline(this.mainUIModel.hookRewardInfo);
                // PopUpManager.addPopUp({ obj: view });
                App.WinManager.openWin(WinName.POP_OFFLINE_RESULT, { data: this.mainUIModel.hookRewardInfo });
                this.mainUIModel.showOffline = false;
            }
        };
        //快速战斗信息
        MainUI.prototype.fastFightInfo = function () {
        };
        //快速战斗收益
        MainUI.prototype.fastFightResult = function () {
            if (this.mainUIModel.fastFightInfo) {
                // let view = new FastFightResultView(this.mainUIModel.fastFightInfo);
                // PopUpManager.addPopUp({ obj: view });
                App.WinManager.openWin(WinName.POP_FAST_FIGHT_RESULT, { data: this.mainUIModel.fastFightInfo });
            }
        };
        MainUI.prototype.updatePlayerInfo = function () {
        };
        MainUI.prototype.changeStyle = function (style) {
        };
        MainUI.prototype.changePlugFloatView = function (visible) {
        };
        /**场景初始化 */
        MainUI.prototype.onInitScene = function () {
            if (SceneUtil.isMainScene(SceneModel.getInstance().sceneId)) {
                this.gp_bossUiAll.visible = false;
                this.gp_meetBoss.visible = false;
            }
            else {
                this.gp_bossUiAll.visible = true;
            }
            //判断是否是Boss场景
            if (SceneUtil.isBossScene(this._sceneModel.sceneId) || SceneUtil.isActivityScene(this._sceneModel.sceneId)) {
                App.EventSystem.dispatchEvent(PanelNotify.MAIN_CLOSE_BUTTON); //把主界面上顶部和旁边的图标隐藏
            }
            else {
                App.EventSystem.dispatchEvent(PanelNotify.MAIN_OPEN_BUTTON); //把主界面上顶部和旁边的图标显示
            }
            //判断是否是世界boss场景
            if (SceneUtil.isWorldBossScene(this._sceneModel.sceneId)) {
                if (App.WinManager.isOpen(WinName.WORLDBOSS_FIGHT) == false) {
                    App.WinManager.openWin(WinName.WORLDBOSS_FIGHT, this._sceneModel.sceneId);
                }
            }
            else {
                if (App.WinManager.isOpen(WinName.WORLDBOSS_FIGHT)) {
                    App.WinManager.closeWin(WinName.WORLDBOSS_FIGHT);
                }
            }
            //判断是否挂机场景跟主场景
            if (SceneUtil.isHookScene(this._sceneModel.sceneId) || SceneUtil.isMainScene(this._sceneModel.sceneId)) {
                this.mainline_view.showHideMainLineTask(true);
                App.WinManager.openWin(WinName.CHATPORT);
            }
            else {
                this.mainline_view.showHideMainLineTask(false);
                App.WinManager.closeWin(WinName.CHATPORT);
            }
            /**非挂机场景隐藏右上角挂机收益的面板 */
            if (SceneUtil.isHookScene(this._sceneModel.sceneId)) {
                App.EventSystem.dispatchEvent(PanelNotify.MAIN_HIDE_FIGHT_INFO, false);
            }
            else {
                App.EventSystem.dispatchEvent(PanelNotify.MAIN_HIDE_FIGHT_INFO, true);
            }
            /**如果是boss场景，播放boss来袭特效 */
            if (SceneUtil.isBossScene(this._sceneModel.sceneId)) {
                App.WinManager.openWin(WinName.BOSS_COMING);
            }
        };
        MainUI.prototype.openAutoChallenge = function () {
            //自动挑战开启  //判断开启条件
            if (!App.GuideManager.isModuleOpen("AUTO_FIGHT")) {
                App.GuideManager.moduleNotOpenTip("AUTO_FIGHT");
                return;
            }
            if (this._eventIdBossResult == 0) {
                this._eventIdBossResult = App.EventSystem.addEventListener(PanelNotify.SHOW_BOSS_RESULT, this.showBossResult, this);
            }
            if (this.gp_autoChallenge.visible) {
                App.Socket.send(13006, { id: 0 }); //关闭自动挑战
                this.gp_autoChallenge.visible = false;
            }
            else {
                App.Socket.send(13006, { id: 1 }); //打开自动挑战
                this.gp_autoChallenge.visible = true;
            }
        };
        MainUI.prototype.showBossResult = function (result) {
            if (result === 1) {
                this.gp_meetBoss.visible = false;
            }
            else if (result === 0) {
                this.gp_autoChallenge.visible = false;
            }
        };
        MainUI.prototype.openButton = function () {
            this.gp_activity.visible = true;
            this.gp_bottom.visible = true;
            //this.gp_chatlist.visible = true;
            App.WinManager.openWin(WinName.CHATPORT);
        };
        MainUI.prototype.closeButton = function () {
            this.gp_activity.visible = false;
            this.gp_bottom.visible = false;
            //this.gp_chatlist.visible = false;
            App.WinManager.closeWin(WinName.CHATPORT);
        };
        MainUI.prototype.joinBossIconEffect = function () {
            this.mc = new AMovieClip();
            this.mcChallenge = new AMovieClip();
            this.mcMeetBoss = new AMovieClip();
            this.gp_bossUI.addChild(this.mc);
            this.gp_autoChallenge.addChild(this.mcChallenge);
            this.gp_meetBoss.addChild(this.mcMeetBoss);
            this.mc.playMCKey("efftzgq");
            this.mcChallenge.playMCKey("efftzgqk");
            this.mcMeetBoss.frameRate = 8;
            this.mcMeetBoss.playMCKey("efftishi");
            this.gp_autoChallenge.visible = false;
        };
        MainUI.prototype.openBossIconEffect = function () {
            this.gp_bossUI.visible = true;
        };
        MainUI.prototype.closeBossIconEffect = function () {
            this.gp_bossUI.visible = false;
        };
        MainUI.prototype.bagNotEnough = function () {
            var okCB = function (selected) {
                // console.log("okkkk", selected);
                // App.WinManager.openWin(WinName.BACKPACK);
                App.WinManager.openPopWin(WinName.POP_SMELT);
                App.WinManager.closeWin(WinName.ALERTTIPS);
            };
            var cancelCB = function () {
                // console.log("cancellll");
            };
            App.GlobalTips.showAlert({ style: 1 /* ONLY_OK */, content: "背包空间不足，请先整理背包", okCB: okCB, cancelCB: cancelCB, context: this, needCheckBox: false });
        };
        MainUI.prototype.meetBoss = function (data) {
            if (data == 1) {
                this.gp_meetBoss.visible = true;
            }
            else {
                this.gp_meetBoss.visible = false;
            }
        };
        //元宝不足
        MainUI.prototype.moneyNotEnough = function () {
            var okCB = function (selected) {
                // console.log("okkkk", selected);
                // App.WinManager.openWin(WinName.BACKPACK);
            };
            var cancelCB = function () {
                // console.log("cancellll");
            };
            var text = "元宝不足，是否跳转充值页面";
            App.GlobalTips.showAlert({ style: 1 /* ONLY_OK */, content: text, okCB: okCB, cancelCB: cancelCB, context: this, needCheckBox: false });
        };
        //金币不足
        MainUI.prototype.coinNotEnough = function () {
            // let view = new ItemWay(ClientType.BASE_ITEM, 101);
            // PopUpManager.addPopUp({ obj: view });
            App.GlobalTips.showItemWayTips(ClientType.BASE_ITEM, 101);
        };
        //游戏进来时，请求服务端数据
        MainUI.prototype.requestServerData = function () {
            var priority = 5;
            var requestId = undefined;
            requestId = App.GlobalTimer.addSchedule(1000, priority, function () {
                if (priority == 5) {
                    App.Socket.send(20002, {}); //修为次数信息
                }
                else if (priority == 4) {
                }
                else if (priority == 1) {
                    game.SkillModel.getInstance().checkSkillCanUpgradeAll();
                    game.HeroModel.getInstance().checkSpecialEquipRedDotAll();
                }
                priority--;
            }, this, function () {
                App.GlobalTimer.remove(requestId);
            }, this);
        };
        /**
         * 打开窗口
         */
        MainUI.prototype.openWin = function (openParam) {
            var _this = this;
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            App.Socket.send(28003, {});
            var setTimeOutId = setTimeout(function () {
                App.Socket.send(35001, {});
                clearTimeout(setTimeOutId);
            }, 100);
            var setTimeOutId2 = setTimeout(function () {
                App.Socket.send(34001, {});
                clearTimeout(setTimeOutId2);
            }, 100);
            if (this._initSceneEventId === 0) {
                this._initSceneEventId = App.EventSystem.addEventListener(SceneEventType.INIT_SCENE, this.onInitScene, this);
            }
            if (this._meetBossEventId === 0) {
                this._meetBossEventId = App.EventSystem.addEventListener(PanelNotify.BOSS_MEET, this.meetBoss, this);
            }
            if (this._startChallengeMeetBossEventId == 0) {
                this._startChallengeMeetBossEventId = App.EventSystem.addEventListener(PanelNotify.BOSS_MEET_START_CHALLENGE, function () {
                    _this.gp_meetBoss.visible = false;
                }, this);
            }
            if (this.removeTopBtnEventId == 0) {
                this.removeTopBtnEventId = App.EventSystem.addEventListener(PanelNotify.REMOVE_TOP_BTN, this.removeTopBtnByID, this);
            }
            if (this.addTopBtnEventId == 0) {
                this.addTopBtnEventId = App.EventSystem.addEventListener(PanelNotify.ADD_TOP_BTN, this.addTopBtn, this);
            }
            this.mainline_view.readyOpen({ data: {} }); //主线任务
            game.MainUIController.getInstance().requestMainLineTaskInfo();
            this.validateNow();
        };
        /**
         * 关闭窗口
         */
        MainUI.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        MainUI.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            // //清理聊天窗口事件
            // if(this._eventid_chatlist != 0){
            //     App.EventSystem.removeEventListener(PanelNotify.CHAT_LIST_UPDATE, this._eventid_chatlist);
            //     this._eventid_chatlist = 0
            // }
            // if(this._eventid_onechat != 0){
            //     App.EventSystem.removeEventListener(PanelNotify.CHAT_HAS_NEW_INFO, this._eventid_onechat);
            //     this._eventid_onechat = 0
            // }
            if (this._eventIdBossResult != 0) {
                App.EventSystem.removeEventListener(PanelNotify.SHOW_BOSS_RESULT, this._eventIdBossResult);
                this._eventIdBossResult = 0;
            }
            if (this._initSceneEventId != 0) {
                App.EventSystem.removeEventListener(SceneEventType.INIT_SCENE, this._initSceneEventId);
                this._initSceneEventId = 0;
            }
            if (this._meetBossEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.BOSS_MEET, this._meetBossEventId);
                this._meetBossEventId = 0;
            }
            if (this._startChallengeMeetBossEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.BOSS_MEET_START_CHALLENGE, this._startChallengeMeetBossEventId);
                this._startChallengeMeetBossEventId = 0;
            }
            if (this.removeTopBtnEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.REMOVE_TOP_BTN, this.removeTopBtnEventId);
                this.removeTopBtnEventId = 0;
            }
            if (this.addTopBtnEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.ADD_TOP_BTN, this.addTopBtnEventId);
                this.addTopBtnEventId = 0;
            }
            if (this.mc) {
                this.mc.destroy();
                if (this.mc.parent) {
                    this.mc.parent.removeChild(this.mc);
                }
                this.mc = null;
            }
            if (this.mcChallenge) {
                this.mcChallenge.destroy();
                if (this.mcChallenge.parent) {
                    this.mcChallenge.parent.removeChild(this.mcChallenge);
                }
                this.mcChallenge = null;
            }
            if (this.mcMeetBoss) {
                this.mcMeetBoss.destroy();
                if (this.mcMeetBoss.parent) {
                    this.mcMeetBoss.parent.removeChild(this.mcMeetBoss);
                }
                this.mcMeetBoss = null;
            }
            App.WinManager.closeWin(WinName.MAIN_BOTTOM);
        };
        /**
         * 销毁
         */
        MainUI.prototype.destroy = function () {
            App.EventSystem.removeEventListener(PanelNotify.PLAYER_OFFLINE_INFO);
            App.EventSystem.removeEventListener(PanelNotify.MAIN_CLOSE_BUTTON);
            App.EventSystem.removeEventListener(PanelNotify.MAIN_OPEN_BUTTON);
            App.EventSystem.removeEventListener(PanelNotify.MAIN_BOSSICON_EFFECT_OPEN);
            App.EventSystem.removeEventListener(PanelNotify.MAIN_BOSSICON_EFFECT_CLOSE);
            App.EventSystem.removeEventListener(PanelNotify.HERO_BAG_NOT_ENOUGH); //背包满
            App.EventSystem.removeEventListener(PanelNotify.HERO_COIN_NOT_ENOUGH); //金币不足
            App.EventSystem.removeEventListener(PanelNotify.HERO_MONEY_NOT_ENOUGH); //元宝不足
            App.EventSystem.removeEventListener(PanelNotify.PLAYER_FASTFIGHT_RESULT);
            App.EventSystem.removeEventListener(PanelNotify.PLAYER_COMBAT_UPDATE);
        };
        return MainUI;
    }(BaseView));
    game.MainUI = MainUI;
    __reflect(MainUI.prototype, "game.MainUI");
})(game || (game = {}));
//# sourceMappingURL=MainUI.js.map
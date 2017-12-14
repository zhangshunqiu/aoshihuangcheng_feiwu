/**
 * 主界面视图
 * author : zrj
 * 这个界面即使隐藏 也要监听数据的更新变化，因为通用飘字 数值改变等都是走这里
 */
module game {
    export class MainUI extends BaseView {

        public gp_middle: eui.Group;
        public img_bg: eui.Image;

        public btn_auto: eui.Button;
        public lb_tiaozhan: eui.Button;
        public gp_boss: eui.Group;
        public img_copy: eui.Image;
        public img_fastfight : eui.Image;
       // public img_mission: eui.Image;
        //public img_chat: eui.Image;
       // public img_activity: eui.Image;
        //public img_first_recharge: eui.Image;
       // public img_mooncard: eui.Image;
        //public img_raid: eui.Image;
        //public img_welfare: eui.Image;
        //public img_mail: eui.Image;
        public gp_bossUI: eui.Group;
        public pb_monsterWave: eui.ProgressBar;

        public gp_top: eui.Group;
        public gp_activity: eui.Group;
        public gp_bottom: eui.Group;
        public gp_bottom_up: eui.Group;
        public gp_bottom_right: eui.Group;
        public gp_bottom_left : eui.Group;
        public gp_btn: eui.Group;
        public pb_exp: eui.ProgressBar;
        public btn_arena : eui.Button; //竞技场
        public btn_metal : eui.Button; //勋章
        public btn_daily : eui.Button; //日常

        public mainhead: MainHead;
        public mc: AMovieClip;
        public mcMeetBoss: AMovieClip;
        public gp_meetBoss: eui.Group;
        public mcChallenge: AMovieClip;
        public gp_autoChallenge: eui.Group;
        public gp_bossUiAll: eui.Group;

        public gp_chatlist : eui.Group;
        public scr_chatlist: eui.Scroller;
        public vp_chatlist: eui.Group;
        private _uichatlist: Array<any> = [];
        private _nextchatposiy: number = 0;
        private _eventid_chatlist = 0;
        private _eventid_onechat: number = 0;
        private _eventIdBossResult: number = 0;
        private _initSceneEventId: number = 0;
        private _meetBossEventId: number = 0;
        private _chatModel: ChatModel = ChatModel.getInstance();

        private mainUIModel: MainUIModel = MainUIModel.getInstance();
        private _topBtnList:Array<IconButton>=[];
        private _chatBtn:IconButton;

        public mainline_view:MainLineTaskView;

        public img_worldBoss: eui.Image;

        public removeTopBtnEventId: number = 0;
        private addTopBtnEventId: number = 0;

        private _sceneModel:SceneModel = SceneModel.getInstance();

        public constructor(viewConf: WinManagerVO = null) {
            super(viewConf);
        }

        protected childrenCreated() {
            super.childrenCreated();
           
            // game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_FIGHT);
            // Director.getInstance().changeScene();
            this.gp_boss.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
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
            App.EventSystem.addEventListener(PanelNotify.BOSS_WAVE_UPDATE, this.updateWave, this);  //监听波数更新
            App.EventSystem.addEventListener(PanelNotify.HERO_BAG_NOT_ENOUGH, this.bagNotEnough, this); //背包满
            App.EventSystem.addEventListener(PanelNotify.HERO_COIN_NOT_ENOUGH, this.coinNotEnough, this); //金币不足
            App.EventSystem.addEventListener(PanelNotify.HERO_MONEY_NOT_ENOUGH, this.moneyNotEnough, this); //元宝不足
            this.openBossIconEffect();
            App.EventSystem.addEventListener(PanelNotify.PLAYER_OFFLINE_INFO, this.showOfflineInfo, this);
            // App.EventSystem.addEventListener(PanelNotify.PLAYER_FASTFIGHT_INFO, this.fastFightInfo, this);
            App.EventSystem.addEventListener(PanelNotify.PLAYER_FASTFIGHT_RESULT, this.fastFightResult, this);

            ChatController.getInstance().getChatList();
            //聊天窗口
            if (this._eventid_chatlist == 0)
                this._eventid_chatlist = App.EventSystem.addEventListener(PanelNotify.CHAT_LIST_UPDATE, this.playChatList, this);

            if (this._eventid_onechat == 0){
                this._eventid_onechat = App.EventSystem.addEventListener(PanelNotify.CHAT_HAS_NEW_INFO, this.playOneChat, this);
            }

            this.scr_chatlist.viewport = this.vp_chatlist;
            this.scr_chatlist.scrollPolicyH = eui.ScrollPolicy.OFF;
            if (this._uichatlist.length < 1)
                this.playChatList()


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

            this.img_fastfight.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {    //每日必做模块入口
                let view = new FastFightView();
                PopUpManager.addPopUp({ obj: view });
            }, this);

            this.gp_meetBoss.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{  //遭遇boss入口
                var bossModel:BossModel = BossModel.getInstance();
                App.WinManager.openWin(WinName.BOSS_MEET,{});
            }, this);

           this.img_copy.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{   //副本模块入口
               App.WinManager.openWin(WinName.COPY);
           }, this);

           this.img_worldBoss.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
               App.WinManager.openWin(WinName.WORLDBOSS);
           }, this)

           this.btn_arena.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{  //竞技场
               App.WinManager.openWin(WinName.HEGEMONY);
           }, this)

           this.btn_metal.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{  //勋章
               App.WinManager.openWin(WinName.METAL);
           }, this)

           this.btn_daily.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{  //日常
                 App.WinManager.openWin(WinName.MUSTDO);
           }, this)
           
            this.initView();
            App.WinManager.openWin(WinName.MAIN_BOTTOM);
            // App.Socket.send(14001, {});
            // App.Socket.send(15001, {});
            // Director.getInstance().changeScene();

            if(this._chatBtn == null){
                this._chatBtn = new IconButton({id:MainUIBtnType.CHAT,icon:"main_icon_liaotian_png",btnTipType:ConstBtnTipType.CHAT,winName:WinName.CHAT});
                this._chatBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                        App.WinManager.openWin(WinName.CHAT);
                }, this);
                this.gp_middle.addChild(this._chatBtn);
                this._chatBtn.x = 68-50;
                this._chatBtn.y = 920-50;
                App.BtnTipManager.addBtnTipItem(ConstBtnTipType.CHAT,this._chatBtn,80,10);
            }
            this.updateTopBtn();
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.BOSS_CHALLENGE,this.gp_boss);

        }

        private updateTopBtn(){
            for(var i:number = 0;i<this._topBtnList.length;i++){
                var item:IconButton = this._topBtnList[i];
                item.destroy();
                if(item.parent){
                    item.parent.removeChild(item);
                }
            }
            this._topBtnList = [];
            for(var j:number = 0;j<MainUITopListConf.length;j++){
                let d:any = MainUITopListConf[j];
                let item: IconButton = this.creatOneTopBtn(d);
                this.gp_activity.addChild(item);
                var pos:point = this.getTopBtnPos(j);
                item.x = pos.x;
                item.y = pos.y;
                this._topBtnList.push(item);
            }
        }

        private creatOneTopBtn(d: any):IconButton {
            let item: IconButton = new IconButton(d);
            if (d.btnTipType != ConstBtnTipType.NULL) { 
                App.BtnTipManager.addBtnTipItem(d.btnTipType, item,70,20);
            }
            item.addEventListener(egret.TouchEvent.TOUCH_END, () => {
                if(d.id == MainUIBtnType.FIRSTCHARGE)
                {
                    RechargeOpenManager.getInstance().openRechargeView();
                }else if (d.id == MainUIBtnType.ACTIVITY) {
                    ActivityManager.getInstance().openActivity();
                }else{
                    if (App.WinManager.isOpen(String(d.winName))){
                        App.WinManager.closeWin(String(d.winName));
                    } else {
                        App.WinManager.openWin(String(d.winName));
                    }
                }
            }, this);
            return item;
        }

        /**
         * 根据ID移除按钮
         * @param id 按钮ID
         * App.EventSystem.dispatchEvent(PanelNotify.REMOVE_TOP_BTN, MainUIBtnType.ACTIVITY);
         */
        private removeTopBtnByID(id: number) {
            for (var j: number = 0; j < this._topBtnList.length; j++) {
                var item: IconButton = this._topBtnList[j];
                if (item.getId() == id) {
                    item.destroy();
                    if (item.parent) {
                        item.parent.removeChild(item);
                    }
                    this._topBtnList.splice(j, 1);
                }
            }
            for (var j: number = 0; j < this._topBtnList.length; j++) {
                var item: IconButton = this._topBtnList[j];
                var pos:point = this.getTopBtnPos(j);
                egret.Tween.get(item).to({ x: pos.x,y:pos.y }, 300);
            }
        }

        /**
         * 添加按钮
         * @param param =  {id:MainUIBtnType.ACTIVITY,index：1}
         * App.EventSystem.dispatchEvent(PanelNotify.ADD_TOP_BTN, {id:MainUIBtnType.ACTIVITY,index:1});
         */
        private addTopBtn(param: any) {
            for (var j: number = 0; j < this._topBtnList.length; j++) {
                var item: IconButton = this._topBtnList[j];
                if (item.getId() == param.id) {
                    return;
                }
            }
            var isfind:boolean = false;
            for (var j: number = 0; j < MainUITopListConf.length; j++) {
                let d: any = MainUITopListConf[j];
                if (d.id == param.id) {
                    isfind = true;
                    let item: IconButton = this.creatOneTopBtn(d);
                    this.gp_activity.addChild(item);
                    var pos:point = this.getTopBtnPos(j);
                    item.x = pos.x;
                    item.y = pos.y;
                    this._topBtnList.splice(param.index,0,item);
                    break;
                }
            }
            if(isfind){
                for (var j: number = 0; j < this._topBtnList.length; j++) {
                    var item: IconButton = this._topBtnList[j];
                    var pos:point = this.getTopBtnPos(j);
                    egret.Tween.get(item).to({ x: pos.x,y:pos.y }, 300);
                }
            }
        }

        /**
         *  根据Id获取顶部按钮
         */
        private getTopBtnPos(j:number):point{
            return new point((j%8)*87+15,Math.floor(j/8)*100);
        }
        /**
         *  根据Id获取顶部按钮
         */
        public getTopBtnById(id:number):IconButton{
             for(var i:number = 0;i<this._topBtnList.length;i++){
                var item:IconButton = this._topBtnList[i];
                if(item.getId() == id){
                   return item;
                }
            }
        }



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

        private initView() {
            (<eui.Label>this.btn_auto.labelDisplay).textColor = 0xe4cea9;
            (<eui.Label>this.btn_auto.labelDisplay).size = 24;
            this.joinBossIconEffect();
            this.closeBossIconEffect();
            this.requestServerData();
        }

        public updateWave() { //更新主界面波数
            this.pb_monsterWave.maximum = (BossModel.getInstance() as BossModel).waveAll;  
            this.pb_monsterWave.value = (BossModel.getInstance() as BossModel).wave;
            if((BossModel.getInstance() as BossModel).waveAll <= (BossModel.getInstance() as BossModel).wave) {
                this.openBossIconEffect();
                
                //波数已到，可以挑战boss
                App.EventSystem.dispatchEvent(PanelNotify.MAIN_BOSS_CAN_CHANLLENGE,true);
            } else {
                App.EventSystem.dispatchEvent(PanelNotify.MAIN_BOSS_CAN_CHANLLENGE,false);
                this.closeBossIconEffect();
            }
        }

        //聊天窗口
        //把收到的消息列表显示出来
        public playChatList() {
            // _chatList
            for (let i = 0; i < this._chatModel.chatAllList.length; i++) {

                let item = new eui.Label;
                item.size = 18;
                item.textFlow = GlobalUtil.getChatPortText(this._chatModel.chatAllList[i]);
                item.maxWidth = 420;
                item.lineSpacing = 10;
                this.vp_chatlist.addChild(item);
                item.$setY(this._nextchatposiy);
                item.x += 5;
                this._nextchatposiy += item.height + 10;
                this._uichatlist.push(item);
                this.vp_chatlist.height = 1000;

            }
            this.scr_chatlist.viewport.scrollV = this._nextchatposiy - this.scr_chatlist.height;
        }

        //有新消息加入
        public playOneChat(data) {

            if (this._uichatlist.length > 100) {
                this._nextchatposiy -= this._uichatlist[0].height;
                for (let i = 0; i < this._uichatlist.length; i++) {
                    this._uichatlist[i].y -= this._uichatlist[0].height;
                    this.vp_chatlist.removeChild(this._uichatlist[0]);
                }
            }
            let item = new eui.Label;
            item.size = 18;
            item.textFlow = GlobalUtil.getChatPortText(data);
            item.maxWidth = 420;
            item.lineSpacing = 10;
            this.vp_chatlist.addChild(item);
            item.$setY(this._nextchatposiy);
            item.x += 5;
            this._nextchatposiy += item.height + 10;
            this._uichatlist.push(item);

            this._uichatlist.shift();
            this.scr_chatlist.viewport.scrollV = this._nextchatposiy - this.scr_chatlist.height;
        }

        public partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
        }

        //离线挂机收益
        public showOfflineInfo() {
            if (this.mainUIModel.hookRewardInfo && this.mainUIModel.showOffline) {
                let view = new MainOffline(this.mainUIModel.hookRewardInfo);
                PopUpManager.addPopUp({ obj: view });
                this.mainUIModel.showOffline = false;
            }

        }

        //快速战斗信息
        public fastFightInfo() {

        }

        //快速战斗收益
        public fastFightResult() {
            if (this.mainUIModel.fastFightInfo) {
                let view = new FastFightResultView(this.mainUIModel.fastFightInfo);
                PopUpManager.addPopUp({ obj: view });
            }

        }

        public updatePlayerInfo() {

        }

        public changeStyle(style: MainModuleStyle) {

        }

        public changePlugFloatView(visible: boolean) {

        }

        /**场景初始化 */
        private onInitScene() {
            if(SceneUtil.isMainScene(SceneModel.getInstance().sceneId)) {
                this.gp_bossUiAll.visible = false;
                this.gp_meetBoss.visible = false;
            }else{
                this.gp_bossUiAll.visible = true;
            }


            //判断是否是Boss场景
            if(SceneUtil.isBossScene(this._sceneModel.sceneId) || SceneUtil.isWorldBossScene(this._sceneModel.sceneId) || this._sceneModel.sceneId == 30601){
                App.EventSystem.dispatchEvent(PanelNotify.MAIN_CLOSE_BUTTON);   //把主界面上顶部和旁边的图标隐藏
            }else{
                App.EventSystem.dispatchEvent(PanelNotify.MAIN_OPEN_BUTTON);  //把主界面上顶部和旁边的图标显示
            }


            //判断是否是世界boss场景
            if(SceneUtil.isWorldBossScene(this._sceneModel.sceneId)) {
                if (App.WinManager.isOpen(WinName.WORLDBOSS_FIGHT) == false) {
                    App.WinManager.openWin(WinName.WORLDBOSS_FIGHT, this._sceneModel.sceneId);
                }
            } else {
                if (App.WinManager.isOpen(WinName.WORLDBOSS_FIGHT)) {
                    App.WinManager.closeWin(WinName.WORLDBOSS_FIGHT);
                }
            }
        }

        public openAutoChallenge() {
            //自动挑战开启
            

            if(this._eventIdBossResult == 0) {
                this._eventIdBossResult = App.EventSystem.addEventListener(PanelNotify.SHOW_BOSS_RESULT, this.showBossResult, this);
            }
            if(this.gp_autoChallenge.visible) {
                App.Socket.send(13006, {id:0});  //关闭自动挑战
                this.gp_autoChallenge.visible = false;
            } else {
                App.Socket.send(13006, {id:1}); //打开自动挑战
                this.gp_autoChallenge.visible = true;
            } 
        }

        private showBossResult(result) {
            if(result === 1) {
                this.gp_meetBoss.visible = false;
            } else if(result === 0) {
                this.gp_autoChallenge.visible = false;
            }
        }

        public openButton() {  //打开侧面上面按钮
            this.gp_activity.visible = true;
            this.gp_bottom.visible = true;
            this.gp_chatlist.visible = true;
        }
        public closeButton() { //关闭侧面上面按钮
            this.gp_activity.visible = false;
            this.gp_bottom.visible = false;
            this.gp_chatlist.visible = false;
        }

        public joinBossIconEffect() {  //加入挑战boss图标特效和自动挑战特效
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
        }

        public openBossIconEffect() {  //打开挑战boss图标特效
            this.gp_bossUI.visible = true;
        }

        public closeBossIconEffect() {  //关闭挑战boss图标特效
            this.gp_bossUI.visible = false;
        }

        private bagNotEnough() {
            let okCB = function (selected) {
                // console.log("okkkk", selected);
                // App.WinManager.openWin(WinName.BACKPACK);
            }
            let cancelCB = function () {
                // console.log("cancellll");
            }
            App.GlobalTips.showAlert({ style: BaseTipsStyle.ONLY_OK, content: "背包空间不足，请先整理背包", okCB: okCB, cancelCB: cancelCB, context: this, needCheckBox: false });
        }

        private meetBoss(data) {
            if(data == 1) {
                this.gp_meetBoss.visible = true;
            } else {
                this.gp_meetBoss.visible = false;
            }
        }

        //元宝不足
        private moneyNotEnough() {
            let okCB = function (selected) {
                // console.log("okkkk", selected);
                // App.WinManager.openWin(WinName.BACKPACK);
            }
            let cancelCB = function () {
                // console.log("cancellll");
            }
            let text = "元宝不足，是否跳转充值页面"
            App.GlobalTips.showAlert({ style: BaseTipsStyle.ONLY_OK, content: text, okCB: okCB, cancelCB: cancelCB, context: this, needCheckBox: false });
        }

        //金币不足
        private coinNotEnough() {
            let view = new ItemWay(ClientType.BASE_ITEM, 101);
            PopUpManager.addPopUp({ obj: view });
        }


        //游戏进来时，请求服务端数据
        private requestServerData() {
            let priority = 5;
            let requestId = undefined;
            requestId = App.GlobalTimer.addSchedule(1000,priority,()=>{
                if (priority == 5) {
                    App.Socket.send(20002,{}); //修为次数信息

                } else if(priority == 4) {
                    
                } else if(priority == 1) {
                    SkillModel.getInstance().checkSkillCanUpgradeAll();
                }
                priority--;
            },this,()=>{
				App.GlobalTimer.remove(requestId);
			},this);
        }

        /**
		 * 打开窗口
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
            App.Socket.send(28003,{});
                    var setTimeOutId = setTimeout(function() {
                         App.Socket.send(35001,{});
                         clearTimeout(setTimeOutId);
                    }, 100);
            if(this._initSceneEventId === 0) {
                this._initSceneEventId = App.EventSystem.addEventListener(SceneEventType.INIT_SCENE, this.onInitScene, this);
            }
            if(this._meetBossEventId === 0) {
                this._meetBossEventId = App.EventSystem.addEventListener(PanelNotify.BOSS_MEET, this.meetBoss, this);
            }

            if (this.removeTopBtnEventId == 0) {
                this.removeTopBtnEventId = App.EventSystem.addEventListener(PanelNotify.REMOVE_TOP_BTN, this.removeTopBtnByID, this);
            }
            if (this.addTopBtnEventId == 0) {
                this.addTopBtnEventId = App.EventSystem.addEventListener(PanelNotify.ADD_TOP_BTN, this.addTopBtn, this);
            }
            
            this.mainline_view.readyOpen({data:{}});//主线任务
            (MainUIController.getInstance()as MainUIController).requestMainLineTaskInfo();
            this.validateNow();
		}

		/**
		 * 关闭窗口
		 */
		public closeWin(callback): void {
			super.closeWin(callback);
            
		}

        /**
         * 清理
         */
        public clear(data: any = null): void {
            super.clear(data);
            //清理聊天窗口事件
            if(this._eventid_chatlist != 0){
                App.EventSystem.removeEventListener(PanelNotify.CHAT_LIST_UPDATE, this._eventid_chatlist);
                this._eventid_chatlist = 0
            }
            if(this._eventid_onechat != 0){
                App.EventSystem.removeEventListener(PanelNotify.CHAT_HAS_NEW_INFO, this._eventid_onechat);
                this._eventid_onechat = 0
            }
            if(this._eventIdBossResult != 0) {
                App.EventSystem.removeEventListener(PanelNotify.SHOW_BOSS_RESULT, this._eventIdBossResult);
                this._eventIdBossResult = 0;
            }
            if(this._initSceneEventId != 0) {
                App.EventSystem.removeEventListener(SceneEventType.INIT_SCENE, this._initSceneEventId);
                this._initSceneEventId = 0;
            }
            if(this._meetBossEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.BOSS_MEET, this._meetBossEventId);
                this._meetBossEventId = 0;
            }
            if (this.removeTopBtnEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.REMOVE_TOP_BTN, this.removeTopBtnEventId);
                this.removeTopBtnEventId = 0;
            }
            if (this.addTopBtnEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.ADD_TOP_BTN, this.addTopBtnEventId);
                this.addTopBtnEventId = 0;
            }
            App.WinManager.closeWin(WinName.MAIN_BOTTOM);
        }
        /**
         * 销毁
         */
        public destroy(): void {
            App.EventSystem.removeEventListener(PanelNotify.PLAYER_OFFLINE_INFO);
            App.EventSystem.removeEventListener(PanelNotify.MAIN_CLOSE_BUTTON);
            App.EventSystem.removeEventListener(PanelNotify.MAIN_OPEN_BUTTON);
            App.EventSystem.removeEventListener(PanelNotify.MAIN_BOSSICON_EFFECT_OPEN);
            App.EventSystem.removeEventListener(PanelNotify.MAIN_BOSSICON_EFFECT_CLOSE);
            App.EventSystem.removeEventListener(PanelNotify.HERO_BAG_NOT_ENOUGH); //背包满
            App.EventSystem.removeEventListener(PanelNotify.HERO_COIN_NOT_ENOUGH); //金币不足
            App.EventSystem.removeEventListener(PanelNotify.HERO_MONEY_NOT_ENOUGH); //元宝不足
            App.EventSystem.removeEventListener(PanelNotify.PLAYER_FASTFIGHT_RESULT);
        }
    }
}
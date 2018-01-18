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
 * 游戏场景 2017/06/20.
 */
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        var _this = _super.call(this) || this;
        _this._centerHalfW = 64;
        _this._centerHalfH = 96;
        _this._playerId = 0;
        _this._updateTimes = 0;
        _this._sceneManager = SceneManager.getInstance();
        _this._eventSystem = EventSystem.getInstance();
        _this._sceneModel = SceneModel.getInstance();
        _this._globalModel = GlobalModel.getInstance();
        _this._stageHalfWidth = _this._sceneModel.sceneStageW / 2; //App.stageWidth/2;
        _this._stageHalfHeight = _this._sceneModel.sceneStageH / 2; //App.stageHeight/2;
        _this._scheduleId = 0; //调度ID
        _this._sceneInitEventId = 0;
        _this._curMapUrl = ""; //当前地图地址
        _this._curMiniMapUrl = ""; //当前小地图地址
        //游戏层次END
        //游戏对象字典
        _this._sceneNpcDic = {}; //场景npc
        _this._sceneMonsterDic = {}; //场景怪
        _this._scenePetDic = {}; //场景怪
        _this._scenePartnerDic = {}; //伙伴
        _this._scenePlayerDic = {}; //玩家
        _this._scenePlayerCopyDic = {}; //玩家镜像
        _this._sceneItemDic = {}; //物品
        _this._sceneCollectDic = {}; //采集物 
        _this._sceneSkillEffDic = {}; //技能效果，像火墙
        //场景效果
        _this._skillEffDic = {}; //场景技能效果，飞行，群体技能效果等
        //气血提示
        _this._hpTipsDic = {};
        //场景位置初始化
        _this._scenePosInit = false;
        //点击动画
        _this._clickMc = null;
        _this._delayExecutionQueue = [];
        _this.ff = true;
        _this.gridsItemList = [];
        _this._miniMapLayer = new eui.Image();
        _this._mapImage = new eui.Image();
        //this._mapLayer = new map.SceneMap();
        //this._mapLayer = new egret.DisplayObjectContainer();
        _this._elementLayer = new egret.DisplayObjectContainer();
        _this._bottomEffLayer = new egret.DisplayObjectContainer();
        _this._objectLayer = new egret.DisplayObjectContainer();
        _this._hpTipsLay = new egret.DisplayObjectContainer();
        _this._objectUILayer = new egret.DisplayObjectContainer();
        _this._topEffLayer = new egret.DisplayObjectContainer();
        _this.addChild(_this._miniMapLayer);
        _this.addChild(_this._mapImage);
        // this.addChild(this._mapLayer);
        _this.addChild(_this._elementLayer);
        _this.addChild(_this._bottomEffLayer);
        _this.addChild(_this._objectLayer);
        _this.addChild(_this._hpTipsLay);
        _this.addChild(_this._objectUILayer);
        _this.addChild(_this._topEffLayer);
        _this.initListener();
        _this._sceneManager.gameScene = _this;
        return _this;
    }
    /**
     * 初始化监听
     */
    GameScene.prototype.initListener = function () {
        if (this._eventSystem.hasEventListener(SceneEventType.INIT_SCENE) == false && this._sceneInitEventId == 0) {
            this._sceneInitEventId = this._eventSystem.addEventListener(SceneEventType.INIT_SCENE, this.initScene, this);
        }
        if (this._eventSystem.hasEventListener(SceneEventType.UPDATE_HONOR_TITLE) == false) {
            this._eventSystem.addEventListener(SceneEventType.UPDATE_HONOR_TITLE, this.updateHonorTitle, this);
        }
        if (this._eventSystem.hasEventListener(SceneEventType.ADD_SCENE_OBJECT) == false) {
            this._eventSystem.addEventListener(SceneEventType.ADD_SCENE_OBJECT, this.addSceneObject, this);
        }
        if (this._eventSystem.hasEventListener(SceneEventType.REMOVE_SCENE_OBJECT) == false) {
            this._eventSystem.addEventListener(SceneEventType.REMOVE_SCENE_OBJECT, this.removeSceneObject, this);
        }
        if (this._eventSystem.hasEventListener(SceneEventType.SCENE_OBJECT_MOVE) == false) {
            this._eventSystem.addEventListener(SceneEventType.SCENE_OBJECT_MOVE, this.sceneObjectMove, this);
        }
        if (this._eventSystem.hasEventListener(SceneEventType.UPDATE_SCENE_POS) == false) {
            this._eventSystem.addEventListener(SceneEventType.UPDATE_SCENE_POS, this.updateScenePos, this);
        }
        // if(this._eventSystem.hasEventListener(SceneEventType.UPDATE_HP) == false){
        // 	this._eventSystem.addEventListener(SceneEventType.UPDATE_HP,this.onUpdateHp,this);
        // }
        if (this._eventSystem.hasEventListener(SceneEventType.SHOW_BODY_EFF) == false) {
            this._eventSystem.addEventListener(SceneEventType.SHOW_BODY_EFF, this.showBodyEff, this);
        }
        if (this._eventSystem.hasEventListener(SceneEventType.SHOW_FLY_EFF) == false) {
            this._eventSystem.addEventListener(SceneEventType.SHOW_FLY_EFF, this.showFlyEff, this);
        }
        if (this._eventSystem.hasEventListener(SceneEventType.SHOW_GROUP_EFF) == false) {
            this._eventSystem.addEventListener(SceneEventType.SHOW_GROUP_EFF, this.showGroupEff, this);
        }
        if (this._eventSystem.hasEventListener(SceneEventType.PLAY_COLLISION) == false) {
            this._eventSystem.addEventListener(SceneEventType.PLAY_COLLISION, this.playRoleCollision, this);
        }
        if (this._eventSystem.hasEventListener(SceneEventType.HOOK_SKILL_TRIGGER) == false) {
            this._eventSystem.addEventListener(SceneEventType.HOOK_SKILL_TRIGGER, this.onHookSkillTrigger, this);
        }
        // if(this._eventSystem.hasEventListener(SceneEventType.SKILL_TRIGGER) == false){
        // 	this._eventSystem.addEventListener(SceneEventType.SKILL_TRIGGER,this.onSkillTrigger,this);
        // }
        if (this._eventSystem.hasEventListener(SceneEventType.UPDATE_OBJ_MODEL) == false) {
            this._eventSystem.addEventListener(SceneEventType.UPDATE_OBJ_MODEL, this.updateObjModel, this);
        }
        if (this._eventSystem.hasEventListener(SceneEventType.HOOK_SPECIAL_SKILL_TRIGGER) == false) {
            this._eventSystem.addEventListener(SceneEventType.HOOK_SPECIAL_SKILL_TRIGGER, this.onHookSpecialSkillTrigger, this);
        }
        if (this._eventSystem.hasEventListener(SceneEventType.SHOW_SKILL_RANG_GRIDS) == false) {
            this._eventSystem.addEventListener(SceneEventType.SHOW_SKILL_RANG_GRIDS, this.showSkillRangeGrids, this);
        }
        this._stageHalfWidth = this._sceneModel.sceneStageW / 2; //App.stageWidth/2;
        this._stageHalfHeight = this._sceneModel.sceneStageH / 2; //App.stageHeight/2;
        this._playerId = RoleManager.getInstance().getMainHeroId();
    };
    /**
     * 更新气血
     */
    GameScene.prototype.onUpdateHp = function (vo) {
        if (vo.targetArr) {
            for (var i = 0; i < vo.targetArr.length; i++) {
                var tvo = vo.targetArr[i];
                var hurtValue = Math.round((Math.random() - 0.9) * 200);
                var hurtType = Math.round(Math.random() * 4);
                if (hurtType == 3 /* CRIT */) {
                    hurtValue = 0 - Math.round(Math.random() * 50 + 290);
                }
                else if (hurtType == 1 /* DODGE */) {
                    hurtValue = 0;
                }
                else if (hurtType == 4 /* REBOUND */) {
                    hurtValue = Math.round(0 - Math.random() * 50);
                }
                tvo.curHp = tvo.curHp + hurtValue;
                var obj = this.getSceneObject(tvo);
                if (obj) {
                    obj.updateHp();
                    if (tvo.curHp > 0) {
                        this.showHpTips(tvo.posX, tvo.posY, hurtValue, hurtType);
                    }
                }
            }
        }
    };
    /**
     * 显示气血提示
     */
    GameScene.prototype.showHpTips = function (xx, yy, hp, hurtType) {
        if (hurtType === void 0) { hurtType = 0; }
        var tips = ObjectPool.pop("SceneTipsHp"); //new SceneTipsHp();//
        tips.setText(hp, hurtType);
        tips.moveTo(xx, yy);
        this._hpTipsDic[tips.id] = tips;
        this._hpTipsLay.addChild(tips);
    };
    /**
     * 显示身上效果
     */
    GameScene.prototype.showBodyEff = function (vo) {
        for (var i = 0; i < vo.targetArr.length; i++) {
            var obj = this.getSceneObject(vo.targetArr[i]);
            if (obj) {
                obj.playGetHitEff(vo.skillVo);
            }
        }
    };
    /**
     * 播放冲撞效果
     */
    GameScene.prototype.playRoleCollision = function (vo) {
        for (var i = 0; i < vo.targetArr.length; i++) {
            var obj = this.getSceneObject(vo.targetArr[i]);
            if (obj) {
                obj.playBeCollision(2, vo.atkVo.dire.dire8);
            }
        }
    };
    /**
     * 显示飞行效果
     */
    GameScene.prototype.showFlyEff = function (vo) {
        var view = new SceneFlyEff(vo);
        this._objectLayer.addChild(view);
        this._skillEffDic[vo.id] = view;
    };
    /**
     * 显示群体效果
     */
    GameScene.prototype.showGroupEff = function (vo) {
        var view = new SceneGroupEff(vo);
        this._topEffLayer.addChild(view);
        this._skillEffDic[vo.id] = view;
    };
    /**
     * 初始化
     */
    GameScene.prototype.initScene = function (data) {
        if (data == null) {
            this._sceneModel.debugMonsterNum = 25;
        }
        this._playerId = RoleManager.getInstance().getMainHeroId();
        this.stopSchedule();
        this.showSceneLoading();
        this.clear();
        //this._mapLayer.clear();
        if (this._batchResLoad == null) {
            this._batchResLoad = new BatchResLoad();
        }
        if (this._miniMapLayer) {
            this._miniMapLayer.source = null;
        }
        this._loadReslist = [[ResUrlUtil.getMapMiniUrlById(this._sceneModel.mapResId), RES.ResourceItem.TYPE_IMAGE], [ResUrlUtil.getMapConfUrlById(this._sceneModel.mapResId), RES.ResourceItem.TYPE_JSON]];
        //,[ResUrlUtil.getMapUrlById(this._sceneModel.mapResId),RES.ResourceItem.TYPE_IMAGE]
        this._batchResLoad.loadUrl(this._loadReslist, this.loadResComplete, this, this.loadProgress);
        //处理好场景相关的东西后就this.startScene();
        //this.startScene();
        //App.logzsq("加载场景资源");
    };
    /**
     * 加载大图成功
     */
    GameScene.prototype.onBigMapComplete = function (data, curl) {
        if (this._curMapUrl != curl) {
            if (this._curMapUrl && this._curMapUrl != "") {
                RES.destroyRes(this._curMapUrl);
            }
            if (this._mapImage) {
                this._mapImage.source = data;
            }
            this._curMapUrl = curl;
            this._mapImage.width = this._sceneModel.sceneWidth;
            this._mapImage.height = this._sceneModel.sceneHeight;
            this._miniMapLayer.visible = false;
        }
    };
    /**
     * 进度函数
     */
    GameScene.prototype.loadProgress = function (cur, all) {
        if (this._sceneLoading) {
            this._sceneLoading.setProgress(cur, all);
        }
    };
    /**
     * 资源加载成功
     */
    GameScene.prototype.loadResComplete = function (data) {
        var mapConf = data[ResUrlUtil.getMapConfUrlById(this._sceneModel.mapResId)];
        if (mapConf) {
            this._sceneModel.updateSceneConfig(mapConf);
            App.logzsq("SCENE WIDTH = ", this._sceneModel.sceneWidth, this._sceneModel.sceneHeight);
            //this._mapLayer.init(this._sceneModel.mapResId,this._sceneModel.sceneWidth,this._sceneModel.sceneHeight);
        }
        else {
            App.GlobalTips.showTips("地图配置加载失败 MAPID = " + this._sceneModel.mapResId);
        }
        var miniMap = data[ResUrlUtil.getMapMiniUrlById(this._sceneModel.mapResId)];
        if (miniMap) {
            var curUrl = ResUrlUtil.getMapMiniUrlById(this._sceneModel.mapResId);
            if (this._curMiniMapUrl != curUrl) {
                if (this._curMiniMapUrl != "") {
                    RES.destroyRes(this._curMiniMapUrl);
                }
                this._curMiniMapUrl = curUrl;
                if (this._miniMapLayer) {
                    this._miniMapLayer.source = miniMap;
                }
                this._miniMapLayer.width = this._sceneModel.sceneWidth;
                this._miniMapLayer.height = this._sceneModel.sceneHeight;
                this._miniMapLayer.visible = true;
            }
            else {
                App.GlobalTips.showTips("小地图加载失败 MAPID = " + this._sceneModel.mapResId);
            }
        }
        var curBigMapUrl = ResUrlUtil.getMapUrlById(this._sceneModel.mapResId);
        if (curBigMapUrl != this._curMapUrl) {
            if (this._curMapUrl && this._curMapUrl != "") {
                RES.destroyRes(this._curMapUrl);
            }
            if (this._mapImage) {
                this._mapImage.source = null;
            }
            RES.getResByUrl(curBigMapUrl, this.onBigMapComplete, this, RES.ResourceItem.TYPE_IMAGE);
        }
        // var res:any = data[ResUrlUtil.getMapUrlById(this._sceneModel.mapResId)];
        // if(res){
        // 	if(this._curMapUrl && this._curMapUrl != ""){
        // 		RES.destroyRes(this._curMapUrl);
        // 	}
        // 	this._mapImage.source = res;
        // 	this._curMapUrl = ResUrlUtil.getMapUrlById(this._sceneModel.mapResId);
        // 	this._mapImage.width = this._sceneModel.sceneWidth;
        // 	this._mapImage.height =  this._sceneModel.sceneHeight;
        // }
        this._scenePosInit = false;
        this.startScene();
        //    for(let i=0;i<0;i++){
        // 	    let vo = new ScenePlayerVo();
        // 		vo.id = i+1000;
        // 		vo.name= "角色"+i;
        // 		vo.gridX = SceneModel.getInstance().getRandomGX();
        // 		vo.gridY = SceneModel.getInstance().getRandomGY();
        // 		vo.posX = SceneUtil.gridToPixelX(vo.gridX);
        // 		vo.posY =  SceneUtil.gridToPixelY(vo.gridY);
        // 		vo.patrolX = vo.posX;
        // 		vo.patrolY = vo.posY;
        // 		vo.pkMode = PKModeType.ALL;
        // 		if(i ==0){
        // 			vo.hp = 1000;
        // 			vo.curHp = 1000;
        // 		}
        // 	    SceneModel.getInstance().addSceneObjectVo(vo);
        // 		//(EventSystem.getInstance() as EventSystem).dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,vo);
        //    }
        for (var k in this._sceneModel.scenePlayerVoDic) {
            this._eventSystem.dispatchEvent(SceneEventType.ADD_SCENE_OBJECT, this._sceneModel.scenePlayerVoDic[k]);
        }
        for (var k in this._sceneModel.scenePlayerCopyVoDic) {
            this._eventSystem.dispatchEvent(SceneEventType.ADD_SCENE_OBJECT, this._sceneModel.scenePlayerCopyVoDic[k]);
        }
        for (var k in this._sceneModel.sceneNpcVoDic) {
            this._eventSystem.dispatchEvent(SceneEventType.ADD_SCENE_OBJECT, this._sceneModel.sceneNpcVoDic[k]);
        }
        for (var k in this._sceneModel.sceneMonsterVoDic) {
            this._eventSystem.dispatchEvent(SceneEventType.ADD_SCENE_OBJECT, this._sceneModel.sceneMonsterVoDic[k]);
        }
        for (var k in this._sceneModel.scenePetVoDic) {
            this._eventSystem.dispatchEvent(SceneEventType.ADD_SCENE_OBJECT, this._sceneModel.scenePetVoDic[k]);
        }
        for (var k in this._sceneModel.sceneItemVoDic) {
            this._eventSystem.dispatchEvent(SceneEventType.ADD_SCENE_OBJECT, this._sceneModel.sceneItemVoDic[k]);
        }
        this._eventSystem.dispatchEvent(SceneEventType.SCENE_INIT_COMPLETE);
        //this._sceneModel.sceneId;
        //zhanagshunqiu test Mc
        this.touchEnabled = true;
        if (this.hasEventListener(egret.TouchEvent.TOUCH_BEGIN) == false) {
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseTouch, this);
        }
        //Math.random()*SceneModel.getInstance().sceneWidth,Math.random()*SceneModel.getInstance().sceneHeight
        // var vo = new SceneItemVo();
        // SceneModel.getInstance().addSceneObjectVo(vo);
        // (EventSystem.getInstance() as EventSystem).dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,vo);
        // var vo4 = new SceneCollectVo();
        // SceneModel.getInstance().addSceneObjectVo(vo4);
        // (EventSystem.getInstance() as EventSystem).dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,vo4);
        // var vo3 = new SceneNpcVo();
        // SceneModel.getInstance().addSceneObjectVo(vo3);
        // (EventSystem.getInstance() as EventSystem).dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,vo3);
        // var vo2 = new SceneSkillEffVo();
        // SceneModel.getInstance().addSceneObjectVo(vo2);
        // (EventSystem.getInstance() as EventSystem).dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,vo2);
        //zhanagshunqiu test Mc end
        //App.logzsq("加载场景资源完成");
        egret.setTimeout(function () {
            this.closeSceneLoading();
        }, this, 500);
    };
    GameScene.prototype.mouseTouch = function (event) {
        // var middleX:number = App.stageWidth/2;
        //var middleY:number = App.stageHeight/2;
        //var dire :any = SceneUtil.getDirectByPoint(event.localX,event.localY,middleX,middleY);
        //this._sceneNpcDic[1000].updateDirect(dire);
        //this._sceneNpcDic[1000].moveToPoint([event.localX,event.localY])
        var gx = SceneUtil.pixelToGridX(event.localX);
        var gy = SceneUtil.pixelToGridY(event.localY);
        var px = SceneUtil.gridToPixelX(gx);
        var py = SceneUtil.gridToPixelY(gy);
        var player = this._scenePlayerDic[this._playerId];
        if (player) {
            var vo = player.vo;
            // var list:Array<any> = SceneModel.getInstance().getAStarGridPath(vo.gridX,vo.gridY,gx,gy);
            // if(list){
            // 	for(var i:number = 0;i<list.length;i++){
            // 		list[i][0] = SceneUtil.gridToPixelX(list[i][0]);
            // 		list[i][1] = SceneUtil.gridToPixelX(list[i][1]);
            // 	}
            // 	player.addMovePath(list);
            // }
            //this.showClickMc(px,py,(list == null));
            player.clearMovePath();
            player.playMove([[px, py]]);
            this.showClickMc(px, py, false);
            App.logzsq("mouseTouch ", vo.getPetNum(), player.vo.gridX, player.vo.gridY);
        }
        // if(this.ff){
        // 	App.EventSystem.dispatchEvent(PanelNotify.REMOVE_TOP_BTN, MainUIBtnType.FIRSTCHARGE);
        // 	this.ff = false;
        // }else{
        // 	App.EventSystem.dispatchEvent(PanelNotify.ADD_TOP_BTN, {id:MainUIBtnType.FIRSTCHARGE,index:1});
        // 	this.ff = true;
        // }
    };
    /**
     * 场景开始
     */
    GameScene.prototype.startScene = function () {
        this.stopSchedule();
        this._scheduleId = App.GlobalTimer.addFrameSchedule(this.update, this);
    };
    /**
     * 场景停止
     */
    GameScene.prototype.stopScene = function () {
        this.stopSchedule();
    };
    /**
     * 场景更新
     */
    GameScene.prototype.update = function (t) {
        this._updateTimes++;
        if (this._updateTimes % 2 == 0) {
            for (var key in this._hpTipsDic) {
                var hptip = this._hpTipsDic[key];
                if (hptip.update()) {
                }
                else {
                    hptip.destroy();
                    this._hpTipsDic[key] = null;
                    delete this._hpTipsDic[key];
                }
            }
        }
        //var t:number = Date.now();
        if (this._updateTimes % 2 >= 0) {
            for (var key in this._sceneNpcDic) {
                this._sceneNpcDic[key].update();
            }
            for (var key in this._sceneMonsterDic) {
                this._sceneMonsterDic[key].update();
            }
            for (var key in this._scenePetDic) {
                this._scenePetDic[key].update();
            }
            for (var key in this._scenePartnerDic) {
                this._scenePartnerDic[key].update();
            }
            for (var key in this._scenePlayerDic) {
                this._scenePlayerDic[key].update();
            }
            for (var key in this._scenePlayerCopyDic) {
                this._scenePlayerCopyDic[key].update();
            }
            var num = 0;
            for (var key in this._sceneItemDic) {
                this._sceneItemDic[key].update();
                num++;
            }
            this._sceneModel.curSceneItemNum = num;
            for (var key in this._sceneCollectDic) {
                this._sceneCollectDic[key].update();
            }
            for (var key in this._sceneSkillEffDic) {
                this._sceneSkillEffDic[key].update();
            }
        }
        // if(this._updateTimes%200>=0){
        // 		App.logzsq(Date.now()-t)
        // }
        var effobj;
        for (var key in this._skillEffDic) {
            effobj = this._skillEffDic[key];
            if (effobj.update() == false) {
                effobj.destroy();
                if (effobj.parent) {
                    effobj.parent.removeChild(effobj);
                }
                this._skillEffDic[key] = null;
                delete this._skillEffDic[key];
            }
        }
        if (this._updateTimes % 40 == 1) {
            var childList = this._objectLayer.$children;
            childList.sort(function (a, b) {
                if (a.y > b.y) {
                    return 1;
                }
                return -1;
            });
            // var len:number = childList.length;
            // for(var i:number = 0; i< len;i++){
            // 	//this._objectLayer.setChildIndex(childList[i],999);
            // }
            // this._objectLayer.$children.forEach((value,index)=> {
            // 	this._objectLayer.setChildIndex(value,999);
            // },this);
        }
        if (this._updateTimes % 250 == 1) {
            this._sceneManager.update();
        }
        if (this._delayExecutionQueue.length > 0) {
            var f = this._delayExecutionQueue.shift();
            // this._delayExecutionQueue.push();
        }
        return true;
    };
    /**
     * 清理
     */
    GameScene.prototype.clear = function () {
        this.stopSchedule();
        //this.closeSceneLoading();
        this._scenePosInit == false;
        this._delayExecutionQueue = [];
        if (this._batchResLoad) {
            this._batchResLoad.destory();
            this._batchResLoad = null;
        }
        for (var key in this._sceneNpcDic) {
            this.removeSceneObject(this._sceneNpcDic[key].vo);
        }
        for (var key in this._sceneMonsterDic) {
            this.removeSceneObject(this._sceneMonsterDic[key].vo);
        }
        for (var key in this._scenePetDic) {
            this.removeSceneObject(this._scenePetDic[key].vo);
        }
        for (var key in this._scenePartnerDic) {
            this.removeSceneObject(this._scenePartnerDic[key].vo);
        }
        for (var key in this._scenePlayerDic) {
            this.removeSceneObject(this._scenePlayerDic[key].vo);
        }
        for (var key in this._scenePlayerCopyDic) {
            this.removeSceneObject(this._scenePlayerCopyDic[key].vo);
        }
        for (var key in this._sceneItemDic) {
            this.removeSceneObject(this._sceneItemDic[key].vo);
        }
        for (var key in this._sceneCollectDic) {
            this.removeSceneObject(this._sceneCollectDic[key].vo);
        }
        for (var key in this._sceneSkillEffDic) {
            this.removeSceneObject(this._sceneSkillEffDic[key].vo);
        }
        var hptip;
        for (var key in this._hpTipsDic) {
            hptip = this._hpTipsDic[key];
            hptip.destroy();
            this._hpTipsDic[key] = null;
        }
        this._hpTipsDic = {};
        var effobj;
        for (var key in this._skillEffDic) {
            effobj = this._skillEffDic[key];
            effobj.destroy();
            if (effobj.parent) {
                effobj.parent.removeChild(effobj);
            }
            delete this._skillEffDic[key];
        }
        this._skillEffDic = {};
        this._sceneManager.clear();
        if (this._loadReslist && this._loadReslist.length > 0) {
            for (var k = 0; k < this._loadReslist.length; k++) {
                var url = this._loadReslist[k][0];
                RES.destroyRes(url);
            }
            this._loadReslist = [];
        }
        this._curMapUrl = "";
        this._curMiniMapUrl = "";
    };
    /**
     * 销毁
     */
    GameScene.prototype.destroy = function () {
        this._eventSystem.removeEventListener(SceneEventType.UPDATE_HONOR_TITLE);
        this._eventSystem.removeEventListener(SceneEventType.ADD_SCENE_OBJECT);
        this._eventSystem.removeEventListener(SceneEventType.REMOVE_SCENE_OBJECT);
        this._eventSystem.removeEventListener(SceneEventType.SCENE_OBJECT_MOVE);
        if (this._sceneInitEventId != 0) {
            this._eventSystem.removeEventListener(SceneEventType.INIT_SCENE, this._sceneInitEventId);
            this._sceneInitEventId = 0;
        }
        this._eventSystem.removeEventListener(SceneEventType.UPDATE_SCENE_POS);
        this._eventSystem.removeEventListener(SceneEventType.UPDATE_HP);
        this._eventSystem.removeEventListener(SceneEventType.SHOW_BODY_EFF);
        this._eventSystem.removeEventListener(SceneEventType.SHOW_FLY_EFF);
        this._eventSystem.removeEventListener(SceneEventType.SHOW_GROUP_EFF);
        this._eventSystem.removeEventListener(SceneEventType.PLAY_COLLISION);
        this._eventSystem.removeEventListener(SceneEventType.HOOK_SKILL_TRIGGER);
        this._eventSystem.removeEventListener(SceneEventType.UPDATE_OBJ_MODEL);
        this._eventSystem.removeEventListener(SceneEventType.HOOK_SPECIAL_SKILL_TRIGGER);
        this._eventSystem.removeEventListener(SceneEventType.SHOW_SKILL_RANG_GRIDS);
        this.clear();
        //this._mapLayer.clear();
    };
    /**
     * 更新场景对象模型
     * @param BaseObjectVo 对象VO
     */
    GameScene.prototype.updateObjModel = function (vo) {
        if (vo) {
            var obj = this.getSceneObject(vo);
            if (obj) {
                obj.updateAllModel();
            }
        }
    };
    /**
     * 更新称号
     * data = {objId=123,honorId=123}
     */
    GameScene.prototype.updateHonorTitle = function (data) {
        var vo = this._sceneModel.getPlayerVo(data.objId);
        if (vo) {
            vo.honorTitleUrl = data.honorId + "_png";
            var obj = this.getSceneObject(vo);
            obj.updateHonorTitle();
        }
    };
    // optional	int32	skill_id	= 1;  // 技能id
    // 	optional	int32	cast_type	= 2;  // 施法者类型
    // 	optional	int32	cast_id		= 3;  // 施法者id
    // 	repeated	pbHookObj target_list = 4;// 受击者列表
    // 	optional	int32	x			= 5;  // 目标坐标x
    // 	optional	int32	y			= 6; // 目标坐标y
    // 	optional	int32	obj_type	=1;//对象类型
    // 	optional	int32	obj_id      =2;//对象id
    /**
     * 挂机特殊技能动作，如野蛮冲撞，火环
     */
    GameScene.prototype.onHookSpecialSkillTrigger = function (data) {
        if (data.skill_id == SKILL_YMCZ_ID) {
            var atk = this.getSceneObjectById(data.cast_id, data.cast_type);
            if (atk) {
                atk.playCollision(2);
            }
            for (var i = 0; i < data.target_list.length; i++) {
                var v = data.target_list[i];
                var obj = this.getSceneObjectById(v.obj_id, v.obj_type);
                if (obj && obj.vo.immuneCZ == false) {
                    if (atk) {
                        obj.playBeCollision(2, atk.vo.dire.dire8);
                    }
                    else {
                        obj.playBeCollision(2, SceneUtil.getReversedDireScale(obj.vo.dire.dire8).dire8);
                    }
                }
            }
        }
        else if (data.skill_id == SKILL_KJHH_ID) {
            var atk = this.getSceneObjectById(data.cast_id, data.cast_type);
            for (var i = 0; i < data.target_list.length; i++) {
                var v = data.target_list[i];
                var obj = this.getSceneObjectById(v.obj_id, v.obj_type);
                if (obj && obj.vo.immuneKJHH == false) {
                    if (atk) {
                        var dire = SceneUtil.getDirectByPoint(obj.vo.posX, obj.vo.posY, atk.vo.posX, atk.vo.posY);
                        obj.playBeCollision(2, dire.dire8);
                    }
                    else {
                        obj.playBeCollision(2, SceneUtil.getReversedDireScale(obj.vo.dire.dire8).dire8);
                    }
                }
            }
        }
    };
    // 	message pbHookUseSkill{
    // 		optional	int32	skill_id	= 1;  // 技能id
    // 		optional	int32	cast_type	= 2;  // 施法者类型
    // 		optional	int32	cast_id		= 3;  // 施法者id
    // 		repeated	pbHookObj target_list = 4;// 受击者列表
    // 		optional	int32	x			= 5;  // 目标坐标x
    // 		optional	int32	y			= 6; // 目标坐标y
    // }
    /**
     * 挂机技能伤害
     */
    GameScene.prototype.onHookSkillTrigger = function (data) {
        var harm_list = data.harm_list; //伤害列表
        var d;
        var obj;
        for (var i = 0; i < harm_list.length; i++) {
            var d = harm_list[i];
            obj = this.getSceneObjectById(d.obj_id, d.obj_type);
            if (obj) {
                var hurtType = d.harm_status;
                obj.vo.curHp = d.cur_hp;
                obj.vo.curMp = d.cur_mp;
                obj.updateHp();
                if (obj.vo.curHp >= 0) {
                    this.showHpTips(obj.vo.posX, obj.vo.posY, 0 - d.harm_value, hurtType);
                }
            }
        }
        var buff_list = data.buff_list; //buff列表
        for (var i = 0; i < buff_list.length; i++) {
            var d = buff_list[i];
            obj = this.getSceneObjectById(d.obj_id, d.obj_type);
            if (obj) {
                var bvo = new FBuffVo();
                bvo.initProto(d);
                if (d.buff_op == 1) {
                    obj.vo.addBuff(bvo);
                    obj.addBuff(bvo);
                }
                else if (d.buff_op == 2) {
                }
                else if (d.buff_op == 3) {
                    obj.vo.removeBuff(bvo);
                    obj.removeBuff(bvo);
                }
            }
        }
        var Cur_list = data.Cur_list; //回血列表
        for (var i = 0; i < Cur_list.length; i++) {
            var d = Cur_list[i];
            obj = this.getSceneObjectById(d.obj_id, d.obj_type);
            if (obj) {
                var hurtType = 2 /* ONLYHP */;
                obj.vo.curHp = d.cur_hp;
                obj.vo.curMp = d.cur_mp;
                obj.updateHp();
                if (obj.vo.curHp > 0) {
                    this.showHpTips(obj.vo.posX, obj.vo.posY, d.add_hp, hurtType);
                }
            }
        }
    };
    /**
     * 设置玩家副本是否显示
     */
    GameScene.prototype.setOtherPlayerVisible = function (b) {
        for (var key in this._scenePlayerCopyDic) {
            this._scenePlayerCopyDic[key].visible = b;
        }
    };
    // /**
    //  * 释放技能返回rpg
    //  */
    // private onSkillTrigger(data){
    // 	//if(data.)
    // }
    // if(data.buff_list){
    // 	}
    // 	// repeated	pbSkillObj obj_list = 1; //目标列表
    // 	// repeated    pbSkillBuff buff_list=2; //buff列表
    // 	// repeated    pbSkillMove move_list=3; //移动列表
    // 	// repeated	pbSkillMove Konck_list=4;//击退列表 
    // 	optional	int32	obj_type	=1;//对象类型
    // 	optional	int32	obj_id      =2;//对象id
    // 	optional    int32	buff_op		=3;//buff操作:1 添加,2 更新,3 删除
    // 	optional    int32   buff_id		=4;//buff_id
    // 	optional	int32   buff_time   =5;//倒计时
    /**
     * 场景对象移动
     */
    GameScene.prototype.sceneObjectMove = function (data) {
        var vo = this._sceneModel.getSceneObjectVo(data.obj_id, data.obj_type);
        if (vo && vo.id != this._playerId) {
            var obj = this.getSceneObject(vo);
            if (obj) {
                if (SceneUtil.getDistance(vo.posX, vo.posY, data.begin_x, data.begin_y) > 96) {
                    obj.updatePosition(data.begin_x, data.begin_y);
                }
                obj.playMove([[data.end_x, data.end_y]]);
            }
        }
    };
    GameScene.prototype.getSelfPlayer = function () {
        return this._scenePlayerDic[RoleManager.getInstance().getMainHeroId()];
    };
    /**
     * 获取场景对象
     */
    GameScene.prototype.getSceneObject = function (vo) {
        if (vo.type == SceneObjectType.NPC) {
            return this._sceneNpcDic[vo.id];
        }
        else if (vo.type == SceneObjectType.MONSTER) {
            return this._sceneMonsterDic[vo.id];
        }
        else if (vo.type == SceneObjectType.PET) {
            return this._scenePetDic[vo.id];
        }
        else if (vo.type == SceneObjectType.PLAYER) {
            return this._scenePlayerDic[vo.id];
        }
        else if (vo.type == SceneObjectType.PLAYERCOPY) {
            return this._scenePlayerCopyDic[vo.id];
        }
        else if (vo.type == SceneObjectType.PARTNER) {
            return this._scenePartnerDic[vo.id];
        }
        else if (vo.type == SceneObjectType.ITEM) {
            return this._sceneItemDic[vo.id];
        }
        else if (vo.type == SceneObjectType.SKILLEFF) {
            return this._sceneSkillEffDic[vo.id];
        }
        else if (vo.type == SceneObjectType.COLLECT) {
            return this._sceneCollectDic[vo.id];
        }
        return null;
    };
    /**
     * 根据场景ID和类型获取场景对象
     * @param id 场景对象ID
     * @param HpTipsType 场景对象Type
     */
    GameScene.prototype.getSceneObjectById = function (id, type) {
        if (type == SceneObjectType.NPC) {
            return this._sceneNpcDic[id];
        }
        else if (type == SceneObjectType.MONSTER) {
            return this._sceneMonsterDic[id];
        }
        else if (type == SceneObjectType.PET) {
            return this._scenePetDic[id];
        }
        else if (type == SceneObjectType.PLAYER) {
            return this._scenePlayerDic[id];
        }
        else if (type == SceneObjectType.PLAYERCOPY) {
            return this._scenePlayerCopyDic[id];
        }
        else if (type == SceneObjectType.PARTNER) {
            return this._scenePartnerDic[id];
        }
        else if (type == SceneObjectType.ITEM) {
            return this._sceneItemDic[id];
        }
        else if (type == SceneObjectType.SKILLEFF) {
            return this._sceneSkillEffDic[id];
        }
        else if (type == SceneObjectType.COLLECT) {
            return this._sceneCollectDic[id];
        }
        return null;
    };
    /**
     * 添加场景对象
     */
    GameScene.prototype.addSceneObject = function (event) {
        var vo = event;
        if (vo.type == SceneObjectType.NPC) {
            this.addSceneNpc(event);
        }
        else if (vo.type == SceneObjectType.MONSTER) {
            this.addSceneMonster(event);
        }
        else if (vo.type == SceneObjectType.PLAYER) {
            this.addScenePlayer(event);
        }
        else if (vo.type == SceneObjectType.PLAYERCOPY) {
            this.addScenePlayerCopy(event);
        }
        else if (vo.type == SceneObjectType.PET) {
            this.addScenePet(event);
        }
        else if (vo.type == SceneObjectType.PARTNER) {
            this.addScenePartner(event);
        }
        else if (vo.type == SceneObjectType.ITEM) {
            this.addSceneItem(event);
        }
        else if (vo.type == SceneObjectType.SKILLEFF) {
            this.addSceneSkillEff(event);
        }
        else if (vo.type == SceneObjectType.COLLECT) {
            this.addSceneCollect(event);
        }
    };
    /**
     * 移除场景对象
     */
    GameScene.prototype.removeSceneObject = function (event) {
        var vo = event;
        if (vo.type == SceneObjectType.NPC) {
            this.removeSceneNpc(event);
        }
        else if (vo.type == SceneObjectType.MONSTER) {
            this.removeSceneMonster(event);
        }
        else if (vo.type == SceneObjectType.PLAYER) {
            this.removeScenePlayer(event);
        }
        else if (vo.type == SceneObjectType.PLAYERCOPY) {
            this.removeScenePlayerCopy(event);
        }
        else if (vo.type == SceneObjectType.PET) {
            this.removeScenePet(event);
        }
        else if (vo.type == SceneObjectType.PARTNER) {
            this.removeScenePartner(event);
        }
        else if (vo.type == SceneObjectType.ITEM) {
            this.removeSceneItem(event);
        }
        else if (vo.type == SceneObjectType.SKILLEFF) {
            this.removeSceneSkillEff(event);
        }
        else if (vo.type == SceneObjectType.COLLECT) {
            this.removeSceneCollect(event);
        }
    };
    /**
     * 添加玩家
     */
    GameScene.prototype.addScenePlayer = function (vo) {
        if (this._scenePlayerDic[vo.id]) {
            this._scenePlayerDic[vo.id].vo = vo;
        }
        else {
            var displayObj = new ScenePlayer(vo);
            displayObj.init();
            this._scenePlayerDic[vo.id] = displayObj;
            this._objectLayer.addChild(displayObj);
        }
    };
    /**
     * 移除玩家
     */
    GameScene.prototype.removeScenePlayer = function (vo) {
        var displayObj = this._scenePlayerDic[vo.id];
        if (displayObj) {
            displayObj.destroy();
            if (displayObj.parent) {
                displayObj.parent.removeChild(displayObj);
            }
            // if(this._objectLayer.contains(displayObj)){
            // 	this._objectLayer.removeChild(displayObj);
            // }
            this._scenePlayerDic[vo.id] = null;
            delete this._scenePlayerDic[vo.id];
        }
    };
    /**
     * 添加玩家副本
     */
    GameScene.prototype.addScenePlayerCopy = function (vo) {
        if (this._scenePlayerCopyDic[vo.id]) {
            this._scenePlayerCopyDic[vo.id].vo = vo;
        }
        else {
            var displayObj = new ScenePlayer(vo);
            displayObj.init();
            this._scenePlayerCopyDic[vo.id] = displayObj;
            this._objectLayer.addChild(displayObj);
        }
    };
    /**
     * 移除玩家副本
     */
    GameScene.prototype.removeScenePlayerCopy = function (vo) {
        var displayObj = this._scenePlayerCopyDic[vo.id];
        if (displayObj) {
            displayObj.destroy();
            if (displayObj.parent) {
                displayObj.parent.removeChild(displayObj);
            }
            // if(this._objectLayer.contains(displayObj)){
            // 	this._objectLayer.removeChild(displayObj);
            // }
            this._scenePlayerCopyDic[vo.id] = null;
            delete this._scenePlayerCopyDic[vo.id];
        }
    };
    /**
     * 添加伙伴
     */
    GameScene.prototype.addScenePartner = function (vo) {
        if (this._scenePartnerDic[vo.id]) {
            this._scenePartnerDic[vo.id].vo = vo;
        }
        else {
            var displayObj = new ScenePartner(vo);
            displayObj.init();
            this._scenePartnerDic[vo.id] = displayObj;
            this._objectLayer.addChild(displayObj);
        }
    };
    /**
     * 移除伙伴
     */
    GameScene.prototype.removeScenePartner = function (vo) {
        var displayObj = this._scenePartnerDic[vo.id];
        if (displayObj) {
            displayObj.destroy();
            if (displayObj.parent) {
                displayObj.parent.removeChild(displayObj);
            }
            // if(this._objectLayer.contains(displayObj)){
            // 	this._objectLayer.removeChild(displayObj);
            // }
            this._scenePartnerDic[vo.id] = null;
            delete this._scenePartnerDic[vo.id];
        }
    };
    /**
     * 添加宠物
     */
    GameScene.prototype.addScenePet = function (vo) {
        if (this._scenePetDic[vo.id]) {
            this._scenePetDic[vo.id].vo = vo;
        }
        else {
            var displayObj = new ScenePet(vo);
            displayObj.init();
            this._scenePetDic[vo.id] = displayObj;
            this._objectLayer.addChild(displayObj);
        }
    };
    /**
     * 移除宠物
     */
    GameScene.prototype.removeScenePet = function (vo) {
        var displayObj = this._scenePetDic[vo.id];
        if (displayObj) {
            displayObj.destroy();
            if (displayObj.parent) {
                displayObj.parent.removeChild(displayObj);
            }
            // if(this._objectLayer.contains(displayObj)){
            // 	this._objectLayer.removeChild(displayObj);
            // }
            this._scenePetDic[vo.id] = null;
            delete this._scenePetDic[vo.id];
        }
    };
    /**
     * 添加怪物
     */
    GameScene.prototype.addSceneMonster = function (vo) {
        if (this._sceneMonsterDic[vo.id]) {
            this._sceneMonsterDic[vo.id].vo = vo;
        }
        else {
            var displayObj = new SceneMonster(vo);
            displayObj.init();
            this._sceneMonsterDic[vo.id] = displayObj;
            this._objectLayer.addChild(displayObj);
        }
    };
    /**
     * 移除怪物
     */
    GameScene.prototype.removeSceneMonster = function (vo) {
        var displayObj = this._sceneMonsterDic[vo.id];
        if (displayObj) {
            displayObj.destroy();
            if (displayObj.parent) {
                displayObj.parent.removeChild(displayObj);
            }
            // if(this._objectLayer.contains(displayObj)){
            // 	this._objectLayer.removeChild(displayObj);
            // }
            this._sceneMonsterDic[vo.id] = null;
            delete this._sceneMonsterDic[vo.id];
        }
    };
    /**
     * 添加Npc
     */
    GameScene.prototype.addSceneNpc = function (vo) {
        if (this._sceneNpcDic[vo.id]) {
            this._sceneNpcDic[vo.id].vo = vo;
        }
        else {
            var displayObj = new SceneNpc(vo);
            displayObj.init();
            this._sceneNpcDic[vo.id] = displayObj;
            this._objectLayer.addChild(displayObj);
        }
    };
    /**
     * 移除Npc
     */
    GameScene.prototype.removeSceneNpc = function (vo) {
        var displayObj = this._sceneNpcDic[vo.id];
        if (displayObj) {
            displayObj.destroy();
            if (displayObj.parent) {
                displayObj.parent.removeChild(displayObj);
            }
            // if(this._objectLayer.contains(displayObj)){
            // 	this._objectLayer.removeChild(displayObj);
            // }
            this._sceneNpcDic[vo.id] = null;
            delete this._sceneNpcDic[vo.id];
        }
    };
    /**
     * 添加Item
     */
    GameScene.prototype.addSceneItem = function (vo) {
        if (this._sceneItemDic[vo.id]) {
            this._sceneItemDic[vo.id].vo = vo;
        }
        else {
            var displayObj = new SceneItem(vo);
            displayObj.init();
            this._sceneItemDic[vo.id] = displayObj;
            this._elementLayer.addChild(displayObj);
        }
    };
    /**
     * 移除Item
     */
    GameScene.prototype.removeSceneItem = function (vo) {
        var displayObj = this._sceneItemDic[vo.id];
        if (displayObj) {
            displayObj.destroy();
            if (displayObj.parent) {
                displayObj.parent.removeChild(displayObj);
            }
            // if(this._elementLayer.contains(displayObj)){
            // 	this._elementLayer.removeChild(displayObj);
            // }
            this._sceneItemDic[vo.id] = null;
            delete this._sceneItemDic[vo.id];
        }
    };
    /**
     * 添加技能场景效果
     */
    GameScene.prototype.addSceneSkillEff = function (vo) {
        if (this._sceneSkillEffDic[vo.id]) {
            this._sceneSkillEffDic[vo.id].vo = vo;
        }
        else {
            var displayObj = new SceneSkillEff(vo);
            displayObj.init();
            this._sceneSkillEffDic[vo.id] = displayObj;
            this._objectLayer.addChild(displayObj);
        }
    };
    /**
     * 移除技能场景效果
     */
    GameScene.prototype.removeSceneSkillEff = function (vo) {
        var displayObj = this._sceneSkillEffDic[vo.id];
        if (displayObj) {
            displayObj.destroy();
            if (displayObj.parent) {
                displayObj.parent.removeChild(displayObj);
            }
            // if(this._objectLayer.contains(displayObj)){
            // 	this._objectLayer.removeChild(displayObj);
            // }
            this._sceneSkillEffDic[vo.id] = null;
            delete this._sceneSkillEffDic[vo.id];
        }
    };
    /**
     * 添加采集物
     */
    GameScene.prototype.addSceneCollect = function (vo) {
        if (this._sceneCollectDic[vo.id]) {
            this._sceneCollectDic[vo.id].vo = vo;
        }
        else {
            var displayObj = new SceneCollect(vo);
            displayObj.init();
            this._sceneCollectDic[vo.id] = displayObj;
            this._objectLayer.addChild(displayObj);
        }
    };
    /**
     * 移除采集物
     */
    GameScene.prototype.removeSceneCollect = function (vo) {
        var displayObj = this._sceneCollectDic[vo.id];
        if (displayObj) {
            displayObj.destroy();
            if (displayObj.parent) {
                displayObj.parent.removeChild(displayObj);
            }
            // if(this._objectLayer.contains(displayObj)){
            // 	this._objectLayer.removeChild(displayObj);
            // }
            this._sceneCollectDic[vo.id] = null;
            delete this._sceneCollectDic[vo.id];
        }
    };
    /**
     * 更新场景坐标位置
     */
    GameScene.prototype.updateScenePos = function (pos) {
        if (this._scenePosInit == false) {
            this.initScenePos(pos);
            this._scenePosInit = true;
            return;
        }
        var xx = pos[0];
        var yy = pos[1];
        //矩形移动
        //中心点周围超过多少才移动
        var mapX = this._stageHalfWidth - xx;
        var mapY = this._stageHalfHeight - yy;
        var xDis = mapX - this._sceneModel.mapX;
        var isChang = false;
        if (Math.abs(xDis) < this._centerHalfW) {
            //在矩形中,不做处理
        }
        else {
            isChang = true;
            if (xDis < 0) {
                this._sceneModel.mapX = mapX + this._centerHalfW;
            }
            else {
                this._sceneModel.mapX = mapX - this._centerHalfW;
            }
        }
        var yDis = mapY - this._sceneModel.mapY;
        if (Math.abs(yDis) < this._centerHalfH) {
            //在矩形中
        }
        else {
            isChang = true;
            if (yDis < 0) {
                this._sceneModel.mapY = mapY + this._centerHalfH;
            }
            else {
                this._sceneModel.mapY = mapY - this._centerHalfH;
            }
        }
        if (isChang) {
            if (xx + this._centerHalfW < this._stageHalfWidth) {
                this._sceneModel.mapX = 0;
            }
            else if (xx - this._centerHalfW > this._sceneModel.sceneWidth - this._stageHalfWidth) {
                this._sceneModel.mapX = this._sceneModel.sceneStageW - this._sceneModel.sceneWidth;
            }
            if (yy + this._centerHalfH < this._stageHalfHeight) {
                this._sceneModel.mapY = 0;
            }
            else if (yy - this._centerHalfH > this._sceneModel.sceneHeight - this._stageHalfHeight) {
                this._sceneModel.mapY = this._sceneModel.sceneStageH - this._sceneModel.sceneHeight;
            }
            this.x = this._sceneModel.mapX;
            this.y = this._sceneModel.mapY + 64;
            this.setBgMapPos(this.x, this.y);
        }
    };
    //初始化场景位置
    GameScene.prototype.initScenePos = function (pos) {
        // //中心点移动
        var xx = pos[0];
        var yy = pos[1];
        this._sceneModel.mapX = this._stageHalfWidth - xx;
        this._sceneModel.mapY = this._stageHalfHeight - yy;
        if (xx < this._stageHalfWidth) {
            this._sceneModel.mapX = 0;
        }
        else if (xx > this._sceneModel.sceneWidth - this._stageHalfWidth) {
            this._sceneModel.mapX = this._sceneModel.sceneStageW - this._sceneModel.sceneWidth;
        }
        if (yy < this._stageHalfHeight) {
            this._sceneModel.mapY = 0;
        }
        else if (yy > this._sceneModel.sceneHeight - this._stageHalfHeight) {
            this._sceneModel.mapY = this._sceneModel.sceneStageH - this._sceneModel.sceneHeight;
        }
        this.x = this._sceneModel.mapX;
        this.y = this._sceneModel.mapY + 64;
        this.setBgMapPos(this.x, this.y);
    };
    GameScene.prototype.setBgMapPos = function (xx, yy) {
        //this._mapLayer.setPos(0-xx,0-yy)
    };
    /**
     * 显示点击动画
     */
    GameScene.prototype.showClickMc = function (xx, yy, notOpen) {
        if (this._clickMc == null) {
            this._clickMc = new AMovieClip();
            this._objectLayer.addChild(this._clickMc);
            if (this._clickMc.hasEventListener(egret.Event.COMPLETE) == false) {
                this._clickMc.addEventListener(egret.Event.COMPLETE, this.playClickMcEffComplete, this);
            }
        }
        this._clickMc.playMCKey("efflubiao", "", 1);
        this._clickMc.visible = true;
        this._clickMc.x = xx;
        this._clickMc.y = yy;
        if (notOpen) {
            this._clickMc.alpha = 0.5;
        }
        else {
            this._clickMc.alpha = 1;
        }
    };
    /**
     * 播放点击效果完成事件
     */
    GameScene.prototype.playClickMcEffComplete = function (e) {
        if (this._clickMc) {
            this._clickMc.visible = false;
        }
    };
    /**
     * 显示点击动画
     */
    GameScene.prototype.clearClickMc = function () {
        if (this._clickMc) {
            this._clickMc.destroy();
            if (this._clickMc.parent) {
                this._clickMc.parent.removeChild(this._clickMc);
            }
            this._clickMc.removeEventListener(egret.Event.COMPLETE, this.playClickMcEffComplete, this);
            this._clickMc = null;
        }
    };
    /**
     * 显示进度条
     */
    GameScene.prototype.showSceneLoading = function () {
        if (this._sceneLoading) {
            this._sceneLoading.visible = true;
        }
    };
    /**
     * 关闭进度条
     */
    GameScene.prototype.closeSceneLoading = function () {
        if (this._sceneLoading) {
            this._sceneLoading.visible = false;
        }
    };
    Object.defineProperty(GameScene.prototype, "sceneLoading", {
        /**
         * 设置进度条
         */
        set: function (value) {
            this._sceneLoading = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 停止计时器
     */
    GameScene.prototype.stopSchedule = function () {
        if (this._scheduleId != 0) {
            GlobalTimer.getInstance().remove(this._scheduleId);
            this._scheduleId = 0;
        }
    };
    /**测试用 显示技能范围格子 */
    GameScene.prototype.showSkillRangeGrids = function (arr) {
        var item;
        for (var i = 0; i < arr.length; i++) {
            var pp = arr[i];
            item = this.gridsItemList[i];
            if (item) {
                item.show();
            }
            else {
                item = new GridsItem();
                item.show();
                this.gridsItemList.push(item);
                this._elementLayer.addChild(item);
            }
            item.x = pp[0] * 64;
            item.y = pp[1] * 64;
        }
    };
    return GameScene;
}(egret.DisplayObjectContainer));
__reflect(GameScene.prototype, "GameScene");
var GridsItem = (function (_super) {
    __extends(GridsItem, _super);
    function GridsItem() {
        var _this = _super.call(this) || this;
        _this.texture = RES.getRes("com_scene_grids_bg_png");
        return _this;
    }
    GridsItem.prototype.show = function () {
        this.visible = true;
        this.alpha = 0;
        egret.Tween.get(this).to({ alpha: 1 }, 20).wait(200).to({ alpha: 0 }, 200).call(this.close, this);
    };
    GridsItem.prototype.close = function () {
        this.visible = false;
        egret.Tween.removeTweens(this);
    };
    return GridsItem;
}(egret.Bitmap));
__reflect(GridsItem.prototype, "GridsItem");
//# sourceMappingURL=GameScene.js.map
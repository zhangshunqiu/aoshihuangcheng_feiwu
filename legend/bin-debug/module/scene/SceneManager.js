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
 * 场景管理器 2017/06/20
 */
var SceneManager = (function (_super) {
    __extends(SceneManager, _super);
    function SceneManager() {
        var _this = _super.call(this) || this;
        _this._eventSystem = EventSystem.getInstance();
        _this._sceneModel = SceneModel.getInstance();
        _this._globalModel = GlobalModel.getInstance();
        _this._showResultHookBoos = false;
        _this._delayOpenEventId = 0;
        return _this;
    }
    SceneManager.getInstance = function () {
        if (this._instance == null) {
            this._instance = new SceneManager();
        }
        return this._instance;
    };
    Object.defineProperty(SceneManager.prototype, "gameScene", {
        /**
         * 获取游戏场景
         */
        get: function () {
            return this._gameScene;
        },
        /**
         * 设置游戏场景
         */
        set: function (value) {
            this._gameScene = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 搜索使用技能和目标
     */
    SceneManager.prototype.searchUseSkillAndTarget = function (objVo, skillVo) {
        if (skillVo === void 0) { skillVo = null; }
        var vo = new FSkillTargetVo();
        if (objVo.type == SceneObjectType.MONSTER) {
            if (skillVo != null) {
                vo.skillVo = skillVo;
            }
            else {
                vo.skillVo = objVo.getUseFSkillVo();
                //vo.skillVo.initSkill(skillList[Math.floor(Math.random()*skillList.length)],0);
            }
            // if(Math.random()*1000 > 200){
            // 	//vo.skillVo.atkEff = "70301";
            // 	vo.skillVo.flyEff = "7061";
            // 	vo.skillVo.hurtEff = "7062";
            // }else{
            // 	vo.skillVo.flyEff = "";
            // 	vo.skillVo.hurtEff = "7091";0
            // 	vo.skillVo.hurtEffType = 3;
            // }
            var targetVoList = this.getNearlyTarget(objVo, vo.skillVo);
            if (targetVoList) {
                vo.targetArr = [targetVoList];
            }
            else {
                vo.targetArr = [];
            }
        }
        else {
            if (skillVo != null) {
                vo.skillVo = skillVo;
            }
            else {
                vo.skillVo = objVo.getUseFSkillVo();
            }
            // vo.skillVo.atkActType = 3;
            // vo.skillVo.atkDis = 256;
            // vo.skillVo.atkEffType = 2;//2;
            // if(Math.random()*1000 > 900){
            // 	vo.skillVo.atkEff = "7040";//7050";
            // }else{
            // 	vo.skillVo.atkEff = "7050";//7050";
            // }
            //vo.skillVo.flyEff = "7061";
            //vo.skillVo.hurtEff = "7062";
            var vv = this.getNearlyTarget(objVo, vo.skillVo);
            //var targetVoList:Array<BaseObjectVo> = [this.getNearlyTarget(objVo,vo.skillVo)];
            if (vv) {
                vo.targetArr = [vv];
            }
            else {
                vo.targetArr = [];
            }
        }
        return vo;
    };
    /**
     * 获取最近的目标
     * @param atkVo 攻击者
     * @param skillVo 技能
     */
    SceneManager.prototype.getNearlyTarget = function (atkVo, skillVo) {
        if (skillVo.targetType == SkillTargetType.SELF) {
            return atkVo;
        }
        else if (skillVo.targetType == SkillTargetType.PARTNER) {
            var arr;
            if (atkVo.type == SceneObjectType.MONSTER) {
                arr = this._sceneModel.getMonsterNearlyPartner(atkVo);
            }
            else {
                //arr = this._sceneModel.searchNearlyPartner(atkVo);
                arr = this._sceneModel.getPlayerNearlyPartner(atkVo);
            }
            return arr;
        }
        else if (skillVo.targetType == SkillTargetType.ENEMY) {
            var arr;
            if (atkVo.type == SceneObjectType.MONSTER) {
                arr = this._sceneModel.getMonsterNearlyEnamy(atkVo);
            }
            else {
                //arr = this._sceneModel.searchNearlyEnamy(atkVo);
                arr = this._sceneModel.getPlayerNearlyEnamy(atkVo);
            }
            return arr;
        }
        else if (skillVo.targetType == SkillTargetType.EMPTY) {
        }
        return null;
    };
    /**
     * 获取可以使用的技能   n'n'n'n'nn'n'n'n'n'n'n'n'n'n'n'n'n'n'n'n
     */
    SceneManager.prototype.getUseSkill = function (atkVo, skillVo) {
        if (skillVo === void 0) { skillVo = null; }
        var backVo;
        if (atkVo.type == SceneObjectType.MONSTER) {
            if (skillVo != null) {
                backVo = skillVo;
            }
            else {
                backVo = new FSkillVo();
                backVo.initSkill(10100, 1);
            }
        }
        else {
            if (skillVo != null) {
                backVo = skillVo;
            }
            else {
                backVo = new FSkillVo();
                backVo.initSkill(10200, 1);
            }
        }
        return backVo;
    };
    SceneManager.prototype.update = function () {
        if (this._sceneModel.sceneId < 40000 && this._sceneModel.sceneId > 20000) {
            this._showResultHookBoos = false;
        }
        else if (this._sceneModel.sceneId >= 40000) {
            // var num:number = this._sceneModel.getSceneObjectNumber(SceneObjectType.MONSTER);
            // if(num > 0 ){
            // 	this._showResultHookBoos = false;
            // }else{
            // 	if(this._showResultHookBoos == false){
            // 		App.logzsq("弹出Boss结束面板");
            // 		(game.BossController.getInstance() as game.BossController).challengeBossResult({result:1,hook_id:40001});
            // 		this._showResultHookBoos = true;
            // 	}
            // }
        }
        else if (this._sceneModel.sceneId == 10000) {
            this._showResultHookBoos = false;
            var num = this._sceneModel.getSceneObjectNumber(SceneObjectType.MONSTER);
            if (num <= 0) {
                for (var i = 0; i < 0; i++) {
                    var vo = new SceneMonsterVo();
                    vo.id = i + 20000;
                    vo.modelId = String(10001 + Math.floor(Math.random() * 20));
                    vo.updateConfig();
                    vo.curHp = vo.hp;
                    SceneModel.getInstance().addSceneObjectVo(vo);
                    EventSystem.getInstance().dispatchEvent(SceneEventType.ADD_SCENE_OBJECT, vo);
                }
            }
            var Role = App.RoleManager;
        }
        // 更新功能
        // var xxLen:number = this._sceneModel.gridTable.length;
        // var yyLen:number = this._sceneModel.gridYNum;
        // for(let i:number = 0;i<xxLen;i++){
        // 	for(let j:number = 0;j<yyLen;j++){
        // 		if(this._sceneModel.gridTable[i][j]){
        // 			App.logzsq(i+"_"+j);
        // 		}
        // 	}
        // }
        // App.logzsq("END "+Date.now());
    };
    /**
     * 设置场景其他玩家的显示与否
     */
    SceneManager.prototype.setOtherPlayerVisible = function (b) {
        this._gameScene.setOtherPlayerVisible(b);
    };
    /**
     * 延迟打开窗口
     */
    SceneManager.prototype.delayOpenCompleteView = function (data, fun, thisObj) {
        if (this._sceneModel.pickItemType == PICK_ITEM_TYPE.get_by_move) {
            this._delayOpenSceneId = this._sceneModel.sceneId;
            this._delayOpenData = data;
            this._delayOpenFun = fun;
            this._delayOpenThis = thisObj;
            if (this._delayOpenEventId == 0) {
                this._delayOpenEventId = App.GlobalTimer.addSchedule(1000, 60, this.openComplete, this, this.delayOpenComplete, this);
            }
        }
        else {
            if (this._delayOpenEventId != 0) {
                App.GlobalTimer.remove(this._delayOpenEventId);
                this._delayOpenEventId = 0;
            }
            fun.call(thisObj, data);
            return;
        }
    };
    SceneManager.prototype.openComplete = function () {
        if (this._delayOpenFun && this._delayOpenThis && this._sceneModel.sceneId == this._delayOpenSceneId && this._sceneModel.curSceneItemNum <= 0) {
            this._delayOpenFun.call(this._delayOpenThis, this._delayOpenData);
            if (this._delayOpenEventId != 0) {
                App.GlobalTimer.remove(this._delayOpenEventId);
                this._delayOpenEventId = 0;
            }
            this._delayOpenFun = null;
            this._delayOpenThis = null;
            this._delayOpenData = null;
            this._delayOpenSceneId = 0;
        }
    };
    SceneManager.prototype.delayOpenComplete = function () {
        if (this._delayOpenFun && this._delayOpenThis && this._sceneModel.sceneId == this._delayOpenSceneId) {
            this._delayOpenFun.call(this._delayOpenThis, this._delayOpenData);
        }
        if (this._delayOpenEventId != 0) {
            App.GlobalTimer.remove(this._delayOpenEventId);
            this._delayOpenEventId = 0;
        }
        this._delayOpenFun = null;
        this._delayOpenThis = null;
        this._delayOpenData = null;
        this._delayOpenSceneId = 0;
    };
    /**
     * 销毁
     */
    SceneManager.prototype.destroy = function () {
        this._gameScene = null;
    };
    /**
     * 清理
     */
    SceneManager.prototype.clear = function () {
    };
    return SceneManager;
}(BaseClass));
__reflect(SceneManager.prototype, "SceneManager");
//# sourceMappingURL=SceneManager.js.map
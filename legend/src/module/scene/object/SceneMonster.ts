/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 场景怪物对象
 */
class SceneMonster extends SceneBaseObj {
	protected nameText:egret.TextField;//更新名称
	protected hpBar:SceneHpBar;//气血条容器
	protected honorTitle:egret.Bitmap;//称号
	protected bottomLay:egret.DisplayObjectContainer;//底部效果容器
	protected modelLay:egret.DisplayObjectContainer;//模型容器
	protected headLay:egret.DisplayObjectContainer;//头部名称血条等容器
	protected topLay:egret.DisplayObjectContainer;//顶部效果容器

	protected bodyMc:AMovieClip;
	protected bodyUrl:string = "";

	// protected buffMc:AMovieClip;
	// protected buffUrl:string = "";

	protected atkEffMc:AMovieClip;//攻击效果
	protected atkEffUrl:string;
	protected getHitEffMc:AMovieClip;//受击效果
	protected getHitEffUrl:string;

	protected pathList:Array<any> = [];//移动路径
	protected stepX:number;//X轴每步移动距离
	protected stepY:number;//Y轴每步移动距离
	protected stepTimes:number;//移动步数
	protected endPoint:Array<number>;//移动结束点 
	protected moveSpeed:number = 12;
	protected moveCallBackFun:Function;//移动完成回调函数
	protected moveCallBackThisObj:any;//移动完成回调函数对象
	protected moveCallBackParam:any;//移动完成回调函数参数

	protected _action:number = 0;//动作类型
	protected curActState:number = 0;//当前动作状态

	protected nextAtkTime:number = 0;
	protected actionTime:number = 1500;//技能动作时间毫秒，攻击开始后只有过了这个时间才能执行下一动作
	protected showNameAndHpBar:boolean = true;

	protected buffEffDic:any;//buff效果zidian

	protected isCollision:boolean = false;//是否碰撞中

	private _deadAlpha:number = 2;
	
	//buff效果相关
	// self.buffPoison = nil --中毒
	// self.buffShield = nil --魔法盾
	// self.buffDizzy = nil --眩晕
	// self.buffFire = nil --烈火
	// self.buffStone = nil --石化
	// self.buffInvisible = nil --隐身
	// self.buffAttAdd = nil --属性加成如防御等
	// self.buffCure = nil --治疗
	// self.silent = nil  --沉默

	public constructor(objectVo:any) {
		super(objectVo);
		this.showShadow();
		this.bottomLay = new egret.DisplayObjectContainer();
		this.addChild(this.bottomLay);
		this.modelLay = new egret.DisplayObjectContainer();
		this.addChild(this.modelLay);
		this.headLay = new egret.DisplayObjectContainer();
		this.addChild(this.headLay);
		this.topLay = new egret.DisplayObjectContainer();
		this.addChild(this.topLay);
	}
	/**
	 * 初始化
	 */
	public init(){
		if(this.vo.dire == null){
			this.vo.dire = new DireScale(5,1,5);//方向信息
		}
		this.isCollision = false;
		this.moveSpeed = this.vo.moveSpeed;
		this.nextAtkTime = (GlobalModel.getInstance() as GlobalModel).getTimer()+500;
		this.playStand();
		this.x = this.vo.posX;
		this.y = this.vo.posY;
		this.setGridPosition(this.vo.gridX,this.vo.gridY);
		this.curActState = 0;
		this._action = 0;
		if(this.pathList == null || this.pathList.length > 0 ){
			this.pathList = [];
		}
		this.clearMoveCallBack();
		if(this.endPoint){
			this.endPoint = null;
		}
		if(this.modelLay.alpha < 1){this.modelLay.alpha = 1;}
		if(this.shadow.visible == false){
			this.shadow.visible = true;
		}
		if(this.showNameAndHpBar){
			this.updateName();
			this.updateHp();
			this.updateHonorTitle();
		}else{
			//判断是否死亡
			if(this.vo.curHp <= 0){
				this.setDeadState();
			}
		}
		if(this.vo.type == SceneObjectType.PET){
			this.playBornEff("eff7240");
		}
	}


	/**
	  * 更新名称
	  */
	public updateName():void{
		if(this.nameText == null){
			this.nameText = new egret.TextField();
			this.headLay.addChild( this.nameText);
			// this.nameText.width = 270;
			// this.nameText.height = 70;
			this.nameText.textColor = 0xffffff;
			//this.nameText.textAlign = egret.HorizontalAlign.CENTER;
       		// this.nameText.verticalAlign = egret.VerticalAlign.MIDDLE;
			// this.nameText.strokeColor = 0x000000;
			// this.nameText.stroke = 0.5;
			//this.nameText.italic = true;
			this.nameText.size = 19;
			this.nameText.cacheAsBitmap = true;
		}
		if(this.headLay.visible == false)
		{
			this.headLay.visible = true;
		}
		if(this.nameText.text != this.vo.name){
			this.nameText.text = this.vo.name;
			this.nameText.x = 0 - this.nameText.textWidth/2;
			this.nameText.y = 0 - this.nameText.textHeight/2 -162;
		}
	}


	/**
	  * 更新名称
	  */
	public updateHonorTitle():void{
		if(this.vo.honorTitleUrl && this.vo.honorTitleUrl != ""){
			if(this.honorTitle == null){
				this.honorTitle = new egret.Bitmap();
				this.headLay.addChild( this.honorTitle);
				this.honorTitle.cacheAsBitmap = true;
				this.honorTitle.x = -30;
				this.honorTitle.y = -200;
			}
			RES.getResAsync(this.vo.honorTitleUrl,this.honorLoadComplete,this);
		}
    }

    protected honorLoadComplete(event:any):void {
        var img: egret.Texture = <egret.Texture>event;
        if(img){
			this.honorTitle.texture = img;
		}
    }

	/**
	  * 更新气血
	  */
	public updateHp():void{
		if(this.hpBar == null){
			this.hpBar = new SceneHpBar(60,this.vo.hpBarUrl);
			this.headLay.addChild( this.hpBar);
			this.hpBar.y = -116;
		}
		if(this.vo.monsterType == MONSTER_TYPE.WORLD_BOSS){
			App.EventSystem.dispatchEvent(SceneEventType.BOSS_INFO,this.vo);
		}
		this.hpBar.setValue(this.vo.curHp,this.vo.hp);
		if(this.vo.curHp <= 0 && this.isCollision == false){
			this.setDeadState();
			//this.playDead();
		}else{
			if(this.nameText == null){
				this.updateName();
			}
		}
	}


	/**
	 * 更新VO
	 */
	public updateVo(vo:ScenePlayerVo){
		if(vo){
			this.vo = vo;
			this.init();
		}
	}


	/**
	 * 站立
	 */
	public playStand(){
		if(this.vo.actState == ActState.DEAD){return;}
		if(this.curActState != ActState.STAND){
			this.curActState = ActState.STAND;
			this.updateActState(ActState.STAND,this.vo.dire);
		}else{
			var curt:number = GlobalModel.getInstance().getTimer();
			if(curt > this.nextAtkTime && Math.random()*1000>920 ){
				//根据怪物攻击类型实行攻击效果
				if( this.vo.enableUseSkill() && this.vo.attackType == MonsterAtkType.AUTO || (this.vo.attackType == MonsterAtkType.PASSIVE && this.vo.curHp < this.vo.hp)){ //1:主动攻击 或者 2=被动攻击 别人打了才攻击
					var skillTargetVo:FSkillTargetVo = (SceneManager.getInstance() as SceneManager).searchUseSkillAndTarget(this.vo,this.vo.nextFSkillVo);
					if(skillTargetVo.targetArr && skillTargetVo.targetArr.length >0){
						this.nextAtkTime = GlobalModel.getInstance().getTimer()+1500;
						var target:BaseObjectVo = skillTargetVo.targetArr[0];
						var diss:number = SceneUtil.getDistance(this.x,this.y,target.posX,target.posY);
						if(diss > skillTargetVo.skillVo.atkDis){
							//移动1/3
							// var npx:number=this.x + (target.posX-this.x)/3;
							// var npy:number=this.y + (target.posY-this.y)/3;
							// this.moveToPoint([npx,npy]);
							this.moveOneGridToPointNearly(this.vo.gridX,this.vo.gridY,target.gridX,target.gridY);
							if(this.vo.nextFSkillVo == null){
								this.vo.nextFSkillVo = skillTargetVo.skillVo;
							}
						}else {
							//当前格有东西则执行跑出一格

							//距离够就攻击 
							//更新攻击范围目标列表
							if(skillTargetVo.targetArr.length >0){
								skillTargetVo = this._sceneModel.updateMonsterHurtListByRange(this.vo,skillTargetVo);
							}
							skillTargetVo.atkVo = this.vo;
							//App.Socket.send(13005,skillTargetVo.creatHookTriggerData(this.vo));
							this.playAttack(skillTargetVo);
							this.vo.nextFSkillVo = null;
						}
					}else{
						this.nextAtkTime = GlobalModel.getInstance().getTimer()+4000;
						this.gotoWander();
					}
				}else{
					//if(this.vo.attackType == MonsterAtkType.AVOID)
					//3=不主动攻击不反击 只逃跑 或别人不惹他的时候闲逛
					if(this.vo.ownerId && this.vo.ownerId >0 && this.moveFollowMaster(this.vo.ownerId)){
						//跟随主人
						this.nextAtkTime = GlobalModel.getInstance().getTimer()+2000;
					}else if(Math.random()*1000>500) {
						this.gotoWander();
						this.nextAtkTime = GlobalModel.getInstance().getTimer()+4000;
					}
				}
			}
		}
	}

	/**
	 * 游荡或闲逛，离巡逻点远的时候自动返回
	 */
	private gotoWander(){
		//没有目标继续游荡
		if(SceneUtil.getDistance(this.vo.patrolX,this.vo.patrolY,this.x,this.y) > 384){
			//太远，返回巡逻点
			this.moveOneGridToPointNearly(this.vo.gridX,this.vo.gridY,SceneUtil.pixelToGridX(this.vo.patrolX),SceneUtil.pixelToGridY(this.vo.patrolY));
		}else{
			var nx:number = Math.floor(this._sceneModel.gridXNum*Math.random());
			var ny:number = Math.floor(this._sceneModel.gridYNum*Math.random());
			this.moveOneGridToPointNearly(this.vo.gridX,this.vo.gridY,nx,ny);
			// this.moveToPoint(newPos);
		}
	}

	/**
	 * 当前点向目标点按最近移动一格
	 */
	protected moveOneGridToPointNearly(curGX:number,curGY:number,tarGridX:number,tarGridY:number):boolean
	{
		var newPos:Array<number> = SceneUtil.getRoundWalkGridToTarget(curGX,curGY,tarGridX,tarGridY);
		if(newPos){
			newPos[0] = SceneUtil.gridToPixelX(newPos[0]);
			newPos[1] = SceneUtil.gridToPixelY(newPos[1]);
			this.moveToPoint(newPos);
			return true;
		}
		return false;
	}

	/**
	 * 移出当前格子
	 */
	protected moveOutCurGrid(curGX:number,curGY:number,dire8:number):boolean
	{
		//当站在同格的时候跑出一格
		var nPos:Array<number> = SceneUtil.getRoundWalkGrid(curGX,curGY,dire8);
		if(nPos){
			nPos[0] = SceneUtil.gridToPixelX(nPos[0]);
			nPos[1] = SceneUtil.gridToPixelY(nPos[1]);
			this.moveToPoint([nPos[0],nPos[1]]);
			return true
		}
		return false
	}

	/**
	 * 跟随主人
	 * @param ownerId 
	 */
	public moveFollowMaster(ownerId:number):boolean{
		var mainPlayerVo:ScenePlayerVo = this._sceneModel.getPlayerVo(ownerId);
		if(mainPlayerVo){
			var dis2:number = SceneUtil.getDistance(this.x,this.y,mainPlayerVo.posX,mainPlayerVo.posY);
			if(dis2 > 64*3){
				var nPos:Array<number> = SceneUtil.getNearMoveGridByGridNum(mainPlayerVo.gridX,mainPlayerVo.gridY,this.vo.gridX,this.vo.gridY,2);
				if(nPos){
					nPos[0] = SceneUtil.gridToPixelX(nPos[0]);
					nPos[1] = SceneUtil.gridToPixelY(nPos[1]);
					this.moveToPoint([nPos[0],nPos[1]]);
					return true
				}
			}
		}
		return false;
	}
	

	/**
	 * 移动
	 * @param pathArr 路径数组
	 */
	public playMove(pathArr:Array<any>,callBackparam:any= null,callBackFun:Function = null,callBackThisObj:any = null){
		if(this.vo.actState == ActState.DEAD){return;}
		if(this.vo.actState == ActState.STAND || this.vo.actState == ActState.RUN){
			this.pathList = pathArr;
			if(this.pathList && this.pathList.length >0){
				this.clearMoveCallBack();
				if(callBackFun && callBackThisObj){
					this.moveCallBackFun = callBackFun;
					this.moveCallBackThisObj = callBackThisObj;
					this.moveCallBackParam = callBackparam;
				}
				this.moveToPoint(this.pathList.shift());
			}else if(callBackFun && callBackThisObj){
				callBackFun.call(callBackThisObj,callBackparam);
			}
		}
	}

	/**
	 * 把路径加到原来的后面
	 * @param path 路径数组
	 */
	public addMovePath(path:Array<any>):void
	{	
		if(this.vo.actState == ActState.DEAD){return;}
		this.pathList = this.pathList.concat(path);
		//App.logzsq(this.pathList.length,path.length);
		if(this.curActState != ActState.RUN){
			this.playMove(this.pathList);
		}
	}

	/**
	 * 清理移动路径
	 */
	public clearMovePath():void
	{
		if(this.pathList && this.pathList.length >0){
			this.pathList = [];
		}
		this.clearMoveCallBack();
	}
	/**
	 * 清理移动回调
	 */
	public clearMoveCallBack():void
	{
		this.moveCallBackFun = null;
		this.moveCallBackThisObj = null;
		this.moveCallBackParam = null;
	}
	/**
	 * 移动完成
	 */
	protected moveComplete(){
		this.endPoint = null;
		if(this.pathList && this.pathList.length >0){
			this.moveToPoint(this.pathList.shift());
		}else{
			if(this.vo.actState == ActState.RUN){
				this.vo.actState = ActState.STAND;
				if(this.moveCallBackFun && this.moveCallBackThisObj){
					this.moveCallBackFun.call(this.moveCallBackThisObj,this.moveCallBackParam);
				}
				this.clearMoveCallBack();
				this.isCollision = false;
				//判断是否死亡
				if(this.vo.curHp <= 0){
					this.setDeadState();
				}
			}
		}
	}
	/**
	 * 移动到某一点
	 */
	protected moveToPoint(pos:Array<number>){
		if(this.vo.actState == ActState.DEAD || (this.vo.actState != ActState.STAND && this.vo.actState != ActState.RUN)){return;}
		if(this.vo.enableMove() == false){
			//麻痹或石化的时候不可走动
			this.pathList = [];
			this.vo.actState = ActState.STAND;
			this.clearMoveCallBack();
			this.isCollision = false;
			//判断是否死亡
			if(this.vo.curHp <= 0){
				this.setDeadState();
			}
			return;
		}
		pos[0] = Math.floor(pos[0]);
		pos[1] = Math.floor(pos[1]);
		var dis:number = SceneUtil.getDistance(this.x,this.y,pos[0],pos[1]);
		if(dis<this.moveSpeed){
			this.moveComplete();
			return
		}
		var times:number = Math.round(dis/this.moveSpeed);
		var dire:DireScale = SceneUtil.getDirectByPoint(pos[0],pos[1],this.x,this.y);
		this.updateMoveStepTimes(pos, times ,dire);
	}
	//更新移动次数和步长
	protected updateMoveStepTimes(pos:Array<number>,times:number,dire:DireScale){
		this.endPoint = pos;
		this.stepX = (pos[0]-this.x)/times;
		this.stepY = (pos[1]-this.y)/times;
		this.stepTimes = times;
		this.vo.actState = ActState.RUN
		this.curActState = ActState.RUN;
		this.updateActState(ActState.RUN,dire);
	}
	/**
	 * 移动到下一位置
	 */
	protected nextPosition(){
		if(this.stepTimes <= 1){
			this.updatePosition(this.endPoint[0],this.endPoint[1]);
			this.stepTimes = 0;
			this.moveComplete();
		}else{
			this.stepTimes = this.stepTimes -1;
			this.updatePosition(this.x+this.stepX,this.y+this.stepY);
		}
	}

	/**
	 * 设置格子位置
	 */
	protected setGridPosition(gx:number,gy:number){
		this._sceneModel.removeGridTablePos(this.vo);
		super.setGridPosition(gx,gy);
		this._sceneModel.addGridTablePos(this.vo);
	}

	/**
	 * 攻击
	 */
	public playAttack(fstVo:FSkillTargetVo){
		if(this.vo.actState == ActState.DEAD){return;}
		this.vo.actState = ActState.ATTACK;
		if(this.curActState != ActState.ATTACK){
			this.curActState = ActState.ATTACK;
			if(fstVo == null){
				this.nextAtkTime = GlobalModel.getInstance().getTimer()+400;
				this.vo.actState = ActState.STAND;
			}else{
				this.vo.fSkillTargetVo = fstVo;
				var dire:DireScale = this.vo.dire;
				var tarVo:BaseFightObjVo =  fstVo.targetArr[0];
				if(tarVo){
					if(tarVo.gridX != this.vo.gridX || tarVo.gridY != this.vo.gridY){
						dire = SceneUtil.getDirectByPoint(tarVo.posX,tarVo.posY,this.x,this.y);
					}
				}else if(fstVo.targetPoint){
					dire = SceneUtil.getDirectByPoint(fstVo.targetPoint.x,fstVo.targetPoint.y,this.x,this.y);
				}
				this.updateActState(ActState.ATTACK,dire,fstVo.skillVo.atkActType);
				this.playAttackEff(fstVo.skillVo.atkEff,fstVo.skillVo.atkEffType);
			}
			this.nextAtkTime = GlobalModel.getInstance().getTimer()+3000;//等待3秒加载
		}
	}
	//攻击动作播放完成
	protected playAtkActComplete(e:egret.Event){
		if(this.vo.actState == ActState.ATTACK){
			this.nextAtkTime = GlobalModel.getInstance().getTimer()+this.vo.fSkillTargetVo.skillVo.actionTime;
			//if(this.vo.actState != ActState.DEAD){
			this.vo.actState = ActState.STAND;
			this.playFlyEff(this.vo.fSkillTargetVo);
			this.vo.fSkillTargetVo = null;
			//}
		}
	}

	/**
	 * 播放攻击效果
	 */
	protected playAttackEff(atkEff:string="",atkEffType:number = 1){
		if(atkEff == ""){return};
		if(this.atkEffMc == null){
            this.atkEffMc = new AMovieClip();
			this.topLay.addChild(this.atkEffMc);
		}
		//App.logzsq("playAttackEff")
		if(atkEffType == 1){
			this.atkEffUrl = atkEff;
			this.atkEffMc.scaleX = 1;
		}else{
			this.atkEffUrl = atkEff+this.vo.dire.dire;
			this.atkEffMc.scaleX = this.vo.dire.scale;
		}
		this.atkEffMc.playMCKey(this.atkEffUrl,"",1);
		this.atkEffMc.scaleX = this.vo.dire.scale;
		// this.atkEffMc.addEventListener(egret.Event.COMPLETE, (e:egret.Event)=>{
		// 	}, this);
		if(this.atkEffMc.hasEventListener(egret.Event.COMPLETE)== false){
			this.atkEffMc.addEventListener(egret.Event.COMPLETE, this.playAttackEffComplete, this);
		}
	}
	//攻击效果播放完成
	protected playAttackEffComplete(e:egret.Event){
		if(this.atkEffMc){
			this.atkEffMc.removeEventListener(egret.Event.COMPLETE, this.playAttackEffComplete, this);
			this.atkEffMc.destroy();
			if(this.atkEffMc.parent){
				this.atkEffMc.parent.removeChild(this.atkEffMc);
			}
			this.atkEffMc = null;
		}
	}
	
	/**
	 * 播放飞行效果
	 */
	protected playFlyEff(fSkillTarget:FSkillTargetVo){
		if(fSkillTarget && fSkillTarget.skillVo.flyEff != ""){
			let ang:number = SceneUtil.getAngByDirect(this.vo.dire.dire8);
			let atkPos:point = new point(this.x,this.y);
			let targetPos:point;
			if(fSkillTarget.targetArr && fSkillTarget.targetArr.length >0){
				let targetVo:BaseObjectVo = fSkillTarget.targetArr[0];
				targetPos = new point(targetVo.posX,targetVo.posY);
			}else if(fSkillTarget.targetPoint){
				targetPos = fSkillTarget.targetPoint;
			}else{
				targetPos = new point(this.x-Math.cos(ang)*300,this.y - 60-Math.sin(ang)*300);
			}

			if(Math.abs(targetPos.x - atkPos.x) < 80 && Math.abs(targetPos.y - atkPos.y) < 80){
				//效果离目标太近，直接跳过飞行
				this.playGetHit(fSkillTarget);
			}else{
				atkPos.x = Math.floor(atkPos.x - Math.cos(ang)*40);
				atkPos.y = Math.floor(atkPos.y - Math.sin(ang)*40);
				let effVo:EffByPosVo = new EffByPosVo();
				effVo.atkPos = atkPos;
				effVo.targetPos = targetPos;
				effVo.effKey = fSkillTarget.skillVo.flyEff;
				effVo.dire = this.vo.dire;
				effVo.thisObject = this;
				effVo.backFun = this.playGetHit;
				effVo.param = fSkillTarget;
				App.EventSystem.dispatchEvent(SceneEventType.SHOW_FLY_EFF,effVo);
			}
		}else{
			this.playGetHit(fSkillTarget);
		}
	}

	/**
	 * 受击
	 */
	public playGetHit(fSkillTarget:FSkillTargetVo){
		if(this.vo.actState == ActState.DEAD){return;}
		this.vo.actState = ActState.HITED;
		if(this.curActState != ActState.HITED){
			this.curActState = ActState.HITED;
			if(fSkillTarget.skillVo.hurtEff != ""){
				//this.updateActState(ActState.HITED,this.vo.dire);
				var hurtEffType:number = fSkillTarget.skillVo.hurtEffType
				//1.单体（单个人上）2.多人（分别放多人）3.单体或者多人身上地表(在脚点) 4.群体空中 效果在人上 5.火墙
				if(hurtEffType == SkillHurtEffType.BODY_MIDDLE || hurtEffType == SkillHurtEffType.BODY_MULTI_MIDDLE || hurtEffType == SkillHurtEffType.BODY_SURFACE){
					if(fSkillTarget.targetArr && fSkillTarget.targetArr.length >0){
						App.EventSystem.dispatchEvent(SceneEventType.SHOW_BODY_EFF,fSkillTarget);
					}else{
						var pos:point = SceneUtil.getRoleLengthenPos(this.vo.dire,this.x,this.y,300);
						var vo:EffByTimeVo = new EffByTimeVo();
						//vo.atkPos = pos;
						vo.targetPos = pos;
						vo.effKey = fSkillTarget.skillVo.hurtEff;
						App.EventSystem.dispatchEvent(SceneEventType.SHOW_GROUP_EFF,vo);
					}
				}else if(hurtEffType == SkillHurtEffType.GROUP_SKY){
					var pos:point;
					if(fSkillTarget.targetArr && fSkillTarget.targetArr.length >0){
						var target:BaseObjectVo = fSkillTarget.targetArr[0] as BaseObjectVo;
						pos = new point(target.posX,target.posY);//群体效果必须上移一点
					}else{
						pos = SceneUtil.getRoleLengthenPos(this.vo.dire,this.x,this.y,300);
					}
					var vo:EffByTimeVo = new EffByTimeVo();
					//vo.atkPos = pos;
					vo.targetPos = pos;
					vo.effKey = fSkillTarget.skillVo.hurtEff;
					App.EventSystem.dispatchEvent(SceneEventType.SHOW_GROUP_EFF,vo);
				}
			}
			//App.EventSystem.dispatchEvent(SceneEventType.UPDATE_HP,fSkillTarget);
			this.vo.actState = ActState.STAND;

			App.logzsq("使用技能",fSkillTarget.skillVo.skillId);
			App.Socket.send(13005,fSkillTarget.creatHookTriggerData(this.vo));
			//后端返回
			// if(fSkillTarget.skillVo.skillId == 10300){
			// 	this.playCollision();
			// 	App.EventSystem.dispatchEvent(SceneEventType.PLAY_COLLISION,fSkillTarget);
			// }
			// else if(fSkillTarget.skillVo.skillId == 10000){
			// 	this.playTransfer();
			// }
		}
	}
	/**
	 * 播放受击效果
	 */
	public playGetHitEff(skillVo:FSkillVo){
		if(skillVo.hurtEff == ""){return;}
		if(this.getHitEffMc == null){
            this.getHitEffMc = new AMovieClip();
			this.topLay.addChild(this.getHitEffMc);
		}

		if(skillVo.hurtEffType == SkillHurtEffType.BODY_SURFACE){
			this.getHitEffMc.y = 0;
		}else{
			this.getHitEffMc.y = -60;
		}

		this.getHitEffUrl = skillVo.hurtEff ;
		this.getHitEffMc.playMCKey(this.getHitEffUrl,"",1);
		this.getHitEffMc.scaleX = this.vo.dire.scale;
		// this.atkEffMc.addEventListener(egret.Event.COMPLETE, (e:egret.Event)=>{
		// 	}, this);
		if(this.getHitEffMc.hasEventListener(egret.Event.COMPLETE)== false){
			this.getHitEffMc.addEventListener(egret.Event.COMPLETE, this.playGetHitEffComplete, this);
		}
	}
	protected playGetHitEffComplete(e:egret.Event){
		//App.logzsq("playGetHitEffComplete" ,this.vo.actState)
		if(this.getHitEffMc){
			this.getHitEffMc.removeEventListener(egret.Event.COMPLETE, this.playGetHitEffComplete, this);
			this.getHitEffMc.destroy();
			if(this.getHitEffMc.parent){
				this.getHitEffMc.parent.removeChild(this.getHitEffMc);
			}
			this.getHitEffMc = null;
		}
	}

	/**
	 * 死亡
	 */
	public playDead(){
		//this.vo.actState = ActState.DEAD;
		if(this.curActState != ActState.DEAD){
			this.curActState = ActState.DEAD;
			this.updateActState(ActState.DEAD,this.vo.dire);
			this.headLay.visible = false;
			if(this.shadow){
				this.shadow.visible = false;
			}
			this.clearAllBuffEff();

			this.pathList = [];
			this.clearMoveCallBack();

			// //tese zhangshunqiu 测试掉落物品 
			// var vo = new SceneItemVo();
			// vo.posX = SceneUtil.gridToPixelX(this.vo.gridX);
			// vo.posY = SceneUtil.gridToPixelX(this.vo.gridY);
			// SceneModel.getInstance().addSceneObjectVo(vo);
			// (EventSystem.getInstance() as EventSystem).dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,vo);
			// //tese zhangshunqiu 测试掉落物品 end
			this._deadAlpha = 4;
		}else if(this._deadAlpha >-20){
			this._deadAlpha = Math.max(this._deadAlpha - 0.1,0);
			this.modelLay.alpha = Math.min(this._deadAlpha,1);
			if(this._deadAlpha <=0.1 && this.getHitEffMc == null){
				(SceneModel.getInstance() as SceneModel).removeSceneObjectVo(this.vo);
				(EventSystem.getInstance() as EventSystem).dispatchEvent(SceneEventType.REMOVE_SCENE_OBJECT,this.vo);
			}
		}else{
			(SceneModel.getInstance() as SceneModel).removeSceneObjectVo(this.vo);
			(EventSystem.getInstance() as EventSystem).dispatchEvent(SceneEventType.REMOVE_SCENE_OBJECT,this.vo);
		}
	}

	/**
	 * 设置死亡状态
	 */
	public setDeadState(){
		this.vo.actState = ActState.DEAD;
		//死亡后需要清理body完成事件
		if(this.bodyMc && this.bodyMc.hasEventListener(egret.Event.COMPLETE)){
			this.bodyMc.removeEventListener(egret.Event.COMPLETE, this.playAtkActComplete, this);
		}
	}

	 /**
	  * 更新模型
	  */
	protected updateBody(bodyUrl:string="",action:string="",scaleX:number = 1,times:number= -1,defaultmc:string=null):void{
		if(this.bodyMc == null){
            this.bodyMc = new AMovieClip();
			this.modelLay.addChild(this.bodyMc);
            //this.bodyMc.x = App.stageWidth/2;
            //this.bodyMc.y = App.stageHeight/2
		}
		this.bodyUrl = bodyUrl;
		this.bodyMc.playMCKey(bodyUrl,action,times,defaultmc);
		this.bodyMc.scaleX = scaleX;
	}

	/**
	 * 更新动作状态
	 * @param  actState 动作状态 ActState
	 * @param dire 方向
	 * @param  atkActType 播放动作类型
	 * @param isForce 是否强制更新
	 */
	protected updateActState(actState:number,dire:DireScale,atkActType:number = 3,isForce:Boolean = false) {
		if(this.vo.dire.dire == dire.dire && this.vo.dire.scale == dire.scale && this._action == actState && isForce == false){
			return;
		}
		this._action = actState;
		this.vo.dire = dire;
		if(actState == ActState.STAND || actState == ActState.DEAD){
			this.updateBody(this.vo.bodyId+"1"+dire.dire,"",dire.scale);//run
		}else if(actState == ActState.RUN){
			this.updateBody(this.vo.bodyId+"2"+dire.dire,"",dire.scale);//run
		}else if(actState == ActState.ATTACK){
			var atkAckType:string = String(atkActType);
			this.updateBody(this.vo.bodyId+atkAckType+dire.dire,"",dire.scale,1);//run
			// this.bodyMc.addEventListener(egret.MovieClipEvent.FRAME_LABEL,(e:egret.MovieClipEvent)=>{
			// 	App.logzsq("FRAME_LABEL:"+e.type,e.frameLabel, this.bodyMc.currentFrame);//frame_label @fall 6
			// },this);
			// this.bodyMc.addEventListener(egret.Event.LOOP_COMPLETE, (e:egret.Event)=>{
			// 	App.logzsq("LOOP_COMPLETE:"+e.type,this.vo.actState);//输出3次
			// 	this.vo.actState = ActState.STAND;
			// }, this);
			if(this.bodyMc.hasEventListener(egret.Event.COMPLETE)== false){
				this.bodyMc.addEventListener(egret.Event.COMPLETE, this.playAtkActComplete, this);
			}
		}
	}

	/**
	 * 更新模型
	 */
	public updateAllModel(){
		if(this.vo.actState == ActState.ATTACK || this.vo.actState == ActState.DEAD){
			return 
		}
		this.updateActState(this.vo.actState,this.vo.dire,3,true);
	}

	/**
	 * 碰撞检测 
	 */
	public ishitTest(xx,yy):boolean{
		return this.bodyMc.hitTestPoint(xx,yy);
	}

	/**
	 * 冲撞
	 */
	public playCollision(gridDis:number = 2,moveSpeed:number = 30) {
		if(this.vo.actState == ActState.DEAD){return;}
		this.pathList = [];
		this.clearMoveCallBack();

		var gridList = BumpFrontGrids[gridDis][this.vo.dire.dire8];
		var tgx:number;
		var tgy:number; 
		var ngx:number = this.vo.gridX;
		var ngy:number = this.vo.gridY; 
		for(let k:number = 0;k<gridList.length;k++){
			var offset:Array<number> = gridList[k];
			tgx = this.vo.gridX +offset[0];
			tgy = this.vo.gridY +offset[1];
			if(this._sceneModel.curGridIsOpen(tgx,tgy) && this._sceneModel.getGridTableHasObj(tgx,tgy) == false){
				ngx = tgx;
				ngy = tgy;
			}
		}
		if(ngx != this.vo.gridX || ngy != this.vo.gridY){
			var pos:Array<number> = [SceneUtil.gridToPixelX(ngx),SceneUtil.gridToPixelY(ngy)];
			var dis:number = SceneUtil.getDistance(this.x,this.y,pos[0],pos[1]);
			var times:number = Math.round(dis/moveSpeed);
			this.updateMoveStepTimes(pos, times ,this.vo.dire);
		}
		// //old
		// let pos:Array<number>;
		// if(nextPos == null){
		// 	nextPos = SceneUtil.getRoleLengthenPos(this.vo.dire,this.x,this.y,320);
		// }
		// pos = [Math.min(SceneModel.getInstance().sceneWidth,Math.max(0,nextPos.x)),Math.min(SceneModel.getInstance().sceneHeight,Math.max(0,nextPos.y))];
		// var dis:number = SceneUtil.getDistance(this.x,this.y,pos[0],pos[1]);
		// var times:number = Math.round(dis/moveSpeed);
		// this.updateMoveStepTimes(pos, times ,this.vo.dire);
	}

	/**
	 * 被冲撞,被振开也可以用，速度调低点
	 */
	public playBeCollision(gridDis:number = 2,dire:number = 0,moveSpeed:number = 30) {
		if(this.vo.actState == ActState.DEAD){return;}
		this.isCollision = true;
		//跑完后才让他死亡

		this.pathList = [];
		this.clearMoveCallBack();
		if(dire == 0){
			dire = SceneUtil.getReversedDireScale(this.vo.dire.dire8).dire8;
		}
		var gridList = BumpFrontGrids[gridDis][dire];
		var tgx:number;
		var tgy:number; 
		var ngx:number = this.vo.gridX;
		var ngy:number = this.vo.gridY; 
		for(let k:number = 0;k<gridList.length;k++){
			var offset:Array<number> = gridList[k];
			tgx = this.vo.gridX +offset[0];
			tgy = this.vo.gridY +offset[1];
			if(this._sceneModel.curGridIsOpen(tgx,tgy) && this._sceneModel.getGridTableHasObj(tgx,tgy) == false){
				ngx = tgx;
				ngy = tgy;
			}
		}
		if(ngx != this.vo.gridX || ngy != this.vo.gridY){
			var pos:Array<number> = [SceneUtil.gridToPixelX(ngx),SceneUtil.gridToPixelY(ngy)];
			var dis:number = SceneUtil.getDistance(this.x,this.y,pos[0],pos[1]);
			var times:number = Math.round(dis/moveSpeed);
			this.updateMoveStepTimes(pos, times ,this.vo.dire);
		}
		// let pos:Array<number>;
		// if(nextPos == null){
		// 	nextPos = SceneUtil.getRoleLengthenPos(SceneUtil.getReversedDireScale(this.vo.dire.dire8),this.x,this.y,320);
		// }
		// pos = [Math.min(SceneModel.getInstance().sceneWidth,Math.max(0,nextPos.x)),Math.min(SceneModel.getInstance().sceneHeight,Math.max(0,nextPos.y))];
		// var dis:number = SceneUtil.getDistance(this.x,this.y,pos[0],pos[1]);
		// var times:number = Math.round(dis/moveSpeed);
		// this.updateMoveStepTimes(pos, times ,this.vo.dire);
	}



	/**
	 * 传送，从一个地方调到另外一个地方
	 */
	public playTransfer(nextPos:point = null,dire:number = 0) {
		if(this.vo.actState == ActState.DEAD){return;}
		this.pathList = [];
		this.clearMoveCallBack();
		if(dire == 0){
			dire = this.vo.dire.dire8;
		}
		if(nextPos == null){
			var nx:number = Math.floor(this._sceneModel.gridXNum*Math.random());
			var ny:number = Math.floor(this._sceneModel.gridYNum*Math.random());
			nextPos = new point(SceneUtil.gridToPixelX(nx),SceneUtil.gridToPixelY(ny));
		}
		this.updatePosition(nextPos.x,nextPos.y);
	}

	/**
	 * 更新
	 */
	public update() {
		//super.update();
		if(this.vo.actState == ActState.RUN){
			this.nextPosition();
		}else if(this.vo.actState == ActState.STAND){
			this.playStand();
		}else if(this.vo.actState == ActState.DEAD){
			this.playDead();
		}
		if(this.vo.initBuffQueue && this.vo.initBuffQueue.length > 0){
			var v:FBuffVo = this.vo.initBuffQueue.pop();
			if(v.isRemove() == false){
				this.vo.addBuff(v);
				this.addBuff(v);
			}
		}else{
			var buffDic:any = this.vo.buffDic;
			var v:FBuffVo;
			for(var k in buffDic){
				v = buffDic[k];
				if(v.isRemove()){
					this.vo.removeBuff(v);
					this.removeBuff(v);
				}
			}
		}
		//App.logzsq(this.curActState);
	}
	/**
	 * 暂停
	 */
	public pause() {
		super.pause();
	}
	/**
	 * 恢复暂停
	 */
	public resume() {
		super.resume();
	}
	/**
	 * 销毁
	 */
	public destroy() {
		super.destroy();
		if(this.bodyMc){
			this.bodyMc.removeEventListener(egret.Event.COMPLETE, this.playAtkActComplete, this);
			this.bodyMc.destroy();
			this.bodyMc.parent.removeChild(this.bodyMc);
			this.bodyMc = null;
			this.bodyUrl = "";
		}
		if(this.getHitEffMc){
			this.getHitEffMc.removeEventListener(egret.Event.COMPLETE, this.playGetHitEffComplete, this);
			this.getHitEffMc.destroy();
			if(this.getHitEffMc.parent){
				this.getHitEffMc.parent.removeChild(this.getHitEffMc);
			}
			this.getHitEffMc = null;
		}
		if(this.atkEffMc){
			this.atkEffMc.removeEventListener(egret.Event.COMPLETE, this.playAttackEffComplete, this);
			this.atkEffMc.destroy();
			if(this.atkEffMc.parent){
				this.atkEffMc.parent.removeChild(this.atkEffMc);
			}
			this.atkEffMc = null;
		}

		this.clearAllBuffEff();

		this.pathList = [];
		this.clearMoveCallBack();
		this.endPoint = null;
		this.curActState = 0;
		this._action = 0;
		this.vo.clear();
		this.isCollision = false;
	}

	public showShadow(){
		var shadow:string = "sceneObjShadow_png";
		if(this.vo.monsterType > 1){
			shadow = "sceneObjShadow2_png";
		}
		if(this.shadow == null){
			this.shadow = new egret.Bitmap(RES.getRes(shadow));
			this.addChild(this.shadow);
		}else{
			this.shadow.texture = RES.getRes(shadow);
		}
		this.shadow.x = 0-this.shadow.width/2;
		this.shadow.y = 0-this.shadow.height/2;
	}


	protected buffEffNum:number = 0;//buff效果zidian
	/**
	 * 播放buff效果
	 */
	protected showBuffEff(buffEff:string){
		if(buffEff == "" || this.vo.actState == ActState.DEAD){return;}
		if(this.buffEffDic == null){
			this.buffEffDic = {};
		}else if(this.buffEffDic[buffEff]){
			return;
		}
		var buffMc:AMovieClip = new AMovieClip();
		this.buffEffDic[buffEff] = buffMc;
		this.topLay.addChild(buffMc);
		this.buffEffNum++;
		buffMc.playMCKey(buffEff,"",-1);
	}
	/**
	 * 清理buff效果
	 */
	protected clearBuffEff(buffEff:string){
		if(this.buffEffDic && this.buffEffDic[buffEff]){
			var mc:AMovieClip = this.buffEffDic[buffEff];
			mc.destroy();
			if(mc.parent){
				mc.parent.removeChild(mc);
			}
			this.buffEffNum--;
			this.buffEffDic[buffEff] = null;
			delete this.buffEffDic[buffEff];
		}
	}

	/**
	 * 清理buff效果
	 */
	protected clearAllBuffEff(){
		if(this.buffEffDic){
			for(var k in this.buffEffDic){
				var disObj:AMovieClip = this.buffEffDic[k];
				if(disObj){
					disObj.destroy();
					if(disObj.parent){
						disObj.parent.removeChild(disObj);
					}
				}
				this.buffEffDic[k] = null;
			}
		}
		this.buffEffNum = 0;
		this.buffEffDic = {};
	}

	public addBuff(vo:FBuffVo){
		switch(vo.effType){
			case BuffEffType.STONE:
				this.setModelfilters(SceneFiltersType.GRAY);
				break;
			case BuffEffType.DIZZY:
				this.setModelfilters(SceneFiltersType.WHITE);
				break;
			case BuffEffType.INVISIBLE:
				this.setModelInvisible(true);
				break;
			case BuffEffType.POISON:
				this.setModelfilters(SceneFiltersType.GREEN);
				break;
			case BuffEffType.SHIELD:
				break;
			case BuffEffType.SILENT:
				break;
			default:
		}

		if(vo.mcResId && vo.mcResId != ""){
			this.showBuffEff(vo.mcResId);
		}
	}

	public removeBuff(vo:FBuffVo){
		switch(vo.effType){
			case BuffEffType.STONE:
				this.setModelfilters(SceneFiltersType.NULL);
				break;
			case BuffEffType.DIZZY:
				this.setModelfilters(SceneFiltersType.NULL);
				break;
			case BuffEffType.INVISIBLE:
				this.setModelInvisible(false);
				break;
			case BuffEffType.POISON:
				this.setModelfilters(SceneFiltersType.NULL);
				break;
			case BuffEffType.SHIELD:
				break;
			case BuffEffType.SILENT:
				break;
			default:
		}

		if(vo.mcResId && vo.mcResId != ""){
			this.clearBuffEff(vo.mcResId);
		}
	}
	/**
	 * 设置滤镜
	 * @param type 滤镜类型SceneFiltersType
	 */
	protected setModelfilters(type:number = 0){
		//SceneFiltersType
		var filters = SceneFilters[type];
		if(this.bodyMc){
			this.bodyMc.filters = filters;
		}
	}
	/**
	 *  设置隐身
	 */
	protected setModelInvisible(b:boolean = true){
		//SceneFiltersType
		if(b){
			if(this.modelLay.alpha != 0.5){
				this.modelLay.alpha = 0.5;
			}
		}else{
			if(this.modelLay.alpha != 1){
				this.modelLay.alpha = 1;
			}
		}
	}

	//BUFF 相关END

	/**
	 * 设置VO
	 */
	public set vo(value:SceneMonsterVo) {
		this._objVo = value;
	}
	/**
	 * 获取VO
	 */
	public get vo():SceneMonsterVo {
		return this._objVo;
	}
}
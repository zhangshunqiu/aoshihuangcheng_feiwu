/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com  2017/6/20
 * 场景玩家对象
 */
class ScenePlayer extends SceneMonster {
	protected wingMc:AMovieClip; //翅膀
	protected wingUrl:string = "";
	protected weaponMc:AMovieClip;//武器
	protected weaponUrl:string = "";

	protected isMainRole:Boolean = false;//是否是主玩家
	protected _zorderDire = 0;

	protected _curTargetId = 0;
	protected _curTargetType = 0;

	public constructor(objectVo:any) {
		super(objectVo);
	}

	/**
	 * 初始化
	 */
	public init(){
		if(this.vo.id == RoleManager.getInstance().getMainHeroId()){
			this.isMainRole = true;
		}else{
			this.isMainRole = false;
		}
		this.isCollision = false;
		this.moveSpeed = this.vo.moveSpeed;
		this.playStand();
		this.x = this.vo.posX;
		this.y = this.vo.posY;
		this.setGridPosition(this.vo.gridX,this.vo.gridY);
		this.curActState = 0;
		this._action = 0;
		this.pathList = [];
		this.clearMoveCallBack();
		this.endPoint = null;
		this._zorderDire = 0;
		this.actionTime = 500;
		this.nextAtkTime = (GlobalModel.getInstance() as GlobalModel).getTimer()+500;
		if(this.modelLay.alpha < 1){this.modelLay.alpha = 1;}
		if(this.shadow.visible == false){
			this.shadow.visible = true;
		}
		this.showNameAndHpBar = true;
		this.updateName();
		this.updateHp();
		this.updateHonorTitle();
		if(this.isMainRole){
			this.dispatchMainRolePos([this.vo.posX,this.vo.posY]);
		}

		// if(this.isMainRole){
		// 	this.showNameAndHpBar = true;
		// 	this.updateName();
		// 	this.updateHp();
		// }else{
		// 	//判断是否死亡
		// 	if(this.vo.curHp <= 0){
		// 		this.setDeadState();
		// 	}
		// }
	}

	/**
	  * 更新气血
	  */
	public updateHp():void{
		super.updateHp();
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
			var nn:number = Math.random()*1000; 
			if(GlobalModel.getInstance().getTimer() > this.nextAtkTime && nn>900){

				//优先查找可以拾取的物品
				if(this.isMainRole){
					var model:SceneModel = SceneModel.getInstance();
					var itemDic:any = model.sceneItemVoDic;
					var dis:number = 100000;
					var dVo:SceneItemVo;
					for(var key in itemDic){
						var vo:SceneItemVo = itemDic[key];
						var tdis:number = SceneUtil.getDistance(this.x,this.y,vo.posX,vo.posY);
						if(tdis < dis && tdis < 640){
							dis = tdis;
							dVo = vo;
						}
					}
					if(dVo){
						this.moveToPickup(dVo);
						return;
					}
					//优先查找可以拾取的物品 end
				}
				this.nextAtkTime = (GlobalModel.getInstance() as GlobalModel).getTimer()+1000;
				if(this.vo.enableUseSkill() && this.visible){
					var skillTargetVo:FSkillTargetVo = SceneManager.getInstance().searchUseSkillAndTarget(this.vo,this.vo.nextFSkillVo);
					if(skillTargetVo.targetArr && skillTargetVo.targetArr.length >0){
						var target:BaseObjectVo = skillTargetVo.targetArr[0];
						var diss:number = SceneUtil.getDistance(this.x,this.y,target.posX,target.posY);
						if(diss > skillTargetVo.skillVo.atkDis){
							var nPos:Array<number> = SceneUtil.getNearMoveGridByGridNum(target.gridX,target.gridY,this.vo.gridX,this.vo.gridY,Math.floor(skillTargetVo.skillVo.atkDis/64));
							if(nPos){
								nPos[0] = SceneUtil.gridToPixelX(nPos[0]);
								nPos[1] = SceneUtil.gridToPixelY(nPos[1]);
								this.moveToPoint([nPos[0],nPos[1]]);
								
								// var pathList:Array<Array<number>> = this._sceneModel.getAStarPixelPath(this.vo.gridX,this.vo.gridY,nPos[0],nPos[1]);
								// if(pathList){
								// 	this.addMovePath(pathList);
								// }
							}
							if(this.vo.nextFSkillVo == null){
								this.vo.nextFSkillVo = skillTargetVo.skillVo;
							}
							return;
						}else {
							if(diss < 32 && target && target.id != this.vo.id && (skillTargetVo.skillVo.targetType == SkillTargetType.ENEMY || skillTargetVo.skillVo.targetType == SkillTargetType.PARTNER)){
								//当站在同格的时候跑出一格
								if(this.moveOutCurGrid(this.vo.gridX,this.vo.gridY,this.vo.dire.dire8)){
									return;
								}
							}
							//当前格有东西则执行跑出一格

							//距离够就攻击
							//更新攻击范围目标列表
							if(skillTargetVo.targetArr.length >0){
								skillTargetVo = this._sceneModel.updatePlayerHurtListByRange(this.vo,skillTargetVo);
							}
							skillTargetVo.atkVo = this.vo;
							this.playAttack(skillTargetVo);
							this.vo.nextFSkillVo = null;
							return;
						}
					}else{
						//没有攻击目标
					}
				}else{
					//不能放技能
				}
				if(this.isMainRole == false && this.vo.ownerId && this.vo.ownerId >0 && this.moveFollowMaster(this.vo.ownerId)){
					//跟随主人
				}else if(this._sceneModel.getGridTableHasTwoObj(this.vo.gridX,this.vo.gridY) && this.moveOutCurGrid(this.vo.gridX,this.vo.gridY,this.vo.dire.dire8)){
					//当站在同格的时候跑出一格
				}
			}
		}
	}

	/**
	 * 走去拾取物品
	 */
	public moveToPickup(itemVO:SceneItemVo){
		if(this.moveToPickupCallback(itemVO) == false){
			this.playMove([[itemVO.posX,itemVO.posY]],itemVO,this.moveToPickupCallback,this);
		}
	}
	/**
	 * 拾取物品
	 */
	public moveToPickupCallback(itemVO:SceneItemVo):boolean{
		if(SceneUtil.getDistance(this.x,this.y,itemVO.posX,itemVO.posY) < 64){
			//test zhangshunqiu 拾取物品测试
			SceneModel.getInstance().removeSceneObjectVo(itemVO);
			EventSystem.getInstance().dispatchEvent(SceneEventType.REMOVE_SCENE_OBJECT,itemVO);
			return true
		}
		return false
	}

	//更新移动次数和步长
	protected updateMoveStepTimes(pos:Array<number>,times:number,dire:DireScale){
		super.updateMoveStepTimes(pos,times,dire);
		if(this.isMainRole){
			let sendData ={obj_type:this.vo.type,obj_id:this.vo.id,begin_x:this.vo.gridX,begin_y:this.vo.gridY,end_x:SceneUtil.pixelToGridX(this.endPoint[0]),end_y:SceneUtil.pixelToGridY(this.endPoint[1]),direction:this.vo.dire.dire8};
	   	 	App.Socket.send(11002,sendData);
		}
	}
	/**
	 * 移动完成
	 */
	protected moveComplete(){
		super.moveComplete();
		//玩家还要处理完成后功能
	}
	
	/**
	 * 更新位置
	 */
	public updatePosition(xx:number,yy:number){
		//xx == Math.floor(xx);
		//yy == Math.floor(yy);
		super.updatePosition(xx,yy);
		//App.logzsq("updatePosition = ",this.vo.gridX,this.vo.gridY)
	
		this.dispatchMainRolePos([xx,yy]);
	}

	/**
	 * 派发主角位置信息
	 */
	protected dispatchMainRolePos(pos:Array<number>){
		if(this.isMainRole){
			App.EventSystem.dispatchEvent(SceneEventType.UPDATE_SCENE_POS,pos);
		}
	}
	
	/**
	 * 播放摇杆移动功能
	 */
	public playRocker(xx:number,yy:number){

	}
	/**
	 * 停止摇杆移动功能
	 */
	public stopRocker(){
		
	}

	/**
	 * 死亡
	 */
	public playDead(){
		//this.vo.actState = ActState.DEAD;
		if(this.curActState != ActState.DEAD){
			this.curActState = ActState.DEAD;
			this.updateActState(ActState.DEAD,this.vo.dire);
			this.modelLay.alpha = 0.8;
			//this.headLay.visible = false;
			if(this.weaponMc){
				this.weaponMc.visible = false;
			}
			if(this.wingMc){
				this.wingMc.visible = false;
			}
			if(this.shadow){
				this.shadow.visible = false;
			}
			this.clearAllBuffEff();

			this.pathList = [];
			this.clearMoveCallBack();
		}
	}

	/**
	 * 更新翅膀
	 */
	protected updateWing(wingUrl:string="",action:string="",scaleX:number = 1,times:number= -1):void{
		if(this.wingMc == null){
            this.wingMc = new AMovieClip();
			this.modelLay.addChild(this.wingMc);
		}
		if(this.wingMc.visible == false){
			this.wingMc.visible = true;
		}
		this.wingUrl = wingUrl;
		this.wingMc.playMCKey(wingUrl,action,times)
		this.wingMc.scaleX = scaleX;
	}

	/**
	 * 更新武器
	 */
	protected updateWeapon(weaponUrl:string="",action:string="",scaleX:number = 1,times:number= -1):void{
		if(this.weaponMc == null){
            this.weaponMc = new AMovieClip();
			this.modelLay.addChild(this.weaponMc);
		}
		if(this.weaponMc.visible == false){
			this.weaponMc.visible = true;
		}
		this.weaponUrl = weaponUrl;
		this.weaponMc.playMCKey(weaponUrl,action,times)
		this.weaponMc.scaleX = scaleX;
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
		//App.logzsq("updateActState",actState,actState)
		this._action = actState;
		this.vo.dire = dire;
		if(actState == ActState.STAND){
			this.updateBody(this.vo.bodyId+"1"+dire.dire,"",dire.scale);//run
			if(this.vo.wingId != ""){this.updateWing(this.vo.wingId+"1"+dire.dire,"",dire.scale);}//run
			if(this.vo.weaponId != ""){this.updateWeapon(this.vo.weaponId +"1"+dire.dire,"",dire.scale);}//run
		}else if(actState == ActState.DEAD){
			this.updateBody(this.vo.bodyId+"5"+dire.dire,"",dire.scale,1);//run
			//this.updateWing("40011"+dire.dire,"",dire.scale);//run
			//this.updateWeapon("30011"+dire.dire,"",dire.scale);//run
		}else if(actState == ActState.RUN){
			this.updateBody(this.vo.bodyId+"2"+dire.dire,"",dire.scale);//run
			if(this.vo.wingId != ""){this.updateWing(this.vo.wingId+"2"+dire.dire,"",dire.scale);}//run
			if(this.vo.weaponId != ""){this.updateWeapon(this.vo.weaponId+"2"+dire.dire,"",dire.scale);}//run
			//this.updateBody("body000_1_"+(dire.dire-1)+"r","",dire.scale);//run
		}else if(actState == ActState.ATTACK){
			var atkAckType:string = String(atkActType);
			this.updateBody(this.vo.bodyId+atkAckType+dire.dire,"",dire.scale,1,"defaultmc");//run
			if(this.vo.wingId != ""){this.updateWing(this.vo.wingId+atkAckType+dire.dire,"",dire.scale,1);}//run
			if(this.vo.weaponId != ""){this.updateWeapon(this.vo.weaponId+atkAckType+dire.dire,"",dire.scale,1);}//run
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

		if(this.weaponMc || this.wingMc){
			this.updateZorder(dire.dire);
		}
	}


	//攻击动作播放完成
	protected playAtkActComplete(e:egret.Event){
		super.playAtkActComplete(e);
	//	App.logzsq("playAtkActComplete _ "+this.vo.actState);
	}

	/**
	 * 更新显示对象深度
	 */
	protected updateZorder(dire:number) {
		if((dire == 1 || dire == 2) && this._zorderDire != 1){
			this._zorderDire = 1;
			if(this.weaponMc){this.modelLay.setChildIndex(this.weaponMc,9);}
			this.modelLay.setChildIndex(this.bodyMc,9);
			if(this.wingMc){this.modelLay.setChildIndex(this.wingMc,9);}
		}else if(dire == 3 && this._zorderDire != 2){
			this._zorderDire = 2;
			this.modelLay.setChildIndex(this.bodyMc,9);
			if(this.weaponMc){this.modelLay.setChildIndex(this.weaponMc,9);}
			if(this.wingMc){this.modelLay.setChildIndex(this.wingMc,9);}
		}else if((dire == 4 || dire == 5 ) && this._zorderDire != 3){
			this._zorderDire = 3;
			if(this.wingMc){this.modelLay.setChildIndex(this.wingMc,9);}
			this.modelLay.setChildIndex(this.bodyMc,9);
			if(this.weaponMc){this.modelLay.setChildIndex(this.weaponMc,9);}
		}
		// this.modelLay
		// App.logzsq("dire = "+dire,this.modelLay.getChildIndex(this.weaponMc),this.modelLay.getChildIndex(this.bodyMc),this.modelLay.getChildIndex(this.wingMc));
		// App.logzsq(this.modelLay.$children,this.wingMc.hashCode,this.modelLay.getChildAt(0).hashCode,this.modelLay.getChildAt(2).hashCode);
	}

	/**
	 * 更新
	 */
	public update() {
		super.update();
		// if(this.vo.actState == ActState.RUN){
		// 	this.nextPosition();
		// }else if(this.vo.actState == ActState.STAND){
		// 	this.playStand();
		// }else if(this.vo.actState == ActState.DEAD){
		// 	this.playDead();
		// }
	}

	//BUFF 相关

	/**
	 * 设置身体
	 * @param type 滤镜类型SceneFiltersType
	 */
	protected setModelfilters(type:number = 0){
		//SceneFiltersType
		var filters = SceneFilters[type];
		if(this.bodyMc){
			this.bodyMc.filters = filters;
		}
		if(this.weaponMc){
			this.weaponMc.filters = filters;
		}
		if(this.wingMc){
			this.wingMc.filters = filters;
		}
	}

	//BUFF 相关END

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
		this._zorderDire = 0;
		if(this.wingMc){
			this.wingMc.destroy();
			this.wingMc.parent.removeChild(this.wingMc);
			this.wingMc = null;
			this.wingUrl = "";
		}
		
		if(this.weaponMc){
			this.weaponMc.destroy();
			this.weaponMc.parent.removeChild(this.weaponMc);
			this.weaponMc = null;
			this.weaponUrl = "";
		}

	}

	/**
	 * 设置VO
	 */
	public set vo(value:ScenePlayerVo) {
		this._objVo = value;
	}
	/**
	 * 获取VO
	 */
	public get vo():ScenePlayerVo {
		return this._objVo
	}
}
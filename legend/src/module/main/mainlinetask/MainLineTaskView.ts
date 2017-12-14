module game {
	export class MainLineTaskView extends BaseChildView {

		//public baseItem: customui.BaseItem;
		//public btn_reward: eui.Image;
		public btn_goto: eui.Image;
		public lb_taskname: eui.Label;
		public lb_taskdetail: eui.Label;
		public goto_id: number;
		public is_task_show;
		private _canGetMc: AMovieClip;//新任务跟任务完成的特效
		private _canGetFrameMc: AMovieClip;//可领取效果特效
		private _mainModule: MainUIModel = MainUIModel.getInstance();
		private _mainlinetaks_eventid = 0;
		private _cur_taskid: number = -1;
		private _cur_taskstate: number = 0;
		private _chanllengeEventId: number = 0; //能否挑战boss的事件id
		private _checkBossGuide: boolean; //是否检测挑战boss的引导
        
		private _value : string;
		public get value() : string {
			return this._value;
		}
		public set value(v : string) {
			this._value = v;
		}
		
		private _guideTimeHandler: number;
		public constructor(skinName: string) {
			super("MainLineTaskSkin")
		}


		protected childrenCreated() {
			super.childrenCreated();

			// this.btn_reward.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			// 	this.getMainLineTaskReward();
			// }, this);
			this.btn_goto.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {

				if (this._cur_taskstate == 1) { //可领取
					this.getMainLineTaskReward();
				} else { //跳转
					let info = App.ConfigManager.getMainLineTaskInfoById(this._mainModule.taskId);
					MainModuleJump.jumpToModule(info.skip);
				}
			}, this);


			//this.baseItem.lb_name.visible = false;
			//this.baseItem.img_frame.visible = false;
			//this.baseItem.img_icon.touchEnabled = false;
		}
		/**
			 * 打开窗口
			 */
		public open(openParam: any = null): void {
			super.open(openParam);

			if (this._mainlinetaks_eventid === 0) {
				this._mainlinetaks_eventid = App.EventSystem.addEventListener(PanelNotify.MAIN_LINE_TASK_GET_INFO, this.updateMailLineTask, this);
			}

			if (this._chanllengeEventId === 0) {
				this._chanllengeEventId = App.EventSystem.addEventListener(PanelNotify.MAIN_BOSS_CAN_CHANLLENGE, this.checkBossGuide, this);
			}


			if (this._canGetMc == null) {
				this._canGetMc = new AMovieClip();
				this._canGetMc.x = this.btn_goto.x + 180;
				this._canGetMc.y = this.btn_goto.y - 20;
				this._canGetMc.touchEnabled = false;
				this._canGetMc.visible = false;
				this.addChildAt(this._canGetMc, 1);
			}

			if (this._canGetFrameMc == null) {
				this._canGetFrameMc = new AMovieClip();
				this._canGetFrameMc.x = this.btn_goto.x + 254;
				this._canGetFrameMc.y = this.btn_goto.y + 47;
				this._canGetFrameMc.touchEnabled = false;
				this._canGetFrameMc.visible = false;
				this.addChild(this._canGetFrameMc);
			}

			this.updateMailLineTask();

			if (!this._guideTimeHandler) {
				this._guideTimeHandler = App.GlobalTimer.addSchedule(1000, 0, this.checkGuide, this);
			}
		}

		/**
		 * 清理
		 */
		public clear(data: any = null): void {
			super.clear();

			if (this._canGetMc) {
				this._canGetMc.visible = false;
				if (this._canGetMc.hasEventListener(egret.Event.COMPLETE)) {
					this._canGetMc.removeEventListener(egret.Event.COMPLETE, this.effctComplete, this);
				}
				this._canGetMc.stop();
				this._canGetMc.destroy();
				this._canGetMc = null;
			}

			if (this._canGetFrameMc) {
				this._canGetFrameMc.visible = false;
				this._canGetFrameMc.stop();
				this._canGetFrameMc.destroy();
				this._canGetFrameMc = null;
			}

			if (this._mainlinetaks_eventid != 0) {
				App.EventSystem.removeEventListener(PanelNotify.MAIN_LINE_TASK_GET_INFO, this._mainlinetaks_eventid);
				this._mainlinetaks_eventid = 0;
			}

			if (this._chanllengeEventId != 0) {
				App.EventSystem.removeEventListener(PanelNotify.MAIN_BOSS_CAN_CHANLLENGE, this._chanllengeEventId);
				this._chanllengeEventId = 0;
			}

			if (this._guideTimeHandler) {
				App.GlobalTimer.remove(this._guideTimeHandler);
				this._guideTimeHandler = undefined;
				// let guideIdArray :Array<number> = [1000,1001]; //引导id数组
				// let guideStepArray = [1,1];//引导步骤数组
				// for(let i=0;i<guideIdArray.length;i++) {
				//     App.GuideManager.removeClickBtn(guideIdArray[i],guideStepArray[i]);
				// }
			}

		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
		}


		public updateMailLineTask() {

			if (this._mainModule.taskId == 0) {

				this.visible = false;
				this.is_task_show = false
				return;
			}
			else {
				this.visible = true;
			}


			// if (this._mainModule.taskState == 2) {
			// 	this.visible = false;
			// 	this.is_task_show = false
			// }
			// else {
			// 	this.visible = true;
			// }

			if (this._cur_taskid != this._mainModule.taskId && this._cur_taskid > 0) {
				// 新任务特效
				this._canGetMc.visible = true;
				this._canGetMc.playMCKey("effjsrw", "", 1, null, () => {
					this._canGetMc.frameRate = 15;
				}
					, this);

				if (this._canGetMc.hasEventListener(egret.Event.COMPLETE) == false) {
					this._canGetMc.addEventListener(egret.Event.COMPLETE, this.effctComplete, this);
				}
			}

			if (this._cur_taskstate == 0 && this._mainModule.taskState == 1) {
				//任务完成特效
				this._canGetMc.visible = true;
				this._canGetMc.playMCKey("effrwwc", "", 1, null, () => {
					this._canGetMc.frameRate = 15;
				}
					, this);

				if (this._canGetMc.hasEventListener(egret.Event.COMPLETE) == false) {
					this._canGetMc.addEventListener(egret.Event.COMPLETE, this.effctComplete, this);
				}
			}

			if (this._mainModule.taskState == 1) {
				//任务完成底框特效
				this._canGetFrameMc.visible = true;

				this._canGetFrameMc.playMCKey("effrwts", "", -1, null, () => {
					this._canGetFrameMc.frameRate = 8;
				}
					, this);
			}
			else {
				this._canGetFrameMc.stop();
				this._canGetFrameMc.visible = false;
			}

			let info = App.ConfigManager.getMainLineTaskInfoById(this._mainModule.taskId);
			let rewardlist: Array<any> = [];
			rewardlist = info.reward;

			if (rewardlist.length > 0) {
				let reward_items: Array<any> = [];
				reward_items = rewardlist[0];
				// if (reward_items.length >= 3) {

				// 	this.baseItem.updateBaseItem(ClientType.BASE_ITEM, reward_items[1]);
				// 	this.baseItem.lb_num.visible = true;
				// 	this.baseItem.lb_num.text = reward_items[2] + "";
				// }

				// this.baseItem.img_frame.visible = false;
				// this.baseItem.img_frame.width = 0;
				// this.baseItem.img_icon.touchEnabled = false;
			}
			if (this._mainModule.taskState == 1)
				this.lb_taskname.textFlow =
					[{ text: info.name + "" }, { text: "(已完成)", style: { textColor: 0x00f829 } }];
			else
				this.lb_taskname.textFlow =
					[{ text: info.name + "" }, { text: "(" + this._mainModule.curTaskIndex + "/" + this._mainModule.totalTask + ")", style: { textColor: 0x00f829 } }];

			this.lb_taskdetail.text = info.des;
			this.goto_id = info.skip;


			this._cur_taskid = this._mainModule.taskId;
			this._cur_taskstate = this._mainModule.taskState;

			//检测新手引导 一切从这里开始
			// this.checkGuideStart();
		}

		private effctComplete(e: egret.Event) {
			this._canGetMc.visible = false;
		}

		public getMainLineTaskReward() {
			if (this._cur_taskstate = 1)
				App.Socket.send(29002, null);

		}

		private checkGuideStart() {
			let guideInfo = App.ConfigManager.getGuideInfoByTaskId(this._cur_taskid);
			if (guideInfo && App.GuideManager.checkStartGuide(guideInfo.task_id) && this._cur_taskstate != 1) { //要出现引导了
				App.GuideManager.setStartGuide(guideInfo.id);
			}
		}

		//引导检测
		private checkGuide() {
			if (App.GuideManager.needGuide) {
				if (App.GuideManager.startGuide && App.GuideManager.curGuideId) { //开始引导了，有引导id
					if (this.checkGuideEnvironment()) { //没有界面挡住
						let curGuideInfo = App.ConfigManager.getGuideInfoByIdAndStep(App.GuideManager.curGuideId, 1);
						if (curGuideInfo.type == 1 ) { //挑战boss引导
							if(this._checkBossGuide) {
								App.GuideManager.bindClickBtn(this.btn_goto, App.GuideManager.curGuideId, 1);
								App.GuideManager.checkGuide(App.GuideManager.curGuideId);
							} else {

							}
						} else {
							App.GuideManager.bindClickBtn(this.btn_goto, App.GuideManager.curGuideId, 1);
							App.GuideManager.checkGuide(App.GuideManager.curGuideId);
						}

					}
				}
			} else {
				if (this._guideTimeHandler) {
					App.GlobalTimer.remove(this._guideTimeHandler);
					this._guideTimeHandler = undefined;
				}
			}
		}

		//检测是否有其他窗口挡住引导
		checkGuideEnvironment() {
			if (GameRootLay.gameLayer()._moduleLay.numChildren == 0 && GameRootLay.gameLayer()._panelLay.numChildren == 0) {
				return true;
			} else {
				for (let i = 0; i < GameRootLay.gameLayer()._moduleLay.numChildren; i++) {
					if (GameRootLay.gameLayer()._moduleLay.getChildAt(i).visible) {
						return false;
					}
				}
				for (let i = 0; i < GameRootLay.gameLayer()._panelLay.numChildren; i++) {
					if (GameRootLay.gameLayer()._panelLay.getChildAt(i).visible) {
						return false;
					}
				}
				return true;
			}
		}

		private checkBossGuide(data) {
			if (data) {
				this._checkBossGuide = true;
				this.checkGuideStart();
			} else {
				this._checkBossGuide = false;
			}
		}

	}

}
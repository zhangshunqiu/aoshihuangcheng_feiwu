/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 每日必做UI界面逻辑 2017/06/20.
 */
module game {

	// export class MyTabbar extends eui.TabBar
	// {
	// 	public setTapTabBar(index:number){
	//        this.setSelectedIndex(index,true);
	// 	}
	// }
	export class MustDoView extends BaseView {
		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
		}

		// bg
		public commonWin: customui.CommonWin;
		public bt_back: eui.Image;
		//public tab_medal: eui.TabBar;
		// public gp_activity: eui.Group;
		// public gp_medal: eui.Group;
		// public gp_achieve: eui.Group;
		// public gp_title: eui.Group;
		//private _curtype = 1;
		private _curgroup: eui.Group;
		private _mustdomodel: MustDoModel = MustDoModel.getInstance();
		public rb_mustdo: eui.RadioButton;
		public rb_title: eui.RadioButton;
		//public rb_achieve: eui.RadioButton;
		//public rb_medal: eui.RadioButton;
		private _activity_view: ActivityTaskView;
		private _title_view: MustDoTitleView;
		private _medal_view: MustDoMedalView;
		private _achieve_view: MustDoAchieveView;
		private _curSelView: BaseChildView;
		private _curSelIndex: number = 0;
		//activity
		// public scr_task: eui.Scroller;
		// public pgbar_activity: eui.ProgressBar;
		// public list_chest: Array<ActivityRewardItem> = [];
		// public activity_reward1: ActivityRewardItem;
		// public activity_reward2: ActivityRewardItem;
		// public activity_reward3: ActivityRewardItem;
		// public activity_reward4: ActivityRewardItem;
		// private _listtask: eui.List = new eui.List();
		// private _eventid_activity: number = 0;
		//medal
		// public pgbar_medalvalue: eui.ProgressBar;
		// public bt_view: eui.Image;
		// public btn_lvup: eui.Image;
		// public bt_untake: eui.Image;
		// public bt_getachieve: eui.Label;
		// public lb_pgtext: eui.Label;
		// public lb_rank: eui.Label;
		// public lb_lv: eui.Label;
		// public lb_honor: eui.Label;
		// public lb_power: eui.BitmapLabel;
		// public lb_untake: eui.Label;
		// public lb_hp: eui.Label;
		// public lb_attak: eui.Label;
		// public lb_dfphydic: eui.Label;
		// public lb_dfmagic: eui.Label;
		// public lb_nexthp: eui.Label;
		// public lb_nextak: eui.Label;
		// public lb_nextdfp: eui.Label;
		// public lb_nextdfm: eui.Label;
		// private _eventid_medal: number = 0;

		//achieve
		// public lb_achievepercent: eui.Label;
		// public lb_achievevalue: eui.Label;
		// public scr_achieve: eui.Scroller;
		// public bt_takeall: eui.Image;
		// private _listachieve: eui.List = new eui.List();
		// private _eventid_achieve: number = 0;

		// //title 
		// public lb_totalactivity: eui.Label;
		// public btn_lighten: eui.Image;
		// public scr_title: eui.Scroller;
		// private _listtitle: eui.List = new eui.List();
		// private _eventid_Title: number = 0;


		//private _btnTakeMc: AMovieClip;//成就值多少的特效
		//private _btnTakeAllMc: AMovieClip;//一键领取特效



		protected childrenCreated() {
			super.childrenCreated();

			this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				App.WinManager.closeWin(WinName.MUSTDO);
			}, this);
			this.bt_back.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				App.WinManager.closeWin(WinName.MUSTDO);
			}, this);
			this.initView();

		}

		protected initBtnTips() {
			//App.BtnTipManager.addBtnTipItem(ConstBtnTipType.TASK_MEDAL, this.rb_medal);
			App.BtnTipManager.addBtnTipItem(ConstBtnTipType.TASK_DAILY, this.rb_mustdo);
			//App.BtnTipManager.addBtnTipItem(ConstBtnTipType.TASK_ACHIEVE, this.rb_achieve);
		}

		private initView() {
			// let data = ["勋章", "每日必做", "成就", "称号"];
			// this.tab_medal.dataProvider = new eui.ArrayCollection(data);
			// this.tab_medal.addEventListener(eui.ItemTapEvent.ITEM_TAP, (event: eui.ItemTapEvent) => {
			// 	this.changeMustDoState(event.itemIndex);
			// }, this);
			// this.tab_medal.selectedIndex = MustDoType.MEDAL - 1;
			this.initBtnTips();

			var radioGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup();
			radioGroup.addEventListener(eui.UIEvent.CHANGE, (evt: eui.UIEvent) => {
				var radioGroup: eui.RadioButtonGroup = evt.target;
				this.changeMustDoState(radioGroup.selectedValue);
			}, this);
			this.rb_mustdo.group = radioGroup;
			this.rb_mustdo.value = 1;
			this.rb_mustdo.label = "每日必做";
			this.rb_mustdo.selected = true;
			this.rb_title.group = radioGroup;
			this.rb_title.label = "称号";
			this.rb_title.value = 3;
			// this.rb_achieve.group = radioGroup;
			// this.rb_achieve.label = "成就";
			// this.rb_achieve.value = 2;
			// this.rb_medal.group = radioGroup;
			// this.rb_medal.label = "勋章";
			// this.rb_medal.value = 0;
			// //this._curgroup = this.gp_activity;

			// this.tab_medal.validateNow();
			// this.tab_medal.addEventListener(eui.UIEvent.CREATION_COMPLETE, this._onCreatComplete, this)

			// this.scr_task.viewport = this._listtask;
			// this.scr_task.scrollPolicyH = eui.ScrollPolicy.OFF;
			// this._listtask.itemRenderer = TaskItem;
			// this.list_chest.push(this.activity_reward1);
			// this.list_chest.push(this.activity_reward2);
			// this.list_chest.push(this.activity_reward3);
			// this.list_chest.push(this.activity_reward4);

			// this.scr_achieve.viewport = this._listachieve;
			// this.scr_task.scrollPolicyH = eui.ScrollPolicy.OFF;
			// this._listachieve.itemRenderer = TaskItem;
			// this.bt_takeall.addEventListener(egret.TouchEvent.TOUCH_TAP, this.takeAll, this);

			// this.scr_title.viewport = this._listtitle;
			// this.scr_title.scrollPolicyH = eui.ScrollPolicy.OFF;
			// this._listtitle.itemRenderer = TitleItem;
			// this.btn_lighten.addEventListener(egret.TouchEvent.TOUCH_TAP, this.lightenProperty, this);

			// this.bt_getachieve.textFlow = [{ text: "获得成就", style: { "underline": true } }]
			// this.btn_lvup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.medalLvUp, this);
			// this.bt_view.addEventListener(egret.TouchEvent.TOUCH_TAP, this.viewMedalRank, this);
			// this.bt_getachieve.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getAchieveWay, this);
			// this.bt_untake.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getUnTakeAchieve, this);

			// if (this._btnTakeMc == null) {                     //未领取成就值特效
			// 	this._btnTakeMc = new AMovieClip();
			// 	this.gp_medal.addChild(this._btnTakeMc);
			// 	this._btnTakeMc.x = this.bt_untake.x + 55;
			// 	this._btnTakeMc.y = this.bt_untake.y + 52;
			// 	this._btnTakeMc.touchEnabled = false;

			// }
			// this._btnTakeMc.visible = false;

			// if (this._btnTakeAllMc == null) {                     //一键领取特效
			// 	this._btnTakeAllMc = new AMovieClip();
			// 	this.gp_achieve.addChild(this._btnTakeAllMc);
			// 	this._btnTakeAllMc.touchEnabled = false;
			// 	this._btnTakeAllMc.x = this.bt_takeall.x + 151 / 2;
			// 	this._btnTakeAllMc.y = this.bt_takeall.y + 53 / 2;

			// }
			// this._btnTakeAllMc.visible = false;




		}

		/**
	     * 打开窗口
	    */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			// App.Socket.send(16001,{});
			// if (this._eventid_activity == 0)
			// 	this._eventid_activity = App.EventSystem.addEventListener(PanelNotify.MUSTDO_UPDATEACTIVITY, this.updateActivity, this);

			// if (this._eventid_medal == 0)
			// 	this._eventid_medal = App.EventSystem.addEventListener(PanelNotify.MUSTDO_UPDATEMEDAL, this.updateMedal, this);

			// if (this._eventid_achieve == 0)
			// 	this._eventid_achieve = App.EventSystem.addEventListener(PanelNotify.MUSTDO_UPDATESACHIEVE, this.updateAchieve, this);

			// if (this._eventid_Title == 0)
			// 	this._eventid_Title = App.EventSystem.addEventListener(PanelNotify.MUSTDO_UPDATETITLE, this.updateTitle, this);
			//this.openActivity();
			if (this._activity_view == null) {
				this._activity_view = new ActivityTaskView("ActivityTaskSkin")
				this.addChild(this._activity_view);
			}
			this._activity_view.readyOpen({ data: {} });
			this._curSelView = this._activity_view;
			this._curSelIndex = 1;

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
			// if (this._eventid_activity != 0) {
			// 	App.EventSystem.removeEventListener(PanelNotify.MUSTDO_UPDATEACTIVITY, this._eventid_activity);
			// 	this._eventid_activity = 0;
			// }

			// if (this._eventid_medal != 0) {
			// 	App.EventSystem.removeEventListener(PanelNotify.MUSTDO_UPDATEMEDAL, this._eventid_medal);
			// 	this._eventid_medal = 0;
			// }
			// if (this._eventid_achieve != 0) {
			// 	App.EventSystem.removeEventListener(PanelNotify.MUSTDO_UPDATESACHIEVE, this._eventid_achieve);
			// 	this._eventid_achieve = 0;
			// }
			// if (this._eventid_Title != 0) {
			// 	App.EventSystem.removeEventListener(PanelNotify.MUSTDO_UPDATETITLE, this._eventid_Title);
			// 	this._eventid_Title = 0;
			// }

			// if (this._btnTakeMc) {
			// 	this._btnTakeMc.stop();
			// 	this._btnTakeMc.destroy();
			// 	this._btnTakeMc = null;
			// }

			// if (this._btnTakeAllMc) {
			// 	this._btnTakeAllMc.stop();
			// 	this._btnTakeAllMc.destroy();
			// 	this._btnTakeAllMc = null;
			// }

			// for (let i = 0; i < this.list_chest.length; i++) {

			// 	this.list_chest[i].clearRewardEff();
			// }
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
		}


		private changeMustDoState(index: MustDoType) {

			if (this._curSelIndex == index) {
				return;
			}
			if (this._curSelView) {
				this._curSelView.clear();
			}
			//this._curgroup.visible = false;
			//this._btnTakeMc.stop();
			//this._btnTakeMc.visible = false;
			//this._btnTakeAllMc.stop();
			//this._btnTakeAllMc.visible = false;
			switch (index + 1) {
				// case MustDoType.MEDAL:
				// 	RES.getResAsync("medal_xunzhang_title2_png", (texture) => {
				// 		this.commonWin.img_title.texture = texture;
				// 	}, this);
				// 	if (this._medal_view == null) {
				// 		this._medal_view = new MustDoMedalView("MustDoMedalSkin")
				// 		this.addChild(this._medal_view);
				// 	}
				// 	this._medal_view.readyOpen({ data: {} });
				// 	this._curSelView = this._medal_view;
				// 	//this._curgroup = this.gp_medal;
				// 	//this._curgroup.visible = true;
				// 	//this.openMedal();
				// 	break;
				case MustDoType.ACTIVITY:
					// this._curgroup = this.gp_activity;
					// this._curgroup.visible = true;
					if (this._activity_view == null) {
						this._activity_view = new ActivityTaskView("ActivityTaskSkin")
						this.addChild(this._activity_view);
					}
					this._activity_view.readyOpen({ data: {} });
					this._curSelView = this._activity_view;
					RES.getResAsync("task_meiribizuo_title_png", (texture) => {
						this.commonWin.img_title.texture = texture;
					}, this);

					//this.openActivity();
					break;
				// case MustDoType.ACHIEVE:
				// 	//this._curgroup = this.gp_achieve;
				// 	//this._curgroup.visible = true;
				// 	if (this._achieve_view == null) {
				// 		this._achieve_view = new MustDoAchieveView("MustDoAchieveSkin")
				// 		this.addChild(this._achieve_view);
				// 	}
				// 	this._achieve_view.readyOpen({ data: {} });
				// 	this._curSelView = this._achieve_view;
				// 	RES.getResAsync("task_chengjiu_title_png", (texture) => {
				// 		this.commonWin.img_title.texture = texture;
				// 	}, this);
				// 	break;
				case MustDoType.TITLE:
					if (this._title_view == null) {
						this._title_view = new MustDoTitleView("MustDoTitleSkin")
						this.addChild(this._title_view);
					}
					this._title_view.readyOpen({ data: {} });
					this._curSelView = this._title_view;
					RES.getResAsync("title_chenghao_title_png", (texture) => {
						this.commonWin.img_title.texture = texture;
					}, this);

				//this._curgroup = this.gp_title;
				//this._curgroup.visible = true;
				//this.openTitle();
			}

			//this._curtype = index;
			this._curSelIndex = index;
		}

		//称号系统
		// private openTitle() {
		// 	RES.getResAsync("task_meiribizuo_title_png", (texture) => {
		// 		this.commonWin.img_title.texture = texture;
		// 	}, this);
		// 	App.Socket.send(32001, null);

		// }
		// public updateTitle() {
		// 	this._listtitle.dataProvider = new eui.ArrayCollection(this._mustdomodel.titleList);
		// 	this.lb_totalactivity.text = this._mustdomodel.totalactivity + "";
		// }

		// public lightenProperty() {
		// 	App.WinManager.openWin(WinName.MUSTDO_LIGHTEN);
		// }
		//每日必做
		// private openActivity() {
		// 	RES.getResAsync("task_meiribizuo_title_png", (texture) => {
		// 		this.commonWin.img_title.texture = texture;
		// 	}, this);
		// 	App.Socket.send(18001, null);
		// }

		// public updateActivity() {

		// 	this._listtask.dataProvider = new eui.ArrayCollection(this._mustdomodel.taskList);
		// 	this.pgbar_activity.value = this._mustdomodel.livenessNum; //* 100 / 120.00;
		// 	this.pgbar_activity.maximum = 120;

		// 	for (let i = 0; i < 4; i++) {


		// 		if (i < this._mustdomodel.chestList.length) {

		// 			this.list_chest[i].livenesss = this._mustdomodel.chestList[i].liveness;
		// 			this.list_chest[i].item_id = this._mustdomodel.chestList[i].reward_id;
		// 			this.list_chest[i].item_num = this._mustdomodel.chestList[i].reward_num;
		// 			this.list_chest[i].state = this._mustdomodel.chestList[i].state;
		// 			this.list_chest[i].updateReward();
		// 		}

		// 	}

		// }
		//勋章

		// private openMedal() {

		// 	RES.getResAsync("medal_xunzhang_title2_png", (texture) => {
		// 		this.commonWin.img_title.texture = texture;
		// 	}, this);

		// 	App.Socket.send(19005, null);

		// }

		// public updateMedal() {

		// 	this.lb_power.text = this._mustdomodel.achieve_power + "";
		// 	this.lb_untake.text = this._mustdomodel.achieve_not_get + "";
		// 	this.lb_lv.text = "Lv." + this._mustdomodel.achieve_lv;
		// 	this.pgbar_medalvalue.value = this._mustdomodel.achieve_own;// * 100 / this._mustdomodel.achieve_upgrade;
		// 	this.pgbar_medalvalue.maximum = this._mustdomodel.achieve_upgrade;
		// 	this.lb_pgtext.text = this._mustdomodel.achieve_own + "/" + this._mustdomodel.achieve_upgrade;
		// 	let value = this._mustdomodel.achieve_not_get * 100 / 8000;
		// 	this._btnTakeMc.visible = true;
		// 	if (value >= 0 && value < 25)
		// 		this._btnTakeMc.visible = false;
		// 	if (value >= 25 && value < 50)
		// 		this._btnTakeMc.playMCKey("effcjz01");
		// 	if (value >= 50 && value < 75)
		// 		this._btnTakeMc.playMCKey("effcjz02");
		// 	if (value >= 75 && value < 25)
		// 		this._btnTakeMc.playMCKey("effcjz03");
		// 	if (value >= 100)
		// 		this._btnTakeMc.playMCKey("effcjz04")
		// 	let rankstr: string = "";
		// 	for (let i = 0; i < this._mustdomodel.achieveranklist.length; i++) {
		// 		rankstr += this._mustdomodel.achieveranklist[i].rank_num + "." + this._mustdomodel.achieveranklist[i].name + "  Lv."
		// 			+ this._mustdomodel.achieveranklist[i].lv + "\n";
		// 	}

		// 	let curlv_info = App.ConfigManager.getMedalAttrInfoByLv(this._mustdomodel.achieve_lv);
		// 	if (curlv_info != null) {
		// 		this.lb_hp.text = ConstAttribute.hp + "：" + curlv_info.hp;
		// 		this.lb_attak.text = "攻击：" + curlv_info.ac;
		// 		this.lb_dfphydic.text = ConstAttribute.def + "：" + curlv_info.def;
		// 		this.lb_dfmagic.text = ConstAttribute.sdef + "：" + curlv_info.sdef;
		// 	}

		// 	let nextlv_info = App.ConfigManager.getMedalAttrInfoByLv(this._mustdomodel.achieve_lv + 1);
		// 	if (nextlv_info != null) {

		// 		this.lb_nexthp.text = ConstAttribute.hp + "：" + nextlv_info.hp;
		// 		this.lb_nextak.text = "攻击：" + nextlv_info.ac;
		// 		this.lb_nextdfp.text = ConstAttribute.def + "：" + nextlv_info.def;
		// 		this.lb_nextdfm.text = ConstAttribute.sdef + "：" + nextlv_info.sdef;
		// 	} else {

		// 		this.lb_nexthp.text = "已满级";
		// 		this.lb_nextak.text = "已满级";
		// 		this.lb_nextdfp.text = "已满级";
		// 		this.lb_nextdfm.text = "已满级";
		// 	}
		// }

		// public medalLvUp() {

		// 	if (this._mustdomodel.achieve_own >= this._mustdomodel.achieve_upgrade)
		// 		App.Socket.send(19006, null);
		// }

		// public viewMedalRank() {

		// }
		// public getUnTakeAchieve() {
		// 	App.WinManager.openWin(WinName.MUSTDO_UNTAKE);
		// }
		// public getAchieveWay() {
		// 	let view = new ItemWay(ClientType.BASE_ITEM, 104);
		// 	PopUpManager.addPopUp({ obj: view });
		// }
		//成就
		// private takeAll() {
		// 	App.Socket.send(19003, null);
		// }
		// private openAchieve() {
		// 	App.Socket.send(19001, null);
		// 	RES.getResAsync("task_chengjiu_title_png", (texture) => {
		// 		this.commonWin.img_title.texture = texture;
		// 	}, this);
		// }
		// public updateAchieve() {

		// 	this._listachieve.dataProvider = new eui.ArrayCollection(this._mustdomodel.achievelist);
		// 	this.lb_achievepercent.text = this._mustdomodel.achievepercent + "%";
		// 	this.lb_achievevalue.text = this._mustdomodel.achievevalue + "";
		// 	if (this._mustdomodel.has_can_get) {

		// 		this._btnTakeAllMc.visible = true;
		// 		this._btnTakeAllMc.playMCKey("effanniu");
		// 	}
		// 	else {
		// 		this._btnTakeAllMc.stop();
		// 		this._btnTakeAllMc.visible = false;
		// 	}

		// }
	}



	export class TaskItem extends eui.ItemRenderer {
		public lb_taskname: eui.Label;
		public lb_reward: eui.Label;
		public lb_progress: eui.Label;
		public gp_finish: eui.Group;
		public gp_goto: eui.Group;
		public gp_take: eui.Group;
		public bt_take: eui.Image;
		public bt_goto: eui.Image;
		public tv_data: TaskVo;;

		public constructor() {
			super();
			this.skinName = "MustDoItemSkin";
			this.gp_finish.visible = false;
			this.gp_goto.visible = false;
			this.gp_take.visible = false;

			this.bt_take.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				this.getTaskReward();
			}, this);

			this.bt_goto.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				this.gotoTask();
			}, this);
		}

		public getTaskReward() {
			if (this.tv_data.type == MustDoType.ACTIVITY)
				App.Socket.send(18002, { task_id: this.tv_data.task_id });
			else if (this.tv_data.type == MustDoType.ACHIEVE)
				App.Socket.send(19002, { achieve_id: this.tv_data.task_id });

		}
		public gotoTask() {

		}
		public dataChanged() {

			let tv: TaskVo = this.data as TaskVo;
			this.tv_data = tv;
			this.lb_taskname.text = tv.task_name;
			if (tv.need_num > tv.finish_num)
				this.lb_progress.textFlow = [{ text: tv.finish_num + "", style: { textColor: 0xf10000 } }, { text: "/" + tv.need_num, style: { textColor: 0xffffff } }];
			else
				this.lb_progress.textFlow = [{ text: tv.finish_num + "" }, { text: "/" + tv.need_num, style: { textColor: 0xffffff } }];
			//this.lb_progress.text = tv.finish_num + "/" + tv.need_num;//
			switch (tv.state) {
				case 0:
					this.gp_take.visible = false;
					this.gp_finish.visible = false;
					this.gp_goto.visible = true;
					break;
				case 1:
					this.gp_take.visible = true;
					this.gp_finish.visible = false;
					this.gp_goto.visible = false;
					break;
				case 2:
					this.gp_finish.visible = true;
					this.gp_take.visible = false;
					this.gp_goto.visible = false;
					break;

			}
			let rewardtxt: string = "奖励：";
			for (let i = 0; i < tv.reward_list.length; i++) {
				let info = App.ConfigManager.getItemInfoById(tv.reward_list[i].id);
				rewardtxt += (info.name + "" + tv.reward_list[i].num);
				if (i < tv.reward_list.length - 1)
					rewardtxt += ",";
			}
			this.lb_reward.text = rewardtxt;
			//this.lb_reward.text 
			//this.updateInfo(this.data);
		}
	}






}
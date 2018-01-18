/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 成就界面 2017/06/20.
 */
module game {


    export class MustDoAchieveView extends BaseChildView {

        public lb_achievepercent: eui.Label;
        public lb_achievevalue: eui.Label;
        public scr_achieve: eui.Scroller;
        public bt_takeall: eui.Image;
        private _listachieve: eui.List = new eui.List();
        private _eventid_achieve: number = 0;
        private _mustdomodel: MustDoModel = MustDoModel.getInstance();
        private _btnTakeAllMc: AMovieClip;//一键领取特效

        public constructor(skinName: string) {
            super("MustDoAchieveSkin")
        }

        protected childrenCreated() {
            super.childrenCreated();
            //this.isCreated = true;
            this.scr_achieve.viewport = this._listachieve;
            this.scr_achieve.scrollPolicyH = eui.ScrollPolicy.OFF;
            this._listachieve.itemRenderer = AchieveTaskItem;
            this.bt_takeall.addEventListener(egret.TouchEvent.TOUCH_TAP, this.takeAll, this);

            if (this._btnTakeAllMc == null) {                     //一键领取特效
                this._btnTakeAllMc = new AMovieClip();
                this.addChild(this._btnTakeAllMc);
                this._btnTakeAllMc.touchEnabled = false;
                this._btnTakeAllMc.x = this.bt_takeall.x + 151 / 2;
                this._btnTakeAllMc.y = this.bt_takeall.y + 53 / 2;

            }
            this._btnTakeAllMc.visible = false;

        }

        /**
         * 打开窗口
         */
        public open(openParam: any = null): void {
            super.open(openParam);

            if (this._btnTakeAllMc == null) {                     //一键领取特效
                this._btnTakeAllMc = new AMovieClip();
                this.addChild(this._btnTakeAllMc);
                this._btnTakeAllMc.touchEnabled = false;
                this._btnTakeAllMc.x = this.bt_takeall.x + 151 / 2;
                this._btnTakeAllMc.y = this.bt_takeall.y + 53 / 2;

            }
            this._btnTakeAllMc.visible = false;
            if (this._eventid_achieve == 0)
                this._eventid_achieve = App.EventSystem.addEventListener(PanelNotify.MUSTDO_UPDATESACHIEVE, this.updateAchieve, this);

            App.Socket.send(19001, null);

        }

        /**
         * 清理
         */
        public clear(data: any = null): void {
            super.clear();
            if (this._eventid_achieve != 0) {
                App.EventSystem.removeEventListener(PanelNotify.MUSTDO_UPDATESACHIEVE, this._eventid_achieve);
                this._eventid_achieve = 0;
            }
            if (this._btnTakeAllMc) {
                this._btnTakeAllMc.stop();
                this._btnTakeAllMc.destroy();
                this._btnTakeAllMc = null;
            }
        }
        /**
         * 销毁
         */
        public destroy(): void {
            super.destroy();

        }

        private takeAll() {
            App.Socket.send(19003, null);
        }

        public updateAchieve() {

            this._listachieve.dataProvider = new eui.ArrayCollection(this._mustdomodel.achievelist);
            this.lb_achievepercent.text = this._mustdomodel.achievepercent + "%";
            this.lb_achievevalue.text = this._mustdomodel.achievevalue + "";
            if (this._mustdomodel.has_can_get) {

                this._btnTakeAllMc.visible = true;
                this._btnTakeAllMc.playMCKey("effanniu");
            }
            else {
                this._btnTakeAllMc.stop();
                this._btnTakeAllMc.visible = false;
            }

        }

    }

	export class AchieveTaskItem extends eui.ItemRenderer {
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

			if (this.tv_data.type == MustDoType.ACTIVITY) {
				let info = App.ConfigManager.getTaskDailyInfoById(this.tv_data.task_id);
				MainModuleJump.jumpToModule(info.skip);
			}
			else if (this.tv_data.type == MustDoType.ACHIEVE) {
				let info = App.ConfigManager.getAchieveInfoById(this.tv_data.task_id);
				MainModuleJump.jumpToModule(info.skip);

			}
		}
		public dataChanged() {

			let tv: TaskVo = this.data as TaskVo;
			this.tv_data = tv;
			this.lb_taskname.text = tv.task_name;
			if (tv.need_num > tv.finish_num)
				this.lb_progress.textFlow = [{ text: tv.finish_num + "", style: { textColor: 0xf10000 } }, { text: "/" + tv.need_num, style: { textColor: 0xffffff } }];
			else
				this.lb_progress.textFlow = [{ text:  tv.need_num + "" }, { text: "/" + tv.need_num, style: { textColor: 0xffffff } }];//超过上限的显示为上限
			//this.lb_progress.text = tv.finish_num + "/" + tv.need_num;//
			if (tv.state == 2) {
				this.lb_progress.text = "";
			}
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
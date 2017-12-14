/**
 * Author: lihe
 * Email： hersletter@qq.com
 *勋章模块界面逻辑 2017/06/20.
 */
module game {

	// export class MyTabbar extends eui.TabBar
	// {
	// 	public setTapTabBar(index:number){
	//        this.setSelectedIndex(index,true);
	// 	}
	// }
	export class MetalView extends BaseView {
		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
		}

		// bg
		public commonWin: customui.CommonWin;
		public bt_back: eui.Image;
		public tab_medal: eui.TabBar;
		public gp_activity: eui.Group;
		public gp_medal: eui.Group;
		public gp_achieve: eui.Group;
		public gp_title: eui.Group;
		//private _curtype = 1;
		private _curgroup: eui.Group;
		private _mustdomodel: MustDoModel = MustDoModel.getInstance();
		public rb_achieve: eui.RadioButton;
		public rb_medal: eui.RadioButton;
	
		private _medal_view: MustDoMedalView;
		private _achieve_view: MustDoAchieveView;
		private _curSelView: BaseChildView;
		private _curSelIndex: number = 0;
		

		protected childrenCreated() {
			super.childrenCreated();

			this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				App.WinManager.closeWin(WinName.METAL);
			}, this);
			this.bt_back.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				App.WinManager.closeWin(WinName.METAL);
			}, this);
			this.initView();

		}

		protected initBtnTips() {
			App.BtnTipManager.addBtnTipItem(ConstBtnTipType.TASK_MEDAL, this.rb_medal);
			//App.BtnTipManager.addBtnTipItem(ConstBtnTipType.TASK_DAILY, this.rb_mustdo);
			App.BtnTipManager.addBtnTipItem(ConstBtnTipType.TASK_ACHIEVE, this.rb_achieve);
		}

		private initView() {
			
			this.initBtnTips();

			var radioGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup();
			radioGroup.addEventListener(eui.UIEvent.CHANGE, (evt: eui.UIEvent) => {
				var radioGroup: eui.RadioButtonGroup = evt.target;
				this.changeMustDoState(radioGroup.selectedValue);
			}, this);
			
			this.rb_achieve.group = radioGroup;
			this.rb_achieve.label = "成就";
			this.rb_achieve.value = 2;
			this.rb_medal.group = radioGroup;
			this.rb_medal.label = "勋章";
			this.rb_medal.value = 0;
            this.rb_medal.selected = true;

			// this.tab_medal.validateNow();
			// this.tab_medal.addEventListener(eui.UIEvent.CREATION_COMPLETE, this._onCreatComplete, this)

		}

		/**
	     * 打开窗口
	    */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			
			if (this._medal_view == null) {
				this._medal_view =  new MustDoMedalView("MustDoMedalSkin");
				this.addChild(this._medal_view);
			}
			this._medal_view.readyOpen({ data: {} });
			this._curSelView = this._medal_view;
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
			
			switch (index + 1) {
				case MustDoType.MEDAL:
					RES.getResAsync("medal_xunzhang_title2_png", (texture) => {
						this.commonWin.img_title.texture = texture;
					}, this);
					if (this._medal_view == null) {
						this._medal_view = new MustDoMedalView("MustDoMedalSkin")
						this.addChild(this._medal_view);
					}
					this._medal_view.readyOpen({ data: {} });
					this._curSelView = this._medal_view;
					
					break;
			
				case MustDoType.ACHIEVE:
					//this._curgroup = this.gp_achieve;
					//this._curgroup.visible = true;
					if (this._achieve_view == null) {
						this._achieve_view = new MustDoAchieveView("MustDoAchieveSkin")
						this.addChild(this._achieve_view);
					}
					this._achieve_view.readyOpen({ data: {} });
					this._curSelView = this._achieve_view;
					RES.getResAsync("task_chengjiu_title_png", (texture) => {
						this.commonWin.img_title.texture = texture;
					}, this);
					break;
				

				//this._curgroup = this.gp_title;
				//this._curgroup.visible = true;
				//this.openTitle();
			}

			//this._curtype = index;
			this._curSelIndex = index;
		}

	
	}



}
/**
 * module : 锻造模块视图
 * author ：zrj
*/
module game {
	export class ForgeView extends BaseView {
		public gp_main: eui.Group;
		public headComponent: game.HeroHeadComponentView;
		public rb_strength: eui.RadioButton;
		public rb_star: eui.RadioButton;
		public gp_cap: eui.Group;
		public gp_sub: eui.Group;
		public bmlb_cap: eui.BitmapLabel;
		public btn_return : eui.Button;
		public com_baseview: ComBaseViewBg;
		public gp_tab: eui.Group;
		private _strengthView: ForgeStrengthView;
		private _starView: ForgeStarView;
		private _curSelView: any;
		private _curSelIndex: number = 0;
		private _radioGroup : eui.RadioButtonGroup;

		private _equipStarArray: Array<customui.BaseItem> = []; //升星数组
		private _type: number = 1; //窗口类型
		private heroModel: HeroModel = HeroModel.getInstance();
		private forgeModel: ForgeModel = ForgeModel.getInstance();
		private backpackModel: BackpackModel = BackpackModel.getInstance();

		private img_select: eui.Image;  //选中框
		private _handleId: number = 0;  //动画效果id
		private _mc: EffectMovieClip; //动画特效
		// private _equipMC: EffectMovieClip; //装备部位动画特效
		private _curPos: number;
		private _starCostId: number; //升星消耗物品id
		private _starCostNum: number; //升星消耗物品Num
		private _lastModule: string;
		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.initView();
		}


		private initView() {
			this.btn_return.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
				App.WinManager.closeWin(WinName.FORGE);
			},this);
			var radioGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup();
			this._radioGroup = radioGroup;
			radioGroup.addEventListener(eui.UIEvent.CHANGE, (evt: eui.UIEvent) => {
				var radioGroup: eui.RadioButtonGroup = evt.target;
				this.updateForgeView(radioGroup.selectedValue);
			}, this);

			this.rb_strength.group = radioGroup;
			this.rb_strength.value = 1;
			this.rb_strength.label = "强化";
			this.rb_strength.selected = true;
			this.rb_star.group = radioGroup;
			this.rb_star.label = "升星";
			this.rb_star.value = 2;
			//初始化动画
			this._mc = new EffectMovieClip();
			this._mc.x = 115;
			this._mc.y = 35;
			this._mc.playMCKey("effjspf", "", -1, null, () => {
				this._mc.frameRate = 10;
			}, null, this);
			console.log(this._mc.frameRate);
			this.gp_cap.addChildAt(this._mc,1);
			
			// //默认选强化
			// this.updateForgeView(1);
			this.validateNow();
		}

		private updateForgeView(index: number) {
			if (this._curSelIndex == index) {
				return;
			}
			if (this._curSelView) {
				this._curSelView.clear();
			}
			if (index == 1) {

				if (this._strengthView == null) {
					this._strengthView = new ForgeStrengthView("ForgeStrengthSkin");
					this.gp_sub.addChild(this._strengthView);
				}
				this._strengthView.readyOpen({ data: {} });
				this._curSelView = this._strengthView;

			} else if (index == 2) {

				if (this._starView == null) {
					this._starView = new ForgeStarView("ForgeStarSkin");
					this.gp_sub.addChild(this._starView);
				}
				this._starView.readyOpen({ data: {} });
				this._curSelView = this._starView;
			}
			
			this._curSelIndex = index;
			this._type = index;
			this.updateView();
		}
		//红点显示
		private checkRedDot(viewNum) {
			this.headComponent.clearAllRedTips();
			if (viewNum == 1) { //强化
				this.forgeModel.strengthHeroRedDot.forEach((value, index, array) => {
					this.headComponent.setRedTips(index, value);
				}, this)
			} else {
				this.forgeModel.starHeroRedDot.forEach((value, index, array) => {
					this.headComponent.setRedTips(index, value);
					this._curSelView.checkRedDot(this.heroModel.curPos);
					// for (let i = 1; i <= 10; i++) {
					// 	let show = this.forgeModel.checkCanStarupByPart(this.heroModel.curPos, i);
					// 	if (show) {
					// 		this._equipStarArray[i - 1].showRedTips(null);
					// 	} else {
					// 		this._equipStarArray[i - 1].hideRedTips();
					// 	}
					// }
				}, this)

			}
			HeroModel.getInstance().checkNewPartner();
			if (this.heroModel.heroHeadFrame[0]) {
					this.headComponent.setNewPartnerTip(0, true);
				} else {
					this.headComponent.setNewPartnerTip(0, false);
				}
				if (this.heroModel.heroHeadFrame[1]) {
					this.headComponent.setNewPartnerTip(1, true);
				} else {
					this.headComponent.setNewPartnerTip(1, false);
				}
		}

		private onShowStrength() {
			if (this._curSelView) {
				this._curSelView.updateView();
				this._type = 1;
				this.checkRedDot(1);
			}
		}

		private onShowStar() {
			if (this._curSelView) {
				// this.updateStarView();
				this._curSelView.updateView();
				this._type = 2;
				this.checkRedDot(2);
			}
		}

		public updateView() {
			if (!this.visible) {
				return;
			}
			// this.updateEquip();
			if (this._type == 1) {
				this.onShowStrength();
			} else if (this._type == 2) {
				this.onShowStar();
			}
			this.bmlb_cap.text = this.heroModel.heroInfo[this.heroModel.curPos].score+"";
		}

		public checkGuide() {
			// App.GuideManager.bindClickBtn(this.img_all, 1009, 2);
			//		App.GuideManager.bindClickBtn(this.commonWin.img_close, 1009, 3);
			App.GuideManager.checkGuide(1009);
		}

		public removeGuide() {
			App.GuideManager.removeClickBtn(1009, 2);
			App.GuideManager.removeClickBtn(1009, 3);
		}

		/**
		 * 打开窗口
		 * param.type : 默认是1强化，传2是升星
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			if (openParam && openParam.type) {
				this._type = openParam.type;
				this.updateForgeView(this._type);
				this.headComponent.open(openParam);
			} else {
				this._type = 1;
				this.updateForgeView(this._type);
				this.headComponent.open(openParam);
			}
			this._radioGroup.selectedValue = this._type;
			if (openParam && openParam.lastModule) {
				this._lastModule = openParam.lastModule;
			}
			if (!this._handleId) {
				this._handleId = App.EventSystem.addEventListener(PanelNotify.HERO_ON_HERO_SELECT, this.updateView, this);
			}
			// App.EventSystem.addEventListener(PanelNotify.FORGE_STRENGTH_EQUIP, this.animationStrength, this);
			// App.EventSystem.addEventListener(PanelNotify.FORGE_STAR_EQUIP, this.animationStar, this);
			if(this.com_baseview){
				this.com_baseview.winVo = this.winVo;
			}
			this.headComponent.readyOpen();
			this.checkGuide();
		}

		/**
		 * 关闭窗口
		 */
		public closeWin(callback): void {
			super.closeWin(callback);
			// this.forgeModel.curPart = undefined;
		}

		/**
		 * 清理
		 */
		public clear(data: any = null): void {
			super.clear(data);
			if (this._handleId) {
				App.EventSystem.removeEventListener(PanelNotify.HERO_ON_HERO_SELECT, this._handleId);
				this._handleId = undefined;
			}
			// App.EventSystem.removeEventListener(PanelNotify.FORGE_STRENGTH_EQUIP);
			// App.EventSystem.removeEventListener(PanelNotify.FORGE_STAR_EQUIP);
			this.headComponent.clear();
			if (this.com_baseview) {
				this.com_baseview.destroy();
			}
			this._curSelIndex = 0;
			this._lastModule = undefined;
			this.removeGuide();
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			this._mc.destroy();
		}
	}
}
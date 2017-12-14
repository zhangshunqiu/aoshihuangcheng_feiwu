/**
* module : 神器模块
* author : zrj
*/
module game {
	export class ArtifactView extends BaseView {
		public gp_main: eui.Group;
		public commonWin: customui.CommonWin;
		public lb_name: eui.Label;
		public lb_desc: eui.Label;
		public gp_attr: eui.Group;
		public lb_attr: eui.Label;
		public lb_attr_next: eui.Label;
		public gp_cost: eui.Group;
		public lb_cost: eui.Label;
		public lb_get: eui.Label;
		public btn_upgrade: eui.Button;
		public scroller: eui.Scroller;
		public img_return: eui.Image;
		public img_close: eui.Image;
		public gp_effect: eui.Group;
		public img_txt: eui.Image;
		public list: eui.List = new eui.List();


		private _updateHandleId: number;
		private _handleId: number;
		private _originArray: eui.ArrayCollection; //原始数组
		private _curIndex: number = 0;
		private _costId: number = 0; //消耗物品id
		private _career: number = 1; //默认战士
		private _curArtifact: any;  //当前信息
		private _effectMC: EffectMovieClip;

		private artifactModel: ArtifactModel = ArtifactModel.getInstance();
		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.initView();
		}

		private initView() {
			this._effectMC = new EffectMovieClip();
			this._effectMC.x = 125;
			this._effectMC.y = 150;
			this.gp_effect.addChild(this._effectMC);
			this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				App.WinManager.closeWin(WinName.ARTIFACT);
			}, this);
			this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeView, this);
			this.lb_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showWay, this);
			this.lb_get.textFlow = [{ text: "获取道具", style: { underline: true, textColor: 0x00f829 } }];
			this.btn_upgrade.addEventListener(egret.TouchEvent.TOUCH_TAP, this.artifactUpgrade, this);

			this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
			this.scroller.viewport = this.list;
			this.list.itemRenderer = ArtifactItem;

			this._originArray = new eui.ArrayCollection(App.ConfigManager.getArtifactArray());
			this.list.dataProvider = this._originArray;
			this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTap, this);
			this.list.requireSelection = true;
			this.list.selectedIndex = 0;

			this.floatEffect();
			this.updateView();
			this.validateNow();
		}

		//漂浮特效
		private floatEffect() {
			// egret.Tween.get(this.gp_effect, { loop: true }).to({ y: 80 }, 1000).to({ y: 40 }, 1800).to({ y: 60 }, 1000);
		}

		private itemTap(event: eui.ItemTapEvent) {
			if (event.itemIndex != this._curIndex) {
				this._curIndex = event.itemIndex;
				this.updateView();
				this.list.selectedIndex = event.itemIndex;
			}
		}

		private updateView() {
			this._originArray.refresh();
			let artifactInfo = undefined;
			let isActive = false;
			if (this.artifactModel.artifactList[this._curIndex]) { //激活了
				artifactInfo = App.ConfigManager.getArtifactInfoById(this.artifactModel.artifactList[this._curIndex]);
				isActive = true;
				RES.getResAsync("wing_txt_shengjie_png", (texture) => {
					this.img_txt.source = texture;
				}, this)
			} else { //未激活
				artifactInfo = this._originArray.getItemAt(this._curIndex);
				RES.getResAsync("equip_sp_txt_jihuo_png", (texture) => {
					this.img_txt.source = texture;
				}, this)
			}
			this._curArtifact = artifactInfo;

			this.lb_name.text = artifactInfo.name;

			let textArray = [];
			if (this._career == CareerType.SOLDIER) {
				if (artifactInfo["ac"] != 0) {
					textArray.push({ text: "攻击：" + artifactInfo["ac"] });
					textArray.push({ text: "\n" });
				}
			} else if (this._career == CareerType.MAGES) {
				if (artifactInfo["mac"] != 0) {
					textArray.push({ text: "攻击：" + artifactInfo["mac"] });
					textArray.push({ text: "\n" });
				}
			} else if (this._career == CareerType.TAOIST) {
				if (artifactInfo["sc"] != 0) {
					textArray.push({ text: "攻击：" + artifactInfo["sc"] });
					textArray.push({ text: "\n" });
				}
			}
			if (artifactInfo["hp"] != 0) {
				textArray.push({ text: ConstAttribute["hp"] + "：" + artifactInfo["hp"] });
				textArray.push({ text: "\n" });
			}
			if (artifactInfo["def"] != 0) {
				textArray.push({ text: ConstAttribute["def"] + "：" + artifactInfo["def"] });
				textArray.push({ text: "\n" });
			}
			if (artifactInfo["sdef"] != 0) {
				textArray.push({ text: ConstAttribute["sdef"] + "：" + artifactInfo["sdef"] });
				textArray.push({ text: "\n" });
			}
			if (artifactInfo["hit"] != 0) {
				textArray.push({ text: ConstAttribute["hit"] + "：" + artifactInfo["hit"] });
				textArray.push({ text: "\n" });
			}
			if (artifactInfo["dodge"] != 0) {
				textArray.push({ text: ConstAttribute["dodge"] + "：" + artifactInfo["dodge"] });
				textArray.push({ text: "\n" });
			}
			if (artifactInfo["crit"] != 0) {
				textArray.push({ text: ConstAttribute["crit"] + "：" + artifactInfo["crit"] });
				textArray.push({ text: "\n" });
			}
			if (artifactInfo["rcrit"] != 0) {
				textArray.push({ text: ConstAttribute["rcrit"] + "：" + artifactInfo["rcrit"] });
				textArray.push({ text: "\n" });
			}

			if (isActive) {
				if (artifactInfo.next_id) {
					let nextInfo = App.ConfigManager.getArtifactInfoById(artifactInfo.next_id);
					let textArrayNext = [];
					if (this._career == CareerType.SOLDIER) {
						if (artifactInfo["ac"] != 0) {
							textArrayNext.push({ text: "攻击：" + nextInfo["ac"] });
							textArrayNext.push({ text: "\n" });
						}
					} else if (this._career == CareerType.MAGES) {
						if (nextInfo["mac"] != 0) {
							textArrayNext.push({ text: "攻击：" + nextInfo["mac"] });
							textArrayNext.push({ text: "\n" });
						}
					} else if (this._career == CareerType.TAOIST) {
						if (nextInfo["sc"] != 0) {
							textArrayNext.push({ text: "攻击：" + nextInfo["sc"] });
							textArrayNext.push({ text: "\n" });
						}
					}
					if (nextInfo["hp"] != 0) {
						textArrayNext.push({ text: ConstAttribute["hp"] + "：" + nextInfo["hp"] });
						textArrayNext.push({ text: "\n" });
					}
					if (nextInfo["def"] != 0) {
						textArrayNext.push({ text: ConstAttribute["def"] + "：" + nextInfo["def"] });
						textArrayNext.push({ text: "\n" });
					}
					if (nextInfo["sdef"] != 0) {
						textArrayNext.push({ text: ConstAttribute["sdef"] + "：" + nextInfo["sdef"] });
						textArrayNext.push({ text: "\n" });
					}
					if (nextInfo["hit"] != 0) {
						textArrayNext.push({ text: ConstAttribute["hit"] + "：" + nextInfo["hit"] });
						textArrayNext.push({ text: "\n" });
					}
					if (nextInfo["dodge"] != 0) {
						textArrayNext.push({ text: ConstAttribute["dodge"] + "：" + nextInfo["dodge"] });
						textArrayNext.push({ text: "\n" });
					}
					if (nextInfo["crit"] != 0) {
						textArrayNext.push({ text: ConstAttribute["crit"] + "：" + nextInfo["crit"] });
						textArrayNext.push({ text: "\n" });
					}
					if (nextInfo["rcrit"] != 0) {
						textArrayNext.push({ text: ConstAttribute["rcrit"] + "：" + nextInfo["rcrit"] });
						textArrayNext.push({ text: "\n" });
					}

					textArray.pop();
					textArrayNext.pop();
					this.lb_attr.textFlow = textArray;
					this.lb_attr_next.textFlow = textArrayNext;
					this.lb_cost.visible = true;
				} else {
					textArray.pop();
					this.lb_attr.textFlow = textArray;
					this.lb_attr_next.text = "已满阶";
					this.lb_cost.visible = false;
				}
			} else {
				// let textArrayL = [];
				// textArrayL.push({ text: "攻击：0" + "\n" });
				// textArrayL.push({ text: ConstAttribute["hp"] + "：" + "0" + "\n" });
				// textArrayL.push({ text: ConstAttribute["def"] + "：" + "0" + "\n" });
				// textArrayL.push({ text: ConstAttribute["sdef"] + "：" + "0" });
				// this.lb_attr.textFlow = textArrayL;
				textArray.pop();
				this.lb_attr_next.textFlow = textArray;
				this.lb_attr.text = "未激活";
			}
			this.lb_desc.text = "";
			for (let key in ConstArtifactEffect) {
				if (artifactInfo[key] != 0) {
					this.lb_desc.textFlow = [{ text: "神器特效：", style: { textColor: 0xf87500 } }, { text: ConstArtifactEffect[key] + "+" + artifactInfo[key] / 100 + "%" }];
					break;
				}
			}

			let costInfo = artifactInfo.item[0];
			let costItem = App.ConfigManager.getItemInfoById(costInfo[1]);
			let itemInfo = BackpackModel.getInstance().getItemByTypeIdUuid(costInfo[0], costInfo[1]);
			this._costId = costInfo[1];
			if (!itemInfo) {
				itemInfo = { num: 0 };
			}
			if (itemInfo.num >= costInfo[2]) { //足够
				this.lb_cost.textFlow = [{ text: "消耗" }, { text: costItem.name, style: { textColor: ConstTextColor[costItem.quality] } }, { text: "：" },
				{ text: String(itemInfo.num), style: { textColor: 0x63d72a } }, { text: "/" + costInfo[2], style: { textColor: 0xbfbfbf } }]
			} else {
				this.lb_cost.textFlow = [{ text: "消耗" }, { text: costItem.name, style: { textColor: ConstTextColor[costItem.quality] } }, { text: "：" },
				{ text: String(itemInfo.num), style: { textColor: 0xb90b0a } }, { text: "/" + costInfo[2], style: { textColor: 0xbfbfbf } }]
			}
			this._effectMC.playMCKey(this._curArtifact.effects, "", -1, null, () => {
				this._effectMC.frameRate = 8;
			}, null, this);

		}

		private artifactUpgrade() {
			if (this.artifactModel.artifactList[this._curIndex]) {
				App.Socket.send(33003, { id: this._curArtifact.id });
			} else {
				App.Socket.send(33002, { type: this._curArtifact.type });
			}
		}

		private closeView() {
			App.WinManager.closeWin(WinName.ARTIFACT);
			App.WinManager.openWin(WinName.HERO);
		}

		private showWay() {
			App.GlobalTips.showItemWayTips(ClientType.BASE_ITEM, this._costId);
		}

		public checkGuide() {
			App.GuideManager.bindClickBtn(this.btn_upgrade,1019,2);
			App.GuideManager.bindClickBtn(this.img_close,1019,3);
			App.GuideManager.checkGuide(1019);
		}

		public removeGuide() {
			App.GuideManager.removeClickBtn(1019,2);
		}

		/**
		 * 打开窗口
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			if (openParam && openParam.career) {
				this._career = openParam.career;
			}
			if (!this._handleId) {
				this._handleId = App.EventSystem.addEventListener(PanelNotify.ARTIFACT_UPGRADE_BACK, this.updateView, this);
			}
			if (!this._updateHandleId) {
				this._updateHandleId = App.EventSystem.addEventListener(PanelNotify.ARTIFACT_UPDATE_VIEW, this.updateView, this);
			}
			App.Socket.send(33001, {});
			this.checkGuide();
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
			if (this._handleId) {
				App.EventSystem.removeEventListener(PanelNotify.ARTIFACT_UPGRADE_BACK, this._handleId);
				this._handleId = undefined;
			}
			if (this._updateHandleId) {
				App.EventSystem.removeEventListener(PanelNotify.ARTIFACT_UPDATE_VIEW, this._updateHandleId);
				this._updateHandleId = undefined;
			}
			this.removeGuide();
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
			this._effectMC.destroy();
		}
	}

	class ArtifactItem extends eui.ItemRenderer {
		public img_icon: eui.Image;
		public img_arrow: eui.Image;
		public img_bg: eui.Image;
		public lb_tip: eui.Label;
		public lb_name: eui.Label;
		public lb_level: eui.Label;

		private artifactModel: ArtifactModel = ArtifactModel.getInstance();
		public constructor() {
			super();
			this.skinName = "ArtifactItemSkin";
		}

		protected dataChanged() {
			let info = this.data;
			if (this.artifactModel.artifactList[this.itemIndex]) { //激活了
				info = App.ConfigManager.getArtifactInfoById(this.artifactModel.artifactList[this.itemIndex]);
				this.lb_tip.visible = false;
				RES.getResAsync(info.icon + "_png", (texture) => {
					this.img_icon.source = texture;
				}, this)
				this.lb_level.text = info.level + "阶";
			} else {
				this.lb_tip.text = info.des;
				this.lb_tip.visible = true;
				RES.getResAsync(info.icon + "_hui_png", (texture) => {
					this.img_icon.source = texture;
				}, this)
				this.lb_level.text = "";
			}

			if (this.selected) { //选择当前
				this.img_arrow.visible = true;
				// App.logzrj("select ",this.itemIndex);
			} else {
				this.img_arrow.visible = false;
				// App.logzrj("unselect ",this.itemIndex);
			}

			RES.getResAsync(ConstArtifactQuality[info.quality], (texture) => {
				this.img_bg.source = texture;
			}, this)

			// this.lb_level.text = info.level + "阶";
			this.lb_name.text = info.name;
			this.lb_name.textColor = ConstTextColor[info.quality];
		}

	}

}
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 窗口基类背景皮肤
 */
class ComBaseViewBg extends eui.Component {
	private img_winTitle: eui.Image;
	private lb_winCoin: eui.Label;
	private lb_winGold: eui.Label;
	private btn_winCoin: eui.Button;
	private btn_winGold: eui.Button;
	private btn_winClose: eui.Button;
	private _winVo: WinManagerVO;
	private _wealthEventId: number = 0;

	public constructor(params:any) {
		super();
		this.skinName = "ComBaseViewBgSkin";
	}

	protected childrenCreated() {
		super.childrenCreated();
		if (this.hasEventListener(egret.Event.REMOVED_FROM_STAGE) == false) {
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		}
		this.btn_winCoin.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
			App.GlobalTips.showItemWayTips(0, 101);
		}, this);
		this.btn_winGold.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
			game.RechargeOpenManager.getInstance().openRechargeView();
		}, this);
		// egret.callLater(() => {
		// 	this.mask = new egret.Rectangle(0, 0, this.width, this.height);
		// }, this);
		if(this._winVo){
			this.setTitleSource(this._winVo.title);
		}
		this.updateWealthInfo();
	}
	/**
	 * 设置串口VO，必须要设置
	 */
	public set winVo(value:WinManagerVO){
		this._winVo = value;
		if (this._wealthEventId == 0) {
			this._wealthEventId = App.EventSystem.addEventListener(PanelNotify.PLAYER_UPDATE_PLAYER_INFO, this.updateWealthInfo, this);
		}
		if(this._winVo){
			this.setTitleSource(this._winVo.title);
		}
		//this.updateWealthInfo();
	}

	public setTitleSource(title:any) {
		if (title && title != "" && this.img_winTitle) {
			this.img_winTitle.source = title;
			
		}
	}

	public clear() {
		if (this.hasEventListener(egret.Event.REMOVED_FROM_STAGE)) {
			this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		}
		if (this._wealthEventId != 0) {
			App.EventSystem.removeEventListener(PanelNotify.PLAYER_UPDATE_PLAYER_INFO, this._wealthEventId);
			this._wealthEventId = 0;
		}
	}

	public destroy() {
		this.clear();
	}
	
	private updateWealthInfo() {
		if (this.lb_winCoin) {
			this.lb_winCoin.text = GlobalUtil.fixNum(App.RoleManager.roleWealthInfo.coin);
		}
		if (this.lb_winGold) {
			this.lb_winGold.text = GlobalUtil.fixNum(App.RoleManager.roleWealthInfo.gold);
		}
	}
	private onRemoveFromStage() {
		this.destroy();
	}
}

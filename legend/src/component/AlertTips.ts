
// 通用tips弹框基类
class AlertTips extends BaseView {
	public gp_root: eui.Group;
	public gp_btn: eui.Group;
	public lb_content: eui.Label;
	public img_content_bg: eui.Image;
	public lb_title: eui.Label;
	public cbox: eui.CheckBox;

	private _okBtn:eui.Button;
	private _canelBtn:eui.Button;
	private _timeEventId:number = 0;

	private _style: number = AlertTipsStyle.COMMON;// AlertTipsStyle;
	private _textFlow: Array<any>;
	private _content: string;
	private _okCB: Function;
	private _cancelCB: Function;
	private _cbThisObject: any
	private _okLab: string = "确 定";
	private _canelLab: string = "取 消";
	private _needCheckBox: Boolean = false;
	private _title: string = "提 示";
	private _contentStyle: number = 1;

	private _okCdTime: number = 0;

	/**
	 * style:样式
	 * textFlow:有这个就不会处理content
	 * content:字符串内容
	 * okCB:点击ok的cb
	 * cancelCB:点击cancel的cb
	 * cbThisObject:回掉函数对象上下文
	 * okLab:确定按钮文本
	 * canelLab：取消按钮文本
	 * okCdTime：确定按钮倒计时时间（秒）
	 * needCheckBox:是否需要CheckBox
	 * title : 提示框标题 传图片资源名
	 * contentStyle:文字内容是否居中 1:left 2:center 3:right
	 */
	public constructor(viewConf: WinManagerVO = null) {
		super(viewConf);
	}

	protected childrenCreated() {
		super.childrenCreated();
	}

	private initView() {
		this.cbox.visible = false;
		(<eui.Label>this.cbox.labelDisplay).textColor = 0x9b7c2c;
		if (this.lb_title) {
			this.lb_title.text = this._title;
		}
		switch (this._style) {
			case AlertTipsStyle.COMMON:
				this._canelBtn = new eui.Button();
				this._canelBtn.skinName = "skins.ComBtnRedSkin";
				//this._canelBtn.currentState = "up";
				this._canelBtn.label = this._canelLab;//"取 消"
				this.gp_btn.addChild(this._canelBtn);
				//UIActionManager.bindClickAction(this._canelBtn);
				this._canelBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCanelClick, this);
			default:
				this._okBtn = new eui.Button();
				this._okBtn.skinName = "skins.ComBtnRedSkin";
				//this._okBtn.currentState = "up";
				if(this._okCdTime>0){
					this._okBtn.label = this._okLab+"("+this._okCdTime+"S)";
				}else{
					this._okBtn.label = this._okLab;//"确 定"
				}
				this.gp_btn.addChild(this._okBtn);
				//UIActionManager.bindClickAction(this._okBtn);
				this._okBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOKClick, this);
				break
		}

		let layout = new eui.HorizontalLayout();
		layout.horizontalAlign = egret.HorizontalAlign.CENTER;
		layout.verticalAlign = egret.VerticalAlign.MIDDLE;
		layout.gap = 150;
		this.gp_btn.layout = layout;

		// 内容
		if (this._textFlow) {
			this.lb_content.textFlow = [{ text: "    " }].concat(this._textFlow);
		} else {
			this.lb_content.text = "    " + this._content;
		}

		let extHeight = 0;
		if (this._needCheckBox) {
			this.cbox.visible = true;
			// this.lb_content.verticalCenter = undefined;
			// this.lb_content.top = 110;
			// extHeight = 35;
		} else {
			this.cbox.visible = false;
			// this.lb_content.verticalCenter = 0;
		}
		// //文字内容是否居中
		switch (this._contentStyle) {
			case 1:
				this.lb_content.textAlign = "left";
				break;
			case 2:
				this.lb_content.textAlign = "cneter";
				break;
			case 3:
				this.lb_content.textAlign = "right";
				break;
		}
		// // this.gp_root.height = 220 + this.lb_content.numLines*(this.lb_content.size+this.lb_content.lineSpacing);
		// egret.setTimeout(() => {
		// 	this.gp_root.height = 235 + this.lb_content.height + extHeight;
		// }, this, 50);
	}

	private onOKClick(): void {
		this.closeWin();
		if (this._okCB) {
			this._okCB.call(this._cbThisObject, this.cbox.selected);
		}
	}

	private onCanelClick(): void {
		this.closeWin();
		if (this._cancelCB) {
			this._cancelCB.call(this._cbThisObject);
		}
	}
	/**
	 * 打开窗口
	 */
	public openWin(params: any = null): void {
		super.openWin(params);
		if (params.style != undefined) {
			this._style = params.style;
		}
		if (params.textFlow) {
			this._textFlow = params.textFlow;
		} else {
			this._content = params.content;
		}
		if (params.title) {
			this._title = params.title;
		}
		if (params.contentStyle) {
			this._contentStyle = params.contentStyle;
		}
		if (params.okCB) {
			this._okCB = params.okCB;
		}
		if (params.cancelCB) {
			this._cancelCB = params.cancelCB;
		}
		if (params.context) {
			this._cbThisObject = params.context;
		}
		if (params.cbThisObject) {
			this._cbThisObject = params.cbThisObject;
		}
		if (params.okLab) {
			this._okLab = params.okLab;
		}
		if (params.canelLab) {
			this._canelLab = params.canelLab;
		}
		this._needCheckBox = params.needCheckBox;

		this.initView();
		if (params.okCdTime) {
			this._okCdTime = params.okCdTime;
			if(this._okCdTime >0){
				if(this._timeEventId != 0){
					App.GlobalTimer.remove(this._timeEventId);
					this._timeEventId = 0;
				}
				if(this._timeEventId == 0){
					this._timeEventId = App.GlobalTimer.addSchedule(1000,-1,this.onUpdateTime,this);
				}
			}
		}
	}

	private onUpdateTime(){
		this._okCdTime--;
		if(this._okCdTime <=0){
			if(this._timeEventId != 0){
				App.GlobalTimer.remove(this._timeEventId);
				this._timeEventId = 0;
			}
			this.onOKClick();
		}
		if(this._okBtn){
			this._okBtn.label = this._okLab+"("+this._okCdTime+"S)";
		}
	}

	/**
	 * 关闭窗口
	 */
	public closeWin(): void {
		super.closeWin();
	}

	/**
	 * 清理
	 */
	public clear(data: any = null): void {
		super.clear(data);
		this._cbThisObject = null;
		this._okCB = null;
		this._cancelCB = null;
		this._okCdTime = 0;
		if(this._timeEventId != 0){
			App.GlobalTimer.remove(this._timeEventId);
			this._timeEventId = 0;
		}
	}
	/**
	 * 销毁
	 */
	public destroy(): void {
		super.destroy();
	}
}
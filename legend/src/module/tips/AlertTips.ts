/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 弹框提示信息
 */
class AlertTips extends eui.Component {
	public gp_root: eui.Group;
	public gp_btn: eui.Group;
	public lb_content: eui.Label;
	public img_content_bg: eui.Image;
	public img_title: eui.Image;
	public cbox: eui.CheckBox;
	protected style: BaseTipsStyle;
	protected needCheckBox: Boolean;
	protected cbs: any;
	protected content: string;
	protected textFlow: Array<any>;

	/**
	 * style:样式
	 * textFlow:有这个就不会处理content
	 * content:字符串内容
	 * okCB:点击ok的cb
	 * cancelCB:点击cancel的cb
	 * context:上下文
	 * needCheckBox:是否需要CheckBox
	 * title : 提示框标题 传图片资源名
	 */
	public constructor(params: any) {
		super();
		this.skinName = "BaseTipsSkin";

		if (params.style != undefined) {
			this.style = params.style;
		} else {
			this.style = BaseTipsStyle.COMMON;
		}

		if (params.textFlow) {
			this.textFlow = params.textFlow;
		} else {
			this.content = params.content;
		}

		if (params.title) {
			RES.getResAsync(params.title,(texture)=>{
				if (texture) {
					this.img_title.source = texture;
				}
			},this);
		}

		this.cbs = {};
		this.cbs["okCB"] = params.okCB;
		this.cbs["cancelCB"] = params.cancelCB;
		this.cbs["context"] = params.context;

		this.needCheckBox = params.needCheckBox;
	}

	protected childrenCreated() {
		super.childrenCreated();

		this.cbox.visible = false;
		(<eui.Label>this.cbox.labelDisplay).textColor = 0x9b7c2c;

		switch (this.style) {
			case BaseTipsStyle.COMMON:
				let cancelBtn = new eui.Button();
				cancelBtn.skinName = "skins.ButtonSkin5";
				cancelBtn.currentState = "up";
				// cancelBtn.label = "取 消";
				this.gp_btn.addChild(cancelBtn);
				UIActionManager.bindClickAction(cancelBtn);

				cancelBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
					PopUpManager.removePopUp(this);
					if (this.cbs["cancelCB"]) {
						this.cbs["cancelCB"].call(this.cbs["context"]);
					}
				}, this);
			default:
				let okBtn = new eui.Button();
				okBtn.skinName = "skins.ButtonSkin5";
				okBtn.currentState = "down";
				// okBtn.label = "确 定";
				this.gp_btn.addChild(okBtn);
				UIActionManager.bindClickAction(okBtn);
				okBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
					PopUpManager.removePopUp(this);
					if (this.cbs["okCB"]) {
						this.cbs["okCB"].call(this.cbs["context"], this.cbox.selected);
					}
				}, this);
				break
		}

		let layout = new eui.HorizontalLayout();
		layout.horizontalAlign = egret.HorizontalAlign.CENTER;
		layout.verticalAlign = egret.VerticalAlign.MIDDLE;
		layout.gap = 150;
		this.gp_btn.layout = layout;

		// 内容
		if (this.textFlow) {
			this.lb_content.textFlow = this.textFlow;
		} else {
			this.lb_content.text = this.content;
		}

		let extHeight = 0;
		if (this.needCheckBox) {
			this.cbox.visible = true;
			this.lb_content.verticalCenter = undefined;
			this.lb_content.top = 110;
			extHeight = 35;
		} else {
			this.cbox.visible = false;
			this.lb_content.verticalCenter = 0;
		}
		// this.gp_root.height = 220 + this.lb_content.numLines*(this.lb_content.size+this.lb_content.lineSpacing);
		egret.setTimeout(() => {
			this.gp_root.height = 235 + this.lb_content.height + extHeight;
		}, this, 50);
	}
}
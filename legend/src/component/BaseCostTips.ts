
// 消耗类型tips的弹窗
class BaseCostTips extends BaseTips {
	private cost: any;
	private iconOffsetPos: any;

	/**
	 * cost:[type,type,num](EEntityType,EPropertyType,num)
	 * iconOffsetPos:[x,y]icon偏移的坐标，没办法，textflow不支持图文混排
	 */
	public constructor(params: any) {
		super(params);

		this.cost = JSON.parse(params.cost);
		this.iconOffsetPos = params.iconOffsetPos;
	}

	protected childrenCreated() {
		let iconImg = new eui.Image();
		iconImg.scaleX = 0.65;
		iconImg.scaleY = 0.65;
		iconImg.source = PropertyIcon[this.cost[0][1]];
		iconImg.x = 190 + this.iconOffsetPos[0];
		iconImg.y = 100 + this.iconOffsetPos[1];
		this.gp_root.addChild(iconImg);

		this.textFlow.unshift({ text: `确定花费        ${this.cost[0][2]}，`, style: { "textColor": 0xfffc00 } });

		super.childrenCreated();
	}
}
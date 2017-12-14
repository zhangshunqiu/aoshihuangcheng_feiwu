class BtnTips extends BaseBtnTips {
	public constructor(tip:any,parent:egret.DisplayObjectContainer,xx?:number,yy?:number) {
		super(0,parent,xx,yy);
		if(tip){
			this.show(tip);
		}else{
			this.hide();
		}
	}
}
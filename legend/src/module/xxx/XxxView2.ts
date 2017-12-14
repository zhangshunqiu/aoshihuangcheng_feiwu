/**
 *  子页面2
 */
class XxxView2 extends BaseChildView {
	public constructor(skinName:string) {
		super("skinlName")
	}

	protected childrenCreated() {
		super.childrenCreated();
		//this.isCreated = true;
	}

	/**
	 * 外面调用 ，可以不要实现
	 */
	// public readyOpen(openParam: any = null){
	// 	this.openData = openParam;
	// 	this.__isReadyOpenWin = true;
	// 	if(this.__isCreatComplete){
	// 		this.open(openParam);
	// 	}
	// }

	/**
	 * 打开窗口
	 */
	public open(openParam: any = null): void {
		super.open(openParam);

	}

	/**
	 * 清理
	 */
	public clear(data: any = null): void {
		super.clear();
	}
	/**
	 * 销毁
	 */
	public destroy(): void {
		super.destroy();
	}
}
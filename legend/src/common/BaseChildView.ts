class BaseChildView extends eui.Component {
	private __isCreatComplete:Boolean = false;
	private __isReadyOpenWin:Boolean = false;
	public openData:any;
	public constructor(_skinName:string) {
		super();
		if(_skinName && _skinName != ""){
			this.skinName = _skinName;
		}
		this.addEventListener(eui.UIEvent.CREATION_COMPLETE,this._onCreatComplete,this)
	}

	protected _onCreatComplete() {
		this.__isCreatComplete = true;
		if(this.__isReadyOpenWin){
			this.open(this.openData);
		}
	}

	protected childrenCreated() {
		super.childrenCreated();
		//this.isCreated = true;
	}

	/**
	 * 外面调用
	 */
	public readyOpen(openParam: any = null){
		this.openData = openParam;
		this.__isReadyOpenWin = true;
		if(this.__isCreatComplete){
			this.open(openParam);
		}
	}

	/**
	 * 打开窗口
	 */
	public open(openParam: any = null): void {
		this.visible = true;
	}

	/**
	 * 清理
	 */
	public clear(data: any = null): void {
        this.openData = null;
		this.visible = false;
	}
	/**
	 * 销毁
	 */
	public destroy(): void {
		this.__isCreatComplete = false;
		this.__isReadyOpenWin = false;
	}
}
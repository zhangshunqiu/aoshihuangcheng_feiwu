class ItemWays extends BaseView {
    public gp_main: eui.Group;
    public img_close: eui.Image;
    public baseItem: customui.BaseItem;
    public gp_way: eui.Group;
    private lb_name: eui.Label;

    private _type: number;
    private _id: number;

	/**
	 * id: 物品id
	 */
    public constructor(viewConf:WinManagerVO = null) {
        super(viewConf);
        
    }

    protected childrenCreated() {
        super.childrenCreated();
        this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
    }

    private initView() {
        this.baseItem.updateBaseItem(this._type, this._id);
        this.baseItem.setItemNameVisible(true);
        this.baseItem.setItemName({textColor:0x974e22});
        this.baseItem.setItemNumVisible(false);

        let layout = new eui.VerticalLayout();
        layout.gap = 10;
        layout.horizontalAlign = egret.HorizontalAlign.CENTER;
        layout.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.gp_way.layout = layout;
        let info = App.ConfigManager.getItemInfoById(this._id);
        for (let i = 0; i < info.acquiring_way.length; i++) {
            if (info.acquiring_way[i] == 0) {
                continue;
            }
            let item = new itemWayItem(info.acquiring_way[i]);
            this.gp_way.addChild(item);
            item.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                this.jump(info.acquiring_way[i]);
            }, this);
        }
        if (info.acquiring_way.length >= 2) {
            this.y -= 30 * (info.acquiring_way.length - 2);
            this.height += (info.acquiring_way.length - 1) * 80;
        }

        let baseInfo = App.ConfigManager.getItemInfoById(this._id);
        if (baseInfo) {
            this.lb_name.text = baseInfo.name;
            this.lb_name.textColor = ConstTextColor[baseInfo.quality];
        }
    }

    private jump(id) {
        let info = App.ConfigManager.getModuleOpenInfoById(id);
        if (App.GuideManager.isModuleOpen(info.client_name)) {
            this.closeWin();
            MainModuleJump.jumpToModule(id);
        } else {
            App.GuideManager.moduleNotOpenTip(info.client_name);
        }
    }

    public openWin(openParam: any = null): void {
        super.openWin(openParam);
        this._type = openParam.type;
        this._id = openParam.id;
        this.initView();
    }

    public closeWin() {
        super.closeWin();
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

}

class itemWayItem extends eui.Component {
    public lb_name: eui.Label;
    private _id: number;

    public constructor(id: number) {
        super();
        this.skinName = "ItemWayItemSkin";
        this._id = id;
    }

    protected childrenCreated() {
        super.childrenCreated();
        let info = App.ConfigManager.getModuleOpenInfoById(this._id);
        if (info) {
            this.lb_name.text = info.name;
        }
    }

}
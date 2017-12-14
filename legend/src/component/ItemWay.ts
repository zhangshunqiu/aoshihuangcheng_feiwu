
/**
 * 物品来源
*/
class ItemWay extends eui.Component {
    public gp_main: eui.Group;
    public img_close: eui.Image;
    public baseItem: customui.BaseItem;
    public gp_way: eui.Group;

    private _type: number;
    private _id: number;

	/**
	 * id: 物品id
	 */
    public constructor(type: number, id: number) {
        super();
        this.skinName = "ItemWaySkin";
        this._type = type;
        this._id = id;
    }

    protected childrenCreated() {
        super.childrenCreated();
        this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            PopUpManager.removePopUp(this);
        }, this);
        this.baseItem.updateBaseItem(this._type, this._id);
        this.baseItem.lb_num.visible = false;
        this.baseItem.lb_name.textColor = 0x974e22;
        this.baseItem.lb_name.visible = true;

        let layout = new eui.VerticalLayout();
        layout.gap = 10;
        layout.horizontalAlign = egret.HorizontalAlign.CENTER;
        layout.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.gp_way.layout = layout;
        let info = App.ConfigManager.getItemInfoById(this._id);
        for (let i = 0; i < info.acquiring_way.length; i++) {
            let item = new itemWayItem(info.acquiring_way[i]);
            this.gp_way.addChild(item);
            item.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
                this.jump(info.acquiring_way[i]);
            },this);
        }
        if (info.acquiring_way.length > 2){
            this.y -= 30*(info.acquiring_way.length-2);
            this.height += (info.acquiring_way.length-2)*60;
        }
    }
    private jump(id) {
        let info = App.ConfigManager.getModuleOpenInfoById(id);
        if(App.GuideManager.isModuleOpen(info.client_name)) {
            PopUpManager.removePopUp(this);
            MainModuleJump.jumpToModule(id);
        } else {
            App.GuideManager.moduleNotOpenTip(info.client_name);
        }
    }

}

class itemWayItem extends eui.Component {
    public lb_name : eui.Label;
    private _id : number;

    public constructor(id: number) {
        super();
        this.skinName = "ItemWayItemSkin";
        this._id = id;
    }

    protected childrenCreated() {
        super.childrenCreated();
        let info = App.ConfigManager.getModuleOpenInfoById(this._id);
        this.lb_name.text = info.name;
    }

}
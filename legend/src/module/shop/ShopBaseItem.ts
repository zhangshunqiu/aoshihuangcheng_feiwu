class ShopBaseItem extends customui.BaseItem {

    private img_discount: eui.Image;  //物品折扣
    public constructor(id?) {
        super(id);
    }

    protected childrenCreated() {
        super.childrenCreated();
        this.img_discount = new eui.Image();
        this.addChild(this.img_discount);
        this.img_discount.left = 10;
        this.img_discount.top = 5;
    }

    public setDiscountIcon(icon: string | egret.Texture) {
        if (icon) {
            RES.getResAsync(icon + "_png", (texture) => {
                if (this.img_discount) {
                    this.img_discount.source = texture;
                }
            }, this);
        } else {
            this.img_discount.source = null;
        }
    }
}
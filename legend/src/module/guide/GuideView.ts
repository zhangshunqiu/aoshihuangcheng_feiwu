class GuideView extends eui.Component {
    public gp_main: eui.Group;
    public gp_text: eui.Group;
    public btn_skip: eui.Button;
    public lb_text: eui.Label;
    public img_arrow : eui.Image;
    public darkSprite: egret.Sprite = new egret.Sprite();
    public guideModel: GuideModel = GuideModel.getInstance();
    public maskArray: Array<eui.Group> = [];

    private _mc: EffectMovieClip;
    public constructor() {
        super();
        this.skinName = "GuideViewSkin";
    }

    protected childrenCreated() {
        super.childrenCreated();
        // this.touchChildren = false;
        this.touchEnabled = false;
        this.btn_skip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.skipGuide, this);

        //初始化特效
        this._mc = new EffectMovieClip();
        this._mc.touchEnabled = false;
        this._mc.playMCKey("effxsyd", "", -1, null, () => {
            this._mc.frameRate = 8;
        }, null, this);
        this.gp_main.addChild(this._mc);
        //初始化四个遮罩
        for (let i = 0; i <= 4; i++) {
            let gp = new eui.Group();
            gp.touchEnabled = true;
            gp.touchThrough = false;
            this.gp_main.addChild(gp);
            this.maskArray.push(gp);

            let rect = new eui.Rect();
            rect.fillColor = 0x000000;
            rect.fillAlpha = 0.6;
            rect.left = rect.right = rect.bottom = rect.top = 0;
            gp.addChild(rect);
        }
        this.gp_main.setChildIndex(this.gp_text, 998);
        this.gp_main.setChildIndex(this.btn_skip, 999);
        this.validateNow();

    }

    public updateGuide() {
        let guideInfo = App.ConfigManager.getGuideInfoByIdAndStep(App.GuideManager.curGuideId, App.GuideManager.curGuideStep);
        let obj: egret.DisplayObject = App.GuideManager.guideBtnDic[App.GuideManager.curGuideId][App.GuideManager.curGuideStep];
        let point = obj.localToGlobal();
        let width = guideInfo.width;
        let height = guideInfo.height;
        // App.logzrj("data",point,obj);

        //设置遮罩
        this.maskArray[0].x = this.maskArray[0].y = 0;
        this.maskArray[0].height = this.gp_main.height;
        this.maskArray[0].width = point.x;

        this.maskArray[1].x = point.x + width;
        this.maskArray[1].y = 0;
        this.maskArray[1].height = this.gp_main.height;
        this.maskArray[1].width = this.gp_main.width - point.x - width;

        this.maskArray[2].x = point.x;
        this.maskArray[2].y = 0;
        this.maskArray[2].height = point.y;
        this.maskArray[2].width = width;

        this.maskArray[3].x = point.x;
        this.maskArray[3].y = point.y + height;
        this.maskArray[3].height = this.gp_main.height - height - point.y;
        this.maskArray[3].width = width;

        this._mc.x = point.x+width/2;
        this._mc.y = point.y+height/2;
        // if(this._mc.parent) {
        //     this._mc.parent.removeChild(this._mc);
        //     obj.parent.addChild(this._mc);
        //     this._mc.x = obj.x;
        //     this._mc.y = obj.y;

        // }

        this.gp_text.y = point.y;
        this.lb_text.text = guideInfo.des;
        this.lb_text.validateNow();
        this.gp_text.width = this.lb_text.width + 25;
        if (point.x > App.stageWidth / 2) {
            this.gp_text.x = point.x+width/2 - this.gp_text.width - 75;
            this.img_arrow.x =  this.gp_text.width;
             RES.getResAsync("main_icon_xinshouzhiyin_right_png",(texture)=>{
                this.img_arrow.source = texture;
            },this);
        } else {
            this.gp_text.x = point.x+width/2 + 75;
            // this.lb_text.textAlign = "left";
            this.img_arrow.x = -50;
            RES.getResAsync("main_icon_xinshouzhiyin_left_png",(texture)=>{
                this.img_arrow.source = texture;
            },this);
        }

    }

    // public finishStep(){
    // if (this.curDisplayObject.visible){
    //     this.curDisplayObject.dispatchEvent(new egret.TouchEvent(egret.TouchEvent.TOUCH_TAP));
    //     this.curDisplayObject.dispatchEvent(new egret.TouchEvent(egret.TouchEvent.TOUCH_BEGIN));
    //     this.curDisplayObject.dispatchEvent(new egret.TouchEvent(egret.TouchEvent.TOUCH_END));
    //     this.curDisplayObject.visible = false;
    //     App.GuideManager.NextStep();
    // } else {

    // }
    // }
    public skipGuide() {
        App.logzrj("skipppppp");
        App.GuideManager.nextGuide();
    }

    public showGuide() {
        if (this.visible) {
            return;
        }
        this.visible = true;
        this.updateGuide();
    }

    public hideGuide() {
        if (!this.visible) {
            return;
        }
        this.visible = false;
        // if (this._mc.parent) {
        //     this._mc.parent.removeChild(this._mc);
        // }
    }

}
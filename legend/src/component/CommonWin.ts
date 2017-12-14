module customui {
    // 通用全屏窗口类
    export class CommonWin extends eui.Component {
        public gp_Main: eui.Group;
        public img_title: eui.Image;
        public img_close: eui.Image;

        public constructor(params: any) {
            super();
            this.skinName = "CommonWinSkin";
        }

        protected childrenCreated() {
            super.childrenCreated();
            egret.callLater(()=>{
                this.mask = new egret.Rectangle(0,0,this.width,this.height);
                
            },this);
        }
    }
}
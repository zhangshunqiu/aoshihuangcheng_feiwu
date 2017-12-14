
class MovieClipTools {
    public static factory: egret.MovieClipDataFactory;
    public static MCmap: any = {};
    public static create(name: string, subname: string,doneCB: Function, context?: any): any {
        let textureData: any;
        let texture: any;

        function onLoadTextureDataComplete(data: any): void {
            textureData = data;
            RES.getResAsync(`${name}_png`, onLoadTextureComplete, this);
        }

        function onLoadTextureComplete(data: any): void {
            texture = data;
            build();
        }
        function build() {
            MovieClipTools.factory = new egret.MovieClipDataFactory(textureData, texture);
            let myname = subname ? subname : "";
            let armature = new egret.MovieClip( MovieClipTools.factory.generateMovieClipData(myname) );
            if (!armature) {
                App.GlobalTips.showTips("读取特效失败:" + name);
                return;
            } else {
                MovieClipTools.MCmap[name] = true;
                doneCB.call(context, armature);
            }
        }

        // if (!MovieClipTools.factory) {
        //     MovieClipTools.factory = new egret.MovieClipDataFactory();
        // }

        RES.getResAsync(`${name}_json`, onLoadTextureDataComplete, this);
    }

    public static createSync(name: string, subname?: string) : egret.MovieClip {
        if (!this.isExist(name)){
            return;
        }
        var data = RES.getRes(`${name}_json`);
        var txtr = RES.getRes(`${name}_png`);
        var mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory( data, txtr );
        var mc:egret.MovieClip = new egret.MovieClip( mcFactory.generateMovieClipData() );
        return mc;
    }

    public static isExist(name: string) :boolean {
        if (MovieClipTools.MCmap[name]) {
            return true;
        }
        return false;
    }
}
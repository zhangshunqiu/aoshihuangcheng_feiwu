// chl 不支持xml的db文件
// 使用例子
// DragonBoneTools.create("skill_niao", function (obj: any) {
//             let display = obj.getDisplay();
//             display.x = 360;
//             display.y = 1080;
//             GameRootLayer.gameLayer().addChild(display);

//             obj.animation.gotoAndPlay("skill_niao");

//         });

class DragonBoneTools {
    public static factory: any;

    public static create(name: string, doneCB: Function, context?: any): any {
        let skeletonData: any;
        let textureData: any;
        let texture: any;

        function onLoadSkeletonComplete(data: any): void {
            skeletonData = data;
            RES.getResAsync(`${name}_texture_json`, onLoadTextureDataComplete, this);
        }

        function onLoadTextureDataComplete(data: any): void {
            textureData = data;
            RES.getResAsync(`${name}_texture_png`, onLoadTextureComplete, this);
        }

        function onLoadTextureComplete(data: any): void {
            texture = data;

            DragonBoneTools.factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData), name);
            DragonBoneTools.factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData), name);

            build();
        }

        function build() {
            let armature = DragonBoneTools.factory.buildArmature(name);

            if (!armature) {
                App.GlobalTips.showTips("读取特效失败:" + name);
                return;
            } else {
                dragonBones.WorldClock.clock.add(armature);
                if ((<any>name).startsWith("skill") || (<any>name).startsWith("buff")) {
                    armature.animation.timeScale = 1.5;
                    armature.animation.timeScale = armature.animation.timeScale + App.TimerManager.getTimeScale();
                }
                doneCB.call(context, armature);
            }
        }

        if (!DragonBoneTools.factory) {
            DragonBoneTools.factory = new dragonBones.EgretFactory();
        }

        let dragonBonesData = DragonBoneTools.factory.getDragonBonesData(name);
        let textureAtlas = DragonBoneTools.factory.getTextureAtlas(name);
        if (!dragonBonesData || !textureAtlas) {
            RES.getResAsync(`${name}_skeleton_json`, onLoadSkeletonComplete, this);
        } else {
            build();
        }
    }
}

module game {

    export class MaoxianCommand extends puremvc.SimpleCommand implements puremvc.ICommand {
        public static OPEN_MAIN_VIEW = "MaoxianCommand_OPEN_MAIN_VIEW";

        public constructor() {
            super();
        }

        public static NAME: string = "MaoxianCommand";

        /**
         * 注册消息
         */
        public register(): void {
            this.facade.registerCommand(ModuleNotify.OPEN_MODULE_MAOXIAN, MaoxianCommand);
        }

        public execute(notification: puremvc.INotification): void {
            var data: any = notification.getBody();//携带数据

            switch (notification.getName()) {
                case ModuleNotify.OPEN_MODULE_MAOXIAN: {
                    console.log("打开冒险模块");
                    let cconfig = ModuleNotify.MODULE_CONFIG.OPEN_MODULE_MAOXIAN;
                    this.facade.sendNotification(SceneCommand.CHANGE_SCENE, cconfig.sceneBgImgName);
                    this.facade.sendNotification(MainCommand.CHANGE_STYLE);
                    this.facade.sendNotification(MaoxianCommand.OPEN_MAIN_VIEW);
                    break;
                }
            }
        }
    }
}

/**
  * by dily
  * (c) copyright 2014 - 2035
  * All Rights Reserved. 
  */
module game {

    export class MaoxianMediator extends BaseMediator {
        public static NAME: string = "MaoxianMediator";
        private rootUI: MaoxianUI;

        public constructor(viewComponent: any = null) {
            super(MaoxianMediator.NAME, viewComponent);
        }

        public listNotificationInterests(): Array<any> {
            return [
                MaoxianCommand.OPEN_MAIN_VIEW,
            ];
        }

        public handleNotification(notification: puremvc.INotification): void {
            var data: any = notification.getBody();
            switch (notification.getName()) {
                case MaoxianCommand.OPEN_MAIN_VIEW: {
                    if (!this.rootUI) {
                        this.rootUI = new MaoxianUI();
                        this.createAndBindViewComponent(this.rootUI);
                        this.showUI(this.rootUI, false, 0, 0, 1);
                    }
                    break;
                }
            }
        }

        public initUI(): void {

        }

        public initData(): void {

        }
    }
}
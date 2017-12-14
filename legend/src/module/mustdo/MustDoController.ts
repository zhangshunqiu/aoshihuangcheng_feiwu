/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 每日必做控制器 2017/06/20.
 */
module game {
    export class MustDoController extends BaseController {
        public constructor() {
            super();
            this.initProtocol();
            this.initEventListener();
        }
		/**
		 * 初始化协议
		 */
        protected initProtocol() {
            super.initProtocol();
            //每日必做
            this.registerProtocal(18001, this.handleMustDoList, this);//收到每日必做信息
            this.registerProtocal(18002, this.handleTakeTaskResult, this);//领取每日任务奖励反馈
            this.registerProtocal(18003, this.handleTakeChestResult, this);//领取活跃度宝箱奖励反馈
            this.registerProtocal(18004, this.handleActivityReset, this);//每日四点信息重置

            //成就
            this.registerProtocal(19001, this.handleAchieveInfo, this);//收到成就信息
            this.registerProtocal(19002, this.handleTakeAchieveResult, this);//领取成就奖励
            this.registerProtocal(19003, this.handleTakeAllAchieveResult, this);//一键领取成就
            this.registerProtocal(19004, this.handleGetUnTakeAchieve, this);//领取未领取成就
            //勋章
            this.registerProtocal(19005, this.handleMedalInfo, this);//收到勋章界面信息
            this.registerProtocal(19006, this.handleMedalLevUp, this);//处理界面升级

            //称号
            this.registerProtocal(32001, this.handleTitleInfo, this);//收到称号界面信息
            this.registerProtocal(32002, this.handleUseTitle, this);//处理使用称号
            this.registerProtocal(32003, this.handleShowTitle, this);//处理显示称号
        }

        //称号
        public handleTitleInfo(data) {
            App.loglh("handleTitleInfo");
             (MustDoModel.getInstance() as MustDoModel).getTitleInfo(data);
              this.dispatchEvent(PanelNotify.MUSTDO_UPDATETITLE);
        }

        public handleUseTitle(data) {
            App.loglh("handleUseTitle");
             App.Socket.send(32001, null);
        }

        public handleShowTitle(data) {
            App.loglh("handleShowTitle");
            App.Socket.send(32001, null);
            // if(data)
             let info = App.ConfigManager.getTitleInfoById((MustDoModel.getInstance() as MustDoModel).selectTitleId);
             this.dispatchEvent(SceneEventType.UPDATE_HONOR_TITLE,{objId:(HeroModel.getInstance()as HeroModel).getCurHero().id,honorId:info.icon});

        }

        //成就
        public handleAchieveInfo(data) {
            App.loglh("handleAchieveInfo");
            App.loglh(data);
            (MustDoModel.getInstance() as MustDoModel).getAchieveInfo(data);
            this.dispatchEvent(PanelNotify.MUSTDO_UPDATESACHIEVE);

        }

        public handleTakeAchieveResult(data) {
            App.loglh("handleTakeAchieveResult");
            App.loglh(data);
            App.Socket.send(19001, null);
        }

        public handleTakeAllAchieveResult(data) {
            App.loglh("handleTakeAllAchieveResult");
            App.loglh(data);
            App.Socket.send(19001, null);
        }

        //领取未领取成就
        public handleGetUnTakeAchieve(data) {
            App.loglh("handleGetUnTakeAchieve");
            App.loglh(data);
            App.Socket.send(19005, null);
        }


        //勋章
        public handleMedalInfo(data) {
            App.loglh("handleMedalInfo");
            App.loglh(data);
            (MustDoModel.getInstance() as MustDoModel).getMedalInfo(data);
            this.dispatchEvent(PanelNotify.MUSTDO_UPDATEMEDAL);

        }

        public handleMedalLevUp(data) {
            App.loglh("handleMedalLevUp");
            App.loglh(data);
            App.Socket.send(19005, null);

        }

        //每日必做
        public handleMustDoList(data) {

            App.loglh("handleMustDoList");
            App.loglh(data);
            (MustDoModel.getInstance() as MustDoModel).getActivityInfo(data);
            this.dispatchEvent(PanelNotify.MUSTDO_UPDATEACTIVITY);
        }

        public handleTakeTaskResult(data) {

            App.loglh("handleMustDoList");
            App.loglh(data);
            App.Socket.send(18001, null);
        }

        public handleTakeChestResult(data) {

            App.loglh("handleMustDoList");
            App.loglh(data);
            App.Socket.send(18001, null);

        }

        public handleActivityReset(data) {

            App.loglh("handleMustDoList");
            App.loglh(data);
            App.Socket.send(18001, null);
        }
        /**
        * 销毁
        */
        public destroy() {
            super.destroy();
        }

		/**
		 * 清理
		 */
        public clear() {
            super.clear();
        }
    }
}
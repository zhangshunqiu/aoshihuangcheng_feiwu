/**
 * 外挂界面
 */
module game {

    export class TestView extends BaseView {
        public gp_main : eui.Group;
        public img_notice : eui.Image;
        public btn_debug : eui.Button;
        public img_close : eui.Image;
        public btn_start : eui.Button;
        public edtext_input : eui.EditableText;
        private heroModel: HeroModel = (HeroModel.getInstance() as HeroModel);
        public backpackModel: BackpackModel = (BackpackModel.getInstance() as BackpackModel);

        public constructor(viewconf) {
            super(viewconf);
            // this.skinName = "TestSkin";
            // App.loglyg(this.heroModel.baseInfo);
            // App.loglyg(this.backpackModel.getItemByTypeIdUuid(1,16))
            
        }
        private _resTips:BtnTips;
        protected childrenCreated() {
            super.childrenCreated();
            this.btn_debug.addEventListener(egret.TouchEvent.TOUCH_TAP, this.debug, this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
                App.WinManager.closeWin(WinName.TEST);
            }, this);
            // this.initView();
            //App.BtnTipManager.addBtnTipItem(ConstBtnTipType.TEST,this.btn_debug)
            this._resTips = App.BtnTipManager.creatBtnTip(true,this.btn_debug);
        }
        
        // private initView() {
        //     this.btn_server.addEventListener(egret.TouchEvent.TOUCH_TAP,(e:Event)=>{
        //     },this);
        // }
        private debug() {
            let text = this.edtext_input.text;
            if(text === undefined || text === '') { //用户未输入或只是打的空格
                alert('请输入值再debug')
            } else {
                alert(text);
                this.doDebug(text);
                this.edtext_input.text = '';
            }

            App.logzsq("TOUCH_TAP",Math.random())
            if(Math.random() > 0.5){
                 this._resTips.hide()
                //App.BtnTipManager.setTypeValue(ConstBtnTipType.TEST,0);
                //App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE,0);
            }else{
                this._resTips.show(true)
                //App.BtnTipManager.setTypeValue(ConstBtnTipType.TEST,1);
                //App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE,1);
            }

             App.BtnTipManager.setTypeValue(ConstBtnTipType.FORGE_STAR,"2");
            // App.BtnTipManager.setTypeValue(ConstBtnTipType.TASK_DAILY,1);
            // App.BtnTipManager.setTypeValue(ConstBtnTipType.TASK_ACHIEVE,1);
           
        }


        private doDebug(value:string){
            if(Number(value) < 93001 && Number(value) > 9000){
                App.Socket.send(Number(value),{});
            }else if(value == "boss"){
                SceneController.getInstance().testHandlerInitScene(40001);
            }else if(value.indexOf("skill,") == 0){
                var arr:Array<String> = value.replace("skill,","").split(",");
                var skillId:number = Number(arr[0]);
                var lv:number = Number(arr[1]);
                if(lv == 0){
                    lv = 1;
                }
                if(skillId >0){
                    var pVo:ScenePlayerVo =  SceneModel.getInstance().getPlayerVo(RoleManager.getInstance().getMainHeroId());
                    pVo.hookSkillVOList = [];
                    let vo:FSkillVo = new FSkillVo();
                    vo.initSkill(skillId,lv);
		            pVo.hookSkillVOList.push(vo);
                }
            }

        }

        private closeDebug() {

        }


    }
}
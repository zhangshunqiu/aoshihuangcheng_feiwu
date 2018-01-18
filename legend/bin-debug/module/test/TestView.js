var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * 外挂界面
 */
var game;
(function (game) {
    var TestView = (function (_super) {
        __extends(TestView, _super);
        function TestView(viewconf) {
            var _this = _super.call(this, viewconf) || this;
            _this.heroModel = game.HeroModel.getInstance();
            _this.backpackModel = game.BackpackModel.getInstance();
            return _this;
            // this.skinName = "TestSkin";
            // App.loglyg(this.heroModel.baseInfo);
            // App.loglyg(this.backpackModel.getItemByTypeIdUuid(1,16))
        }
        TestView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.btn_debug.addEventListener(egret.TouchEvent.TOUCH_TAP, this.debug, this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                App.WinManager.closeWin(WinName.TEST);
            }, this);
            // this.initView();
            //App.BtnTipManager.addBtnTipItem(ConstBtnTipType.TEST,this.btn_debug)
            this._resTips = App.BtnTipManager.creatBtnTip(true, this.btn_debug);
        };
        // private initView() {
        //     this.btn_server.addEventListener(egret.TouchEvent.TOUCH_TAP,(e:Event)=>{
        //     },this);
        // }
        TestView.prototype.debug = function () {
            var text = this.edtext_input.text;
            if (text === undefined || text === '') {
                alert('请输入值再debug');
            }
            else {
                alert(text);
                this.doDebug(text);
                this.edtext_input.text = '';
            }
            App.logzsq("TOUCH_TAP", Math.random());
            if (Math.random() > 0.5) {
                this._resTips.hide();
                //App.BtnTipManager.setTypeValue(ConstBtnTipType.TEST,0);
                //App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE,0);
            }
            else {
                this._resTips.show(true);
                //App.BtnTipManager.setTypeValue(ConstBtnTipType.TEST,1);
                //App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE,1);
            }
            App.BtnTipManager.setTypeValue(ConstBtnTipType.FORGE_STAR, "2");
            // App.BtnTipManager.setTypeValue(ConstBtnTipType.TASK_DAILY,1);
            // App.BtnTipManager.setTypeValue(ConstBtnTipType.TASK_ACHIEVE,1);
        };
        TestView.prototype.doDebug = function (value) {
            if (Number(value) < 93001 && Number(value) > 9000) {
                App.Socket.send(Number(value), {});
            }
            else if (value == "boss") {
                SceneController.getInstance().testHandlerInitScene(40001);
            }
            else if (value.indexOf("skill,") == 0) {
                var arr = value.replace("skill,", "").split(",");
                var skillId = Number(arr[0]);
                var lv = Number(arr[1]);
                if (lv == 0) {
                    lv = 1;
                }
                if (skillId > 0) {
                    var pVo = SceneModel.getInstance().getPlayerVo(RoleManager.getInstance().getMainHeroId());
                    pVo.hookSkillVOList = [];
                    var vo = new FSkillVo();
                    vo.initSkill(skillId, lv);
                    pVo.hookSkillVOList.push(vo);
                }
            }
        };
        TestView.prototype.closeDebug = function () {
        };
        return TestView;
    }(BaseView));
    game.TestView = TestView;
    __reflect(TestView.prototype, "game.TestView");
})(game || (game = {}));
//# sourceMappingURL=TestView.js.map
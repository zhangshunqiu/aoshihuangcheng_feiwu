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
* Author: yangyipeng
* Email： hersletter@qq.com
* 邮件数据层 2017/06/20.
*/
var game;
(function (game) {
    var MailModel = (function (_super) {
        __extends(MailModel, _super);
        function MailModel() {
            var _this = _super.call(this) || this;
            _this._mailArr = [];
            return _this;
        }
        /**
         * 收到所有邮件
         */
        MailModel.prototype.receiveMails = function (mailsData) {
            this._mailArr = [];
            for (var i = 0; i < mailsData.mail_list.length; i++) {
                this._mailArr.push(game.MailVO.objToVo(mailsData.mail_list[i]));
            }
        };
        /**
         * 判断红点的
         */
        MailModel.prototype.hasNoReadMail = function () {
            for (var i = 0; i < this._mailArr.length; i++) {
                var vo = this._mailArr[i];
                if (vo.isRead == false) {
                    return true;
                }
            }
            return false;
        };
        /**
         * 收到单条邮件
         */
        MailModel.prototype.receiveSingleMail = function (mailData) {
            // *  message pbMail{
            // 	optional int32 id			= 1;	// 邮件id
            // 	optional string title		= 2;	// 标题
            // 	optional int32 content		= 3;	// 内容
            // 	repeated pbGood attachment_list = 4;	// 附件
            // 	optional int32 				= 5;	// 附件状态 （0未领取， 1已领取）
            // 	optional int32 time			= 6;	// 时间（时间戳）
            // }
            var mailVo = game.MailVO.objToVo(mailData);
            this._mailArr.unshift(mailVo);
            // this._mailArr.addItemAt(mailVo,0);
            // this._mailArr.itemUpdated(mailVo);
            // this._mailArr.refresh();
        };
        /**
         * 改变某条邮件的状态（未读=>已读）
         */
        MailModel.prototype.readMail = function (id) {
            for (var i = 0; i < this._mailArr.length; i++) {
                var mailArrItem = this._mailArr[i];
                if (id == mailArrItem.id) {
                    mailArrItem.isRead = true;
                    break;
                }
            }
            // App.EventSystem.dispatchEvent(PanelNotify.MAIL_INFO_UPDATE);
        };
        /**
         * 处理一键领取
         */
        MailModel.prototype.mailAttachBundle = function (data) {
            for (var i = 0; i < data.id_list.length; i++) {
                this.mailAttachSingle(data.id_list[i].id);
            }
        };
        /**
         * 改变某条邮件的状态(未领取=>已领取)
         */
        MailModel.prototype.mailAttachSingle = function (id) {
            for (var i = 0; i < this._mailArr.length; i++) {
                var mailArrItem = this._mailArr[i];
                if (id == mailArrItem.id) {
                    mailArrItem.isRead = true;
                    mailArrItem.rewardState = true;
                    break;
                }
            }
        };
        Object.defineProperty(MailModel.prototype, "mailArr", {
            get: function () {
                //一页最多六个
                var count = Math.floor(this._mailArr.length / 6);
                var arr = [];
                for (var i = 0; i < count; i++) {
                    arr.push(this._mailArr.slice(i * 6, (i + 1) * 6));
                }
                if (count * 6 != this._mailArr.length) {
                    arr.push(this._mailArr.slice(count * 6, this._mailArr.length));
                }
                return arr;
            },
            enumerable: true,
            configurable: true
        });
        MailModel.prototype.mailDataLength = function () {
            return this._mailArr.length;
        };
        // public get mailArr():eui.ArrayCollection
        // {
        // 	return this._mailArr;
        // }
        // public set mailArr(mailArr:eui.ArrayCollection)
        // {
        // 	this._mailArr = mailArr;
        // }
        MailModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        MailModel.prototype.destroy = function () {
            _super.prototype.clear.call(this);
        };
        /**
         * 时间戳转换成日期时间格式
         */
        MailModel.formatDate = function (Num) {
            // var time = new Date(parseInt(Num) * 1000).toLocaleString();
            // var hours:number =new Date(parseInt(Num) * 1000).getHours();
            // if(String(hours).length <= 1) {
            // 	var index:number = time.indexOf(String(hours));
            // 	var hour:string = "0" + String(hours);	//变两位数
            // 	return time.substr(0,index) + hour + time.substr(index);
            // }else{
            // 	return time;
            // }
            return new Date(parseInt(Num) * 1000).toLocaleString();
            // var Day=new Date(parseInt(Num) * 1000).toLocaleTimeString().replace("上午", '').replace("下午", '').replace(":", '').replace(":", '');
            // var DayBy=new Date(parseInt(Num) * 1000).toLocaleTimeString().replace("上午", '').replace("下午", '');
            // var DayDal=new Date(parseInt(Num) * 1000).toLocaleTimeString();
            // var Text=DayDal.substr(0,1);
            // var DayA=Day;
            // var DayB=Day;
            // var DayC=Day;
            // var DayH;
            // var DayM;
            // var DayS;
            // var DateDal=new Date(parseInt(Num) * 1000).toLocaleDateString().replace(/\//gi, '-');
            // if(Text=="下"){
            // 	for(var i=0;i<4;i++){
            // 		DayA = DayA.substring(0, DayA.length - 1);
            // 	}
            // 	if(Number(DayA)>=1&&Number(DayA)<=9){
            // 		DayB=DayB.substring(1);
            // 		for(var ic=0;ic<3;ic++){
            // 			DayC = DayC.substring(1);
            // 		}
            // 	}else{
            // 		for(var ib=0;ib<2;ib++){
            // 			DayB=DayB.substring(1);
            // 		}
            // 		for(var ia=0;ia<4;ia++){
            // 			DayC = DayC.substring(1);
            // 		}
            // 	}
            // 	for(var id=0;id<2;id++){
            // 		DayB=DayB.substring(0, DayB.length - 1)
            // 	}
            // 	if(Number(DayA)==12){
            // 		DayH="12";
            // 	}else{
            // 		DayH=12+Number(DayA);
            // 	}
            // }else {
            // 	for (var i = 0; i < 4; i++) {
            // 		DayA = DayA.substring(0, DayA.length - 1);
            // 	}
            // 	if (Number(DayA) >= 0 && Number(DayA) <= 9) {
            // 		DayB = DayB.substring(1);
            // 		for (var ic = 0; ic < 3; ic++) {
            // 			DayC = DayC.substring(1);
            // 		}
            // 	} else {
            // 		for (var ib = 0; ib < 2; ib++) {
            // 			DayB = DayB.substring(1);
            // 		}
            // 		for (var ia = 0; ia < 4; ia++) {
            // 			DayC = DayC.substring(1);
            // 		}
            // 	}
            // 	for (var id = 0; id < 2; id++) {
            // 		DayB = DayB.substring(0, DayB.length - 1)
            // 	}
            // 	if (Number(DayA) == 12) {
            // 		DayH = "00";
            // 	} else if (Number(DayA) >= 10 && Number(DayA) <= 11) {
            // 		DayH = "0" + Number(DayA);
            // 	} else {
            // 		DayH = Number(DayA);
            // 	}
            // }
            // DayM = DayB;
            // DayS = DayC;
            // DayBy = DateDal + " " + DayH + ":" + DayM + ":" + DayS;
            // return DayBy;
        };
        return MailModel;
    }(BaseModel));
    game.MailModel = MailModel;
    __reflect(MailModel.prototype, "game.MailModel");
})(game || (game = {}));
//# sourceMappingURL=MailModel.js.map
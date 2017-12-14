
class GlobalUtil {
    /**
     * 获取当前时间戳
     */
    public static getTimer(): number {
        return GlobalModel.getInstance().getTimer();
    }

    //3: 传入秒数，返回00:00格式的字符串
    public static getFormatBySecond1(t: number = 0): string {
        var hourst: number = Math.floor(t / 3600);
        var minst: number = Math.floor((t - hourst * 3600) / 60);
        var secondt: number = Math.floor((t - hourst * 3600) % 60);
        var hors: string;
        var mins: string;
        var sens: string;
        if (hourst == 0) {
            hors = "00";
        } else if (hourst < 10) {
            hors = "0" + hourst;
        } else {
            hors = "" + hourst;
        }
        if (minst == 0) {
            mins = "00";
        } else if (minst < 10) {
            mins = "0" + minst;
        } else {
            mins = "" + minst;
        }
        if (secondt == 0) {
            sens = "00";
        } else if (secondt < 10) {
            sens = "0" + secondt;
        } else {
            sens = "" + secondt;
        }
        return hors + ":" + mins + ":" + sens;
    }
    /**
     * @param 传入秒数 
     * XX天XX小时XX分钟 时间格式
     */
    public static getFormatBySecond2(t: number = 0): string {

			var days:number = Math.floor(t/ 60 / 60 / 24); //计算剩余的天数 
			var hours = Math.floor(t/ 60 / 60 % 24); //计算剩余的小时 
			var minst = Math.floor(t/ 60 % 60);//计算剩余的分钟 
	
			var dys: string;
			var hors: string;
			var mins: string;
			if (days == 0) {
				dys = "00";
			} else if (days < 10) {
				dys = "0" + days;
			} else {
				dys = "" + days;
			}
			if (hours == 0) {
				hors = "00";
			} else if (hours < 10) {
				hors = "0" + hours;
			} else {
				hors = "" + hours;
			}
			if (minst == 0) {
				mins = "00";
			} else if (minst < 10) {
				mins = "0" + minst;
			} else {
				mins = "" + minst;
			}
		
			return  dys + "天"+ hors + "小时" + mins + "分钟";
		}

    /**
     * 遍历操作
     * @param arr
     * @param func
     */
    public static forEach(arr: Array<any>, func: Function, funcObj: any): void {
        for (var i: number = 0, len: number = arr.length; i < len; i++) {
            func.apply(funcObj, [arr[i]]);
        }
    }

    public static getFrameByColor(color: number) {
        let name = "white";
        switch (color) {
            case 0: {
                name = "white";
                break;
            }
            case 1: {
                name = "green";
                break;
            }
            case 2: {
                name = "blue";
                break;
            }
            case 3: {
                name = "purple";
                break;
            }
            case 4: {
                name = "orange";
                break;
            }
            case 5: {
                name = "red";
                break;
            }

        }
        return "common_frame_" + name + "_png";
    }

    /**
     * 根据type id 获取配置基本信息
    */
    public static getInfoByTypeId(type: number, id: number) {
        let info = undefined;
        switch (type) {
            case 0: {
                info = App.ConfigManager.itemConfig()[id];
                break;
            }
            case 1: {
                info = App.ConfigManager.itemConfig()[id];
                break;
            }
            case 2: {
                info = App.ConfigManager.itemConfig()[id];
                break;
            }
            case 3: {
                info = App.ConfigManager.equipConfig()[id];
                break;
            }

        }
        return info;
    }

    /**
      * 根据info显示名称、消息内容
     */
    public static getChatPortText(vo) {
        switch (vo.type) {
            case ChatType.GUILD:
                return <Array<egret.ITextElement>>[                  //转换成元素为 egret.ITextElement 的数组
                    { text: "[工会]", style: { "textColor": 0xbd1012, fontFamily: "SimHei" } }
                    , { text: vo.player_name, style: { "underline": true, "textColor": 0x01acfe, fontFamily: "SimHei" } }
                    , { text: "：", style: { "textColor": 0x01acfe, fontFamily: "SimHei" } }
                    , { text: vo.content, style: { "textColor": 0xbfbfbf, fontFamily: "SimHei" } }
                ];

            case ChatType.SYSTEM:
                return <Array<egret.ITextElement>>[                  //转换成元素为 egret.ITextElement 的数组
                    { text: "[系统]", style: { "textColor": 0x1fd745, fontFamily: "SimHei" } }
                    , { text: vo.content, style: { "textColor": 0xbfbfbf, fontFamily: "SimHei" } }
                ];


            // case ChatType.WORLD:

            //  return <Array<egret.ITextElement>>[                  //转换成元素为 egret.ITextElement 的数组
            //         { text: "[世界]", style: { "textColor": 0xb463ff } }
            //         , { text: vo.player_name, style: { "underline": true, "textColor": 0x01acfe } }
            //         , { text: vo.content }
            //     ];
            default:

                return <Array<egret.ITextElement>>[                  //转换成元素为 egret.ITextElement 的数组
                    { text: "[世界]", style: { "textColor": 0xb463ff, fontFamily: "SimHei" } }
                    , { text: vo.player_name, style: { "underline": true, "textColor": 0x01acfe, fontFamily: "SimHei" } }
                    , { text: "：", style: { "textColor": 0x01acfe, fontFamily: "SimHei" } }
                    , { text: vo.content, style: { "textColor": 0xbfbfbf, fontFamily: "SimHei" } }
                ];
        }

    }

  
    //天梯争霸
    public static getTierIcon(tier: number) {

        switch (tier) {
            case 1:
                return "labber_huizhang_qingtong_png";
            case 2:
                return "labber_huizhang_baiyin_png";
            case 3:
                return "labber_huizhang_huangjin_png";
            case 4:
                return "labber_huizhang_zuanshi_png";
        }
        return "";
    }


    public static getTierLvName(lv: number) {
        let str = "";
        switch (lv) {
            case 1:
                str = "一阶";
                break;
            case 2:
                str = "二阶";
                break;
            case 3:
                str = "三阶";
                break;
            case 4:
                str = "四阶";
                break;
            case 5:
                str = "五阶";
                break;

        }
        return str;

    }

    public static getTierName(tier: number) {
        let str = "";
        switch (tier) {
            case 1:
                str = "倔强青铜";
                break;
            case 2:
                str = "秩序白银";
                break;
            case 3:
                str = "荣耀黄金";
                break;
            case 4:
                str = "永恒钻石";
                break;

        }
        return str;
    }

    public static getCareerPic(sex: number, career: number) {
        switch (career) {

            case CareerType.SOLDIER:
                if (sex == ConstSex.MAN)
                    return "10001_png";
                else
                    return "10002_png";

            case CareerType.MAGES:
                if (sex == ConstSex.MAN)
                    return "20001_png";
                else
                    return "20002_png";

            case CareerType.TAOIST:
                if (sex == ConstSex.MAN)
                    return "30001_png";
                else
                    return "30001_png";


        }


    }
}
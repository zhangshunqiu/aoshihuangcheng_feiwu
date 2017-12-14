module game {
	export class InvestUtil {
		public constructor() {
		}
		public static getFormatBySecond1(t: number = 0): string {
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
	}
}
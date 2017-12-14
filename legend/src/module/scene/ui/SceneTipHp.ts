/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 场景气血提示 2017/06/20
 * 
 */
class SceneTipsHp extends egret.DisplayObjectContainer {
    public static TIP_ID_ADD:number = 1; 
    public nameText:egret.BitmapText;
    public ex:number;
    public ey:number;
    public id:number;

	public yy:number;
	public constructor() {
        super();
        SceneTipsHp.TIP_ID_ADD++;
        this.id = SceneTipsHp.TIP_ID_ADD;
        this.updateName();
	}
    public updateName():void{
		if(this.nameText == null){
			this.nameText = new egret.BitmapText();
			this.addChild( this.nameText);
             this.nameText.font = RES.getRes("numStyleHp_fnt");
			// this.nameText.width = 270;
			// this.nameText.height = 70;
			//this.nameText.textColor = 0xff0000;
			this.nameText.textAlign = egret.HorizontalAlign.CENTER;
       		// this.nameText.verticalAlign = egret.VerticalAlign.MIDDLE;
			//this.nameText.strokeColor = 0x000000;
			//this.nameText.stroke = 1;
			//this.nameText.italic = true;
			//this.nameText.size = 26;
			this.nameText.cacheAsBitmap = true;
		}
		// if(this.nameText.text != this.vo.name){
		// 	this.nameText.text = this.vo.name+this.vo.id;
		// 	this.nameText.x = 0 - this.nameText.textWidth/2;
		// 	this.nameText.y = 0 - this.nameText.textHeight/2-24 -120;
		// }
	}

	/**
	 * 设置文本
	 * @param value 气血数值 >0加血 <0 掉血
	 * @param type 类型 0正常气血  1 闪避 2暴击 3反弹
	 */
    public setText(value:number,type:number=0){
		var str:string
		if(value>0){
			str = "+"+String(value).replace("0","a").replace("1","b").replace("2","c").replace("3","d").replace("4","e").replace("5","f").replace("6","g").replace("7","h").replace("8","i").replace("9","j");
		}else{
			str = String(value);
		}
      	if(type == HpTipsType.CRIT){
			this.nameText.text = "op"+str;
		}else if(type == HpTipsType.DODGE){
			this.nameText.text = "st";
		}else if(type == HpTipsType.REBOUND){
			this.nameText.text = "qr"+str;
		}else{
			this.nameText.text = str;
		}
    }
	
    public moveTo(ex:number,ey:number){
        this.x = ex - 16 - this.nameText.width/2,
		this.y = ey-110 - Math.round(Math.random()*20);
		this.yy =1;
        this.ex = this.x;
        this.ey = this.y -160;
    }
    /**
     * 更新
     */
    public update():Boolean{
        if(Math.abs(this.y-this.ey)<5){
            this.destroy();
            return false;
        }else{
			// this.x = Math.round(this.x+(this.ex - this.x)/5);
			this.y = Math.round(this.y+(this.ey - this.y)/5);
        }
        return true;
    }

     public destroy(){
		//  this.x = 0;
		//  this.y = 0;
         if(this.parent)
         this.parent.removeChild(this);
         ObjectPool.push(this);
     }
}

//2正常气血  1 闪避 3暴击 4反弹
const enum HpTipsType {
    ONLYHP = 2,            
    DODGE = 1,     
	CRIT = 3,
	REBOUND = 4,
}
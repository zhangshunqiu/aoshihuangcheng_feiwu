

module game {

    export class ChatVo {
        public channel: number;
        public player_id: number;
        public player_name: string;
        public sex:number;
        public career:number;
        public position_id: number;
        public vip_id: number;
        public is_monthcard:boolean;
        public time: number;
        public content: string;
        public type: ChatType;
        public config_id:number;
        public  args:Array<any> = [];
        
    }


	export class TextItemVO
	{
		public word:string;
        public color:number = 0;
        public tap:string = "";
	}




}
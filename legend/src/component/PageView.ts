
enum PageView_Direction {
    Horizonal,
    vertical
}
class PageView extends eui.Component implements eui.ICollection {
    private _group: eui.Group;  //接受touch事件的组
    private _container: eui.Group;  //
    public length: number;
    public itemRenderer: any;
    private _dataProvider: eui.ICollection; //数据集
    private _currentIndex: number;  //当前index
    private itemRenderList: Array<PageViewItem> = [];//子项列表，最多不超3个
    private _direction: PageView_Direction = PageView_Direction.Horizonal;
    private _beginPos: any = {};  //点击开始位置
    private _beginPosArr: any = {};
    private _tabbarEnabled: boolean = false; //显示页码
    private _tabbar: eui.TabBar = new eui.TabBar();
    public constructor() {
        super();
        this.once(egret.Event.REMOVED_FROM_STAGE, () => {

        }, this);
        this._group = new eui.Group();
        this.addChild(this._group);
    }

    set dataProvider(data) {
        this._dataProvider = data;
        this._tabbar.dataProvider = data;
        this._currentIndex = 0;
        this._tabbar.selectedIndex = 0;
        this.startRender();
    }

    set currentIndex(index) {
        if (this._currentIndex == index) {
            return;
        }
        this._currentIndex = index;
        this._tabbar.selectedIndex = index;
        this.refresh();
        App.EventSystem.dispatchEvent(PanelNotify.PAGE_CURRENTINDEX_UPDATE);
    }

    get currentIndex() {
        return this._currentIndex;
    }

    set direction(direction) {
        this._direction = direction;
        this.updateTabbar();
    }

    protected childrenCreated() {
        super.childrenCreated();
        this._container = new eui.Group();
        this._container.left = this._container.right = this._container.top = this._container.bottom = 0;
        this._container.touchEnabled = true;
        // this.addChild(this._container);

        
        this._group.mask = new egret.Rectangle(0, 0, this.width, this.height);
        // this._group.touchThrough = true;
        this._group.left = this._group.right = this._group.top = this._group.bottom = 0;
        this._group.touchEnabled = true;
        

        this._group.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.ontouchstart, this, true);
        // this._group.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.ontouchmove, this,true);
        this._group.addEventListener(egret.TouchEvent.TOUCH_END, this.ontouchend, this, true);
        // this._group.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.ontouchcancel, this, true);
        this._group.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.ontouchcancel, this, true);
        // let rect = new eui.Rect(this.width, this.height, 0x888888);
        // this.addChild(rect);
        // this._tabbar = new eui.TabBar();
        this._tabbar.itemRendererSkinName = "skins.PageViewDotSkin";
        this._tabbar.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.tabbarChanged, this);
        this.addChild(this._tabbar);
        this.updateTabbar();
        this._currentIndex = 0;

    }

    protected ontouchstart(event: egret.TouchEvent) {
        // console.log("beginnnnnnn");
        this.reset();
        this._beginPos.x = event.stageX;
        this._beginPos.y = event.stageY;
        this.itemRenderList.forEach((value, index, array) => {
            this._beginPosArr[index] = { x: value.x, y: value.y };
        }, this);
        // event.stopPropagation();
        this._group.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.ontouchmove, this);
    }

    protected ontouchmove(event: egret.TouchEvent) {
        // console.log("moveeeeee", event);
        let offset = 0;
        if (this._direction == PageView_Direction.Horizonal) {
            offset = event.stageX - this._beginPos.x;
        } else {
            offset = event.stageY - this._beginPos.y;
        }
        this.handleOffset(offset);
        if (Math.abs(offset) > this.width / 2) {
            // console.log("stopppp");
            // event.stopImmediatePropagation();
            // this._group.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.ontouchmove, this);
        }
        event.stopImmediatePropagation();
    }

    protected ontouchend(event: egret.TouchEvent) {
        // console.log("endddddddd");
        let offset = 0;
        if (this._direction == PageView_Direction.Horizonal) {
            offset = event.stageX - this._beginPos.x;
        } else {
            offset = event.stageY - this._beginPos.y;
        }
        if (Math.abs(offset) == 0) {

        } else if (Math.abs(offset) < this.width / 3) {
            // console.log("bound");
            this.boundAnimate();
            event.stopImmediatePropagation();
            this._group.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.ontouchmove, this);
        } else {
            // console.log("slide");
            if (offset < 0) { //向左或向上 index+
                // console.log("indxxxx",this._currentIndex,this._dataProvider.length);
                if (this._currentIndex == this._dataProvider.length - 1) {
                    this.boundAnimate();
                } else {
                    this.slideAnimate(1);
                }

            } else {  //向右或向下 index--
                if (this._currentIndex == 0) {
                    this.boundAnimate();
                } else {
                    this.slideAnimate(-1);
                }
            }
            event.stopImmediatePropagation();
            this._group.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.ontouchmove, this);

        }
    }

    protected ontouchcancel(event: egret.TouchEvent) {
        // console.log("canelllllll");
        // this.boundAnimate();
        this._group.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.ontouchmove, this);
        this.refresh();
    }

    private updateTabbar() {
        if (this._tabbarEnabled) {
            this._tabbar.visible = true;
        } else {
            this._tabbar.visible = false;
        }
        if (this._direction == PageView_Direction.Horizonal) {
            this._tabbar.height = 30;
            // this._tabbar.width = null;
            this._tabbar.horizontalCenter = 0;
            this._tabbar.bottom = - 30;
        } else if (this._direction == PageView_Direction.vertical) {
            // this._tabbar.height = null;
            this._tabbar.width = 30;
            this.verticalCenter = 0;
            this._tabbar.left = -30;
        }
    }

    private tabbarChanged(event: eui.ItemTapEvent) {
        let index = event.itemIndex;
        this.jumpToPages(index);
    }

    private slideAnimate(direction) {
        this._group.touchEnabled = false;
        let count = 0; //计数
        this.itemRenderList.forEach((value, index, array) => {
            let finalX = this._beginPosArr[index].x;
            let finalY = this._beginPosArr[index].y;
            if (this._direction == PageView_Direction.Horizonal) {
                egret.Tween.get(value).to({ x: finalX - direction * this.width }, 300, egret.Ease.sineOut).call(() => {
                    // App.logzrj("slide",value.x);
                    count++;
                    if (count == array.length) { //只运行一次
                        this.currentIndex = this._currentIndex + direction;
                        // this.refresh();
                        this._group.touchEnabled = true;
                    }

                });
            } else {
                egret.Tween.get(value).to({ y: finalY - direction * this.height }, 300, egret.Ease.sineOut).call(() => {
                    count++;
                    if (count == array.length) { //只运行一次
                        this._currentIndex = this._currentIndex + direction;
                        // this.refresh();
                        this._group.touchEnabled = true;
                    }
                });
            }

        }, this)
    }

    private boundAnimate() {
        this._group.touchEnabled = false;
        this.itemRenderList.forEach((value, index, array) => {
            let finalX = this._beginPosArr[index].x;
            let finalY = this._beginPosArr[index].y;
            egret.Tween.get(value).to({ x: finalX, y: finalY }, 300, egret.Ease.sineInOut).call(() => {
                this._group.touchEnabled = true;
                if (index == array.length - 1) { //只运行一次
                    this.reset();
                }
            });
        }, this)
    }

    //设置偏移
    private handleOffset(offset) {
        this.itemRenderList.forEach((value, index, array) => {
            if (this._direction == PageView_Direction.Horizonal) {
                (<PageViewItem>value).x = this._beginPosArr[index].x + offset;
            } else {
                (<PageViewItem>value).y = this._beginPosArr[index].y + offset;
            }

        }, this)
    }

    //重置页面偏移位置
    private reset() {
        this.itemRenderList.forEach((value, index, array) => {
            if (this._currentIndex == 0) {
                if (this._direction == PageView_Direction.Horizonal) {
                    (<PageViewItem>value).x = this.width * (index);
                } else {
                    (<PageViewItem>value).y = this.height * (index);
                }
            } else if (this._currentIndex == this._dataProvider.length - 1) {
                if (this._direction == PageView_Direction.Horizonal) {
                    (<PageViewItem>value).x = this.width * (index - array.length + 1);
                } else {
                    (<PageViewItem>value).y = this.height * (index - array.length + 1);
                }
            } else {
                if (this._direction == PageView_Direction.Horizonal) {
                    (<PageViewItem>value).x = this.width * (index - 1);
                } else {
                    (<PageViewItem>value).y = this.height * (index - 1);
                }
            }
        }, this)
    }

    //重绘数据
    private refresh() {
        this.itemRenderList.forEach((value, index, array) => {
            if (this._currentIndex == 0) {
                if (this._direction == PageView_Direction.Horizonal) {
                    (<PageViewItem>value).x = this.width * (index);
                } else {
                    (<PageViewItem>value).y = this.height * (index);
                }
                (<PageViewItem>value).reload.call(value, this._dataProvider.getItemAt(index));
            } else if (this._currentIndex == this._dataProvider.length - 1) {
                if (this._direction == PageView_Direction.Horizonal) {
                    (<PageViewItem>value).x = this.width * (index - array.length + 1);
                } else {
                    (<PageViewItem>value).y = this.height * (index - array.length + 1);
                }
                (<PageViewItem>value).reload.call(value, this._dataProvider.getItemAt(this._currentIndex + index - array.length + 1));
            } else {
                if (this._direction == PageView_Direction.Horizonal) {
                    (<PageViewItem>value).x = this.width * (index - 1);
                } else {
                    (<PageViewItem>value).y = this.height * (index - 1);
                }
                (<PageViewItem>value).reload.call(value, this._dataProvider.getItemAt(this._currentIndex + index - 1));
            }
            //  App.logzrj("refresh  ",value.x);
        }, this)
    }

    getItemAt(index: number): any {
        return this.itemRenderList[index];
    }

    getItemIndex(item: any): number {
        return this.getChildIndex(item);
    }

    private startRender() {
        if (this.itemRenderList.length < 3 && this.itemRenderList.length < this._dataProvider.length) { //有啦 不够
            for (let i = this.itemRenderList.length; i < this._dataProvider.length; i++) {
                if (this.itemRenderList.length == 3) { //最多三个
                    break;
                }
                let clazz = new this.itemRenderer();
                this.itemRenderList.push(clazz);
                this._group.addChild(clazz);
            }
        } else if (this.itemRenderList.length != 0 && this.itemRenderList.length >= this._dataProvider.length) {  //多出来了
            for (let i = this._dataProvider.length; i < this.itemRenderList.length; i++) {
                let view = this.itemRenderList.pop();
                this._group.removeChild(view);
            }
        }

        //重新装填数据
        this.itemRenderList.forEach((value, index, array) => {
            if (this._direction == PageView_Direction.Horizonal) {
                (<PageViewItem>value).x = this.width * (index);
            } else {
                (<PageViewItem>value).y = this.height * (index);
            }
            (<PageViewItem>value).reload.call(value, this._dataProvider.getItemAt(index));
        }, this)

        this.setChildIndex(this._group, 0);
    }
    /*************外部暴露函数****************/

    /**
     * 是否显示tabbar
     * @param enabled boolean
    */
    public setTabbarEnabled(enabled) {
        if (enabled != this._tabbarEnabled) {
            this._tabbarEnabled = enabled;
            this.updateTabbar();
        }
    }

    public setTabbarOffset(offset) {
        if (this._tabbarEnabled) {
            if (this._direction == PageView_Direction.Horizonal) {
                this._tabbar.bottom = offset;
            } else if (this._direction == PageView_Direction.vertical) {
                this._tabbar.left = offset;
            }
        }
    }

    /**
     * 跳转到指定页
     * @param index 页码 从0开始
    */
    public jumpToPages(index) {
        if (index >= this._dataProvider.length) { //超过，跳到最后一页
            this.currentIndex = this._dataProvider.length - 1;
        } else if (index < 0) {
            this.currentIndex = 0;
        } else {
            this.currentIndex = index;
        }
    }

}

class PageViewItem extends eui.Component {
    public data: any;
    public index: number;

    public constructor() {
        super();
    }

    public reload(data) {
        console.log(data);
    }
}
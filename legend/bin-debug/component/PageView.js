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
var PageView_Direction;
(function (PageView_Direction) {
    PageView_Direction[PageView_Direction["Horizonal"] = 0] = "Horizonal";
    PageView_Direction[PageView_Direction["vertical"] = 1] = "vertical";
})(PageView_Direction || (PageView_Direction = {}));
var PageView = (function (_super) {
    __extends(PageView, _super);
    function PageView() {
        var _this = _super.call(this) || this;
        _this.itemRenderList = []; //子项列表，最多不超3个
        _this._direction = PageView_Direction.Horizonal;
        _this._beginPos = {}; //点击开始位置
        _this._beginPosArr = {};
        _this._tabbarEnabled = false; //显示页码
        _this._tabbar = new eui.TabBar();
        _this.once(egret.Event.REMOVED_FROM_STAGE, function () {
        }, _this);
        _this._group = new eui.Group();
        _this.addChild(_this._group);
        return _this;
    }
    Object.defineProperty(PageView.prototype, "dataProvider", {
        set: function (data) {
            this._dataProvider = data;
            this._tabbar.dataProvider = data;
            this._currentIndex = 0;
            this._tabbar.selectedIndex = 0;
            this.startRender();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageView.prototype, "currentIndex", {
        get: function () {
            return this._currentIndex;
        },
        set: function (index) {
            if (this._currentIndex == index) {
                return;
            }
            this._currentIndex = index;
            this._tabbar.selectedIndex = index;
            this.refresh();
            App.EventSystem.dispatchEvent(PanelNotify.PAGE_CURRENTINDEX_UPDATE);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageView.prototype, "direction", {
        set: function (direction) {
            this._direction = direction;
            this.updateTabbar();
        },
        enumerable: true,
        configurable: true
    });
    PageView.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
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
        this._group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ontouchtap, this, true);
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
    };
    PageView.prototype.ontouchstart = function (event) {
        var _this = this;
        // console.log("beginnnnnnn");
        this.reset();
        this._beginPos.x = event.stageX;
        this._beginPos.y = event.stageY;
        this.itemRenderList.forEach(function (value, index, array) {
            _this._beginPosArr[index] = { x: value.x, y: value.y };
        }, this);
        // event.stopPropagation();
        this._group.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.ontouchmove, this);
    };
    PageView.prototype.ontouchmove = function (event) {
        // console.log("moveeeeee", event);
        var offset = 0;
        if (this._direction == PageView_Direction.Horizonal) {
            offset = event.stageX - this._beginPos.x;
        }
        else {
            offset = event.stageY - this._beginPos.y;
        }
        this.handleOffset(offset);
        if (Math.abs(offset) > this.width / 2) {
            // console.log("stopppp");
            // event.stopImmediatePropagation();
            // this._group.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.ontouchmove, this);
        }
        event.stopImmediatePropagation();
    };
    PageView.prototype.ontouchend = function (event) {
        // console.log("endddddddd");
        var offset = 0;
        if (this._direction == PageView_Direction.Horizonal) {
            offset = event.stageX - this._beginPos.x;
        }
        else {
            offset = event.stageY - this._beginPos.y;
        }
        if (Math.abs(offset) == 0) {
        }
        else if (Math.abs(offset) < this.width / 3) {
            // console.log("bound");
            this.boundAnimate();
            event.stopImmediatePropagation();
            this._group.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.ontouchmove, this);
        }
        else {
            // console.log("slide");
            if (offset < 0) {
                // console.log("indxxxx",this._currentIndex,this._dataProvider.length);
                if (this._currentIndex == this._dataProvider.length - 1) {
                    this.boundAnimate();
                }
                else {
                    this.slideAnimate(1);
                }
            }
            else {
                if (this._currentIndex == 0) {
                    this.boundAnimate();
                }
                else {
                    this.slideAnimate(-1);
                }
            }
            event.stopImmediatePropagation();
            this._group.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.ontouchmove, this);
        }
    };
    PageView.prototype.ontouchtap = function (event) {
        var offset = 0;
        if (this._direction == PageView_Direction.Horizonal) {
            offset = event.stageX - this._beginPos.x;
        }
        else {
            offset = event.stageY - this._beginPos.y;
        }
        if (Math.abs(offset) == 0) {
        }
        else {
            event.stopImmediatePropagation();
        }
    };
    PageView.prototype.ontouchcancel = function (event) {
        // console.log("canelllllll");
        // this.boundAnimate();
        this._group.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.ontouchmove, this);
        this.refresh();
    };
    PageView.prototype.updateTabbar = function () {
        if (this._tabbarEnabled) {
            this._tabbar.visible = true;
        }
        else {
            this._tabbar.visible = false;
        }
        if (this._direction == PageView_Direction.Horizonal) {
            this._tabbar.height = 30;
            // this._tabbar.width = null;
            this._tabbar.horizontalCenter = 0;
            this._tabbar.bottom = -30;
        }
        else if (this._direction == PageView_Direction.vertical) {
            // this._tabbar.height = null;
            this._tabbar.width = 30;
            this.verticalCenter = 0;
            this._tabbar.left = -30;
        }
    };
    PageView.prototype.tabbarChanged = function (event) {
        var index = event.itemIndex;
        this.jumpToPages(index);
    };
    PageView.prototype.slideAnimate = function (direction) {
        var _this = this;
        this._group.touchEnabled = false;
        var count = 0; //计数
        this.itemRenderList.forEach(function (value, index, array) {
            var finalX = _this._beginPosArr[index].x;
            var finalY = _this._beginPosArr[index].y;
            if (_this._direction == PageView_Direction.Horizonal) {
                egret.Tween.get(value).to({ x: finalX - direction * _this.width }, 300, egret.Ease.sineOut).call(function () {
                    // App.logzrj("slide",value.x);
                    count++;
                    if (count == array.length) {
                        _this.currentIndex = _this._currentIndex + direction;
                        // this.refresh();
                        _this._group.touchEnabled = true;
                    }
                    if (_this.slideCallback) {
                        _this.slideCallback();
                    }
                });
            }
            else {
                egret.Tween.get(value).to({ y: finalY - direction * _this.height }, 300, egret.Ease.sineOut).call(function () {
                    count++;
                    if (count == array.length) {
                        _this._currentIndex = _this._currentIndex + direction;
                        // this.refresh();
                        _this._group.touchEnabled = true;
                    }
                    if (_this.slideCallback) {
                        _this.slideCallback();
                    }
                });
            }
        }, this);
    };
    PageView.prototype.boundAnimate = function () {
        var _this = this;
        this._group.touchEnabled = false;
        this.itemRenderList.forEach(function (value, index, array) {
            var finalX = _this._beginPosArr[index].x;
            var finalY = _this._beginPosArr[index].y;
            egret.Tween.get(value).to({ x: finalX, y: finalY }, 300, egret.Ease.sineInOut).call(function () {
                _this._group.touchEnabled = true;
                if (index == array.length - 1) {
                    _this.reset();
                }
            });
        }, this);
    };
    //设置偏移
    PageView.prototype.handleOffset = function (offset) {
        var _this = this;
        this.itemRenderList.forEach(function (value, index, array) {
            if (_this._direction == PageView_Direction.Horizonal) {
                value.x = _this._beginPosArr[index].x + offset;
            }
            else {
                value.y = _this._beginPosArr[index].y + offset;
            }
        }, this);
    };
    //重置页面偏移位置
    PageView.prototype.reset = function () {
        var _this = this;
        this.itemRenderList.forEach(function (value, index, array) {
            if (_this._currentIndex == 0) {
                if (_this._direction == PageView_Direction.Horizonal) {
                    value.x = _this.width * (index);
                }
                else {
                    value.y = _this.height * (index);
                }
            }
            else if (_this._currentIndex == _this._dataProvider.length - 1) {
                if (_this._direction == PageView_Direction.Horizonal) {
                    value.x = _this.width * (index - array.length + 1);
                }
                else {
                    value.y = _this.height * (index - array.length + 1);
                }
            }
            else {
                if (_this._direction == PageView_Direction.Horizonal) {
                    value.x = _this.width * (index - 1);
                }
                else {
                    value.y = _this.height * (index - 1);
                }
            }
        }, this);
    };
    //重绘数据
    PageView.prototype.refresh = function () {
        var _this = this;
        this.itemRenderList.forEach(function (value, index, array) {
            if (_this._currentIndex == 0) {
                if (_this._direction == PageView_Direction.Horizonal) {
                    value.x = _this.width * (index);
                }
                else {
                    value.y = _this.height * (index);
                }
                value.reload.call(value, _this._dataProvider.getItemAt(index));
            }
            else if (_this._currentIndex == _this._dataProvider.length - 1) {
                if (_this._direction == PageView_Direction.Horizonal) {
                    value.x = _this.width * (index - array.length + 1);
                }
                else {
                    value.y = _this.height * (index - array.length + 1);
                }
                value.reload.call(value, _this._dataProvider.getItemAt(_this._currentIndex + index - array.length + 1));
            }
            else {
                if (_this._direction == PageView_Direction.Horizonal) {
                    value.x = _this.width * (index - 1);
                }
                else {
                    value.y = _this.height * (index - 1);
                }
                value.reload.call(value, _this._dataProvider.getItemAt(_this._currentIndex + index - 1));
            }
            //  App.logzrj("refresh  ",value.x);
        }, this);
    };
    PageView.prototype.getItemAt = function (index) {
        return this.itemRenderList[index];
    };
    PageView.prototype.getItemIndex = function (item) {
        return this.getChildIndex(item);
    };
    PageView.prototype.startRender = function () {
        var _this = this;
        if (this.itemRenderList.length < 3 && this.itemRenderList.length < this._dataProvider.length) {
            for (var i = this.itemRenderList.length; i < this._dataProvider.length; i++) {
                if (this.itemRenderList.length == 3) {
                    break;
                }
                var clazz = new this.itemRenderer();
                this.itemRenderList.push(clazz);
                this._group.addChild(clazz);
            }
        }
        else if (this.itemRenderList.length != 0 && this.itemRenderList.length >= this._dataProvider.length) {
            for (var i = this._dataProvider.length; i < this.itemRenderList.length; i++) {
                var view = this.itemRenderList.pop();
                this._group.removeChild(view);
            }
        }
        //重新装填数据
        this.itemRenderList.forEach(function (value, index, array) {
            if (_this._direction == PageView_Direction.Horizonal) {
                value.x = _this.width * (index);
            }
            else {
                value.y = _this.height * (index);
            }
            value.reload.call(value, _this._dataProvider.getItemAt(index));
        }, this);
        this.setChildIndex(this._group, 0);
    };
    /*************外部暴露函数****************/
    /**
     * 是否显示tabbar
     * @param enabled boolean
    */
    PageView.prototype.setTabbarEnabled = function (enabled) {
        if (enabled != this._tabbarEnabled) {
            this._tabbarEnabled = enabled;
            this.updateTabbar();
        }
    };
    PageView.prototype.setTabbarOffset = function (offset) {
        if (this._tabbarEnabled) {
            if (this._direction == PageView_Direction.Horizonal) {
                this._tabbar.bottom = offset;
            }
            else if (this._direction == PageView_Direction.vertical) {
                this._tabbar.left = offset;
            }
        }
    };
    /**
     * 跳转到指定页
     * @param index 页码 从0开始
    */
    PageView.prototype.jumpToPages = function (index) {
        if (index >= this._dataProvider.length) {
            this.currentIndex = this._dataProvider.length - 1;
        }
        else if (index < 0) {
            this.currentIndex = 0;
        }
        else {
            this.currentIndex = index;
        }
    };
    /**
     * 取消翻页
     */
    PageView.prototype.cancelSlide = function () {
        this._group.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.ontouchstart, this, true);
        this._group.removeEventListener(egret.TouchEvent.TOUCH_END, this.ontouchend, this, true);
        this._group.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.ontouchcancel, this, true);
        this._group.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.ontouchtap, this, true);
    };
    return PageView;
}(eui.Component));
__reflect(PageView.prototype, "PageView", ["eui.ICollection", "egret.IEventDispatcher"]);
var PageViewItem = (function (_super) {
    __extends(PageViewItem, _super);
    function PageViewItem() {
        return _super.call(this) || this;
    }
    PageViewItem.prototype.reload = function (data) {
        console.log(data);
    };
    return PageViewItem;
}(eui.Component));
__reflect(PageViewItem.prototype, "PageViewItem");
//# sourceMappingURL=PageView.js.map
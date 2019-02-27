(function(){


    function Init(options){
        this.parent = options.parent;
        this.images = options.images;
        this.directon  = options.direction || "next";
        this.width = options.width || $(this.parent).width();
        this.height = options.height || $(this.parent).height();
        this.autoTime = options.autoTime || 2000;
        this.nowIndex = options.nowIndex || 0;
        this.lock = false;
        this.timer = null;
        this.imgNum = options.images.length;

        this.createDom();
        this.addCss();
        this.bindEvent();
        this.autoMove();
        this.changeIndex();
    }
    // 创建DOM结构
    Init.prototype.createDom = function () {
        var imgContent = $('<ul class="imgContent"></ul>')
        var pointer = $('<div class="pointer"></div>');
        for (var i = 0; i < this.imgNum; i++) {
            $('<li><img src="'+ this.images[i] +'"/></li>').appendTo(imgContent);
            $('<div></div>').appendTo(pointer);
        }
        // 插入最后一个li  内容与第一张一样
        imgContent.append($('<li><img src="'+ this.images[0] +'"/></li>'));
        $(this.parent).append(imgContent)
                      .append($('<div class="btn left-btn">&lt;</div>'))
                      .append($('<div class="btn right-btn">&gt;</div>'))
                      .append(pointer);
    }
    // 处理样式
    Init.prototype.addCss = function () {
        $('.imgContent', this.parent).css({
            position: 'absolute',
            width: this.width * (this.imgNum + 1),
            fontSize: '0px',
            left: 0,
        });
        $('.imgContent > li', this.parent).css({
            width: this.width,
            height: this.height,
            display: 'inline-block',
        });
        $('.imgContent > li > img', this.parent).css({
            width: '100%',
            height: '100%',
        });
        $('.btn', this.parent).css({
            // 用户可以定义按钮颜色 和背景颜色 留给同学们
            width: 50,
            height: 50,
            background: '#eee',
            position: 'absolute',
            top: '50%',
            'margin-top': -25,
            lineHeight: '50px',
            textAlign: 'center',
            fontSize: 24,
            cursor: 'pointer',
            opacity: 0.5,
            display: 'none',
        });
        $('.btn.left-btn', this.parent).css({
            left: 0,
        });
        $('.btn.right-btn', this.parent).css({
            right: 0,
        });
        $('.pointer', this.parent).css({
            position: 'absolute',
            bottom: '10px',
            width: '100%',
            textAlign: 'center',
        });
        $('.pointer > div', this.parent).css({
            width: 6,
            height: 6,
            display: 'inline-block',
            borderRadius: '50%',
            margin: '0 5px',
            backgroundColor: '#fff',
            cursor: 'pointer',
        });
    }
    // 添加事件
    Init.prototype.bindEvent = function () {
        var self = this;
        $(this.parent).hover(function () {
            $('.btn', self.parent).show();
            clearInterval(self.timer);
        }, function () {
            $('.btn', self.parent).hide();
            self.autoMove();
        });
        $(this.parent).on('click', '.btn', function (e) {
            if ($(this).hasClass('left-btn')) {
                self.move('prev');
            } else if ($(this).hasClass('right-btn')) {
                self.move('next');
            }
        });
        $('.pointer', self.parent).on('click', 'div', function (e) {
            self.move($(this).index());
        });
    }
    // 运动函数 
    Init.prototype.move = function (dir) {
        if (this.lock) {
            return false;
        }
        console.log(dir)
        this.lock = true;
        var self = this;
        if (dir == 'prev') {
            if (this.nowIndex == 0) {
                this.nowIndex = this.imgNum;
                $('ul', this.parent).css('left', -this.nowIndex * this.width);
            }
            this.nowIndex--;
            $('ul', this.parent).animate({
                'left': -this.nowIndex * this.width
            }, 1000, function () {
                self.changeIndex();
                self.lock = false;
            });
        } else if (dir == 'next') {
            if (this.nowIndex == this.imgNum) {
                this.nowIndex = 0;
                $('ul', this.parent).css('left', - this.nowIndex * this.width);
            }
            this.nowIndex++;
            $('ul', this.parent).animate({
                'left':-this.nowIndex * this.width
            }, 1000, function () {
                self.changeIndex();
                self.lock = false;
            });
        } else if (typeof dir == 'number') {
            // 把当前的图片索引值改变到了新的位置 接下来展示图片的索引值
            this.nowIndex = dir;
            $('ul', this.parent).animate({
                'left':-this.nowIndex * this.width
            }, 1000, function () {
                self.changeIndex();
                self.lock = false;
            });
        }
    }
    // 下方的点
    Init.prototype.changeIndex = function () {
        $('.pointer > div', this.parent).css('background', '#fff');
        if (this.nowIndex == this.imgNum) {
            $('.pointer > div', this.parent).eq(0).css('background', 'red');
        } else {
            $('.pointer > div', this.parent).eq(this.nowIndex).css('background', 'red');
        }
    }
    // 自动轮播
    Init.prototype.autoMove = function () {
        var self = this;
        this.timer = setInterval(function () {
            self.move('next');
        }, this.autoTime);
    }
    // 扩展插件
    $.fn.extend({
        swiper: function (options) {
            options.parent = this;
            var swiper = new Init(options);
        }
    });
} ());
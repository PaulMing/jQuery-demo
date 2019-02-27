// 扩展插件采取面向对象的方式 -> 模块化,便于多人协作开发
// 面向对象 -> 每次操作都是new新对象,独立性好；若不采取构造函数的方式，把变量/方法都全局定义，很容易发生冲突；(这些问题前人踩过很多坑，所以面向对象的编程方式真的很nice)
(function(){

    function Init(options){
        // 需要把dom结构插入到的位置
        this.parent = options.parent;
        this.key = options.key || 'callback';
        this.jsonpCallback = options.jsonpCallback || '';
        this.url = options.url;
        this.type = options.type;
        this.inputWidth = options.inputWidth || $(this.parent).width() -100;
        this.height = options.height || $(this.parent).height();
        this.fontSize = options.fontSize || 18;
        this.success = options.success;
        this.dataName = options.dataName;
        this.createDom();
        this.addCss();
        this.bindEvent();
    }
    // 原型链上编程 -> 创建DOM结构
    Init.prototype.createDom = function(){
        var oDiv = $("<div class='cj-input-content'></div>");
        var oInput = $("<input class='cj-input-search'>");
        var oBtn = $('<input class="search-btn" type="button" value="搜索">');
        oDiv.append(oInput).append(oBtn).appendTo(this.parent);
    }
    // 处理样式 -> 直接全部使用js处理样式，其直接添加至行间， -> 避免直接添加<style><style>引入的冲突以及权重问题
    Init.prototype.addCss = function(){
        $('.cj-input-content',this.parent).css({
            // 两种方式都可以让该元素居中，但第二种涉及到了定位，若是父元素本来就有定位，再次更改是对父元素会有影响的，所以采取弹性盒子布局
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
           /*  width: $(this.parent).width(),
            height: $(this.parent).height(),
            top: '50%',
            marginTop: -$(this.parent).height()/2,
            left: '50%',
            marginLeft: -$(this.parent).width(),
            position: 'absolute' */
        })
        $('.cj-input-content>.cj-input-search',this.parent).css({
            height: this.height,
            width: this.inputWidth,
            marginRight: 10,
            fontSize: this.fontSize,
        })
        $('.cj-input-content>.search-btn',this.parent).css({
            width: 50,
            height: this.height,
            fontSize: this.fontSzie,
        })
    }
    // 行为处理(绑定事件处理函数)
    Init.prototype.bindEvent = function(){
        var self = this;
        $('cj-input-content>.cj-input-search',this.parent).on( 'input',function(){
            $.ajax({
                // async:false,
                type: self.type,
                url: self.url,
                data: self.dataName + '='+ $(this).val()+"&code=utf-8",
                dataType: 'jsonp',
                // success: self.success,
                jsonp: self.key,
                jsonpCallback: self.jsonpCallback,
            })
        })
    }
    // 扩展的inputSearch插件
    $.fn.extend({
        inputSearch: function(options){
            options.parent = this,
            new Init(options);
        }
    })
}())


// 小结：扩展插件 -> 面向对象编程new Init(); -> 原型链上编程 -> 创建结构/处理样式/行为处理 -> 部分插件涉及到数据渲染(ajax请求数据)
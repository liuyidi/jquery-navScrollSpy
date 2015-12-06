/**
 * jQuery lightweight plugin boilerplate
 * @file_name jquery.navScrollSpy.js
 * @author liuyidi <liuyidi1993@gmail.com>
 * Licensed under the MIT license
 *
 * example:
 * <ul id="nav">
 *    <li class="current"><a href="#box1">box1</a></li>
 *    <li><a href="#box2">box2</a></li>
 * </ul>
 * $("#nav").navScrollSpy({
 *       current:"",
 *       scrollSpeed: 750
 * });
 * 滚动监听 点击切换 平滑滚动
 */
;(function($, window, document, undefined){

    //pluginName
    var pluginName = "navScrollSpy";
    //defaults options
    var defaults = {
        navItems: 'a',        //元素
        current : 'current',  //当前
        easing : 'swing',   //动效
        speed: 750        //速度
        // duration: y    //方向
    };

    function navScrollSpy(element, options){
        this.element = element;             //获得id=#nav
        this.$ele = $(element);             //获得$("#nav")
        this.options = $.extend({}, defaults, options);   //得到参数值

        this._defaults = defaults;
        this._name = pluginName;

        this.boxs = {};    //定义一个对象用来存放box的top值
        this.init();
    };

    navScrollSpy.prototype = {
        init: function(){
            //得到a元素
            this.$a = this.$ele.find(this.options.navItems);
            //得到内容区Box的top值
            this.getBoxTop();

            //点击切换导航按钮样式,更改上下文this
            this.$a.on("click", $.proxy(this.clickSwitch,this));

            //滚动切换导航按钮
            this.scrolling();

            //当页面重置时会发生问题？
            return this;
        },

        //导航变化
        changeNav: function(self,$parent){
            var current = self.options.current;
            self.$ele.find("."+current).removeClass(current);
            $parent.addClass(current);
        },

        //得到内容区的Top值
        getBoxTop: function(){
            var self = this;
            self.$a.each(function(){
                var boxId = self.$a.attr("href").split('#')[1];
                var boxTop = $("#"+boxId).offset().top;
                //存放boxtop到box对象中去
                self.boxs[boxId] = parseInt(boxTop);
            });
            return self.boxs;
        },

        //根据滚动的值,比较得出滚轮所在的范围
        getPosition: function(){

        },

        //滚动切换
        scrolling: function(){
            var st = $(window).scrollTop();
            var position = this.getPosition(st);   //得到st所在的范围
            var $parent = this.$ele.find('a[href="#'+ position+'"]').parent();

            $(window).bind("scroll",function(){
                if(st >= boxTop - 50){
                    this.changeNav(this,$parent);
                }

            });
        },

        //点击切换
        clickSwitch: function(e){
            var $a = $(e.currentTarget);  //获得当前的a
            var $parent = $a.parent();    //获得a的li元素
            var self = this;
            var target = $a.attr("href"); //新的a #id
            if(!$parent.hasClass(self.options.current)){
                //导航切换
                self.changeNav(self,$parent);

                //滚动开始
                self.scrollTo(target, function(){
                    //callback
                });

            }

            e.preventDefault();   //有current阻止冒泡
        },

        //滚动到某个地方
        scrollTo: function(target, callback){
            //获取目标元素的TOP值
            var offset = $(target).offset().top;
            var $el = $('html,body');
            if(!$el.is(":animated")){
                $el.animate({
                    scrollTop: offset
                }, this.options.speed, this.options.easing,callback);
            }
        }
    };

    $.fn.navScrollSpy = function(options){
        return this.each(function(){
            if(!$.data(this, "plugin_"+pluginName)){
                $.data(this, "plugin_"+pluginName,new navScrollSpy(this, options));
            }
        });
    };

})(jQuery, window, document);
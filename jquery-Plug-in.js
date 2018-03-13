;(function($){
	$.fn.extend({
		"changeStatus":function(options){
			return this.each(function(){
				var _this=$(this);
				var defaults={
					navEl:".navItem",
					contentItem:".contentItem",
					index:0,
					action:"click"
				};
				var obj=$.extend(true, defaults, options);
				function toggeleShow(i){
					_this.find(obj.navEl).eq(i).addClass("active").siblings().removeClass("active");
					_this.find(obj.contentItem).eq(i).show().siblings().hide();
				};
				function init(){
					toggeleShow(obj.index);
					_this.on(obj.action,obj.navEl,function(){
						i=$(this).index();
						toggeleShow(i);
					});
				};
				init();
			});
		},
		"carousel":function(options){
			return this.each(function(){
				var defualts={
					width:800,
					qty:5,
					outerEl:".allContainer",
					listEl:".ListBox",
					itemEl:".item",
				};
				var _this=$(this);
				var obj=$.extend(true, defualts, options);
				var currrent=0;
				function initStyle(){
					var w=0;
					_this.find(obj.outerEl).css({"width":obj.width,"margin":"0 auto","overflow":"hidden"});
					_this.find(obj.itemEl).each(function(i,e){
						w+=parseInt($(e).outerWidth());
					});
					_this.find(obj.listEl).css({"width":w,"overflow":"hidden",});
				};
				_this.find(".btnNext").click(function(){
					doNext();
				});
				_this.find(".btnPrev").click(function(){
					doPrev();
				});
				function animationMove(dis,dir){
					if(dir=="next"){
						_this.find(obj.listEl).animate({"marginLeft":-dis},500,function(){
							_this.find(obj.listEl).append(_this.find(obj.itemEl).first()).css("marginLeft",0);
						})
					}else if(dir=="prev"){
						_this.find(obj.listEl).prepend(_this.find(obj.itemEl).last()).css("marginLeft",-dis).animate({"marginLeft":0},500)
					}
				}
				function doNext(){
					if(!_this.find(obj.listEl).is(":animated")){
						currrent++;
						if(currrent>_this.find(obj.itemEl).length-1){
							currrent=0;
						};
						animationMove(_this.find(obj.itemEl).first().outerWidth(),"next");
					};
				};
				function doPrev(){
					if(!_this.find(obj.listEl).is(":animated")){
						currrent--;
						if(currrent<0){
							currrent=_this.find(obj.itemEl).length-1;
						};
						animationMove(_this.find(obj.itemEl).last().outerWidth(),"prev");
					};
				}
				initStyle();
			});
		},
		"myScroll":function(options) {
			return this.each(function() {
				var defaults = {
					El: "",
					width: 500,
				};
				var _this = $(this);
				var obj = $.extend( defaults, options);
				_this.find(".btnPrev").click(function() {
					sliderMove("prev");
				});
				_this.find(".btnNext").click(function() {
					sliderMove("next");
				});
				function initCss() {
					_this.find(".slideBox").css({
						"width": obj.width,
						"overflow": "hidden"
					});
					_this.find(".slideItem").css({
						"width": obj.width,
						"float": "left"
					});
					_this.find(".slideList").css({
						"width": obj.width * _this.find(".slideItem").length,
						"overflow": "hidden"
					});
				};
				function sliderMove(dir) {
					console.log(-obj.width)
					if(!_this.find(".slideList").is(":animated")) {
						if(dir == "prev") {
							_this.find(".slideList").prepend(_this.find(".slideItem:last")).css("marginLeft", -(_this.find(".slideItem").width())).animate({
								"marginLeft": 0
							}, 500)
						} else if(dir == "next") {
							_this.find(".slideList").animate({
								"marginLeft": -(_this.find(".slideItem").width())
							}, 500, function() {
								_this.find(".slideList").append(_this.find(".slideItem:first")).css("marginLeft", 0);
							})
						}
					}
				};
				initCss();
			})
		},
		"slide":function(obj) {
			return this.each(function(i, e) {
				var defaults = {
					styles: "switched", //fade
					during: 4000,
					autoPlay: true,
					hoverStop: true,
					duration: 500,
					thumb: false,
					current: 0,
					action: "click",
				};
				var options = $.extend(true, defaults, obj);
				var timer;
				var _ths = $(this);
				var len = _ths.find(".slide-content li").length,
					wid = _ths.find(".slide").width();
				//单例模式
				var s = (function() {
					var unique;
					function Slide() {};
					Slide.prototype.effect = function(i) {
						if(options.styles == "switched") {
							if(!_ths.find(".slide-content").is(":animated")) {
								_ths.find(".slide-content").animate({
									"marginLeft": -i * wid
								}, options.duration);
							};
						} else if(options.styles == "fade") {
							_ths.find(".slide-content li").eq(i).fadeIn(options.duration).siblings().fadeOut(options.duration);
						};
						_ths.find(".slide_thumb span").eq(i).addClass("active").siblings().removeClass("active");
					};
					Slide.prototype.effectInit = function(i) {
						if(options.styles == "switched") {
							_ths.find(".slide").css("overflow","hidden");
							_ths.find(".slide-content li").css({
								"float": "left",
								"width": wid
							});
							_ths.find(".slide-content").css({
								"width": wid * len,
								"marginLeft": -i * wid
							});
						} else if(options.styles == "fade") {
							_ths.find(".slide-content").css({
								"widht": wid
							});
							_ths.find(".slide-content li").css("position", "absolute");
							_ths.find(".slide-content li").eq(i).show().css("z-index", 9).siblings().hide().css("z-index", 1);
						};
					};
					unique = new Slide();
					return unique;
				})();
				//初始化插件
				function init() {
					//创建banner数量导航
					if(options.thumb&&len>1) {
						var span = "";
						for(var i = 0; i < len; i++) {
							span += "<span></span>";
						};
						_ths.find(".slide_thumb").html(span);
					};
					//标记当前
					_ths.find(".slide_thumb span").eq(options.current).addClass("active");
					//初始化载入显示
					s.effectInit(options.current);
					window.onload = function() {
						$(".banner-area .slide-content li img").each(function() {
							$(this).css("marginTop", -$(this).height() / 2)
						})
					};
					_ths.find(".slide_thumb").on(options.action, "span", function() {
						var index = $(this).index();
						options.current = index;
						s.effect(options.current);
					});
					if(options.autoPlay) {
						timer = setInterval(function() {
							options.current++;
							if(options.current > len - 1) {
								options.current = 0
							};
							s.effect(options.current);
						}, options.during);
						if(options.hoverStop) {
							_ths.hover(function() {
								clearInterval(timer)
							}, function() {
								timer = setInterval(function() {
									options.current++;
									if(options.current > len - 1) {
										options.current = 0
									};
									s.effect(options.current);
								}, options.during);
							});
						};
					};
				};
				init();
			});
		},
	})
})(jQuery);
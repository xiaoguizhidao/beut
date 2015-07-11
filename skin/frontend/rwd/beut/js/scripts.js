'use strict';
var FEelementControl = {
	equalHeight: function(container){
		var currentTallest = 0,
			currentRowStart = 0,
			rowDivs = [],
			$el = 0;
		$j(container).each(function() {
			$el = $j(this);
			$j($el).height('auto');
			var topPostion = $el.offset().top;
			var currentDiv;
			if (currentRowStart !== topPostion) {
				for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
					rowDivs[currentDiv].height(currentTallest);
				}
				rowDivs.length = 0; // empty the array
				currentRowStart = topPostion;
				currentTallest = $el.height();
				rowDivs.push($el);
			} else {
				rowDivs.push($el);
				currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
			}
			for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
				rowDivs[currentDiv].height(currentTallest);
			}
		});
	},
	calcRowHeight: function(){
		if($j(window).width() > 767){
			if($j('.row2').length > 0){
				$j('.row2').height($j(window).width()*0.4);
				$j('.row2 .item img').each(function(){
					var el = $j(this),
						parent = el.parent();
					var pW = parent.width(),
						pH = parent.height(),
						elW = el.width(),
						elH = el.height(),
						rationp = pW/pH,
						rationel = elW/elH;
					if(rationp > rationel){
						el.css({'width':'100%','height':'auto'});
					}else{
						el.css({'height':'100%','width':'auto'});
					}
				});
			}else{
				$j('.row2,.item img').removeAttr('style');
			}
			if($j('.row4').length > 0){
			//	this.equalHeight('.row4 .item');
				var rItem = $j('.right-item').height();
				$j('.row4 .item:first-child').height(rItem);
				var realHeight = $j('.row4 .content').height(),
					aHeight =  rItem*0.3;
				if(realHeight > aHeight){
					$j('.row4 .content').css('max-height',aHeight);
					$j(".row4 .content").dotdotdot();
				}
			}
			if($j('.row5').length > 0){
				$j('.row5').height($j(window).width()*0.31);
			}
		}else{
			$j('.row4 .item, .row4 .content,.row5,.row2,.item img').removeAttr('style');
		}
	},
	toggleSearchBox: function(){
		$j('#nav').hover(function(){
			if($j('#header-search').hasClass('skip-active')){
				$j('#header-search').removeClass('skip-active');
			}
		});
	},
	stickyTop: function(skinUrl){
		var normal = 1;
		if($j('.cms-home').length > 0 || $j('.catalog-category-view').length > 0){
			normal = 0;
		}
		$j(window).scroll(function() {
			if ($j(this).scrollTop() > 1) {
				if ($j(window).width() > 767) {
					$j('#header').addClass('sticky');
					$j('.header-language-background').hide();
					$j('#header').css({top: 0});
					$j('.logo-large .large').attr("src", skinUrl+"images/logo2.png");
					$j('#header').hover(function(){
						$j('.logo-large .large').attr("src", skinUrl+"images/logo2.png");
					});
				}
			} else {
				$j('#header').removeClass('sticky').removeAttr('style');
				$j('.header-language-background').show();
				if(normal === 1){
					$j('.logo-large .large').attr("src", skinUrl+"images/logo3.png");
				}else{
					$j('.logo-large .large').attr("src", skinUrl+"images/logo.png");
				}

				$j('#header').hover(function(){
					$j('.logo-large .large').attr("src", skinUrl+"images/logo3.png");
				},function(){
					if(normal === 1){
						$j('.logo-large .large').attr("src", skinUrl+"images/logo3.png");
					}else{
						$j('.logo-large .large').attr("src", skinUrl+"images/logo.png");
					}
				});
			}
		});
		if($j(window).scrollTop() > 1){
			$j('#header').addClass('sticky');
			$j('.header-language-background').hide();
			$j('#header').css({top: 0});
			$j('.logo-large .large').attr("src", skinUrl+"images/logo2.png");
			$j('#header').hover(function(){
				$j('.logo-large .large').attr("src", skinUrl+"images/logo2.png");
			});
		}else{
			if(normal === 1){
				$j('.logo-large .large').attr("src", skinUrl+"images/logo3.png");
			}else{
				$j('.logo-large .large').attr("src", skinUrl+"images/logo.png");
			}
		}
	},
	homeProdSlide: function(){
		$j('#lightSlider').slick({
			dots: false,
			infinite: true,
			speed: 300,
			slidesToShow: 7,
			slidesToScroll: 7,
			responsive: [
				{
					breakpoint: 1024,
					settings: {
						slidesToShow: 5,
						slidesToScroll: 5,
						infinite: true,
						dots: true
					}
				},
				{
					breakpoint: 600,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 3,
						dots: true
					}
				},
				{
					breakpoint: 480,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2,
						dots: true
					}
				}
			]
		});
		if($j('.brand').length > 0) {
			$j('.brand').slick({
				dots: false,
				infinite: true,
				speed: 300,
				slidesToShow: 10,
				slidesToScroll: 10,
				swipe: true,
				touchMove: true,
				responsive: [
					{
						breakpoint: 1024,
						settings: {
							slidesToShow: 6,
							slidesToScroll: 6,
							infinite: true,
							dots: true
						}
					},
					{
						breakpoint: 600,
						settings: {
							slidesToShow: 4,
							slidesToScroll: 4
						}
					},
					{
						breakpoint: 480,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 2,
							dots: true
						}
					}
				]
			});
		}
	},
	/*setScrollr: function() {
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {} else {
			var s = skrollr.init();
		}
	},*/

	cmsMenu: function(){
		var url = jQuery(location).attr('href').slice(-1)=='/' ? jQuery(location).attr('href') : jQuery(location).attr('href')+'/';
		jQuery('.block-cms-menu li').each(function(){
			if(jQuery(this).find('a').attr('href') == url){
				jQuery(this).find('a').addClass('current');
				//console.log(jQuery(this).find('a').attr('href'));

			}
		});
	},
	filterToggle: function(){
		jQuery('.block-subtitle--filter').click(function(){
			jQuery(this)
				.toggleClass('active')
				.next()
				.toggleClass('no-display');
		});
	},
	addClassFilter: function(){
		$j('#narrow-by-list > dt').each(function(){
			if($j(this).text() === 'Price'){
				$j(this).next('dd').addClass('price');
			}
		})
	},
	swipeFilter: function(){
		if($j(window).width() > 767){
			var item = $j('#narrow-by-list dt'),
				itemLen = item.length,
				container = $j('#narrow-by-list').width($j(window).width() - 523),
				listW = item.width()*itemLen;
			if(listW > container){
				$j('#narrow-by-list').width(container);
			}
			$j('.mobile-filter').css({'width':$j(window).width()});
		}else{
			$j('#arrow-by-list,.mobile-filter').removeAttr('style');
		}
	},
	categoryFooter: function(){
		if($j(window).width() > 767){
			if($j('.category-footer .category-description').length > 0 && $j('.category-footer .thumb').length > 0){
				this.equalHeight('.category-footer .item');
			}
		}else{
			$j('.category-footer .item').removeAttr('style');
		}

	},
	confProdImage: function(){
		if($j('.amconf-images-container').length > 0){
			if($j('.amconf-image-container').length > 6){
				$j('.amconf-images-container').lightSlider({
					item:6,
					loop:false,
					slideMove:2,
					easing: 'cubic-bezier(0.25, 0, 0.25, 1)',
					speed:600
				});
			}

		}
	},
	calcMenu: function(){
		if($j(window).width() > 767 && $j(window).width() < 1025){

		}
	},
	miniCartPos: function(){
		if($j(window).width() < 768){
			$j('.skip-cart').appendTo('#header .page-header-container');
			$j('#header-cart').appendTo('#header');
		}else{
			$j('.skip-cart').appendTo('.header-language-container .account-cart-wrapper');
			$j('#header-cart').appendTo('.header-language-container .account-cart-wrapper');
		}
	},
	prodSelectBox: function(){
		if($j('.product-options dd select').length > 0){
			$j('.product-options dd select').uniform();
		}
		$j('.shipping-country select').uniform();
	},
	prodSlide: function(){
		$j('.prod-slide').slick({
			dots: true,
			infinite: true,
			speed: 300,
			slidesToShow: 1,
			adaptiveHeight: true
		});
	},
	mediaSlide: function(){
		if($j('#prevGalleryImg').length > 0){
			var len = larImg.length;
			var prev,prevZoom;
			var next,nextZoom;
			$j('body').on('click','#prevGalleryImg',function(){
				for(var i=0;i < len; i++){
					if($j('#amasty_zoom').attr('src')===larImg[i].src){
						if((i-1) == 0 ){
							prev = larImg[len].src;
							prevZoom = larImg[len].zoomimg;
						}else{
							prev = larImg[i-1].src;
							prevZoom = larImg[i-1].zoomimg;
						}
					}
				}
				$j('#amasty_zoom').attr('src',prev);
				$j('#amasty_zoom').attr('data-zoom-image','url('+prevZoom+')');
				$j('.zoomWindow').css('background-image',prevZoom);

			});
			$j('body').on('click','#nextGalleryImg',function(){
				for(var i=0;i < len; i++){
					//console.log(larImg[i].src+'\n');
					if($j('#amasty_zoom').attr('src')===larImg[i].src){
						if((i+1) == len){
							next = larImg[0].src;
							nextZoom = larImg[0].zoomimg;
						}else{
							next = larImg[i+1].src;
							nextZoom = larImg[i+1].zoomimg;
						}
					}
				}
				$j('#amasty_zoom').attr('src',next);
				$j('#amasty_zoom').attr('data-zoom-image',nextZoom);
				$j('.zoomWindow').css('background-image','url('+nextZoom+')');

			});
		}
	},
	voucherToogle: function(){
		$j('body').on('click','.discount h2',function(){
			$j(this).hide();
			$j('.discount-form').show();
		})
	}
};



jQuery(document).ready(function ($) {
	FEelementControl.calcRowHeight();
	FEelementControl.homeProdSlide();
	FEelementControl.cmsMenu();
	FEelementControl.filterToggle();
	FEelementControl.addClassFilter();
	FEelementControl.swipeFilter();
	FEelementControl.confProdImage();
	FEelementControl.miniCartPos();
	FEelementControl.prodSelectBox();
	FEelementControl.prodSlide();
	FEelementControl.mediaSlide();
	FEelementControl.voucherToogle();
	FEelementControl.equalHeight('.category-products .item');
	if($('#leSlide').length > 0){
		var _SlideshowTransitions = [{
			$Duration: 1200,
			$Zoom: 11,
			$Rotate: -1,
			$Easing: {
				$Zoom: $JssorEasing$.$EaseInQuad,
				$Opacity: $JssorEasing$.$EaseLinear,
				$Rotate: $JssorEasing$.$EaseInQuad
			},
			$Opacity: 2,
			$Round: {
				$Rotate: 0.5
			},
			$Brother: {
				$Duration: 1200,
				$Zoom: 1,
				$Rotate: 1,
				$Easing: $JssorEasing$.$EaseSwing,
				$Opacity: 2,
				$Round: {
					$Rotate: 0.5
				},
				$Shift: 90
			}
		}, {
			$Duration: 1400,
			$Zoom: 1.5,
			$FlyDirection: 1,
			$Easing: {
				$Left: $JssorEasing$.$EaseInWave,
				$Zoom: $JssorEasing$.$EaseInSine
			},
			$ScaleHorizontal: 0.25,
			$Opacity: 2,
			$ZIndex: -10,
			$Brother: {
				$Duration: 1400,
				$Zoom: 1.5,
				$FlyDirection: 2,
				$Easing: {
					$Left: $JssorEasing$.$EaseInWave,
					$Zoom: $JssorEasing$.$EaseInSine
				},
				$ScaleHorizontal: 0.25,
				$Opacity: 2,
				$ZIndex: -10
			}
		}, {
			$Duration: 1200,
			$Zoom: 11,
			$Rotate: 1,
			$Easing: {
				$Opacity: $JssorEasing$.$EaseLinear,
				$Rotate: $JssorEasing$.$EaseInQuad
			},
			$Opacity: 2,
			$Round: {
				$Rotate: 1
			},
			$ZIndex: -10,
			$Brother: {
				$Duration: 1200,
				$Zoom: 11,
				$Rotate: -1,
				$Easing: {
					$Opacity: $JssorEasing$.$EaseLinear,
					$Rotate: $JssorEasing$.$EaseInQuad
				},
				$Opacity: 2,
				$Round: {
					$Rotate: 1
				},
				$ZIndex: -10,
				$Shift: 600
			}
		}, {
			$Duration: 1500,
			$Cols: 2,
			$FlyDirection: 1,
			$ChessMode: {
				$Column: 3
			},
			$Easing: {
				$Left: $JssorEasing$.$EaseInOutCubic
			},
			$ScaleHorizontal: 0.5,
			$Opacity: 2,
			$Brother: {
				$Duration: 1500,
				$Opacity: 2
			}
		}, {
			$Duration: 1500,
			$Zoom: 1,
			$Rotate: 0.1,
			$During: {
				$Left: [0.6, 0.4],
				$Top: [0.6, 0.4],
				$Rotate: [0.6, 0.4],
				$Zoom: [0.6, 0.4]
			},
			$FlyDirection: 6,
			$Easing: {
				$Left: $JssorEasing$.$EaseInQuad,
				$Top: $JssorEasing$.$EaseInQuad,
				$Opacity: $JssorEasing$.$EaseLinear,
				$Rotate: $JssorEasing$.$EaseInQuad
			},
			$ScaleHorizontal: 0.3,
			$ScaleVertical: 0.5,
			$Opacity: 2,
			$Brother: {
				$Duration: 1000,
				$Zoom: 11,
				$Rotate: -0.5,
				$Easing: {
					$Opacity: $JssorEasing$.$EaseLinear,
					$Rotate: $JssorEasing$.$EaseInQuad
				},
				$Opacity: 2,
				$Shift: 200
			}
		}, {
			$Duration: 1500,
			$During: {
				$Left: [0.6, 0.4]
			},
			$FlyDirection: 1,
			$Easing: {
				$Left: $JssorEasing$.$EaseInQuad,
				$Opacity: $JssorEasing$.$EaseLinear
			},
			$ScaleHorizontal: 0.3,
			$Opacity: 2,
			$Outside: true,
			$Brother: {
				$Duration: 1000,
				$FlyDirection: 2,
				$Easing: {
					$Left: $JssorEasing$.$EaseInQuad,
					$Opacity: $JssorEasing$.$EaseLinear
				},
				$ScaleHorizontal: 0.3,
				$Opacity: 2
			}
		}, {
			$Duration: 1500,
			$Rotate: 0.1,
			$During: {
				$Left: [0.6, 0.4],
				$Top: [0.6, 0.4],
				$Rotate: [0.6, 0.4]
			},
			$FlyDirection: 10,
			$Easing: {
				$Left: $JssorEasing$.$EaseInQuad,
				$Top: $JssorEasing$.$EaseInQuad,
				$Opacity: $JssorEasing$.$EaseLinear,
				$Rotate: $JssorEasing$.$EaseInQuad
			},
			$ScaleHorizontal: 0.1,
			$ScaleVertical: 0.7,
			$Opacity: 2,
			$Brother: {
				$Duration: 1000,
				$Rotate: -0.1,
				$FlyDirection: 5,
				$Easing: {
					$Left: $JssorEasing$.$EaseInQuad,
					$Top: $JssorEasing$.$EaseInQuad,
					$Opacity: $JssorEasing$.$EaseLinear,
					$Rotate: $JssorEasing$.$EaseInQuad
				},
				$ScaleHorizontal: 0.2,
				$ScaleVertical: 0.5,
				$Opacity: 2
			}
		}, {
			$Duration: 1600,
			$Delay: 40,
			$Cols: 12,
			$During: {
				$Left: [0.4, 0.6]
			},
			$SlideOut: true,
			$FlyDirection: 2,
			$Formation: $JssorSlideshowFormations$.$FormationStraight,
			$Assembly: 260,
			$Easing: {
				$Left: $JssorEasing$.$EaseInOutExpo,
				$Opacity: $JssorEasing$.$EaseInOutQuad
			},
			$ScaleHorizontal: 0.2,
			$Opacity: 2,
			$Outside: true,
			$Round: {
				$Top: 0.5
			},
			$Brother: {
				$Duration: 1000,
				$Delay: 40,
				$Cols: 12,
				$FlyDirection: 1,
				$Formation: $JssorSlideshowFormations$.$FormationStraight,
				$Assembly: 1028,
				$Easing: {
					$Left: $JssorEasing$.$EaseInOutExpo,
					$Opacity: $JssorEasing$.$EaseInOutQuad
				},
				$ScaleHorizontal: 0.2,
				$Opacity: 2,
				$Round: {
					$Top: 0.5
				}
			}
		}, {
			$Duration: 700,
			$Opacity: 2,
			$Brother: {
				$Duration: 1000,
				$Opacity: 2
			}
		}, {
			$Duration: 1200,
			$During: {
				$Left: [0.3, 0.7]
			},
			$FlyDirection: 1,
			$Easing: {
				$Left: $JssorEasing$.$EaseInCubic,
				$Opacity: $JssorEasing$.$EaseLinear
			},
			$ScaleHorizontal: 0.3,
			$Opacity: 2
		}, {
			$Duration: 1200,
			$During: {
				$Left: [0.3, 0.7]
			},
			$FlyDirection: 2,
			$Easing: {
				$Left: $JssorEasing$.$EaseInCubic,
				$Opacity: $JssorEasing$.$EaseLinear
			},
			$ScaleHorizontal: 0.3,
			$Opacity: 2
		}, {
			$Duration: 1200,
			$During: {
				$Top: [0.3, 0.7]
			},
			$FlyDirection: 4,
			$Easing: {
				$Top: $JssorEasing$.$EaseInCubic,
				$Opacity: $JssorEasing$.$EaseLinear
			},
			$ScaleVertical: 0.3,
			$Opacity: 2
		}, {
			$Duration: 1000,
			$Zoom: 11,
			$Rotate: true,
			$SlideOut: true,
			$FlyDirection: 10,
			$Easing: {
				$Left: $JssorEasing$.$EaseInExpo,
				$Top: $JssorEasing$.$EaseInExpo,
				$Zoom: $JssorEasing$.$EaseInExpo,
				$Opacity: $JssorEasing$.$EaseLinear,
				$Rotate: $JssorEasing$.$EaseInExpo
			},
			$ScaleHorizontal: 4,
			$ScaleVertical: 4,
			$Opacity: 2,
			$Round: {
				$Rotate: 0.8
			}
		}];
		var _CaptionTransitions = [];
		_CaptionTransitions["L"] = {$Duration:900,$FlyDirection:1,$Easing:{$Left:$JssorEasing$.$EaseInOutSine},$ScaleHorizontal:0.6,$Opacity:2};_CaptionTransitions["R"] = {$Duration:900,$FlyDirection:2,$Easing:{$Left:$JssorEasing$.$EaseInOutSine},$ScaleHorizontal:0.6,$Opacity:2};_CaptionTransitions["T"] = {$Duration:900,$FlyDirection:4,$Easing:{$Top:$JssorEasing$.$EaseInOutSine},$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["B"] = {$Duration:900,$FlyDirection:8,$Easing:{$Top:$JssorEasing$.$EaseInOutSine},$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["TL"] = {$Duration:900,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInOutSine,$Top:$JssorEasing$.$EaseInOutSine},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["TR"] = {$Duration:900,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInOutSine,$Top:$JssorEasing$.$EaseInOutSine},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["BL"] = {$Duration:900,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInOutSine,$Top:$JssorEasing$.$EaseInOutSine},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["BR"] = {$Duration:900,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInOutSine,$Top:$JssorEasing$.$EaseInOutSine},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["L|IB"] = {$Duration:1200,$FlyDirection:1,$Easing:{$Left:$JssorEasing$.$EaseInOutBack},$ScaleHorizontal:0.6,$Opacity:2};_CaptionTransitions["R|IB"] = {$Duration:1200,$FlyDirection:2,$Easing:{$Left:$JssorEasing$.$EaseInOutBack},$ScaleHorizontal:0.6,$Opacity:2};_CaptionTransitions["T|IB"] = {$Duration:1200,$FlyDirection:4,$Easing:{$Top:$JssorEasing$.$EaseInOutBack},$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["B|IB"] = {$Duration:1200,$FlyDirection:8,$Easing:{$Top:$JssorEasing$.$EaseInOutBack},$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["TL|IB"] = {$Duration:1200,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInOutBack,$Top:$JssorEasing$.$EaseInOutBack},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["TR|IB"] = {$Duration:1200,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInOutBack,$Top:$JssorEasing$.$EaseInOutBack},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["BL|IB"] = {$Duration:1200,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInOutBack,$Top:$JssorEasing$.$EaseInOutBack},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["BR|IB"] = {$Duration:1200,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInOutBack,$Top:$JssorEasing$.$EaseInOutBack},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["L|IE"] = {$Duration:1200,$FlyDirection:1,$Easing:{$Left:$JssorEasing$.$EaseInOutElastic},$ScaleHorizontal:0.6,$Opacity:2};_CaptionTransitions["R|IE"] = {$Duration:1200,$FlyDirection:2,$Easing:{$Left:$JssorEasing$.$EaseInOutElastic},$ScaleHorizontal:0.6,$Opacity:2};_CaptionTransitions["T|IE"] = {$Duration:1200,$FlyDirection:4,$Easing:{$Top:$JssorEasing$.$EaseInOutElastic},$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["B|IE"] = {$Duration:1200,$FlyDirection:8,$Easing:{$Top:$JssorEasing$.$EaseInOutElastic},$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["TL|IE"] = {$Duration:1200,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInOutElastic,$Top:$JssorEasing$.$EaseInOutElastic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["TR|IE"] = {$Duration:1200,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInOutElastic,$Top:$JssorEasing$.$EaseInOutElastic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["BL|IE"] = {$Duration:1200,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInOutElastic,$Top:$JssorEasing$.$EaseInOutElastic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["BR|IE"] = {$Duration:1200,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInOutElastic,$Top:$JssorEasing$.$EaseInOutElastic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["L|EP"] = {$Duration:1200,$FlyDirection:1,$Easing:{$Left:$JssorEasing$.$EaseInOutExpo},$ScaleHorizontal:0.6,$Opacity:2};_CaptionTransitions["R|EP"] = {$Duration:1200,$FlyDirection:2,$Easing:{$Left:$JssorEasing$.$EaseInOutExpo},$ScaleHorizontal:0.6,$Opacity:2};_CaptionTransitions["T|EP"] = {$Duration:1200,$FlyDirection:4,$Easing:{$Top:$JssorEasing$.$EaseInOutExpo},$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["B|EP"] = {$Duration:1200,$FlyDirection:8,$Easing:{$Top:$JssorEasing$.$EaseInOutExpo},$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["TL|EP"] = {$Duration:1200,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInOutExpo,$Top:$JssorEasing$.$EaseInOutExpo},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["TR|EP"] = {$Duration:1200,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInOutExpo,$Top:$JssorEasing$.$EaseInOutExpo},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["BL|EP"] = {$Duration:1200,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInOutExpo,$Top:$JssorEasing$.$EaseInOutExpo},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["BR|EP"] = {$Duration:1200,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInOutExpo,$Top:$JssorEasing$.$EaseInOutExpo},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["L*"] = {$Duration:900,$Rotate:-0.05,$FlyDirection:1,$Easing:{$Top:$JssorEasing$.$EaseInOutSine},$ScaleHorizontal:0.6,$Opacity:2};_CaptionTransitions["R*"] = {$Duration:900,$Rotate:0.05,$FlyDirection:2,$Easing:{$Top:$JssorEasing$.$EaseInOutSine},$ScaleHorizontal:0.6,$Opacity:2};_CaptionTransitions["T*"] = {$Duration:900,$Rotate:-0.05,$FlyDirection:4,$Easing:{$Top:$JssorEasing$.$EaseInOutSine},$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["B*"] = {$Duration:900,$Rotate:0.05,$FlyDirection:8,$Easing:{$Top:$JssorEasing$.$EaseInOutSine},$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["TL*"] = {$Duration:900,$Rotate:-0.05,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInOutSine,$Top:$JssorEasing$.$EaseInOutSine},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["TR*"] = {$Duration:900,$Rotate:0.05,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInOutSine,$Top:$JssorEasing$.$EaseInOutSine},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["BL*"] = {$Duration:900,$Rotate:-0.05,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInOutSine,$Top:$JssorEasing$.$EaseInOutSine},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["BR*"] = {$Duration:900,$Rotate:0.05,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInOutSine,$Top:$JssorEasing$.$EaseInOutSine},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["L*IE"] = {$Duration:1200,$Zoom:3,$Rotate:-0.3,$FlyDirection:1,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Rotate:$JssorEasing$.$EaseInElastic},$ScaleHorizontal:0.6,$Opacity:2};_CaptionTransitions["R*IE"] = {$Duration:1200,$Zoom:3,$Rotate:-0.3,$FlyDirection:2,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Rotate:$JssorEasing$.$EaseInElastic},$ScaleHorizontal:0.6,$Opacity:2};_CaptionTransitions["T*IE"] = {$Duration:1200,$Zoom:3,$Rotate:-0.3,$FlyDirection:4,$Easing:{$Top:$JssorEasing$.$EaseInCubic,$Rotate:$JssorEasing$.$EaseInElastic},$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["B*IE"] = {$Duration:1200,$Zoom:3,$Rotate:-0.3,$FlyDirection:8,$Easing:{$Top:$JssorEasing$.$EaseInCubic,$Rotate:$JssorEasing$.$EaseInElastic},$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["TL*IE"] = {$Duration:1200,$Zoom:3,$Rotate:0.3,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Rotate:$JssorEasing$.$EaseInElastic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["TR*IE"] = {$Duration:1200,$Zoom:3,$Rotate:0.3,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Rotate:$JssorEasing$.$EaseInElastic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["BL*IE"] = {$Duration:1200,$Zoom:3,$Rotate:0.3,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Rotate:$JssorEasing$.$EaseInElastic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["BR*IE"] = {$Duration:1200,$Zoom:3,$Rotate:0.3,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Rotate:$JssorEasing$.$EaseInElastic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["L*IB"] = {$Duration:1200,$Zoom:3,$Rotate:-0.3,$FlyDirection:1,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Rotate:$JssorEasing$.$EaseInBack},$ScaleHorizontal:0.6,$Opacity:2};_CaptionTransitions["R*IB"] = {$Duration:1200,$Zoom:3,$Rotate:-0.3,$FlyDirection:2,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Rotate:$JssorEasing$.$EaseInBack},$ScaleHorizontal:0.6,$Opacity:2};_CaptionTransitions["T*IB"] = {$Duration:1200,$Zoom:3,$Rotate:-0.3,$FlyDirection:4,$Easing:{$Top:$JssorEasing$.$EaseInCubic,$Rotate:$JssorEasing$.$EaseInBack},$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["B*IB"] = {$Duration:1200,$Zoom:3,$Rotate:-0.3,$FlyDirection:8,$Easing:{$Top:$JssorEasing$.$EaseInCubic,$Rotate:$JssorEasing$.$EaseInBack},$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["TL*IB"] = {$Duration:1200,$Zoom:3,$Rotate:0.3,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Rotate:$JssorEasing$.$EaseInBack},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["TR*IB"] = {$Duration:1200,$Zoom:3,$Rotate:0.3,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Rotate:$JssorEasing$.$EaseInBack},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["BL*IB"] = {$Duration:1200,$Zoom:3,$Rotate:0.3,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Rotate:$JssorEasing$.$EaseInBack},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["BR*IB"] = {$Duration:1200,$Zoom:3,$Rotate:0.3,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Rotate:$JssorEasing$.$EaseInBack},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["L-*IB"] = {$Duration:900,$Rotate:-0.5,$FlyDirection:1,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseInQuad,$Rotate:$JssorEasing$.$EaseInBack},$ScaleHorizontal:0.7,$Opacity:2,$During:{$Left:[0.2,0.8]}};_CaptionTransitions["R-*IB"] = {$Duration:900,$Rotate:0.5,$FlyDirection:2,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseInQuad,$Rotate:$JssorEasing$.$EaseInBack},$ScaleHorizontal:0.7,$Opacity:2,$During:{$Left:[0.2,0.8]}};_CaptionTransitions["T-*IB"] = {$Duration:900,$Rotate:-0.5,$FlyDirection:4,$Easing:{$Top:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseInQuad,$Rotate:$JssorEasing$.$EaseInBack},$ScaleVertical:0.7,$Opacity:2,$During:{$Top:[0.2,0.8]}};_CaptionTransitions["B-*IB"] = {$Duration:900,$Rotate:0.5,$FlyDirection:8,$Easing:{$Top:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseInQuad,$Rotate:$JssorEasing$.$EaseInBack},$ScaleVertical:0.7,$Opacity:2,$During:{$Top:[0.2,0.8]}};_CaptionTransitions["TL-*IB"] = {$Duration:900,$Rotate:-0.5,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseInQuad,$Rotate:$JssorEasing$.$EaseInBack},$ScaleHorizontal:0.7,$ScaleVertical:0.7,$Opacity:2,$During:{$Left:[0.2,0.8]}};_CaptionTransitions["TR-*IB"] = {$Duration:900,$Rotate:0.5,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseInQuad,$Rotate:$JssorEasing$.$EaseInBack},$ScaleHorizontal:0.7,$ScaleVertical:0.7,$Opacity:2,$During:{$Left:[0.2,0.8]}};_CaptionTransitions["BL-*IB"] = {$Duration:900,$Rotate:-0.5,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseInQuad,$Rotate:$JssorEasing$.$EaseInBack},$ScaleHorizontal:0.7,$ScaleVertical:0.7,$Opacity:2,$During:{$Left:[0.2,0.8]}};_CaptionTransitions["BR-*IB"] = {$Duration:900,$Rotate:0.5,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseInQuad,$Rotate:$JssorEasing$.$EaseInBack},$ScaleHorizontal:0.7,$ScaleVertical:0.7,$Opacity:2,$During:{$Left:[0.2,0.8]}};_CaptionTransitions["L*IW"] = {$Duration:1200,$Zoom:3,$Rotate:2,$FlyDirection:1,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Rotate:$JssorEasing$.$EaseInWave},$ScaleHorizontal:0.6,$Opacity:2};_CaptionTransitions["R*IW"] = {$Duration:1200,$Zoom:3,$Rotate:2,$FlyDirection:2,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Rotate:$JssorEasing$.$EaseInWave},$ScaleHorizontal:0.6,$Opacity:2};_CaptionTransitions["T*IW"] = {$Duration:1200,$Zoom:3,$Rotate:2,$FlyDirection:4,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Rotate:$JssorEasing$.$EaseInWave},$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["B*IW"] = {$Duration:1200,$Zoom:3,$Rotate:2,$FlyDirection:8,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Rotate:$JssorEasing$.$EaseInWave},$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["TL*IW"] = {$Duration:1200,$Zoom:3,$Rotate:2,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Rotate:$JssorEasing$.$EaseInWave},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["TR*IW"] = {$Duration:1200,$Zoom:3,$Rotate:2,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Rotate:$JssorEasing$.$EaseInWave},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["BL*IW"] = {$Duration:1200,$Zoom:3,$Rotate:2,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Rotate:$JssorEasing$.$EaseInWave},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["BR*IW"] = {$Duration:1200,$Zoom:3,$Rotate:2,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Rotate:$JssorEasing$.$EaseInWave},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["L|IE*IE"] = {$Duration:1800,$Zoom:11,$Rotate:-1.5,$FlyDirection:1,$Easing:{$Left:$JssorEasing$.$EaseInOutElastic,$Zoom:$JssorEasing$.$EaseInElastic,$Rotate:$JssorEasing$.$EaseInOutElastic},$ScaleHorizontal:0.5,$Opacity:2,$During:{$Zoom:[0,0.8],$Opacity:[0,0.7]},$Round:{$Rotate:0.5}};_CaptionTransitions["R|IE*IE"] = {$Duration:1800,$Zoom:11,$Rotate:-1.5,$FlyDirection:2,$Easing:{$Left:$JssorEasing$.$EaseInOutElastic,$Zoom:$JssorEasing$.$EaseInElastic,$Rotate:$JssorEasing$.$EaseInOutElastic},$ScaleHorizontal:0.5,$Opacity:2,$During:{$Zoom:[0,0.8],$Opacity:[0,0.7]},$Round:{$Rotate:0.5}};_CaptionTransitions["T|IE*IE"] = {$Duration:1800,$Zoom:11,$Rotate:-1.5,$FlyDirection:4,$Easing:{$Top:$JssorEasing$.$EaseInOutElastic,$Zoom:$JssorEasing$.$EaseInElastic,$Rotate:$JssorEasing$.$EaseInOutElastic},$ScaleVertical:0.8,$Opacity:2,$During:{$Zoom:[0,0.8],$Opacity:[0,0.7]},$Round:{$Rotate:0.5}};_CaptionTransitions["B|IE*IE"] = {$Duration:1800,$Zoom:11,$Rotate:-1.5,$FlyDirection:8,$Easing:{$Top:$JssorEasing$.$EaseInOutElastic,$Zoom:$JssorEasing$.$EaseInElastic,$Rotate:$JssorEasing$.$EaseInOutElastic},$ScaleVertical:0.8,$Opacity:2,$During:{$Zoom:[0,0.8],$Opacity:[0,0.7]},$Round:{$Rotate:0.5}};_CaptionTransitions["TL|IE*IE"] = {$Duration:1800,$Zoom:11,$Rotate:-1.5,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInOutElastic,$Top:$JssorEasing$.$EaseInOutElastic,$Zoom:$JssorEasing$.$EaseInElastic,$Rotate:$JssorEasing$.$EaseInOutElastic},$ScaleHorizontal:0.4,$ScaleVertical:0.8,$Opacity:2,$During:{$Zoom:[0,0.8],$Opacity:[0,0.7]},$Round:{$Rotate:0.5}};_CaptionTransitions["TR|IE*IE"] = {$Duration:1800,$Zoom:11,$Rotate:-1.5,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInOutElastic,$Top:$JssorEasing$.$EaseInOutElastic,$Zoom:$JssorEasing$.$EaseInElastic,$Rotate:$JssorEasing$.$EaseInOutElastic},$ScaleHorizontal:0.4,$ScaleVertical:0.8,$Opacity:2,$During:{$Zoom:[0,0.8],$Opacity:[0,0.7]},$Round:{$Rotate:0.5}};_CaptionTransitions["BL|IE*IE"] = {$Duration:1800,$Zoom:11,$Rotate:-1.5,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInOutElastic,$Top:$JssorEasing$.$EaseInOutElastic,$Zoom:$JssorEasing$.$EaseInElastic,$Rotate:$JssorEasing$.$EaseInOutElastic},$ScaleHorizontal:0.4,$ScaleVertical:0.8,$Opacity:2,$During:{$Zoom:[0,0.8],$Opacity:[0,0.7]},$Round:{$Rotate:0.5}};_CaptionTransitions["BR|IE*IE"] = {$Duration:1800,$Zoom:11,$Rotate:-1.5,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInOutElastic,$Top:$JssorEasing$.$EaseInOutElastic,$Zoom:$JssorEasing$.$EaseInElastic,$Rotate:$JssorEasing$.$EaseInOutElastic},$ScaleHorizontal:0.4,$ScaleVertical:0.8,$Opacity:2,$During:{$Zoom:[0,0.8],$Opacity:[0,0.7]},$Round:{$Rotate:0.5}};_CaptionTransitions["CLIP"] = {$Duration:900,$Clip:15,$Easing:{$Clip:$JssorEasing$.$EaseInOutCubic},$Opacity:2};_CaptionTransitions["CLIP|LR"] = {$Duration:900,$Clip:3,$Easing:{$Clip:$JssorEasing$.$EaseInOutCubic},$Opacity:2};_CaptionTransitions["CLIP|TB"] = {$Duration:900,$Clip:12,$Easing:{$Clip:$JssorEasing$.$EaseInOutCubic},$Opacity:2};_CaptionTransitions["CLIP|L"] = {$Duration:900,$Clip:1,$Easing:{$Clip:$JssorEasing$.$EaseInOutCubic},$Opacity:2};_CaptionTransitions["CLIP|R"] = {$Duration:900,$Clip:2,$Easing:{$Clip:$JssorEasing$.$EaseInOutCubic},$Opacity:2};_CaptionTransitions["CLIP|T"] = {$Duration:900,$Clip:4,$Easing:{$Clip:$JssorEasing$.$EaseInOutCubic},$Opacity:2};_CaptionTransitions["CLIP|B"] = {$Duration:900,$Clip:8,$Easing:{$Clip:$JssorEasing$.$EaseInOutCubic},$Opacity:2};_CaptionTransitions["MCLIP|L"] = {$Duration:900,$Clip:1,$Move:true,$Easing:{$Clip:$JssorEasing$.$EaseInOutCubic}};_CaptionTransitions["MCLIP|R"] = {$Duration:900,$Clip:2,$Move:true,$Easing:{$Clip:$JssorEasing$.$EaseInOutCubic}};_CaptionTransitions["MCLIP|T"] = {$Duration:900,$Clip:4,$Move:true,$Easing:{$Clip:$JssorEasing$.$EaseInOutCubic}};_CaptionTransitions["MCLIP|B"] = {$Duration:900,$Clip:8,$Move:true,$Easing:{$Clip:$JssorEasing$.$EaseInOutCubic}};_CaptionTransitions["ZM"] = {$Duration:900,$Zoom:1,$Easing:$JssorEasing$.$EaseInCubic,$Opacity:2};_CaptionTransitions["ZM|P30"] = {$Duration:900,$Zoom:1.3,$Easing:$JssorEasing$.$EaseInCubic,$Opacity:2};_CaptionTransitions["ZM|P50"] = {$Duration:900,$Zoom:1.5,$Easing:$JssorEasing$.$EaseInCubic,$Opacity:2};_CaptionTransitions["ZM|P70"] = {$Duration:900,$Zoom:1.7,$Easing:$JssorEasing$.$EaseInCubic,$Opacity:2};_CaptionTransitions["ZM|P80"] = {$Duration:900,$Zoom:1.8,$Easing:$JssorEasing$.$EaseInCubic,$Opacity:2};_CaptionTransitions["ZMF|2"] = {$Duration:900,$Zoom:3,$Easing:{$Zoom:$JssorEasing$.$EaseInExpo,$Opacity:$JssorEasing$.$EaseLinear},$Opacity:2};_CaptionTransitions["ZMF|3"] = {$Duration:900,$Zoom:4,$Easing:{$Zoom:$JssorEasing$.$EaseInExpo,$Opacity:$JssorEasing$.$EaseLinear},$Opacity:2};_CaptionTransitions["ZMF|4"] = {$Duration:900,$Zoom:5,$Easing:{$Zoom:$JssorEasing$.$EaseInExpo,$Opacity:$JssorEasing$.$EaseLinear},$Opacity:2};_CaptionTransitions["ZMF|5"] = {$Duration:900,$Zoom:6,$Easing:{$Zoom:$JssorEasing$.$EaseInExpo,$Opacity:$JssorEasing$.$EaseLinear},$Opacity:2};_CaptionTransitions["ZMF|10"] = {$Duration:900,$Zoom:11,$Easing:{$Zoom:$JssorEasing$.$EaseInExpo,$Opacity:$JssorEasing$.$EaseLinear},$Opacity:2};_CaptionTransitions["ZML|L"] = {$Duration:900,$Zoom:11,$FlyDirection:1,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$Opacity:2};_CaptionTransitions["ZML|R"] = {$Duration:900,$Zoom:11,$FlyDirection:2,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$Opacity:2};_CaptionTransitions["ZML|T"] = {$Duration:900,$Zoom:11,$FlyDirection:4,$Easing:{$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["ZML|B"] = {$Duration:900,$Zoom:11,$FlyDirection:8,$Easing:{$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["ZML|TL"] = {$Duration:900,$Zoom:11,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["ZML|TR"] = {$Duration:900,$Zoom:11,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["ZML|BL"] = {$Duration:900,$Zoom:11,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["ZML|BR"] = {$Duration:900,$Zoom:11,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["ZML|IE|L"] = {$Duration:1200,$Zoom:6,$FlyDirection:1,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInElastic},$ScaleHorizontal:0.6,$Opacity:2};_CaptionTransitions["ZML|IE|R"] = {$Duration:1200,$Zoom:6,$FlyDirection:2,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInElastic},$ScaleHorizontal:0.6,$Opacity:2};_CaptionTransitions["ZML|IE|T"] = {$Duration:1200,$Zoom:6,$FlyDirection:4,$Easing:{$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInElastic},$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["ZML|IE|B"] = {$Duration:1200,$Zoom:6,$FlyDirection:8,$Easing:{$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInElastic},$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["ZML|IE|TL"] = {$Duration:1200,$Zoom:6,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInElastic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["ZML|IE|TR"] = {$Duration:1200,$Zoom:6,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInElastic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["ZML|IE|BL"] = {$Duration:1200,$Zoom:6,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInElastic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["ZML|IE|BR"] = {$Duration:1200,$Zoom:6,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInElastic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["ZMS|L"] = {$Duration:900,$Zoom:1,$FlyDirection:1,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$Opacity:2};_CaptionTransitions["ZMS|R"] = {$Duration:900,$Zoom:1,$FlyDirection:2,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$Opacity:2};_CaptionTransitions["ZMS|T"] = {$Duration:900,$Zoom:1,$FlyDirection:4,$Easing:{$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["ZMS|B"] = {$Duration:900,$Zoom:1,$FlyDirection:8,$Easing:{$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["ZMS|TL"] = {$Duration:900,$Zoom:1,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["ZMS|TR"] = {$Duration:900,$Zoom:1,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["ZMS|BL"] = {$Duration:900,$Zoom:1,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["ZMS|BR"] = {$Duration:900,$Zoom:1,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["ZM*JDN|LT"] = {$Duration:1200,$Zoom:11,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseOutCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.5,$Opacity:2,$During:{$Top:[0,0.5]}};_CaptionTransitions["ZM*JDN|LB"] = {$Duration:1200,$Zoom:11,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseOutCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.5,$Opacity:2,$During:{$Top:[0,0.5]}};_CaptionTransitions["ZM*JDN|RT"] = {$Duration:1200,$Zoom:11,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseOutCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.5,$Opacity:2,$During:{$Top:[0,0.5]}};_CaptionTransitions["ZM*JDN|RB"] = {$Duration:1200,$Zoom:11,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseOutCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.5,$Opacity:2,$During:{$Top:[0,0.5]}};_CaptionTransitions["ZM*JDN|TL"] = {$Duration:1200,$Zoom:11,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseOutCubic,$Top:$JssorEasing$.$EaseLinear,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.5,$ScaleVertical:0.8,$Opacity:2,$During:{$Left:[0,0.5]}};_CaptionTransitions["ZM*JDN|TR"] = {$Duration:1200,$Zoom:11,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseOutCubic,$Top:$JssorEasing$.$EaseLinear,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.5,$ScaleVertical:0.8,$Opacity:2,$During:{$Left:[0,0.5]}};_CaptionTransitions["ZM*JDN|BL"] = {$Duration:1200,$Zoom:11,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseOutCubic,$Top:$JssorEasing$.$EaseLinear,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.5,$ScaleVertical:0.8,$Opacity:2,$During:{$Left:[0,0.5]}};_CaptionTransitions["ZM*JDN|BR"] = {$Duration:1200,$Zoom:11,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseOutCubic,$Top:$JssorEasing$.$EaseLinear,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.5,$ScaleVertical:0.8,$Opacity:2,$During:{$Left:[0,0.5]}};_CaptionTransitions["ZM*JUP|LT"] = {$Duration:1200,$Zoom:11,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.5,$Opacity:2,$During:{$Top:[0,0.5]}};_CaptionTransitions["ZM*JUP|LB"] = {$Duration:1200,$Zoom:11,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.5,$Opacity:2,$During:{$Top:[0,0.5]}};_CaptionTransitions["ZM*JUP|RT"] = {$Duration:1200,$Zoom:11,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.5,$Opacity:2,$During:{$Top:[0,0.5]}};_CaptionTransitions["ZM*JUP|RB"] = {$Duration:1200,$Zoom:11,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.5,$Opacity:2,$During:{$Top:[0,0.5]}};_CaptionTransitions["ZM*JUP|TL"] = {$Duration:1200,$Zoom:11,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseLinear,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.5,$ScaleVertical:0.8,$Opacity:2,$During:{$Left:[0,0.5]}};_CaptionTransitions["ZM*JUP|TR"] = {$Duration:1200,$Zoom:11,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseLinear,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.5,$ScaleVertical:0.8,$Opacity:2,$During:{$Left:[0,0.5]}};_CaptionTransitions["ZM*JUP|BL"] = {$Duration:1200,$Zoom:11,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseLinear,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.5,$ScaleVertical:0.8,$Opacity:2,$During:{$Left:[0,0.5]}};_CaptionTransitions["ZM*JUP|BR"] = {$Duration:1200,$Zoom:11,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseLinear,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.5,$ScaleVertical:0.8,$Opacity:2,$During:{$Left:[0,0.5]}};_CaptionTransitions["ZM*JDN|LB*"] = {$Duration:1200,$Zoom:11,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$During:{$Top:[0,0.5]},$Round:{$Left:0.3,$Top:0.75}};_CaptionTransitions["ZM*JDN|RB*"] = {$Duration:1200,$Zoom:11,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$During:{$Top:[0,0.5]},$Round:{$Left:0.3,$Top:0.75}};_CaptionTransitions["ZM*JDN1|L"] = {$Duration:1200,$Zoom:11,$FlyDirection:1,$Easing:{$Left:$JssorEasing$.$EaseOutJump,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.5,$Opacity:2,$Round:{$Zoom:0.5}};_CaptionTransitions["ZM*JDN1|R"] = {$Duration:1200,$Zoom:11,$FlyDirection:2,$Easing:{$Left:$JssorEasing$.$EaseOutJump,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.5,$Opacity:2,$Round:{$Zoom:0.5}};_CaptionTransitions["ZM*JDN1|T"] = {$Duration:1200,$Zoom:11,$FlyDirection:4,$Easing:{$Top:$JssorEasing$.$EaseOutJump,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear},$ScaleVertical:0.5,$Opacity:2,$Round:{$Zoom:0.5}};_CaptionTransitions["ZM*JDN1|B"] = {$Duration:1200,$Zoom:11,$FlyDirection:8,$Easing:{$Top:$JssorEasing$.$EaseOutJump,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear},$ScaleVertical:0.5,$Opacity:2,$Round:{$Zoom:0.5}};_CaptionTransitions["ZM*JUP1|L"] = {$Duration:1200,$Zoom:11,$FlyDirection:1,$Easing:{$Left:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.5,$Opacity:2,$Round:{$Zoom:0.5}};_CaptionTransitions["ZM*JUP1|R"] = {$Duration:1200,$Zoom:11,$FlyDirection:2,$Easing:{$Left:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.5,$Opacity:2,$Round:{$Zoom:0.5}};_CaptionTransitions["ZM*JUP1|T"] = {$Duration:1200,$Zoom:11,$FlyDirection:4,$Easing:{$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear},$ScaleVertical:0.5,$Opacity:2,$Round:{$Zoom:0.5}};_CaptionTransitions["ZM*JUP1|B"] = {$Duration:1200,$Zoom:11,$FlyDirection:8,$Easing:{$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear},$ScaleVertical:0.5,$Opacity:2,$Round:{$Zoom:0.5}};_CaptionTransitions["ZM*WVC|LT"] = {$Duration:1200,$Zoom:11,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseOutWave},$ScaleHorizontal:0.5,$ScaleVertical:0.3,$Opacity:2,$Round:{$Rotate:0.8}};_CaptionTransitions["ZM*WVC|LB"] = {$Duration:1200,$Zoom:11,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseOutWave},$ScaleHorizontal:0.5,$ScaleVertical:0.3,$Opacity:2,$Round:{$Rotate:0.8}};_CaptionTransitions["ZM*WVC|RT"] = {$Duration:1200,$Zoom:11,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseOutWave},$ScaleHorizontal:0.5,$ScaleVertical:0.3,$Opacity:2,$Round:{$Rotate:0.8}};_CaptionTransitions["ZM*WVC|RB"] = {$Duration:1200,$Zoom:11,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseOutWave},$ScaleHorizontal:0.5,$ScaleVertical:0.3,$Opacity:2,$Round:{$Rotate:0.8}};_CaptionTransitions["ZM*WVC|TL"] = {$Duration:1200,$Zoom:11,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseOutWave,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.3,$ScaleVertical:0.5,$Opacity:2,$Round:{$Rotate:0.8}};_CaptionTransitions["ZM*WVC|TR"] = {$Duration:1200,$Zoom:11,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseOutWave,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.3,$ScaleVertical:0.5,$Opacity:2,$Round:{$Rotate:0.8}};_CaptionTransitions["ZM*WVC|BL"] = {$Duration:1200,$Zoom:11,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseOutWave,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.3,$ScaleVertical:0.5,$Opacity:2,$Round:{$Rotate:0.8}};_CaptionTransitions["ZM*WVC|BR"] = {$Duration:1200,$Zoom:11,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseOutWave,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.3,$ScaleVertical:0.5,$Opacity:2,$Round:{$Rotate:0.8}};_CaptionTransitions["ZM*WVR|LT"] = {$Duration:1200,$Zoom:11,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseInWave},$ScaleHorizontal:0.5,$ScaleVertical:0.3,$Opacity:2,$Round:{$Rotate:0.8}};_CaptionTransitions["ZM*WVR|LB"] = {$Duration:1200,$Zoom:11,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseInWave},$ScaleHorizontal:0.5,$ScaleVertical:0.3,$Opacity:2,$Round:{$Rotate:0.8}};_CaptionTransitions["ZM*WVR|RT"] = {$Duration:1200,$Zoom:11,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseInWave},$ScaleHorizontal:0.5,$ScaleVertical:0.3,$Opacity:2,$Round:{$Rotate:0.8}};_CaptionTransitions["ZM*WVR|RB"] = {$Duration:1200,$Zoom:11,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseInWave},$ScaleHorizontal:0.5,$ScaleVertical:0.3,$Opacity:2,$Round:{$Rotate:0.8}};_CaptionTransitions["ZM*WVR|TL"] = {$Duration:1200,$Zoom:11,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.3,$ScaleVertical:0.5,$Opacity:2,$Round:{$Rotate:0.8}};_CaptionTransitions["ZM*WVR|TR"] = {$Duration:1200,$Zoom:11,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.3,$ScaleVertical:0.5,$Opacity:2,$Round:{$Rotate:0.8}};_CaptionTransitions["ZM*WVR|BL"] = {$Duration:1200,$Zoom:11,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.3,$ScaleVertical:0.5,$Opacity:2,$Round:{$Rotate:0.8}};_CaptionTransitions["ZM*WVR|BR"] = {$Duration:1200,$Zoom:11,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.3,$ScaleVertical:0.5,$Opacity:2,$Round:{$Rotate:0.8}};_CaptionTransitions["ZM*WV*J1|LT"] = {$Duration:1200,$Zoom:11,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$During:{$Top:[0,0.5]},$Round:{$Left:0.3,$Top:0.5}};_CaptionTransitions["ZM*WV*J1|LB"] = {$Duration:1200,$Zoom:11,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$During:{$Top:[0,0.5]},$Round:{$Left:0.3,$Top:0.5}};_CaptionTransitions["ZM*WV*J1|RT"] = {$Duration:1200,$Zoom:11,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$During:{$Top:[0,0.5]},$Round:{$Left:0.3,$Top:0.5}};_CaptionTransitions["ZM*WV*J1|RB"] = {$Duration:1200,$Zoom:11,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$During:{$Top:[0,0.5]},$Round:{$Left:0.3,$Top:0.5}};_CaptionTransitions["ZM*WV*J1|TL"] = {$Duration:1200,$Zoom:11,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInJump,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$During:{$Left:[0,0.5]},$Round:{$Left:0.5,$Top:0.3}};_CaptionTransitions["ZM*WV*J1|TR"] = {$Duration:1200,$Zoom:11,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInJump,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$During:{$Left:[0,0.5]},$Round:{$Left:0.5,$Top:0.3}};_CaptionTransitions["ZM*WV*J1|BL"] = {$Duration:1200,$Zoom:11,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInJump,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$During:{$Left:[0,0.5]},$Round:{$Left:0.5,$Top:0.3}};_CaptionTransitions["ZM*WV*J1|BR"] = {$Duration:1200,$Zoom:11,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInJump,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$During:{$Left:[0,0.5]},$Round:{$Left:0.5,$Top:0.3}};_CaptionTransitions["ZM*WV*J2|LT"] = {$Duration:1200,$Zoom:11,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.4,$Opacity:2};_CaptionTransitions["ZM*WV*J2|LB"] = {$Duration:1200,$Zoom:11,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.4,$Opacity:2};_CaptionTransitions["ZM*WV*J2|RT"] = {$Duration:1200,$Zoom:11,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.4,$Opacity:2};_CaptionTransitions["ZM*WV*J2|RB"] = {$Duration:1200,$Zoom:11,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.4,$Opacity:2};_CaptionTransitions["ZM*WV*J2|TL"] = {$Duration:1200,$Zoom:11,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.4,$ScaleVertical:0.8,$Opacity:2};_CaptionTransitions["ZM*WV*J2|TR"] = {$Duration:1200,$Zoom:11,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.4,$ScaleVertical:0.8,$Opacity:2};_CaptionTransitions["ZM*WV*J2|BL"] = {$Duration:1200,$Zoom:11,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.4,$ScaleVertical:0.8,$Opacity:2};_CaptionTransitions["ZM*WV*J2|BR"] = {$Duration:1200,$Zoom:11,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.4,$ScaleVertical:0.8,$Opacity:2};_CaptionTransitions["ZM*WV*J3|LT"] = {$Duration:1200,$Zoom:11,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInSine,$Top:$JssorEasing$.$EaseOutJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$Round:{$Top:0.5}};_CaptionTransitions["ZM*WV*J3|LB"] = {$Duration:1200,$Zoom:11,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInSine,$Top:$JssorEasing$.$EaseOutJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$Round:{$Top:0.5}};_CaptionTransitions["ZM*WV*J3|RT"] = {$Duration:1200,$Zoom:11,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInSine,$Top:$JssorEasing$.$EaseOutJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$Round:{$Top:0.5}};_CaptionTransitions["ZM*WV*J3|RB"] = {$Duration:1200,$Zoom:11,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInSine,$Top:$JssorEasing$.$EaseOutJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$Round:{$Top:0.5}};_CaptionTransitions["ZM*WV*J3|TL"] = {$Duration:1200,$Zoom:11,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseOutJump,$Top:$JssorEasing$.$EaseInSine,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$Round:{$Left:0.5}};_CaptionTransitions["ZM*WV*J3|TR"] = {$Duration:1200,$Zoom:11,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseOutJump,$Top:$JssorEasing$.$EaseInSine,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$Round:{$Left:0.5}};_CaptionTransitions["ZM*WV*J3|BL"] = {$Duration:1200,$Zoom:11,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseOutJump,$Top:$JssorEasing$.$EaseInSine,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$Round:{$Left:0.5}};_CaptionTransitions["ZM*WV*J3|BR"] = {$Duration:1200,$Zoom:11,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseOutJump,$Top:$JssorEasing$.$EaseInSine,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$Round:{$Left:0.5}};_CaptionTransitions["RTT"] = {$Duration:900,$Rotate:1,$Easing:{$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseInQuad},$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT|90"] = {$Duration:900,$Rotate:1,$Opacity:2,$Round:{$Rotate:0.25}};_CaptionTransitions["RTT|360"] = {$Duration:900,$Rotate:1,$Easing:{$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseInQuad},$Opacity:2};_CaptionTransitions["RTT|0"] = {$Duration:900,$Zoom:1,$Rotate:1,$Easing:{$Zoom:$JssorEasing$.$EaseInQuad,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseInQuad},$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT|2"] = {$Duration:900,$Zoom:3,$Rotate:1,$Easing:{$Zoom:$JssorEasing$.$EaseInQuad,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseInQuad},$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT|3"] = {$Duration:900,$Zoom:4,$Rotate:1,$Easing:{$Zoom:$JssorEasing$.$EaseInQuad,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseInQuad},$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT|4"] = {$Duration:900,$Zoom:5,$Rotate:1,$Easing:{$Zoom:$JssorEasing$.$EaseInQuad,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseInQuad},$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT|5"] = {$Duration:900,$Zoom:6,$Rotate:1,$Easing:{$Zoom:$JssorEasing$.$EaseInExpo,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseInExpo},$Opacity:2,$Round:{$Rotate:0.8}};_CaptionTransitions["RTT|10"] = {$Duration:900,$Zoom:11,$Rotate:1,$Easing:{$Zoom:$JssorEasing$.$EaseInExpo,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseInExpo},$Opacity:2,$Round:{$Rotate:0.8}};_CaptionTransitions["RTTL|L"] = {$Duration:900,$Zoom:11,$Rotate:1,$FlyDirection:1,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$Opacity:2,$Round:{$Rotate:0.8}};_CaptionTransitions["RTTL|R"] = {$Duration:900,$Zoom:11,$Rotate:1,$FlyDirection:2,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$Opacity:2,$Round:{$Rotate:0.8}};_CaptionTransitions["RTTL|T"] = {$Duration:900,$Zoom:11,$Rotate:1,$FlyDirection:4,$Easing:{$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseInCubic},$ScaleVertical:0.6,$Opacity:2,$Round:{$Rotate:0.8}};_CaptionTransitions["RTTL|B"] = {$Duration:900,$Zoom:11,$Rotate:1,$FlyDirection:8,$Easing:{$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseInCubic},$ScaleVertical:0.6,$Opacity:2,$Round:{$Rotate:0.8}};_CaptionTransitions["RTTL|TL"] = {$Duration:900,$Zoom:11,$Rotate:1,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$Round:{$Rotate:0.8}};_CaptionTransitions["RTTL|TR"] = {$Duration:900,$Zoom:11,$Rotate:1,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$Round:{$Rotate:0.8}};_CaptionTransitions["RTTL|BL"] = {$Duration:900,$Zoom:11,$Rotate:1,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$Round:{$Rotate:0.8}};_CaptionTransitions["RTTL|BR"] = {$Duration:900,$Zoom:11,$Rotate:1,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$Round:{$Rotate:0.8}};_CaptionTransitions["RTTS|L"] = {$Duration:900,$Zoom:1,$Rotate:1,$FlyDirection:1,$Easing:{$Left:$JssorEasing$.$EaseInQuad,$Zoom:$JssorEasing$.$EaseInQuad,$Rotate:$JssorEasing$.$EaseInQuad,$Opacity:$JssorEasing$.$EaseOutQuad},$ScaleHorizontal:0.6,$Opacity:2,$Round:{$Rotate:1.2}};_CaptionTransitions["RTTS|R"] = {$Duration:900,$Zoom:1,$Rotate:1,$FlyDirection:2,$Easing:{$Left:$JssorEasing$.$EaseInQuad,$Zoom:$JssorEasing$.$EaseInQuad,$Rotate:$JssorEasing$.$EaseInQuad,$Opacity:$JssorEasing$.$EaseOutQuad},$ScaleHorizontal:0.6,$Opacity:2,$Round:{$Rotate:1.2}};_CaptionTransitions["RTTS|T"] = {$Duration:900,$Zoom:1,$Rotate:1,$FlyDirection:4,$Easing:{$Top:$JssorEasing$.$EaseInQuad,$Zoom:$JssorEasing$.$EaseInQuad,$Rotate:$JssorEasing$.$EaseInQuad,$Opacity:$JssorEasing$.$EaseOutQuad},$ScaleVertical:0.6,$Opacity:2,$Round:{$Rotate:1.2}};_CaptionTransitions["RTTS|B"] = {$Duration:900,$Zoom:1,$Rotate:1,$FlyDirection:8,$Easing:{$Top:$JssorEasing$.$EaseInQuad,$Zoom:$JssorEasing$.$EaseInQuad,$Rotate:$JssorEasing$.$EaseInQuad,$Opacity:$JssorEasing$.$EaseOutQuad},$ScaleVertical:0.6,$Opacity:2,$Round:{$Rotate:1.2}};_CaptionTransitions["RTTS|TL"] = {$Duration:900,$Zoom:1,$Rotate:1,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInQuad,$Top:$JssorEasing$.$EaseInQuad,$Zoom:$JssorEasing$.$EaseInQuad,$Rotate:$JssorEasing$.$EaseInQuad,$Opacity:$JssorEasing$.$EaseOutQuad},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$Round:{$Rotate:1.2}};_CaptionTransitions["RTTS|TR"] = {$Duration:900,$Zoom:1,$Rotate:1,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInQuad,$Top:$JssorEasing$.$EaseInQuad,$Zoom:$JssorEasing$.$EaseInQuad,$Rotate:$JssorEasing$.$EaseInQuad,$Opacity:$JssorEasing$.$EaseOutQuad},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$Round:{$Rotate:1.2}};_CaptionTransitions["RTTS|BL"] = {$Duration:900,$Zoom:1,$Rotate:1,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInQuad,$Top:$JssorEasing$.$EaseInQuad,$Zoom:$JssorEasing$.$EaseInQuad,$Rotate:$JssorEasing$.$EaseInQuad,$Opacity:$JssorEasing$.$EaseOutQuad},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$Round:{$Rotate:1.2}};_CaptionTransitions["RTTS|BR"] = {$Duration:900,$Zoom:1,$Rotate:1,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInQuad,$Top:$JssorEasing$.$EaseInQuad,$Zoom:$JssorEasing$.$EaseInQuad,$Rotate:$JssorEasing$.$EaseInQuad,$Opacity:$JssorEasing$.$EaseOutQuad},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$Round:{$Rotate:1.2}};_CaptionTransitions["RTT*JDN|L"] = {$Duration:1200,$Zoom:11,$Rotate:0.2,$FlyDirection:1,$Easing:{$Left:$JssorEasing$.$EaseOutCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.3,$Opacity:2,$During:{$Left:[0,0.5]}};_CaptionTransitions["RTT*JDN|R"] = {$Duration:1200,$Zoom:11,$Rotate:0.2,$FlyDirection:2,$Easing:{$Left:$JssorEasing$.$EaseOutCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.3,$Opacity:2,$During:{$Left:[0,0.5]}};_CaptionTransitions["RTT*JDN|T"] = {$Duration:1200,$Zoom:11,$Rotate:0.2,$FlyDirection:4,$Easing:{$Top:$JssorEasing$.$EaseOutCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleVertical:0.5,$Opacity:2,$During:{$Top:[0,0.5]}};_CaptionTransitions["RTT*JDN|B"] = {$Duration:1200,$Zoom:11,$Rotate:0.2,$FlyDirection:8,$Easing:{$Top:$JssorEasing$.$EaseOutCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleVertical:0.5,$Opacity:2,$During:{$Top:[0,0.5]}};_CaptionTransitions["RTT*JUP|L"] = {$Duration:1200,$Zoom:11,$Rotate:0.2,$FlyDirection:1,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.3,$Opacity:2,$During:{$Left:[0,0.5]}};_CaptionTransitions["RTT*JUP|R"] = {$Duration:1200,$Zoom:11,$Rotate:0.2,$FlyDirection:2,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.3,$Opacity:2,$During:{$Left:[0,0.5]}};_CaptionTransitions["RTT*JUP|T"] = {$Duration:1200,$Zoom:11,$Rotate:0.2,$FlyDirection:4,$Easing:{$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleVertical:0.5,$Opacity:2,$During:{$Top:[0,0.5]}};_CaptionTransitions["RTT*JUP|B"] = {$Duration:1200,$Zoom:11,$Rotate:0.2,$FlyDirection:8,$Easing:{$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleVertical:0.5,$Opacity:2,$During:{$Top:[0,0.5]}};_CaptionTransitions["RTT*JDN|LT"] = {$Duration:1200,$Zoom:11,$Rotate:0.2,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseOutCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.5,$Opacity:2,$During:{$Top:[0,0.5]}};_CaptionTransitions["RTT*JDN|LB"] = {$Duration:1200,$Zoom:11,$Rotate:0.2,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseOutCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.5,$Opacity:2,$During:{$Top:[0,0.5]}};_CaptionTransitions["RTT*JDN|RT"] = {$Duration:1200,$Zoom:11,$Rotate:0.2,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseOutCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.5,$Opacity:2,$During:{$Top:[0,0.5]}};_CaptionTransitions["RTT*JDN|RB"] = {$Duration:1200,$Zoom:11,$Rotate:0.2,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseOutCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.5,$Opacity:2,$During:{$Top:[0,0.5]}};_CaptionTransitions["RTT*JDN|TL"] = {$Duration:1200,$Zoom:11,$Rotate:0.2,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseOutCubic,$Top:$JssorEasing$.$EaseLinear,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.5,$ScaleVertical:0.8,$Opacity:2,$During:{$Left:[0,0.5]}};_CaptionTransitions["RTT*JDN|TR"] = {$Duration:1200,$Zoom:11,$Rotate:0.2,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseOutCubic,$Top:$JssorEasing$.$EaseLinear,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.5,$ScaleVertical:0.8,$Opacity:2,$During:{$Left:[0,0.5]}};_CaptionTransitions["RTT*JDN|BL"] = {$Duration:1200,$Zoom:11,$Rotate:0.2,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseOutCubic,$Top:$JssorEasing$.$EaseLinear,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.5,$ScaleVertical:0.8,$Opacity:2,$During:{$Left:[0,0.5]}};_CaptionTransitions["RTT*JDN|BR"] = {$Duration:1200,$Zoom:11,$Rotate:0.2,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseOutCubic,$Top:$JssorEasing$.$EaseLinear,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.5,$ScaleVertical:0.8,$Opacity:2,$During:{$Left:[0,0.5]}};_CaptionTransitions["RTT*JUP|LT"] = {$Duration:1200,$Zoom:11,$Rotate:0.2,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.5,$Opacity:2,$During:{$Top:[0,0.5]}};_CaptionTransitions["RTT*JUP|LB"] = {$Duration:1200,$Zoom:11,$Rotate:0.2,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.5,$Opacity:2,$During:{$Top:[0,0.5]}};_CaptionTransitions["RTT*JUP|RT"] = {$Duration:1200,$Zoom:11,$Rotate:0.2,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.5,$Opacity:2,$During:{$Top:[0,0.5]}};_CaptionTransitions["RTT*JUP|RB"] = {$Duration:1200,$Zoom:11,$Rotate:0.2,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.5,$Opacity:2,$During:{$Top:[0,0.5]}};_CaptionTransitions["RTT*JUP|TL"] = {$Duration:1200,$Zoom:11,$Rotate:0.2,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseLinear,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.5,$ScaleVertical:0.8,$Opacity:2,$During:{$Left:[0,0.5]}};_CaptionTransitions["RTT*JUP|TR"] = {$Duration:1200,$Zoom:11,$Rotate:0.2,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseLinear,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.5,$ScaleVertical:0.8,$Opacity:2,$During:{$Left:[0,0.5]}};_CaptionTransitions["RTT*JUP|BL"] = {$Duration:1200,$Zoom:11,$Rotate:0.2,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseLinear,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.5,$ScaleVertical:0.8,$Opacity:2,$During:{$Left:[0,0.5]}};_CaptionTransitions["RTT*JUP|BR"] = {$Duration:1200,$Zoom:11,$Rotate:0.2,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseLinear,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.5,$ScaleVertical:0.8,$Opacity:2,$During:{$Left:[0,0.5]}};_CaptionTransitions["RTT*JDN|LB*"] = {$Duration:1200,$Zoom:11,$Rotate:-1,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$During:{$Top:[0,0.5]},$Round:{$Left:0.3,$Top:0.75,$Rotate:0.5}};_CaptionTransitions["RTT*JDN|RB*"] = {$Duration:1200,$Zoom:11,$Rotate:-1,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$During:{$Top:[0,0.5]},$Round:{$Left:0.3,$Top:0.75,$Rotate:0.5}};_CaptionTransitions["RTT*JDN1|L"] = {$Duration:1200,$Zoom:6,$Rotate:0.25,$FlyDirection:1,$Easing:{$Left:$JssorEasing$.$EaseOutJump,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseOutWave},$ScaleHorizontal:0.5,$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT*JDN1|R"] = {$Duration:1200,$Zoom:6,$Rotate:0.25,$FlyDirection:2,$Easing:{$Left:$JssorEasing$.$EaseOutJump,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseOutWave},$ScaleHorizontal:0.5,$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT*JDN1|T"] = {$Duration:1200,$Zoom:6,$Rotate:0.25,$FlyDirection:4,$Easing:{$Top:$JssorEasing$.$EaseOutJump,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseOutWave},$ScaleVertical:0.5,$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT*JDN1|B"] = {$Duration:1200,$Zoom:6,$Rotate:0.25,$FlyDirection:8,$Easing:{$Top:$JssorEasing$.$EaseOutJump,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseOutWave},$ScaleVertical:0.5,$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT*JUP1|L"] = {$Duration:1200,$Zoom:6,$Rotate:0.25,$FlyDirection:1,$Easing:{$Left:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseOutWave},$ScaleHorizontal:0.5,$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT*JUP1|R"] = {$Duration:1200,$Zoom:6,$Rotate:0.25,$FlyDirection:2,$Easing:{$Left:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseOutWave},$ScaleHorizontal:0.5,$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT*JUP1|T"] = {$Duration:1200,$Zoom:6,$Rotate:0.25,$FlyDirection:4,$Easing:{$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseOutWave},$ScaleVertical:0.5,$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT*JUP1|B"] = {$Duration:1200,$Zoom:6,$Rotate:0.25,$FlyDirection:8,$Easing:{$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseOutWave},$ScaleVertical:0.5,$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT*JDN1|TL"] = {$Duration:1200,$Zoom:6,$Rotate:0.25,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInJump,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseOutWave},$ScaleHorizontal:0.5,$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT*JDN1|TR"] = {$Duration:1200,$Zoom:6,$Rotate:0.25,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInJump,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseOutWave},$ScaleHorizontal:0.5,$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT*JDN1|BL"] = {$Duration:1200,$Zoom:6,$Rotate:0.25,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInJump,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseOutWave},$ScaleHorizontal:0.5,$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT*JUP1|TL"] = {$Duration:1200,$Zoom:6,$Rotate:0.25,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseOutJump,$Top:$JssorEasing$.$EaseOutJump,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseOutWave},$ScaleHorizontal:0.5,$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT*JUP1|TR"] = {$Duration:1200,$Zoom:6,$Rotate:0.25,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseOutJump,$Top:$JssorEasing$.$EaseOutJump,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseOutWave},$ScaleHorizontal:0.5,$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT*JUP1|BL"] = {$Duration:1200,$Zoom:6,$Rotate:0.25,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseOutJump,$Top:$JssorEasing$.$EaseOutJump,$Zoom:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseOutWave},$ScaleHorizontal:0.5,$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT*WVC|LT"] = {$Duration:1500,$Zoom:11,$Rotate:0.3,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseOutWave},$ScaleHorizontal:2,$ScaleVertical:0.3,$Opacity:2};_CaptionTransitions["RTT*WVC|LB"] = {$Duration:1500,$Zoom:11,$Rotate:0.3,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseOutWave},$ScaleHorizontal:2,$ScaleVertical:0.3,$Opacity:2};_CaptionTransitions["RTT*WVC|RT"] = {$Duration:1500,$Zoom:11,$Rotate:0.3,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseOutWave},$ScaleHorizontal:2,$ScaleVertical:0.3,$Opacity:2};_CaptionTransitions["RTT*WVC|RB"] = {$Duration:1500,$Zoom:11,$Rotate:0.3,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseOutWave},$ScaleHorizontal:2,$ScaleVertical:0.3,$Opacity:2};_CaptionTransitions["RTT*WVC|TL"] = {$Duration:1500,$Zoom:11,$Rotate:0.3,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseOutWave,$Top:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.3,$ScaleVertical:2,$Opacity:2};_CaptionTransitions["RTT*WVC|TR"] = {$Duration:1500,$Zoom:11,$Rotate:0.3,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseOutWave,$Top:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.3,$ScaleVertical:2,$Opacity:2};_CaptionTransitions["RTT*WVC|BL"] = {$Duration:1500,$Zoom:11,$Rotate:0.3,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseOutWave,$Top:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.3,$ScaleVertical:2,$Opacity:2};_CaptionTransitions["RTT*WVC|BR"] = {$Duration:1500,$Zoom:11,$Rotate:0.3,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseOutWave,$Top:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.3,$ScaleVertical:2,$Opacity:2};_CaptionTransitions["RTT*WVR|LT"] = {$Duration:1500,$Zoom:11,$Rotate:0.3,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInWave},$ScaleHorizontal:2,$ScaleVertical:0.3,$Opacity:2};_CaptionTransitions["RTT*WVR|LB"] = {$Duration:1500,$Zoom:11,$Rotate:0.3,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInWave},$ScaleHorizontal:2,$ScaleVertical:0.3,$Opacity:2};_CaptionTransitions["RTT*WVR|RT"] = {$Duration:1500,$Zoom:11,$Rotate:0.3,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInWave},$ScaleHorizontal:2,$ScaleVertical:0.3,$Opacity:2};_CaptionTransitions["RTT*WVR|RB"] = {$Duration:1500,$Zoom:11,$Rotate:0.3,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInWave},$ScaleHorizontal:2,$ScaleVertical:0.3,$Opacity:2};_CaptionTransitions["RTT*WVR|TL"] = {$Duration:1500,$Zoom:11,$Rotate:0.3,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.3,$ScaleVertical:2,$Opacity:2};_CaptionTransitions["RTT*WVR|TR"] = {$Duration:1500,$Zoom:11,$Rotate:0.3,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.3,$ScaleVertical:2,$Opacity:2};_CaptionTransitions["RTT*WVR|BL"] = {$Duration:1500,$Zoom:11,$Rotate:0.3,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.3,$ScaleVertical:2,$Opacity:2};_CaptionTransitions["RTT*WVR|BR"] = {$Duration:1500,$Zoom:11,$Rotate:0.3,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.3,$ScaleVertical:2,$Opacity:2};_CaptionTransitions["RTT*WV*J1|LT"] = {$Duration:1200,$Zoom:11,$Rotate:-0.8,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$During:{$Top:[0,0.5]},$Round:{$Left:0.3,$Top:0.5,$Rotate:0.4}};_CaptionTransitions["RTT*WV*J1|LB"] = {$Duration:1200,$Zoom:11,$Rotate:-0.8,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$During:{$Top:[0,0.5]},$Round:{$Left:0.3,$Top:0.5,$Rotate:0.4}};_CaptionTransitions["RTT*WV*J1|RT"] = {$Duration:1200,$Zoom:11,$Rotate:-0.8,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$During:{$Top:[0,0.5]},$Round:{$Left:0.3,$Top:0.5,$Rotate:0.4}};_CaptionTransitions["RTT*WV*J1|RB"] = {$Duration:1200,$Zoom:11,$Rotate:-0.8,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$During:{$Top:[0,0.5]},$Round:{$Left:0.3,$Top:0.5,$Rotate:0.4}};_CaptionTransitions["RTT*WV*J1|TL"] = {$Duration:1200,$Zoom:11,$Rotate:-0.8,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInJump,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$During:{$Left:[0,0.5]},$Round:{$Left:0.5,$Top:0.3,$Rotate:0.4}};_CaptionTransitions["RTT*WV*J1|TR"] = {$Duration:1200,$Zoom:11,$Rotate:-0.8,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInJump,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$During:{$Left:[0,0.5]},$Round:{$Left:0.5,$Top:0.3,$Rotate:0.4}};_CaptionTransitions["RTT*WV*J1|BL"] = {$Duration:1200,$Zoom:11,$Rotate:-0.8,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInJump,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$During:{$Left:[0,0.5]},$Round:{$Left:0.5,$Top:0.3,$Rotate:0.4}};_CaptionTransitions["RTT*WV*J1|BR"] = {$Duration:1200,$Zoom:11,$Rotate:-0.8,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInJump,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$During:{$Left:[0,0.5]},$Round:{$Left:0.5,$Top:0.3,$Rotate:0.4}};_CaptionTransitions["RTT*WV*J2|LT"] = {$Duration:1200,$Zoom:11,$Rotate:-0.6,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.4,$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT*WV*J2|LB"] = {$Duration:1200,$Zoom:11,$Rotate:-0.6,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.4,$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT*WV*J2|RT"] = {$Duration:1200,$Zoom:11,$Rotate:-0.6,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.4,$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT*WV*J2|RB"] = {$Duration:1200,$Zoom:11,$Rotate:-0.6,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.4,$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT*WV*J2|TL"] = {$Duration:1200,$Zoom:11,$Rotate:-0.6,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.4,$ScaleVertical:0.8,$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT*WV*J2|TR"] = {$Duration:1200,$Zoom:11,$Rotate:-0.6,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.4,$ScaleVertical:0.8,$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT*WV*J2|BL"] = {$Duration:1200,$Zoom:11,$Rotate:-0.6,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.4,$ScaleVertical:0.8,$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT*WV*J2|BR"] = {$Duration:1200,$Zoom:11,$Rotate:-0.6,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.4,$ScaleVertical:0.8,$Opacity:2,$Round:{$Rotate:0.5}};_CaptionTransitions["RTT*WV*J3|LT"] = {$Duration:1200,$Zoom:11,$Rotate:-1,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInSine,$Top:$JssorEasing$.$EaseOutJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$Round:{$Top:0.5,$Rotate:0.5}};_CaptionTransitions["RTT*WV*J3|LB"] = {$Duration:1200,$Zoom:11,$Rotate:-1,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInSine,$Top:$JssorEasing$.$EaseOutJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$Round:{$Top:0.5,$Rotate:0.5}};_CaptionTransitions["RTT*WV*J3|RT"] = {$Duration:1200,$Zoom:11,$Rotate:-1,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInSine,$Top:$JssorEasing$.$EaseOutJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$Round:{$Top:0.5,$Rotate:0.5}};_CaptionTransitions["RTT*WV*J3|RB"] = {$Duration:1200,$Zoom:11,$Rotate:-1,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInSine,$Top:$JssorEasing$.$EaseOutJump,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$Round:{$Top:0.5,$Rotate:0.5}};_CaptionTransitions["RTT*WV*J3|TL"] = {$Duration:1200,$Zoom:11,$Rotate:-1,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseOutJump,$Top:$JssorEasing$.$EaseInSine,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$Round:{$Left:0.5,$Rotate:0.5}};_CaptionTransitions["RTT*WV*J3|TR"] = {$Duration:1200,$Zoom:11,$Rotate:-1,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseOutJump,$Top:$JssorEasing$.$EaseInSine,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$Round:{$Left:0.5,$Rotate:0.5}};_CaptionTransitions["RTT*WV*J3|BL"] = {$Duration:1200,$Zoom:11,$Rotate:-1,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseOutJump,$Top:$JssorEasing$.$EaseInSine,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$Round:{$Left:0.5,$Rotate:0.5}};_CaptionTransitions["RTT*WV*J3|BR"] = {$Duration:1200,$Zoom:11,$Rotate:-1,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseOutJump,$Top:$JssorEasing$.$EaseInSine,$Zoom:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2,$Round:{$Left:0.5,$Rotate:0.5}};_CaptionTransitions["DDG|TL"] = {$Duration:1200,$Zoom:1,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInJump,$Top:$JssorEasing$.$EaseInJump},$ScaleHorizontal:0.3,$ScaleVertical:0.3,$Opacity:2,$During:{$Left:[0,0.8],$Top:[0,0.8]},$Round:{$Left:0.8,$Top:0.8}};_CaptionTransitions["DDG|TR"] = {$Duration:1200,$Zoom:1,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInJump,$Top:$JssorEasing$.$EaseInJump},$ScaleHorizontal:0.3,$ScaleVertical:0.3,$Opacity:2,$During:{$Left:[0,0.8],$Top:[0,0.8]},$Round:{$Left:0.8,$Top:0.8}};_CaptionTransitions["DDG|BL"] = {$Duration:1200,$Zoom:1,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInJump,$Top:$JssorEasing$.$EaseInJump},$ScaleHorizontal:0.3,$ScaleVertical:0.3,$Opacity:2,$During:{$Left:[0,0.8],$Top:[0,0.8]},$Round:{$Left:0.8,$Top:0.8}};_CaptionTransitions["DDG|BR"] = {$Duration:1200,$Zoom:1,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInJump,$Top:$JssorEasing$.$EaseInJump},$ScaleHorizontal:0.3,$ScaleVertical:0.3,$Opacity:2,$During:{$Left:[0,0.8],$Top:[0,0.8]},$Round:{$Left:0.8,$Top:0.8}};_CaptionTransitions["DDGDANCE|LT"] = {$Duration:1800,$Zoom:1,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInJump,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseOutQuad},$ScaleHorizontal:0.3,$ScaleVertical:0.3,$Opacity:2,$During:{$Left:[0,0.8],$Top:[0,0.8]},$Round:{$Left:0.8,$Top:2.5}};_CaptionTransitions["DDGDANCE|RT"] = {$Duration:1800,$Zoom:1,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInJump,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseOutQuad},$ScaleHorizontal:0.3,$ScaleVertical:0.3,$Opacity:2,$During:{$Left:[0,0.8],$Top:[0,0.8]},$Round:{$Left:0.8,$Top:2.5}};_CaptionTransitions["DDGDANCE|LB"] = {$Duration:1800,$Zoom:1,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInJump,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseOutQuad},$ScaleHorizontal:0.3,$ScaleVertical:0.3,$Opacity:2,$During:{$Left:[0,0.8],$Top:[0,0.8]},$Round:{$Left:0.8,$Top:2.5}};_CaptionTransitions["DDGDANCE|RB"] = {$Duration:1800,$Zoom:1,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInJump,$Top:$JssorEasing$.$EaseInJump,$Zoom:$JssorEasing$.$EaseOutQuad},$ScaleHorizontal:0.3,$ScaleVertical:0.3,$Opacity:2,$During:{$Left:[0,0.8],$Top:[0,0.8]},$Round:{$Left:0.8,$Top:2.5}};_CaptionTransitions["DDGPET|LT"] = {$Duration:1800,$Zoom:1,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseOutQuad},$ScaleHorizontal:0.2,$ScaleVertical:0.05,$Opacity:2,$During:{$Left:[0,0.7],$Top:[0,0.7]},$Round:{$Left:0.8,$Top:2.5}};_CaptionTransitions["DDGPET|LB"] = {$Duration:1800,$Zoom:1,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseOutQuad},$ScaleHorizontal:0.2,$ScaleVertical:0.05,$Opacity:2,$During:{$Left:[0,0.7],$Top:[0,0.7]},$Round:{$Left:0.8,$Top:2.5}};_CaptionTransitions["DDGPET|RT"] = {$Duration:1800,$Zoom:1,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseOutQuad},$ScaleHorizontal:0.2,$ScaleVertical:0.05,$Opacity:2,$During:{$Left:[0,0.7],$Top:[0,0.7]},$Round:{$Left:0.8,$Top:2.5}};_CaptionTransitions["DDGPET|RB"] = {$Duration:1800,$Zoom:1,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseOutQuad},$ScaleHorizontal:0.2,$ScaleVertical:0.05,$Opacity:2,$During:{$Left:[0,0.7],$Top:[0,0.7]},$Round:{$Left:0.8,$Top:2.5}};_CaptionTransitions["FLTTR|L"] = {$Duration:900,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseInWave},$ScaleHorizontal:0.2,$ScaleVertical:0.1,$Opacity:2,$Round:{$Top:1.3}};_CaptionTransitions["FLTTR|R"] = {$Duration:900,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseInWave},$ScaleHorizontal:0.2,$ScaleVertical:0.1,$Opacity:2,$Round:{$Top:1.3}};_CaptionTransitions["FLTTR|T"] = {$Duration:900,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.1,$ScaleVertical:0.2,$Opacity:2,$Round:{$Left:1.3}};_CaptionTransitions["FLTTR|B"] = {$Duration:900,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.1,$ScaleVertical:0.2,$Opacity:2,$Round:{$Left:1.3}};_CaptionTransitions["FLTTRWN|LT"] = {$Duration:1800,$Zoom:1,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInOutSine,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInOutQuad},$ScaleHorizontal:0.5,$ScaleVertical:0.2,$Opacity:2,$During:{$Left:[0,0.7],$Top:[0.1,0.7]},$Round:{$Top:1.3}};_CaptionTransitions["FLTTRWN|LB"] = {$Duration:1800,$Zoom:1,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInOutSine,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInOutQuad},$ScaleHorizontal:0.5,$ScaleVertical:0.2,$Opacity:2,$During:{$Left:[0,0.7],$Top:[0.1,0.7]},$Round:{$Top:1.3}};_CaptionTransitions["FLTTRWN|RT"] = {$Duration:1800,$Zoom:1,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInOutSine,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInOutQuad},$ScaleHorizontal:0.5,$ScaleVertical:0.2,$Opacity:2,$During:{$Left:[0,0.7],$Top:[0.1,0.7]},$Round:{$Top:1.3}};_CaptionTransitions["FLTTRWN|RB"] = {$Duration:1800,$Zoom:1,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInOutSine,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInOutQuad},$ScaleHorizontal:0.5,$ScaleVertical:0.2,$Opacity:2,$During:{$Left:[0,0.7],$Top:[0.1,0.7]},$Round:{$Top:1.3}};_CaptionTransitions["FLTTRWN|TL"] = {$Duration:1800,$Zoom:1,$FlyDirection:5,$Easing:{$Top:$JssorEasing$.$EaseInOutSine,$Left:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInOutQuad},$ScaleHorizontal:0.2,$ScaleVertical:0.5,$Opacity:2,$During:{$Top:[0,0.7],$Left:[0.1,0.7]},$Round:{$Left:1.3}};_CaptionTransitions["FLTTRWN|TR"] = {$Duration:1800,$Zoom:1,$FlyDirection:6,$Easing:{$Top:$JssorEasing$.$EaseInOutSine,$Left:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInOutQuad},$ScaleHorizontal:0.2,$ScaleVertical:0.5,$Opacity:2,$During:{$Top:[0,0.7],$Left:[0.1,0.7]},$Round:{$Left:1.3}};_CaptionTransitions["FLTTRWN|BL"] = {$Duration:1800,$Zoom:1,$FlyDirection:9,$Easing:{$Top:$JssorEasing$.$EaseInOutSine,$Left:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInOutQuad},$ScaleHorizontal:0.2,$ScaleVertical:0.5,$Opacity:2,$During:{$Top:[0,0.7],$Left:[0.1,0.7]},$Round:{$Left:1.3}};_CaptionTransitions["FLTTRWN|BR"] = {$Duration:1800,$Zoom:1,$FlyDirection:10,$Easing:{$Top:$JssorEasing$.$EaseInOutSine,$Left:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInOutQuad},$ScaleHorizontal:0.2,$ScaleVertical:0.5,$Opacity:2,$During:{$Top:[0,0.7],$Left:[0.1,0.7]},$Round:{$Left:1.3}};_CaptionTransitions["LATENCY|LT"] = {$Duration:1200,$Zoom:1,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInOutSine,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInOutQuad},$ScaleHorizontal:0.5,$ScaleVertical:0.3,$Opacity:2,$During:{$Left:[0,0.7],$Top:[0.1,0.7]},$Round:{$Top:0.4}};_CaptionTransitions["LATENCY|LB"] = {$Duration:1200,$Zoom:1,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInOutSine,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInOutQuad},$ScaleHorizontal:0.5,$ScaleVertical:0.3,$Opacity:2,$During:{$Left:[0,0.7],$Top:[0.1,0.7]},$Round:{$Top:0.4}};_CaptionTransitions["LATENCY|RT"] = {$Duration:1200,$Zoom:1,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInOutSine,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInOutQuad},$ScaleHorizontal:0.5,$ScaleVertical:0.3,$Opacity:2,$During:{$Left:[0,0.7],$Top:[0.1,0.7]},$Round:{$Top:0.4}};_CaptionTransitions["LATENCY|RB"] = {$Duration:1200,$Zoom:1,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInOutSine,$Top:$JssorEasing$.$EaseInWave,$Zoom:$JssorEasing$.$EaseInOutQuad},$ScaleHorizontal:0.5,$ScaleVertical:0.3,$Opacity:2,$During:{$Left:[0,0.7],$Top:[0.1,0.7]},$Round:{$Top:0.4}};_CaptionTransitions["LATENCY|TL"] = {$Duration:1200,$Zoom:1,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseOutSine,$Zoom:$JssorEasing$.$EaseInOutQuad},$ScaleHorizontal:0.5,$ScaleVertical:0.5,$Opacity:2,$During:{$Left:[0.1,0.7],$Top:[0,0.7]},$Round:{$Left:0.4}};_CaptionTransitions["LATENCY|TR"] = {$Duration:1200,$Zoom:1,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseOutSine,$Zoom:$JssorEasing$.$EaseInOutQuad},$ScaleHorizontal:0.5,$ScaleVertical:0.5,$Opacity:2,$During:{$Left:[0.1,0.7],$Top:[0,0.7]},$Round:{$Left:0.4}};_CaptionTransitions["LATENCY|BL"] = {$Duration:1200,$Zoom:1,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseOutSine,$Zoom:$JssorEasing$.$EaseInOutQuad},$ScaleHorizontal:0.5,$ScaleVertical:0.5,$Opacity:2,$During:{$Left:[0.1,0.7],$Top:[0,0.7]},$Round:{$Left:0.4}};_CaptionTransitions["LATENCY|BR"] = {$Duration:1200,$Zoom:1,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseOutSine,$Zoom:$JssorEasing$.$EaseInOutQuad},$ScaleHorizontal:0.5,$ScaleVertical:0.5,$Opacity:2,$During:{$Left:[0.1,0.7],$Top:[0,0.7]},$Round:{$Left:0.4}};_CaptionTransitions["TORTUOUS|HL"] = {$Duration:1800,$Zoom:1,$FlyDirection:1,$Easing:{$Left:$JssorEasing$.$EaseOutWave,$Zoom:$JssorEasing$.$EaseOutCubic},$ScaleHorizontal:0.2,$Opacity:2,$During:{$Left:[0,0.7]},$Round:{$Left:1.3}};_CaptionTransitions["TORTUOUS|HR"] = {$Duration:1800,$Zoom:1,$FlyDirection:2,$Easing:{$Left:$JssorEasing$.$EaseOutWave,$Zoom:$JssorEasing$.$EaseOutCubic},$ScaleHorizontal:0.2,$Opacity:2,$During:{$Left:[0,0.7]},$Round:{$Left:1.3}};_CaptionTransitions["TORTUOUS|VB"] = {$Duration:1800,$Zoom:1,$FlyDirection:8,$Easing:{$Top:$JssorEasing$.$EaseOutWave,$Zoom:$JssorEasing$.$EaseOutCubic},$ScaleVertical:0.2,$Opacity:2,$During:{$Top:[0,0.7]},$Round:{$Top:1.3}};_CaptionTransitions["TORTUOUS|VT"] = {$Duration:1800,$Zoom:1,$FlyDirection:4,$Easing:{$Top:$JssorEasing$.$EaseOutWave,$Zoom:$JssorEasing$.$EaseOutCubic},$ScaleVertical:0.2,$Opacity:2,$During:{$Top:[0,0.7]},$Round:{$Top:1.3}};_CaptionTransitions["TORTUOUS|LT"] = {$Duration:1800,$Zoom:1,$FlyDirection:5,$Easing:{$Top:$JssorEasing$.$EaseOutWave,$Zoom:$JssorEasing$.$EaseOutCubic},$ScaleVertical:0.2,$Opacity:2,$During:{$Top:[0,0.7]},$Round:{$Left:1.3}};_CaptionTransitions["TORTUOUS|LB"] = {$Duration:1800,$Zoom:1,$FlyDirection:9,$Easing:{$Top:$JssorEasing$.$EaseOutWave,$Zoom:$JssorEasing$.$EaseOutCubic},$ScaleVertical:0.2,$Opacity:2,$During:{$Top:[0,0.7]},$Round:{$Left:1.3}};_CaptionTransitions["TORTUOUS|RT"] = {$Duration:1800,$Zoom:1,$FlyDirection:6,$Easing:{$Top:$JssorEasing$.$EaseOutWave,$Zoom:$JssorEasing$.$EaseOutCubic},$ScaleVertical:0.2,$Opacity:2,$During:{$Top:[0,0.7]},$Round:{$Left:1.3}};_CaptionTransitions["TORTUOUS|RB"] = {$Duration:1800,$Zoom:1,$FlyDirection:10,$Easing:{$Top:$JssorEasing$.$EaseOutWave,$Zoom:$JssorEasing$.$EaseOutCubic},$ScaleVertical:0.2,$Opacity:2,$During:{$Top:[0,0.7]},$Round:{$Left:1.3}};_CaptionTransitions["TORTUOUS|TL"] = {$Duration:1800,$Zoom:1,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseOutWave,$Zoom:$JssorEasing$.$EaseOutCubic},$ScaleHorizontal:0.2,$Opacity:2,$During:{$Left:[0,0.7]},$Round:{$Top:1.3}};_CaptionTransitions["TORTUOUS|TR"] = {$Duration:1800,$Zoom:1,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseOutWave,$Zoom:$JssorEasing$.$EaseOutCubic},$ScaleHorizontal:0.2,$Opacity:2,$During:{$Left:[0,0.7]},$Round:{$Top:1.3}};_CaptionTransitions["TORTUOUS|BL"] = {$Duration:1800,$Zoom:1,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseOutWave,$Zoom:$JssorEasing$.$EaseOutCubic},$ScaleHorizontal:0.2,$Opacity:2,$During:{$Left:[0,0.7]},$Round:{$Top:1.3}};_CaptionTransitions["TORTUOUS|BR"] = {$Duration:1800,$Zoom:1,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseOutWave,$Zoom:$JssorEasing$.$EaseOutCubic},$ScaleHorizontal:0.2,$Opacity:2,$During:{$Left:[0,0.7]},$Round:{$Top:1.3}};_CaptionTransitions["SPACESHIP|LT"] = {$Duration:1200,$Zoom:3,$Rotate:-0.1,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInQuint,$Top:$JssorEasing$.$EaseInWave,$Opacity:$JssorEasing$.$EaseInQuint},$ScaleHorizontal:1,$ScaleVertical:0.1,$Opacity:2};_CaptionTransitions["SPACESHIP|LB"] = {$Duration:1200,$Zoom:3,$Rotate:-0.1,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInQuint,$Top:$JssorEasing$.$EaseInWave,$Opacity:$JssorEasing$.$EaseInQuint},$ScaleHorizontal:1,$ScaleVertical:0.1,$Opacity:2};_CaptionTransitions["SPACESHIP|RT"] = {$Duration:1200,$Zoom:3,$Rotate:0.1,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInQuint,$Top:$JssorEasing$.$EaseInWave,$Opacity:$JssorEasing$.$EaseInQuint},$ScaleHorizontal:1,$ScaleVertical:0.1,$Opacity:2};_CaptionTransitions["SPACESHIP|RB"] = {$Duration:1200,$Zoom:3,$Rotate:0.1,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInQuint,$Top:$JssorEasing$.$EaseInWave,$Opacity:$JssorEasing$.$EaseInQuint},$ScaleHorizontal:1,$ScaleVertical:0.1,$Opacity:2};_CaptionTransitions["ATTACK|LT"] = {$Duration:1500,$Zoom:1,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseInExpo,$Top:$JssorEasing$.$EaseOutWave},$ScaleHorizontal:0.5,$ScaleVertical:0.1,$Opacity:2,$During:{$Left:[0,0.7],$Top:[0.3,0.7]},$Round:{$Top:1.3}};_CaptionTransitions["ATTACK|LB"] = {$Duration:1500,$Zoom:1,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseInExpo,$Top:$JssorEasing$.$EaseOutWave},$ScaleHorizontal:0.5,$ScaleVertical:0.1,$Opacity:2,$During:{$Left:[0,0.7],$Top:[0.3,0.7]},$Round:{$Top:1.3}};_CaptionTransitions["ATTACK|RT"] = {$Duration:1500,$Zoom:1,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInExpo,$Top:$JssorEasing$.$EaseOutWave},$ScaleHorizontal:0.5,$ScaleVertical:0.1,$Opacity:2,$During:{$Left:[0,0.7],$Top:[0.3,0.7]},$Round:{$Top:1.3}};_CaptionTransitions["ATTACK|RB"] = {$Duration:1500,$Zoom:1,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInExpo,$Top:$JssorEasing$.$EaseOutWave},$ScaleHorizontal:0.5,$ScaleVertical:0.1,$Opacity:2,$During:{$Left:[0,0.7],$Top:[0.3,0.7]},$Round:{$Top:1.3}};_CaptionTransitions["ATTACK|TL"] = {$Duration:1500,$Zoom:1,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseOutWave,$Top:$JssorEasing$.$EaseInExpo},$ScaleHorizontal:0.1,$ScaleVertical:0.5,$Opacity:2,$During:{$Left:[0.3,0.7],$Top:[0,0.7]},$Round:{$Left:1.3}};_CaptionTransitions["ATTACK|TR"] = {$Duration:1500,$Zoom:1,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseOutWave,$Top:$JssorEasing$.$EaseInExpo},$ScaleHorizontal:0.1,$ScaleVertical:0.5,$Opacity:2,$During:{$Left:[0.3,0.7],$Top:[0,0.7]},$Round:{$Left:1.3}};_CaptionTransitions["ATTACK|BL"] = {$Duration:1500,$Zoom:1,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseOutWave,$Top:$JssorEasing$.$EaseInExpo},$ScaleHorizontal:0.1,$ScaleVertical:0.5,$Opacity:2,$During:{$Left:[0.3,0.7],$Top:[0,0.7]},$Round:{$Left:1.3}};_CaptionTransitions["ATTACK|BR"] = {$Duration:1500,$Zoom:1,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseOutWave,$Top:$JssorEasing$.$EaseInExpo},$ScaleHorizontal:0.1,$ScaleVertical:0.5,$Opacity:2,$During:{$Left:[0.3,0.7],$Top:[0,0.7]},$Round:{$Left:1.3}};_CaptionTransitions["LISTV|L"] = {$Duration:1500,$Clip:4,$FlyDirection:1,$Easing:$JssorEasing$.$EaseInOutCubic,$ScaleHorizontal:0.8,$ScaleClip:0.8,$Opacity:2,$During:{$Left:[0.4,0.6],$Clip:[0,0.4],$Opacity:[0.4,0.6]}};_CaptionTransitions["LISTV|R"] = {$Duration:1500,$Clip:4,$FlyDirection:2,$Easing:$JssorEasing$.$EaseInOutCubic,$ScaleHorizontal:0.8,$ScaleClip:0.8,$Opacity:2,$During:{$Left:[0.4,0.6],$Clip:[0,0.4],$Opacity:[0.4,0.6]}};_CaptionTransitions["LISTH|L"] = {$Duration:1500,$Clip:1,$FlyDirection:1,$Easing:$JssorEasing$.$EaseInOutCubic,$ScaleHorizontal:0.8,$ScaleClip:0.8,$Opacity:2,$During:{$Left:[0.4,0.6],$Clip:[0,0.4],$Opacity:[0.4,0.6]}};_CaptionTransitions["LISTH|R"] = {$Duration:1500,$Clip:1,$FlyDirection:2,$Easing:$JssorEasing$.$EaseInOutCubic,$ScaleHorizontal:0.8,$ScaleClip:0.8,$Opacity:2,$During:{$Left:[0.4,0.6],$Clip:[0,0.4],$Opacity:[0.4,0.6]}};_CaptionTransitions["LISTVC|L"] = {$Duration:1500,$Clip:12,$FlyDirection:1,$Easing:$JssorEasing$.$EaseInOutCubic,$ScaleHorizontal:0.8,$ScaleClip:0.8,$Opacity:2,$During:{$Left:[0.4,0.6],$Clip:[0,0.4],$Opacity:[0.4,0.6]}};_CaptionTransitions["LISTVC|R"] = {$Duration:1500,$Clip:12,$FlyDirection:2,$Easing:$JssorEasing$.$EaseInOutCubic,$ScaleHorizontal:0.8,$ScaleClip:0.8,$Opacity:2,$During:{$Left:[0.4,0.6],$Clip:[0,0.4],$Opacity:[0.4,0.6]}};_CaptionTransitions["LISTVC|B"] = {$Duration:1500,$Clip:12,$FlyDirection:8,$Easing:$JssorEasing$.$EaseInOutCubic,$ScaleVertical:0.8,$ScaleClip:0.8,$Opacity:2,$During:{$Top:[0.4,0.6],$Clip:[0,0.4],$Opacity:[0.4,0.6]}};_CaptionTransitions["LISTVC|T"] = {$Duration:1500,$Clip:12,$FlyDirection:4,$Easing:$JssorEasing$.$EaseInOutCubic,$ScaleVertical:0.8,$ScaleClip:0.8,$Opacity:2,$During:{$Top:[0.4,0.6],$Clip:[0,0.4],$Opacity:[0.4,0.6]}};_CaptionTransitions["LISTHC|L"] = {$Duration:1500,$Clip:3,$FlyDirection:1,$Easing:$JssorEasing$.$EaseInOutCubic,$ScaleHorizontal:0.8,$ScaleClip:0.8,$Opacity:2,$During:{$Left:[0.4,0.6],$Clip:[0,0.4],$Opacity:[0.4,0.6]}};_CaptionTransitions["LISTHC|R"] = {$Duration:1500,$Clip:3,$FlyDirection:2,$Easing:$JssorEasing$.$EaseInOutCubic,$ScaleHorizontal:0.8,$ScaleClip:0.8,$Opacity:2,$During:{$Left:[0.4,0.6],$Clip:[0,0.4],$Opacity:[0.4,0.6]}};_CaptionTransitions["LISTHC|B"] = {$Duration:1500,$Clip:3,$FlyDirection:8,$Easing:$JssorEasing$.$EaseInOutCubic,$ScaleVertical:0.8,$ScaleClip:0.8,$Opacity:2,$During:{$Top:[0.4,0.6],$Clip:[0,0.4],$Opacity:[0.4,0.6]}};_CaptionTransitions["LISTHC|T"] = {$Duration:1500,$Clip:3,$FlyDirection:4,$Easing:$JssorEasing$.$EaseInOutCubic,$ScaleVertical:0.8,$ScaleClip:0.8,$Opacity:2,$During:{$Top:[0.4,0.6],$Clip:[0,0.4],$Opacity:[0.4,0.6]}};_CaptionTransitions["WV|L"] = {$Duration:1800,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseInWave},$ScaleHorizontal:0.6,$ScaleVertical:0.3,$Opacity:2,$Round:{$Top:2.5}};_CaptionTransitions["WV|R"] = {$Duration:1800,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseInWave},$ScaleHorizontal:0.6,$ScaleVertical:0.3,$Opacity:2,$Round:{$Top:2.5}};_CaptionTransitions["WV|T"] = {$Duration:1200,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.2,$ScaleVertical:0.6,$Opacity:2,$Round:{$Left:1.5}};_CaptionTransitions["WV|B"] = {$Duration:1200,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.2,$ScaleVertical:0.6,$Opacity:2,$Round:{$Left:1.5}};_CaptionTransitions["WVC|L"] = {$Duration:1800,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseOutWave},$ScaleHorizontal:0.6,$ScaleVertical:0.3,$Opacity:2,$Round:{$Top:2.5}};_CaptionTransitions["WVC|R"] = {$Duration:1800,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseOutWave},$ScaleHorizontal:0.6,$ScaleVertical:0.3,$Opacity:2,$Round:{$Top:2.5}};_CaptionTransitions["WVC|T"] = {$Duration:1200,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseOutWave,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.2,$ScaleVertical:0.6,$Opacity:2,$Round:{$Left:1.5}};_CaptionTransitions["WVC|B"] = {$Duration:1200,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseOutWave,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.2,$ScaleVertical:0.6,$Opacity:2,$Round:{$Left:1.5}};_CaptionTransitions["WVR|L"] = {$Duration:1800,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseInWave},$ScaleHorizontal:0.6,$ScaleVertical:0.3,$Opacity:2,$Round:{$Top:2.5}};_CaptionTransitions["WVR|R"] = {$Duration:1800,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseInWave},$ScaleHorizontal:0.6,$ScaleVertical:0.3,$Opacity:2,$Round:{$Top:2.5}};_CaptionTransitions["JDN|L"] = {$Duration:2000,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseOutJump},$ScaleHorizontal:0.6,$ScaleVertical:0.4,$Opacity:2,$Round:{$Top:2.5}};_CaptionTransitions["JDN|R"] = {$Duration:2000,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseOutJump},$ScaleHorizontal:0.6,$ScaleVertical:0.4,$Opacity:2,$Round:{$Top:2.5}};_CaptionTransitions["JDN|T"] = {$Duration:1500,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseOutJump,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.3,$ScaleVertical:0.6,$Opacity:2,$Round:{$Left:1.5}};_CaptionTransitions["JDN|B"] = {$Duration:1500,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseOutJump,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.3,$ScaleVertical:0.6,$Opacity:2,$Round:{$Left:1.5}};_CaptionTransitions["JUP|L"] = {$Duration:2000,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseInJump},$ScaleHorizontal:0.6,$ScaleVertical:0.4,$Opacity:2,$Round:{$Top:2.5}};_CaptionTransitions["JUP|R"] = {$Duration:2000,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseInJump},$ScaleHorizontal:0.6,$ScaleVertical:0.4,$Opacity:2,$Round:{$Top:2.5}};_CaptionTransitions["JUP|T"] = {$Duration:1500,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInJump,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.3,$ScaleVertical:0.6,$Opacity:2,$Round:{$Left:1.5}};_CaptionTransitions["JUP|B"] = {$Duration:1500,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInJump,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.3,$ScaleVertical:0.6,$Opacity:2,$Round:{$Left:1.5}};_CaptionTransitions["FADE"] = {$Duration:900,$Opacity:2};_CaptionTransitions["FADE*JDN|L"] = {$Duration:1200,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseOutCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["FADE*JDN|R"] = {$Duration:1200,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseOutCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["FADE*JDN|T"] = {$Duration:1200,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseOutCubic,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["FADE*JDN|B"] = {$Duration:1200,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseOutCubic,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["FADE*JUP|L"] = {$Duration:900,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["FADE*JUP|R"] = {$Duration:900,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["FADE*JUP|T"] = {$Duration:900,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["FADE*JUP|B"] = {$Duration:900,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.6,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["L-JDN"] = {$Duration:1200,$Opacity:2,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseOutCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.5,$During:{$Top:[0,0.5]}};_CaptionTransitions["R-JDN"] = {$Duration:1200,$Opacity:2,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseOutCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.5,$During:{$Top:[0,0.5]}};_CaptionTransitions["T-JDN"] = {$Duration:1200,$Opacity:2,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseOutCubic,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.5,$ScaleVertical:0.8,$During:{$Left:[0,0.5]}};_CaptionTransitions["B-JDN"] = {$Duration:1200,$Opacity:2,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseOutCubic,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.5,$ScaleVertical:0.8,$During:{$Left:[0,0.5]}};_CaptionTransitions["L-JUP"] = {$Duration:1200,$Opacity:2,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.5,$During:{$Top:[0,0.5]}};_CaptionTransitions["R-JUP"] = {$Duration:1200,$Opacity:2,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseInCubic},$ScaleHorizontal:0.8,$ScaleVertical:0.5,$During:{$Top:[0,0.5]}};_CaptionTransitions["T-JUP"] = {$Duration:1200,$Opacity:2,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.5,$ScaleVertical:0.8,$During:{$Left:[0,0.5]}};_CaptionTransitions["B-JUP"] = {$Duration:1200,$Opacity:2,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.5,$ScaleVertical:0.8,$During:{$Left:[0,0.5]}};_CaptionTransitions["L-WVC"] = {$Duration:1200,$Opacity:2,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseOutWave},$ScaleHorizontal:0.8,$ScaleVertical:0.3,$During:{$Top:[0,0.5]}};_CaptionTransitions["R-WVC"] = {$Duration:1200,$Opacity:2,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseOutWave},$ScaleHorizontal:0.8,$ScaleVertical:0.3,$During:{$Top:[0,0.5]}};_CaptionTransitions["T-WVC"] = {$Duration:1200,$Opacity:2,$FlyDirection:5,$Easing:{$Left:$JssorEasing$.$EaseOutWave,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.2,$ScaleVertical:0.8,$During:{$Left:[0,0.5]}};_CaptionTransitions["B-WVC"] = {$Duration:1200,$Opacity:2,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseOutWave,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.2,$ScaleVertical:0.8,$During:{$Left:[0,0.5]}};_CaptionTransitions["L-WVR"] = {$Duration:1200,$Opacity:2,$FlyDirection:9,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseInWave},$ScaleHorizontal:0.8,$ScaleVertical:0.3,$During:{$Top:[0,0.5]}};_CaptionTransitions["R-WVR"] = {$Duration:1200,$Opacity:2,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseLinear,$Top:$JssorEasing$.$EaseInWave},$ScaleHorizontal:0.8,$ScaleVertical:0.3,$During:{$Top:[0,0.5]}};_CaptionTransitions["T-WVR"] = {$Duration:1200,$Opacity:2,$FlyDirection:6,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.2,$ScaleVertical:0.8,$During:{$Left:[0,0.5]}};_CaptionTransitions["B-WVR"] = {$Duration:1200,$Opacity:2,$FlyDirection:10,$Easing:{$Left:$JssorEasing$.$EaseInWave,$Top:$JssorEasing$.$EaseLinear},$ScaleHorizontal:0.2,$ScaleVertical:0.8,$During:{$Left:[0,0.5]}};_CaptionTransitions["CLIP-FADE"] = {$Duration:1200,$Clip:15,$Opacity:1.7,$During:{$Clip:[0.5,0.5],$Opacity:[0,0.5]}};_CaptionTransitions["CLIP|LR-FADE"] = {$Duration:1200,$Clip:3,$Opacity:1.7,$During:{$Clip:[0.5,0.5],$Opacity:[0,0.5]}};_CaptionTransitions["CLIP|TB-FADE"] = {$Duration:1200,$Clip:12,$Opacity:1.7,$During:{$Clip:[0.5,0.5],$Opacity:[0,0.5]}};_CaptionTransitions["CLIP|L-FADE"] = {$Duration:1200,$Clip:1,$Opacity:1.7,$During:{$Clip:[0.5,0.5],$Opacity:[0,0.5]}};_CaptionTransitions["CLIP|R-FADE"] = {$Duration:1200,$Clip:2,$Opacity:1.7,$During:{$Clip:[0.5,0.5],$Opacity:[0,0.5]}};_CaptionTransitions["CLIP|T-FADE"] = {$Duration:1200,$Clip:4,$Opacity:1.7,$During:{$Clip:[0.5,0.5],$Opacity:[0,0.5]}};_CaptionTransitions["CLIP|B-FADE"] = {$Duration:1200,$Clip:8,$Opacity:1.7,$During:{$Clip:[0.5,0.5],$Opacity:[0,0.5]}};_CaptionTransitions["MCLIP|L-FADE"] = {$Duration:1200,$Clip:1,$Move:true,$Opacity:1.7,$During:{$Clip:[0.5,0.5],$Opacity:[0,0.5]}};_CaptionTransitions["MCLIP|R-FADE"] = {$Duration:1200,$Clip:2,$Move:true,$Opacity:1.7,$During:{$Clip:[0.5,0.5],$Opacity:[0,0.5]}};_CaptionTransitions["MCLIP|T-FADE"] = {$Duration:1200,$Clip:4,$Move:true,$Opacity:1.7,$During:{$Clip:[0.5,0.5],$Opacity:[0,0.5]}};_CaptionTransitions["MCLIP|B-FADE"] = {$Duration:1200,$Clip:8,$Move:true,$Opacity:1.7,$During:{$Clip:[0.5,0.5],$Opacity:[0,0.5]}};_CaptionTransitions["L*CLIP"] = {$Duration:1200,$Clip:12,$FlyDirection:1,$Easing:$JssorEasing$.$EaseInCubic,$ScaleHorizontal:0.6,$Opacity:2};_CaptionTransitions["R*CLIP"] = {$Duration:1200,$Clip:12,$FlyDirection:2,$Easing:$JssorEasing$.$EaseInCubic,$ScaleHorizontal:0.6,$Opacity:2};_CaptionTransitions["T*CLIP"] = {$Duration:1200,$Clip:3,$FlyDirection:4,$Easing:$JssorEasing$.$EaseInCubic,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["B*CLIP"] = {$Duration:1200,$Clip:3,$FlyDirection:8,$Easing:$JssorEasing$.$EaseInCubic,$ScaleVertical:0.6,$Opacity:2};_CaptionTransitions["T-L*"] = {$Duration:1500,$Rotate:-1,$FlyDirection:5,$Easing:$JssorEasing$.$EaseLinear,$ScaleHorizontal:0.5,$ScaleVertical:0.5,$Opacity:2,$During:{$Left:[0,0.33],$Top:[0.67,0.33],$Rotate:[0,0.33]},$Round:{$Rotate:0.25}};_CaptionTransitions["T-R*"] = {$Duration:1500,$Rotate:1,$FlyDirection:6,$Easing:$JssorEasing$.$EaseLinear,$ScaleHorizontal:0.5,$ScaleVertical:0.5,$Opacity:2,$During:{$Left:[0,0.33],$Top:[0.67,0.33],$Rotate:[0,0.33]},$Round:{$Rotate:0.25}};_CaptionTransitions["B-L*"] = {$Duration:1500,$Rotate:-1,$FlyDirection:9,$Easing:$JssorEasing$.$EaseLinear,$ScaleHorizontal:0.5,$ScaleVertical:0.5,$Opacity:2,$During:{$Left:[0,0.33],$Top:[0.67,0.33],$Rotate:[0,0.33]},$Round:{$Rotate:0.25}};_CaptionTransitions["B-R*"] = {$Duration:1500,$Rotate:-1,$FlyDirection:10,$Easing:$JssorEasing$.$EaseLinear,$ScaleHorizontal:0.5,$ScaleVertical:0.5,$Opacity:2,$During:{$Left:[0,0.33],$Top:[0.67,0.33],$Rotate:[0,0.33]},$Round:{$Rotate:0.25}};_CaptionTransitions["L-T*"] = {$Duration:1500,$Rotate:-1,$FlyDirection:5,$Easing:$JssorEasing$.$EaseLinear,$ScaleHorizontal:0.5,$ScaleVertical:0.5,$Opacity:2,$During:{$Left:[0.67,0.33],$Top:[0,0.33],$Rotate:[0,0.33]},$Round:{$Rotate:0.25}};_CaptionTransitions["L-B*"] = {$Duration:1500,$Rotate:-1,$FlyDirection:10,$Easing:$JssorEasing$.$EaseLinear,$ScaleHorizontal:0.5,$ScaleVertical:0.5,$Opacity:2,$During:{$Left:[0.67,0.33],$Top:[0,0.33],$Rotate:[0,0.33]},$Round:{$Rotate:0.25}};_CaptionTransitions["R-T*"] = {$Duration:1500,$Rotate:-1,$FlyDirection:6,$Easing:$JssorEasing$.$EaseLinear,$ScaleHorizontal:0.5,$ScaleVertical:0.5,$Opacity:2,$During:{$Left:[0.67,0.33],$Top:[0,0.33],$Rotate:[0,0.33]},$Round:{$Rotate:0.25}};_CaptionTransitions["R-B*"] = {$Duration:1500,$Rotate:-1,$FlyDirection:10,$Easing:$JssorEasing$.$EaseLinear,$ScaleHorizontal:0.5,$ScaleVertical:0.5,$Opacity:2,$During:{$Left:[0.67,0.33],$Top:[0,0.33],$Rotate:[0,0.33]},$Round:{$Rotate:0.25}};_CaptionTransitions["FADE-L*"] = {$Duration:1500,$Rotate:6.25,$FlyDirection:1,$Easing:$JssorEasing$.$EaseLinear,$ScaleHorizontal:0.5,$Opacity:2,$During:{$Left:[0,0.33],$Rotate:[0,0.33]},$Round:{$Rotate:0.25}};_CaptionTransitions["FADE-R*"] = {$Duration:1500,$Rotate:6.25,$FlyDirection:2,$Easing:$JssorEasing$.$EaseLinear,$ScaleHorizontal:0.5,$Opacity:2,$During:{$Left:[0,0.33],$Rotate:[0,0.33]},$Round:{$Rotate:0.25}};_CaptionTransitions["FADE-T*"] = {$Duration:1500,$Rotate:6.25,$FlyDirection:4,$Easing:$JssorEasing$.$EaseLinear,$ScaleVertical:0.5,$Opacity:2,$During:{$Top:[0,0.33],$Rotate:[0,0.33]},$Round:{$Rotate:0.25}};_CaptionTransitions["FADE-B*"] = {$Duration:1500,$Rotate:6.25,$FlyDirection:8,$Easing:$JssorEasing$.$EaseLinear,$ScaleVertical:0.5,$Opacity:2,$During:{$Top:[0,0.33],$Rotate:[0,0.33]},$Round:{$Rotate:0.25}};
		var options = {
			$FillMode: 2,                                       //[Optional] The way to fill image in slide, 0 stretch, 1 contain (keep aspect ratio and put all inside slide), 2 cover (keep aspect ratio and cover whole slide), 4 actual size, 5 contain for large image, actual size for small image, default value is 0
			$AutoPlay: true,
			$AutoPlayInterval: 3000,                    //$AutoPlay: true,                                    //[Optional] Whether to auto play, to enable slideshow, this option must be set to true, default value is false
			//$AutoPlayInterval: 1000,                            //[Optional] Interval (in milliseconds) to go for next slide since the previous stopped if the slider is auto playing, default value is 3000
			$PauseOnHover: 1,                    //$PauseOnHover: 1,                                   //[Optional] Whether to pause when mouse over if a slider is auto playing, 0 no pause, 1 pause for desktop, 2 pause for touch device, 3 pause for desktop and touch device, 4 freeze for desktop, 8 freeze for touch device, 12 freeze for desktop and touch device, default value is 1

			$ArrowKeyNavigation: true,   			            //[Optional] Allows keyboard (arrow key) navigation or not, default value is false
			$SlideEasing: $JssorEasing$.$EaseOutQuint,          //[Optional] Specifies easing for right to left animation, default value is $JssorEasing$.$EaseOutQuad
			$SlideDuration: 3800,                               //[Optional] Specifies default duration (swipe) for slide in milliseconds, default value is 500
			$MinDragOffsetToSlide: 20,                          //[Optional] Minimum drag offset to trigger slide , default value is 20
			//$SlideWidth: 600,                                 //[Optional] Width of every slide in pixels, default value is width of 'slides' container
			//$SlideHeight: 300,                                //[Optional] Height of every slide in pixels, default value is height of 'slides' container
			$SlideSpacing: 0, 					                //[Optional] Space between each slide in pixels, default value is 0
			$DisplayPieces: 1,                                  //[Optional] Number of pieces to display (the slideshow would be disabled if the value is set to greater than 1), the default value is 1
			$ParkingPosition: 0,                                //[Optional] The offset position to park slide (this options applys only when slideshow disabled), default value is 0.
			$UISearchMode: 1,                                   //[Optional] The way (0 parellel, 1 recursive, default value is 1) to search UI components (slides container, loading screen, navigator container, arrow navigator container, thumbnail navigator container etc).
			$PlayOrientation: 1,                                //[Optional] Orientation to play slide (for auto play, navigation), 1 horizental, 2 vertical, 5 horizental reverse, 6 vertical reverse, default value is 1
			$DragOrientation: 1,                                //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $DisplayPieces is greater than 1, or parking position is not 0)

			$SlideshowOptions: {                                //[Optional] Options to specify and enable slideshow or not
				$Class: $JssorSlideshowRunner$,                 //[Required] Class to create instance of slideshow
				$Transitions: _SlideshowTransitions,            //[Required] An array of slideshow transitions to play slideshow
				//$TransitionsOrder: 0,                           //[Optional] The way to choose transition to play slide, 1 Sequence, 0 Random
				$TransitionsOrder: 0,
				$ShowLink: true                                    //[Optional] Whether to bring slide link on top of the slider when slideshow is running, default value is false
			},

			$CaptionSliderOptions: {                            //[Optional] Options which specifies how to animate caption
				$Class: $JssorCaptionSlider$,                   //[Required] Class to create instance to animate caption
				$CaptionTransitions: _CaptionTransitions,       //[Required] An array of caption transitions to play caption, see caption transition section at jssor slideshow transition builder
				$PlayInMode: 1,                                 //[Optional] 0 None (no play), 1 Chain (goes after main slide), 3 Chain Flatten (goes after main slide and flatten all caption animations), default value is 1
				$PlayOutMode: 3                                 //[Optional] 0 None (no play), 1 Chain (goes before main slide), 3 Chain Flatten (goes before main slide and flatten all caption animations), default value is 1
			},

			$BulletNavigatorOptions: {                          //[Optional] Options to specify and enable navigator or not
				$Class: $JssorBulletNavigator$,                 //[Required] Class to create navigator instance
				$ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
				$AutoCenter: 1,                                 //[Optional] Auto center navigator in parent container, 0 None, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
				$Steps: 1,                                      //[Optional] Steps to go for each navigation request, default value is 1
				$Lanes: 1,                                      //[Optional] Specify lanes to arrange items, default value is 1
				$SpacingX: 15,                                   //[Optional] Horizontal space between each item in pixel, default value is 0
				$SpacingY: 8,                                   //[Optional] Vertical space between each item in pixel, default value is 0
				$Orientation: 1                                 //[Optional] The orientation of the navigator, 1 horizontal, 2 vertical, default value is 1
			},

			$ArrowNavigatorOptions: {                           //[Optional] Options to specify and enable arrow navigator or not
				$Class: $JssorArrowNavigator$,                  //[Requried] Class to create arrow navigator instance
				$ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
				$AutoCenter: 2,                                 //[Optional] Auto center arrows in parent container, 0 No, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
				$Steps: 1                                       //[Optional] Steps to go for each navigation request, default value is 1
			}
		};

		var leSlide = new $JssorSlider$("leSlide", options);

		$('.le-slideshow-wraper [data-u="arrowleft"]').on('click', function(){
			leSlide.$Prev();
		});
		$('.le-slideshow-wraper [data-u="arrowleft"]').on('click', function(){
			leSlide.$Next();
		});

		var ScaleSlider = function() {
			var cfgWidth = 1920;
			var cfgHeight = 880;

			var parentWidth = leSlide.$Elmt.parentNode.clientWidth;
			var slideCurrWidth = $('#leSlide').outerWidth();

			var baseWidthMax = 1200;
			var slideWrapRate = baseWidthMax / cfgHeight;

			var arrowleft = $('#leSlide [data-u="arrowleft"]');
			var arrowright = $('#leSlide [data-u="arrowright"]');
			if(cfgWidth <= baseWidthMax) {
				arrowleft.css({'left' : 30});
				arrowright.css({'right' : 30});

			} else {
				arrowleft.css({'left' : ((cfgWidth - baseWidthMax) / 2) + 30});
				arrowright.css({'right' : ((cfgWidth - baseWidthMax) / 2) + 30});
			}

			if (parentWidth){
				leSlide.$ScaleWidth(Math.min(cfgWidth, parentWidth));

			} else {
				window.setTimeout(ScaleSlider, 200);
			}
		}
		ScaleSlider();
		if (!navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|IEMobile)/)) {
			$(window).on('resize', ScaleSlider);
		}

		jQuery(window).on('load resize', function(){
			ScaleSlider();
		});
	}

});
jQuery(window).load(function($){
	FEelementControl.calcRowHeight();
	FEelementControl.toggleSearchBox();
	FEelementControl.stickyTop(skinUrl);
	FEelementControl.categoryFooter();
	jQuery('#leSlide .loading').fadeOut();
	FEelementControl.equalHeight('.category-products .item');
});

// Done Resize
var DoneResize = {
	init: function () {

	}
};

var resize = 0;
jQuery(window).resize(function ($) {
	var _self = $j(this);
	resize++;
	setTimeout(function () {
		resize--;
		if (resize === 0) {
			// Done resize ...
			FEelementControl.calcRowHeight();
			FEelementControl.swipeFilter();
			FEelementControl.categoryFooter();
			FEelementControl.stickyTop(skinUrl);
			FEelementControl.miniCartPos();
			FEelementControl.equalHeight('.category-products .item');
		}
	}, 200);
});


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
		if($j(window).width() > 980){
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
		if($j('.cms-home').length > 0 || ($j('.catalog-category-view').length > 0 && !$j('body').hasClass('category-designers')) || $j('.cms-about-us').length > 0 || $j('.cms-delivery').length > 0 ) {
			$j('.cms-home, .catalog-category-view, .cms-about-us, .cms-delivery').addClass('overlay-menu');
			normal = 0;
		}else{
			$j('body').addClass('white-menu');
			normal = 1;
		}

		//logo2: small logo
		//logo3: big logo with background
		//logo: big logo with white background

		$j(window).scroll(function() {
			if ($j(this).scrollTop() > 1) {
				if ($j(window).width() > 980) {
					$j('#header').addClass('sticky');
					$j('.header-language-background').hide();
					if($j('#ewcm_container').is(':visible')){
						$j('#header').css({top: '39px'});
					}else{
						$j('#header').css({top: 0});
					}
					$j('.logo-large .large').attr("src", skinUrl+"images/logo3.png");
					$j('#header').hover(function(){
						$j('.logo-large .large').attr("src", skinUrl+"images/logo3.png");
					});
				}
			} else {
				$j('#header').removeClass('sticky').removeAttr('style');
				$j('.header-language-background').show();
                $j(".wp-custom-menu-popup").each(function(){
                   if($j(this).css("display") == "block") {
                       normal = 1;
                   }
                });
				FEelementControl.switchLogo(normal);
				$j('#header').hover(function(){
					$j('.logo-large .large').attr("src", skinUrl+"images/logo3.png");
				},function(){
					if($j('header').hasClass('isActive')) {
						normal = 1;
					}else {
						normal = 0;
					}
                    if (normal ==0 ) {
                        if ($j('.cms-home').length > 0 || ($j('.catalog-category-view').length > 0 && !$j('body').hasClass('category-designers')) || $j('.cms-about-us').length > 0 || $j('.cms-delivery').length > 0) {
                            $j('.cms-home, .catalog-category-view, .cms-about-us, .cms-delivery').addClass('overlay-menu');
                            normal = 0;
                        } else {
                            normal = 1;
                        }
                    }
					FEelementControl.switchLogo(normal);

				});
				FEelementControl.kipLogoHover();
			}
		});

		if($j(window).scrollTop() > 1){
			$j('#header').addClass('sticky');
			$j('.header-language-background').hide();
			if($j('#ewcm_container').is(':visible')){
				$j('#header').css({top: '39px'});
			}else{
				$j('#header').css({top: 0});
			}
			$j('.logo-large .large').attr("src", skinUrl+"images/logo3.png");
			$j('#header').hover(function(){
				$j('.logo-large .large').attr("src", skinUrl+"images/logo3.png");
			});
		}else{
			if($j('header').hasClass('isActive')) {
				normal = 1;
			}
            $j(".wp-custom-menu-popup").each(function(){
                if($j(this).css("display") == "block") {
                    normal = 1;
                }
            });
			FEelementControl.switchLogo(normal);
			$j('header').hover(function(){
				$j('.logo-large .large').attr("src", skinUrl+"images/logo3.png");
			},function(){
				if($j('header').hasClass('isActive')) {
					normal = 1;
				}
                if (normal ==0 ) {
                    if ($j('.cms-home').length > 0 || ($j('.catalog-category-view').length > 0 && !$j('body').hasClass('category-designers')) || $j('.cms-about-us').length > 0 || $j('.cms-delivery').length > 0) {
                        $j('.cms-home, .catalog-category-view, .cms-about-us, .cms-delivery').addClass('overlay-menu');
                        normal = 0;
                    } else {
                        normal = 1;
                    }
                }
				FEelementControl.switchLogo(normal);

			});

			FEelementControl.kipLogoHover();
		}
	},
	kipLogoHover: function () {
		if($j('header').hasClass('isActive')) {
			$j('header').hover(function(){
				$j('.logo-large .large').attr("src", skinUrl+"images/logo3.png");
			},function(){
				if($j('#header').hasClass('sticky')) {
					$j('.logo-large .large').attr("src", skinUrl+"images/logo3.png");
				}else {
					$j('.logo-large .large').attr("src", skinUrl+"images/logo3.png");
				}
			});
		}
	},
	switchLogo: function(normal) {
		if(normal === 1){
			$j('.logo-large .large').attr("src", skinUrl+"images/logo3.png");
		}else{
			$j('.logo-large .large').attr("src", skinUrl+"images/logo.png");
		}

	},
	homeProdSlide: function(){
		$j('#slide1,#slide3').slick({
			dots: true,
			infinite: true,
			speed: 300,
			slidesToShow: 1,
			slidesToScroll: 1
		});
		$j('#lightSlider,.footer-prod-slider').slick({
			dots:true,
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
						slidesToShow: 4,
						slidesToScroll: 4,
						dots: true
					}
				},
				{
					breakpoint: 480,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 3,
						dots: true
					}
				}
			]
		});


		if($j('.brand').length > 0) {
			$j('.brand').slick({
				dots:true,
				infinite: true,
				speed: 300,
				slidesToShow: 10,
				slidesToScroll: 10,
				variableWidth: true,
				responsive: [
					{
						breakpoint: 1024,
						settings: {
							slidesToShow: 8,
							slidesToScroll: 8,
							infinite: true,
							dots: true
						}
					},
					{
						breakpoint: 600,
						settings: {
							slidesToShow: 7,
							slidesToScroll: 7,
							dots: true
						}
					},
					{
						breakpoint: 480,
						settings: {
							slidesToShow: 4,
							slidesToScroll: 4,
							dots: true
						}
					}
				]
			});
		}
	},
	aboutSlide: function(){
		if($j('.services .row').length > 0 ){
			$j('.services .row').slick({
				dots: false,
				infinite: false,
				speed: 300,
				slidesToShow: 3,
				slidesToScroll: 3,
				swipe: false,
				touchMove: false,
				responsive: [
					{
						breakpoint: 768,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 1,
							dots: true
						}
					}
				]
			});
		}
	},
	aboutEqualHeight: function(){
		if($j(window).width() > 767){
			$j('.founder img').each(function(){
				var currHeight = $j(this).height();
				$j(this).next('figure').height(currHeight);
			});
		}else{
			$j('.founder figure').removeAttr('style');
		}
	},
	cmsMenu: function(){
		var url = jQuery(location).attr('href').slice(-1)=='/' ? jQuery(location).attr('href') : jQuery(location).attr('href')+'/';
		jQuery('.block-cms-menu li').each(function(){
			if(jQuery(this).find('a').attr('href') == url){
				jQuery(this).find('a').addClass('current');

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
			if($j('.category-footer .category-description').length >0 && $j('.category-footer .thumb').length > 0){
				this.equalHeight('.category-footer .item');
			}
		}else{
			$j('.category-footer .item').removeAttr('style');
		}
	},
	confProdImage: function(){
		var options;
		if($j('.category-products').length > 0){
			options = {loop:false,autoWidth: true,slideMargin: 0}
		}else{
			options = {loop:false,slideMargin: 0,autoWidth: true}
		}
		$j('.products-grid .item').each(function(){
			if($j(this).find('.amconf-image-container').length > 6){
				$j(this).find('.amconf-images-container').lightSlider(options);
			}else{
				$j(this).addClass('no-slide');
			}
		});


	},
	calcMenu: function(){
		if($j(window).width() > 767 && $j(window).width() < 1025){

		}
	},
	miniCartPos: function(){
		if($j(window).width() < 980){
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
		$j('.my-account #country').uniform();
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
						if((i-1) < 0 ){
							prev = larImg[len-1].src;
							prevZoom = larImg[len-1].zoomimg;
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

		if($j('.slider-static-block').length > 0){
			$j('.slider-static-block .slick').slick({
				dots: true,
				infinite: true,
				speed: 500,
				fade: true,
				cssEase: 'linear',
				swipe: true,
				touchMove: true
			});
		}

	},
	voucherToggle: function(){
		$j('body').on('click','.discount h2',function(){
			$j(this).hide();
			$j('.discount-form').show();
		})
	},
	cmsCollapse: function(){
		$j('.collapse').collapse({
			accordion: true,
			open: function() {
				this.addClass("open");
				this.css({ height: this.children().outerHeight() });
			},
			close: function() {
				this.css({ height: "0px" });
				this.removeClass("open");
			}
		});
	},
	toggleCmsMenu: function(){
		$j('.skip-cms').on('click',function(){
			var isSkipContentOpen = $j('#skip-cms-menu').hasClass('skip-active') ? true : false;
			if (isSkipContentOpen) {
				$j(this).removeClass('skip-active');
				$j('#skip-cms-menu').removeClass('skip-active');
				$j('body').removeClass('overflow');
			} else {
				$j(this).addClass('skip-active');
				$j('#skip-cms-menu').addClass('skip-active');
				$j('body').addClass('overflow');
			}
		});
		$j('#skip-cms-menu .close').on('click',function(){
			$j(this).parent('.skip-active').removeClass('skip-active');
			$j('body').removeClass('overflow');
			var link = $j(this).parent('.skip-content').siblings('.page-title');
			link.find('.skip-cms').removeClass('skip-active');
		})
	},
    ewToggle: function(){
        if($j('#ewcm_container').is(':visible')){
            $j('.header-language-background,.page-header').addClass('exten-show');
			$j('#ewcm_container').parent('body').addClass('ewcm-show');
        }
        $j('#ewcm_container').on('click',function(){
            $j('.header-language-background,.page-header').removeClass('exten-show');
			$j('#ewcm_container').parent('body').removeClass('ewcm-show');
        });
    },
    filterCat: function(){
        if($j("#narrow-by-list li a").length) {
            var selectedAttribute = 0;
            $j("#narrow-by-list li a").each(function (i) {
                if ($j(this).attr('class') == "amshopby-attr-selected") {
                    if(selectedAttribute==1) {
                        return true;
                    }
					$j(this).parent('li').addClass('filter-selected');
                    $j(this).parents("dd.mobile-filter").addClass("current");
                    $j(this).parents("dd.mobile-filter").prev().addClass("current");
                    $j(".block-filter .block-content.toggle-content").addClass("accordion-open");
                    selectedAttribute = 1;
					var currHeight = $j(this).parents('dd.mobile-filter').height() + $j('.block-filter').height() + 80;
					$j('.catalog-breadcrumbs').css('margin-top',currHeight);
                    if($j(".filter-show").length) {
                        $j('.filter-show').css('margin-top',"-50px");
                    }
                    $j('.catalog-breadcrumbs').css('margin-top',currHeight);
					if($j('.block-layered-nav .block-content.accordion-open > dl > dd.current ol li').length < 4){
						$j('.block-layered-nav .block-content.accordion-open > dl > dd.current ol').addClass('no-column');
					}

                }

            });
        }
    },
    moveDescBlockCat:function(){
        if($j("#move-cat-desc-top .amshopby-descr .category-head h1").length) {
            var  description =  '<div class="col-lg-12 item category-description std col-xs-12"><div class="description">';
            if ($j("#move-cat-desc-img").length) {
                description =  '<div class="col-lg-8 item category-description std col-xs-12"><div class="description">';
			}
             var descriptionFinal = '</div></div>';
            $j("#move-cat-desc").html(description + $j("#move-cat-desc-top").html() + descriptionFinal );
            $j("#move-cat-desc-top").html("");
        }
    },
	scroll: function(){
		if($j('.category-designers').length > 0){
			var scrollTo;
			$j('a[href^="#"]').on('click', function(event) {
				if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
					var target = $j(this.hash);
					target = target.length ? target : $j('[name=' + this.hash.slice(1) + ']');

/*
					if ($j(window).width() > 767) {
					} else {
						scrollTo = target.offset().top;
					}
*/
					if (target.length) {
						event.preventDefault();
						$j('html, body').animate({
							scrollTop: (target.offset().top - 70)
						}, 1000);
					}

				}
			});
		}

	}
};

jQuery(document).ready(function ($) {
	//FEelementControl.calcRowHeight();
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
	FEelementControl.voucherToggle();
	FEelementControl.cmsCollapse();
	FEelementControl.aboutSlide();
	FEelementControl.toggleCmsMenu();
	FEelementControl.ewToggle();
	FEelementControl.filterCat();
    FEelementControl.moveDescBlockCat();
    FEelementControl.scroll();
	FEelementControl.stickyTop(skinUrl);
//	FEelementControl.equalHeight('.category-products .item');
});
jQuery(window).load(function($){
	FEelementControl.calcRowHeight();
	FEelementControl.toggleSearchBox();
	FEelementControl.categoryFooter();
	jQuery('#leSlide .loading').fadeOut();
	FEelementControl.equalHeight('.category-products .item');
	FEelementControl.aboutEqualHeight();
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
			FEelementControl.aboutSlide();
			FEelementControl.aboutEqualHeight();
			FEelementControl.scroll();
			FEelementControl.equalHeight('.category-products .item');
		}
	}, 200);
});

jQuery(document).ready(function ($) {
    if (jQuery(".customer-account-index.customer-account").length || jQuery(".customer-account-edit.customer-account").length ||
        jQuery(".customer-address-form.customer-account").length || jQuery(".sales-order-history.customer-account").length
        || jQuery(".wishlist-index-index.customer-account").length || jQuery(".newsletter-manage-index.customer-account").length) {
        var divAccount = "<div class='account-title-custom'><span>Dashboard</span></div>";
        jQuery(divAccount).insertBefore(".col-left.sidebar.col-left-first");
        jQuery();

    }

    if(jQuery("#ewcm_container").length && jQuery("#ewcm_container").css("display") !="none" ){
        jQuery(".customer-account-login .main, .checkout-onepage-index .main-container, .customer-account-index .main, .customer-account .main").css("margin-top","175px")
    }
    else {
        jQuery(".customer-account-login .main, .checkout-onepage-index .main-container, .customer-account-index .main, .customer-account .main").css("margin-top","130px");
    }

    if(jQuery(".catalog-category-view").length){
        if(jQuery(".filter-show .currently").length) {
            jQuery(".filter-show").css("display", "block");
        }
        else {
            jQuery(".filter-show").css("display", "none");
        }
    }



});

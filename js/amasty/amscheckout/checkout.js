function applyCoupon(config){
    if (config.html && config.html.coupon){
        var html = null;
        if (config.html.coupon.success){
            html = '<div id=coupon-msg class="success-msg"><span>' + config.html.coupon.success + '</span></div>';

            $('checkout-coupon').update(config.html.coupon.output);
            cartEvents();



//                        alert(config.html.coupon.success);
        } else if (config.html.coupon.error){
//                        alert(config.html.coupon.error);
            html = '<div id=coupon-msg class="error-msg"><span>' + config.html.coupon.error + '</span></div>';
        }

        var msg = new Element("div");
        msg.innerHTML = html;
        var reviewLoad = $('checkout-review-load');
        var msgBefore = reviewLoad.down('#coupon-msg');

        if (msgBefore)
            msgBefore.remove();

        var reviewWrapper = reviewLoad.down('#checkout-review-table-wrapper');

        if (msg.firstChild)
        reviewLoad.insertBefore(msg.firstChild, reviewWrapper);

    }
}
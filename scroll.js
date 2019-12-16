$(document).ready(function ()
{
    $("a").on('click', function (event)
    {

        if (this.hash !== "")
        {
            event.preventDefault();
            var hash = this.hash;

            $('html, body').animate(
            {
                scrollTop: $(hash).offset().top
            }, 200, function ()
            {

                window.location.hash = hash;
            }
            );
        }
    }
    );
}
);
$(document).ready(function () {
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('.scroll-top').fadeIn();
    } else {
      $('.scroll-top').fadeOut();
    }
  });

  $('.scroll-top').click(function () {
    $("html, body").animate({
      scrollTop: 0
    }, 100);
      return false;
  });

});

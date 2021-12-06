(function ($) {
  $(".toggle-password").click(function () {
    $(this).toggleClass("zmdi-eye zmdi-eye-off");
    var input = $($(this).attr("toggle"));
    if (input.attr("type") == "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  });

  $(".re-toggle-password").click(function () {
    $(this).toggleClass("zmdi-eye zmdi-eye-off");
    var input = $("#re_password");
    if (input.attr("type") === "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  });
})(jQuery);

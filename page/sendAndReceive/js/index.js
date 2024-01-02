$(document).ready(function () {
  $(".tabItem").hide();
  $("#send").show();

  $(".tabButton").click(function () {
    var tabId = $(this).attr("dataTab");
    var tabItems = $(".tabItem");
    var tabButtons = $(".tabButton");

    tabItems.hide();
    tabButtons.removeClass("active");

    $("#" + tabId).show();
    console.log($(tabButtons));
    $(tabButtons).filter("[dataTab='" + tabId + "']").addClass("active");
  });


  $(".addressBox").click(function () {
    console.log();
    if ($('.accountPop')[0].style.display === 'none') {
      $('.accountPop').fadeIn()
    } else {
      $('.accountPop').fadeOut()

    }
  });

  $(".selectHeader").click(function () {
    $(".selectOptions").toggle();
  });

  $(".option").click(function () {
    var selectedValue = $(this).attr("data-value");
    var selectedText = $(this).find("p").text();
    $(".currChoose p").text(selectedText);
    $(".currChoose img").attr("alt", selectedValue);
    $(".selectOptions").hide();
  });

});


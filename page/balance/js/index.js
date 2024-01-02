$(document).ready(function() {
  $(".tabItem").hide();
  $("#balances").show();

  $(".tabButton").click(function() {
    var tabId = $(this).attr("dataTab");
    var tabItems = $(".tabItem");
    var tabButtons = $(".tabButton");
    
    tabItems.hide();
    tabButtons.removeClass("active");
    
    $("#" + tabId).show();
    console.log($(tabButtons));
    $(tabButtons).filter("[dataTab='" + tabId + "']").addClass("active");
  });

  $(".addressBox").click(function() {
    console.log();
    if($('.accountPop')[0].style.display === 'none'){
      $('.accountPop').fadeIn()
    }else{
      $('.accountPop').fadeOut()

    }
  });

  
});

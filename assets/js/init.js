function handleResize() {
  var designWidth = 1440; 
  var windowWidth = window.innerWidth;

  var fontSize = 10 * (windowWidth / designWidth); 

  document.documentElement.style.fontSize = fontSize + 'px';
}

window.addEventListener('resize', handleResize);

handleResize()

const changeLanguae = (lang)=>{
  jQuery.i18n.properties({
    name:lang, 
    path: '../../assets/language/', 
    language: lang,
    cache: false,
    mode: 'map',
    callback: function () {
      for (let i in $.i18n.map) {
        $('[data-lang="' + i + '"]').text($.i18n.map[i]);

    }
    }
  });
}




$(document).ready(function(){
  var lang = 'en'
  lang = lang.substr(0, 2); 
  
  changeLanguae(lang)
  $(".select-selected").click(function() {
    $(".select-items").toggle();
  });

  $(".select-items div").click(function() {
    var selectedValue = $(this).attr("data-value");
    var selectedText = $(this).text();
    $(".select-selected>p").text(selectedText);
    $(".select-items").hide();
    console.log("Selected language value: " + selectedValue);
  changeLanguae(selectedValue)

  });

  $(document).on("click", function(event) {
    if (!$(event.target).closest('.custom-select').length) {
      $(".select-items").hide();
    }
  });
});




const showToast = (type, message) => {
  const style = `
    .toast {
      display: none;
      position: fixed;
      top: 2rem;
      left: 50%;
      transform: translateX(-50%);
      padding: 2.4rem;
      box-sizing:border-box;
      border-radius: 1.4rem;
      background-color: rgba(255, 255, 255, 0.8);
      color: #090B0E;
      font-size: 1.6rem;
      text-align: center;
      z-index: 9999; 
      flex-shrink: 0;
    }
    .toast img {
      width: 20px;
      height: 20px;
      vertical-align: middle;
      margin-right: 16rem;
    }
  `;

  const styleElement = $('<style>').text(style);
  $('head').append(styleElement);

  const iconUrl = type === 'success'
    ? '../../assets/toast/success.svg' // 成功图标 URL
    : '../../assets/toast/fails.svg'; // 失败图标 URL

  const toast = $(`<div class="toast ${type}"></div>`).css({
    display: 'none',
      position: 'fixed',
      top: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '2.4rem',
      'box-sizing':'border-box',
     ' border-radius': '1.4rem',
      'background-color': 'rgba(255, 255, 255, 0.8)',
      color: '#090B0E',
      'font-size': '1.6rem',
      'text-align': 'center',
      'z-index': '9999;',
      'flex-shrink': '0',
  });

  const icon = $('<img>').attr('src', iconUrl).css({
    width: '2.2rem',
    height: '2.2rem',
    'vertical-align': 'middle',
    'margin-right': '1.6rem'
  });

  const text = $('<span></span>').text(message);

  toast.append(icon).append(text);
  $('body').append(toast);

  toast.fadeIn().delay(2000).fadeOut(() => {
    toast.remove();
    styleElement.remove();
  });
};

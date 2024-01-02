$(document).ready(function () {
  var clickCounter = 1;

  $(".passphraseCell").click(function () {
    if ($(this).hasClass('choosed')) {
      return;
    }
    var passphrase = $(this).text();
    console.log(clickCounter);
    var $targetCell = $(".choosePassphraseCell:nth-child(" + clickCounter + ")");
    $targetCell.text(`${clickCounter}.${passphrase}`);
    $targetCell.addClass(`selected`);
    $(this).attr("data-value", clickCounter);
    $(this).addClass('choosed');
    clickCounter++;

    $('.choosePassphraseCell .deleteIcon').remove();

    $($('.selected')[$('.selected').length - 1]).append('<span class="deleteIcon">&times;</span>');

    handleDeleteIconClick();
  });

  function handleDeleteIconClick() {
    $(".deleteIcon").off().click(function (e) {
      e.stopPropagation();
      console.log(1);
      var $parentCell = $(this).parent();
      var index = $parentCell.index();
      $('.choosePassphraseCell').slice(index).each(function () {
        $(this).text("");
        $(this).removeClass('selected');
      });

      // 获取对应的passphraseCell
      var dataValue = $(`.passphraseCell[data-value="${clickCounter - 1}"]`);
      if (dataValue.hasClass('choosed')) {
        dataValue.removeClass('choosed');
        dataValue.removeAttr("data-value");
      }

      clickCounter = index + 1;
      $('.choosePassphraseCell.selected').each(function (i) {
        $(this).text(`${i + 1}.${$(this).text().substring($(this).text().indexOf('.') + 1)}`);
        if (i === $('.choosePassphraseCell.selected').length - 1) {
          $(this).append('<span class="deleteIcon">&times;</span>');
        }
      });

      handleDeleteIconClick();
    });
  }
});

function chooseCell(clickedElement) {
  var imgElement = $(clickedElement).find('img');

  var siblingImages = $(clickedElement).siblings().find('img');

  siblingImages.attr('src', '../../assets/createAccount/notChoose.svg');

  imgElement.attr('src', '../../assets/createAccount/choose.svg');
}

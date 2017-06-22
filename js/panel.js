const MainFunctions = require('./main.js');

function hideModal(){
  $('#modal').css('display', 'none');
}

function hideConsiderBox(){
  $('#consider-div').css('display', 'none');
}

exports.activatePanelListeners = () => {
  $('#explore-visualization-div').on('click', (e) => {
    hideModal();
  })

  $('#modal-close-div').on('click', (e) => {
    hideModal();
  })

  $('#modal').on('click', (e) => {
    hideModal();
  })

  $('#modal-body').on('click', (e) => {
    e.stopPropagation();
  })

  $('.consider-span').on('click', (e) => {
    const keyword = e.target.innerText;
    MainFunctions.fetchNewDataAndUpdate(keyword);
  })

  $('#consider-x').on('click', (e) =>{
    hideConsiderBox();
  })
}



// Begin Upload IMG
$('#upload-img').on('change',{displayArea: 'previewUploadImg'} , displayImg);

function displayImg(event) {
    // clear display area
    let displayArea = $(`#${event.data.displayArea}`);
    displayArea.html('');

    // append img
    let counter = -1, file;
    while ( file = this.files[ ++counter ] ) {
        let reader = new FileReader();
        reader.onload = (function(file){
            return function(){
                var imgCount = 0;
                let image = new Image(50, 50);
                image.className = 'mr-2 rounded';
                image.title = `file ${++imgCount}`;
                image.src =this.result;
                displayArea.append(image);
            }
        })(file);
        reader.readAsDataURL( file );
    }
}
// End Upload IMG

// Begin SEO handling
$('#seo-checkbox').on('click',{displayArea: 'seo-form'} , displaySEO);

function displaySEO(event){
    // show SEO options
    if ($(this).prop('checked') == true){
        $(`#${event.data.displayArea}`).removeAttr('style');
    }else{  // hidden SEO options
        $(`#${event.data.displayArea}`).css('display', 'none');
    }
}
// End SEO handling


// BlockUI
function blockUI() {
    $.blockUI({
        css: {
            backgroundColor: 'transparent',
            border: 'none'
        },
        message: '<div class="spinner-border text-success" role="status"></div>',
        baseZ: 1500,
        overlayCSS: {
            backgroundColor: '#FFFFFF',
            opacity: 0.7,
            cursor: 'wait'
        }
    });
}
// <meta name="auto-close-modal" content="1">
// begin : Modal
function offModal(modalID, isExcept = 0) {

    let state = $('meta[name="is-close-modal"]').attr('content') - '0';
    if ( state || isExcept ){
        $(`#${modalID}`).modal('toggle');
    }else{
        clearModal(modalID);
        clearAlert(modalID);
    }
}

// clear modal data
function clearModal(modalID) {
    let lsKey = getRkey(modalID);
    lsKey.map( item =>{
        $(`#${modalID} input[name="${item}"]`).val('');
        $(`#${modalID} textarea[name="${item}"]`).val('');

    });
}
// get request key
function getRkey(modalID) {
    lsKey = [];

    $(`#${modalID} input`).each( (index, item) =>{
        let temp = $(item).attr('name');
        lsKey.push(temp);
    });
    $(`#${modalID} textarea`).each( (index, item) =>{
        let temp = $(item).attr('name');
        lsKey.push(temp);
    });
    $(`#${modalID} select`).each( (index, item) =>{
        let temp = $(item).attr('name');
        lsKey.push(temp);
    });

    return lsKey;
}

// get request value
function getRdata(modalID) {
    let lsKey = getRkey(modalID);
    let lsData = {};

    lsKey.map(item =>{
        lsData[`${item}`] = $(`#${item}`).val();
    });
    return lsData;
}

// alert handle
function clearAlert(modalID) {
    let lsKey = getRkey(modalID);

    // remove all alert error msg
    lsKey.map(item => {
        $(`#${item}`).parent().children('p').attr('hidden','true');
        $(`#${item}`).removeClass('parsley-error');
    });
}

function addAlert(error) {
    for (let [key,val] of Object.entries(error)){
        $(`#${key}`).addClass('parsley-error');
        $(`#${key}`).parent().children('p').text(val);
        $(`#${key}`).parent().children('p').removeAttr('hidden');
    }
}
// alert handle

// end : Modal

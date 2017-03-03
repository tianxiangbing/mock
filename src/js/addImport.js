let $ = require('jquery');
const fs = require('fs');
const path = require('path');
const query = require('jq-query');

$('.paramlist').on('click','.add',function(){
    let current = $(this).closest('tr');
    // current.index()>0?$(this).removeClass('add').addClass('minus').val('-'):$(this).removeClass('minus').addClass('add').val('+');
    let clone = current.clone();
    clone.find('.add').removeClass('add').addClass('minus').val('-');
    current.after(clone);
});

$('.paramlist').on('click','.minus',function(){
    let current = $(this).closest('tr');
    current.remove();
});
$('#btn_add').click(function(){
    let json = {};
    $('#myForm').each(function(){

    });
    var a = query.getForm($('#myForm'))
    
    console.log(json)
    fs.writeFile('./cache/config.json',JSON.stringify(json),function(e){
        if(e)
        console.error(e)
    });
});
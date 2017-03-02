let $ = require('jquery');

$('.paralist').on('click','.add',function(){
    let current = $(this).closest('tr');
    // current.index()>0?$(this).removeClass('add').addClass('minus').val('-'):$(this).removeClass('minus').addClass('add').val('+');
    let clone = current.clone();
    clone.find('.add').removeClass('add').addClass('minus').val('-');
    current.after(clone);
});

$('.paralist').on('click','.minus',function(){
    let current = $(this).closest('tr');
    current.remove();
});

$(document).ready(function(){
    $('btn_add_comment').click(function(){
        $.post('/add_comment', {_id: $('news_id').val()});
    })
});

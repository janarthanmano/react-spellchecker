import $ from "jquery";

$(document).ready(function(){
    $('body').on('click', '.ql-editor p u', function(){
        $('.tool_tip').addClass('d-none');
        let offset = $(this).offset();
        $('#'+$(this).html()).removeClass('d-none').offset({ top: offset.top+20, left: offset.left });
    });

    $('body').on('click', '.suggestions li', function(){
        let html = $(this).data('element');
        let suggestion = $(this).html();
        $('.ql-editor p u').each(function(){
            if($(this).html() === html){
                $(this).replaceWith( suggestion );
                $('.tool_tip').addClass('d-none');
            }
        });
    });

    $('body').on('click', '.actions li.addDictionary', function(){
        let word = $(this).data('element');
        $('.ql-editor p u').each(function(){
            if($(this).html() === word){
                $(this).replaceWith( word );
                $('.tool_tip').addClass('d-none');
                $.ajax({
                    type: "POST",
                    url: 'http://localhost:8000/controller.php',
                    data: {word: word, flag: 'dictionary'},
                    dataType: 'json',
                    success: function(data) {
                        console.log(data);
                    },
                });
            }
        });
    });

    $('body').on('click', '.actions li.ignore', function(){
        let word = $(this).data('element');
        $('.ql-editor p u').each(function(){
            if($(this).html() === word){
                $(this).replaceWith( word );
                $('.tool_tip').addClass('d-none');
                $.ajax({
                    type: "POST",
                    url: 'http://localhost:8000/controller.php',
                    data: {word: word, flag: 'ignore'},
                    dataType: 'json',
                    success: function(data) {
                        console.log(data);
                    },
                });
            }
        });
    });

});
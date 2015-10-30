window.addEvent('domready', function() {
    // hide all but the first set
    $$('div.hide_me').each(function(el) {
        el.setStyle('display', 'none');
    });
    // call the addOne function passing the row number  
    $$('input.add_one').each(function(el) {
        el.addEvent('click', function(event) {
            var id = event.target.id.substr(7, 1);
            addOne(id);
        });
    });
});

// display the next row and hide the last 'Add one' button
function addOne(id) {
    $('addone_'+id).setStyle('display', 'none');
    $('recipient_'+id).setStyle('display', 'block');
};

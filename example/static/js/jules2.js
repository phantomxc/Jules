function jules2_init(j) {
    $('test_event').observe('click', function(ev) {
        document.fire('jules:custom:event');
    });
}

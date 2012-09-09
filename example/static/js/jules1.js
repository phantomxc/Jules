function jules1_init(j) {
    j.observe('jules:custom:event', function(ev) {
        j.content.update('CUSTOM EVENT FIRED');
        //j.refresh();
    });
}

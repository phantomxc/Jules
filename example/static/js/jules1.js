function jules1_init(j) {
    console.log(j.jid + ' init');
    j.observe('jules:custom:event', function(ev) {
        console.log(j.jid + ' refreshed');
        j.refresh();
    });
}

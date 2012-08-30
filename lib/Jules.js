
JulesMaster = Class.create({
    initialize: function(c) {
        this.container = $(c);
        this.jules_list = [];
        this.js_list = [];
        this.css_list = [];
        this.global_vars = {};
    },

    create: function(name) {
        var j = new Jules();
        this.jules_list.push(j);
        return j;
    },
});

Jules = Class.create({
    initialize: function(url) {
        this.url = url;
        this.jid = this.createID();

        var defaults = {
            'js_file':null,
            'js_func':null,
            'css_file':null,
            'content_class':'jule-content',
            'container_class':'jule-container',
            'loading_class':'jule-loading',
            'error_class':'jule-error',
            'nav_class':'jule-nav',
            'afterInit':null,
            'afterHTML':null
        }
        this.args = arguments[1] || {};
        this.opts = Object.extend(defaults, this.args);

        // BUILD SOME HTML
        this.container = new Element('div', {
            'class':this.opts.container_class,
            'id':this.jid
        });
        this.nav = new Element('div', {
            'class':this.opts.nav_class
        });

        this.loading = new Element('div', {
            'class':this.opts.loading_class
        });
        this.loading.hide();

        this.error = new Element('div', {
            'class':this.opts.error_class
        });
        this.error.hide();

        this.content = new Element('div', {
            'class':this.opts.content_class
        });

        // DEFAULT BUTTONS
        var buttons = [
            {
                'type':'span','class':'refresh_btn','func':function(j, b) {
                    b.observe('click', function(ev) {
                        j.refresh();
                    });
                }
            },
            {
                'type':'span','class':'close_btn','func':function(j, b) {
                    b.observe('click', function(ev) {
                        j.close();
                    });
                }
            }
        ];
        // INSERT CUSTOM BUTTON STUFF HERE

        // ASSIGN FUNCS TO BUTTONS AND INSERT INTO NAV
        for (var i=0;i<buttons.length;i++) {
            var b = new Element(buttons[i].type, {'class':buttons[i]['class']});
            if (buttons[i].func) {
                buttons[i].func(this, b);
            }
            this.nav.insert(b);
        }


        // INSERT SOME HTML INTO THE CONTAINER
        this.container.update(this.nav);
        this.container.insert(this.loading);
        this.container.insert(this.error);
        this.container.insert(this.content);

        // SHOW THE LOADING DIV
        this.startLoading();

        // BUILD SOME CONTENT
        this.buildContent();
    },

    createID: function() {
        return Math.floor((Math.random()*1000)+1);
    },

    buildContent: function() {
        console.log('test');
    },

    buildJS: function() {
    },

    buildCSS: function() {
    },

    close: function() {
    },

    refresh: function() {
    },

    startLoading: function() {
        this.loading.show();
    },

    doneLoading: function() {
        this.loading.hide();
    },
});



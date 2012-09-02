JulesMaster = Class.create({
    initialize: function(c) {
        this.container = $(c);
        this.jules_list = [];
        this.js_list = [];
        this.css_list = [];
        this.global_vars = {};
    },

    create: function(url) {
        var j = (arguments[1]) ? new Jules(url, this, arguments[1]) : new Jules(url, this);
        this.jules_list.push(j);
        this.container.insert(j.container);
        return j;
    },

    addJS: function(js, func, jid) {
        var r = (this.js_list.indexOf(js) == '-1') ? this.js_list.push(js) : false;
        
        var j = null;
        for(i=0;i<this.jules_list.length;i++) {
            if (this.jules_list[i].jid == jid) {
                j = this.jules_list[i];
            }
        }
        if (r) {
            new Ajax.Request(js, {
                method: 'POST',
                onSuccess: function(res) {
                    var h = $$('head')[0];
                    var s = new Element('script');
                    s.type = 'text/javascript';
                    s.update(res.responseText);
                    h.insert(s);
                    (eval(func))(j);
                }
                
            });
        } else {
            (j) ? (eval(func))(j) : false;
        }
    },

    addCSS: function(css) {
        var r = (this.css_list.indexOf(css) == '-1') ? this.css_list.push(css) : false;
        if (r) {
            var h = $$('head')[0];
            var l = new Element('link', {
                'rel':'stylesheet',
                'type':'text/css',
                'href':css
            });
            h.insert(l);
        }
    }
});

Jules = Class.create({
    initialize: function(url, master) {
        this.url = url;
        this.master = master;
        this.jid = this.createID();
        this.event_list = [];

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
            'afterContent':null
        }
        this.args = arguments[2] || {};
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
        // ADD CUSTOM BUTTONS
        if (this.args && this.args['custom_buttons']) {
            this.args['custom_buttons'].each(function(b) {
                buttons.push(b);
            }.bind(this));
        }

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
        new Ajax.Request(this.url, {
            method: 'POST',

            onSuccess: function(res) {
                this.content.update(res.responseText);
                if(this.opts.js_file) {
                    this.buildJS(this.opts.js_file, this.opts.js_func, this.jid);
                }

                if(this.opts.css_file) {
                    this.buildCSS(this.opts.css_file);
                }

                this.error.hide();
            }.bind(this),

            onFailure: function(res) {
                this.showError(res.responseText);
            }.bind(this),

            onComplete: function() {
                this.doneLoading();
            }.bind(this),

        });
    },

    buildJS: function(js, func, jid) {
        this.master.addJS(js, func, jid);
    },

    buildCSS: function(css) {
        this.master.addCSS(css);
    },

    observe: function(ev,  handler) {
        r = (this.event_list.indexOf(ev) == '-1') ? this.event_list.push(ev) : false;
        if (r) {
            document.observe(ev, handler);
        }
    },

    close: function() {
        Element.remove(this.container);
        this.master.remove(this.jid);
    },

    refresh: function() {
        this.buildContent();
    },

    startLoading: function() {
        this.loading.show();
    },

    doneLoading: function() {
        this.loading.hide();
    },

    showError: function(msg) {
        this.error.update(msg);
        this.error.show();
    }
});



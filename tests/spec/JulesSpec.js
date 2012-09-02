describe("Jules Master", function(ev) {
    var jm;
    var request;

    beforeEach(function(ev) {
        jm = new JulesMaster('body');
        //capture ajax requests
        jasmine.Ajax.useMock();
    });

    it("should create a master instance", function(ev) {
        expect(jm).toBeDefined();
    });

    it("should initialize several variables", function() {
        expect(jm.jules_list).toEqual([]);
        expect(jm.js_list).toEqual([]);
        expect(jm.global_vars).toEqual({});
        expect(jm.css_list).toEqual([]);
    });

    it("should take an element id as it's first argument", function(ev) {
        expect(jm.container).toBe($('body'));
    });

    it("should also accept an element instead of an id for it's first arg", function(ev) {
        jm2 = new JulesMaster($('body'));
        expect(jm2.container).toBe($('body'));
    });

    describe("Create some Jules", function(ev) {
        var j;
        beforeEach(function(ev) {
            spyOn(jm, 'create').andCallThrough();
            j = jm.create('test');
        });

        it("should call create with the jules html url", function() {
            expect(jm.create).toHaveBeenCalledWith('test');  
        });

        it("should return a Jules instance", function() {
            expect(j).toBeDefined();
        });

        it("should add the jules instance to it's jules_list", function() {
            expect(jm.jules_list.length).toBe(1);
            expect(jm.jules_list).toContain(j);
        });

        it("should insert the jule into the master container", function() {
            expect(jm.container.childElements()).toContain(j.container);
        });
    });

    describe("addJS", function() {
        var j;
        var hlength;
        beforeEach(function() {
            //number of elements in the head
            hlength = $$('head')[0].childElements().length;
            // FAKING JULES
            j = {'jid':12};
            jm.jules_list.push(j);
            spyOn(jm, 'addJS').andCallThrough();
            jm.addJS('julios.js', 'julios', j.jid);
            window["test"] = 0;
            request = mostRecentAjaxRequest();
            request.response({
                status:200,
                responseText: 'function julios(j) {window["test"] += 1; window["jid"] = j.jid}'
            });

        });

        afterEach(function() {
            // remove the script we just added for testing
            var h = $$('head')[0];
            Element.remove(h.childElements()[h.childElements().length -1]);
        });

        it("should add the js file to the js_list", function() {
            expect(jm.js_list).toContain('julios.js');
        });

        it("should only add the file once", function() {
            jm.addJS('julios.js', 'julios', j.jid);
            expect(jm.js_list.length).toBe(1);
        });

        it("should insert the script into the head and execute it", function() {
            expect(window["test"]).toEqual(1);
        });

        it("should not insert the script again but execute it", function() {
            jm.addJS('julios.js', 'julios', j.jid);
            expect(window["test"]).toEqual(2);
            expect($$('head')[0].childElements().length).toBe(hlength+1);
        });

        it("should pass in the jules instance to the function", function() {
            expect(window["jid"]).toEqual(12);
        });
    });

    describe("addCSS", function() {
        var j;
        var hlength;
        beforeEach(function() {
            hlength = $$('head')[0].childElements().length;
            jm.addCSS('julios.css');
            request = mostRecentAjaxRequest();
            request.response({
                status:200,
                responseText: 'some css'
            });
        });

        it("should add the css file to the css_list", function() {
            expect(jm.css_list).toContain('julios.css');
        });

        it("should only add the file once to the object and the head", function() {
            jm.addCSS('julios.css');
            expect(jm.css_list.length).toBe(1);
            expect($$('head')[0].childElements().length).toBe(hlength+1);
        });

    });
});


describe("Jules", function() {
    var j;
    var jm;
    var request
    beforeEach(function() {
        // FAKING THE JULESMASTER
        jm = jasmine.createSpyObj('jm', ['addJS', 'addCSS', 'remove']);
        jasmine.Ajax.useMock();
        j = new Jules('theurl', jm);
    });

    it("should create a new Jules instance", function() {
        expect(j).toBeDefined();
    });

    it("should set some intialize variables", function() {
        expect(j.master).toBe(jm);
        expect(j.container).toBeDefined();
        expect(j.content).toBeDefined();
        expect(j.nav).toBeDefined();
        expect(j.loading).toBeDefined();
        expect(j.error).toBeDefined();
        expect(j.url).toEqual('theurl');
        expect(j.jid).toBeDefined();
        expect(j.event_list).toEqual([]);
    });

    it("should have some default values", function() {
        expect(j.opts).toBeDefined();
    });

    it("should set the default class names for some elements", function() {
        expect(j.content.hasClassName('jule-content')).toBe(true);
        expect(j.container.hasClassName('jule-container')).toBe(true);
        expect(j.nav.hasClassName('jule-nav')).toBe(true);
        expect(j.error.hasClassName('jule-error')).toBe(true);
    });

    it("should insert the content, nav, loading, and error divs into the container", function() {
        expect(j.container.childElements().length).toBe(4);
    });

    it("should show the loading div", function() {
        expect(j.container.childElements()[1].visible()).toBe(true);   
    });

    it("should hide the error div", function() {
        expect(j.container.childElements()[2].visible()).toBe(false);
    });

    describe("Nav Buttons", function() {
        beforeEach(function() {
            spyOn(j, 'close').andCallThrough();
            spyOn(j, 'refresh').andCallThrough();
        });

        it("should have two default buttons in the nav", function() {
            expect(j.nav.childElements().length).toBe(2);
        });

        describe("Refresh", function() {

            beforeEach(function() {
                spyOn(j, 'buildContent');
                j.nav.childElements()[0].simulate('click');
            });
        
            it("should refresh the jule when you click the refresh button", function() {
                expect(j.refresh).toHaveBeenCalled();
            });

            it("should call buildContent", function() {
                expect(j.buildContent).toHaveBeenCalled();
            });
        });

        describe("Close", function() {
            
            beforeEach(function() {
                $('body').update(j.container);
                j.nav.childElements()[1].simulate('click');
            });
            
            it("should close the jule when you click the close button", function() {
                expect(j.close).toHaveBeenCalled();
            });

            it("should remove it from the master", function() {
                expect(jm.remove).toHaveBeenCalledWith(j.jid);
            });

            it("should remove the element", function() {
                expect($('body').childElements().length).toBe(0);
            });
        });
    });

    describe("Jules Content", function() {
        beforeEach(function() {
            spyOn(j, 'buildContent').andCallThrough();
            spyOn(j, 'buildJS');
            spyOn(j, 'buildCSS');
            request = mostRecentAjaxRequest();
            j.buildContent();
        });

        it("should buildContent", function() {
            expect(j.buildContent).toHaveBeenCalled();
        });

        it("should not call buildJS", function() {
            expect(j.buildJS).not.toHaveBeenCalled();
        });

        it("should not call buildCSS", function() {
            expect(j.buildCSS).not.toHaveBeenCalled();
        });

        it("should make a request to the url passed in on init", function() {
            expect(request.url).toBe('theurl');
        });

        describe("AJAX Success", function() {
            
            beforeEach(function() {
                spyOn(j, 'doneLoading').andCallThrough();
                request = mostRecentAjaxRequest();
                request.response({
                    status:200,
                    responseText: 'the contents'
                });
            });
        
            it("should update the content with the response", function() {
                expect(j.content.innerHTML).toBe('the contents');
            });

            it("should call doneLoading", function() {
                expect(j.doneLoading).toHaveBeenCalled();
            });
        });

        describe("AJAX Error", function() {
            
            beforeEach(function() {
                spyOn(j, 'doneLoading').andCallThrough();
                spyOn(j, 'showError').andCallThrough();
                request = mostRecentAjaxRequest();
                request.response({
                    status:500,
                    responseText: 'the errors'
                });
            });
            
            it("should call doneLoading", function() {
                expect(j.doneLoading).toHaveBeenCalled();
            });

            it("should call showError", function() {
                expect(j.showError).toHaveBeenCalledWith('the errors');
            });

            it("should make error visible", function() {
                expect(j.error.visible()).toBe(true);
            });
        });
        
    });

    describe("Custom global events", function() {
        window["eventcount"] = 0;

        beforeEach(function() {
            spyOn(j, 'observe').andCallThrough();
        });

        it("should add the event to the event_list", function() {
            j.observe('jules:test', function(ev) {
                window["eventcount"] += 1;
            });

            document.fire('jules:test');
            expect(j.event_list).toEqual(['jules:test']);
            expect(window["eventcount"]).toEqual(1);
        });

        it("should fire the event on document", function() {
            j.event_list.push('jules:test');
            j.observe('jules:test', function(ev) {
                window["eventcount"] += 1;
            });
            document.fire('jules:test');
            expect(window["eventcount"]).toEqual(2);
        });

        it("seting up the observe on jules shouldn't set it up again on document", function() {
            j.event_list.push('jules:test');
            j.observe('jules:test', function(ev) {
                window["eventcount"] += 3;
            });
            document.fire('jules:test');
            expect(window["eventcount"]).toEqual(3);
        });

    });

});


describe("Jules with options", function(ev) {
    var j;
    var jm;
    var request

    beforeEach(function() {
        jm = jasmine.createSpyObj('jm', ['remove']);
        
        jm.addCSS = null;
        spyOn(jm, 'addCSS').andCallFake(function(css) {
            window['addCSSFake'] = css;
        });
        
        jm.addJS = null;
        spyOn(jm, 'addJS').andCallFake(function(j, f, i) {
            window['addJSFake'] = [j,f,i];
        });

        jasmine.Ajax.useMock();
        j = new Jules('theurl', jm, {
            'js_file':'test.js',
            'js_func':'test_func',
            'css_file':'test.css',
            'content_class':'test-content',
            'container_class':'test-container',
            'loading_class':'test-loading',
            'error_class':'test-error',
            'nav_class':'test-nav',
            'afterInit':function() {window['afterinit'] = true},
            'afterContent': function() {window['afterContent'] = true},
            'custom_buttons':[
                {
                    'type':'span',
                    'class':'custom_btn',
                    'func':function(s, b) { b.observe('click', function(ev) {
                        window['custom_btn'] = true;
                    });}
                }
            ]

        });
    });

    it("should set the custom class names", function() {
        expect(j.content.hasClassName('test-content')).toBe(true);
        expect(j.container.hasClassName('test-container')).toBe(true);
        expect(j.nav.hasClassName('test-nav')).toBe(true);
        expect(j.error.hasClassName('test-error')).toBe(true);
    });

    it("should have a custom button", function() {
        expect(j.nav.childElements().length).toBe(3);
    });

    describe("buildJS", function() {
        
        beforeEach(function() {
            request = mostRecentAjaxRequest();
            request.response({
                status:200,
                contentType: "text/html",
                responseText: "function test_func() { alert('thiswould be executable js'); }"
            })
        });

        it("should call addJS on the master. This also confirms buildJS was called correctly", function() {
            expect(window['addJSFake']).toEqual(['test.js', 'test_func', j.jid]);
        });

    });

    describe("buildCSS", function() {
        
        beforeEach(function() {
            jm.addCSS = null;
            spyOn(jm, 'addCSS').andCallFake(function(css) {
                window['addCSSFake'] = css;
            });
        });

        it("should call addCSS on the master. This also confirms buildCSS was called correctly", function() {
            expect(window['addCSSFake']).toEqual('test.css');
        });
    });
});

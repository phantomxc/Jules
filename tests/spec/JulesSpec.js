describe("Jules Master", function(ev) {
    var jm;
    var request;

    beforeEach(function(ev) {
        jm = new JulesMaster('body');
        //capture ajax requests
        jasmine.Ajax.useMock();
        request = mostRecentAjaxRequest();
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

        it("should call create with the jules name", function() {
            expect(jm.create).toHaveBeenCalledWith('test');  
        });

        it("should return a Jules instance", function() {
            expect(j).toBeDefined();
        });

        it("should add the jules instance to it's jules_list", function() {
            expect(jm.jules_list.length).toBe(1);
            expect(jm.jules_list).toContain(j);
        });
    });
});


describe("Jules", function() {
    var j;
    var request
    beforeEach(function() {
        jasmine.Ajax.useMock();
        j = new Jules('theurl');
    });

    it("should create a new Jules instance", function() {
        expect(j).toBeDefined();
    });

    it("should set some intialize variables", function() {
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

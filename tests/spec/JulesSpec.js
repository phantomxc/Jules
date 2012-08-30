describe("Jules Master", function(ev) {
    var jm;

    beforeEach(function(ev) {
        jm = new JulesMaster('body');
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
    beforeEach(function() {
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
            spyOn(j, 'close');
            spyOn(j, 'refresh');
        });

        it("should have two default buttons in the nav", function() {
            expect(j.nav.childElements().length).toBe(2);
        });

        it("should refresh the jule when you click the refresh button", function() {
            j.nav.childElements()[0].simulate('click');
            expect(j.refresh).toHaveBeenCalled();
        });
        
        it("should close the jule when you click the close button", function() {
            j.nav.childElements()[1].simulate('click');
            expect(j.close).toHaveBeenCalled();
        });

    });

    describe("Jules Content", function() {
        var request;
        beforeEach(function() {
            spyOn(j, 'buildContent').andCallThrough();
            spyOn(j, 'doneLoading').andCallThrough();
            spyOn(j, 'buildJS');
            spyOn(j, 'buildCSS');
            //request = mostRecentAjaxRequest();
            j.buildContent();
        });

        it("should buildContent", function() {
            expect(j.buildContent).toHaveBeenCalled();
        });

        it("should call doneLoading", function() {
            expect(j.doneLoading).toHaveBeenCalled();
        });

        it("should not call buildJS", function() {
            expect(j.buildJS).not.toHaveBeenCalled();
        });

        it("should not call buildCSS", function() {
            expect(j.buildCSS).not.toHaveBeenCalled();
        });
        
    });

    
});

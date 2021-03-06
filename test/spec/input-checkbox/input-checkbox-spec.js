var Montage = require("montage").Montage;
var TestPageLoader = require("montage-testing/testpageloader").TestPageLoader;
var ActionEventListener = require("montage/core/event/action-event-listener").ActionEventListener;

TestPageLoader.queueTest("input-checkbox-test", function(testPage) {
    var test;
    beforeEach(function() {
        test = testPage.test;
    });

    var click = function(component, el, fn) {
        el = el || component.element;

        var listener = testPage.addListener(component, fn);
        testPage.clickOrTouch({target: el});
        // Return this so that it can be checked in tha calling function.
        return listener;
    };
    var change = function(el) {
        var changeEvent = document.createEvent("HTMLEvents");
        changeEvent.initEvent("change", true, true);
        el.dispatchEvent(changeEvent);
        return changeEvent;
    };

    describe("test/input-checkbox/input-checkbox-spec", function() {

        describe("checkbox", function(){
            describe("checked property", function() {
                it("is false if there is no `checked` attribute", function() {
                    expect(test.check1.checked).toBe(false);
                });
                xit("is true if the `checked` attribute is set", function() {
                    expect(test.check2.checked).toBe(true);
                });

                it("can be set to false from the serialization", function() {
                    expect(test.check_szn1.checked).toBe(false);
                });
                it("can be set to true from the serialization", function() {
                    expect(test.check_szn2.checked).toBe(true);
                });

                it("can be set to true and checks the checkbox", function(done) {
                    setTimeout(function() {
                        test.check1.checked = true;
                        expect(test.check1.checked).toBe(true);
                        testPage.waitForDraw().then(function(){
                            expect(test.check1.element.checked).toBe(true);
                            done();
                        });
                    });

                });
                xit("can be set to false and unchecks the checkbox", function(done) {
                    setTimeout(function() {
                        test.check2.checked = false;
                        expect(test.check2.checked).toBe(false);
                        testPage.waitForDraw().then(function(){
                            expect(test.check2.element.checked).toBe(false);
                            done();
                        });
                    });
                });

                xdescribe("one-way binding", function() {
                    it("starts checked", function(done) {
                        setTimeout(function() {
                            expect(test.check_bound1.element.checked).toBe(true);
                            expect(test.check_bound2.element.checked).toBe(true);
                            click(test.check_bound2);
                            done();
                        });
                    });
                    it("unchecks both one way", function(done) {
                        testPage.waitForDraw().then(function() {
                            expect(test.check_bound1.element.checked).toBe(false);
                            expect(test.check_bound2.element.checked).toBe(false);
                            click(test.check_bound2);
                            done();
                        });
                    });
                    it("checks both one way", function(done) {
                        testPage.waitForDraw().then(function() {
                            expect(test.check_bound1.element.checked).toBe(true);
                            expect(test.check_bound2.element.checked).toBe(true);
                            click(test.check_bound1);
                            done();
                        });
                    });
                    it("doesn't bind the other way (unchecked)", function(done) {
                        testPage.waitForDraw().then(function() {
                            expect(test.check_bound1.element.checked).toBe(false);
                            expect(test.check_bound2.element.checked).toBe(true);
                            click(test.check_bound1);
                            done();
                        });
                    });
                    it("doesn't bind the other way (checked)", function(done) {
                        testPage.waitForDraw().then(function() {
                            expect(test.check_bound1.element.checked).toBe(true);
                            expect(test.check_bound2.element.checked).toBe(true);
                            click(test.check_bound2);
                            done();
                        });
                    });
                    it("unchecks both", function(done) {
                        testPage.waitForDraw().then(function() {
                            expect(test.check_bound1.element.checked).toBe(false);
                            expect(test.check_bound2.element.checked).toBe(false);
                            done();
                        });
                    });
                });
            });

            it("checks when the label is clicked", function() {
                expect(test.check1.checked).toBe(true);
                var listener = testPage.addListener(test.check1);
                testPage.mouseEvent({target: testPage.getElementById("label")}, "click");;
                expect(listener).toHaveBeenCalled();
                expect(test.check1.checked).toBe(false);
            })

            describe("action event", function() {
                it("should fire when clicked", function() {
                    expect(click(test.check1)).toHaveBeenCalled();
                });
            });

            describe("inside a scroll view", function() {
                it("fires an action event when clicked", function() {
                    expect(test.scroll_check.checked).toBe(false);

                    expect(click(test.scroll_check)).toHaveBeenCalled();
                    expect(test.scroll_check.checked).toBe(true);
                });
                it("checks when the label is clicked", function() {
                    expect(test.scroll_check.checked).toBe(true);
                    var listener = testPage.addListener(test.scroll_check);
                    testPage.mouseEvent({target: testPage.getElementById("scroll_label")}, "click");;
                    expect(listener).toHaveBeenCalled();
                    expect(test.scroll_check.checked).toBe(false);
                })
                xit("doesn't fire an action event when scroller is dragged", function(done) {
                    var el = test.scroll_check.element;
                    var scroll_el = test.scroll.element;

                    var listener = testPage.addListener(test.scroll_check);

                    var press_composer = test.scroll_check.composerList[0];

                    // mousedown
                    testPage.mouseEvent({target: el}, "mousedown");

                    expect(test.scroll_check.checked).toBe(false);
                    expect(test.scroll_check.eventManager.isPointerClaimedByComponent(press_composer._observedPointer, press_composer)).toBe(true);

                    // Mouse move doesn't happen instantly
                    setTimeout(function() {
                        // mouse move up
                        var moveEvent = document.createEvent("MouseEvent");
                        // Dispatch to scroll view, but use the coordinates from the
                        // button
                        moveEvent.initMouseEvent("mousemove", true, true, scroll_el.view, null,
                                el.offsetLeft, el.offsetTop - 100,
                                el.offsetLeft, el.offsetTop - 100,
                                false, false, false, false,
                                0, null);
                        scroll_el.dispatchEvent(moveEvent);

                        expect(test.scroll_check.checked).toBe(false);
                        expect(test.scroll_check.eventManager.isPointerClaimedByComponent(press_composer._observedPointer, press_composer)).toBe(false);

                        // mouse up
                        testPage.mouseEvent({target: el}, "mouseup");;
                        testPage.mouseEvent({target: el}, "click");;

                        expect(listener).not.toHaveBeenCalled();
                        expect(test.scroll_check.checked).toBe(false);
                        done();
                    }, 10);

                });
            });

        });
    });
});

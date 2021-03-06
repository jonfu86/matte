/*global require,exports,describe,it,expect */
var Montage = require("montage").Montage;
var TestPageLoader = require("montage-testing/testpageloader").TestPageLoader;

TestPageLoader.queueTest("input-range-test", function(testPage) {
    var test;
    beforeEach(function() {
        test = testPage.test;
    });

    describe("ui/input-range-spec", function() {
        it("should load", function() {
            expect(testPage.loaded).toBe(true);
        });

        describe("RangeInput", function() {
            it("can be created", function() {
                expect(test.range_input1).toBeDefined();
            });

            describe("value", function() {
                it("can be set from the serialization", function() {
                    expect(test.range_input2.value).toBe(1);
                });
            });

            xit("can be changed", function(done) {
                expect(test.range_input1.value).toBe(0);

                var eventInfo = {
                    target: test.range_input1.element,
                    clientX: test.range_input1.element.offsetLeft + 30,
                    clientY: test.range_input1.element.offsetTop + 5
                };

                testPage.clickOrTouch(eventInfo);
                testPage.waitForDraw().then(function() {
                    expect(test.range_input1.value).toBeGreaterThan(0);
                    done();
                });

            });

            describe("inside a scroller", function() {
                xit("can be changed", function(done) {
                    expect(test.scroll_range.value).toBe(0);

                    var eventInfo = {
                        target: test.scroll_range.element,
                        clientX: test.scroll_range.element.offsetLeft + 30,
                        clientY: test.scroll_range.element.offsetTop + 5
                    };

                    testPage.clickOrTouch(eventInfo);
                    testPage.waitForDraw().then(function() {
                        expect(test.range_input1.value).toBeGreaterThan(0);
                        done();
                    });
                });

                it("doesn't surrender the pointer", function(done) {
                    var el, scroll_el, listener, originalValue;
                    el = test.scroll_range.element;
                    scroll_el = test.scroll.element;

                    // mousedown
                    testPage.mouseEvent({target: el}, "mousedown");

                    expect(test.scroll.eventManager.isPointerClaimedByComponent(test.scroll._observedPointer, test.scroll)).toBe(false);

                    // Mouse move doesn't happen instantly
                    setTimeout(function() {
                        // mouse move up

                        var moveEvent = document.createEvent("MouseEvent");
                        // Dispatch to scroll view, but use the coordinates from the
                        // button
                        moveEvent.initMouseEvent("mousemove", true, true, scroll_el.view, null,
                                el.offsetLeft, el.offsetTop - 50,
                                el.offsetLeft, el.offsetTop - 50,
                                false, false, false, false,
                                0, null);
                        var valueBeforeScroll = test.scroll_range.value;
                        scroll_el.dispatchEvent(moveEvent);

                        expect(test.scroll_range.value).toBe(valueBeforeScroll);
                        expect(test.scroll.eventManager.isPointerClaimedByComponent(test.scroll._observedPointer, test.scroll)).toBe(false);

                        // mouse up
                        testPage.mouseEvent({target: el}, "mouseup");
                        testPage.mouseEvent({target: el}, "click");
                        done();
                    }, 10);
                });
            });
        });
    });
});

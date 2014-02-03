(function() {
  describe("Heap", function() {
    var addSampleBoxes, bigBox, el, smallBox;
    el = void 0;
    smallBox = void 0;
    bigBox = void 0;
    addSampleBoxes = function(el, n, box) {
      var b, i;
      if (box === null || box === undefined) {
        box = smallBox;
      }
      i = 0;
      while (i < n) {
        b = box.clone();
        b.data("index", i);
        b.appendTo(el);
        i++;
      }
      return $(".box", el);
    };
    beforeEach(function() {
      var body;
      body = $("#jasmine_content").empty();
      el = $("<div id=\"test\" class=\"boxes\"> </div>");
      el.appendTo(body);
      smallBox = $("<div class=\"box small\"> </div>");
      return bigBox = $("<div class=\"box big\"> </div>");
    });
    it("has a canvas size of 300px", function() {
      expect(el.width()).toEqual(300);
      return expect(el.height()).toEqual(300);
    });
    it("has boxes of size 100px", function() {
      el.append(smallBox);
      expect(smallBox.width()).toEqual(100);
      return expect(smallBox.height()).toEqual(100);
    });
    describe("el.heapify(boxes) with small boxes", function() {
      var boxes, firstBox;
      boxes = void 0;
      firstBox = void 0;
      beforeEach(function() {
        boxes = addSampleBoxes(el, 5);
        el.heapify(".box");
        return firstBox = boxes.first();
      });
      it("puts the first box in the center", function() {
        var position;
        position = firstBox.position();
        expect(Math.round(position.top)).toEqual(100);
        return expect(Math.round(position.left)).toEqual(100);
      });
      return it("builds a simple cross for 5 boxes", function() {
        var validPositions;
        validPositions = [[0, 100], [100, 0], [200, 100], [100, 200]];
        return boxes.not(firstBox).each(function(i, el) {
          var position;
          position = $(el).position();
          position = [Math.round(position.left), Math.round(position.top)];
          return expect(validPositions).toContain(position);
        });
      });
    });
    describe("el.heapify(boxes) with big boxes", function() {
      var boxes, firstBox;
      boxes = void 0;
      firstBox = void 0;
      beforeEach(function() {
        firstBox = addSampleBoxes(el, 1, bigBox).first();
        boxes = addSampleBoxes(el, 4);
        return el.heapify(".box");
      });
      it("puts the first box in the center", function() {
        var position;
        position = firstBox.position();
        expect(Math.round(position.top)).toEqual(-50);
        return expect(Math.round(position.left)).toEqual(-50);
      });
      return it("builds a simple cross for 5 boxes", function() {
        var validPositions;
        validPositions = [[0, 100], [100, 0], [200, 100], [100, 200]];
        return boxes.not(firstBox).each(function(i, el) {
          var position;
          position = $(el).position();
          position = [Math.round(position.left), Math.round(position.top)];
          return expect(validPositions).toContain(position);
        });
      });
    });
    describe("el.heapify(boxes, { sort: true/false })", function() {
      var boxes, firstBox;
      boxes = void 0;
      firstBox = void 0;
      beforeEach(function() {
        return boxes = addSampleBoxes(el, 3);
      });
      return it("places the largest boxes first", function() {
        var position;
        boxes.eq(0).css({
          width: "90px",
          height: "90px"
        });
        boxes.eq(2).css({
          width: "110px",
          height: "110px"
        });
        el.heapify(".box", {
          sort: true
        });
        position = boxes.eq(2).position();
        expect(Math.round(position.top)).toEqual(90);
        return expect(Math.round(position.left)).toEqual(90);
      });
    });
    return describe("helper functions", function() {
      var heap;
      heap = void 0;
      beforeEach(function() {
        el.heapify();
        return heap = el.data("heap");
      });
      return describe("findBestPlacement", function() {
        return it("returns a would-be centered box", function() {
          expect(heap.findBestPlacement(20, 20)).toEqual({
            top: 140,
            right: 159,
            bottom: 159,
            left: 140
          });
          return expect(heap.findBestPlacement(300, 300)).toEqual({
            top: 0,
            right: 299,
            bottom: 299,
            left: 0
          });
        });
      });
    });
  });

}).call(this);

/*
//@ sourceMappingURL=heap_spec.js.map
*/

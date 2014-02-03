describe "Heap", ->
  el = undefined
  smallBox = undefined
  bigBox = undefined

  addSampleBoxes = (el, n, box) ->
    box = smallBox if box is null or box is `undefined`
    i = 0

    while i < n
      b = box.clone()
      b.data "index", i
      b.appendTo el
      i++

    $ ".box", el

  beforeEach ->
    body = $("#jasmine_content").empty()
    el = $("<div id=\"test\" class=\"boxes\"> </div>")
    el.appendTo body
    smallBox = $("<div class=\"box small\"> </div>")
    bigBox = $("<div class=\"box big\"> </div>")

  it "has a canvas size of 300px", ->
    expect(el.width()).toEqual 300
    expect(el.height()).toEqual 300

  it "has boxes of size 100px", ->
    el.append smallBox
    expect(smallBox.width()).toEqual 100
    expect(smallBox.height()).toEqual 100

  describe "el.heapify(boxes) with small boxes", ->
    boxes = undefined
    firstBox = undefined

    beforeEach ->
      boxes = addSampleBoxes(el, 5)
      el.heapify ".box"
      firstBox = boxes.first()

    it "puts the first box in the center", ->
      position = firstBox.position()

      # this is a 100x100 box on a 300x300 canvas == offset of 100x100 
      expect(Math.round(position.top)).toEqual 100
      expect(Math.round(position.left)).toEqual 100

    it "builds a simple cross for 5 boxes", ->
      validPositions = [
        [ 0,100 ]
        [ 100,0 ]
        [ 200,100 ]
        [ 100,200 ]
      ]

      boxes.not(firstBox).each (i, el) ->
        position = $(el).position()
        position = [
          Math.round(position.left)
          Math.round(position.top)
        ]
        expect(validPositions).toContain position

  describe "el.heapify(boxes) with big boxes", ->
    boxes = undefined
    firstBox = undefined

    beforeEach ->
      firstBox = addSampleBoxes(el, 1, bigBox).first()
      boxes = addSampleBoxes(el, 4)
      el.heapify ".box"

    it "puts the first box in the center", ->
      position = firstBox.position()

      # this is a 400x400 box on a 300x300 canvas 
      expect(Math.round(position.top)).toEqual -50
      expect(Math.round(position.left)).toEqual -50

    it "builds a simple cross for 5 boxes", ->
      validPositions = [
        [ 0,100 ]
        [ 100,0 ]
        [ 200,100 ]
        [ 100,200 ]
      ]

      boxes.not(firstBox).each (i, el) ->
        position = $(el).position()
        position = [
          Math.round(position.left)
          Math.round(position.top)
        ]
        expect(validPositions).toContain position

  describe "el.heapify(boxes, { sort: true/false })", ->
    boxes = undefined
    firstBox = undefined

    beforeEach ->
      boxes = addSampleBoxes(el, 3)

    it "places the largest boxes first", ->
      # reverse size order
      boxes.eq(0).css
        width: "90px"
        height: "90px"

      boxes.eq(2).css
        width: "110px"
        height: "110px"

      el.heapify ".box",
        sort: true

      # last should be in the center
      position = boxes.eq(2).position()
      expect(Math.round(position.top)).toEqual 90
      expect(Math.round(position.left)).toEqual 90

  # helper functions
  describe "helper functions", ->
    heap = undefined

    beforeEach ->
      el.heapify()
      heap = el.data("heap")

    describe "findBestPlacement", ->
      it "returns a would-be centered box", ->
        expect(heap.findBestPlacement(20, 20)).toEqual
          top: 140
          right: 159
          bottom: 159
          left: 140

        expect(heap.findBestPlacement(300, 300)).toEqual
          top: 0
          right: 299
          bottom: 299
          left: 0

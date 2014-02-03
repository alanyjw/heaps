(function() {
  (function($) {
    $.heap = function(el, selector, options) {
      var bySize, coordinateToPlacement, isFit, place, rectsIntersect, scoreCoordinate, scoreCoordinates, sortCoordinates;
      this.el = el;
      this.$el = $(el);
      this.init = (function(_this) {
        return function() {
          var boundingBox, elements, height, total, width;
          _this.body = $('body');
          _this.options = $.extend({}, $.heap.defaultOptions, options);
          _this.$el.css({
            position: 'relative'
          });
          boundingBox = function() {
            var dim, elements, totalHeights, totalWidths;
            elements = $(selector);
            totalWidths = 0;
            totalHeights = 0;
            $.each(elements, function(_, e) {
              totalWidths += $(e).width();
              return totalHeights += $(e).height();
            });
            dim = Math.max(totalWidths, totalHeights);
            return dim;
          };
          total = boundingBox();
          width = Math.max(total, _this.$el.outerWidth());
          height = Math.max(total, _this.$el.outerHeight());
          _this.center = [width / 2, height / 2];
          console.log(_this.center);
          _this.sortedCoordinates = sortCoordinates(width, height);
          _this.placedElements = [];
          if (selector) {
            elements = $(selector, _this.el);
            if (_this.options.sort) {
              elements = elements.sort(bySize);
            }
            elements.each(place);
          }
          _this.$el.scrollLeft(_this.center[0]);
          _this.$el.scrollTop(_this.center[1]);
          return _this;
        };
      })(this);
      place = (function(_this) {
        return function(i, el) {
          return _this.place(el);
        };
      })(this);
      this.place = (function(_this) {
        return function(el) {
          var $el, height, placement, width;
          $el = $(el);
          $el.hide();
          width = $el.outerWidth();
          height = $el.outerHeight();
          placement = _this.findBestPlacement(width, height);
          console.log(placement);
          if (!placement) {
            return null;
          }
          _this.placedElements.push(placement);
          $el.css({
            position: 'absolute',
            left: placement.left + 'px',
            top: placement.top + 'px'
          });
          return $el.show();
        };
      })(this);
      this.findBestPlacement = (function(_this) {
        return function(width, height) {
          var coordinate, placement, _i, _len, _ref;
          _ref = _this.sortedCoordinates;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            coordinate = _ref[_i];
            placement = coordinateToPlacement(width, height, coordinate);
            if (isFit(placement)) {
              return placement;
            }
          }
        };
      })(this);
      coordinateToPlacement = (function(_this) {
        return function(width, height, coordinate) {
          var x, y;
          x = coordinate[0] - width / 2;
          y = coordinate[1] - height / 2;
          x = x - (x % _this.options.step);
          y = y - (y % _this.options.step);
          return {
            top: y,
            right: x + width - 1,
            bottom: y + height - 1,
            left: x
          };
        };
      })(this);
      rectsIntersect = function(placement, otherPlacement) {
        return !(placement.right < otherPlacement.left || placement.bottom < otherPlacement.top || placement.left > otherPlacement.right || placement.top > otherPlacement.bottom);
      };
      isFit = (function(_this) {
        return function(placement) {
          var otherPlacement, _i, _len, _ref;
          _ref = _this.placedElements;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            otherPlacement = _ref[_i];
            if (rectsIntersect(placement, otherPlacement)) {
              return false;
            }
          }
          return true;
        };
      })(this);
      sortCoordinates = (function(_this) {
        return function(width, height) {
          var coordinates, x, y, _i, _j, _ref, _ref1, _ref2, _ref3;
          coordinates = [];
          for (x = _i = 0, _ref = width - _this.options.step, _ref1 = _this.options.step; _ref1 > 0 ? _i < _ref : _i > _ref; x = _i += _ref1) {
            for (y = _j = 0, _ref2 = height - _this.options.step, _ref3 = _this.options.step; _ref3 > 0 ? _j < _ref2 : _j > _ref2; y = _j += _ref3) {
              coordinates.push([x, y]);
            }
          }
          return coordinates.sort(scoreCoordinates);
        };
      })(this);
      scoreCoordinates = (function(_this) {
        return function(a, b) {
          if (_this.options.scoring) {
            return _this.options.scoring.call(_this, a) - _this.options.scoring.call(_this, b);
          } else {
            return scoreCoordinate(a) - scoreCoordinate(b);
          }
        };
      })(this);
      scoreCoordinate = (function(_this) {
        return function(coordinate) {
          return Math.sqrt(Math.pow(coordinate[0] - _this.center[0], 2) + Math.pow(coordinate[1] - _this.center[1], 2));
        };
      })(this);
      bySize = function(a, b) {
        var $a, $b, areaA, areaB;
        $a = $(a);
        $b = $(b);
        areaA = $a.width() * $a.height();
        areaB = $b.width() * $b.height();
        return areaB - areaA;
      };
      return this.init();
    };
    $.heap.defaultOptions = {
      step: 10
    };
    $.fn.heapify = function(selector, options) {
      return $.each(this, function(i, el) {
        var $el;
        $el = $(el);
        if (!$el.data('heap')) {
          return $el.data('heap', new $.heap(el, selector, options));
        }
      });
    };
    return void 0;
  })(jQuery);

}).call(this);

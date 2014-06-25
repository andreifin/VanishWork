'use strict';
var unique;
unique = require('prelude-ls').unique;
angular.module('ngfast-main', ['ngRoute']).config(function($routeProvider){
  return $routeProvider.when('/', {
    templateUrl: 'main/main.html',
    controller: 'MainCtrl'
  });
}).controller('MainCtrl', function($scope){
  var comDiv, endCheck;
  $scope.startingNums = [2, 3, 4, 6];
  $scope.started = false;
  $scope.numbers = $scope.startingNums.concat([]);
  $scope.winFlag = false;
  $scope.loseFlag = false;
  $scope.prev = -1;
  $scope.positions = [[[]], [[]], [[10, 10], [100, 100]], [[10, 10], [10, 100], [50, 50]], [[10, 10], [10, 100], [100, 10], [100, 100]]];
  comDiv = function(a, b){
    var best, i$, i;
    if (a > b) {
      return comDiv(b, a);
    } else {
      best = a;
      for (i$ = Math.floor(a / 2); i$ >= 2; --i$) {
        i = i$;
        if (a % i === 0 && b % i === 0) {
          best = i;
        }
      }
      if (best === a && b % a !== 0) {
        best = 1;
      }
      return best;
    }
  };
  endCheck = function(){
    if (unique($scope.numbers).length === 1 && $scope.numbers[0] === 1) {
      return $scope.winFlag = true;
    } else {
      return $scope.loseFlag = true;
    }
  };
  $scope.handleDrop = function(item, bin){
    var div;
    if(item==bin) return;
    if (item === $scope.prev || $scope.prev === -1) {
      div = comDiv($scope.numbers[item], $scope.numbers[bin]);
      $scope.numbers[item] /= div;
      $scope.numbers[bin] /= div;
      if (div !== 1) {
        $scope.prev = bin;
      }
    }
    if ($scope.numbers[$scope.prev] === 1) {
      return endCheck();
    }
  };
  return $scope.reset = function(){
    $scope.prev = -1;
    $scope.winFlag = false;
    $scope.loseFlag = false;
    $scope.started = false;
    return $scope.numbers = $scope.startingNums.concat([]);
  };
})
.directive('draggable', function() {
  return function(scope, element) {
    // this gives us the native JS object
    var el = element[0];
    
    el.draggable = true;
    
    el.addEventListener(
      'dragstart',
      function(e) {
        e.dataTransfer.effectAllowed = 'move';
        this.style.opacity = '0.4';
        //this.style.width = 50;
        e.dataTransfer.setData('Text', this.id);
        var dragIcon = document.createElement('img');
        dragIcon.src = 'http://flyosity.com/images/_blogentries/networkicon/step4a.png';
        dragIcon.width = 0.3;
        dragIcon.height = 0.3;
        e.dataTransfer.setDragImage(dragIcon, 50, 50);
        this.classList.add('drag');
        return false;
      },
      false
    );
    
    el.addEventListener(
      'dragend',
      function(e) {
        this.style.opacity = '1.0';
        this.classList.remove('drag');
        return false;
      },
      false
    );
  }
})

.directive('droppable', function() {
  return {
    scope: {
      drop: '&',
      bin: '='
    },
    link: function(scope, element) {
      // again we need the native object
      var el = element[0];
      
      el.addEventListener(
        'dragover',
        function(e) {
          e.dataTransfer.dropEffect = 'move';
          // allows us to drop
          if (e.preventDefault) e.preventDefault();
          this.classList.add('over');
          return false;
        },
        false
      );
      
      el.addEventListener(
        'dragenter',
        function(e) {
          this.classList.add('over');
          return false;
        },
        false
      );
      
      el.addEventListener(
        'dragleave',
        function(e) {
          this.classList.remove('over');
          return false;
        },
        false
      );
      
      el.addEventListener(
        'drop',
        function(e) {
          // Stops some browsers from redirecting.
          if (e.stopPropagation) e.stopPropagation();
          
          this.classList.remove('over');
          
          var binId = this.id;
          var item = document.getElementById(e.dataTransfer.getData('Text'));
          //this.appendChild(item);
          // call the passed drop function
          scope.$apply(function(scope) {
            var fn = scope.drop();
            if ('undefined' !== typeof fn) {            
              fn(item.id, binId);
            }
          });
          
          return false;
        },
        false
      );
    }
  };
});

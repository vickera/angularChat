var signInApp = angular.module('signInApp', []);

var main = angular.module('main', ['signInApp']);

var socket = io();

angular.module('main')
   .controller('chat',function($scope){
      var chat = document.getElementById('chatRoom');
      
      $scope.sendMsg = function(){
         if($scope.msg != ''){
            socket.emit('sendMsg',{msg:$scope.msg});
         }
         $scope.msg = '';
      }
   
      socket.on('emitMsg', function(data){
         $(chat).animate({ scrollTop: $(chat).prop("scrollHeight")}, 500);
         chat.innerHTML += '<div>' + data + '</div>';
      });   
   });
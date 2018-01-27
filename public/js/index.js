var app = angular.module('myApp', []);
app.controller('myctr', myctr);

function myctr($scope) {
	$scope.$watch('firstVal', function(newVal, oldVal) {
		//console.log(newVal, oldVal);
		if(newVal === 38 && oldVal === 192) {
			alert('dui');
		}
	}, true);
	//监听键盘
	function keyUp(e) {
		var currKey = 0,
			e = e || event;
		currKey = e.keyCode || e.which || e.charCode;
		var keyName = String.fromCharCode(currKey);
		//console.log("按键码: " + currKey + " 字符: " + keyName);
		$scope.firstVal = currKey;
		$scope.$apply();
	}
	document.onkeyup = keyUp;
}
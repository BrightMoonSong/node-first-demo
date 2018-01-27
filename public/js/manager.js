var app = angular.module('myApp', []);
app.controller('myctr', myctr)
	.factory('novelService', novelService);

function myctr($scope, novelService, $timeout) {
	$scope.lookNovel = ''; //小说
	$scope.conList = [];
	$scope.novelList = [];
	$scope.obj = {};
	$scope.lookTitle = false; //是否查看小说章节
	$scope.addForm = false; //是否提取小说内容
	$scope.pageSize = 10;
	$scope.pageNo = 1;
	//看小说去了
	$scope.dbLookNovel = function(o) {
		$scope.lookNovel = o; //小说
//		var a = 0,
//			b = '';
//		o.split('').forEach(function(val) {
//			if(a < 20) {
//				a = a + 1;
//				b = b + val;
//				if(a == 20) {
//					$scope.conList.push(b);
//				}
//			} else {
//				a = 1;
//				b = '' + val;
//			}
//		})
		//		console.log($scope.conList);
	}
	//念出来小说
//	$scope.speakNovel = function() {
//		$scope.test($scope.conList[0]);
//		var n = 1;
//		var a = $timeout(function() {
//			$scope.test($scope.conList[n]);
//			n++;
//			if(n > $scope.conList.length) {
//				$timeout.cancel(a);
//			}
//		}, 5000);
//	}
//	$scope.test = function(val) {
//		//		var src = 'http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=2&text=' + $scope.lookNovel;
//		var src = 'http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=5&text=' + val;
//
//		if($('.lookNovel').find(".jspeech_iframe").length > 0) {
//
//			$('.lookNovel').find(".jspeech_iframe").attr("src", src);
//
//		} else {
//
//			var iframe = "<iframe height='0' width='0' class='jspeech_iframe' scrolling='no' frameborder='0' src='" + src + "' ></iframe>";
//
//			$('.lookNovel').append(iframe);
//
//		}
//	}
	//查看小说章节
	$scope.getList = function(id) {
		$scope.lookTitle = $scope.lookTitle ? false : true;
		if($scope.lookTitle) {
			novelService
				.getContent(id, $scope.pageSize, $scope.pageNo)
				.then(function(result) {
					$scope.titleList = result.data;
				}, function(err) {
					console.log(err);
				})
		}
	};
	//get名字
	$scope.initName = function() {
		novelService
			.getName($scope.novelName)
			.then(function(result) {
				$scope.novelList = result;
			}, function(err) {
				console.log(err);
			})
	}
	$scope.initName();

	//add名字
	$scope.nameSubmit = function() {
		if($scope.novelName) {
			novelService
				.addName($scope.novelName)
				.then(function(result) {
					console.log(result)
				}, function(err) {
					console.log(err);
				})
		} else {
			alert('请输入小说的名字');
		}
	}

	//提取章节内容
	$scope.chapterContent = function(id, url) {
		novelService
			.chapterContent(id, url)
			.then(function(result) {
				console.log(result)
				if(result.code === 0) {
					alert('提取章节内容成功');
				} else {
					alert('提取章节内容失败')
				}
			}, function(err) {
				console.log(err);
				alert('服务器忙')
			})
	}

	//add内容
	$scope.catalogSubmit = function(id) {
		if($scope.obj.novelCatalog) {
			novelService
				.addContent(id, $scope.obj.novelCatalog)
				.then(function(result) {
					console.log(result)
				}, function(err) {
					console.log(err);
				})
		} else {
			alert('请输入小说的目录的网址');
		}
	}
}

function novelService($http, $q) {
	return {
		//提取章节内容
		chapterContent: function(id, url) {
			var defer = $q.defer();
			var url = '/users/getChapterContent?url=' + url + '&id=' + id;
			$http({
				method: "get",
				url: url
			}).success(function(data) {
				defer.resolve(data)
			}).error(function(data) {
				defer.reject(data)
			})
			return defer.promise;
		},
		//查看小说章节
		getContent: function(bookId, pageSize, pageNo) {
			var defer = $q.defer();
			var url = '/users/getContent?bookId=' + bookId + '&pageSize=' + pageSize + '&pageNo=' + pageNo;
			$http({
				method: "get",
				url: url
			}).success(function(data) {
				defer.resolve(data)
			}).error(function(data) {
				defer.reject(data)
			})
			return defer.promise;
		},
		//新增小说名字
		addName: function(name) {
			var defer = $q.defer();
			var url = '/users/addNovelName?name=' + name;
			$http({
				method: "get",
				url: url
			}).success(function(data) {
				defer.resolve(data)
			}).error(function(data) {
				defer.reject(data)
			})
			return defer.promise;
		},
		//新增小说内容
		addContent: function(id, url) {
			var defer = $q.defer();
			var url = '/users/addNovel?id=' + id + '&url=' + url;
			$http({
				method: "get",
				url: url
			}).success(function(data) {
				defer.resolve(data)
			}).error(function(data) {
				defer.reject(data)
			})
			return defer.promise;
		},
		//获取小说名字列表
		getName: function() {
			var defer = $q.defer();
			var url = '/users/queryAllNovel';
			$http({
				method: "get",
				url: url
			}).success(function(data) {
				defer.resolve(data)
			}).error(function(data) {
				defer.reject(data)
			})
			return defer.promise;
		}
	}

}
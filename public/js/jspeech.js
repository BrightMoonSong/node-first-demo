(function($) {

	$.fn.jspeech = function(options) {

		var defaults = {

			//通过点击链接播报，还是直接播报

			"jspeech_a": true,

			//链接按钮的宽度

			"jspeech_a_width": "16px",

			//链接按钮的高度

			"jspeech_a_height": "13px",

			//链接按钮的背景图片

			"jspeech_a_png": "url(./image/icon.png) no-repeat",

			//直接播报内容

			"jspeech_content": "测试"

		};

		var options = $.extend(defaults, options);

		this.each(function() {

			if(options.jspeech_a) {

				//如果是通过点击链接播报

				//获得文本内容

				var content = $(this).text();

				//生成链接

				var speechClick = "<a href='javascript:void(0);' class='jspeech_a'></a>";

				$(this).append(speechClick);

				//设置链接样式

				$(this).find(".jspeech_a").css({

					width: options.jspeech_a_width,

					height: options.jspeech_a_height,

					"display": "inline-block",

					"background": options.jspeech_a_png

				});

				$(this).find(".jspeech_a").click(function() {

					//捕获点击事件

					var src = 'http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=' + content;

					if($(this).find(".jspeech_iframe").length > 0) {

						$(this).find(".jspeech_iframe").attr("src", src);

					} else {

						var iframe = "<iframe height='0' width='0' class='jspeech_iframe' scrolling='no' frameborder='0' src='" + src + "' ></iframe>";

						$(this).append(iframe);

					}

				});

			} else {

				var src = 'http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=' + options.jspeech_content;

				if($(this).find(".jspeech_iframe").length > 0) {

					$(this).find(".jspeech_iframe").attr("src", src);

				} else {

					var iframe = "<iframe height='0' width='0' class='jspeech_iframe' scrolling='no' frameborder='0' src='" + src + "' ></iframe>";

					$(this).append(iframe);

				}

			}

		});

	};

})(jQuery);
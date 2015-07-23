
(function($, undefined){

	function createDemos(){
		var simple = $("<div id='slider' />").appendTo("body"),
			date = $("<div id='date' />").appendTo("body"),
			modifiable = $("<div id='modifiable' />").appendTo("body");

		simple.sliderDemo();
		date.dateSliderDemo();
		modifiable.editSliderDemo();
	}

	function changeTheme(e){
		var target = $(e.currentTarget),
			path = "../css/",
			theme;

		if (target.hasClass("selected")){
			return
		}

		$("#themeSelector .selected").removeClass("selected");

		theme = target.attr("class");

		$("#themeSelector ."+theme).addClass("selected");

		$("#themeCSS").attr("href", path + theme + ".css");

		setTimeout(function(){
			$(window).resize();
		}, 500);
	}

	function initTheme(){
		$("#themeSelector dd, #themeSelector dt").click(changeTheme);
	}

	$(document).ready(function(){
		createDemos();
		initTheme();
		$.datepicker.regional['pt-BR'] = {
				closeText: 'Fechar',
				prevText: '&#x3c;Anterior',
				nextText: 'Pr&oacute;ximo&#x3e;',
				currentText: 'Hoje',
				monthNames: ['Janeiro','Fevereiro','Mar&ccedil;o','Abril','Maio','Junho',
				'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
				monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun',
				'Jul','Ago','Set','Out','Nov','Dez'],
				dayNames: ['Domingo','Segunda-feira','Ter&ccedil;a-feira','Quarta-feira','Quinta-feira','Sexta-feira','S&aacute;bado'],
				dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','S&aacute;b'],
				dayNamesMin: ['Dom','Seg','Ter','Qua','Qui','Sex','S&aacute;b'],
				weekHeader: 'Sm',
				dateFormat: 'dd/mm/yy',
				firstDay: 0,
				isRTL: false,
				showMonthAfterYear: false,
				yearSuffix: ''};
			$.datepicker.setDefaults($.datepicker.regional['pt-BR']);
	});

})(jQuery);


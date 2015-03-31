var _months = {
		enUS : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		esES : ["Jan", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dec"],
		ptBR : ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
	};
var _CONSTRAINTS = {
	SCALE_TYPE_NONE : "NONE",
	SCALE_TYPE_YEAR : "YEAR",
	SCALE_TYPE_MONTH : "MONTH",
	SCALE_TYPE_DAY : "DAY",
	};
(function($, undefined){
	"use strict";

	$.widget("ui.dateSliderDemo", $.ui.sliderDemo, {
		options: {},
		_title: "Date values",
		_scaleType : _CONSTRAINTS.SCALE_TYPE_MONTH,
		_name: "dateRangeSlider",

		_createInputs: function(){
			$.ui.sliderDemo.prototype._createInputs.apply(this, []);

			this._addPicker(this._elements.minInput);
			this._addPicker(this._elements.maxInput);

			(function(that){
				that._elements.minInput.change(function(){
					that._valueChanged($(this).datepicker("getDate"), "min");
				});

				that._elements.maxInput.change(function(){
					that._valueChanged($(this).datepicker("getDate"), "max");
				});
			})(this);
			
			this._elements.minInput.change($.proxy(this._minChanged, this));
		},

		_createBoundsOptions: function(){
			this._createDT("Bounds");

			var minSelect = this._createSelect("min", "Bound"),
				maxSelect = this._createSelect("max", "Bound");

			this._addDateOption(minSelect, new Date(2008, 0, 1));
			this._addDateOption(minSelect, new Date(2009, 2, 1));
			this._addDateOption(minSelect, new Date(2010, 5, 1));

			this._addDateOption(maxSelect, new Date(2013, 11, 31, 11, 59, 59));
			this._addDateOption(maxSelect, new Date(2012, 8, 31, 11, 59, 59));
			this._addDateOption(maxSelect, new Date(2010, 6, 4, 11, 59, 59));

			minSelect.bind("change", "min", $.proxy(this._changeBound, this));
			maxSelect.bind("change", "max", $.proxy(this._changeBound, this));
		},

		_addDateOption: function(select, date){
			this._addOption(select, this._format(date), date.valueOf());
		},

		_changeBound: function(event){
			var value = $(event.target).val(),
				bounds = this._getOption("bounds");

			bounds[event.data] = new Date(parseFloat(value));
			this._calculateScales(bounds);
			this._setOption("bounds", bounds);
		},
		
		_calculateScales: function(bounds){
			var endDate = bounds["max"];
			var startDate = bounds["min"];
			var years = endDate.getFullYear() - startDate.getFullYear();
			if (years < 0){
				years = years*1;
			}
			
			if (years > 2){
				this._scaleType = _CONSTRAINTS.SCALE_TYPE_YEAR;
			} else {
				var months = (endDate.getMonth() -startDate.getMonth()) + (years * 12);
				var days = (endDate.getDate() - startDate.getDate()) + (months * 30);
				if (days > 36){
					this._scaleType = _CONSTRAINTS.SCALE_TYPE_MONTH;
				} else {
					this._scaleType = _CONSTRAINTS.SCALE_TYPE_DAY;
				}
			}
		},

		_createStepOption: function(){
			this._createDT("Step");

			var select = $("<select name='step' />");

			this._createDD(select);

			select.bind("change", $.proxy(this._stepOptionChange, this));

			this._addOption(select, "false");
			this._addOption(select, "2 days", '{"days":2}');
			this._addOption(select, "7 days", '{"days":7}');
			this._addOption(select, "1 month", '{"months":1}');
		},

		_stepOptionChange: function(e){
			var target = $(e.target),
				value = target.val();

			this._setOption("step", $.parseJSON(value));
		},

		_valueChanged: function(value, name){
			this._elements.slider[this._name](name, value);
		},

		_addPicker: function(input){
			input.datepicker({
				maxDate: new Date(2013, 11, 31, 11, 59, 59),
				minDate: new Date(2008, 0, 1),
				dateFormat: "yy-mm-dd",
				buttonImage: "img/calendar.png",
				buttonImageOnly: true,
				buttonText: "Choose a date",
				showOn: "both"
				});
			this._calculateScales();
		},

		_format: function(value){
			return $.datepicker.formatDate("yy-mm-dd", value);
		},

		_fillMinSelect: function(select){
			this._addOption(select, "false");
			this._addOption(select, "4 weeks", '{"days": 28}');
			this._addOption(select, "8 weeks", '{"days": 54}');
			this._addOption(select, "16 weeks", '{"days": 108}');
		},

		_fillMaxSelect: function(select){
			this._addOption(select, "false");
			this._addOption(select, "365 days", '{"days": 365}');
			this._addOption(select, "400 days", '{"days": 400}');
			this._addOption(select, "500 days", '{"days": 500}');
		},

		_minSelectChange: function(e){
			var value = $(e.target).val();
			this._setRangeOption($.parseJSON(value), "min");
		},

		_maxSelectChange: function(e){
			var value = $(e.target).val();
			this._setRangeOption($.parseJSON(value), "max");
		},

		_setRangeOption: function(value, optionName){
			var option = {};

			if (value == ""){
				option[optionName] = false;
			}else{
				option[optionName] = value;
			}

			this._setOption("range", option);
		},
		
		_scaleNextDate: function(value, scaleType){
			var next = new Date(value);
			
			if (scaleType == _CONSTRAINTS.SCALE_TYPE_YEAR){
				return new Date(next.setFullYear(parseInt(value.getFullYear()) + 1));
				
			} else if (scaleType == _CONSTRAINTS.SCALE_TYPE_MONTH){
				var month = parseInt(value.getMonth()) + 1;
				if (month > 11){
					month -= 12;
					next.setFullYear(parseInt(value.getFullYear()) + 1);
				}
				next.setMonth(month);
				return new Date(next);
				
			} else if (scaleType == _CONSTRAINTS.SCALE_TYPE_DAY){
				var day = parseInt(value.getDate()) + 1;
				if (day > this._daysInMonth(value.getMonth(), value.getFullYear())){
					day = 1;
					next.setMonth(parseInt(value.getMonth()) + 1);
				}
				next.setDate(day);
				return new Date(next);
			} else {
				return new Date(next.setFullYear(parseInt(value.getFullYear()) + 100));
			}
		},
		
		_daysInMonth: function(month,year) {
		    return new Date(year, month, 0).getDate();
		},
		
		_scaleLabelDate: function(value, scaleType){
			
			if (scaleType == _CONSTRAINTS.SCALE_TYPE_YEAR){
				return "" + value.getFullYear();
			} else if (scaleType == _CONSTRAINTS.SCALE_TYPE_MONTH){
				return _months["ptBR"][value.getMonth()];
			} else  if (scaleType == _CONSTRAINTS.SCALE_TYPE_DAY){
				return  (value.getDate());
			} else {
				return "";
			}
			
		},
		
		_activeScales: function () {
			
			var that = this;
			var scaleNextDate = function (value){
				return that._scaleNextDate(value, that._scaleType);
			};
			
			var scaleLabelDate = function (value){
				return that._scaleLabelDate(value, that._scaleType);
			};
			
			var activeScale = [{
				first: function(value){ return value; },
			    end: function(value) {return value; },
			    next: scaleNextDate,
		        label: scaleLabelDate,
			    format: function(tickContainer, tickStart, tickEnd){
			      tickContainer.addClass("myCustomClass");
			    }
			}];
			
			if (this._scaleType == _CONSTRAINTS.SCALE_TYPE_MONTH || this._scaleType == _CONSTRAINTS.SCALE_TYPE_DAY){
				this._addSecundaryScale(activeScale);
			}
			
			return activeScale;
		},
		
		_addSecundaryScale: function (activeScale) {

			var that = this;
			var scaleNextDateSecundary = function (value){
				var secundaryScaleType = ((that._scaleType == _CONSTRAINTS.SCALE_TYPE_DAY) ? _CONSTRAINTS.SCALE_TYPE_MONTH : ((that._scaleType == _CONSTRAINTS.SCALE_TYPE_MONTH) ?  _CONSTRAINTS.SCALE_TYPE_YEAR : _CONSTRAINTS.SCALE_TYPE_NONE ));
				return that._scaleNextDate(value, secundaryScaleType);
			};
			
			var scaleLabelDateSecundary = function (value){
				var secundaryScaleType = ((that._scaleType == _CONSTRAINTS.SCALE_TYPE_DAY) ? _CONSTRAINTS.SCALE_TYPE_MONTH : ((that._scaleType == _CONSTRAINTS.SCALE_TYPE_MONTH) ?  _CONSTRAINTS.SCALE_TYPE_YEAR : _CONSTRAINTS.SCALE_TYPE_NONE ));
				return that._scaleLabelDate(value, secundaryScaleType);
			};
			
			activeScale.push({
				first: function(value){ return value; },
			    end: function(value) {return value; },
			    next: scaleNextDateSecundary,
		        label: scaleLabelDateSecundary,
			    format: function(tickContainer, tickStart, tickEnd){
			      tickContainer.addClass("myCustomClass");
			    }
			});
			
		},
		
		_returnValues: function(data){
			try{
				return "min:" + this._format(data.values.min) + " max:" + this._format(data.values.max) + (data.label ? " label: " + data.label : "");
			} catch (e){
				return e;
			}
			
		}

	});

})(jQuery);

_months
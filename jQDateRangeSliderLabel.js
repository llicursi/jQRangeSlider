/**
 * jQRangeSlider
 * A javascript slider selector that supports dates
 *
 * Copyright (C) Guillaume Gautreau 2012
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */

(function($){
	"use strict";

	$.widget("ui.dateRangeSliderLabel", $.ui.rangeSliderLabel, {
		options: {
			type: "text",
			step: false,
			id: "",
			bounds : {}
		},

		_input: null,
		_text: "",
		_datePicker: null,
		_timeoutMouseLeave: 0, 
		_clickPrevented : false, 

		_create: function(){
			$.ui.rangeSliderLabel.prototype._create.apply(this);
			this.element.bind("click.label", $.proxy(this._onClick, this))
			this._createDatePicker();
		},

		_createDatePicker : function(){
			var thatRangeSlider = this;
			this._datePicker = $("<div/>")
				.addClass("ui-rangeSlider-label-datepicker")
				.datepicker({
					minDate : this.options.bounds.min,
					maxDate : this.options.bounds.max,
					onSelect : function (date) {
						thatRangeSlider._triggerValue(date);
					}
				})
				.hide()
				.on("mouseleave", function (e){
					thatRangeSlider._timeoutMouseLeave = window.setTimeout(function (){ 
						thatRangeSlider._datePicker.hide(); 
					}, 500);
				})
				.on("mouseenter", function (e){
					window.clearTimeout(thatRangeSlider._timeoutMouseLeave)
				});
			
			
			this.element.parent().append(this._datePicker);
		},
		
		_onClick : function(){
			if (this._clickPrevented != true){
				var right = this.element.css('right'), 
					left = "auto"; 
				if (right === "auto"){
					left = parseFloat(this.element.css('left')) - 80;
				} else {
					right = parseFloat(this.element.css('right')) - 40;
				}
				
				this._datePicker.css("right", right).css("left", left).css("float", "none");
				this._datePicker.show();
			} else {
				this._clickPrevented = !this._clickPrevented;
			}
		},
		
		_triggerValue: function(value){
			var isLeft = this.options.handle[this.options.handleType]("option", "isLeft");
			var date = value.split("/");
			var valueDate = new Date(date[2], parseInt(date[1])-1, date[0], 0,0,0, 0);
			this._datePicker.hide();
			this.element.trigger("valueChange", [{
				isLeft: isLeft,
				value: valueDate
			}]);
		},


	_displayText: function(text){
		
		$.ui.rangeSliderLabel.prototype._displayText.apply(this, [text]);
		if (this._datePicker !== undefined){
			this._datePicker.datepicker("setDate", text);
		}
	},
	
	_onMoving: function(event, ui){
		$.ui.rangeSliderLabel.prototype._onMoving.apply(this, [event, ui]);
		this._datePicker.hide();
	},
	
	_onUpdate: function(){
		$.ui.rangeSliderLabel.prototype._onUpdate.apply(this, []);
		this._clickPrevented = true;
	}

});

}(jQuery));

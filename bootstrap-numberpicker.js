(function(){
	var NumberPicker = function(element,options){
	
		this.options =  options;
		this.$element = $(element);
		this.min= options.min||0;
		this.max= options.max||59;
		this.numberIncrease= options.numberIncrease||1;
		this.maxCloumn= options.maxCloumn||1;
		this.defaultValue= options.defaultValue||0;
		this.init();
	};
	NumberPicker.prototype={
		constructor: NumberPicker,
		init:function(){
			this.$element.on('mousewheel',$.proxy(function(e,d){
				e.preventDefault();
				var val =this.$element.val() || 0
				val =parseInt(val,10);
				if(d>0  && val>this.min ){
					val = val-1
				}else if(d<0 && val<this.max){
					val = val+1
				}
				this.setValue(val);
				
			},this));
			
			this.$widget = $(this.template());
			this.$element.on('focus',$.proxy(this._show, this));
			this.$element.on('keyup',$.proxy(this.update, this));
			//hide if is not active
			$(document).on('mousedown focusin', $.proxy(function (e) {
				// Clicked outside the datepicker, hide it
				if (!(
					this.$element.is(e.target) ||
					this.$element.find(e.target).length ||
					this.$widget.is(e.target) ||
					this.$widget.find(e.target).length
				)) {
					this._hide();
				}
			}, this));

			this.$widget.appendTo('body');
			this.$widget.find('td').on('click',$.proxy(this.numberSelect, this));
			this.$widget.css({
				'width': 'auto'
				,
				'min-width':24*this.maxCloumn
				})
			this.$widget.on('mousewheel',function(e){
				e.preventDefault();
			});
			this.update();
		},
		_show:function(){
			 var pos = $.extend({}, this.$element.offset(), {
                height: this.$element[0].offsetHeight
            });
			this.$widget.css({
                     top: pos.top + pos.height
                    , left: pos.left
            });
            this.$widget.show();
            this.$element.trigger('show');
		},
		_hide:function(){
			this.$widget.hide();
		},
		update:function(){
			var val = parseInt(this.$element.val()) || this.defaultValue;
			$td = this.$widget.find('td');
			
			$td.each(function(i,e){
				$e = $(e)
				if($e .text()==val){
					$td.removeClass('selected');
					return $e.addClass('selected');
				}
			})
		},
		setValue:function(val){
			val = parseInt(val,10);
			if(val>this.max){
				val = this.max;
			}
			if(val<this.min){
				val = this.min;
			}
			this.$element.val(val);
			this.$element.trigger('change');
			this.update();
		},
		numberSelect:function(e){
			e.preventDefault();
			this.setValue($(e.target).text());
			this._hide();
		},
		template:function(){
			var numberPicker = new Array();
			numberPicker.push("<div class='numberpicker numberpicker-dropdown dropdown-menu numberpicker-orient-left numberpicker-orient-top'style='position:absolute'><table class='table-condensed' style='width:100%;text-align:center'><tr>");
			
			for(var i = this.min,j=1;i<=this.max;i=i+this.numberIncrease){
				var number = i;
				numberPicker.push('<td>'+number+'</td>');
				j++;
			} 
			numberPicker.push('</tr></table></div>');
			return numberPicker.join('');
			
		}
		
		
	};
	
	$.fn.numberPicker=function(option){
		var args = Array.apply(null, arguments);
		args.shift();
		return this.each(function () {
			var $this = $(this),
				data = $this.data('numberPicker'),
				options = typeof option == 'object' && option;
			if(!data){
				$this.data('numberPicker',(data = new NumberPicker(this, $.extend({}, $.fn.numberPicker.defaults,options))));
			}
			if (typeof option == 'string') data[option].apply(data, args);
		})
	};
	
	$.fn.numberPicker.defaults={
		min:0,
		max:59,
		numberIncrease:1,
		maxCloumn:1,
		defaultValue: 0
	};
})(this)
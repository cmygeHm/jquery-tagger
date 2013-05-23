/*
gafarov-am@ya.ru
*/
(function($){
	$.fn.tagger = function(){

		return this.each(function(_options){

			var options = {
				editableArea: {
					width: '250px',
					padding: '1px',
					minHeight: '40px',
					backgroundColor: 'white',
					borderColor: 'green',
					borderStyle: 'solid',
					borderWidth: '1px'
				},
				variantList: {
					borderColor: 'blue',
					borderStyle: 'solid',
					borderWidth: '1px',
					shiftToRight: 1
				}
			}

			$.extend(options, _options);
			var originalList = {};
			var i = 0;
			$(this).children('li').each(function(){
				originalList[i++] = $(this).text();
			});

			var backspaceCount = 0;
			var $input = $('<input type=text class="taggerCommonHeight taggerInput" />')
				.click(function(){
					variantList.show();
				})
				.keyup(function(ev){
					if (ev.which != 40 && ev.which != 38) {
						var collection = variantList.findOccurenceInOriginalList($(this).val().toLowerCase());
						variantList.redrawListItems(collection);
					}
				})
				.keydown(function(ev){
					if (ev.which == 188) // код запятой
					{
						if ($(this).val().replace(' ', '', 'g').length)
						{
							variantList.insert($(this).val());
							variantList.redrawListItems(originalList);
						}
						ev.preventDefault();
					}
					else if (ev.which == 8)  // код backspace
					{
						if ($(this).val().replace(' ', '', 'g').length == 0)
							backspaceCount++;
						if (backspaceCount == 1)
						{
							$editableArea.children('.taggerSelectedItem:last').addClass('taggerSelectedItemDark');
						}
						else if (backspaceCount == 2)
						{
							$editableArea.children('.taggerSelectedItem:last').remove();
							$editableArea.children('input:last').width(variantList.getFreeSpaceForInput());
							variantList.redrawListPosition();
							backspaceCount = 0;
						}
					}
					else if (ev.which == 40) { // стрелка вниз
						variantList.hoverNextItemInList();
					}
					else if (ev.which == 38) { // стрелка вверх
						variantList.hoverPrevItemInList();
					}
					if (!variantList.isShowed())
						variantList.show();
				})

			var $editableArea = $('<div />').css({
				width: options.editableArea.width,
				padding: options.editableArea.padding,
				minHeight: options.editableArea.minHeight,
				backgroundColor: options.editableArea.backgroundColor,
				borderColor: options.editableArea.borderColor,
				borderStyle: options.editableArea.borderStyle,
				borderWidth: options.editableArea.borderWidth
			});

			var $newInput = false;
			$(this).replaceWith($editableArea);

			var variantList = {
				list: $('<div id="testID"></div>').css({
					position: 'absolute',
					display: 'none',
					width: ($editableArea.outerWidth() - options.variantList.shiftToRight*2 - parseInt(options.variantList.borderWidth, 10)*2) + 'px',
					height: '200px',
					borderColor: options.variantList.borderColor,
					borderWidth: options.variantList.borderWidth,
					borderStyle: options.variantList.borderStyle,
					backgroundColor: 'white',
					overflowY: 'scroll'
				}),
				show: function() {
					this.redrawListPosition();
					this.list.css('display', 'block');
				},
				isShowed: function() {
					return (this.list.css('display') == 'block');
				},
				hide: function() {
					this.list.css('display', 'none');
				},
				createListItem: function(key, value) {

					var self = this;
					return $('<div>'+value+'</div>')
						.addClass('taggerListItem')
						.attr('variant_list_item_identificator', key)
						.click(function(){
							self.insert($(this).html(), $(this).attr('variant_list_item_identificator'));
							$(this).css('display', 'none');
							delete originalList[key];
						})
						.hover(
							function() {
								$(this).addClass('taggerListItemHovered');
							},
							function() {
								self.unhoverItemInList();
							}
						);
				},
				create: function(items) {

					$newInput = $input.clone(true).width('95%');
					$editableArea.append($newInput);
					for(var i in items)
						this.list.append(this.createListItem(i, items[i]));
				},
				redrawListPosition: function() {
					this.list.css('top',
						$editableArea.offset().top+
						$editableArea.outerHeight()
					);
					this.list.css('left',
						$editableArea.offset().left + options.variantList.shiftToRight // сдвиг на 1px вправо под editableArea
					);
				},
				redrawListItems: function(collection) {
					this.list.html('');
					for(var i in collection)
						this.list.append(this.createListItem(i, collection[i]));
				},
				insert: function(value, id) {
					var self = this;
					var $boxX = $("<span />")
						.addClass('taggerSelectedItemX')
						.click(function(){
							var key = parseInt($(this).closest('div').attr('variant_list_item_identificator'), 10);
							variantList.list.children('div [variant_list_item_identificator='+(key)+']').css('display', 'block');
							$(this).closest('div').remove();
						});
					$editableArea.children(':last').remove();
					$editableArea.children(':last').remove()
					var $selectedItem = $('<div class="taggerCommonHeight taggerSelectedItem">'+value+'</div>');
					if (id)
						$selectedItem.attr('variant_list_item_identificator', id);
					$selectedItem.append($boxX.clone(true));
					$editableArea.append($selectedItem);

					$newInput = $input.clone(true).width(this.getFreeSpaceForInput());
					$editableArea.append($newInput);

					$editableArea.append($('<div class="taggerClearBoth"></div>'));
					$newInput.focus();
					this.list.hide();
				},
				getFreeSpaceForInput: function() {

					var width;

					if ($editableArea.children('.taggerSelectedItem:last').length) {
						var lastSelectedItemRightBorder =
							$editableArea.children('.taggerSelectedItem:last').offset().left +
							$editableArea.children('.taggerSelectedItem:last').width() +
							parseInt($editableArea.children('.taggerSelectedItem:last').css('padding-right'), 10) +
							parseInt($editableArea.children('.taggerSelectedItem:last').css('padding-left'), 10);

						var editableAreaRightBorder = $editableArea.offset().left+$editableArea.width();
						width = editableAreaRightBorder - lastSelectedItemRightBorder - 15;
						if (width < 15)
							width = '95%';
					}
					else {
						width = '95%';
					}
					return width;
				},
				/**
				 * Находит все элементы списка originalList, совпадающие с needle и возвращает этот список.
				 * @param needle
				 * @return object{key, itemText}
				 */
				findOccurenceInOriginalList: function(needle) {
					var result = {};
					for(var i in originalList) {
						if (originalList[i].toLowerCase().indexOf(needle) != -1)
							result[i] = originalList[i];
					}
					return result;
				},
				deleteInsertedTeg: function($teg) {
					var key = parseInt($teg.attr('variant_list_item_identificator'), 10);
					variantList.list.children('div [variant_list_item_identificator='+(key)+']').css('display', 'block');
					$teg.remove();
				},
				hoverNextItemInList: function() {
					if (variantList.list.children(':visible.taggerListItemHovered').length) {
						console.log('fuck')
						$nextItem = variantList.list.children(':visible.taggerListItemHovered').nextAll(':visible:first')
					} else {
						$nextItem = variantList.list.children(':visible:first');
					}
					this.unhoverItemInList();
					$nextItem.addClass('taggerListItemHovered');
				},
				hoverPrevItemInList: function() {
					if (variantList.list.children(':visible.taggerListItemHovered').length) {
						$prevItem = variantList.list.children(':visible.taggerListItemHovered').prevAll(':visible:first')
					} else {
						return false;
					}
					this.unhoverItemInList();
					$prevItem.addClass('taggerListItemHovered');
				},
				unhoverItemInList: function() {
					variantList.list.children('.taggerListItemHovered').removeClass('taggerListItemHovered');
				}
			};

			variantList.create(originalList);
			$('body').append(variantList.list);

			// our element blur emulation
			$(document).click(function(ev){
				if($newInput[0] != ev.target && variantList.isShowed())
					variantList.hide();
			});

			$(window).resize(function() {
				variantList.redrawListPosition();
			});
		});
	};
})(jQuery);

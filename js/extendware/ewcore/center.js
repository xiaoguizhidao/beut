Element.addMethods({
	center: function (element, parent, limitX, limitY, refParent)
	{
		element = $(element);
		var elementDims = element.getDimensions();
		
		var viewPort = {};
		var offsets = {};
		if (!parent) {
			viewPort = document.viewport.getDimensions();
			offsets = document.viewport.getScrollOffsets();
		} else {
			viewPort = $(parent).getDimensions();
			offsets = $(parent).cumulativeOffset(); 
		}
		
		if ($(refParent)) {
			var po = $(refParent).cumulativeOffset();
			offsets[0] = offsets[0] - po[0];
			offsets[1] = offsets[1] - po[1];

		}
		var centerX = viewPort.width / 2 + offsets[0] - elementDims.width / 2;
		var centerY = viewPort.height / 2 + offsets[1] - elementDims.height / 2;
		if (limitX && centerX < limitX) {
			centerX = parseInt(limitX);
		}
		if (limitY && centerY < limitY) {
			centerY = parseInt(limitY);
		}
		
		element.setStyle({ position: 'absolute', top: Math.floor(centerY) + 'px', left: Math.floor(centerX) + 'px' });
		
		return element;			
	}
});
/**
 * $Id: Dialogs.js,v 1.27 2014/02/10 11:46:24 gaudenz Exp $
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Constructs a new dialog.
 */
function Dialog(editorUi, elt, w, h, modal, closable, onClose)
{
	var dx = 0;
	
	if (mxClient.IS_VML && (document.documentMode == null || document.documentMode < 8))
	{
		// Adds padding as a workaround for box model in older IE versions
		// This needs to match the total padding of geDialog in CSS
		dx = 80;
	}

	w += dx;
	h += dx;
	
	var left = Math.max(0, Math.round((document.body.scrollWidth - w) / 2));
	var top = Math.max(0, Math.round((Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - h) / 3));
	
	var div = editorUi.createDiv('geDialog');
	div.style.width = w + 'px';
	div.style.height = h + 'px';
	div.style.left = left + 'px';
	div.style.top = top + 'px';
	
	if (this.bg == null)
	{
		this.bg = editorUi.createDiv('background');
		this.bg.style.position = 'absolute';
		this.bg.style.background = 'white';
		this.bg.style.left = '0px';
		this.bg.style.top = '0px';
		this.bg.style.bottom = '0px';
		this.bg.style.right = '0px';
		
		mxUtils.setOpacity(this.bg, this.bgOpacity);
		
		if (mxClient.IS_QUIRKS)
		{
			new mxDivResizer(this.bg);
		}
	}

	if (modal)
	{
		document.body.appendChild(this.bg);
	}
	
	div.appendChild(elt);
	document.body.appendChild(div);
	
	if (closable)
	{
		var img = document.createElement('img');

		img.setAttribute('src', IMAGE_PATH + '/close.png');
		img.setAttribute('title', mxResources.get('close'));
		img.className = 'geDialogClose';
		img.style.top = (top + 14) + 'px';
		img.style.left = (left + w + 38 - dx) + 'px';
		
		mxEvent.addListener(img, 'click', mxUtils.bind(this, function()
		{
			editorUi.hideDialog(true);
		}));
		
		document.body.appendChild(img);
		this.dialogImg = img;
	}
	
	this.onDialogClose = onClose;
	this.container = div;
};

/**
 * Removes the dialog from the DOM.
 */
Dialog.prototype.bgOpacity = 80;

/**
 * Removes the dialog from the DOM.
 */
Dialog.prototype.close = function(cancel)
{
	if (this.onDialogClose != null)
	{
		this.onDialogClose(cancel);
		this.onDialogClose = null;
	}
	
	if (this.dialogImg != null)
	{
		this.dialogImg.parentNode.removeChild(this.dialogImg);
		this.dialogImg = null;
	}
	
	this.container.parentNode.removeChild(this.container);
	this.bg.parentNode.removeChild(this.bg);
};

/**
 * Constructs a new open dialog.
 */
function OpenDialog()
{
	var iframe = document.createElement('iframe');
	iframe.style.backgroundColor = 'transparent';
	iframe.allowTransparency = 'true';
	iframe.style.borderStyle = 'none';
	iframe.style.borderWidth = '0px';
	iframe.style.overflow = 'hidden';
	iframe.frameBorder = '0';
	
	// Adds padding as a workaround for box model in older IE versions
	var dx = (mxClient.IS_VML && (document.documentMode == null || document.documentMode < 8)) ? 20 : 0;
	
	iframe.setAttribute('width', (320 + dx) + 'px');
	iframe.setAttribute('height', (190 + dx) + 'px');
	iframe.setAttribute('src', OPEN_FORM);
	
	this.container = iframe;
};

/**
 * Constructs a new color dialog.
 */
function ColorDialog(editorUi, color, apply, cancelFn)
{
	this.editorUi = editorUi;
	
	var input = document.createElement('input');
	input.style.marginBottom = '10px';
	input.style.width = '216px';
	
	// Required for picker to render in IE
	if (mxClient.IS_IE)
	{
		input.style.marginTop = '10px';
		document.body.appendChild(input);
	}
	
	this.init = function()
	{
		if (!mxClient.IS_TOUCH)
		{
			input.focus();
		}
	};

	var picker = new jscolor.color(input);
	picker.pickerOnfocus = false;
	picker.showPicker();

	var div = document.createElement('div');
	jscolor.picker.box.style.position = 'relative';
	jscolor.picker.box.style.width = '230px';
	jscolor.picker.box.style.height = '100px';
	jscolor.picker.box.style.paddingBottom = '10px';
	div.appendChild(jscolor.picker.box);

	var center = document.createElement('center');
	
	function addPresets(presets, rowLength)
	{
		rowLength = (rowLength != null) ? rowLength : 12;
		var table = document.createElement('table');
		table.style.borderCollapse = 'collapse';
		table.setAttribute('cellspacing', '0');
		table.style.marginBottom = '20px';
		table.style.cellSpacing = '0px';
		var tbody = document.createElement('tbody');
		table.appendChild(tbody);

		var rows = presets.length / rowLength;
		
		for (var row = 0; row < rows; row++)
		{
			var tr = document.createElement('tr');
			
			for (var i = 0; i < rowLength; i++)
			{
				(function(clr)
				{
					var td = document.createElement('td');
					td.style.border = '1px solid black';
					td.style.padding = '0px';
					td.style.width = '16px';
					td.style.height = '16px';
					
					if (clr == 'none')
					{
						td.style.background = 'url(\'' + IMAGE_PATH + '/nocolor.png' + '\')';
					}
					else
					{
						td.style.backgroundColor = '#' + clr;
					}
					
					tr.appendChild(td);
					
					mxEvent.addListener(td, 'click', function()
					{
						if (clr == 'none')
						{
							picker.fromString('ffffff');
							input.value = 'none';
						}
						else
						{
							picker.fromString(clr);
						}
					});
				})(presets[row * rowLength + i]);
			}
			
			tbody.appendChild(tr);
		}
		
		center.appendChild(table);
		
		return table;
	};

	div.appendChild(input);
	mxUtils.br(div);
	
	// Adds presets
	var table = addPresets(['E6D0DE', 'CDA2BE', 'B5739D', 'E1D5E7', 'C3ABD0', 'A680B8', 'D4E1F5', 'A9C4EB', '7EA6E0', 'D5E8D4', '9AC7BF', '67AB9F', 'D5E8D4', 'B9E0A5', '97D077', 'FFF2CC', 'FFE599', 'FFD966', 'FFF4C3', 'FFCE9F', 'FFB570', 'F8CECC', 'F19C99', 'EA6B66'], 12);
	table.style.marginBottom = '8px';
	table = addPresets(['none', 'FFFFFF', 'E6E6E6', 'CCCCCC', 'B3B3B3', '999999', '808080', '666666', '4D4D4D', '333333', '1A1A1A', '000000', 'FFCCCC', 'FFE6CC', 'FFFFCC', 'E6FFCC', 'CCFFCC', 'CCFFE6', 'CCFFFF', 'CCE5FF', 'CCCCFF', 'E5CCFF', 'FFCCFF', 'FFCCE6', 'FF9999', 'FFCC99', 'FFFF99', 'CCFF99', '99FF99', '99FFCC', '99FFFF', '99CCFF', '9999FF', 'CC99FF', 'FF99FF', 'FF99CC', 'FF6666', 'FFB366', 'FFFF66', 'B3FF66', '66FF66', '66FFB3', '66FFFF', '66B2FF', '6666FF', 'B266FF', 'FF66FF', 'FF66B3', 'FF3333', 'FF9933', 'FFFF33', '99FF33', '33FF33', '33FF99', '33FFFF', '3399FF', '3333FF', '9933FF', 'FF33FF', 'FF3399', 'FF0000', 'FF8000', 'FFFF00', '80FF00', '00FF00', '00FF80', '00FFFF', '007FFF', '0000FF', '7F00FF', 'FF00FF', 'FF0080', 'CC0000', 'CC6600', 'CCCC00', '66CC00', '00CC00', '00CC66', '00CCCC', '0066CC', '0000CC', '6600CC', 'CC00CC', 'CC0066', '990000', '994C00', '999900', '4D9900', '009900', '00994D', '009999', '004C99', '000099', '4C0099', '990099', '99004D', '660000', '663300', '666600', '336600', '006600', '006633', '006666', '003366', '000066', '330066', '660066', '660033', '330000', '331A00', '333300', '1A3300', '003300', '00331A', '003333', '001933', '000033', '190033', '330033', '33001A']);
	table.style.marginBottom = '16px';

	div.appendChild(center);

	var buttons = document.createElement('div');
	buttons.style.textAlign = 'right';
	buttons.style.whiteSpace = 'nowrap';
	
	var applyFunction = (apply != null) ? apply : this.createApplyFunction();
	
	buttons.appendChild(mxUtils.button(mxResources.get('apply'), function()
	{
		var color = input.value;
		
		if (color != 'none')
		{
			color = '#' + color;
		}
		
		applyFunction(color);
		editorUi.hideDialog();
	}));
	buttons.appendChild(mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
		
		if (cancelFn != null)
		{
			cancelFn();
		}
	}));
	
	if (color != null)
	{
		if (color == 'none')
		{
			picker.fromString('ffffff');
			input.value = 'none';
		}
		else
		{
			picker.fromString(color);
		}
	}
	
	div.appendChild(buttons);
	this.picker = picker;
	this.colorInput = input;
	this.container = div;
};

/* Creates function to apply value */
ColorDialog.prototype.createApplyFunction = function()
{
	return mxUtils.bind(this, function(color)
	{
		this.editorUi.editor.graph.setCellStyles(this.currentColorKey, (color == 'none') ? 'none' : color);
	});
};

/**
 * Constructs a new about dialog.
 */
function AboutDialog(editorUi)
{
	var div = document.createElement('div');
	div.setAttribute('align', 'center');
	var h3 = document.createElement('h3');
	mxUtils.write(h3, mxResources.get('about') + ' GraphEditor');
	div.appendChild(h3);
	var img = document.createElement('img');
	img.style.border = '0px';
	img.setAttribute('width', '176');
	img.setAttribute('width', '151');
	img.setAttribute('src', IMAGE_PATH + '/logo.png');
	div.appendChild(img);
	mxUtils.br(div);
	mxUtils.write(div, 'Powered by mxGraph ' + mxClient.VERSION);
	mxUtils.br(div);
	var link = document.createElement('a');
	link.setAttribute('href', 'http://www.jgraph.com/');
	link.setAttribute('target', '_blank');
	mxUtils.write(link, 'www.jgraph.com');
	div.appendChild(link);
	mxUtils.br(div);
	mxUtils.br(div);
	div.appendChild(mxUtils.button(mxResources.get('close'), function()
	{
		editorUi.hideDialog();
	}));
	
	this.container = div;
};

/**
 * Constructs a new page setup dialog.
 */
function PageSetupDialog(editorUi)
{
	// Defines possible page sizes. Needs to be lazy initialized to add any translations.
	if (PageSetupDialog.formats == null)
	{
		PageSetupDialog.formats = [{key: 'a3', title: 'A3 (297 mm x 420 mm)', format: new mxRectangle(0, 0, 1169, 1652)},
		                           {key: 'a4', title: 'A4 (210 mm x 297 mm)', format: mxConstants.PAGE_FORMAT_A4_PORTRAIT},
		                           {key: 'a5', title: 'A5 (148 mm x 210 mm)', format: new mxRectangle(0, 0, 584, 826)},
		                           {key: 'letter', title: 'US-Letter (8,5" x 11")', format: mxConstants.PAGE_FORMAT_LETTER_PORTRAIT},
		                           {key: 'tabloid', title: 'US-Tabloid (279 mm x 432 mm)', format: new mxRectangle(0, 0, 1100, 1700)},
		                           {key: 'custom', title: mxResources.get('custom'), format: null}];
	}

	var graph = editorUi.editor.graph;
	var row, td;

	var table = document.createElement('table');
	table.style.width = '100%';
	table.style.height = '100%';
	var tbody = document.createElement('tbody');
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('paperSize') + ':');
	
	row.appendChild(td);

	var portraitCheckBox = document.createElement('input');
	portraitCheckBox.setAttribute('name', 'format');
	portraitCheckBox.setAttribute('type', 'radio');
	
	var landscapeCheckBox = document.createElement('input');
	landscapeCheckBox.setAttribute('name', 'format');
	landscapeCheckBox.setAttribute('type', 'radio');

	var formatRow = document.createElement('tr');
	formatRow.style.display = 'none';
	
	var customRow = document.createElement('tr');
	customRow.style.display = 'none';
	
	// Adds all papersize options
	var paperSizeSelect = document.createElement('select');
	var detected = false;
	var pf = new Object();

	for (var i = 0; i < PageSetupDialog.formats.length; i++)
	{
		var f = PageSetupDialog.formats[i];
		pf[f.key] = f;

		var paperSizeOption = document.createElement('option');
		paperSizeOption.setAttribute('value', f.key);
		mxUtils.write(paperSizeOption, f.title);
		paperSizeSelect.appendChild(paperSizeOption);
		
		if (f.format != null)
		{
			if (graph.pageFormat.width == f.format.width && graph.pageFormat.height == f.format.height)
			{
				paperSizeOption.setAttribute('selected', 'selected');
				portraitCheckBox.setAttribute('checked', 'checked');
				formatRow.style.display = '';
				detected = true;
			}
			else if (graph.pageFormat.width == f.format.height && graph.pageFormat.height == f.format.width)
			{
				paperSizeOption.setAttribute('selected', 'selected');
				landscapeCheckBox.setAttribute('checked', 'checked');
				formatRow.style.display = '';
				detected = true;
			}
		}
		// Selects custom format which is last in list
		else if (!detected)
		{
			paperSizeOption.setAttribute('selected', 'selected');
			customRow.style.display = '';
		}
	}

	td = document.createElement('td');
	td.style.fontSize = '10pt';
	td.appendChild(paperSizeSelect);
	row.appendChild(td);
	
	tbody.appendChild(row);
	
	formatRow = document.createElement('tr');
	formatRow.style.height = '60px';
	td = document.createElement('td');
	formatRow.appendChild(td);

	td = document.createElement('td');
	td.style.fontSize = '10pt';

	td.appendChild(portraitCheckBox);
	mxUtils.write(td, ' ' + mxResources.get('portrait'));
	
	landscapeCheckBox.style.marginLeft = '10px';
	td.appendChild(landscapeCheckBox);
	mxUtils.write(td, ' ' + mxResources.get('landscape'));

	formatRow.appendChild(td);
	
	tbody.appendChild(formatRow);
	row = document.createElement('tr');
	
	td = document.createElement('td');
	customRow.appendChild(td);

	td = document.createElement('td');
	td.style.fontSize = '10pt';
	
	var widthInput = document.createElement('input');
	widthInput.setAttribute('size', '6');
	widthInput.setAttribute('value', graph.pageFormat.width);
	td.appendChild(widthInput);
	mxUtils.write(td, ' x ');
	
	var heightInput = document.createElement('input');
	heightInput.setAttribute('size', '6');
	heightInput.setAttribute('value', graph.pageFormat.height);
	td.appendChild(heightInput);
	mxUtils.write(td, ' Pixel');
	
	customRow.appendChild(td);
	customRow.style.height = '60px';
	tbody.appendChild(customRow);
	
	var updateInputs = function()
	{
		var f = pf[paperSizeSelect.value];
		
		if (f.format != null)
		{
			widthInput.value = f.format.width;
			heightInput.value = f.format.height;
			customRow.style.display = 'none';
			formatRow.style.display = '';
		}
		else
		{
			formatRow.style.display = 'none';
			customRow.style.display = '';
		}
	};
	
	mxEvent.addListener(paperSizeSelect, 'change', updateInputs);
	updateInputs();
	
	row = document.createElement('tr');
	td = document.createElement('td');
	td.colSpan = 2;
	td.setAttribute('align', 'right');

	td.appendChild(mxUtils.button(mxResources.get('apply'), function()
	{
		editorUi.hideDialog();
		var ls = landscapeCheckBox.checked;
		var f = pf[paperSizeSelect.value];
		var size = f.format;
		
		if (size == null)
		{
			size = new mxRectangle(0, 0, parseInt(widthInput.value), parseInt(heightInput.value));
		}
		
		if (ls)
		{
			size = new mxRectangle(0, 0, size.height, size.width);
		}
		
		editorUi.setPageFormat(size);
	}));

	td.appendChild(mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	}));
	
	row.appendChild(td);
	tbody.appendChild(row);
	
	tbody.appendChild(row);
	table.appendChild(tbody);
	this.container = table;
};

/**
 * Constructs a new print dialog.
 */
function PrintDialog(editorUi)
{
	var graph = editorUi.editor.graph;
	var row, td;
	
	var table = document.createElement('table');
	table.style.width = '100%';
	table.style.height = '100%';
	var tbody = document.createElement('tbody');

	row = document.createElement('tr');
	
	var pageCountCheckBox = document.createElement('input');
	pageCountCheckBox.setAttribute('type', 'checkbox');
	td = document.createElement('td');
	td.style.paddingRight = '10px';
	td.style.fontSize = '10pt';
	td.appendChild(pageCountCheckBox);
	mxUtils.write(td, ' ' + mxResources.get('posterPrint') + ':');
	row.appendChild(td);
	
	var pageCountInput = document.createElement('input');
	pageCountInput.setAttribute('value', '1');
	pageCountInput.setAttribute('type', 'number');
	pageCountInput.setAttribute('min', '1');
	pageCountInput.setAttribute('size', '4');
	pageCountInput.setAttribute('disabled', 'disabled');
	pageCountInput.style.width = '50px';

	td = document.createElement('td');
	td.style.fontSize = '10pt';
	td.appendChild(pageCountInput);
	mxUtils.write(td, ' ' + mxResources.get('pages') + ' (max)');
	row.appendChild(td);
	tbody.appendChild(row);

	mxEvent.addListener(pageCountCheckBox, 'change', function()
	{
		if (pageCountCheckBox.checked)
		{
			pageCountInput.removeAttribute('disabled');
		}
		else
		{
			pageCountInput.setAttribute('disabled', 'disabled');
		}
	});
	
	row = document.createElement('tr');
	td = document.createElement('td');
	td.colSpan = 2;
	td.style.paddingTop = '40px';
	td.setAttribute('align', 'right');
	
	function preview(print)
	{
		var pf = graph.pageFormat || mxConstants.PAGE_FORMAT_A4_PORTRAIT;
		
		var scale = 1 / graph.pageScale;
		
		if (pageCountCheckBox.checked)
		{
    		var pageCount = parseInt(pageCountInput.value);
			
			if (!isNaN(pageCount))
			{
				scale = mxUtils.getScaleForPageCount(pageCount, graph, pf);
			}
		}

		// Negative coordinates are cropped or shifted if page visible
		var gb = graph.getGraphBounds();
		var autoOrigin = pageCountCheckBox.checked;
		var border = 0;
		var x0 = 0;
		var y0 = 0;
		
		// Computes unscaled, untranslated graph bounds
		var x = (gb.width > 0) ? gb.x / graph.view.scale - graph.view.translate.x : 0;
		var y = (gb.height > 0) ? gb.y / graph.view.scale - graph.view.translate.y : 0;

		if (x < 0 || y < 0)
		{
			autoOrigin = true;
			
			if (graph.pageVisible)
			{
				var ps = graph.pageScale;
				var pw = pf.width * ps;
				var ph = pf.height * ps;

				x0 = (x > 0) ? x : pf.width * -Math.floor(Math.min(0, x) / pw) + Math.min(0, x) / graph.pageScale;
				y0 = (y > 0) ? y : pf.height * -Math.floor(Math.min(0, y) / ph) + Math.min(0, y) / graph.pageScale;
			}
			else
			{
				x0 = 10;
				y0 = 10;
			}
		}

		return PrintDialog.showPreview(PrintDialog.createPrintPreview(graph, scale, pf, border, x0, y0, autoOrigin, print), print);
	};

	td.appendChild(mxUtils.button(mxResources.get('print'), function()
	{
		editorUi.hideDialog();
		preview(true);
	}));

	td.appendChild(mxUtils.button(mxResources.get('preview'), function()
	{
		editorUi.hideDialog();
		preview(false);
	}));
	
	td.appendChild(mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	}));
	
	row.appendChild(td);
	tbody.appendChild(row);
	
	tbody.appendChild(row);
	table.appendChild(tbody);
	this.container = table;
};

/**
 * Constructs a new print dialog.
 */
PrintDialog.showPreview = function(preview, print)
{
	var result = preview.open();
	
	if (print)
	{
		result.print();
	}
	
	return result;
};

/**
 * Constructs a new print dialog.
 */
PrintDialog.createPrintPreview = function(graph, scale, pf, border, x0, y0, autoOrigin)
{
	var preview = new mxPrintPreview(graph, scale, pf, border, x0, y0);
	preview.title = mxResources.get('preview');
	preview.printBackgroundImage = true;
	preview.autoOrigin = autoOrigin;
	
	return preview;
};

/**
 * Constructs a new filename dialog.
 */
function FilenameDialog(editorUi, filename, buttonText, fn, label)
{
	var row, td;
	
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	td.style.width = '120px';
	mxUtils.write(td, (label || mxResources.get('filename')) + ':');
	
	row.appendChild(td);
	
	var nameInput = document.createElement('input');
	nameInput.setAttribute('value', filename || '');
	nameInput.style.width = '180px';
	
	this.init = function()
	{
		nameInput.focus();
	};

	td = document.createElement('td');
	td.appendChild(nameInput);
	row.appendChild(td);
	
	tbody.appendChild(row);

	row = document.createElement('tr');
	td = document.createElement('td');
	td.colSpan = 2;
	td.style.paddingTop = '20px';
	td.style.whiteSpace = 'nowrap';
	td.setAttribute('align', 'right');

	var genericBtn = mxUtils.button(buttonText, function()
	{
		editorUi.hideDialog();
		fn(nameInput.value);
	});
	
	td.appendChild(genericBtn);
	
	td.appendChild(mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	}));
	
	row.appendChild(td);
	tbody.appendChild(row);
	
	tbody.appendChild(row);
	table.appendChild(tbody);
	this.container = table;
};

/**
 * Constructs a new textarea dialog.
 */
function TextareaDialog(editorUi, title, url, fn, cancelFn)
{
	var row, td;
	
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	td.style.width = '100px';
	mxUtils.write(td, title);
	
	row.appendChild(td);
	tbody.appendChild(row);

	row = document.createElement('tr');
	td = document.createElement('td');
	
	var nameInput = document.createElement('textarea');
	mxUtils.write(nameInput, url || '');
	nameInput.style.width = '300px';
	nameInput.style.height = '100px';
	
	this.init = function()
	{
		nameInput.focus();
	};

	td = document.createElement('td');
	td.appendChild(nameInput);
	row.appendChild(td);
	
	tbody.appendChild(row);

	row = document.createElement('tr');
	td = document.createElement('td');
	td.style.paddingTop = '20px';
	td.style.whiteSpace = 'nowrap';
	td.setAttribute('align', 'right');

	var genericBtn = mxUtils.button(mxResources.get('apply'), function()
	{
		editorUi.hideDialog();
		fn(nameInput.value);
	});
	
	td.appendChild(genericBtn);
	
	td.appendChild(mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
		
		if (cancelFn != null)
		{
			cancelFn();
		}
	}));
	
	row.appendChild(td);
	tbody.appendChild(row);
	
	tbody.appendChild(row);
	table.appendChild(tbody);
	this.container = table;
};

/**
 * Constructs a new edit file dialog.
 */
function EditFileDialog(editorUi)
{
	var div = document.createElement('div');
	div.style.textAlign = 'right';
	var textarea = document.createElement('textarea');
	textarea.style.width = '600px';
	textarea.style.height = '374px';
	
	textarea.value = mxUtils.getPrettyXml(editorUi.editor.getGraphXml());
	div.appendChild(textarea);
	
	// Enables dropping files
	if (fileSupport)
	{
		function handleDrop(evt)
		{
		    evt.stopPropagation();
		    evt.preventDefault();
		    
		    if (evt.dataTransfer.files.length > 0)
		    {
    			var file = evt.dataTransfer.files[0];
    			
				var reader = new FileReader();
				reader.onload = function(e)
				{
					textarea.value = e.target.result;
				};
				reader.readAsText(file);
    		}
		};
		
		function handleDragOver(evt)
		{
			evt.stopPropagation();
			evt.preventDefault();
		};

		// Setup the dnd listeners.
		textarea.addEventListener('dragover', handleDragOver, false);
		textarea.addEventListener('drop', handleDrop, false);
	}
	
	var select = document.createElement('select');
	select.style.width = '180px';

	var newOption = document.createElement('option');
	newOption.setAttribute('value', 'new');
	mxUtils.write(newOption, mxResources.get('openInNewWindow'));
	select.appendChild(newOption);

	var replaceOption = document.createElement('option');
	replaceOption.setAttribute('value', 'replace');
	mxUtils.write(replaceOption, mxResources.get('replaceExistingDrawing'));
	select.appendChild(replaceOption);
	
	var importOption = document.createElement('option');
	importOption.setAttribute('value', 'import');
	mxUtils.write(importOption, mxResources.get('addToExistingDrawing'));
	select.appendChild(importOption);
	
	div.appendChild(select);

	div.appendChild(mxUtils.button(mxResources.get('ok'), function()
	{
		// Removes all illegal control characters before parsing
		var data = editorUi.editor.graph.zapGremlins(textarea.value);
		
		if (select.value == 'new')
		{
			window.openFile = new OpenFile(function()
			{
				editorUi.hideDialog();
				window.openFile = null;
			});
			
			window.openFile.setData(data, null);
			window.open(editorUi.getUrl());
		}
		else if (select.value == 'replace')
		{
			try
			{
				var doc = mxUtils.parseXml(data); 
				editorUi.editor.setGraphXml(doc.documentElement);
				editorUi.hideDialog();
			}
			catch (e)
			{
				mxUtils.alert(e.message);
			}
		}
		else if (select.value == 'import')
		{
			var doc = mxUtils.parseXml(data);
			var model = new mxGraphModel();
			var codec = new mxCodec(doc);
			codec.decode(doc.documentElement, model);
			
			var children = model.getChildren(model.getChildAt(model.getRoot(), 0));
			editorUi.editor.graph.setSelectionCells(editorUi.editor.graph.importCells(children));
			
			editorUi.hideDialog();
		}
	}));
	
	div.appendChild(mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	}));
	
	this.container = div;
};

/**
 * Constructs a new export dialog.
 */
function ExportDialog(editorUi)
{
	var graph = editorUi.editor.graph;
	var bounds = graph.getGraphBounds();
	var scale = graph.view.scale;
	
	var width = Math.ceil(bounds.width / scale);
	var height = Math.ceil(bounds.height / scale);

	var row, td;
	
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	td.style.width = '100px';
	mxUtils.write(td, mxResources.get('filename') + ':');
	
	row.appendChild(td);
	
	var nameInput = document.createElement('input');
	nameInput.setAttribute('value', editorUi.editor.getOrCreateFilename());
	nameInput.style.width = '180px';

	td = document.createElement('td');
	td.appendChild(nameInput);
	row.appendChild(td);
	
	tbody.appendChild(row);
		
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('format') + ':');
	
	row.appendChild(td);
	
	var imageFormatSelect = document.createElement('select');
	imageFormatSelect.style.width = '180px';

	var pngOption = document.createElement('option');
	pngOption.setAttribute('value', 'png');
	mxUtils.write(pngOption, 'PNG - Portable Network Graphics');
	imageFormatSelect.appendChild(pngOption);

	var gifOption = document.createElement('option');
	gifOption.setAttribute('value', 'gif');
	mxUtils.write(gifOption, 'GIF - Graphics Interchange Format');
	imageFormatSelect.appendChild(gifOption);
	
	var jpgOption = document.createElement('option');
	jpgOption.setAttribute('value', 'jpg');
	mxUtils.write(jpgOption, 'JPG - JPEG File Interchange Format');
	imageFormatSelect.appendChild(jpgOption);

	var pdfOption = document.createElement('option');
	pdfOption.setAttribute('value', 'pdf');
	mxUtils.write(pdfOption, 'PDF - Portable Document Format');
	imageFormatSelect.appendChild(pdfOption);
	
	var svgOption = document.createElement('option');
	svgOption.setAttribute('value', 'svg');
	mxUtils.write(svgOption, 'SVG - Scalable Vector Graphics');
	imageFormatSelect.appendChild(svgOption);
	
	var xmlOption = document.createElement('option');
	xmlOption.setAttribute('value', 'xml');
	mxUtils.write(xmlOption, 'XML - Diagramly XML Document');
	imageFormatSelect.appendChild(xmlOption);

	td = document.createElement('td');
	td.appendChild(imageFormatSelect);
	row.appendChild(td);
	
	tbody.appendChild(row);

	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('backgroundColor') + ':');
	
	row.appendChild(td);
	
	var backgroundInput = document.createElement('input');
	backgroundInput.setAttribute('value', (graph.background || '#FFFFFF'));
	backgroundInput.style.width = '80px';

	var backgroundCheckbox = document.createElement('input');
	backgroundCheckbox.setAttribute('type', 'checkbox');

	td = document.createElement('td');
	td.appendChild(backgroundInput);
	td.appendChild(backgroundCheckbox);
	mxUtils.write(td, mxResources.get('transparent'));
	
	row.appendChild(td);
	
	tbody.appendChild(row);
	
	row = document.createElement('tr');

	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('width') + ':');
	
	row.appendChild(td);
	
	var widthInput = document.createElement('input');
	widthInput.setAttribute('value', width);
	widthInput.style.width = '180px';

	td = document.createElement('td');
	td.appendChild(widthInput);
	row.appendChild(td);

	tbody.appendChild(row);
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('height') + ':');
	
	row.appendChild(td);
	
	var heightInput = document.createElement('input');
	heightInput.setAttribute('value', height);
	heightInput.style.width = '180px';

	td = document.createElement('td');
	td.appendChild(heightInput);
	row.appendChild(td);

	tbody.appendChild(row);

	row = document.createElement('tr');

	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('borderWidth') + ':');
	
	row.appendChild(td);
	
	var borderInput = document.createElement('input');
	borderInput.setAttribute('value', width);
	borderInput.style.width = '180px';
	borderInput.value = '0';

	td = document.createElement('td');
	td.appendChild(borderInput);
	row.appendChild(td);

	tbody.appendChild(row);
	table.appendChild(tbody);
	
	// Handles changes in the export format
	function formatChanged()
	{
		var name = nameInput.value;
		var dot = name.lastIndexOf('.');
		
		if (dot > 0)
		{
			nameInput.value = name.substring(0, dot + 1) + imageFormatSelect.value;
		}
		else
		{
			nameInput.value = name + '.' + imageFormatSelect.value;
		}
		
		if (imageFormatSelect.value === 'xml')
		{
			widthInput.setAttribute('disabled', 'true');
			heightInput.setAttribute('disabled', 'true');
			borderInput.setAttribute('disabled', 'true');
		}
		else
		{
			widthInput.removeAttribute('disabled');
			heightInput.removeAttribute('disabled');
			borderInput.removeAttribute('disabled');
		}
		
		if (imageFormatSelect.value === 'png' || imageFormatSelect.value === 'svg')
		{
			backgroundCheckbox.removeAttribute('disabled');
		}
		else
		{
			backgroundCheckbox.setAttribute('disabled', 'disabled');
		}
	};
	
	mxEvent.addListener(imageFormatSelect, 'change', formatChanged);
	formatChanged();
	
	function checkValues()
	{
		if (widthInput.value * heightInput.value > MAX_AREA || widthInput.value <= 0)
		{
			widthInput.style.backgroundColor = 'red';
		}
		else
		{
			widthInput.style.backgroundColor = '';
		}
		
		if (widthInput.value * heightInput.value > MAX_AREA || heightInput.value <= 0)
		{
			heightInput.style.backgroundColor = 'red';
		}
		else
		{
			heightInput.style.backgroundColor = '';
		}
	};

	mxEvent.addListener(widthInput, 'change', function()
	{
		if (width > 0)
		{
			heightInput.value = Math.ceil(parseInt(widthInput.value) * height / width);
		}
		else
		{
			heightInput.value = '0';
		}
		
		checkValues();
	});

	mxEvent.addListener(heightInput, 'change', function()
	{
		if (height > 0)
		{
			widthInput.value = Math.ceil(parseInt(heightInput.value) * width / height);
		}
		else
		{
			widthInput.value = '0';
		}
		
		checkValues();
	});

	// Resuable image export instance
	var imgExport = new mxImageExport();
	
	function getSvg()
	{
		var b = Math.max(0, parseInt(borderInput.value)) + 1;
		var scale = parseInt(widthInput.value) / width;
		var bg = null;
	    
		if (backgroundInput.value != '' && backgroundInput.value != mxConstants.NONE && !backgroundCheckbox.checked)
		{
			bg = backgroundInput.value;
		}
		
		return mxUtils.getXml(editorUi.getSvg(bg, scale, b));
	};
	
	function getXml()
	{
		return mxUtils.getXml(editorUi.editor.getGraphXml());
	};

	row = document.createElement('tr');
	td = document.createElement('td');
	td.colSpan = 2;
	td.style.paddingTop = '10px';
	td.setAttribute('align', 'right');
	
	var saveBtn = mxUtils.button(mxResources.get('save'), mxUtils.bind(this, function()
	{
		if (parseInt(widthInput.value) <= 0 && parseInt(heightInput.value) <= 0)
		{
			mxUtils.alert(mxResources.get('drawingEmpty'));
		}
		else
		{
			var format = imageFormatSelect.value;
	    	var name = encodeURIComponent(nameInput.value);
	    	
	        if (format == 'xml')
	    	{
	        	var xml = encodeURIComponent(getXml());
				new mxXmlRequest(SAVE_URL, 'filename=' + name + '&xml=' + xml).simulate(document, '_blank');
	    	}
	        else if (format == 'svg')
	    	{
	        	var xml = getSvg();
				
				if (xml.length < MAX_REQUEST_SIZE)
				{
					xml = encodeURIComponent(xml);
					new mxXmlRequest(SAVE_URL, 'filename=' + name + '&format=' + format +
							'&xml=' + xml).simulate(document, '_blank');
				}
				else
				{
					mxUtils.alert(mxResources.get('drawingTooLarge'));
					mxUtils.popup(xml);
				}
	    	}
	        else
	        {
				var b = Math.max(0, parseInt(borderInput.value)) + 1;
				var scale = parseInt(widthInput.value) / width;
				var bounds = graph.getGraphBounds();
				var vs = graph.view.scale;
				
	        	// New image export
				var xmlDoc = mxUtils.createXmlDocument();
				var root = xmlDoc.createElement('output');
				xmlDoc.appendChild(root);
				
			    // Renders graph. Offset will be multiplied with state's scale when painting state.
				var xmlCanvas = new mxXmlCanvas2D(root);
				xmlCanvas.translate(Math.floor((b / scale - bounds.x) / vs), Math.floor((b / scale - bounds.y) / vs));
				xmlCanvas.scale(scale / vs);
			    imgExport.drawState(graph.getView().getState(graph.model.root), xmlCanvas);
			    
				// Puts request data together
				var w = Math.ceil(bounds.width * scale / vs + 2 * b);
				var h = Math.ceil(bounds.height * scale / vs + 2 * b);
				
				var xml = mxUtils.getXml(root);

				// Requests image if request is valid
				if (xml != null && xml.length <= MAX_REQUEST_SIZE && w > 0 && h > 0 && w * h < MAX_AREA)
				{
					var bg = '';
					
					if (backgroundInput.value != '' && backgroundInput.value != mxConstants.NONE &&
						(format != 'png' || !backgroundCheckbox.checked))
					{
						bg = '&bg=' + backgroundInput.value;
					}
					
					new mxXmlRequest(EXPORT_URL, 'filename=' + name + '&format=' + format +
	        			bg + '&w=' + w + '&h=' + h + '&xml=' + encodeURIComponent(xml)).
	        			simulate(document, '_blank');
				}
				else
				{
					mxUtils.alert(mxResources.get('drawingTooLarge'));
				}
	    	}
	        
			editorUi.hideDialog();
		}
	}));
	td.appendChild(saveBtn);
	td.appendChild(mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	}));
	
	row.appendChild(td);
	tbody.appendChild(row);
	table.appendChild(tbody);
	this.container = table;
};

/**
 * Constructs a new metadata dialog.
 */
function MetadataDialog(ui, cell)
{
	var div = document.createElement('div');

	div.style.height = '310px';
	div.style.overflow = 'auto';
	
	var value = ui.editor.graph.getModel().getValue(cell);
	
	// Converts the value to an XML node
	if (!mxUtils.isNode(value))
	{
		var doc = mxUtils.createXmlDocument();
		var obj = doc.createElement('object');
		obj.setAttribute('label', value || '');
		value = obj;
	}

	// Creates the dialog contents
	var form = new mxForm('properties');
	var attrs = value.attributes;
	var names = [];
	var texts = [];
	var count = 0;
	
	for (var i = 0; i < attrs.length; i++)
	{
		if (attrs[i].nodeName != 'label')
		{
			names[count] = attrs[i].nodeName;
			texts[count] = form.addTextarea(names[count], attrs[i].nodeValue, 2);
			count++;
		}
	}
	
	var nodata = document.createElement('div');
	mxUtils.write(nodata, mxResources.get('none'));
	div.appendChild(nodata);
	nodata.style.display = (attrs.length <= 1) ? '' : 'none';

	div.appendChild(form.table);
	
	// Adds buttons
	var addBtn = mxUtils.button(mxResources.get('addProperty') + '...', function()
	{
		var name = mxUtils.prompt(mxResources.get('enterPropertyName'));
		
		if (name != null && name.length > 0)
		{
			var idx = mxUtils.indexOf(names, name);
			
			if (idx >= 0)
			{
				texts[idx].focus();
			}
			else
			{
				try
				{
					// Checks if the name is valid
					var clone = value.cloneNode(false);
					clone.setAttribute(name, '');
					
					names.push(name);
					var text = form.addTextarea(name, '', 2);
					texts.push(text);
					text.focus();
					
					nodata.style.display = 'none';
				}
				catch (e)
				{
					mxUtils.alert(e);
				}
			}
		}
	});

	var applyBtn = mxUtils.button(mxResources.get('apply'), function()
	{
		try
		{
			ui.hideDialog.apply(ui, arguments);
			
			// Clones and updates the value
			value = value.cloneNode(true);
			
			for (var i = 0; i < names.length; i++)
			{
				value.setAttribute(names[i], texts[i].value);
			}
			
			// Updates the value of the cell (undoable)
			ui.editor.graph.getModel().setValue(cell, value);
		}
		catch (e)
		{
			mxUtils.alert(e);
		}
	});
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		ui.hideDialog.apply(ui, arguments);
	});
	
	var buttons = document.createElement('div');
	buttons.style.marginTop = '10px';
	buttons.style.textAlign = 'right';

	buttons.appendChild(addBtn);
	buttons.appendChild(applyBtn);
	buttons.appendChild(cancelBtn);

	div.appendChild(buttons);
	this.container = div;
};

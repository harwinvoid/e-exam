/**
 * $Id: Menus.js,v 1.31 2014/01/17 12:56:03 gaudenz Exp $
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Constructs a new graph editor
 */
Menus = function(editorUi)
{
	this.editorUi = editorUi;
	this.menus = new Object();
	this.init();
	
	// Pre-fetches checkmark image
	new Image().src = IMAGE_PATH + '/checkmark.gif';
};

/**
 * Adds the label menu items to the given menu and parent.
 */
Menus.prototype.defaultFonts = ['Helvetica', 'Verdana', 'Times New Roman', 'Garamond', 'Comic Sans MS',
           		             'Courier New', 'Georgia', 'Lucida Console', 'Tahoma'];

/**
 * Adds the label menu items to the given menu and parent.
 */
Menus.prototype.init = function()
{
	var graph = this.editorUi.editor.graph;
	var isGraphEnabled = mxUtils.bind(graph, graph.isEnabled);

	this.customFonts = [];

	this.put('fontFamily', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		for (var i = 0; i < this.defaultFonts.length; i++)
		{
			(mxUtils.bind(this, function(fontname)
			{
				var tr = this.styleChange(menu, fontname, [mxConstants.STYLE_FONTFAMILY], [fontname], null, parent, function()
				{
					document.execCommand('fontname', false, fontname);
				});
				tr.firstChild.nextSibling.style.fontFamily = fontname;
			}))(this.defaultFonts[i]);
		}

		menu.addSeparator(parent);
		
		if (this.customFonts.length > 0)
		{
			for (var i = 0; i < this.customFonts.length; i++)
			{
				(mxUtils.bind(this, function(fontname)
				{
					var tr = this.styleChange(menu, fontname, [mxConstants.STYLE_FONTFAMILY], [fontname], null, parent, function()
					{
						document.execCommand('fontname', false, fontname);
					});
					tr.firstChild.nextSibling.style.fontFamily = fontname;
				}))(this.customFonts[i]);
			}
			
			menu.addSeparator(parent);
			
			menu.addItem(mxResources.get('reset'), null, mxUtils.bind(this, function()
			{
				this.customFonts = [];
			}), parent);
			
			menu.addSeparator(parent);
		}
		
		this.promptChange(menu, mxResources.get('custom'), '', mxConstants.DEFAULT_FONTFAMILY, mxConstants.STYLE_FONTFAMILY, parent, true, mxUtils.bind(this, function(newValue)
		{
			this.customFonts.push(newValue);
		}));
	})));
	this.put('formatBlock', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		function addItem(label, tag)
		{
			return menu.addItem(label, null, mxUtils.bind(this, function()
			{
				// TODO: Check if visible
				graph.cellEditor.text2.focus();
	      		document.execCommand('formatBlock', false, '<' + tag + '>');
			}), parent);
		};
		
		addItem(mxResources.get('normal'), 'p');
		
		addItem('', 'h1').firstChild.nextSibling.innerHTML = '<h1 style="margin:0px;">' + mxResources.get('heading') + ' 1</h1>';
		addItem('', 'h2').firstChild.nextSibling.innerHTML = '<h2 style="margin:0px;">' + mxResources.get('heading') + ' 2</h2>';
		addItem('', 'h3').firstChild.nextSibling.innerHTML = '<h3 style="margin:0px;">' + mxResources.get('heading') + ' 3</h3>';
		addItem('', 'h4').firstChild.nextSibling.innerHTML = '<h4 style="margin:0px;">' + mxResources.get('heading') + ' 4</h4>';
		addItem('', 'h5').firstChild.nextSibling.innerHTML = '<h5 style="margin:0px;">' + mxResources.get('heading') + ' 5</h5>';
		addItem('', 'h6').firstChild.nextSibling.innerHTML = '<h6 style="margin:0px;">' + mxResources.get('heading') + ' 6</h6>';
		
		addItem('', 'pre').firstChild.nextSibling.innerHTML = '<pre style="margin:0px;">' + mxResources.get('formatted') + '</pre>';
		addItem('', 'blockquote').firstChild.nextSibling.innerHTML = '<blockquote style="margin-top:0px;margin-bottom:0px;">' + mxResources.get('blockquote') + '</blockquote>';
	})));
	this.put('fontSize', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		var sizes = [6, 8, 9, 10, 11, 12, 14, 18, 24, 36, 48, 72];
		
		for (var i = 0; i < sizes.length; i++)
		{
			(mxUtils.bind(this, function(fontsize)
			{
				this.styleChange(menu, fontsize, [mxConstants.STYLE_FONTSIZE], [fontsize], null, parent, function()
				{
					document.execCommand('fontSize', false, '3');
					
					// Changes the css font size of the first font element inside the in-place editor with size 3
					var elts = graph.cellEditor.text2.getElementsByTagName('font');
					
					for (var i = 0; i < elts.length; i++)
					{
						if (elts[i].getAttribute('size') == '3')
						{
							elts[i].removeAttribute('size');
							elts[i].style.fontSize = fontsize + 'px';
							
							break;
						}
					}
				});
			}))(sizes[i]);
		}

		menu.addSeparator(parent);
		this.promptChange(menu, mxResources.get('custom'), '(pt)', '12', mxConstants.STYLE_FONTSIZE, parent);
	})));
	this.put('linewidth', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		var sizes = [1, 2, 3, 4, 8, 12, 16, 24];
		
		for (var i = 0; i < sizes.length; i++)
		{
			this.styleChange(menu, sizes[i] + 'px', [mxConstants.STYLE_STROKEWIDTH], [sizes[i]], null, parent);
		}
		
		menu.addSeparator(parent);
		this.promptChange(menu, mxResources.get('custom') + '...', '(px)', '1', mxConstants.STYLE_STROKEWIDTH, parent);
	})));
	this.put('line', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		// LATER: Reset label position if geometry changes
		this.styleChange(menu, mxResources.get('straight'), [mxConstants.STYLE_EDGE], [null], null, parent);
		this.styleChange(menu, mxResources.get('entityRelation'), [mxConstants.STYLE_EDGE], ['entityRelationEdgeStyle'], null, parent);
		menu.addSeparator(parent);
		this.styleChange(menu, mxResources.get('horizontal'), [mxConstants.STYLE_EDGE, mxConstants.STYLE_ELBOW], ['elbowEdgeStyle', 'horizontal'], null, parent);
		this.styleChange(menu, mxResources.get('vertical'), [mxConstants.STYLE_EDGE, mxConstants.STYLE_ELBOW], ['elbowEdgeStyle', 'vertical'], null, parent);
		menu.addSeparator(parent);
		this.styleChange(menu, mxResources.get('manual'), [mxConstants.STYLE_EDGE], ['segmentEdgeStyle'], null, parent);
		this.styleChange(menu, mxResources.get('automatic'), [mxConstants.STYLE_EDGE], ['orthogonalEdgeStyle'], null, parent);
	})));
	this.put('lineend', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.styleChange(menu, mxResources.get('classic'), [mxConstants.STYLE_ENDARROW], [mxConstants.ARROW_CLASSIC], null, parent);
		this.styleChange(menu, mxResources.get('openArrow'), [mxConstants.STYLE_ENDARROW], [mxConstants.ARROW_OPEN], null, parent);
		this.styleChange(menu, mxResources.get('block') , [mxConstants.STYLE_ENDARROW], [mxConstants.ARROW_BLOCK], null, parent);
		menu.addSeparator(parent);
		this.styleChange(menu, mxResources.get('oval'), [mxConstants.STYLE_ENDARROW], [mxConstants.ARROW_OVAL], null, parent);
		this.styleChange(menu, mxResources.get('diamond'), [mxConstants.STYLE_ENDARROW], [mxConstants.ARROW_DIAMOND], null, parent);
		this.styleChange(menu, mxResources.get('diamondThin'), [mxConstants.STYLE_ENDARROW], [mxConstants.ARROW_DIAMOND_THIN], null, parent);
		menu.addSeparator(parent);
		this.styleChange(menu, mxResources.get('none'), [mxConstants.STYLE_ENDARROW], [mxConstants.NONE], null, parent);
		menu.addSeparator(parent);
		menu.addItem(mxResources.get('transparent'), null, function() { graph.toggleCellStyles('endFill', true); }, parent, null, true);
		menu.addSeparator(parent);
		this.promptChange(menu, mxResources.get('size') + '...', '(px)', mxConstants.DEFAULT_MARKERSIZE, mxConstants.STYLE_ENDSIZE, parent);
	})));
	this.put('linestart', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.styleChange(menu, mxResources.get('classic'), [mxConstants.STYLE_STARTARROW], [mxConstants.ARROW_CLASSIC], null, parent);
		this.styleChange(menu, mxResources.get('openArrow'), [mxConstants.STYLE_STARTARROW], [mxConstants.ARROW_OPEN], null, parent);
		this.styleChange(menu, mxResources.get('block'), [mxConstants.STYLE_STARTARROW], [mxConstants.ARROW_BLOCK], null, parent);
		menu.addSeparator(parent);
		this.styleChange(menu, mxResources.get('oval'), [mxConstants.STYLE_STARTARROW], [mxConstants.ARROW_OVAL], null, parent);
		this.styleChange(menu, mxResources.get('diamond'), [mxConstants.STYLE_STARTARROW], [mxConstants.ARROW_DIAMOND], null, parent);
		this.styleChange(menu, mxResources.get('diamondThin'), [mxConstants.STYLE_STARTARROW], [mxConstants.ARROW_DIAMOND_THIN], null, parent);
		menu.addSeparator(parent);
		this.styleChange(menu, mxResources.get('none'), [mxConstants.STYLE_STARTARROW], [mxConstants.NONE], null, parent);
		menu.addSeparator(parent);
		menu.addItem(mxResources.get('transparent'), null, function() { graph.toggleCellStyles('startFill', true); }, parent, null, true);
		menu.addSeparator(parent);
		this.promptChange(menu, mxResources.get('size') + '...', '(px)', mxConstants.DEFAULT_MARKERSIZE, mxConstants.STYLE_STARTSIZE, parent);
	})));
	this.put('spacing', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		// Uses shadow action and line menu to analyze selection
		var vertexSelected = this.editorUi.actions.get('shadow').enabled;
		var edgeSelected = this.get('line').enabled;
		
		if (vertexSelected || menu.showDisabled)
		{
			this.promptChange(menu, mxResources.get('top'), '(px)', '0', mxConstants.STYLE_SPACING_TOP, parent, vertexSelected);
			this.promptChange(menu, mxResources.get('right'), '(px)', '0', mxConstants.STYLE_SPACING_RIGHT, parent, vertexSelected);
			this.promptChange(menu, mxResources.get('bottom'), '(px)', '0', mxConstants.STYLE_SPACING_BOTTOM, parent, vertexSelected);
			this.promptChange(menu, mxResources.get('left'), '(px)', '0', mxConstants.STYLE_SPACING_LEFT, parent, vertexSelected);
			menu.addSeparator(parent);
			this.promptChange(menu, mxResources.get('global'), '(px)', '0', mxConstants.STYLE_SPACING, parent, vertexSelected);
			this.promptChange(menu, mxResources.get('perimeter'), '(px)', '0', mxConstants.STYLE_PERIMETER_SPACING, parent, vertexSelected);
		}

		if (edgeSelected || menu.showDisabled)
		{
			menu.addSeparator(parent);
			this.promptChange(menu, mxResources.get('sourceSpacing'), '(px)', '0', mxConstants.STYLE_SOURCE_PERIMETER_SPACING, parent, edgeSelected);
			this.promptChange(menu, mxResources.get('targetSpacing'), '(px)', '0', mxConstants.STYLE_TARGET_PERIMETER_SPACING, parent, edgeSelected);
		}
	})));
	this.put('format', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.addMenuItems(menu, ['fillColor'], parent);
		this.addSubmenu('gradient', menu, parent);
		this.addMenuItems(menu, ['-', 'shadow'], parent);
		this.promptChange(menu, mxResources.get('opacity'), '(%)', '100', mxConstants.STYLE_OPACITY, parent, this.get('format').enabled);
		this.addMenuItems(menu, ['-', 'curved', 'rounded', 'dashed', '-', 'strokeColor'], parent);
		this.addSubmenu('linewidth', menu, parent);
		this.addMenuItems(menu, ['-'], parent);
		this.addSubmenu('line', menu, parent);
		this.addMenuItems(menu, ['-'], parent);
		this.addSubmenu('linestart', menu, parent);
		this.addSubmenu('lineend', menu, parent);
		menu.addSeparator(parent);
		this.addMenuItem(menu, 'style', parent);
	})));
	this.put('gradient', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.addMenuItems(menu, ['gradientColor', '-'], parent);
		this.styleChange(menu, mxResources.get('north'), [mxConstants.STYLE_GRADIENT_DIRECTION], [mxConstants.DIRECTION_NORTH], null, parent);
		this.styleChange(menu, mxResources.get('east'), [mxConstants.STYLE_GRADIENT_DIRECTION], [mxConstants.DIRECTION_EAST], null, parent);
		this.styleChange(menu, mxResources.get('south'), [mxConstants.STYLE_GRADIENT_DIRECTION], [mxConstants.DIRECTION_SOUTH], null, parent);
		this.styleChange(menu, mxResources.get('west'), [mxConstants.STYLE_GRADIENT_DIRECTION], [mxConstants.DIRECTION_WEST], null, parent);
	})));
	this.put('text', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		var enabled = this.get('text').enabled;
		menu.addSeparator(parent);
		this.addMenuItem(menu, 'fontColor', parent);
		this.addMenuItems(menu, ['backgroundColor', 'borderColor', '-'], parent);
		this.addSubmenu('fontFamily', menu, parent);
		this.addSubmenu('fontSize', menu, parent);
		this.addMenuItems(menu, ['-', 'bold', 'italic', 'underline', '-'], parent);
	    this.addSubmenu('alignment', menu, parent);
	    this.addSubmenu('position', menu, parent);
		this.addSubmenu('spacing', menu, parent);
	    menu.addSeparator(parent);
		this.addMenuItem(menu, 'formattedText', parent);
		this.addMenuItem(menu, 'wordWrap', parent);
		this.promptChange(menu, mxResources.get('textOpacity'), '(%)', '100', mxConstants.STYLE_TEXT_OPACITY, parent, enabled);
		menu.addItem(mxResources.get('hide'), null, function() { graph.toggleCellStyles(mxConstants.STYLE_NOLABEL, false); }, parent, null, enabled);
	})));
	this.put('alignment', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.styleChange(menu, mxResources.get('leftAlign'), [mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_LEFT], null, parent,
				function() { document.execCommand('justifyleft'); });
		this.styleChange(menu, mxResources.get('center'), [mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_CENTER], null, parent,
				function() { document.execCommand('justifycenter'); });
		this.styleChange(menu, mxResources.get('rightAlign'), [mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_RIGHT], null, parent,
				function() { document.execCommand('justifyright'); });
		menu.addSeparator(parent);
		this.styleChange(menu, mxResources.get('topAlign'), [mxConstants.STYLE_VERTICAL_ALIGN], [mxConstants.ALIGN_TOP], null, parent);
		this.styleChange(menu, mxResources.get('middle'), [mxConstants.STYLE_VERTICAL_ALIGN], [mxConstants.ALIGN_MIDDLE], null, parent);
		this.styleChange(menu, mxResources.get('bottomAlign'), [mxConstants.STYLE_VERTICAL_ALIGN], [mxConstants.ALIGN_BOTTOM], null, parent);
		menu.addSeparator(parent);
		var enabled = this.get('text').enabled;
		menu.addItem(mxResources.get('vertical'), null, function() { graph.toggleCellStyles(mxConstants.STYLE_HORIZONTAL, true); }, parent, null, enabled);
	})));
	this.put('position', new Menu(mxUtils.bind(this, function(menu, parent)
	{
	    this.styleChange(menu, mxResources.get('left'), [mxConstants.STYLE_LABEL_POSITION, mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_LEFT, mxConstants.ALIGN_RIGHT], null, parent);
	    this.styleChange(menu, mxResources.get('center'), [mxConstants.STYLE_LABEL_POSITION, mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_CENTER, mxConstants.ALIGN_CENTER], null, parent);
	    this.styleChange(menu, mxResources.get('right'), [mxConstants.STYLE_LABEL_POSITION, mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_LEFT], null, parent);
		menu.addSeparator(parent);
		this.styleChange(menu, mxResources.get('top'), [mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.STYLE_VERTICAL_ALIGN], [mxConstants.ALIGN_TOP, mxConstants.ALIGN_BOTTOM], null, parent);
		this.styleChange(menu, mxResources.get('middle'), [mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.STYLE_VERTICAL_ALIGN], [mxConstants.ALIGN_MIDDLE, mxConstants.ALIGN_MIDDLE], null, parent);
		this.styleChange(menu, mxResources.get('bottom'), [mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.STYLE_VERTICAL_ALIGN], [mxConstants.ALIGN_BOTTOM, mxConstants.ALIGN_TOP], null, parent);
	})));
	this.put('direction', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		menu.addItem(mxResources.get('flipH'), null, function() { graph.toggleCellStyles(mxConstants.STYLE_FLIPH, false); }, parent);
		menu.addItem(mxResources.get('flipV'), null, function() { graph.toggleCellStyles(mxConstants.STYLE_FLIPV, false); }, parent);
		this.addMenuItems(menu, ['-', 'tilt', 'rotation'], parent);
	})));
	this.put('align', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		menu.addItem(mxResources.get('leftAlign'), null, function() { graph.alignCells(mxConstants.ALIGN_LEFT); }, parent);
		menu.addItem(mxResources.get('center'), null, function() { graph.alignCells(mxConstants.ALIGN_CENTER); }, parent);
		menu.addItem(mxResources.get('rightAlign'), null, function() { graph.alignCells(mxConstants.ALIGN_RIGHT); }, parent);
		menu.addSeparator(parent);
		menu.addItem(mxResources.get('topAlign'), null, function() { graph.alignCells(mxConstants.ALIGN_TOP); }, parent);
		menu.addItem(mxResources.get('middle'), null, function() { graph.alignCells(mxConstants.ALIGN_MIDDLE); }, parent);
		menu.addItem(mxResources.get('bottomAlign'), null, function() { graph.alignCells(mxConstants.ALIGN_BOTTOM); }, parent);
	})));
	this.put('layers', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		var p = graph.getDefaultParent();
		var selectedLayer = mxResources.get('background');
		
		var item = menu.addItem(selectedLayer, null, mxUtils.bind(this, function()
		{
			graph.setDefaultParent(null);
		}), parent);
		
		if (p == graph.model.getChildAt(graph.model.root, 0))
		{
			this.addCheckmark(item);
		}
		
		var layerCount = graph.model.getChildCount(graph.model.root);
		
		for (var i = 1; i < layerCount; i++)
		{
			(mxUtils.bind(this, function(child)
			{
				var title = child.value || mxResources.get('layer') + ' ' + i;
				
				if (!graph.model.isVisible(child))
				{
					title += ' (' + mxResources.get('hidden') + ')';
				}
				var item = menu.addItem(title, null, function()
				{
					if (!graph.model.isVisible(child))
					{
						graph.model.setVisible(child, true);
						
						// Forces a complete refresh to hide the edges in other
						// layers which are connected to children of this layer
						graph.view.invalidate();
					}
					
					graph.setDefaultParent(child);
				}, parent);
				
				if (p == child)
				{
					this.addCheckmark(item);
					selectedLayer = title;
				}
			}))(graph.model.getChildAt(graph.model.root, i));
		}

		var notBackground = p != graph.model.getChildAt(graph.model.root, 0);
		menu.addSeparator(parent);

		menu.addItem(mxResources.get('removeIt', [selectedLayer]), null, mxUtils.bind(this, function()
		{
			graph.removeCells([p]);
			graph.setDefaultParent(null);
		}), parent, null, notBackground);

		menu.addItem(mxResources.get('renameIt', [selectedLayer]), null, mxUtils.bind(this, function()
		{
			var dlg = new FilenameDialog(this.editorUi, selectedLayer, mxResources.get('apply'), mxUtils.bind(this, function(newValue)
			{
				if (newValue != null && newValue.length > 0)
				{
					graph.getModel().setValue(p, newValue);
				}
			}), mxResources.get('enterName'));
			this.editorUi.showDialog(dlg.container, 300, 80, true, true);
			dlg.init();
		}), parent, null, notBackground);
		
		menu.addItem(mxResources.get('hideIt', [selectedLayer]), null, mxUtils.bind(this, function()
		{
			if (graph.model.isVisible(p))
			{
				graph.model.beginUpdate();
				try
				{
					graph.model.setVisible(p, !graph.model.isVisible(p));
					
					// Forces a complete refresh to hide the edges in other
					// layers which are connected to children of this layer
					graph.view.invalidate();
				}
				finally
				{
					graph.model.endUpdate();
				}
				
				graph.setDefaultParent(null);
			}
		}), parent, null, notBackground);
		
		menu.addSeparator(parent);
		
		menu.addItem(mxResources.get('moveSelectionTo', [selectedLayer]), null, mxUtils.bind(this, function()
		{
			graph.moveCells(graph.getSelectionCells(), 0, 0, false, p);
		}), parent, null, !graph.isSelectionEmpty());

		menu.addSeparator(parent);
		
		menu.addItem(mxResources.get('addLayer'), null, mxUtils.bind(this, function()
		{
			var cell = graph.addCell(new mxCell(), graph.model.root);
			graph.setDefaultParent(cell);
		}), parent);
	}))).isEnabled = isGraphEnabled;
	this.put('layout', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		menu.addItem(mxResources.get('horizontalFlow'), null, mxUtils.bind(this, function()
		{
			var layout = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_WEST);
    		this.editorUi.executeLayout(function()
    		{
    			layout.execute(graph.getDefaultParent(), graph.getSelectionCells());
    		}, true);
		}), parent);
		menu.addItem(mxResources.get('verticalFlow'), null, mxUtils.bind(this, function()
		{
			var layout = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_NORTH);
    		this.editorUi.executeLayout(function()
    		{
    			layout.execute(graph.getDefaultParent(), graph.getSelectionCells());
    		}, true);
		}), parent);
		menu.addSeparator(parent);
		menu.addItem(mxResources.get('horizontalTree'), null, mxUtils.bind(this, function()
		{
			if (!graph.isSelectionEmpty())
			{
				var layout = new mxCompactTreeLayout(graph, true);
				layout.edgeRouting = false;
				layout.levelDistance = 30;
	    		this.editorUi.executeLayout(function()
	    		{
	    			layout.execute(graph.getDefaultParent(), graph.getSelectionCell());
	    		}, true);
			}
		}), parent);
		menu.addItem(mxResources.get('verticalTree'), null, mxUtils.bind(this, function()
		{
			if (!graph.isSelectionEmpty())
			{
				var layout = new mxCompactTreeLayout(graph, false);
				layout.edgeRouting = false;
				layout.levelDistance = 30;
	    		this.editorUi.executeLayout(function()
	    		{
	    			layout.execute(graph.getDefaultParent(), graph.getSelectionCell());
	    		}, true);
			}
		}), parent);
		menu.addSeparator(parent);
		menu.addItem(mxResources.get('organic'), null, mxUtils.bind(this, function()
		{
			var layout = new mxFastOrganicLayout(graph);
    		this.editorUi.executeLayout(function()
    		{
    			layout.execute(graph.getDefaultParent(), graph.getSelectionCell());
    		}, true);
		}), parent);
		menu.addItem(mxResources.get('circle'), null, mxUtils.bind(this, function()
		{
			var layout = new mxCircleLayout(graph);
    		this.editorUi.executeLayout(function()
    		{
    			layout.execute(graph.getDefaultParent());
    		}, true);
		}), parent);
	}))).isEnabled = isGraphEnabled;
	this.put('navigation', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.addMenuItems(menu, ['home', '-', 'exitGroup', 'enterGroup', '-', 'expand', 'collapse'], parent);
	})));
	this.put('arrange', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.addMenuItems(menu, ['toFront', 'toBack', '-'], parent);
		this.addSubmenu('direction', menu, parent);
		this.addSubmenu('layout', menu, parent);
		this.addSubmenu('align', menu, parent);
		menu.addSeparator(parent);
		this.addSubmenu('layers', menu, parent);
		this.addSubmenu('navigation', menu, parent);
		this.addMenuItems(menu, ['-', 'group', 'ungroup', 'removeFromGroup', '-', 'lockUnlock', '-', 'autosize'], parent);
	}))).isEnabled = isGraphEnabled;
	this.put('view', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.addMenuItems(menu, ['actualSize'], parent);
		menu.addSeparator();
		var scales = [0.25, 0.5, 0.75, 1, 1.5, 2, 4];
		
		for (var i = 0; i < scales.length; i++)
		{
			(function(scale)
			{
				menu.addItem((scale * 100) + '%', null, function()
				{
					graph.zoomTo(scale);
				}, parent);
			})(scales[i]);
		}
		
		this.addMenuItems(menu, ['-', 'zoomIn', 'zoomOut', '-', 'fitWindow', 'customZoom', '-', 'fitPage', 'fitPageWidth'], parent);
	})));
	this.put('file', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.addMenuItems(menu, ['new', 'open', '-', 'save', 'saveAs', '-', 'import', 'export', '-', 'editFile', '-', 'pageSetup', 'print'], parent);
	})));
	this.put('edit', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.addMenuItems(menu, ['undo', 'redo', '-', 'cut', 'copy', 'paste', 'delete', '-', 'duplicate', '-',
		                         'editData', 'editLink', 'openLink', '-', 'selectVertices', 'selectEdges', 'selectAll', '-',
		                         'setAsDefaultEdge']);
	})));
	this.put('options', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.addMenuItems(menu, ['grid', 'guides', 'tooltips', '-', 'connect', 'copyConnect', 'navigation',
		                         '-', 'scrollbars', 'pageView', '-', 'pageBackgroundColor', '-', 'autosave']);
	})));
	this.put('help', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.addMenuItems(menu, ['help', '-', 'about']);
	})));
};

/**
 * Adds the label menu items to the given menu and parent.
 */
Menus.prototype.put = function(name, menu)
{
	this.menus[name] = menu;
	
	return menu;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
Menus.prototype.get = function(name)
{
	return this.menus[name];
};

/**
 * Adds the given submenu.
 */
Menus.prototype.addSubmenu = function(name, menu, parent)
{
	var enabled = this.get(name).isEnabled();
	
	if (menu.showDisabled || enabled)
	{
		var submenu = menu.addItem(mxResources.get(name), null, null, parent, null, enabled);
		this.addMenu(name, menu, submenu);
	}
};

/**
 * Adds the label menu items to the given menu and parent.
 */
Menus.prototype.addMenu = function(name, popupMenu, parent)
{
	var menu = this.get(name);
	
	if (menu != null && (popupMenu.showDisabled || menu.isEnabled()))
	{
		this.get(name).execute(popupMenu, parent);
	}
};

/**
 * Adds a style change item to the given menu.
 */
Menus.prototype.styleChange = function(menu, label, keys, values, sprite, parent, fn)
{
	return menu.addItem(label, null, mxUtils.bind(this, function()
	{
		var graph = this.editorUi.editor.graph;
		
		if (fn != null && graph.cellEditor.isContentEditing())
		{
			fn();
		}
		else
		{
			graph.getModel().beginUpdate();
			try
			{
				graph.stopEditing(false);
				
				for (var i = 0; i < keys.length; i++)
				{
					graph.setCellStyles(keys[i], values[i]);
				}
			}
			finally
			{
				graph.getModel().endUpdate();
			}
		}
	}), parent, sprite);
};

/**
 * Adds a style change item with a prompt to the given menu.
 */
Menus.prototype.promptChange = function(menu, label, hint, defaultValue, key, parent, enabled, fn)
{
	return menu.addItem(label, null, mxUtils.bind(this, function()
	{
		var graph = this.editorUi.editor.graph;
		var value = defaultValue;
    	var state = graph.getView().getState(graph.getSelectionCell());
    	
    	if (state != null)
    	{
    		value = state.style[key] || value;
    	}
    	
		var dlg = new FilenameDialog(this.editorUi, value, mxResources.get('apply'), mxUtils.bind(this, function(newValue)
		{
			if (newValue != null && newValue.length > 0)
			{
				graph.getModel().beginUpdate();
				try
				{
					graph.stopEditing(false);
					graph.setCellStyles(key, newValue);
				}
				finally
				{
					graph.getModel().endUpdate();
				}
				
				if (fn != null)
				{
					fn(newValue);
				}
			}
		}), mxResources.get('enterValue') + ((hint.length > 0) ? (' ' + hint) : ''));
		this.editorUi.showDialog(dlg.container, 300, 80, true, true);
		dlg.init();
	}), parent, null, enabled);
};

/**
 * Adds a handler for showing a menu in the given element.
 */
Menus.prototype.pickColor = function(key, cmd, defaultValue)
{
	var graph = this.editorUi.editor.graph;
	
	if (cmd != null && graph.cellEditor.isContentEditing())
	{
		var selState = graph.cellEditor.saveSelection();
		
		var dlg = new ColorDialog(this.editorUi, defaultValue || '000000', mxUtils.bind(this, function(color)
		{
			graph.cellEditor.restoreSelection(selState);
			document.execCommand(cmd, false, (color != mxConstants.NONE) ? color : 'transparent');
		}), function()
		{
			graph.cellEditor.restoreSelection(selState);
		});
		this.editorUi.showDialog(dlg.container, 220, 400, true, false);
		dlg.init();
	}
	else
	{
		if (this.colorDialog == null)
		{
			this.colorDialog = new ColorDialog(this.editorUi);
		}
	
		this.colorDialog.currentColorKey = key;
		var state = graph.getView().getState(graph.getSelectionCell());
		var color = 'none';
		
		if (state != null)
		{
			color = state.style[key] || color;
		}
		
		if (color == 'none')
		{
			color = 'ffffff';
			this.colorDialog.picker.fromString('ffffff');
			this.colorDialog.colorInput.value = 'none';
		}
		else
		{
			this.colorDialog.picker.fromString(color);
		}
	
		this.editorUi.showDialog(this.colorDialog.container, 220, 400, true, false);
		this.colorDialog.init();
	}
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.addMenuItem = function(menu, key, parent)
{
	var action = this.editorUi.actions.get(key);

	if (action != null && (menu.showDisabled || action.isEnabled()) && action.visible)
	{
		var item = menu.addItem(action.label, null, action.funct, parent, null, action.isEnabled());
		
		// Adds checkmark image
		if (action.toggleAction && action.isSelected())
		{
			this.addCheckmark(item);
		}

		this.addShortcut(item, action);
		
		return item;
	}
	
	return null;
};

/**
 * Adds a checkmark to the given menuitem.
 */
Menus.prototype.addShortcut = function(item, action)
{
	if (action.shortcut != null)
	{
		var td = item.firstChild.nextSibling.nextSibling;
		var span = document.createElement('span');
		span.style.color = 'gray';
		mxUtils.write(span, action.shortcut);
		td.appendChild(span);
	}
};

/**
 * Adds a checkmark to the given menuitem.
 */
Menus.prototype.addCheckmark = function(item)
{
	var td = item.firstChild.nextSibling;
	td.style.backgroundImage = 'url(' + IMAGE_PATH + '/checkmark.gif)';
	td.style.backgroundRepeat = 'no-repeat';
	td.style.backgroundPosition = '2px 50%';
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.addMenuItems = function(menu, keys, parent)
{
	for (var i = 0; i < keys.length; i++)
	{
		if (keys[i] == '-')
		{
			menu.addSeparator(parent);
		}
		else
		{
			this.addMenuItem(menu, keys[i], parent);
		}
	}
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.createPopupMenu = function(menu, cell, evt)
{
	var graph = this.editorUi.editor.graph;
	menu.smartSeparators = true;
	
	if (graph.isSelectionEmpty())
	{
		this.addMenuItems(menu, ['undo', 'redo', '-', 'paste', '-']);	
	}
	else
	{
		this.addMenuItems(menu, ['delete', '-', 'cut', 'copy', '-', 'duplicate']);	

		if (graph.getSelectionCount() == 1 && graph.getModel().isEdge(graph.getSelectionCell()))
		{
			this.addMenuItems(menu, ['setAsDefaultEdge']);
		}
		
		menu.addSeparator();
	}
	
	if (graph.getSelectionCount() > 0)
	{		
		this.addMenuItems(menu, ['toFront', 'toBack', '-']);

		if (graph.getModel().isEdge(graph.getSelectionCell()))
		{
			var isWaypoint = false;
			var cell = graph.getSelectionCell();
			
			if (cell != null && graph.getModel().isEdge(cell))
			{
				var handler = graph.selectionCellsHandler.getHandler(cell);
				
				if (handler instanceof mxEdgeHandler && handler.bends != null && handler.bends.length > 2)
				{
					var index = handler.getHandleForEvent(graph.updateMouseEvent(new mxMouseEvent(evt)));
					
					// Configures removeWaypoint action before execution
					var rmWaypointAction = this.editorUi.actions.get('removeWaypoint');
					rmWaypointAction.handler = handler;
					rmWaypointAction.index = index;

					isWaypoint = index > 0 && index < handler.bends.length - 1;
				}
			}
			
			this.addMenuItems(menu, ['-', (isWaypoint) ? 'removeWaypoint' : 'addWaypoint']);
		}
		else if (graph.getSelectionCount() > 1)	
		{
			menu.addSeparator();
			this.addMenuItems(menu, ['group']);
		}
		else if (graph.getSelectionCount() == 1)
		{
			menu.addSeparator();
			this.addMenuItems(menu, ['editLink']);
			
			var link = graph.getLinkForCell(graph.getSelectionCell());
			
			if (link != null)
			{
				this.addMenuItems(menu, ['openLink']);
			}
		}
	}
	else
	{
		this.addMenuItems(menu, ['-', 'selectVertices', 'selectEdges', '-', 'selectAll']);
	}
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.createMenubar = function(container)
{
	var menubar = new Menubar(this.editorUi, container);
	var menus = ['file', 'edit', 'view', 'format', 'text', 'arrange', 'options', 'help'];
	
	for (var i = 0; i < menus.length; i++)
	{
		(function(menu)
		{
			var elt = menubar.addMenu(mxResources.get(menus[i]), menu.funct);
			
			if (elt != null)
			{
				menu.addListener('stateChanged', function()
				{
					elt.enabled = menu.enabled;
					
					if (!menu.enabled)
					{
						elt.className = 'geItem mxDisabled';
					}
					else
					{
						elt.className = 'geItem';
					}
				});
			}
		})(this.get(menus[i]));
	}

	return menubar;
};

/**
 * Construcs a new menubar for the given editor.
 */
function Menubar(editorUi, container)
{
	this.editorUi = editorUi;
	this.container = container;
	
	// Global handler to hide the current menu
	mxEvent.addGestureListeners(document, mxUtils.bind(this, function(evt)
	{
		if (this.currentMenu != null && mxEvent.getSource(evt) != this.currentMenu.div)
		{
			this.hideMenu();
		}
	}));
};

/**
 * Adds the menubar elements.
 */
Menubar.prototype.hideMenu = function()
{
	if (this.currentMenu != null)
	{
		this.currentMenu.hideMenu();
	}
};

/**
 * Adds a submenu to this menubar.
 */
Menubar.prototype.addMenu = function(label, funct)
{
	var elt = document.createElement('a');
	elt.setAttribute('href', 'javascript:void(0);');
	elt.className = 'geItem';
	mxUtils.write(elt, label);

	this.addMenuHandler(elt, funct);
	this.container.appendChild(elt);
	
	return elt;
};

/**
 * Adds a handler for showing a menu in the given element.
 */
Menubar.prototype.addMenuHandler = function(elt, funct)
{
	if (funct != null)
	{
		var show = true;
		
		var clickHandler = mxUtils.bind(this, function(evt)
		{
			if (show && elt.enabled == null || elt.enabled)
			{
				this.editorUi.editor.graph.popupMenuHandler.hideMenu();
				var menu = new mxPopupMenu(funct);
				menu.div.className += ' geMenubarMenu';
				menu.smartSeparators = true;
				menu.showDisabled = true;
				menu.autoExpand = true;
				
				// Disables autoexpand and destroys menu when hidden
				menu.hideMenu = mxUtils.bind(this, function()
				{
					mxPopupMenu.prototype.hideMenu.apply(menu, arguments);
					menu.destroy();
					this.currentMenu = null;
					this.currentElt = null;
				});

				var offset = mxUtils.getOffset(elt);
				menu.popup(offset.x, offset.y + elt.offsetHeight, null, evt);
				this.currentMenu = menu;
				this.currentElt = elt;
			}
			
			show = true;
			mxEvent.consume(evt);
		});
		
		// Shows menu automatically while in expanded state
		mxEvent.addListener(elt, 'mousemove', mxUtils.bind(this, function(evt)
		{
			if (this.currentMenu != null && this.currentElt != elt)
			{
				this.hideMenu();
				clickHandler(evt);
			}
		}));

		// Hides menu if already showing
		mxEvent.addListener(elt, 'mousedown', mxUtils.bind(this, function()
		{
			show = this.currentElt != elt;
		}));
		
		mxEvent.addListener(elt, 'click', clickHandler);
	}
};

/**
 * Constructs a new action for the given parameters.
 */
function Menu(funct, enabled)
{
	mxEventSource.call(this);
	this.funct = funct;
	this.enabled = (enabled != null) ? enabled : true;
};

// Menu inherits from mxEventSource
mxUtils.extend(Menu, mxEventSource);

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Menu.prototype.isEnabled = function()
{
	return this.enabled;
};

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Menu.prototype.setEnabled = function(value)
{
	if (this.enabled != value)
	{
		this.enabled = value;
		this.fireEvent(new mxEventObject('stateChanged'));
	}
};

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Menu.prototype.execute = function(menu, parent)
{
	this.funct(menu, parent);
};

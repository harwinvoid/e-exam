/**
 * $Id: Sidebar.js,v 1.67 2014/02/19 10:56:15 gaudenz Exp $
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Construcs a new sidebar for the given editor.
 */
function Sidebar(editorUi, container)
{
	this.editorUi = editorUi;
	this.container = container;
	this.palettes = new Object();
	this.showTooltips = true;
	this.graph = new Graph(document.createElement('div'), null, null, this.editorUi.editor.graph.getStylesheet());
	this.graph.resetViewOnRootChange = false;
	this.graph.foldingEnabled = false;
	this.graph.setConnectable(false);
	this.graph.autoScroll = false;
	this.graph.setTooltips(false);
	this.graph.setEnabled(false);

	// Container must be in the DOM for correct HTML rendering
	this.graph.container.style.visibility = 'hidden';
	this.graph.container.style.position = 'absolute';
	document.body.appendChild(this.graph.container);

	mxEvent.addListener(document, (mxClient.IS_POINTER) ? 'MSPointerUp' : 'mouseup', mxUtils.bind(this, function()
	{
		this.showTooltips = true;
	}));

	mxEvent.addListener(document, (mxClient.IS_POINTER) ? 'MSPointerDown' : 'mousedown', mxUtils.bind(this, function()
	{
		this.showTooltips = false;
		this.hideTooltip();
	}));

	mxEvent.addListener(document, (mxClient.IS_POINTER) ? 'MSPointerMove' : 'mousemove', mxUtils.bind(this, function(evt)
	{
		var src = mxEvent.getSource(evt);
		
		while (src != null)
		{
			if (src == this.currentElt)
			{
				return;
			}
			
			src = src.parentNode;
		}
		
		this.hideTooltip();
	}));

	// Handles mouse leaving the window
	mxEvent.addListener(document, (mxClient.IS_POINTER) ? 'MSPointerOut' : 'mouseout', mxUtils.bind(this, function(evt)
	{
		if (evt.toElement == null && evt.relatedTarget == null)
		{
			this.hideTooltip();
		}
	}));

	// Enables tooltips after scroll
	mxEvent.addListener(container, 'scroll', mxUtils.bind(this, function()
	{
		this.showTooltips = true;
	}));
	
	this.init();
	
	// Pre-fetches tooltip image
	new Image().src = IMAGE_PATH + '/tooltip.png';
};

/**
 * Adds all palettes to the sidebar.
 */
Sidebar.prototype.init = function()
{
	var dir = STENCIL_PATH;
	
	this.addGeneralPalette(true);
	this.addStencilPalette('basic', mxResources.get('basic'), dir + '/basic.xml',
		';fillColor=#ffffff;strokeColor=#000000;strokeWidth=2');
	this.addStencilPalette('arrows', mxResources.get('arrows'), dir + '/arrows.xml',
		';fillColor=#ffffff;strokeColor=#000000;strokeWidth=2');
	this.addUmlPalette(false);
	this.addBpmnPalette(dir, false);
	this.addStencilPalette('flowchart', 'Flowchart', dir + '/flowchart.xml',
	';fillColor=#ffffff;strokeColor=#000000;strokeWidth=2');
	this.addImagePalette('clipart', mxResources.get('clipart'), dir + '/clipart/', '_128x128.png',
		['Earth_globe', 'Empty_Folder', 'Full_Folder', 'Gear', 'Lock', 'Software', 'Virus', 'Email',
		 'Database', 'Router_Icon', 'iPad', 'iMac', 'Laptop', 'MacBook', 'Monitor_Tower', 'Printer',
		 'Server_Tower', 'Workstation', 'Firewall_02', 'Wireless_Router_N', 'Credit_Card',
		 'Piggy_Bank', 'Graph', 'Safe', 'Shopping_Cart', 'Suit1', 'Suit2', 'Suit3', 'Pilot1',
		 'Worker1', 'Soldier1', 'Doctor1', 'Tech1', 'Security1', 'Telesales1']);
};

/**
 * Specifies if tooltips should be visible. Default is true.
 */
Sidebar.prototype.enableTooltips = true;

/**
 * Specifies the delay for the tooltip. Default is 16 px.
 */
Sidebar.prototype.tooltipBorder = 16;

/**
 * Specifies the delay for the tooltip. Default is 3 px.
 */
Sidebar.prototype.thumbBorder = 3;

/**
 * Specifies the delay for the tooltip. Default is 300 ms.
 */
Sidebar.prototype.tooltipDelay = 300;

/**
 * Specifies if edges should be used as templates if clicked. Default is true.
 */
Sidebar.prototype.installEdges = true;

/**
 * Specifies the URL of the gear image.
 */
Sidebar.prototype.gearImage = STENCIL_PATH + '/clipart/Gear_128x128.png';

/**
 * Specifies the width of the thumbnails.
 */
Sidebar.prototype.thumbWidth = 34;

/**
 * Specifies the height of the thumbnails.
 */
Sidebar.prototype.thumbHeight = 34;

/**
 * Specifies the padding for the thumbnails. Default is 3.
 */
Sidebar.prototype.thumbPadding = 2;

/**
 * Specifies the size of the sidebar titles.
 */
Sidebar.prototype.sidebarTitleSize = 9;

/**
 * Specifies if titles in the sidebar should be enabled.
 */
Sidebar.prototype.sidebarTitles = true;

/**
 * Specifies if titles in the tooltips should be enabled.
 */
Sidebar.prototype.tooltipTitles = true;

/**
 * Specifies if titles in the tooltips should be enabled.
 */
Sidebar.prototype.maxTooltipWidth = 400;

/**
 * Specifies if titles in the tooltips should be enabled.
 */
Sidebar.prototype.maxTooltipHeight = 400;

/**
 * Adds all palettes to the sidebar.
 */
Sidebar.prototype.showTooltip = function(elt, cells, w, h, title, showLabel)
{
	if (this.enableTooltips && this.showTooltips)
	{
		if (this.currentElt != elt)
		{
			if (this.thread != null)
			{
				window.clearTimeout(this.thread);
				this.thread = null;
			}
			
			var show = mxUtils.bind(this, function()
			{
				// Lazy creation of the DOM nodes and graph instance
				if (this.tooltip == null)
				{
					this.tooltip = document.createElement('div');
					this.tooltip.className = 'geSidebarTooltip';
					document.body.appendChild(this.tooltip);
					
					this.graph2 = new Graph(this.tooltip, null, null, this.editorUi.editor.graph.getStylesheet());
					this.graph2.view.setTranslate(this.tooltipBorder, this.tooltipBorder);
					this.graph2.resetViewOnRootChange = false;
					this.graph2.foldingEnabled = false;
					this.graph2.autoScroll = false;
					this.graph2.setTooltips(false);
					this.graph2.setConnectable(false);
					this.graph2.setEnabled(false);
					
					if (!mxClient.IS_SVG)
					{
						this.graph2.view.canvas.style.position = 'relative';
					}
					
					this.tooltipImage = mxUtils.createImage(IMAGE_PATH + '/tooltip.png');
					this.tooltipImage.style.position = 'absolute';
					this.tooltipImage.style.width = '14px';
					this.tooltipImage.style.height = '27px';
					
					document.body.appendChild(this.tooltipImage);
				}
				
				this.graph2.model.clear();

				if (w > this.maxTooltipWidth || h > this.maxTooltipHeight)
				{
					this.graph2.view.scale = Math.round(Math.min(this.maxTooltipWidth / w, this.maxTooltipHeight / h) * 100) / 100;
				}
				else
				{
					this.graph2.view.scale = 1;
				}
				
				this.tooltip.style.display = 'block';
				this.graph2.labelsVisible = (showLabel == null || showLabel);
				this.graph2.addCells(cells);
				
				var bounds = this.graph2.getGraphBounds();
				var width = bounds.width + 2 * this.tooltipBorder;
				var height = bounds.height + 2 * this.tooltipBorder;
				
				if (mxClient.IS_QUIRKS)
				{
					width += 4;
					height += 4;
					this.tooltip.style.overflow = 'hidden';
				}
				else
				{
					this.tooltip.style.overflow = 'visible';
				}

				this.tooltipImage.style.visibility = 'visible';
				this.tooltip.style.width = width + 'px';
				
				// Adds title for entry
				if (this.tooltipTitles && title != null && title.length > 0)
				{
					if (this.tooltipTitle == null)
					{
						this.tooltipTitle = document.createElement('div');
						this.tooltipTitle.style.borderTop = '1px solid gray';
						this.tooltipTitle.style.textAlign = 'center';
						this.tooltipTitle.style.width = '100%';
						
						// Oversize titles are cut-off currently. Should make tooltip wider later.
						this.tooltipTitle.style.overflow = 'hidden';
						
						if (mxClient.IS_SVG)
						{
							this.tooltipTitle.style.paddingTop = '2px';
						}
						else
						{
							this.tooltipTitle.style.position = 'absolute';
							this.tooltipTitle.style.paddingTop = '6px';							
						}

						this.tooltip.appendChild(this.tooltipTitle);
					}
					else
					{
						this.tooltipTitle.innerHTML = '';
					}
					
					this.tooltipTitle.style.display = '';
					mxUtils.write(this.tooltipTitle, title);
					
					var dy = this.tooltipTitle.offsetHeight + 10;
					height += dy;
					
					if (mxClient.IS_SVG)
					{
						this.tooltipTitle.style.marginTop = (-dy) + 'px';
					}
					else
					{
						height -= 6;
						this.tooltipTitle.style.top = (height - dy) + 'px';	
					}
				}
				else if (this.tooltipTitle != null && this.tooltipTitle.parentNode != null)
				{
					this.tooltipTitle.style.display = 'none';
				}
				
				this.tooltip.style.height = height + 'px';
				var x0 = -Math.min(0, bounds.x - this.tooltipBorder);
				var y0 = -Math.min(0, bounds.y - this.tooltipBorder);

				var left = this.container.clientWidth + this.editorUi.splitSize + 3;
				var top = Math.max(0, (this.container.offsetTop + elt.offsetTop - this.container.scrollTop - height / 2 + 16));
				
				if (mxClient.IS_SVG)
				{
					this.graph2.view.canvas.setAttribute('transform', 'translate(' + x0 + ',' + y0 + ')');
				}
				else
				{
					this.graph2.view.drawPane.style.left = x0 + 'px';
					this.graph2.view.drawPane.style.top = y0 + 'px';
				}
		
				// Workaround for ignored position CSS style in IE9
				// (changes to relative without the following line)
				this.tooltip.style.position = 'absolute';
				this.tooltip.style.left = left + 'px';
				this.tooltip.style.top = top + 'px';
				this.tooltipImage.style.left = (left - 13) + 'px';
				this.tooltipImage.style.top = (top + height / 2 - 13) + 'px';
			});

			if (this.tooltip != null && this.tooltip.style.display != 'none')
			{
				show();
			}
			else
			{
				this.thread = window.setTimeout(show, this.tooltipDelay);
			}

			this.currentElt = elt;
		}
	}
};

/**
 * Hides the current tooltip.
 */
Sidebar.prototype.hideTooltip = function()
{
	if (this.thread != null)
	{
		window.clearTimeout(this.thread);
		this.thread = null;
	}
	
	if (this.tooltip != null)
	{
		this.tooltip.style.display = 'none';
		this.tooltipImage.style.visibility = 'hidden';
		this.currentElt = null;
	}
};

/**
 * Adds the general palette to the sidebar.
 */
Sidebar.prototype.addGeneralPalette = function(expand)
{
	this.addPalette('general', mxResources.get('general'), (expand != null) ? expand : true, mxUtils.bind(this, function(content)
	{
		content.appendChild(this.createVertexTemplate('swimlane;whiteSpace=wrap', 200, 200, 'Container', 'Container', true));
	    content.appendChild(this.createVertexTemplate('whiteSpace=wrap', 120, 60, '', 'Rectangle', true));
	    content.appendChild(this.createVertexTemplate('rounded=1;whiteSpace=wrap', 120, 60, '', 'Rounded Rectangle', true));
	    content.appendChild(this.createVertexTemplate('text;align=center;verticalAlign=middle;', 100, 40, 'Simple Text', 'Simple Text', true));

	    content.appendChild(this.createVertexTemplate('text;html=1;spacing=5;spacingTop=-10;whiteSpace=wrap;overflow=hidden;', 200, 140,
	    	'<h1>Heading</h1><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>', 'Formatted Text', true));

	    var linkCell = new mxCell('Click here!', new mxGeometry(0, 0, 100, 40), 'fontColor=#0000EE;fontStyle=4;');
	    linkCell.vertex = true;
	    this.graph.setLinkForCell(linkCell, 'http://www.jgraph.com');
    	content.appendChild(this.createVertexTemplateFromCells([linkCell], 100, 40, 'Hyperlink', true));

	    content.appendChild(this.createVertexTemplate('shape=image;verticalLabelPosition=bottom;verticalAlign=top;imageAspect=1;aspect=fixed;image=' + this.gearImage, 52, 61, '', 'Fixed Image', false));
    	content.appendChild(this.createVertexTemplate('shape=image;verticalLabelPosition=bottom;verticalAlign=top;imageAspect=0;image=' + this.gearImage, 50, 60, '', 'Stretched Image', false));
	    
	    content.appendChild(this.createVertexTemplate('ellipse;whiteSpace=wrap', 80, 80, '', 'Circle', true));
	    content.appendChild(this.createVertexTemplate('ellipse;shape=doubleEllipse;whiteSpace=wrap', 80, 80, '', 'Double Ellipse', true));
	    content.appendChild(this.createVertexTemplate('shape=ext;double=1;whiteSpace=wrap', 120, 60, 'Double Rectangle', 'Double Rectangle', true));
	    content.appendChild(this.createVertexTemplate('shape=ext;double=1;rounded=1;whiteSpace=wrap', 120, 60, 'Double\nRounded Rectangle', 'Double Rounded Rectangle', true));
	    content.appendChild(this.createVertexTemplate('shape=process;whiteSpace=wrap', 120, 60, '', 'Process', true));
	    content.appendChild(this.createVertexTemplate('shape=parallelogram;whiteSpace=wrap', 120, 60, '', 'Parallelogram', true));
	    content.appendChild(this.createVertexTemplate('shape=trapezoid;whiteSpace=wrap', 120, 60, '', 'Trapezoid', true));
	    content.appendChild(this.createVertexTemplate('shape=document;whiteSpace=wrap', 120, 80, '', 'Document', true));
	    content.appendChild(this.createVertexTemplate('triangle;whiteSpace=wrap', 60, 80, '', 'Triangle', true));
	    content.appendChild(this.createVertexTemplate('rhombus;whiteSpace=wrap', 80, 80, '', 'Rhombus', true));
	    content.appendChild(this.createVertexTemplate('shape=hexagon;whiteSpace=wrap', 120, 80, '', 'Hexagon', true));
	    content.appendChild(this.createVertexTemplate('shape=step;whiteSpace=wrap', 120, 80, '', 'Step', true));
	    content.appendChild(this.createVertexTemplate('shape=cylinder;whiteSpace=wrap', 60, 80, '', 'Cylinder', true));
	    content.appendChild(this.createVertexTemplate('shape=tape;whiteSpace=wrap', 120, 100, '', 'Tape', true));
	    content.appendChild(this.createVertexTemplate('shape=xor;whiteSpace=wrap', 60, 80, '', 'Exclusive Or', true));
	    content.appendChild(this.createVertexTemplate('shape=or;whiteSpace=wrap', 60, 80, '', 'Or', true));
	    content.appendChild(this.createVertexTemplate('shape=cube;whiteSpace=wrap', 120, 80, '', 'Cube', true));
	    content.appendChild(this.createVertexTemplate('shape=note;whiteSpace=wrap', 80, 100, '', 'Note', true));
	    content.appendChild(this.createVertexTemplate('shape=folder;whiteSpace=wrap', 120, 120, '', 'Folder', true));
	    content.appendChild(this.createVertexTemplate('shape=card;whiteSpace=wrap', 60, 80, '', 'Card', true));
	    content.appendChild(this.createVertexTemplate('shape=message;whiteSpace=wrap', 60, 40, '', 'Message', true));
	    content.appendChild(this.createVertexTemplate('shape=actor;whiteSpace=wrap', 40, 60, '', 'Actor 1', true));
	    content.appendChild(this.createVertexTemplate('icon;image=' + this.gearImage, 60, 60, 'Icon', 'Icon', false));
	    content.appendChild(this.createVertexTemplate('whiteSpace=wrap;label;image=' + this.gearImage, 140, 60, 'Label', 'Label', true));
	    content.appendChild(this.createVertexTemplate('shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top', 30, 60, '', 'Actor 2', true));
	    content.appendChild(this.createVertexTemplate('ellipse;shape=cloud;whiteSpace=wrap', 120, 80, '', 'Cloud', true));
	    content.appendChild(this.createVertexTemplate('line', 160, 10, '', 'Horizontal Line', true));
	    content.appendChild(this.createVertexTemplate('line;direction=south', 10, 160, '', 'Vertical Line', true));

	    content.appendChild(this.createEdgeTemplate('edgeStyle=none;endArrow=none;', 100, 100, '', 'Line', true));
	    content.appendChild(this.createEdgeTemplate('edgeStyle=none;endArrow=none;dashed=1;', 100, 100, '', 'Dashed Line', true));
	    content.appendChild(this.createEdgeTemplate('edgeStyle=none;endArrow=none;dashed=1;dashPattern=1 4', 100, 100, '', 'Dotted Line', true));
	    content.appendChild(this.createEdgeTemplate('edgeStyle=none', 100, 100, '', 'Connection', true));

		var cells = [new mxCell('', new mxGeometry(0, 0, 100, 100), 'curved=1')];
		cells[0].geometry.setTerminalPoint(new mxPoint(0, 100), true);
		cells[0].geometry.setTerminalPoint(new mxPoint(100, 0), false);
		cells[0].geometry.points = [new mxPoint(100, 100), new mxPoint(0, 0)];
		cells[0].geometry.relative = true;
		cells[0].edge = true;
	    content.appendChild(this.createEdgeTemplateFromCells(cells, 100, 100, 'Curve', true));
	    
	    content.appendChild(this.createEdgeTemplate('edgeStyle=elbowEdgeStyle;elbow=horizontal', 100, 100, '', 'Horizontal Elbow', true));
	    content.appendChild(this.createEdgeTemplate('edgeStyle=elbowEdgeStyle;elbow=vertical', 100, 100, '', 'Vertical Elbow', true));
	    content.appendChild(this.createEdgeTemplate('edgeStyle=entityRelationEdgeStyle', 100, 100, '', 'Entity Relation', true));
	    content.appendChild(this.createEdgeTemplate('edgeStyle=segmentEdgeStyle', 100, 100, '', 'Manual Line', true));
	    content.appendChild(this.createEdgeTemplate('edgeStyle=orthogonalEdgeStyle', 100, 100, '', 'Automatic Line', true));
	    content.appendChild(this.createEdgeTemplate('shape=link', 100, 100, '', 'Link', true));
	    content.appendChild(this.createEdgeTemplate('arrow', 100, 100, '', 'Arrow', true));
	}));
};

/**
 * Adds the general palette to the sidebar.
 */
Sidebar.prototype.addUmlPalette = function(expand)
{
	this.addPalette('uml', 'UML', expand || false, mxUtils.bind(this, function(content)
	{
	    content.appendChild(this.createVertexTemplate('', 110, 50, 'Object', 'Object', true));
    	
	    var classCell = new mxCell('<p style="margin:0px;margin-top:4px;text-align:center;">' +
    			'<b>Class</b></p>' +
				'<hr/><div style="height:2px;"></div><hr/>', new mxGeometry(0, 0, 140, 60),
				'verticalAlign=top;align=left;overflow=fill;fontSize=12;fontFamily=Helvetica;html=1');
    	classCell.vertex = true;
    	content.appendChild(this.createVertexTemplateFromCells([classCell], 140, 60, 'Class 1', true));
    	
	    var classCell = new mxCell('<p style="margin:0px;margin-top:4px;text-align:center;">' +
    			'<b>Class</b></p>' +
				'<hr/><p style="margin:0px;margin-left:4px;">+ field: Type</p><hr/>' +
				'<p style="margin:0px;margin-left:4px;">+ method(): Type</p>', new mxGeometry(0, 0, 160, 90),
				'verticalAlign=top;align=left;overflow=fill;fontSize=12;fontFamily=Helvetica;html=1');
    	classCell.vertex = true;
    	content.appendChild(this.createVertexTemplateFromCells([classCell], 160, 90, 'Class 2', true));
    	
	    var classCell = new mxCell('<p style="margin:0px;margin-top:4px;text-align:center;">' +
    			'<i>&lt;&lt;Interface&gt;&gt;</i><br/><b>Interface</b></p>' +
				'<hr/><p style="margin:0px;margin-left:4px;">+ field1: Type<br/>' +
				'+ field2: Type</p>' +
				'<hr/><p style="margin:0px;margin-left:4px;">' +
				'+ method1(Type): Type<br/>' +
				'+ method2(Type, Type): Type</p>', new mxGeometry(0, 0, 190, 140),
				'verticalAlign=top;align=left;overflow=fill;fontSize=12;fontFamily=Helvetica;html=1');
    	classCell.vertex = true;
    	content.appendChild(this.createVertexTemplateFromCells([classCell], 190, 140, 'Interface', true));

		var classCell = new mxCell('Module', new mxGeometry(0, 0, 120, 60),
	    	'shape=component;align=left;spacingLeft=36');
    	classCell.vertex = true;

    	content.appendChild(this.createVertexTemplateFromCells([classCell], 120, 60, 'Module', true));

	    var classCell = new mxCell('&lt;&lt;component&gt;&gt;<br/><b>Component</b>', new mxGeometry(0, 0, 180, 90),
	    	'shape=ext;symbol0=component;symbol0Width=20;symbol0Height=20;symbol0Align=right;symbol0VerticalAlign=top;symbol0Spacing=4;symbol0ArcSpacing=0.25;jettyWidth=8;jettyHeight=4;overflow=fill;html=1', 'Component', true);
	    classCell.vertex = true;
	
		content.appendChild(this.createVertexTemplateFromCells([classCell], 180, 90, 'Component', true));

	    var classCell = new mxCell('<p style="margin:0px;margin-top:6px;text-align:center;"><b>Component</b></p>' +
				'<hr/><p style="margin:0px;margin-left:8px;">+ Attribute1: Type<br/>+ Attribute2: Type</p>', new mxGeometry(0, 0, 180, 90),
	    	'shape=ext;symbol0=component;symbol0Width=20;symbol0Height=20;symbol0Align=right;symbol0VerticalAlign=top;symbol0ArcSpacing=0.25;jettyWidth=8;jettyHeight=4;verticalAlign=top;align=left;overflow=fill;html=1');
		classCell.vertex = true;

		content.appendChild(this.createVertexTemplateFromCells([classCell], 180, 90, 'Component with Attributes', true));

		content.appendChild(this.createVertexTemplate('shape=lollipop;direction=south;', 30, 10, '', 'Lollipop', true));

    	var cardCell = new mxCell('Block', new mxGeometry(0, 0, 180, 120),
    			'verticalAlign=top;align=left;spacingTop=8;spacingLeft=2;spacingRight=12;shape=cube;size=10;direction=south;fontStyle=4;');
    	cardCell.vertex = true;
    	content.appendChild(this.createVertexTemplateFromCells([cardCell], 180, 120, 'Block', true));

	    content.appendChild(this.createVertexTemplate('shape=folder;fontStyle=1;spacingTop=10;tabWidth=40;tabHeight=14;tabPosition=left;', 70, 50,
	    	'package', 'Package', true));

	    var classCell = new mxCell('<p style="margin:0px;margin-top:4px;text-align:center;text-decoration:underline;">' +
    			'<b>Object:Type</b></p><hr/>' +
				'<p style="margin:0px;margin-left:8px;">field1 = value1<br/>field2 = value2<br>field3 = value3</p>',
				new mxGeometry(0, 0, 160, 90),
				'verticalAlign=top;align=left;overflow=fill;fontSize=12;fontFamily=Helvetica;html=1');
    	classCell.vertex = true;
    	content.appendChild(this.createVertexTemplateFromCells([classCell], 160, 90, 'Object', true));

    	var tableCell = new mxCell('<div style="box-sizing:border-box;width:100%;background:#e4e4e4;margin:1px;padding:2px;">Tablename</div><table style="width:100%;">' +
				'<tr><td>PK</td><td style="padding:2px;">uniqueId</td></tr>' +
				'<tr><td>FK1</td><td style="padding:2px;">foreignKey</td></tr>' +
				'<tr><td></td><td style="padding:2px;">fieldname</td></tr>' +
				'</table>', new mxGeometry(0, 0, 180, 90), 'verticalAlign=top;align=left;overflow=fill;html=1');
    	tableCell.vertex = true;
    	content.appendChild(this.createVertexTemplateFromCells([tableCell], 180, 90, 'Entity', true));
	    content.appendChild(this.createVertexTemplate('shape=note', 80, 100, '', 'Note', true));

    	content.appendChild(this.createVertexTemplate('shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top', 40, 80, 'Actor', 'Actor', false));
	    content.appendChild(this.createVertexTemplate('ellipse', 140, 70, 'Use Case', 'Use Case', true));

    	var cardCell = new mxCell('', new mxGeometry(0, 0, 30, 30),
    		'ellipse;shape=startState;fillColor=#000000;strokeColor=#ff0000;');
    	cardCell.vertex = true;
    	
		var assoc2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;elbow=horizontal;verticalAlign=bottom;endArrow=open;endSize=8;strokeColor=#ff0000;');
		assoc2.geometry.setTerminalPoint(new mxPoint(15, 70), false);
		assoc2.edge = true;
		
		cardCell.insertEdge(assoc2, true);
    	
		content.appendChild(this.createVertexTemplateFromCells([cardCell, assoc2], 30, 30, 'Start', true));
	    
    	var cardCell = new mxCell('Activity', new mxGeometry(0, 0, 120, 40),
    		'rounded=1;arcSize=40;fillColor=#ffffc0;strokeColor=#ff0000;');
    	cardCell.vertex = true;
    	
		var assoc2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;elbow=horizontal;verticalAlign=bottom;endArrow=open;endSize=8;strokeColor=#ff0000;');
		assoc2.geometry.setTerminalPoint(new mxPoint(60, 80), false);
		assoc2.edge = true;
		
		cardCell.insertEdge(assoc2, true);
    	
		content.appendChild(this.createVertexTemplateFromCells([cardCell, assoc2], 120, 40, 'Activity', true));
    	
    	var cardCell = new mxCell('<div style="margin-top:8px;"><b>Composite State</b><hr/>Subtitle</div>', new mxGeometry(0, 0, 160, 60),
			'rounded=1;arcSize=40;overflow=fill;html=1;verticalAlign=top;fillColor=#ffffc0;strokeColor=#ff0000;');
		cardCell.vertex = true;
		
		var assoc2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;elbow=horizontal;verticalAlign=bottom;endArrow=open;endSize=8;strokeColor=#ff0000;');
		assoc2.geometry.setTerminalPoint(new mxPoint(80, 100), false);
		assoc2.edge = true;
		
		cardCell.insertEdge(assoc2, true);
		
		content.appendChild(this.createVertexTemplateFromCells([cardCell, assoc2], 160, 60, 'Composite State', true));
		
    	var cardCell = new mxCell('Condition', new mxGeometry(0, 0, 80, 40),
    		'rhombus;fillColor=#ffffc0;strokeColor=#ff0000;');
    	cardCell.vertex = true;
    	
		var assoc1 = new mxCell('no', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;elbow=horizontal;align=left;verticalAlign=bottom;endArrow=open;endSize=8;strokeColor=#ff0000;');
		assoc1.geometry.setTerminalPoint(new mxPoint(120, 20), false);
		assoc1.geometry.relative = true;
		assoc1.geometry.x = -1;
		assoc1.edge = true;
		
		cardCell.insertEdge(assoc1, true);
    	
		var assoc2 = new mxCell('yes', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;elbow=horizontal;align=left;verticalAlign=top;endArrow=open;endSize=8;strokeColor=#ff0000;');
		assoc2.geometry.setTerminalPoint(new mxPoint(40, 80), false);
		assoc2.geometry.relative = true;
		assoc2.geometry.x = -1;
		assoc2.edge = true;
		
		cardCell.insertEdge(assoc2, true);
		
		content.appendChild(this.createVertexTemplateFromCells([cardCell, assoc1, assoc2], 80, 40, 'Condition', true));
	    
    	var cardCell = new mxCell('', new mxGeometry(0, 0, 200, 10),
			'shape=line;strokeWidth=6;strokeColor=#ff0000;');
		cardCell.vertex = true;
		
		var assoc2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;elbow=horizontal;verticalAlign=bottom;endArrow=open;endSize=8;strokeColor=#ff0000;');
		assoc2.geometry.setTerminalPoint(new mxPoint(100, 50), false);
		assoc2.edge = true;
		
		cardCell.insertEdge(assoc2, true);
	
		content.appendChild(this.createVertexTemplateFromCells([cardCell, assoc2], 200, 10, 'Fork/Join', true));

		content.appendChild(this.createVertexTemplate('ellipse;shape=endState;fillColor=#000000;strokeColor=#ff0000', 30, 30, '', 'End', true));

		var umlLifeline = new mxCell(':Object', new mxGeometry(0, 0, 100, 300), 'shape=umlLifeline;perimeter=lifelinePerimeter;');
		umlLifeline.vertex = true;
     	
    	content.appendChild(this.createVertexTemplateFromCells([umlLifeline], 100, 300, 'Lifeline', true));
    	
    	var classCell1 = new mxCell('', new mxGeometry(100, 0, 20, 70));
     	classCell1.vertex = true;

		var assoc1 = new mxCell('invoke', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;elbow=vertical;verticalAlign=bottom;endArrow=block;');
		assoc1.geometry.setTerminalPoint(new mxPoint(0, 0), true);
		assoc1.edge = true;
		
		classCell1.insertEdge(assoc1, false);

    	content.appendChild(this.createVertexTemplateFromCells([classCell1, assoc1], 120, 70, 'Invocation', true));
    	
     	var classCell1 = new mxCell('', new mxGeometry(100, 0, 20, 70));
     	classCell1.vertex = true;

		var assoc1 = new mxCell('invoke', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;elbow=vertical;verticalAlign=bottom;endArrow=block;');
		assoc1.geometry.setTerminalPoint(new mxPoint(0, 0), true);
		assoc1.edge = true;
		
		classCell1.insertEdge(assoc1, false);
		
		var assoc2 = new mxCell('return', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;elbow=vertical;verticalAlign=bottom;dashed=1;endArrow=open;endSize=8;');
		assoc2.geometry.setTerminalPoint(new mxPoint(0, 70), false);
		assoc2.edge = true;
		
		classCell1.insertEdge(assoc2, true);
		
		var assoc3 = new mxCell('invoke', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;elbow=vertical;align=left;endArrow=open;');
		assoc3.edge = true;
		
		classCell1.insertEdge(assoc3, true);
		classCell1.insertEdge(assoc3, false);
		
    	content.appendChild(this.createVertexTemplateFromCells([classCell1, assoc1, assoc2, assoc3], 120, 70, 'Synchronous Invocation', true));
    	
		var assoc = new mxCell('name', new mxGeometry(0, 0, 0, 0), 'endArrow=block;endFill=1;edgeStyle=orthogonalEdgeStyle;align=left;verticalAlign=top;');
		assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
		assoc.geometry.setTerminalPoint(new mxPoint(160, 0), false);
		assoc.geometry.relative = true;
		assoc.geometry.x = -1;
		assoc.edge = true;
		
    	var sourceLabel = new mxCell('1', new mxGeometry(-1, 0, 0, 0), 'resizable=0;align=left;verticalAlign=bottom;labelBackgroundColor=#ffffff;fontSize=10');
    	sourceLabel.geometry.relative = true;
    	sourceLabel.setConnectable(false);
    	sourceLabel.vertex = true;
    	assoc.insert(sourceLabel);
    	
		content.appendChild(this.createEdgeTemplateFromCells([assoc], 160, 0, 'Relation', true));
		
		var assoc = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;edgeStyle=orthogonalEdgeStyle;');
		assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
		assoc.geometry.setTerminalPoint(new mxPoint(160, 0), false);
		assoc.edge = true;
		
    	var sourceLabel = new mxCell('parent', new mxGeometry(-1, 0, 0, 0), 'resizable=0;align=left;verticalAlign=bottom;labelBackgroundColor=#ffffff;fontSize=10');
    	sourceLabel.geometry.relative = true;
    	sourceLabel.setConnectable(false);
    	sourceLabel.vertex = true;
    	assoc.insert(sourceLabel);
		
    	var targetLabel = new mxCell('child', new mxGeometry(1, 0, 0, 0), 'resizable=0;align=right;verticalAlign=bottom;labelBackgroundColor=#ffffff;fontSize=10');
    	targetLabel.geometry.relative = true;
    	targetLabel.setConnectable(false);
    	targetLabel.vertex = true;
    	assoc.insert(targetLabel);
    	
		content.appendChild(this.createEdgeTemplateFromCells([assoc], 160, 0, 'Association 1', true));
    	
		var assoc = new mxCell('1', new mxGeometry(0, 0, 0, 0), 'endArrow=open;endSize=12;startArrow=diamondThin;startSize=14;startFill=0;edgeStyle=orthogonalEdgeStyle;align=left;verticalAlign=bottom;');
		assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
		assoc.geometry.setTerminalPoint(new mxPoint(160, 0), false);
		assoc.geometry.relative = true;
		assoc.geometry.x = -1;
		assoc.edge = true;
	
		content.appendChild(this.createEdgeTemplateFromCells([assoc], 160, 0, 'Aggregation', true));

		var assoc = new mxCell('1', new mxGeometry(0, 0, 0, 0), 'endArrow=open;endSize=12;startArrow=diamondThin;startSize=14;startFill=1;edgeStyle=orthogonalEdgeStyle;align=left;verticalAlign=bottom;');
		assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
		assoc.geometry.setTerminalPoint(new mxPoint(160, 0), false);
		assoc.geometry.relative = true;
		assoc.geometry.x = -1;
		assoc.edge = true;
		
		content.appendChild(this.createEdgeTemplateFromCells([assoc], 160, 0, 'Composition', true));
		
		var assoc = new mxCell('Relation', new mxGeometry(0, 0, 0, 0), 'endArrow=open;endSize=12;startArrow=diamondThin;startSize=14;startFill=0;edgeStyle=orthogonalEdgeStyle;');
		assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
		assoc.geometry.setTerminalPoint(new mxPoint(160, 0), false);
		assoc.edge = true;
		
    	var sourceLabel = new mxCell('0..n', new mxGeometry(-1, 0, 0, 0), 'resizable=0;align=left;verticalAlign=top;labelBackgroundColor=#ffffff;fontSize=10');
    	sourceLabel.geometry.relative = true;
    	sourceLabel.setConnectable(false);
    	sourceLabel.vertex = true;
    	assoc.insert(sourceLabel);
		
    	var targetLabel = new mxCell('1', new mxGeometry(1, 0, 0, 0), 'resizable=0;align=right;verticalAlign=top;labelBackgroundColor=#ffffff;fontSize=10');
    	targetLabel.geometry.relative = true;
    	targetLabel.setConnectable(false);
    	targetLabel.vertex = true;
    	assoc.insert(targetLabel);
    	
		content.appendChild(this.createEdgeTemplateFromCells([assoc], 160, 0, 'Relation', true));
		
		var assoc = new mxCell('Use', new mxGeometry(0, 0, 0, 0), 'endArrow=open;endSize=12;dashed=1');
		assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
		assoc.geometry.setTerminalPoint(new mxPoint(160, 0), false);
		assoc.edge = true;
		
		content.appendChild(this.createEdgeTemplateFromCells([assoc], 160, 0, 'Dependency', true));
		
		var assoc = new mxCell('Extends', new mxGeometry(0, 0, 0, 0), 'endArrow=block;endSize=16;endFill=0');
		assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
		assoc.geometry.setTerminalPoint(new mxPoint(160, 0), false);
		assoc.edge = true;
		
		content.appendChild(this.createEdgeTemplateFromCells([assoc], 160, 0, 'Generalization'));
		
		var assoc = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=block;startArrow=block;endFill=1;startFill=1');
		assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
		assoc.geometry.setTerminalPoint(new mxPoint(160, 0), false);
		assoc.edge = true;
		
		content.appendChild(this.createEdgeTemplateFromCells([assoc], 160, 0, 'Association 2'));
	}));
};

/**
 * Adds the BPMN library to the sidebar.
 */
Sidebar.prototype.addBpmnPalette = function(dir, expand)
{
	this.addPalette('bpmn', 'BPMN ' + mxResources.get('general'), false, mxUtils.bind(this, function(content)
	{
		content.appendChild(this.createVertexTemplate('shape=ext;rounded=1;', 120, 80, 'Task', 'Process', true));
		content.appendChild(this.createVertexTemplate('shape=ext;rounded=1;double=1;', 120, 80, 'Transaction', 'Transaction', true));
		content.appendChild(this.createVertexTemplate('shape=ext;rounded=1;dashed=1;dashPattern=1 4;', 120, 80, 'Event\nSub-Process', 'Event Sub-Process', true));
		content.appendChild(this.createVertexTemplate('shape=ext;rounded=1;strokeWidth=3;', 120, 80, 'Call Activity', 'Call Activity', true));

		content.appendChild(this.createVertexTemplate('shape=ext;rounded=1;symbol0=plus;symbol0Width=14;symbol0Height=14;symbol0Align=center;symbol0VerticalAlign=bottom;', 120, 80, 'Sub-Process', 'Sub-Process', true));
		content.appendChild(this.createVertexTemplate('shape=ext;rounded=1;symbol0=message;symbol0Width=20;symbol0Height=14;symbol0Align=left;symbol0VerticalAlign=top;symbol0Spacing=4;symbol0ArcSpacing=0.25;', 120, 80, 'Receive', 'Receive Task', true));
		content.appendChild(this.createVertexTemplate('shape=ext;rounded=1;symbol0=actor;symbol0Width=14;symbol0Height=14;symbol0Align=left;symbol0VerticalAlign=top;symbol0Spacing=4;symbol0ArcSpacing=0.25;', 120, 80, 'User', 'User Task', true));
		
		var classCell = new mxCell('Process', new mxGeometry(0, 0, 120, 80),
	    	'rounded=1');
		classCell.vertex = true;
		var classCell1 = new mxCell('', new mxGeometry(1, 1, 30, 30), 'shape=mxgraph.bpmn.timer_start;perimeter=ellipsePerimeter;');
		classCell1.vertex = true;
		classCell1.geometry.relative = true;
		classCell1.geometry.offset = new mxPoint(-40, -15);
		classCell.insert(classCell1);
		
		content.appendChild(this.createVertexTemplateFromCells([classCell], 120, 80, 'Attached Timer Event', true));

		content.appendChild(this.createVertexTemplate('swimlane;horizontal=0;startSize=20', 320, 240, 'Pool', 'Pool', true));
		content.appendChild(this.createVertexTemplate('swimlane;horizontal=0;swimlaneFillColor=white;swimlaneLine=0;', 300, 120, 'Lane', 'Lane', true));
		
		content.appendChild(this.createVertexTemplate('shape=hexagon', 60, 50, '', 'Conversation', true));
		content.appendChild(this.createVertexTemplate('shape=hexagon;strokeWidth=4', 60, 50, '', 'Call Conversation', true));
		
	    var classCell = new mxCell('', new mxGeometry(0, 0, 40, 30), 'shape=message');
    	classCell.vertex = true;

		content.appendChild(this.createVertexTemplateFromCells([classCell], 40, 30, 'Message', true));
		
	    var classCell = new mxCell('', new mxGeometry(0, 0, 14, 14), 'shape=plus;resizable=0;');
	    classCell.connectable = false;
    	classCell.vertex = true;

		content.appendChild(this.createVertexTemplateFromCells([classCell], 14, 14, 'Sub-Process Marker', true));

		var assoc = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=block;endFill=1;endSize=6');
		assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
		assoc.geometry.setTerminalPoint(new mxPoint(100, 0), false);
		assoc.edge = true;

		content.appendChild(this.createEdgeTemplateFromCells([assoc], 100, 0, 'Sequence Flow', true));
		
		var assoc = new mxCell('', new mxGeometry(0, 0, 0, 0), 'startArrow=dash;startSize=8;endArrow=block;endFill=1;endSize=6');
		assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
		assoc.geometry.setTerminalPoint(new mxPoint(100, 0), false);
		assoc.edge = true;
		
		content.appendChild(this.createEdgeTemplateFromCells([assoc], 100, 0, 'Default Flow', true));
		
		var assoc = new mxCell('', new mxGeometry(0, 0, 0, 0), 'startArrow=diamondThin;startFill=0;startSize=14;endArrow=block;endFill=1;endSize=6');
		assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
		assoc.geometry.setTerminalPoint(new mxPoint(100, 0), false);
		assoc.edge = true;
		
		content.appendChild(this.createEdgeTemplateFromCells([assoc], 100, 0, 'Conditional Flow', true));
		
		var assoc = new mxCell('', new mxGeometry(0, 0, 0, 0), 'startArrow=oval;startFill=0;startSize=7;endArrow=block;endFill=0;endSize=10;dashed=1');
		assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
		assoc.geometry.setTerminalPoint(new mxPoint(100, 0), false);
		assoc.edge = true;

		content.appendChild(this.createEdgeTemplateFromCells([assoc], 100, 0, 'Message Flow 1'));

		var assoc = new mxCell('', new mxGeometry(0, 0, 0, 0), 'startArrow=oval;startFill=0;startSize=7;endArrow=block;endFill=0;endSize=10;dashed=1');
		assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
		assoc.geometry.setTerminalPoint(new mxPoint(100, 0), false);
		assoc.edge = true;
		
    	var sourceLabel = new mxCell('', new mxGeometry(0, 0, 20, 14), 'shape=message');
    	sourceLabel.geometry.relative = true;
    	sourceLabel.setConnectable(false);
    	sourceLabel.vertex = true;
    	sourceLabel.geometry.offset = new mxPoint(-10, -7);
    	assoc.insert(sourceLabel);

		content.appendChild(this.createEdgeTemplateFromCells([assoc], 100, 0, 'Message Flow 2', true));
		
		var assoc = new mxCell('', new mxGeometry(0, 0, 0, 0), 'shape=link');
		assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
		assoc.geometry.setTerminalPoint(new mxPoint(100, 0), false);
		assoc.edge = true;

		content.appendChild(this.createEdgeTemplateFromCells([assoc], 100, 0, 'Link', true));
	}));
};

/**
 * Creates and returns the given title element.
 */
Sidebar.prototype.createTitle = function(label)
{
	var elt = document.createElement('a');
	elt.setAttribute('href', 'javascript:void(0);');
	elt.setAttribute('title', label);
	elt.className = 'geTitle';
	mxUtils.write(elt, label);

	return elt;
};

/**
 * Creates a thumbnail for the given cells.
 */
Sidebar.prototype.createThumb = function(cells, width, height, parent, title, showLabel)
{
	this.graph.labelsVisible = (showLabel == null || showLabel);
	this.graph.view.scaleAndTranslate(1, 0, 0);
	this.graph.addCells(cells);
	var bounds = this.graph.getGraphBounds();
	var corr = this.thumbBorder;
	var s = Math.round(Math.min((width - 2) / (bounds.width - bounds.x + corr),
		(height - 2) / (bounds.height - bounds.y + corr)) * 100) / 100;
	var x0 = -Math.min(bounds.x, 0);
	var y0 = -Math.min(bounds.y, 0);
	this.graph.view.scaleAndTranslate(s, x0, y0);
	
	bounds = this.graph.getGraphBounds();
	var dx = Math.max(0, Math.floor((width - bounds.width - bounds.x) / 2));
	var dy = Math.max(0, Math.floor((height - bounds.height - bounds.y) / 2));

	var node = null;
	
	// For supporting HTML labels in IE9 standards mode the container is cloned instead
	if (this.graph.dialect == mxConstants.DIALECT_SVG && !mxClient.NO_FO)
	{
		node = this.graph.view.getCanvas().ownerSVGElement.cloneNode(true);
	}
	// LATER: Check if deep clone can be used for quirks if container in DOM
	else
	{
		node = this.graph.container.cloneNode(false);
		node.innerHTML = this.graph.container.innerHTML;
	}
	
	this.graph.getModel().clear();
	
	// Catch-all event handling
	if (mxClient.IS_IE6)
	{
		parent.style.backgroundImage = 'url(' + this.editorUi.editor.transparentImage + ')';
	}
	
	var dd = 3;
	node.style.position = 'relative';
	node.style.overflow = 'hidden';
	node.style.cursor = 'pointer';
	node.style.left = (dx + dd) + 'px';
	node.style.top = (dy + dd) + 'px';
	node.style.width = width + 'px';
	node.style.height = height + 'px';
	node.style.visibility = '';
	node.style.minWidth = '';
	node.style.minHeight = '';
	
	parent.appendChild(node);
	
	// Adds title for sidebar entries
	if (this.sidebarTitles && title != null)
	{
		var border = (mxClient.IS_QUIRKS) ? 2 * this.thumbPadding + 2: 0;
		parent.style.height = (this.thumbHeight + border + this.sidebarTitleSize + 8) + 'px';
		
		var div = document.createElement('div');
		div.style.fontSize = this.sidebarTitleSize + 'px';
		div.style.textAlign = 'center';
		div.style.whiteSpace = 'nowrap';
		
		if (mxClient.IS_IE)
		{
			div.style.height = (this.sidebarTitleSize + 12) + 'px';
		}

		div.style.paddingTop = '4px';
		mxUtils.write(div, title);
		parent.appendChild(div);
	}
};

/**
 * Creates and returns a new palette item for the given image.
 */
Sidebar.prototype.createItem = function(cells, title, showLabel)
{
	var elt = document.createElement('a');
	elt.setAttribute('href', 'javascript:void(0);');
	elt.className = 'geItem';
	elt.style.overflow = 'hidden';
	var border = (mxClient.IS_QUIRKS) ? 8 + 2 * this.thumbPadding : 6;
	elt.style.width = (this.thumbWidth + border) + 'px';
	elt.style.height = (this.thumbHeight + border) + 'px';
	elt.style.padding = this.thumbPadding + 'px';
	
	// Blocks default click action
	mxEvent.addListener(elt, 'click', function(evt)
	{
		mxEvent.consume(evt);
	});

	this.createThumb(cells, this.thumbWidth, this.thumbHeight, elt, title, showLabel);
	
	return elt;
};

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createDropHandler = function(cells, allowSplit)
{
	return function(graph, evt, target, x, y)
	{
		if (graph.isEnabled())
		{
			cells = graph.getImportableCells(cells);
			
			if (cells.length > 0)
			{
				var validDropTarget = (target != null) ? graph.isValidDropTarget(target, cells, evt) : false;
				var select = null;
				
				if (target != null && !validDropTarget)
				{
					target = null;
				}
				
				// Splits the target edge or inserts into target group
				if (allowSplit && graph.isSplitEnabled() && graph.isSplitTarget(target, cells, evt))
				{
					graph.splitEdge(target, cells, null, x, y);
					select = cells;
				}
				else if (cells.length > 0)
				{
					select = graph.importCells(cells, x, y, target);
				}
				
				if (select != null && select.length > 0)
				{
					graph.scrollCellToVisible(select[0]);
					graph.setSelectionCells(select);
				}
			}
			
			mxEvent.consume(evt);
		}
	};
};

/**
 * Creates and returns a preview element for the given width and height.
 */
Sidebar.prototype.createDragPreview = function(width, height)
{
	var elt = document.createElement('div');
	elt.style.border = '1px dashed black';
	elt.style.width = width + 'px';
	elt.style.height = height + 'px';
	
	return elt;
};

/**
 * Creates a drag source for the given element.
 */
Sidebar.prototype.createDragSource = function(elt, dropHandler, preview)
{
	var dragSource = mxUtils.makeDraggable(elt, this.editorUi.editor.graph, dropHandler,
		preview, 0, 0, this.editorUi.editor.graph.autoscroll, true, true);
	
	// Overrides mouseDown to ignore popup triggers
	var mouseDown = dragSource.mouseDown;
	
	dragSource.mouseDown = function(evt)
	{
		if (!mxEvent.isPopupTrigger(evt))
		{
			mouseDown.apply(this, arguments);
		}
	};

	// Allows drop into cell only if target is a valid root
	dragSource.getDropTarget = function(graph, x, y)
	{
		var target = mxDragSource.prototype.getDropTarget.apply(this, arguments);
		
		if (target != null)
		{
			// Selects parent group as drop target
			var model = graph.getModel();
			
			if (!graph.isValidRoot(target) && model.isVertex(model.getParent(target)))
			{
				target = model.getParent(target);
			}
			
			if (!graph.isValidRoot(target) && graph.getModel().getChildCount(target) == 0)
			{
				target = null;
			}
		}
		
		return target;
	};
	
	return dragSource;
};

/**
 * Adds a handler for inserting the cell with a single click.
 */
Sidebar.prototype.itemClicked = function(cells, ds, evt)
{
	var graph = this.editorUi.editor.graph;
	var gs = graph.getGridSize();
	var dx = graph.container.scrollLeft - graph.view.translate.x;
	var dy = graph.container.scrollTop - graph.view.translate.y;
	ds.drop(graph, evt, null, graph.snap(dx + gs), graph.snap(dy + gs));
};

/**
 * Adds a handler for inserting the cell with a single click.
 */
Sidebar.prototype.addClickHandler = function(elt, ds, cells)
{
	var graph = this.editorUi.editor.graph;
	var oldMouseUp = ds.mouseUp;
	var first = null;
	
	mxEvent.addGestureListeners(elt, function(evt)
	{
		first = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));
	});
	
	ds.mouseUp = mxUtils.bind(this, function(evt)
	{
		if (!mxEvent.isPopupTrigger(evt) && this.currentGraph == null && first != null)
		{
			var tol = graph.tolerance;
			
			if (Math.abs(first.x - mxEvent.getClientX(evt)) <= tol &&
				Math.abs(first.y - mxEvent.getClientY(evt)) <= tol)
			{
				this.itemClicked(cells, ds, evt);
			}
		}

		oldMouseUp.apply(ds, arguments);
		first = null;
		
		// Blocks tooltips on this element after single click
		this.currentElt = elt;
	});
};

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createVertexTemplate = function(style, width, height, value, title, showLabel)
{
	var cells = [new mxCell((value != null) ? value : '', new mxGeometry(0, 0, width, height), style)];
	cells[0].vertex = true;
	
	return this.createVertexTemplateFromCells(cells, width, height, title, showLabel);
};

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createVertexTemplateFromCells = function(cells, width, height, title, showLabel)
{
	var elt = this.createItem(cells, title, showLabel);
	var ds = this.createDragSource(elt, this.createDropHandler(cells, true), this.createDragPreview(width, height));
	this.addClickHandler(elt, ds, cells);

	// Uses guides for vertices only if enabled in graph
	ds.isGuidesEnabled = mxUtils.bind(this, function()
	{
		return this.editorUi.editor.graph.graphHandler.guidesEnabled;
	});

	// Shows a tooltip with the rendered cell
	if (!mxClient.IS_IOS)
	{
		mxEvent.addGestureListeners(elt, null, mxUtils.bind(this, function(evt)
		{
			if (mxEvent.isMouseEvent(evt))
			{
				this.showTooltip(elt, cells, width, height, title, showLabel);
			}
		}));
	}
	
	return elt;
};

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createEdgeTemplate = function(style, width, height, value, title, showLabel)
{
	var cells = [new mxCell((value != null) ? value : '', new mxGeometry(0, 0, width, height), style)];
	cells[0].geometry.setTerminalPoint(new mxPoint(0, height), true);
	cells[0].geometry.setTerminalPoint(new mxPoint(width, 0), false);
	cells[0].geometry.relative = true;
	cells[0].edge = true;
	
	return this.createEdgeTemplateFromCells(cells, width, height, title, showLabel);
};

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createEdgeTemplateFromCells = function(cells, width, height, title, showLabel)
{
	var elt = this.createItem(cells, title, showLabel);
	this.createDragSource(elt, this.createDropHandler(cells, false), this.createDragPreview(width, height));

	// Installs the default edge
	var graph = this.editorUi.editor.graph;
	mxEvent.addListener(elt, 'click', mxUtils.bind(this, function(evt)
	{
		if (this.installEdges)
		{
			graph.setDefaultEdge(cells[0]);
		}
		
		// Highlights the entry for 200ms
		elt.style.backgroundColor = '#ffffff';
		
		window.setTimeout(function()
		{
			elt.style.backgroundColor = '';
		}, 300);
	    
	    mxEvent.consume(evt);
	}));

	// Shows a tooltip with the rendered cell
	if (!mxClient.IS_IOS)
	{
		mxEvent.addGestureListeners(elt, null, mxUtils.bind(this, function(evt)
		{
			if (mxEvent.isMouseEvent(evt))
			{
				this.showTooltip(elt, cells, width, height, title, showLabel);
			}
		}));
	}
	
	return elt;
};

/**
 * Adds the given palette.
 */
Sidebar.prototype.addPalette = function(id, title, expanded, onInit)
{
	var elt = this.createTitle(title);
	this.container.appendChild(elt);
	
	var div = document.createElement('div');
	div.className = 'geSidebar';
	
	if (expanded)
	{
		onInit(div);
		onInit = null;
	}
	else
	{
		div.style.display = 'none';
	}
	
    this.addFoldingHandler(elt, div, onInit);
	
	var outer = document.createElement('div');
    outer.appendChild(div);
    this.container.appendChild(outer);
    
    // Keeps references to the DOM nodes
    if (id != null)
    {
    	this.palettes[id] = [elt, outer];
    }
};

/**
 * Create the given title element.
 */
Sidebar.prototype.addFoldingHandler = function(title, content, funct)
{
	var initialized = false;

	// Avoids mixed content warning in IE6-8
	if (!mxClient.IS_IE || document.documentMode >= 8)
	{
		title.style.backgroundImage = (content.style.display == 'none') ?
			'url(' + IMAGE_PATH + '/collapsed.gif)' : 'url(' + IMAGE_PATH + '/expanded.gif)';
	}
	
	title.style.backgroundRepeat = 'no-repeat';
	title.style.backgroundPosition = '0% 50%';
	
	mxEvent.addListener(title, 'click', function(evt)
	{
		if (content.style.display == 'none')
		{
			if (!initialized)
			{
				initialized = true;
				
				if (funct != null)
				{
					// Wait cursor does not show up on Mac
					title.style.cursor = 'wait';
					var prev = title.innerHTML;
					title.innerHTML = mxResources.get('loading') + '...';
					
					window.setTimeout(function()
					{
						funct(content);
						title.style.cursor = '';
						title.innerHTML = prev;
					}, 0);
				}
			}
			
			title.style.backgroundImage = 'url(' + IMAGE_PATH + '/expanded.gif)';
			content.style.display = 'block';
		}
		else
		{
			title.style.backgroundImage = 'url(' + IMAGE_PATH + '/collapsed.gif)';
			content.style.display = 'none';
		}
		
		mxEvent.consume(evt);
	});
};

/**
 * Removes the palette for the given ID.
 */
Sidebar.prototype.removePalette = function(id)
{
	var elts = this.palettes[id];
	
	if (elts != null)
	{
		this.palettes[id] = null;
		
		for (var i = 0; i < elts.length; i++)
		{
			this.container.removeChild(elts[i]);
		}
		
		return true;
	}
	
	return false;
};

/**
 * Adds the given image palette.
 */
Sidebar.prototype.addImagePalette = function(id, title, prefix, postfix, items, titles)
{
	this.addPalette(id, title, false, mxUtils.bind(this, function(content)
    {
		var showTitles = titles != null;
		
    	for (var i = 0; i < items.length; i++)
		{
			var icon = prefix + items[i] + postfix;
			content.appendChild(this.createVertexTemplate('image;image=' + icon, 80, 80, '', (showTitles) ? titles[i] : null, showTitles));
		}
    }));
};

/**
 * Adds the given stencil palette.
 */
Sidebar.prototype.addStencilPalette = function(id, title, stencilFile, style, ignore, onInit, scale)
{
	scale = (scale != null) ? scale : 1;
	
	this.addPalette(id, title, false, mxUtils.bind(this, function(content)
    {
		if (style == null)
		{
			style = '';
		}
		
		if (onInit != null)
		{
			onInit.call(this, content);
		}

		mxStencilRegistry.loadStencilSet(stencilFile, mxUtils.bind(this, function(packageName, stencilName, displayName, w, h)
		{
			if (ignore == null || mxUtils.indexOf(ignore, stencilName) < 0)
			{
				content.appendChild(this.createVertexTemplate('shape=' + packageName + stencilName.toLowerCase() + style,
					Math.round(w * scale), Math.round(h * scale), '', stencilName.replace(/_/g, ' '), true));
			}
		}), true);
    }));
};

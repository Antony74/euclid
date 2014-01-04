
var propositionObjects = {};
var textObjects = {};
var diagramObjects = {};

var declareProposition = function(sPropID, objProp)
{
    propositionObjects[sPropID] = objProp;
}

var declareText = function(_nBook, _nProp, _nLine, _arrElms)
{
    var textObj =
    {
        'nBook':   _nBook,
        'nProp':   _nProp,
        'nLine':   _nLine,
        'arrElms': _arrElms,
        'getPropID': function()
        {
            return "#prop" + this.nBook.toString() + "_" + this.nProp.toString();
        },
        'getTextID': function()
        {
            return this.getPropID() + "_" + _nLine.toString();
        },
    };

    textObjects[textObj.getTextID()] = textObj;
}

var declareDiagram = function(_sDiagramID, _sPropID)
{
    diagramObjects[_sDiagramID] =
    {
        'sDiagramID':   _sDiagramID,
        'sPropID': _sPropID,
    };
}

var createMoveablePoint = function(_x, _y, _align)
{
    function Point()
    {
        this.x = _x;
        this.y = _y;
        this.align = _align;
        this.selected = false;
        this.moveable = true;
        
        this.draw = function(processing)
        {
            processing.noStroke();

            if (this.moveable == true)
                processing.fill(255, 0, 0, 200);
            else
                processing.fill(0, 255, 0, 200);

            processing.rect(this.x, this.y, 10, 10);

            processing.fill(0);

            var xAdj = -5;
            var yAdj = 5;

            if (this.align == 'left')
                xAdj = -13;
            else if (this.align == 'right')
                xAdj = 6;
            else if (this.align == 'top')
                yAdj = -8;
            else
                yAdj = 18;

            var adjustment = 18;
            processing.text(this.name, this.x + xAdj, this.y + yAdj);
        };

        this.hitTest = function(_x, _y)
        {
            var radius = 5;
            if (this.x >= _x - radius && this.x <= _x + radius
            &&  this.y >= _y - radius && this.y <= _y + radius)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }

    return new Point;
}

var createPoint = function(_align)
{
    var point = createMoveablePoint(0, 0, _align);
    point.moveable = false;
    return point;
}

var createLine = function(_pt1, _pt2)
{
    var line =
    {
        'pt1': _pt1,
        'pt2': _pt2,
        'selected': false,
        'moveable': false,

        'draw': function(processing)
        {
            if (this.selected)
            {
                processing.strokeWeight(3);
            }
            else
            {
                processing.strokeWeight(1);
            }

            processing.stroke(0);
            processing.line(this.pt1.x, this.pt1.y, this.pt2.x, this.pt2.y);
        },
    };

    return line;
}

var createCircle = function(_pt, _radius, _align)
{
    var circle =
    {
        'pt': _pt,
        'radius': _radius,
        'align': _align,
        'selected': false,
        'moveable': false,

        'draw': function(processing)
        {
            if (this.selected)
            {
                processing.strokeWeight(3);
            }
            else
            {
                processing.strokeWeight(1);
            }

            processing.noFill();
            processing.stroke(0);
            processing.ellipse(this.pt.x, this.pt.y, this.radius * 2.0, this.radius * 2.0);

            processing.fill(0);
            processing.text(this.name, this.pt.x - 5, this.pt.y + this.radius + 12.0);
        },
    };

    return circle;
}

var dist = function(pt1, pt2)
{
    var distx = pt2.x - pt1.x;
    var disty = pt2.y - pt1.y;
    return Math.sqrt((distx * distx) + (disty * disty));
}

var updateEquilateral = function(pt1, pt2, pt3, align)
{
    var distx = pt2.x - pt1.x;
    var disty = pt2.y - pt1.y;
    var dist12 = dist(pt1, pt2);
    var angle = Math.atan2(disty, distx);
    if (align == 'right')
        angle += 1.0 * Math.PI / 3.0;
    else
        angle -= 1.0 * Math.PI / 3.0;
    pt3.x = pt1.x + (dist12 * Math.cos(angle));
    pt3.y = pt1.y + (dist12 * Math.sin(angle));
}

$(document).ready(function()
{
    for (var sPropID in propositionObjects)
    {
        $(sPropID + ">.pp").addClass("hidden");
        $(sPropID + ">.propTitle").after("[<a class='hideButton' href='" + sPropID + "'>show</a>]");
    }

    $('.hideButton').click(function(event)
    {
        var sPropID = $(event.target).attr('href');
    
        if ($(sPropID + ">.pp").hasClass("hidden"))
        {
            $(sPropID + ">.pp").removeClass("hidden");
            $(event.target).html("hide");
        }
        else
        {
            $(sPropID + ">.pp").addClass("hidden");
            $(event.target).html("show");
        }
        return false;
    });

    for (var nDiagram in diagramObjects)
    {
        var diagram = diagramObjects[nDiagram];
        var canvas = document.getElementById(diagram.sDiagramID);

        diagram.processing = new Processing(canvas, function(processing)
        {
            processing.sPropID = diagram.sPropID;
        
            processing.setup = function()
            {
                processing.size(300, 300);
                processing.rectMode(processing.CENTER);

                $(processing.sPropID).click(function(event)
                {
                    var bSelected = $(event.target).hasClass('selected');

                    // De-select all text
                    $(this).children('.propTitle').removeClass('selected');
                    $(this).children('.pp').removeClass('selected');

                    // Maybe select some text
                    if (bSelected == false)
                    {
                        if ($(event.target).hasClass('pp')
                        ||  $(event.target).hasClass('propTitle'))
                        {
                            $(event.target).addClass('selected');
                        }
                    }
                    
                    processing.loop();                
                });

                for (var nText in textObjects)
                {
                    $(textObjects[nText].getTextID()).bind('click', function(event)
                    {
                        var sID = '#' + $(event.target).attr('id');

                        var textObj = textObjects[sID];
                        var elms = propositionObjects[textObj.getPropID()].elms;

                        // De-select all diagram items
                        for (var sElm in elms)
                        {
                            elms[sElm].selected = false;
                        }

                        // Select any diagram items associated with this text
                        var bSelected = $(event.target).hasClass('selected');

                        if (bSelected == false) // Yes that does look the wrong way round,
                        {                       // I guess the other 'click' function hasn't run yet.
                            for(var nElm in textObj.arrElms)
                            {
                                var sElm = textObj.arrElms[nElm];
                                elms[sElm].selected = true;
                            }
                        }

                        processing.loop();                
                    });
                }

            }
            
            processing.mouseDragged = function()
            {
                var prop = propositionObjects[processing.sPropID];
                var elms = prop.elms;

                for(var sElm in elms)
                {
                    var elm = elms[sElm];
                    if (elm.moveable && elm.hitTest(processing.pmouseX, processing.pmouseY))
                    {
                        elm.x = processing.mouseX;
                        elm.y = processing.mouseY;
                        processing.loop();
                        break;
                    }
                }
            }

            processing.draw = function()
            {
                processing.background(200);
                
                var prop = propositionObjects[processing.sPropID];
                var elms = prop.elms;
                
                prop.update();

                for (var nPass = 0; nPass < 2; ++nPass)
                {
                    for(var sElm in elms)
                    {
                        var elm = elms[sElm];
                        elm.name = sElm;

                        if (  (nPass == 0 && elm.constructor.name != "Point")
                        ||    (nPass == 1 && elm.constructor.name == "Point")  )
                        {
                            elm.draw(processing);
                        }
                    }
                }
                
                processing.noLoop();
            }
        });
    }
});


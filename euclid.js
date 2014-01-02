
var propositions = {};
var arrText = [];
var arrDiagram = [];

var declareProposition = function(sProp, objProp)
{
    propositions[sProp] = objProp;
}

var declareText = function(_nBook, _nProp, _nLine, _arrElms)
{
    arrText.push(
    {
        'nBook':   _nBook,
        'nProp':   _nProp,
        'nLine':   _nLine,
        'arrElms': _arrElms,
    });
}

var declareDiagram = function(_sID, _sProp)
{
    arrDiagram.push(
    {
        'sID':   _sID,
        'sProp': _sProp,
    });
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
            processing.fill(255, 0, 0, 200);
            processing.rect(this.x, this.y, 10, 10);

            processing.fill(0);
//            var adjustment = this.alignTop ? -8 : 18;
            var adjustment = 18;
            processing.text(this.name, this.x - 5, this.y + adjustment);
        };
    }

    return new Point;
}

var createPoint = function(_align)
{
    var point = createMoveablePoint(0, 0, _align);
    point.moveable = false;
    return point;
}

$(document).ready(function()
{
    for (var nDiagram in arrDiagram)
    {
        var diagram = arrDiagram[nDiagram];
    
        var canvas = document.getElementById(diagram.sID);
        diagram.processing = new Processing(canvas, function(processing)
        {
            processing.setup = function()
            {
                processing.size(300,300);
                processing.rectMode(processing.CENTER);
            }
            
            processing.draw = function()
            {
                processing.background(200);
                
                var elms = propositions[diagram.sProp].elms;
                
                for(var sElm in elms)
                {
                    var elm = elms[sElm];
                    elm.name = sElm;
                    elm.draw(processing);
                }
                
                processing.noLoop();
            }
        });
    }
});

/*
        function createLine(_pt1, _pt2)
        {
            var line =
            {
                'pt1': _pt1,
                'pt2': _pt2,
                'selected': false,
                'draw': function()
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

        function createCircle(_pt, _radius)
        {
            var circle =
            {
                'pt': _pt,
                'radius': _radius,
                'selected': false,
                'draw': function()
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
                    processing.text(this.name, this.pt.x - 5, this.pt.y + this.radius + 10.0);
                },
            };
            return circle;
        }

        var myAngle = -1.0 * Math.PI / 3.0;

        var elms = {};
        elms.AB = null;
        elms.BC = null;
        elms.AC = null;
        elms.D = null;
        elms.E = null;
        elms.A = new Point(110, 150);
        elms.B = new Point(190, 150);
        elms.C = new Point(110 + (80*Math.cos(myAngle)), 150 + (80*Math.sin(myAngle)));
        elms.C.alignTop = true;
        elms.AB = createLine(elms.A, elms.B);
        elms.BC = createLine(elms.B, elms.C);
        elms.AC = createLine(elms.A, elms.C);
        elms.D = createCircle(elms.A, 80);
        elms.E = createCircle(elms.B, 80);

        for(var elm in elms)
        {
            elms[elm].name = elm;
        }

        processing.setup = function()
        {
            processing.size(300,300);
            processing.rectMode(processing.CENTER);

            $('#prop1_1').bind('click', function(event)
            {
                var bSelected = $(event.target).hasClass('selected');

                // De-select everything
                $(this).children('div').removeClass('selected');

                for(var elm in elms)
                {
                    elms[elm].selected = false;
                }

                // Maybe select something
                if (bSelected == false && $(event.target).hasClass('pp'))
                {
                    $(event.target).addClass('selected');
                }                
            });
        }
        
        processing.draw = function()
        {
            processing.background(200);

            for(var elm in elms)
            {
                elms[elm].draw();
            }
        }
    });

});
*/

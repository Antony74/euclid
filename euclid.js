$(document).ready(function()
{
    var canvas = document.getElementById("canvas1");
    var processingInstance = new Processing(canvas, function(processing)
    {
        function createPoint(_x, _y)
        {
            var point = 
            {
               'x': _x,
               'y': _y,
               'alignTop': false,
               'selected': false,
               'draw': function()
               {
                    processing.noStroke();
                    processing.fill(255, 0, 0, 200);
                    processing.rect(this.x, this.y, 10, 10);

                    processing.fill(0);
                    var adjustment = this.alignTop ? -8 : 18;
                    processing.text(this.name, this.x - 5, this.y + adjustment);
               },
            };
            return point;
        }

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
        elms.A = createPoint(110, 150);
        elms.B = createPoint(190, 150);
        elms.C = createPoint(110 + (80*Math.cos(myAngle)), 150 + (80*Math.sin(myAngle)));
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
                
                    if ($(event.target).hasClass('line1'))
                    {
                        elms.D.selected = true;
                        elms.AB.selected = true;
                    }
                    else if ($(event.target).hasClass('line2'))
                    {
                        elms.E.selected = true;
                        elms.AB.selected = true;
                    }
                    else if ($(event.target).hasClass('line3'))
                    {
                        elms.BC.selected = true;
                        elms.AC.selected = true;
                    }
                    else if ($(event.target).hasClass('line4'))
                    {
                        elms.AB.selected = true;
                        elms.BC.selected = true;
                        elms.AC.selected = true;
                    }
                    else if ($(event.target).hasClass('line5'))
                    {
                        elms.AB.selected = true;
                        elms.AC.selected = true;
                        elms.D.selected = true;
                    }
                    else if ($(event.target).hasClass('line6'))
                    {
                        elms.BC.selected = true;
                        elms.AB.selected = true;
                        elms.E.selected = true;
                    }
                    else if ($(event.target).hasClass('line7'))
                    {
                        elms.AB.selected = true;
                        elms.BC.selected = true;
                        elms.AC.selected = true;
                    }
                    else if ($(event.target).hasClass('line8'))
                    {
                        elms.AB.selected = true;
                        elms.BC.selected = true;
                        elms.AC.selected = true;
                    }
                    else if ($(event.target).hasClass('line9'))
                    {
                        elms.AB.selected = true;
                        elms.BC.selected = true;
                        elms.AC.selected = true;
                    }
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


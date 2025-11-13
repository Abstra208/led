#!/usr/bin/env python
# -*- coding: utf-8 -*-
from samplebase import SampleBase
from rgbmatrix import graphics
from random import randint
from io import open
import time
import json

class RunText(SampleBase):
    def __init__(self, *args, **kwargs):
        super(RunText, self).__init__(*args, **kwargs)

    def run(self):
        #---Default Variables---
        mode = 0
        drawing = 0
        message = ""
        colorr = 255
        colorg = 255
        colorb = 255
        rdmColors = 0
        moving = 1
        doorState = 'Opened'
        #-----------------------
        offscreen_canvas = self.matrix.CreateFrameCanvas()
        print(offscreen_canvas)
        font = graphics.Font()
        font.LoadFont("10x20.bdf")
        textColor = graphics.Color(255, 255, 255)
        height = 21
        pos = offscreen_canvas.width
        i = 0
        my_text = ""

        while True:
            if i > 20:
                i = 0
                #Send door state
                with open("matriceStatus.json", "r", encoding="utf-8") as file:
                    lines = file.read()
                try:
                    msg = json.loads(lines)
                    mode = int(msg["mode"])
                    drawing = int(msg["drawing"])
                    message = msg["message"]
                    colorr = int(msg["colorr"])
                    colorg = int(msg["colorg"])
                    colorb = int(msg["colorb"])
                    rdmColors = int(msg["rdmColors"])
                    moving = int(msg["moving"])
                except:
                    print("Could not get all variables")

                color = graphics.Color(colorr,colorg,colorb)
                print(mode,drawing,message,colorr,colorg,colorb,rdmColors,moving)

            if mode == 1:
                if moving == 0:
                    pos = 3
                if drawing == 0:
                    my_text = message
                    textColor = color
                    if rdmColors == 1:
                        textColor = graphics.Color(randint(0, 255), randint(0, 255), randint(0, 255))
                elif drawing == 1:
                    my_text = "Ouvert"
                    textColor = graphics.Color(0,255,0)
                elif drawing == 2:
                    my_text = "Fermé".decode('utf-8')
                    textColor = graphics.Color(255,0,0)
                elif drawing == 3:
                    textColor = color
                    if rdmColors == 1:
                        textColor = graphics.Color(randint(0, 255), randint(0, 255), randint(0, 255))
            else:
                if doorState == 'Opened':
                    my_text = "Ouvert"
                    textColor = graphics.Color(0,255,0)
                elif doorState == 'Closed':
                    my_text = "Fermé".decode('utf-8')
                    textColor = graphics.Color(255,0,0)

            offscreen_canvas.Clear()
            if drawing == 3:
                graphics.DrawCircle(offscreen_canvas, 32, 15, 15, textColor)
                graphics.DrawCircle(offscreen_canvas, 32, 15, 14, textColor)
                graphics.DrawCircle(offscreen_canvas, 32, 15, 13, textColor)
                graphics.DrawCircle(offscreen_canvas, 32, 15, 12, textColor)
                graphics.DrawCircle(offscreen_canvas, 32, 15, 11, textColor)
                graphics.DrawCircle(offscreen_canvas, 32, 15, 10, textColor)
                graphics.DrawCircle(offscreen_canvas, 32, 15, 9, textColor)
                graphics.DrawCircle(offscreen_canvas, 32, 15, 8, textColor)
                graphics.DrawCircle(offscreen_canvas, 32, 15, 7, textColor)
                graphics.DrawCircle(offscreen_canvas, 32, 15, 6, textColor)
                graphics.DrawCircle(offscreen_canvas, 32, 15, 5, textColor)
                graphics.DrawCircle(offscreen_canvas, 32, 15, 4, textColor)
                graphics.DrawCircle(offscreen_canvas, 32, 15, 3, textColor)
                graphics.DrawCircle(offscreen_canvas, 32, 15, 2, textColor)
                graphics.DrawCircle(offscreen_canvas, 32, 15, 1, textColor)
            else:
                len = graphics.DrawText(offscreen_canvas, font, pos, height, textColor, my_text)

            pos -= 1
            if (pos + len < 0):
                pos = offscreen_canvas.width
            i += 1
            time.sleep(0.02)
            offscreen_canvas = self.matrix.SwapOnVSync(offscreen_canvas)


# Main function
if __name__ == "__main__":
    run_text = RunText()
    if (not run_text.process()):
        run_text.print_help()

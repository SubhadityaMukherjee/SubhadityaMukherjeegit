import re
import os
_src = "/media/hdd/github/SubhadityaMukherjeegit/artworks/"
_ext = ".png"

lookin = [x for x in os.listdir(_src) if "png" in x]
no = 1
for num,filename in enumerate(lookin):
    os.rename(_src+filename , f"{_src}rename-{str(no)}.png")
    no += 1
    
    

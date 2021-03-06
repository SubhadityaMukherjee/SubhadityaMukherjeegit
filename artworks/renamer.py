import re
import os
_src = "/media/hdd/github/SubhadityaMukherjeegit/artworks/"
_ext = ".png"

endsWithNumber = re.compile(r'(\d+)'+(re.escape(_ext))+'$')
lookin = [_src+x for x in os.listdir(_src) if "png" in x]
for filename in lookin:
    m = endsWithNumber.search(filename)
    if m:
        os.rename(filename, _src+'rename-' + str(m.group(1)).zfill(3)+_ext)
    else:
        os.rename(filename, _src+'rename-' + str(0).zfill(3)+_ext)

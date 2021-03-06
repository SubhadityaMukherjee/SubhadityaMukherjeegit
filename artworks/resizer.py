import os
from tqdm import tqdm

tem = os.listdir(".")


def sizer(x):
    return os.path.getsize(x)/(1024*1024)


for i in tqdm(tem):
    if "rename" not in i:
        cursize = sizer(i)
        #  print(cursize)
        if cursize >= 2 and cursize <= 3:
            os.system(f"convert {i} -resize 80% resized_{i}")
        elif cursize >= 3 and cursize <= 10:
            os.system(f"convert {i} -resize 60% resized_{i}")
        elif cursize >= 10 and cursize <= 20:
            os.system(f"convert {i} -resize 40% resized_{i}")
        elif cursize >= 20:
            os.system(f"convert {i} -resize 20% resized_{i}")

        #  break

os.system("rm -rf IMG*")

---
layout: post
title: Endangered Species
date: 2020-07-06 01:59
category: article
author: Subhaditya Mukherjee
tags: []
---

Here we will talk about spreading awareness about endangered species through AI powered art.

Have a look at this website before we start -> [Link](/endangered.html)

> This will also be in Python.

Over the past few centuries, we have wreaked havoc on this planet. Most of the species affected by our expansion are already dead but there are some which aren't. Our job is to make sure that this stays that way. 
How deep is this impact? Let us find out. [WWO](https://www.worldwildlife.org/)

## Art

Why art? 
Well, art is an amazing medium to spread awareness. Maybe this project goes nowhere, maybe it does. At the end of the day.. I tried to do something in my own small way.

Our objective is to first identify endangered animals, get their information and images and then use neural style transfer to convert them into artistic pictures. 

Like these 

<img src="{{site.baseurl}}/outputs/african-elephant.jpg" alt="drawing" width="200"/>

## What we need for it

```py
import pandas as pd
from requests import get
import urllib
from bs4 import BeautifulSoup
from tqdm import tqdm
```
Pandas will allow us to make a table and read it.
Requests and urrlib allow us to save the html of a website
bs4 is a web scraping library which will allow us to identify content from the page.
tqdm is a fancy wrapper for making progress bars pretty (I mean.. why not)

## Data collection

Okay let us first get the data. I went to [WWO](https://www.worldwildlife.org/) and scraped the data using bs4.
Then I save it to a csv file so I can read it again.

Now to find out the names of the animals.

```py
animals = pd.read_csv("data/animals.csv")
animals["Common name  "]
names = animals["Common name  "].values
```

Turns out the website has the names saved like "amur-leopard" and the data we have right now has it as "Amur Leopard" so let us fix that as well by splitting the string, converting it to lower case and adding a - between the words. 

After that we apply this function to the whole column.

```py
names = animals["Common name  "].values
def conve(x): return "-".join(str(x).strip().lower().split(" "))
animals["Common name  "] = animals["Common name  "].apply(conve)
def conv2(x): return x.text.strip().replace(",","")
```

Now we also want to scrape the status of the animals aka endangered etc. Here we use beautiful soup. I had a look at the url and this is how we can format it to work out. We save the html in our cache and then use bs4 to find all images and divs (this is how webscraping works and you can identify the exact ones using "inspect element"). 

``` py
def status(x):
    url = f"species/{x}"
    response = get(url)
    html_soup = BeautifulSoup(response.text, 'html.parser')
    html_soup
    return list(map(conv2,html_soup.find_all('div', class_ = 'container')[:2])),html_soup.find_all('img')[0]["src"]
```

After we have this, we save the images to a folder for easy access, same way as above.

``` py
for a in names:
    try:
        urllib.request.urlretrieve(status(a)[1],f"data/{a}.jpg")
    except:
        print(a)
    
```

Done! 

## NST

Now let us get to using style transfer. What is that? Simply put, it is taking one image and applying its style to another. Something like taking a painting and making a photo look like a painting. 

There are many ways to do it, and I have done it so many times at this point I'd rather just take an efficient implementation of it. More explanation about NST -> [A repo of mine](https://github.com/SubhadityaMukherjee/neural_style_transfer)

Okay so I will be using [this](https://github.com/zhanghang1989/PyTorch-Multi-Style-Transfer) implementation.

To do that, we first import os (which allows us to access files) and the random module (will allow us to choose a style at random)

Now for a bit of complicated code.
Since this person has actually made his code as a script, I need to call it using the terminal (aka bash). 

Obviously I do not want to do that, so I use the !python3 command. The ! lets me use the system shell directly.
All I am doing is using python strings to choose a random style image and then using a pretrained style transfer model to transfer my image into that style.
The weird strings are fancy string formats and {} basically allows me to replace that with a variable directly.

I also have a GPU, so I can use CUDA.

Here goes!

```py
import os
import random

fils = os.listdir("data/")[2::]

styles = os.listdir("/home/subhaditya/Downloads/PyTorch-Multi-Style-Transfer-master/experiments/images/21styles/")

for a in tqdm(fils):
    if not "csv" in a:
        !python3 "/home/subhaditya/Downloads/PyTorch-Multi-Style-Transfer-master/experiments/main.py" eval --content-image "data/{a}" --style-image "/home/subhaditya/Downloads/PyTorch-Multi-Style-Transfer-master/experiments/images/21styles/{random.choice(styles)}" --output-image "outputs/{a}" --model "/home/subhaditya/Downloads/PyTorch-Multi-Style-Transfer-master/experiments/models/21styles.model" --content-size 1024 --cuda 1
    
```

Wow that was messed up.

## Website

Now this part is funny. I am too lazy to code a website, so I will use python to do it for me. 

First we create a black html file and write the title of the site. 
Then we iterate over the list of names and convert our formatted name to plain text again. Then we write the image along with the name of the animal and the status of it. 

We run this until it is done and now we have our site. (This is how I made the site shown above)

<img src="{{site.baseurl}}/outputs/screen1.png" alt="drawing" width="200"/>
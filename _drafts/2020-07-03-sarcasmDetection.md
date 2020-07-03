---
layout: post
title:  Sarcasm Detection
date:   2020-07-03 11:40:22 +0400
tags:
categories: article
---

Another deviation :) I was thinking of looking into NLP a bit and so here I try to perform sarcasm detection using RoBERTa and explain it as I go along.

First let us get a dataset -> [Link](https://www.kaggle.com/rmisra/news-headlines-dataset-for-sarcasm-detection?select=Sarcasm_Headlines_Dataset_v2.json)

> I will be using python for this deviation because it is my primary language and I feel like Julia hasnt developed enough for this task.

# The task at hand
Sarcasm classification basically means given a sentence, detect if it is sarcastic in nature or not. To do this we will use something called a transformer. (Explained below). 

# Code explained
Okay first let us get the libraries we need. The fastai library is a nice and flexible wrapper around Pytorch and so will help us quite a lot. 
The transformers library gives us access to Roberta and so we will use that as well.
tqdm is a progress bar which we might use at some point.

``` python
from fastai2.text.all import *
from transformers import RobertaTokenizer, RobertaModel , RobertaForTokenClassification
import torch
import os
import json
from tqdm import tqdm
os.environ["TORCH_HOME"] = "/media/subhaditya/DATA/COSMO/Datasets-Useful"
```

For every NLP problem, the first step is tokenization. So let us do that. And while we are at it, let us also load the pretrained model. I will try to explain every technical term below for reference (check the explained section).

Okay so we use the model roberta-base which is the standard one for the task.

``` python
tokenizer = RobertaTokenizer.from_pretrained('roberta-base')
model = RobertaModel.from_pretrained('roberta-base')
```

Now let us read the dataset using pandas. The dataset is in a json format and we do not need the links to the articles for our task.

``` python
path = Path("/media/subhaditya/DATA/COSMO/Datasets/sarcasmDetection")
df = pd.read_json(str(path/'Sarcasm_Headlines_Dataset_v2.json'), lines=True)
df = df.drop("article_link",axis = 1)
df.head(5)
```



# RoBERTa explained

1. <b>Pretrained model</b> -> This is probably one of the most important advances in deep learning because it allows us to take someone elses trained model and retrofit it to our purpose. This works because the model generally has multiple layers which learn abstract structure and thus can be modified to fit something new. Not only does it reduce training time it also allows you to not have a 100 GPUs and still go state of the art (SOTA)
2. <b>Tokenization</b> -> ["splliting", "a", "sentence","into","its", "parts","."]
3. 
2

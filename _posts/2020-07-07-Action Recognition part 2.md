---
layout: post
title:  Action Recognition part 2
date:   2020-07-07 13:57:20 +0400
categories: article
tags: 
---

Continuing the action recognition project. 

## Custom path class

We first need to define a custom path class which will give us the paths of the original dataset, the preprocessed one and the pretrained weights. I know, we could probably do it without a class but I am reimplementing here so lets just go with it for now.
The only new thing here is @staticmethod. 
This is python syntax for declaring a method which does not need a class to be instantiated and are not dependant on its state. Basically, they would return a static method for any function which is passed as its parameter.

``` python
class Path(object):
    @staticmethod
    def db_dir(database):
        root_dir = "/home/subhaditya/Desktop/Datasets/UCF101/"
        output_dir = "/home/subhaditya/Desktop/Datasets/UCF101pre/"
        return root_dir, output_dir
    
    @staticmethod
    def model_dir():
        return "/home/subhaditya/Desktop/Datasets/UCF101pre/Models/c3d-pre.pth"
2
```

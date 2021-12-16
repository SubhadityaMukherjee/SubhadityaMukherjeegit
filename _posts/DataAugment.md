---
layout: post2
title: Data Augmentation
categories: article
date: 2021-09-16
tags: data, augmentation, computer vision
summary: Data Augmentation techniques for computer vision
---

# Title TODO

Q. What do you do when you have less data for your model?
A. You cry

Jokes aside, we use "Augmentation". In simple words, it means taking an image and performing some mathematical operation on it that would alter the image. Since our objective is for the model to eventually learn about these images, the end product must be recognizable.

# What will you learn by the end
The aim of this little article is to introduce the kinds of augmentations that are most commonly used, how to implement them and a tiny example. I will not be including much code here as they are available in a million more articles. Think of this as a crash course instead.

Okay here we go.

# Balto
Our friend for today is this adorable little baby named Balto. Here. Say hi! I promise it will bring you luck.
We will be taking this image of our friend and using it for the rest of the article.

# Implementation
We first need some code to implement them right? This is written in python and is the code I will be using the generate the outputs that you will see below.
- We first load up the needed libraries.
- Write a tiny function to generate and visualize the image

---
layout: post
title:  Universal Approximation theorem
date:   2020-07-18 10:42:41 +0400
tags: uat tick theorem feed forwa real activation complex non linear 
---

What makes Neural Networks tick mathematically.

This is going to be a really short article but I decided it was important to talk about it. So the reason why NNs work is due to a theorem called the Universal Approximation theorem.

## What is it

What this means that given an x and a y, the NN can identify a mapping between them. "Approximately". This is required when we have non linearly separable data. (Aka you can't split them directly into n parts just by say drawing a line between them. This could be complex structures like images or text or anything which cannot be directly modelled.

So we take a non linear function, for example the sigmoid. $$\frac{1}{1 + e^{ - \left( w^{T}x + b \right)}}$$.
Then we have to combine multiple such neurons in a way such that we can accurately model our problem. The end result is a complex function and the existing weights are distributed across many layers. Sounds familiar? Welcome to Deep Learning (lol).

The Universal approximation theorem states that
> a feed forward network with a single hidden layer containing a finite number of neurons can approximate continuous functions on compact subsets of $$\mathbb{R}$$ , under mild assumptions on the activation function.

Um. Can these guys speak normally. -.- Lets break it down a bit.

- a feed forward network : take an input, apply a function, get an output, repeat
-  a single hidden layer : yes you can use more, but theoretically...
-  finite number of neurons: you can do it without needing an infinite computer
-  approximate continuous functions: continuous functions are anything which dont have breaks/holes in between. This just says that it is possible to approximate the mapping which we talked about
-  $$\mathbb{R}$$ is just the set of all real numbers
-  An activation function is something like the ReLU/Sigmoid
-  All this boils down to the fact that a neural network can approximate any complex relation given an input and an output.

## How does it work?

Well here is an image. See if you can understand whats happening.
 ![](/img/uat.png)

Makes sense right? Every curve at an infinitely small point can be a collection of lines (approximately).
Oh and as a form of citation, [here](https://medium.com/hackernoon/illustrative-proof-of-universal-approximation-theorem-5845c02822f6) is where I got this image from. Its a great blog you should really check it out.

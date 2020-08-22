---
layout: post
title:  fastai Book
date:   2020-07-12 11:50:52 +0400
categories: book
tags:
---

What I found interesting from the book "Deep Learning for Coders with fastai and PyTorch: AI Applications Without a PhD"
by Jeremy Howard  (Author), Sylvain Gugger (Author)

[Link to the book](https://www.amazon.com/Deep-Learning-Coders-fastai-PyTorch/dp/1492045527)

> I will not be adding any codes here as those will be part of the projects/deeper blog posts.

## Drive train approach
- Define an objective
- Find out what inputs you can control
- Find out what data can be collected

## Data issues
- Out of domain data
- Different lighting conditions
- Corrupted images
- Type of image the model sees change over time

## Deplyoment
- The model itself might change behavior of the place where it is deployed
- Gradual expansion of users
- Parallel human process
- Consider what could go wrong
- Look for feedback loops

## General points

- If it isnt an image, you can still make it one if you are creative xD
- Train a model, then use the trained model to find errors in data. Its faster.
- Sometimes things are just not solvable using Deep Learning or do not need it
- NLP : Not that great yet
- BLOG!! (Lol considering this is one)
- Keep checking shapes of layers/inputs as you go
- Large models arent necessarily better models. Start small and then scale up.



## Ethics

- Well founded standards of right or wrong
- Context dependent
- Many perspectives of stakeholders 
- Mistakes in software implementation
- Feedback loops -> might lead to worse outcomes/incorrect predictions
- "To the blind technocrat, the means were more important than the end"
- Consider the entire pipeline 
- Work closely with people who will end up using the research

## Technical/Math
- difference between L1 norm and mean squared error (MSE) is that the latter will penalize bigger mistakes more heavily than the former (and be more lenient with small mistakes).
- Regression -> Add y range. aka (min,max). that does better

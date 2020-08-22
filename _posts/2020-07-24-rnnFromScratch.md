---
layout: post
title:  RNN from scratch
date:   2020-07-24 11:41:02 +0400
tags:
---

(WIP Skip for now) NLP time!! Here we will look at an RNN from scratch.

>Adapting the code from Python [Link](https://github.com/prateekkarkare/rnn_char_modelling/blob/master/char_model_dino.py)

First let us take data. Baby names are easiest to find (lool) so I copied around 800 of them from here. [Link](https://www.whattoexpect.com/baby-names/list/top-baby-names-for-girls/)

To do anything, we need to first understand what the outcome should be. So this is an RNN. Our objective is to build this along with the forward and backward pass.

![](/img/rnn.png)

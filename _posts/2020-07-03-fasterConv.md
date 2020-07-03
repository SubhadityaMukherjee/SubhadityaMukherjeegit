---
layout: post
title:  Faster and more general Conv
date:   2020-07-03 17:13:46 +0400
tags:
---

Here we will look at the various ways of implementing convolutions and benchmark them.

Let us define a huge image and a smallish kernel first to let us compare them.

``` julia
img = rand(Float32,1000,1000)
kernel = rand(Float32,15,15);
```

## Our old method

We already implemented Conv2D once. So let us just take that and run it for these images as a benchmark. I think 10kx10k is a pretty crazy huge operation but anyway let us see what happens.

``` julia
    ih, iw = 1, 1
    for i in 1: result_h
        for j in 1: result_w
            for k in 1:kernel_h
                for l in 1:kernel_w
                    result[i,j] += img[ih+k-1, iw+l-1]*kernel[k,l]
                end
            end
            ih+=stride
        end
        iw+= stride
        ih = 1
    end
```
Time taken ->

``` julia
  0.536841 seconds (53.66 k allocations: 10.141 MiB)
```
Okay that's good but toooo slow xD

## Optimize P1 (Did not work)

Let us remove those loops. First let us remove the inner loop with k and l.

We have our new code..

``` julia
    ih, iw = 1, 1
    for i in 1: result_h
        for j in 1: result_w
                [result[i,j] += img[ih+k-1, iw+l-1]*kernel[k,l] for k in 1:kernel_h, l in 1:kernel_w]
            ih+=stride
        end
        iw+= stride
        ih = 1
    end
```
Time taken ->

``` julia
 34.546620 seconds (1.09 G allocations: 18.201 GiB, 3.21% gc time)
```

Wow okay that went crazy pretty fast. That did not work xD

## FFT

So I did a [google search ](https://en.wikipedia.org/wiki/Convolution_theorem) and turns out the way to increase speed is by using the Convolution algorithm. Basically this says

$$f*g= ℱ^{-1}\big\{ℱ\{f\}\cdot ℱ\{g\}\big\}$$

where $$ℱ$$ is the fourier transform operation. And we first take the FT of both the image and the kernel. Then we perform point wise multiplication. And then we finally do an inverse FT.

FFT stands for fast fourier transform.

The sad part is that to do this, both the image and the kernel need to be of the same size, which means that we need to apply padding.

> So I will take a break from this post and make another one padding and then come back when I have achieved that.

## Fourier transform
But before that I want to write a bit more about the FT. Let us see what it does I am curious.


## Using FFT to compute convs with padding 


## CUDA

GPUs were meant for performance. So how about we try to do our implementation on a GPU? I have an Nvidia RTX2070 which is pretty great. CUDA? Compute Unified Device Architecture is a programming paradigm by Nvidia. It allows massive parallelism which gives the boost we need for Deep Learning.

I have never actually used a CUDA array directly and I need to find out how to do it first.


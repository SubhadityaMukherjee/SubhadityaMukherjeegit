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

Here is an awesome video I found. [3Blue1Brown](https://www.youtube.com/watch?v=spUNpyF58BY)

- What does it do : Take any function and decompose it into its parts
- For example music -> Decompose into separate waves
- How? Apply a "winding" function which basically means that for every point on the wave, try to plot it in the form of a circle(sort of)
- So for the whole time duration, if a stable graph is obtained at any frequency, that will allow us to decompose the wave.
- Math? Take a function g(x) and multiply it using Eulers fomula 
- $$g(t)e^{-2 \cdot {\pi}ift}$$
- Note that these are in the complex plane.
- Sample a whole bunch of points from the domain and take the integral of them.
- $$\mathrm{\int}g\left( t \right) \cdot e^{-2 \cdot {\pi}ift \cdot dt}$$
- This would give the center of mass of the wound up graph, scaled up by some amount
- The effect is that it would be multiplied by the duration of the portion of the graph being considered. 
- If a particular frequency spans for a long time, then the FT at that point is scaled up more.

## Conv2D using FFT

Okay so I managed to solve the padding issue. (Check the next post)
For now, I will take the example of constant padding.

```julia
using Images,ImageView, Plots,LinearAlgebra,Statistics, FFTW,TestImages
img = rand(Float32,1000,1000)
kernel = rand(Float32,15,15);

function pad_constant(img,kernel,constant=0)
    kernel_h, kernel_w = size(kernel)
    img_h, img_w = size(img)
    padded_kernel= ones(img_h,img_w).*(1/(1+exp(-constant)));
    pad_h, pad_w = size(padded_kernel)
    center_x,center_y = pad_w ÷2, pad_h ÷2
    tmp_x = center_x-(kernel_w÷2)
    tmp_y = center_y-(kernel_h÷2)
    padded_kernel[collect(tmp_x:tmp_x+kernel_w-1),collect(tmp_y:tmp_y+kernel_h-1)] = kernel;
    return padded_kernel
end

ker_pad = pad_constant(img, kernel, .3);
@time ifft(fft(channelview(img)).*fft(ker_pad))
```
Now I am not sure if this is the perfect approach but I will trust the internet for now.

Speed? 
```julia
 0.063075 seconds (190 allocations: 76.304 MiB)
```

Wait. **WHAT**.
That is around 8 times faster. What even.

Okay let us try this for a 10000x10000 array then. Just because we can. xD

Okay so our old method took 
```julia
53.943691 seconds (59.00 k allocations: 763.824 MiB, 0.08% gc time)
```

And FFT takes
```julia
 0.075766 seconds (190 allocations: 76.304 MiB, 5.42% gc time)
```
**Um**

## CUDA

GPUs were meant for performance. So how about we try to do our implementation on a GPU? I have an Nvidia RTX2070 which is pretty great. CUDA? Compute Unified Device Architecture is a programming paradigm by Nvidia. It allows massive parallelism which gives the boost we need for Deep Learning.

I have never actually used a CUDA array directly and I need to find out how to do it first.

Okay so let us use the FFT thing from CUDA. We can't use the old method because it has scalar indexing. (Aka non vectorized operations)

```julia
using CUDA.CUFFT,CUDA,Images

function pad_constant(img,kernel,constant=0)
    kernel_h, kernel_w = size(kernel)
    img_h, img_w = size(img)
    padded_kernel= CUDA.ones(img_h,img_w).*(1/(1+exp(-constant)));
    pad_h, pad_w = size(padded_kernel)
    center_x,center_y = pad_w ÷2, pad_h ÷2
    tmp_x = center_x-(kernel_w÷2)
    tmp_y = center_y-(kernel_h÷2)
    padded_kernel[collect(tmp_x:tmp_x+kernel_w-1),collect(tmp_y:tmp_y+kernel_h-1)] = kernel;
    return CuArray(padded_kernel)
end

img = CuArray(channelview(rand(Float32,1000,1000)));
kernel = CuArray(rand(Float32,15,15));

ker_pad = pad_constant(img, kernel, .3);

@time ifft(fft(img)*fft(ker_pad))
```

So that took...

```julia
0.018873 seconds (851 allocations: 26.781 KiB)
```
Okay..........

## Testing limits

How about for a 10k x 10k array

Oh no.. I do not think my GPU can take this ):

Okay 9k x 9k 

```julia
23.501186 seconds (973 allocations: 31.203 KiB, 1.67% gc time)
```

Heh. I guess it took time to send it to the GPU. And bring it back :/
I am confusion.

Ah yes it was that. Once it did go to the GPU, it took 1 second. Which means that it could take lesser on the next run, except my dear ol GPU wont let me do it for such a huge array.

But I guess I should be satsified with 1k x 1k. I mean come on, do we even use such huge images for DL. (Unless you work at Google LOL)


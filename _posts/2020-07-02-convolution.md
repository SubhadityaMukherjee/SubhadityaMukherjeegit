---
categories: article
layout: post
title:  Basic Convolution
date:   2020-07-02
tags: conv scratch 2d array basic oper image mandrill
summary: Basic conv in julia
---

[title]

Here we will talk about convolution and how to implement it from scratch.

Before I begin, let me make something clear. I am trying to go from basic to optimized and so I will start with a naive implementation. And then eventually get to much better code. I could take it directly but I feel like that defeats the whole point of this exercise. And who knows? Maybe I'll find something fun along the way :)

## Definition

Okay. Now what is a convolution operation?
Simply put, it is a way of representing information in a compressed manner. Or in other words, representing complex information in a different way. It is the basic block of Deep learning and the reason it works so well. There are many high level abstractions to the concept and so I want to look at the simplest version of it and then move on to more complex parts.

To be honest, I did not find many proper versions of this. Most of them tend to abstract it way to such a huge extent it is almost pointless to even try.


## Basic idea

> Note that this is for a 2D image (grayscale lets say)

1. Images are matrices.
2. To understand an image, we try to identify features from images
3. Features? Something like edges, shapes and eventually more complex things like say eyes, lips etc
4. How do we do that? We use a kernel == another matrix.
5. What? Since the image is a huge matrix, we take a smaller matrix with specific values(called a kernel). Lets say we have a 3x3 matrix with the sides = 0 and the center = 1

``` julia
3x3 Array{Int64,2}:
 0  1  0
 0  1  0
 0  1  0
```
6. if you make this into an image, quite obviously, we have a white patch in the middle of a black rectangle. 
7. The convolution basically takes the image and for each 3x3 bit in it, does element wise multiplication. After that is done, we have a new matrix. Now we sum up all those elements and we have the first convolution.
8. Since the image is quite big, we still can move this kernel around. We shift it by 1 place to the right (by == stride). Then repeat step 7.
9. We do this for the whole matrix.
10. Note that we also sometimes need to pad the image with extra values.
11. Um...
12. Think about it this way, when you are moving this kernel (== a sliding window) over the image, are you really covering everything? Or are you losing bits of information around the sides? 
13. To avoid that, we pad the image with the pixel next to it. (Of course we can change this to other stuff like copied pixels and everything but meh too much info at once makes the brain go boom)

## An example?

Sure. Here is a filter and a smol image. (yes it has random values but we will get to applying it to a real image soon)

``` julia
# Kernel/filter
2×2 Array{Int64,2}:
 0  1
 2  3

# Image
3×3 Array{Int64,2}:
 0  1  2
 3  4  5
 6  7  8
```

Now let us take do the first bit of the conv. We have these. If you do not get it, read the steps above once.

``` julia
 0  1
 2  3

 0  1
 3  4
 ```

Now we multiply them element wise aka in position.

```julia
2×2 Array{Int64,2}:
 0x0=0   1x1=1
 2x3=6  3x4=12
 
 # or
 2×2 Array{Int64,2}:
 0   1
 6  12
 ```
 Then sum them all up and we get 1+6+12 = 19.
Rinse and repeat and we get.

``` julia
2×2 Array{Float64,2}:
 19.0  37.0
 25.0  43.0
```
Fun right? (LOL)

Okay let's get to the code because I am getting bored now.

What do we need? We need to read images, load a test image and be able to display it as we go. We can do this using the Images, TestImages and ImageView packages.

## Start code
``` julia
 using Images, TestImages,ImageView
 img = testimage("mandrill");
```
We will not touch this image right now but we will create a test image and a kernel.

``` julia
img = [0 1 2 ; 3 4 5; 6 7 8]
kernel = [0 1 ; 2 3]
```
Our Image is : <img src="{{site.baseurl}}/assets/img/deconstrucImages/img_p1.png" alt="drawing" width="200"/>

Our kernel is : <img src="{{site.baseurl}}/assets/img/deconstrucImages/kernel.png" alt="drawing" width="200"/>

Okay let us take stride = 1 and give ourselves the option of setting a kernel and choosing a padding. Valid means no padding and same means that the returned dimensions should be the same as the image aka there will be padding.

We take the sizes of the image and the kernel and store them away before we do anything else.

``` julia
function conv2d(img, kernel, stride = 1, padding = "valid")
    input_h, input_w = size(img)
    kernel_h, kernel_w = size(kernel)
```

To add padding, we use the formulae :
The amount of height added $$\frac{kernel_{height} - 1}{2}$$

The width is the same except we use the kernel width.

Now to we create a zero matrix with the size height x width = $$input_{h} + 2 \cdot pad_{h}, input_{w} + 2 \cdot pad_{w}$$ . Why do this? Because allocating memory means faster operations.

Now we loop over the image and add padding.

## Padding and stride

``` julia
function conv2d(img, kernel, stride = 1, padding = "valid")
    input_h, input_w = size(img)
    kernel_h, kernel_w = size(kernel)
    
    if padding == "same"
        pad_h = (kernel_h-1) ÷ 2
        pad_w = (kernel_w-1) ÷ 2
        
        img_padded = zeros(input_h+(2*pad_h),input_w+(2*pad_w))
        
        for i in 1:input_h , j in 1:input_w
            img_padded[i+pad_h, j+pad_w] = img[i,j]
        end
        
    elseif padding == "valid"
    else
        throw(DomainError(padding, "Invalid padding value"))
    end
```

Our padded image is <img src="{{site.baseurl}}/assets/img/deconstrucImages/padded.png" alt="drawing" width="200"/>

Now we will follow steps 7 to 9.

## Conv!!

``` julia
    result = zeros((input_h- kernel_h) ÷ stride +1 ,(input_w- kernel_w) ÷ stride +1 )
    result_h, result_w = size(result)
    
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
    return result
end

conv2d(img , kernel)
```

We then get :<img src="{{site.baseurl}}/assets/img/deconstrucImages/temp.png" alt="drawing" width="200"/>

How did I save the images?

``` julia
using Cairo,Gtk

function write_to_png(guidict, filename)
    canvas = guidict["gui"]["canvas"]
    ctx = getgc(canvas)
    Cairo.write_to_png(ctx.surface, filename)
end

tm2 = imshow(conv2d(img , kernel))

write_to_png(tm2, "/home/subhaditya/Desktop/GITHUB/SubhadityaMukherjee.github.io/img/deconstrucImages/temp.png")
```
## Full function 

``` julia
function conv2d(img, kernel, stride = 1, padding = "valid")
    input_h, input_w = size(img)
    kernel_h, kernel_w = size(kernel)
    
    if padding == "same"
        pad_h = (kernel_h-1) ÷ 2
        pad_w = (kernel_w-1) ÷ 2
        
        img_padded = zeros(input_h+(2*pad_h),input_w+(2*pad_w))
        
        for i in 1:input_h , j in 1:input_w
            img_padded[i+pad_h, j+pad_w] = img[i,j]
        end
        
    elseif padding == "valid"
    else
        throw(DomainError(padding, "Invalid padding value"))
    end
    
    result = zeros((input_h- kernel_h) ÷ stride +1 ,(input_w- kernel_w) ÷ stride +1 )
    result_h, result_w = size(result)
    
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
    return result
end
```


## Gray image

Cool! Let us do it for an image. Note that Julia stores images in arrays and since our example only works for 2D matrices, we convert the image into grayscale first and then apply the channelview function.

We are using a really cute mandrill for our example.
<img src="{{site.baseurl}}/assets/img/deconstrucImages/mandorig.png" alt="drawing" width="200"/>

``` julia
img = testimage("mandrill");
kernel_blur = [-2 -1 0; -1 1 1; 0 1 2]
imshow(conv2d(channelview(Gray.(img)),kernel_blur))
```
We get  :<img src="{{site.baseurl}}/assets/img/deconstrucImages/mandblur.png" alt="drawing" width="200"/>

Wow. What happened to the poor thing. Notice the weird numbers? Those are a specific kernel to do this.
But why?

Simple. Right now we are doing this by hand. Eventually the network uses this to learn specific features which allows us to do everything computer vision does.

I will probably write another post on filters just because it is fun.

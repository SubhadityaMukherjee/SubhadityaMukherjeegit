---
categories: article
layout: post
title:  Compositional Pattern Producing Networks
date:   2020-08-12
tags: cppn generative color abstract art
summary: CPPNs in Flux
---

[title]

Today we will talk about Compositional Pattern Producing Networks. 

Note that Whatever I learnt about this is from [Link to post](https://blog.otoro.net/2016/03/25/generating-abstract-patterns-with-tensorflow/) and the original Julia implementation at the model zoo. (Which I am trying to fix).

## Intro
Okay so what is it? Basically a CPPN is a type of generative model. Very basic but generates abstract points. How? Basically we use the neural network as a function to give us points of intensity and then we plot it. Simple as dots xD
This reminded me a lot of GANs and earlier things like identifying the latent space of an image and messing around with it.

## Defining the parameters

I do not want to blabber so let us get to the code.

Ah! This is like the dimensions. We define the size of the image in (x,y) and we also define the z value. N seems to be the number of input and output channels to our Dense layer (defined later). And obviously batch size as normal. 

```julia
z_dim = 2
x_dim = 512
y_dim = 512
N = 14
hidden = 9
batch_size = 1024
n = x_dim * y_dim

```

A small function to create an array casted between -0.5:0.5 

We also define the a bunch of points which would be the initial boundaries of our image. If it does not make sense, think of it as a grid. We are defining the range and filling it up with points. In x, y directions. The last one is a non linearity which I guess is something like ReLU since it seems to be a point wise operation.

$$rs = \sqrt{xs^{2} + ys^{2}}$$

``` julia
cast(x) = [range(-0.5, stop=0.5, step=1/(x - 1))...]

xs, ys = cast(x_dim), cast(y_dim)
xs = repeat(xs, inner=(y_dim))
ys = repeat(ys, outer=(x_dim))
rs = sqrt.(xs.^2 + ys.^2)
```

## Network

Now we need to make a network.
We first define a Dense layer with tanh instead of relu. 

Why? I honestly do not know. Let me run it and find out. Okay it was because it just gave barely any patterns and all white/black images. Makes sense really due to the nature of relu. I also tried it with leaky relu. Same thing.

Okay time to move on.

We then make a chain with an initial dense layer, multiple dense layers for the hidden and a final layer.

``` julia
unit(in=N, out=N, f=tanh) = Dense(in, out, f, initW=randn)

layers = Any[unit(3 + z_dim), [unit() for _ in 1:hidden]..., unit(N, 1, σ)]

model = Chain(layers...)
```

Now we define a tiny function which will get us the color at a point. We then write another function to batch our images so we dont blow up our GPU. I simplified and applied list comprehension where I could. #devSwag

``` julia
getColorAt(x) = Flux.data(model(x))

function batch(arr, s)
    l = size(arr, 2)
    batches = [arr[:, i:min(i+s-1, l)] for i=1:s:l]
    batches
end
```

## Generation

Now that we have that, on to actually generating an image.
Simply put, we create an empty grid using our x,y, z coords.
Then we use our model to predict an intensity at each point using the coordinates and we convert them to grayscale values. That way we can plot it directly as an image. 
We also reshape it to fit the size we need.

Thats about it.

``` julia
function getImage(z)
    z = repeat(reshape(z, 1, z_dim), outer=(n, 1))
    coords = hcat(xs, ys, rs, z)'
    coords = batch(coords, batch_size)
    pixels = [Gray.(hcat(getColorAt.(coords)...))...]
    reshape(pixels, y_dim, x_dim)
end
```

## Final Image
The final part is actually plotting the image. Over here we just run the previous function and save the image locally.

``` julia
function saveImg(z, image_path="sample.png")
    imgg = getImage(z)
    save(image_path, imgg)
    imgg
end
```

I extended the print command to show us 10 images instead of one just to see the variation. It does look pretty. Like a bit of my personal molten steel.

``` julia
[saveImg(rand(z_dim)) for _ in 1:10]
```

![](/img/cppn.png)

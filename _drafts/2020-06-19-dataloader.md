---
layout: post 
title: Dataloader 
date: 2020-06-19
categories: article
tags: start dataloader 
summary: A start [Archived]
---

[title]

The first thing we need is to be able to read data. To begin with, I am starting with the problem of image classification.

It is a pretty huge thing to deal with at first go. But if we can do it then we can progress towards bigger things :)

Imports

We first need certain libraries (standard ones).

```julia
using FileIO # will help us perform basic file tasks
using Images # read images
using Serialization # A helper function
using Random
using CUDAapi # Will allow us to work with the GPU directly. Obviously I wont write a CUDA kernel now
using Plots
import GR # A plotting backend
using Images
using CuArrays # Pop arrays to GPU
using ImageView # Display images
using Statistics, Random
import ProgressMeter # Will allow us to make a fancy looking progress bar :)
gr()
```

If we read an image at a time, the process would be extremely slow. So we need to use as much power as we can (make [Barry Allen](https://en.wikipedia.org/wiki/Flash_(Barry_Allen)) happy). We first find out how many CPUs we have and then set the number of parallel processes to that many. Aka we now go very very fast :)

```julia
Threads.nthreads() = length(Sys.cpu_info())
```

Let us also set a path for the folder using the variable path.

Now we need to decide a folder structure for the task. I want all my datasets to be of the format.

```
    - category1
        - file1...
    -category2
        - file1...
    ...
```

Now that we have decided that, time to actually read the files :)

We write a small function to help us add the path to every file from the parent. This will help us very much later.

```julia
function add_path(cat::String)
    temp_dir = readdir(joinpath(path,cat));
    return [joinpath(path, cat,x) for x in temp_dir],fill(cat,size(temp_dir,1) )
end
```

The fill function essentially repeats a variable. So in this case we have "cat" repeated as many times as the number of cat images in the folder.

What do I need? 1. Make a list of categories(parent folders) 2. Make a list of all image files in them 3. Make a list of all categories (expand the labels for each file) 4. Create a temporary structure filled with zeros (more efficient) 5. For each image we load it, resize it to a desired size and convert them to a image format. After that we convert them to Float64 and save it to the previous array we allocated. 6. Eat, sleep, rave, repeat :)) > Note that all of this is happening parallely

```julia
function fromFolder(path::String,imageSize=64::Int64)
    @info path, imageSize
    categories = readdir(path) #1
    total_files = collect(Iterators.flatten([add_path(x)[1] for x in categories])); #2
    total_categories = collect(Iterators.flatten([add_path(x)[2] for x in categories])); #3

    images = zeros((imageSize, imageSize, 3, size(total_files,1))); #4

    Threads.@threads for idx in 1:size(total_files,1) #5
        img = channelview(imresize(load(total_files[idx]), (imageSize, imageSize)))
        img = convert(Array{Float64},img)
        images[:,:,:,idx] = permutedims(img,(2,3,1))
        end
    @info "Done loading images"
    return images, total_categories
end
```

The @info is something I really like. It allows us to print nice versions of outputs :)

```julia
X,y = fromFolder("/media/subhaditya/DATA/COSMO/Datasets/catDog/",64);
```

We now have a dataloader which returns all the files in our dataset. We are testing it with the cat/dog dataset (because why not -.-).

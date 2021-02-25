---
categories: article
layout: post
title:  Oversample and Split
date:   2020-06-19 17:52:02 +0400
tags: split tutorial dataset distribution split oversample
---

Defining a function to split the dataset into train/test bits and oversample it as well.

## What we need to do and steps we will try to follow.
 
1. Take all the files and labels as X,y
2. Class distribution
3. Oversample?
4. Split into train/test

## Class distribution
This is extremely important for classification so we first try to see if the classes are balanced or not.
Should be quite simple. We first take the labels(lesser computation) and then count each of them. Let us also plot it because graphs are pretty.
We also return the maximum count to help with oversampling.
We make this default to oversample if the differences between the classes are greater than 100 images.
```julia 
function classDistribution(y)
    """
    Function to plot class distribution to see if balanced or not.
    """
    labels = unique(y)
    cnts = [sum(y .== i) for i in labels]
    display(plot(cnts,seriestype = [:bar]))
    return cnts,maximum(cnts)
end
``` 

Done :)

## Oversample
This is a technique in which the lower sampled classes are copied till the number of samples are equal.
So turns out adding it here doesnt help and makes it worse. So I copied the code to the start and we are adding on to the read file function.
We modify the initial loader once to add the images from the end of the array and repeat the labels. 

The modified function is as follows.

```julia 
#export

"""
Function to create an array of images and labels -> when the directory structure is as follows
- main
    - category1
        - file1...
    -category2
        - file1...
    ...
"""
function fromFolder(path::String,imageSize=64::Int64)
    @info path, imageSize
    categories = readdir(path)
    total_files = collect(Iterators.flatten([add_path(x)[1] for x in categories]));
    total_categories = collect(Iterators.flatten([add_path(x)[2] for x in categories]));
    distrib,max_dis = classDistribution(total_categories)
    
    indices_repeat = indexin(unique(y), y)
    # oversample
    total_add = max_dis.-distrib # get the differences to oversample
    oversample = false;
    if sum(total_add)>100
        images = zeros((imageSize, imageSize, 3, size(max_dis*length(unique(total_categories)),1)));
        oversample= true;
        oversample_index = length(y)- sum(total_add)# keep a track of indices from the back
    else
        images = zeros((imageSize, imageSize, 3, size(total_categories,1)));
        oversample= false;
    end
    
    Threads.@threads for idx in collect(1:size(total_files,1))
        img = channelview(imresize(load(total_files[idx]), (imageSize, imageSize)))
        img = convert(Array{Float64},img)
        images[:,:,:,idx] = permutedims(img,(2,3,1))
#         @info oversample
        if oversample==true
            
            if idx in indices_repeat
                labelrep = findfirst(x->x==idx,indices_repeat) # index in the repeated list
                to_repeat = total_add[labelrep] # no of times to repeat
                total_categories = vcat(total_categories, fill(total_categories[indices_repeat[labelrep]],to_repeat))
                Threads.@threads for idx2 in collect(oversample_index:to_repeat)
                    images[:,:,:,idx2] = images[:,:,:,indices_repeat[labelrep] ]
                    
                end
                
                
            end
        end
    end
            
      
    @info "Done loading images"
    
2    return images, total_categories
    
    
    
end
    
``` 

Done :)

## Split into train test
I did not think this would turn out very well but it did somehow. And pretty easily.
Instead of shuffling the order around. We shuffle the indexes. This means that we do not need to take care of linked sorting etc.
After we shuffle it, we split the array into 2 bits by a percentage. 
The view takes care of that bit.
Then we use the same indexing types we have used so far and pop the shuffled indexes into them. And viola! Train test split is here!

```julia
#export
function splitter(pct_split=0.7::Float16)
    """
    Splits into train/test by pct_split%
    """
    n = length(y)
    idx = shuffle(1:n)
    train_idx = view(idx, 1:floor(Int, pct_split*n));
    test_idx = view(idx, (floor(Int, pct_split*n)+1):n);
    ytrain,ytest = y[train_idx,:], y[test_idx,:]
    Xtrain,Xtest = X[:,:,:,train_idx], X[:,:,:,test_idx]
    return Xtrain, ytrain, Xtest, ytest
end
```

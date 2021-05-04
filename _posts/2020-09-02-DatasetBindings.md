---
categories: article
layout: post
title: Dataset Bindings
date: 2020-09-02
tags: dataset binding web download 
summary: Creating bindings [Archived]
---

[title]

Tiny post on datasets and a unified downloader for standard ones.

I wanted an easy way to download the standard datasets. I guess Metalhead does it already but it has limited support and there's around 5 datasets. <i>Boooringg<i>

## Objective 

The objective is to have a list of standard datasets from Computer Vision, Natural Language Processing and maybe Graphs at some point.
Very nicely enough, [fastai](https://course.fast.ai/datasets) has already done this for us. Althought it is for python. So I will take that list and add some on my own.

## File Downloader

Now for actually downloading the files. We follow a simple workflow. 
Get a URL -> Check if it exists -> Download it -> Choose a name -> Write to file

```julia
function downloader(url::String, dest::String, fname::String)
    HTTP.open(:GET, url) do http
        open(dest*fname, w) do file
            write(file, http)
        end
    end
    return dest*fname
end
```

## Get all supported

There are so many of them, I need a way to get a list of all existing datasets so I can pop it into functions later.
Fortunately, this is a dictionary and I can just take out the keys of it.

```jl
alldatasets()= keys(dataset_list)
```

## Get extensions

I need a way to get the extension of the file so I can add it to the downloaded name. This is also very simply done because our files are primarily of the following types :
- \*.\*     **eg**:name.zip
- \*.\*.\*  **eg**:name.tar.gz 

This will be a bit complex but I am basically just chaining a few things together. 
Wait. Why not pipe it then it should be easier to explain. Let me try.

```jl
function getext(st::String)
    return "."*join(split(split(st, "/")[end],".")[2:end],".")
end
```

I will blatantly ignore the previous explanation because turnings out.... piping ... WORKS.

```jl
@pipe split(st, "/")[end] |> split(_, ".")[2:end] |> "."*join(_, ".")
```

Just look at this beauty.
Now let me explain. 
I take the string as st. Then I split it based on "/"s. Then I take the last split (with the extension) and then split it again based on ".". This will give me all the extension parts (eg tar , gz). 
After that I can join all the parts with a ".". 
PS. The _ basically takes the output of the last chain and allows you to use it directly in the next chain.

## Downloading the standard datasets

Now we can use all these functions to get our dataset with the tiny name instead of searching for them.

I will follow this workflow.

- Get name of dataset and path to save
- Check if name entered
    - If name in dataset -> Get the url from the dictionary -> Get extension -> Use the name -> Download it
    - If not -> Show all datasets 

```jl
function get_data(name::String, path::String)

    if name in alldatasets()
        @info "Downloading $name"
        url = dataset_list[name]
        finfile = downloader(url, path, name*getext(url))
        # finfile = "/tmp/mnist.tgz"
        @info "Done downloading"
    else
        @info "Please choose something from here"; @info alldatasets()
    end
end
```


## Supported Datasets

I add them in a dictionary like this

```jl
dataset_list = Dict(

    # Computer Vision
        "mnist" => "https://s3.amazonaws.com/fast-ai-imageclas/mnist_png.tgz",
        "cifar10" => "https://s3.amazonaws.com/fast-ai-imageclas/cifar10.tgz",
        "cifar100" => "https://s3.amazonaws.com/fast-ai-imageclas/cifar100.tgz",
```
Here are the datasets I am currently supporting. I will keep this as a table for future reference too lol.

|**Dataset** | **Link** |
|mnist|[Source](https://s3.amazonaws.com/fast-ai-imageclas/mnist_png.tgz)|
|cifar10|[Source](https://s3.amazonaws.com/fast-ai-imageclas/cifar10.tgz)|
|cifar100|[Source](https://s3.amazonaws.com/fast-ai-imageclas/cifar100.tgz)|
|birds|[Source](https://s3.amazonaws.com/fast-ai-imageclas/CUB_200_2011.tgz)|
|caltech101|[Source](https://s3.amazonaws.com/fast-ai-imageclas/caltech_101.tar.gz)|
|pets|[Source](https://s3.amazonaws.com/fast-ai-imageclas/oxford-iiit-pet.tgz)|
|flowers|[Source](https://s3.amazonaws.com/fast-ai-imageclas/oxford-102-flowers.tgz)|
|food|[Source](https://s3.amazonaws.com/fast-ai-imageclas/food-101.tgz)|
|cars|[Source](https://s3.amazonaws.com/fast-ai-imageclas/stanford-cars.tgz)|
|imagenette|[Source](https://s3.amazonaws.com/fast-ai-imageclas/imagenette.tgz)|
|imagenette320|[Source](https://s3.amazonaws.com/fast-ai-imageclas/imagenette-320.tgz)|
|imagenette160|[Source](https://s3.amazonaws.com/fast-ai-imageclas/imagenette-160.tgz)|
|imagewoof|[Source](https://s3.amazonaws.com/fast-ai-imageclas/imagewoof.tgz)|
|imagewoof320|[Source](https://s3.amazonaws.com/fast-ai-imageclas/imagewoof-320.tgz)|
|imagewoof160|[Source](https://s3.amazonaws.com/fast-ai-imageclas/imagewoof-160.tgz)|
|imdb|[Source](https://s3.amazonaws.com/fast-ai-nlp/imdb.tgz)|
|wikitext103|[Source](https://s3.amazonaws.com/fast-ai-nlp/wikitext-103.tgz)|
|wikitext2|[Source](https://s3.amazonaws.com/fast-ai-nlp/wikitext-2.tgz)|
|wmt|[Source](https://s3.amazonaws.com/fast-ai-nlp/giga-fren.tgz)|
|ag|[Source](https://s3.amazonaws.com/fast-ai-nlp/ag_news_csv.tgz)|
|amazon|[Source](https://s3.amazonaws.com/fast-ai-nlp/amazon_review_full_csv.tgz)|
|p-amazon|[Source](https://s3.amazonaws.com/fast-ai-nlp/amazon_review_polarity_csv.tgz)|
|dbpedia|[Source](https://s3.amazonaws.com/fast-ai-nlp/dbpedia_csv.tgz)|
|sogou|[Source](https://s3.amazonaws.com/fast-ai-nlp/sogou_news_csv.tgz)|
|yahoo|[Source](https://s3.amazonaws.com/fast-ai-nlp/yahoo_answers_csv.tgz)|
|yelp|[Source](https://s3.amazonaws.com/fast-ai-nlp/yelp_review_full_csv.tgz)|
|p-yelp|[Source](https://s3.amazonaws.com/fast-ai-nlp/yelp_review_polarity_csv.tgz)|
|camvid|[Source](https://s3.amazonaws.com/fast-ai-imagelocal/camvid.tgz)|
|pascal|[Source](https://s3.amazonaws.com/fast-ai-imagelocal/pascal-voc.tgz)|
|hmbd|[Source](http://serre-lab.clps.brown.edu/wp-content/uploads/2013/10/hmdb51_org.rar)|
|ucf|[Source](https://www.crcv.ucf.edu/data/UCF101/UCF101.rar)|
|kinetics700|[Source](https://storage.googleapis.com/deepmind-media/Datasets/kinetics700.tar.gz)|
|kinetics600|[Source](https://storage.googleapis.com/deepmind-media/Datasets/kinetics600.tar.gz)|
|kinetics400|[Source](https://storage.googleapis.com/deepmind-media/Datasets/kinetics400.tar.gz)|

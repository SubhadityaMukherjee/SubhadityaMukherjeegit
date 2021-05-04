---
categories: article
layout: post
title:  notebook2script
date:   2020-06-19 
tags: notebook script convert helper
summary: Notebook2script in Julia
---

[title]

I want to convert my work as a script. Selectively.

## Repository

<https://github.com/SubhadityaMukherjee/notebook2script.jl>

## What?
I like to do my development in jupyter notebooks. When I convert them to scripts I need to save the whole notebook as a script and then remove what I dont need. WHY -.-
I want to make a script to save only the cells I finally want for my script by adding an #export to them.

## What do I need?
- Understand JSON tags for the cells
- Find the cells with #export
- Save them separately.

## Lets goooo
Let us first import JSON since jupyter notebooks are JSON files

```julia 
using JSON
``` 

After that we allocate a dictionary and parse the notebook. Since JSONs are just pretty dictionaries, we convert the whole file into one.

```julia 
dict2 = Dict()
open(ARGS[1], "r") do f
    global dict2
    dict2=JSON.parse(f)  
end

``` 

Now to identify the cells we need we have to add a #export to the start of the cell. Once we do that, we can go through all the cells and take the ones which have this #export in it. Then we filter this out so it does not appear in the end script. We add all this to a string. 

```julia 
gstr = "";

for a in dict2["cells"]
    if "#export\n" in a["source"]
        temp = a["source"]
        temp = filter!(e->e|"#export\n",temp)
        gstr*= join(temp)
        gstr*="\n"
    end
end
```

Then we write the file and we are done :)

```julia 
io = open(ARGS[2]*".jl", "w")
write(io, gstr)
close(io)
```

## Usage

- julia notebook2script.jl "pathToInput.ipynb" "pathToOutput"
- No need to add a .jl
- Done :)

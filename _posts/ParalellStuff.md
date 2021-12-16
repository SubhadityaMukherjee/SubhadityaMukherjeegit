---
layout: post2
title: Parallelizing functions in Python explained
categories: article
date: 2021-12-15
tags: data, functions, parallel
summary: Take any function operating on inputs -> Parallelize it
---

# What we have
I have a function. 
I have a lot of data.
I want to apply the function to every element in that data.
It's taking forever and why am I even doing this again?

# What we want to do
I have a function and data.
I want to run the function over multiple elements in the data simultaneously.
Why? The code executes much faster.

# The theory
A computer performs a lot of operations simultaneously using many techniques and we can use them to boost our own work as well. In our case, we want to perform the same operation on a long list of items. So what we can do is split up the elements, apply the function to them separately and them combine the returned values back into the list.
Just doing these sequentially might take long so we split the task up into "n" parts and give them to the computer separately. These days most computers have multiple CPUs. Doing this allows us to send these parts to different CPU's in the system to be computed simultaneously.
We do not need to do this manually of course. Your system already has many algorithms which use this kind of parallelism. Python allows us to access it directly.

# Why didn't you just share a code snippet?
Simply put, this article is not for the advanced programmers out there. If you are one of them, you could find this on the fast.ai codebase and be done with it. But it is an interesting function to pose to the more intermediate programmers who are looking to improve their skills.
I also wanted this to be a learning exercise and not a blind copy paste. 
Onward!

# How do I implement this?
## Imports
We first need to grab some libraries.
```py
import os
import concurrent
from concurrent.futures import ProcessPoolExecutor
from typing import * #types
from tqdm import tqdm #progress bar
```
These will let us invoke Python's inbuilt parallelism and define a way for us to make this more tuned to our usecase.
The first thing we need to do is identify how many threads we can use. Let us define a function that we can use for this.
An affinity mask is a system function that returns how many CPU's the running program is allowed to use.

```python
def num_cpus():
    """
    Get number of cpus
    """
    try:
        return len(os.sched_getaffinity(0))
    except AttributeError:
        return os.cpu_count()
```

Another teeny function we want to define before we begin anything is to make sure we take into account any None values.

```python
def ifnone(a, b): return b if a is None else a
```
Now that that is taken care of, we can finally look at the parallel function. Some of the parts might seem a little dense so here is a little explanation of each major part.

1. Get the number of CPUs we can use
2. Find the maximum number of threads (workers) we can use
3. If there is only one worker
   1. Iterate over the values in the list and apply the function to each sequentially.
4. If there are more than two workers
   1. Create a pool of tasks using the maximum number of workers. This will start that many parallel processes.
   2. Run this using the syntax for ProcessPoolExecutor.
   3. If all the tasks have been completed, add their results to an array so we can return it.

Some syntax might still seem weird to you. 
1. max_workers is the number of threads we can use.
2. ex.submit sends each task to the cpu so it can be done in parallel.
3. tqdm is a little progress bar helper that will show us how long is left.

```python
def parallel(func, arr: Collection, max_workers: int = 12):
    _default_cpus = min(max_workers, num_cpus())
    max_workers = ifnone(max_workers, _default_cpus)
    if max_workers < 2:
        results = [func(o) for i, o in tqdm(enumerate(arr), total=len(arr))]
    else:
        with ProcessPoolExecutor(max_workers=max_workers) as ex:
            futures = [ex.submit(func, o) for i, o in enumerate(arr)]
            results = []
            for f in tqdm(concurrent.futures.as_completed(futures), total=len(arr)):
                results.append(f.result())
    if any([o is not None for o in results]):
        return results
```

# How to use this?
Consider a list of the first 10000 numbers. I want to parallelly square every number. (Yes I know I can just use numpy but this is a simple example.)
```
p = [x for x in range(10000)]
def squarer(x): return x**2

parallel(squarer, p)
```
Of course this is a tiny example. But this works for any use case you throw at it. Do note that sometimes it is better to improve your original function or use a super optimized version of your code (eg: use numpy)

# For me?
This is a generic piece of code. Should you require, you actually can modify it to fit your needs. Once you understand what is happening, it actually is pretty easy to do that. For instance, if you need the function to take arguments you could use the 'partial' function from the functools module.
If you want the index of the array along with the object, just add the index (i here) to the call as well.

```python
if max_workers < 2:
        results = [func(i, o) for i, o in tqdm(enumerate(arr), total=len(arr))]
    else:
        with ProcessPoolExecutor(max_workers=max_workers) as ex:
            futures = [ex.submit(func, i, o) for i, o in enumerate(arr)]
```


# A thank you note
Most of this code was written by Jeremy Howard for the fast.ai library. [link](https://github.com/fastai/fastai1/blob/a8327427ad5137c4899a1b4f74745193c9ea5be3/fastai/core.py). Being just a small cog in the wheel, I think it did not get the attention it deserves. Hence this little article. Therefore a huge thank you to him :)

You readers also deserve a thank you for making it to the end of this article. It is a tiny one but I hope it broadened your horizons.
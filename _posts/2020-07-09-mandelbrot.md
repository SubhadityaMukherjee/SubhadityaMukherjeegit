---
layout: post
title:  Mandelbrot set
date:   2020-07-09
summary: Using Julia
categories: article
tags: mandelbrot julia pattern infinity set math equations beauty pretty
---

[title]

Have you heard of fractal patterns? Here we will try to make some :) (look at the pictures at the end)

A mandelbrot set is obtained from the recurrence relation $$ Z_{n} = Z^2_{n-1} + c$$ where $$ Z_{0} $$ is a complex number.
Note : Most of the code is from a python source which I converted to Julia [Link](https://levelup.gitconnected.com/mandelbrot-set-with-python-983e9fc47f56)

Okay lets get to it. 

## What we want

We take complex numbers
See if they diverge to infinity
Or converge to 0 (over a fixed number of iterations and not infinity because well inifnity is too far away xD)
At every point, provide a color if the condition is satisfied
Since I am really bored, let us add multiple conditions based on randomness.

## Coding what we want

Let us load the one package we need for this.

```julia
using Plots
```

First to find out if the number diverges and how many steps it takes to do so. (Given a constraint)

Let us create a backup of our complex number, and give it a max steps. Since we cannot check for infinity, let us also define a threshold to check if the number is diverging till there or not.

Now Julia handles complex numbers a bit differently so to work the python way, we need to hack it a bit and add the two halves that Julia stores it as. We also do that for c because the clone z does not affect c.
Now as long as we do not exceed the maximum steps we have defined, we check for the breaking condition 

$$\left( \mathrm{real}\left( z \cdot \mathrm{conj}\left( z \right) \right) \lt threshold \right)$$

If this is also satisfied, we basically keep doing  $$z = z \cdot z + c$$ until the condition is not met and keep incrementing i. When the loop ends, we have the count of the number of steps it took and that is our i which we return.

>  I really love the @show . It gives an output like z = "some val" y = "some val" which makes it really easy to debug. Even @info is really cool

``` julia
function get_iter(c,thresh=4, max_steps = 25)
    z, i = c, 1
    
    z = z[1]+z[2]im
    c = c[1]+c[2]im
    conz = conj(z)
    #@show z, conj.(z)
    #@show z*z
    while (i<max_steps) && (real(z*conz) < thresh)
        z = z*z +c
        
        i +=1
    end
    #@show z    
    return i 
end
```

Okay now for the actual loop for to generate our image.

This could look a little complicated, but it is really simple. We do have to make use of some predefined equations though. We pass in the how big we want our initial matrix (n) and the maximum number of steps we want it to run for. The equations are

$$mx = \frac{2.48}{n - 1} ; my = \frac{2.26}{n - 1} $$

Now we define an empty matrix of size (n,n) and multiply it by 255. Since we want an image, 255 is the color black which will allow us to make a blank image.
Now for every point in the image (which is a matrix) we use a function to obtain its value.

$$mapper(x,y) = (mx \cdot x - 2, my \cdot y - 1.13) $$

We pass this obtained value to the function which we had defined to check if the number is diverging or not and for every point, return 255 - the obtained value.
We are almost done by now but I wanted to add something extra before we get to plotting it.

``` julia
function plotter(n , thresh, max_steps= 50,mxv = 2.48, myv = 2.26)
    mx = mxv/(n-1)
    my = myv/(n-1)
    mapper(x,y) = (mx*x - 2, my*y - 1.13)
    img = ones(n,n).*255
    for x in collect(1:n)
        for y in collect(1:n)
            temp = mapper(x-1,y-1)
            #@info temp
            temp = complex.(temp)
            #@info temp
            it = get_iter(temp,thresh, max_steps)
            #@show it
            #@info x,y
        end
        #break
    end
    return img
end
```

After this we have an output like this.

<img src="{{site.baseurl}}/assets/img/frac2.png" alt="drawing" width="500"/>

What if we wanted to add noise to the output?

``` julia
  prob = rand(1)[1]
            if prob>.5
                img[y,x] = 255- it
            elseif prob >.8
                img[y,x] = 155- it
            else
                img[y,x] = 100- it
            end
```
Let us just return different values at random points.

Okay now for the final bit.

Let us use a (1000, 1000) matrix with threshold 50 and max iterations 200.
We need to plot a heatmap. Of course, the colors are defined by the colormap which can be chosen as whatever looks the prettiest.

``` julia
fractal_img = plotter(1000,50,200);
heatmap(fractal_img, fillcolor = :blues)
```

## Outputs

Aren't these pretty??

<img src="{{site.baseurl}}/assets/img/frac3.png" alt="drawing" width="500"/>

<img src="{{site.baseurl}}/assets/img/madel.png" alt="drawing" width="500"/>

<img src="{{site.baseurl}}/assets/img/madel2.png" alt="drawing" width="500"/>

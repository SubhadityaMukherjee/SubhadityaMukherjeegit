---
layout: post
title:  My life is a lie + Even faster conv 
date:   2020-07-10 22:24:36 +0400
tags:
---

Why CNNs are Correlation Neural Networks and an even faster Convolution operation.

Okay so, my life is a lie. And the operation I have been calling convolution till now is actually correlation, mathematically. But historical reasons deem that it is called Convolution. So technically, we are working with Correlation Neural Networks. Admittedly, that does not sound cool enough, so let us just stick to calling it what we did so far.

Anyway, today I was thinking of implementing an even more optimized convolution. This is done by first converting the image to a column. We do the same for the kernel, and follow what we did previously. And use FFT in the end as usual.

Okay so first, lets get what we need. Cairo and Gtk are to save the outputs directly.

``` julia
using Plots,Images, ImageView,TestImages, Cairo,Gtk
```

Now we need to define a way to convert an image to a column vector.
We first input the block size and store it away. Do the same for the height and width of the image. 
After we have that, we create an empty array with dimensions $$m \cdot n; mc \cdot nc $$. Then we iterate over the matrix and store away the values we need.
Why do we do this? Well quite obviously, performing an operation over a single dimension will be much faster than doing it over multiple dimensions.
What is @views? This is a really cool functionality where we are actually accessing a particular part of the array without copying it to memory but modifying it. All in the name of optimization.

``` julia
function im2col(A, block_size) # mxn: block_size
            m,n = block_size
           M,N = size(A)
           mc = M-m+1          # no. vertical blocks
           nc = N-n+1          # no. horizontal blocks
           B = Array{eltype(A)}(undef, m*n, mc*nc)
           for j = 1:nc
             for i = 1:mc
               @views block = A[i:i+m-1, j:j+n-1]
               for k=1:m*n
                  B[k,(j-1)*mc+i] = block[k]
               end
             end
           end
           return B
       end
```

Quite obviously, we need to reverse it as well. So we define col2im.
This is quite simple. We just use a reshape function with the size we want it to be in.

``` julia
function col2im(A,block_size)
    mm, nn = block_size
    return reshape(A, (mm, nn))
end
```

So lets test it out!
Let us take our beloved mandrill using testimages.

<img src="{{site.baseurl}}/img/deconstrucImages/mandorig.png" alt="drawing" width="200"/>

Then we can apply channelview on it and convert the values to Float32. Let us also just index out the 1st dimension. (since it is a colored image, there are 3 dimensions).
Then we do an im2col on it with the same dimension as that of the image.

``` julia
img = channelview(testimage("mandrill"))[1,:,:];
img = convert.(Float32,img)
flat_im = im2col(img, (512,512));
```

Once we have that, we get an array of dimension 262144×1.

Now we pad the kernel using the padding function we defined before (Check the padding post) and we apply im2col to that too.

``` julia
kernel_padded = pad_constant(img, kernel)
flat_ker = im2col(kernel_padded, (512, 512));
```

Now both our images are of the same dimensions. We can directly apply FFT on this now.

``` julia
@time conv = ifft(fft(flat_im).*fft(flat_ker))
0.038521 seconds (190 allocations: 20.010 MiB)
```

Wow. Without this, it was around  0.063075 seconds (190 allocations: 76.304 MiB). Not only did it take half the time, the memory it took is so much lesser.

I wonder what this looks like.

``` julia
imshow(col2im(real.(conv),(512, 512)))

function write_to_png(guidict, filename)
    canvas = guidict["gui"]["canvas"]
    ctx = getgc(canvas)
    Cairo.write_to_png(ctx.surface, filename)
end

write_to_png(out1, "/home/subhaditya/Desktop/GITHUB/SubhadityaMukherjee.github.io/img/deconstrucImages/imconv.png")
```

<img src="{{site.baseurl}}/img/deconstrucImages/imconv.png" alt="drawing" width="200"/>

Fun.

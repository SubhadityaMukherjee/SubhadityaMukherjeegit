---
categories: article
layout: post
title:  Initialization
date:   2020-06-21 
tags: inititialize xavier he glorot kaiming normal random uniform zeros lsuv
summary: Intialization techniques
---

[title]

We explore the different initialization techniques that we have and look at papers to see which does better.

Here goes!

- Zero Initialization: set all weights to 0
Please dont. I mean its the worst idea. But anyway.

``` julia
W = zeros(2,100)
b = zeros(2)
```

- Normal Initialization: set all weights to random small numbers

This is what we did as a test. It does better than init 0 but still. Not a great idea.

``` julia
W = rand(2,100)
b = rand(2)
```

- Lecun Initialization: normalize variance

LeCun, Y. A., Bottou, L., Orr, G. B., & Müller, K. R. (2012). Efficient backprop. In Neural networks: Tricks of the trade (pp. 9-48). Springer, Berlin, Heidelberg.

Since variance grows with number of inputs. This makes it constant xD
It draws samples from a truncated normal distribution centered on 0 with stddev <- sqrt(1 / fan_in) where fan_in is the number of input units in the weight tensor.

``` julia
using Distributions
lecun_normal(fan_in) = return Distributions.Normal(0, sqrt(1/fan_in))
W = rand(lecun_normal(2), 2, 100)
b = rand(lecun_normal(2), 2)
```

- Xavier Intialization (glorot init)
X. Glorot and Y. Bengio, “Understanding the difficulty of training deep feedforward neural networks,” in International conference on artificial intelligence and statistics, 2010, pp. 249–256.

This works better with Sigmoid activations.

There are two of them. Xavier normal and Xavier uniform.
First Xavier Normal - It draws samples from a truncated normal distribution centered on 0 with stddev = sqrt(2 / (fan_in + fan_out)) where fan_in is the number of input units in the weight tensor and fan_out is the number of output units in the weight tensor.

``` julia
xavier_normal(fan_in,fan_out) = return Distributions.Normal(0, sqrt(2/(fan_in+fan_out)))

W = rand(xavier_normal(2,100), 2, 100)
b = rand(xavier_normal(2,2), 2)
```

Now Xavier Uniform - It draws samples from a uniform distribution within -limit, limit where limit is sqrt(6 / (fan_in + fan_out)) where fan_in is the number of input units in the weight tensor and fan_out is the number of output units in the weight tensor.

``` julia
function xavier_uniform(fan_in,fan_out)
    limit = sqrt(6/(fan_in+fan_out))
    return Distributions.Uniform(-limit, limit)
end

W = rand(xavier_uniform(2,100), 2, 100)
b = rand(xavier_uniform(2,2), 2)
```

- Kaiming Initialization (he init)

K. He, X. Zhang, S. Ren, and J. Sun, “Delving Deep into Rectifiers: Surpassing Human-Level Performance on ImageNet Classification,” arXiv:1502.01852 [cs], Feb. 2015.

This works better with ReLU/Leaky ReLU activations. This is mostly used everywhere because we use ReLU more than Sigmoid now.
Wow. This is just different from Xavier in the fact that there is no fan out :/ And here I thought it was some complicated thing.

He Normal - It draws samples from a truncated normal distribution centered on 0 with stddev = sqrt(2 / fan_in) where fan_in is the number of input units in the weight tensor.

``` julia
he_normal(fan_in) = return Distributions.Normal(0, sqrt(2/(fan_in)))

W = rand(he_normal(2), 2, 100)
b = rand(he_normal(2), 2)
```

He uniform - It draws samples from a uniform distribution within -limit, limit where limit is sqrt(6 / fan_in) where fan_in is the number of input units in the weight tensor.

``` julia
#export
function he_uniform(fan_in)
    limit = sqrt(6/(fan_in))
    return Distributions.Uniform(-limit, limit)
end

W = rand(he_uniform(2), 2, 100)
b = rand(he_uniform(2), 2)
```

- LSUV
Mishkin, D., & Matas, J. (2015). All you need is a good init. arXiv preprint arXiv:1511.06422.

We cannot implement this yet because it requires us to hook into the model while it is training ):
But all it does is when the mean of the current output is > 1e^-3 then we subtract the mean from the bias.
If the current outputs standard deviation -1 is > 1e^-3 then we divide the weight by the standard deviation.


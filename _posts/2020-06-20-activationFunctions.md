---
layout: post
title: Activation functions
date:   2020-06-20 02:00:43 +0400
tags: activation leaky swish sigmoid soft
---

Activation functions are an extremely important part of any neural network. But they are actually much simpler than we make them out to be. Here are some of them.
Lets define a test matrix.

```julia 
test = [100 1.0 0.0 -300.0;100 1.0 0.0 300.0]
```


## Relu
- The Rectified Linear Unit (ReLU) activation function produces 0 as an output when x < 0, and then produces a linear with slope of 1 when x > 0.
- Nair, V., & Hinton, G. E. (2010, January). Rectified linear units improve restricted boltzmann machines. In ICML.
- f(x) = max(0,x)

```julia
relu(mat) = max.(0, mat)
``` 

## Leaky relu
- Andrew L. Maas, Awni Y. Hannun, Andrew Y. Ng (2014). Rectifier Nonlinearities Improve Neural Network Acoustic Models.
- f(x) = max(0.01x,x)

```julia
lrelu(x) = max.(0.01x, x)
```

## PRelu
- f(x) = max(x, x*a)

```julia
#export
prelu(x,a) = max.(x, x.*a)
prelu(test,0.10)
```

## Maxout
- f(x) = max(x, x*a)

```julia
maxout(x,a) = max.(x, x.*a)
maxout(test,0.10)
```

## Sigmoid
- f(x) = 1/(1+e^-x)

```julia
σ(x) = 1 ./(1 .+exp.(-x))
σ(test)
```

## Noisy Relu
- f(x) = max(0, x+Y) where YϵNormal(0,1)

```julia
using Distributions
noisyrelu(x) = max.(0, x.+rand(Distributions.Normal(), 1))
noisyrelu(test)
```

## Softplus
- f(x) = log(e^x+1)

```julia
softplus(x) = log.(exp.(test).+1)
softplus(test)
```

## Elu
- f(x) = max(x, a*(e^x-1))

```julia
elu(x,a) = max.(x, a.*(exp.(x) .-1))
elu(test,0.1)
```


## Swish
- f(x) = x/(1+e^(-βx))

```julia
swish(x,β) = x ./(1 .+exp.(-β.*x))
swish(test,0.1)
```

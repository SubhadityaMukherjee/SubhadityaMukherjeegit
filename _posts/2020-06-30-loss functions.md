---
layout: post
title:  Loss Functions
date:   2020-06-30 00:01:59 +0400
tags: loss functions log softmax bce logits margin ranking huber smooth l1 mean absolute negative log binary cross entropy cosine similarity kl divergence log cosh mae percentage root poisson sparce hinge squared triplet margin ctc multi label soft
---
{% katexmm %}
In this post we shall explore as many loss functions as I can find.

Loss functions are arguably one of the most important factors in a machine learning model. It gives the model an understanding of how well it did and basically allows it to learn. Simply put, it is the difference between the required result and the produced one. Quite obviously this is different in every place.
For example in a Generative Adversarial Network (GANs), the loss function is the completely different. In WGAN, it is a distance metric called Wassertein distance.
In a unet, the loss is the difference between the two images and so on and so forth.

Anyway let us explore everything we can about loss functions. I first made a list of all the loss functions offered by keras. It seems to be pretty comprehensive and I have not heard of many of them so far so lets see.
Edit : Maybe this isnt a fully comprehensive list. But I will add to it if I find more later. I realized that most of these seem to just be small modifications on previous ones. And some are beyond my understanding right now. But I will come back to them when I get it. (I added a tiny list of those I dont understand yet at the bottom)

> Since I am arbitrarily hooking together loss functions from every library I can find, if you feel something is wrong do let me know :)
> Also note that the examples used are not necessarily the ones that will be used while training and are random values used to test if the code is working

## Log softmax

$$\log\left( \frac{e^{ŷ}}{\mathrm{sum}\left( e^{ŷ} \right)} \right)$$

``` julia
logsoftmax(ŷ) = log.(exp.(ŷ)/sum(exp.(ŷ)))
```

## BCE Logits

$$\left(  - \mathrm{sum}\left( y \cdot \mathrm{logsoftmax}\left( ŷ \right) \cdot weight \right) \right) \cdot \mathrm{//}\left( 1, \mathrm{size}\left( y, 2 \right) \right)$$

``` julia
bcelogits(y,ŷ,weight)  =-sum(y .* logsoftmax(ŷ) .* weight) * 1 // size(y, 2)
```

## Margin Ranking

- Creates a criterion that measures the loss given inputs x1x1x1 , x2x2x2 , two 1D mini-batch Tensors, and a label 1D mini-batch tensor yyy (containing 1 or -1).
- If y=1y = 1y=1 then it assumed the first input should be ranked higher (have a larger value) than the second input, and vice-versa for y=−1y = -1y=−1 .
- take avg

$$\frac{1}{\mathrm{length}\left( y \right)} \cdot \mathrm{sum}\left( \mathrm{max}\left( 0, \left(  - y \right) \cdot x1 - x2 + margin \right) \right)$$

``` julia
marginranking(x1,x2,y,margin=0.0) = (1/length(y))*sum(max.(0, -y.*(x1.-x2).+margin))
```

## Huber/Smooth L1/Smooth MAE

- It is less sensitive to outliers than the MSELoss and in some cases prevents exploding gradients
- Fast RCNN

if $$\left( \left\|y - ŷ\right\| \lt 1.0 \right) >1 $$

$$\frac{1}{\mathrm{length}\left( y \right)} \cdot \mathrm{sum}\left( 0.5 \cdot \left( y - ŷ \right)^{2} \right)$$

else

$$\frac{1}{\mathrm{length}\left( y \right)} \cdot \mathrm{sum}\left( \left\|y - ŷ\right\| - 0.5 \right)$$

``` julia
function huber(y,ŷ) 
    
    if count(x->x==0, all.(abs.(y.-ŷ).<1.0))>=1
        return (1/length(y)).*sum(0.5 .*(y .- ŷ).^2)
    else
        return (1/length(y)).*sum(abs.(y .- ŷ).-0.5)
    end
end
```

## Negative log likelihood

- Classification,  Smaller quicker training, Simple tasks.

$$ - \mathrm{sum}\left( \log\left( y \right) \right)$$

``` julia
nll(y) = -sum(log.(y))
nll(x,y) = -sum(log.(y))
```

## BCE

- classification 2 cat

$$\frac{1}{\mathrm{length}\left( y \right)} \cdot \mathrm{sum}\left( y \cdot \log\left( ŷ \right) + \log\left( 1 - y \right) \cdot \log\left( 1 - ŷ \right) \right)$$

``` julia
bce(y,ŷ) = (1/length(y))*sum(y.*log.(ŷ).+(log.(1 .-y).*log.(1 .-ŷ)))
```

## CategoricalCE

- classification n cat

$$ - \mathrm{sum}\left( y \cdot \log\left( ŷ \right) \right)$$

``` julia
cce(y,ŷ) = -sum(y.*log.(ŷ))
```

## Cosine similarity

L2 norm is $$\sqrt{\mathrm{sum}\left( \left( \left\|x\right\| \right)^{2} \right)}$$

Cosine similarity is$$ - \mathrm{sum}\left( \mathrm{l2norm}\left( y \right) \cdot \mathrm{l2norm}\left( ŷ \right) \right)$$

``` julia
l2_norm(x) = sqrt.(sum((abs.(x).^2)))
function cosinesimilarity(y,ŷ)
    return -sum(l2_norm(y).*l2_norm(ŷ))
end
```

## KL Divergence
- Classification
- Same can be achieved with cross entropy with lesser computation, so avoid it.

We first define xlogx for a weird edge case $$x \cdot \log\left( x \right)$$

Then entropy $$\mathrm{sum}\left( \mathrm{xlogx}\left( y \right) \right) \cdot \mathrm{//}\left( 1, \mathrm{size}\left( y, 2 \right) \right)$$

Then cce as defined before $$ - \mathrm{sum}\left( y \cdot \log\left( ŷ \right) \right)$$

Finally KLD $$entropy + crossentropyloss$$

``` julia
function xlogx(x)
  result = x * log(x)
  ifelse(iszero(x), zero(result), result)
end

function kldivergence( y,ŷ)
  entropy = sum(xlogx.(y)) * 1 //size(y,2)
  cross_entropy = cce(ŷ, y)
  return entropy + cross_entropy
end
```

## Log Cosh
- works like the MSE, but is smoothed towards large errors (presumably caused by outliers) so that the final error score isn’t impacted thoroughly.

We first define the softplus function $$\log\left( e^{x} + 1 \right)$$

Then , $$x = ŷ - y$$

logcosh = $$\mathrm{mean}\left( x + \mathrm{softplus}\left( -2 \cdot x \right) - \log\left( 2.0 \right) \right)$$

``` julia
softplus(x) = log.(exp.(x).+1)
function logcosh(y,ŷ)
    x = ŷ - y
    return mean(x.+softplus(-2 .*x) .- log(2.))
end
```

## MAE == L1

- Mean absolute error
- Use Mean absolute error when you are doing regression and don’t want outliers to play a big role. It can also be useful if you know that your distribution is multimodal, and it’s desirable to have predictions at one of the modes, rather than at the mean of them.
- Denoising, reconstruction

There are two ways of doing this, mean and sum.
For mean,

$$\frac{1}{\mathrm{length}\left( y \right)} \cdot \mathrm{sum}\left( \left\|y - ŷ\right\| \right)$$

For sum,

$$\mathrm{sum}\left( \left\|y - ŷ\right\| \right)$$

``` julia
function mae(y,ŷ,reduction= "mean") 
    if reduction=="mean"
        return (1/length(y))*sum(abs.(y .- ŷ))
    elseif reduction=="sum"
        return sum(abs.(y .- ŷ))
    end
end
```

## MAPE

- mean absolute % error

$$\frac{1}{\mathrm{length}\left( y \right)} \cdot \mathrm{sum}\left( \left\|\frac{y - ŷ}{y}\right\| \right)$$

``` julia
mape(y,ŷ) = (1/length(y))*sum( abs.((y-ŷ)/y))
```

## MSLE

- Mean squared log error
- Use MSLE when doing regression, believing that your target, conditioned on the input, is normally distributed, and you don’t want large errors to be significantly more penalized than small ones, in those cases where the range of the target value is large.

$$\frac{1}{\mathrm{length}\left( y \right)} \cdot \mathrm{sum}\left( \left( \log\left( y + 1 \right) - \log\left( ŷ + 1 \right) \right)^{2} \right)$$

``` julia
msle(y,ŷ) = (1/length(y))*sum((log.(y.+1).-log.(ŷ.+1)).^2)
```

## MSE

- Regression
- Two types again with mean and no mean
- Mean $$\frac{1}{\mathrm{length}\left( y \right)} \cdot \mathrm{sum}\left( \left( y - ŷ \right)^{2} \right)$$

- Sum $$\mathrm{sum}\left( \left( y - ŷ \right)^{2} \right)$$

``` julia
function mse(y,ŷ,reduction= "mean") 
    if reduction=="mean"
        return (1/length(y))*sum((y .- ŷ).^2 )
    elseif reduction=="sum"
        return sum((y .- ŷ).^2 )
    end
end
```

## RMSE

- Root mean squared
- Regression
- Two types again with mean and no mean
- Mean $$\sqrt{\frac{1}{2} \cdot \mathrm{sum}\left( \left( y - ŷ \right)^{2} \right)}$$

- Sum $$\sqrt{\mathrm{sum}\left( \left( y - ŷ \right)^{2} \right)}$$

``` julia
bcelogits(y,ŷ,weight)  =-sum(y .* logsoftmax(ŷ) .* weight) * 1 // size(y, 2)
```

## Poisson

- When data is from poisson distr

$$\frac{1}{\mathrm{length}\left( y \right)} \cdot \mathrm{sum}\left( ŷ - \log\left( ŷ \right) \right)$$

``` julia
poisson(y,ŷ) = (1/length(y))*sum(ŷ.-log.(ŷ))
```

## Sparse CE

- For sparse matrices
- Categorical crossentropy

$$ - \mathrm{sum}\left( ŷ \cdot \log\left( ŷ \right) \right)$$

``` julia
sparsece(y,ŷ) = -sum(ŷ.*log.(ŷ))
```

## Squared Hinge

- problems involving yes/no (binary) decisions and when you’re not interested in knowing how certain the classifier is about the classification
- tanh for last layer
- maximum margin

$$\mathrm{sum}\left( \left( \mathrm{max}\left( 0, 1 - y \cdot ŷ \right) \right)^{2} \right)$$

``` julia
squaredhinge(y,ŷ) = sum(max.(0,1 .-(y.*ŷ)).^2)
```

## Triplet margin

- Requires tuples of anchor, positive, negative 
- alpha is the distance between positive and negative sample, arbitrarily set to 0.3

We first find the positive distance $$pos{distance} = \left( anchor - positive \right)^{2} -1$$

Then the negative distance $$neg{distance} = \left( anchor - negative \right)^{2} -1$$

Then the temporary loss $$posdistance - negdistance + \alpha$$

And the final loss $$\mathrm{sum}\left( \mathrm{max}\left( loss_{1}, 0.0 \right) \right)$$

``` julia
function tripletloss(anchor , positive, negative, α = 0.3)
    pos_distance = (anchor.-positive).^2 .+ (-1)
    neg_distance =  (anchor.-negative).^2 .+ (-1)
    loss_1 = (pos_distance.-neg_distance).+α
    return sum(max.(loss_1, 0.0))
end
```

## Hinge

- Classification
- SVMs
- the w are weights of the model (wow)

$$\mathrm{max}\left( 0, 1 + \mathrm{max}\left( w_{y} \cdot x - w_{t} \cdot x \right) \right)$$

```julia
hinge(x,w_y,w_t) = max.(0,1 .+ max.(w_y.*x .- w_t.*x))
```

## Loss functions I can't make sense of right now

- Honestly I feel like most of these are from NLP, which is why they dont make sense to me. I am yet to do NLP properly. But that's good because it means I can get back to them as and when I do them.
- Multi label margin
- CTC
- Categorical hinge
- Soft margin
- Multi label soft margin
{% endkatexmm %}

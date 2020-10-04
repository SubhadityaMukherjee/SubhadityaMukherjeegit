---
layout: post
title: Taking Batchnorm For Granted
date: 2020-10-03T19:52+04:00
tags: batch norm plots learning params black box digging in 
---

Here we will see what happens when we "dont" take Batchnorm for granted.

# Granted?

Batch Norm is one of the most widely used layers in a neural network. Ever since it came out, it became possible to train neural networks that were faster, more accurate and more resistant to change. 
Sounds almost magic doesn't it? You would think, for something so magical, the implementation must be crazy hard. (You would be wrong)

What happened is that due to the black box nature of a neural network, we started taking this magic for granted. There were many assumptions of course about how and why it had the effect it does, but I recently found a [paper](https://arxiv.org/abs/2003.00152) which made a **serious** attempt to understand it.

So what happens when we just train the batchnorm layers and freeze everything else? What happens when we use different types of networks? 
Let us dig in...

# What is Batch Norm

Before we get to anything, a quick primer on batchnorm.

Why do we need it? Standardize inputs to the network. This will allow the network to "focus" and learn whats more important numerically speaking.

Now, how does it look (Note that these are the components and not the entire implementation)

Here we first generate a random array. The inputs γ, β are learnable parameters which we will look into later. ϵ is a very small number which will prevent our values from becoming 0.
We first take the mean, then the variance and then we standardize the data using them. At the end we take a product and sum with the parameters.

Now, consider the random array is a batch of data, we apply this over the batch and instead of just the individual mean, we take a running mean. (aka a continuously changing value based on streaming data). Thats about it.

```jl
ran = rand(10,20)

function bnorm_x(x,γ, β, ϵ = 1e-5)
    mean_x = sum(x)/length(x) #mean of x
    variance_x = sum((x .- mean_x).^2)/length(ran) #variance of x
    x̂  = (x .- mean_x)/sqrt(variance_x^2 + ϵ)
    @info size(x̂ ), size(β), size(γ)
    return γ.*x̂  + β 
end
```

# Train!!

Okay so this bit will be in Pytorch. I will try to explain everything I do but I cannot paste the full code here as this will become too huge. So I will just show what is different from a standard training here.

The entire code (with comments) can be found at [my repository](https://github.com/SubhadityaMukherjee/pytorchTutorialRepo/tree/master/BatchnormOnlyBatchnorm)

So our main workflow remains the same as every other deep learning project.
1. Load data (check main.py)
2. Pre process it (check main.py)
3. Enumerate the batches
4. Optimize a loss function
5. Test it

We focus on steps 3 and 4 here. 

# Code

Let us first get the libraries we need. aka Pytorch and tqdm (this is a tiny little progress bar helper which I absolutely adore)

```py
import torch
import torch.nn as nn
import torch.nn.functional as F
from tqdm import tqdm
```

Before we think about going ahead, let us first try to understand what we want. We need to train the network as usual, but make sure that **only** the batchnorm layes get trained. Just to see how far we can stretch it.

To do that, let us create a function which goes through our entire model, and if it finds any layer which is NOT batchnorm, it will tell pytorch to forget the gradients for that layer. In the process, making sure that only the Batchnorm layers get trained. We freeze the weights and biases for that reason.

```py
def freezeOthers(m):
    for param in m.parameters():
        if not isinstance(m, torch.nn.modules.batchnorm._BatchNorm):
            if hasattr(m, 'weight') and m.weight is not None:
                m.weight.requires_grad_(False)
            if hasattr(m, 'bias') and m.bias is not None:
                m.bias.requires_grad_(False)
```

Now for the main training loop.
We first make the model trainable and send it to the GPU. Then we iterate over the data. Following pytorch standard loops, we reset the gradients and pass the batch through our model. 
We perform back propagation and step through our optimizer.
And then we apply our previous function. After this, our model will forget the gradients for every other layer.
We also add a tiny little option to print out the current loss. (This helps when you are looking at it train)        

```py
def train(args, model, device, train_loader, optimizer, epoch):
    model.train() # Setting model to train
    device = torch.device("cuda") # Sending to GPU
    for batch_idx, (data, target) in tqdm(enumerate(train_loader)):
        data, target = data.to(device), target.to(device)
        optimizer.zero_grad() #Reset grads 

        output = model(data) # Passing batch through model

        loss = nn.CrossEntropyLoss()(output, target) # Calculate loss 

        loss.backward() # Backprop
        optimizer.step() # Pass through optimizer
        model.apply(freezeOthers) # Dont train other layers

        if batch_idx % args.log_interval == 0:
            print(loss.item())
            if args.dry_run:
                break
```

# How did that do?

Well I tested ResNet110 on the CIFAR 10 dataset and for the normal network, I got a test accuracy of around 92%. 
While only training BatchNorm, I got to around 68% test accuracy.
Now you might think, that is very far off. Yes, it is.. but notice that we are using only around .48% of the data [Cite1](https://arxiv.org/abs/2003.00152)
Wow...

But is this conclusive? Well I did a few more experiments, but instead let me point you towards an awesome [blog post](https://wandb.ai/sayakpaul/training-bn-only/reports/The-Power-of-Random-Features-of-a-CNN--VmlldzoxMTIxODA) I found. It is by someone I admire and you can go and play around with the network and see the results for yourself instead of me giving you graphs.

# Not taking Batchnorm for granted

Now that we understand a bit more about how expressive these layers seem to be. Let me share some points I found extremely interesting from the paper[Cite 1](https://arxiv.org/abs/2003.00152).

1. BatchNorm learns to disable features in the network which allows it to learn pretty well and impose sparsity for the features
2. Affine parameters (ones that perform transformation of some sort) in the layers play a really important role
3. The layer helps the network to learn a better representation
4. Random features play an important role in a neural network, to an extent that we do not fully understand yet.
5. Placing BatchNorm before the activation leads to better performace
6. If we only train the layer, increasing the depth gives a better result than increasing the width
7. Many features in a network can be removed without affecting the values much
8. The shortcut connections in ResNets might actually be throttling performance due to them not being able to use BatchNorm properly
9. **Dont take Batchnorm for granted**

# Winding up

By now I think we come to realize that maybe we should not take what we think we know for granted. Sometimes it takes a difficult to digest paper to make one understand that. 
BatchNorm does play an important part in the network. And this somehow proves our need to be able to dig into the structure and the black box of Neural network architectures. 

I would love to discuss further and if you have any questions do feel free to reach out in the comments. Or connect with me on [Github](github.com/SubhadityaMukherjee/).

# References

- [Cite 1: Original paper](https://arxiv.org/abs/2003.00152) courtesy Jonathan Frankle et al.
- [Alvaro Duran](https://medium.com/deeplearningmadeeasy/everything-you-wish-to-know-about-batchnorm-6055e07fdce2)
- [The batchnorm paper](https://arxiv.org/pdf/1502.03167.pdf)
- [Link from pytorch forums](https://discuss.pytorch.org/t/retrain-batchnorm-layer-only/61324)

---
layout: post
title: More Deep Learning, Less Crying - A guide
date: 2021-03-05T18:42+04:00
tags: 
categories: article
---

This is a guide to make deep learning less messy and hopefully give you a way to use less tissues next time you code.

# Who is this article for? A checklist
If you can answer yes to most of them. Read. Or cry. Your choice of course.

- Do you work with deep learning models? 
- Why are there 15 hyperparameters???!!!! 
- Frequently run into bugs?
- Wish you didn't have to open google every 5 minutes while coding?
- I just want a working model dammit!!!
- Please. Why am I getting 3% accuracy. It's been 2 days. Please.
- I should have done an MBA. Why am I here. What is my purpose. (Okay maybe I can't help you with this one)

Oh yay. You made it here. Wipe your eyes for one last time because this will be a ride :)

PS. This might be a long-ish checklist but trust me, it will save you many tears. A note that the materials were compiled from way too many papers and slides so I do not have the proper citation for every statement here. In the references section you can find a list of all the ones I could find.

# What is covered here?

In this article, I have tried to cover the major parts that frustrate me on a daily basis and their potential solutions.
- This is platform independant. So it does not matter if you are using pytorch/tensorflow/caffe/flux.jl or any of the others.
- We first talk about some sensible default architecture and training choices you can make to get up and running quickly.
- Then we look at some tricks to make life easier and train our models faster and preserve stability.
- After that we look at some hyper parameters and decide which to spend our time on.
- Then for the juicy bit, we look at some common bugs and how to overcome them. This includes memory errors, under/over fitting errors etc.

# Sensible defaults

Most of the time, contrary to popular belief we can actually get pretty great results by using some default values. Or sticking to simpler architectures before using some complicated one and messing everything up.

## Architecture 

Let us look at some defaults we can look at while building a network.
Note that this goes from easy -> complicated
- Dataset with only images : Start with a LeNet like architecture -> ResNets -> Even more complicated ones
- Dataset with only sequences : Start with an LSTM with one hidden layer (or try with 1D convs) -> Attention or wave net based -> Transformers maybe
- Other : Start with a fully connected with 1 hidden layer -> This actually cannot be generalized

## Training choices

What about training? Once you have set up everything, you might be faced with endless options. What do you stick to?
- Optimizer : Honestly, stick to an Adam optimizer with lr = 3e-4. (Or use AdamW+ learning rate finder)
- Activations : Use relu for fully connected and convolution layers and tanh if you have an LSTM.
- Initialization : He or Glorot normal should do fine.
- Regularization : None (as a start). Look at this only when everything else is okay.
- Normalization : None (as a start). Batchnorm causes a lot of bugs so use only when everything else is working.
- Consider using a subset of the data or reduced number of classes at first.
- Try to overfit a single batch first and compare with known results. (More on this below)

# Tricks to use while training

Now this is just beautiful. Do give [this paper](http://openaccess.thecvf.com/content_CVPR_2019/papers/He_Bag_of_Tricks_for_Image_Classification_with_Convolutional_Neural_Networks_CVPR_2019_paper.pdf) by Tong He et al a read. It's amazing and covers these points in detail. So instead of repeating content, I have just given a tiny brief.
 
- Learning rate finder : Why use a constant learning rate when you can vary it and identify the one which does the best. In a fraction of time.
- Test time augmentation : Apply augmentation during inference.
- Progressive resizing : One of my favorites. If you are training on a large image size, why start big? Start small -> resize -> transfer learn -> rinse and repeat.
- 1 Cycle : Identify bounds for cyclic scheduling with a learning rate test. Then achieve superconvergence (sometimes)
- Gradual unfreezing : When transfer learning, freeze the pretrained layers and train the other layers to achieve better performance. Then gradually unfreeze the rest while traning.
- Choose the AdamW optimizer over Adam.
- Mixed precision training : Super easy to add. Basically uses float 16 for part of the components of the network. Your GPU will thank you trust me.

## Hyperparams
Have too many to choose from? Here are some you can look at in order of importance. (Thank you [Josh Tobin](https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=Josh+Tobin&btnG=&oq=josh+)).

- Spend most of your time on these : Learning rate, Learning rate schedules, Loss function and finally the Layer size.
- Spend a moderate amount of time on : Weight Initialization, Model depth, Layer parameters. 
- If you still have time : Optimizer, Optimizer params, Batch size, Nonlinearity

# Bugs

Some of the most common bugs we might face and how to begin solving them.

- Incorrect tensor shapes : Use a debugger.
- No normalization : Well, add it.
- Way too much preprocessing : Use only a few common ones. (Don't skip normalization)
- Incorrect inputs for loss functions : eg softmax will need loss with logits
- Set train/eval mode properly. 
- Numerical instability : Check exp, log, div functions
- Out of memory errors : Scale back memory intensive operations one by one
- Check data type (eg fp32, fp16 etc). Especially if you are using mixed precision.

## Tackling out of memory errors

Sometimes your GPU starts cursing at you. Sometimes it's your fault. Sometimes you just forgot the clear the cache. This is for the other times.

### Your tensors are too big
- Reduce your batch size
- Reduce fully connected layer sizes

### You have stuffed it with too much data
- Use an input queue of sorts (Dataloader)
- Reduce buffer size for dataset creation

### You are doing the same thing too many times (Duplicated operations)
- Memory leaks 
- Check if calling a function multiple times (eg. Initialization of a new tensor everytime you are doing something)
- Allocate some empty tensors at the start (Not recommended for variable length tensors)

## Single batch overfitting
Want a quick way to identify a bunch of errors? Just pass the same data batch again and again. And check for these signs. (Talk about a hack). Basically just do the opposite if any of these happen.

- Error goes up dramatically
        - Flip signs of loss functions or gradients
        - Do you have a high learning rate
        - Wrong dimensions for softmax
- Your error pretends to be a pinata and explodes
        - Check all your log, exp functions etc
        - Do you have a high learning rate
- Oscillating error
        - Corrupted labels
        - Do you have a high learning rate
- Plateaus
        - Might be too low a learning rate
        - The gradients might not be passing properly through the model
        - High regularization
        - Incorrect inputs to loss functions
        - Corrupted labels

# How well do you fit? 
No I am not talking about that snazzy dress you got before the lockdown.

## Underfitting
Your model cries over test data.

- Bulk up. Add more layers etc.
- Reduce regularization

## Overfitting 
Your model just cries anyway.

- Add more data to your training
- Normalization
- Data augmentation
- Increase regularization

## A good choice for either
- Choose a different (possibly more complex) model
- Check your hyper params
- Error analysis. (Maybe you did something not fun)

# Okay cool.. now what?
Well that about covers what I wanted to say here. It is by no means an exhaustive list. But that's why we have stack overflow right?
I sincerly hope this helped you out a bit. And made you feel a bit more confident. Do let me know!! You can always reach out in the comments or connect with me from my [website](https://www.subhadityamukherjee.me/).

# References

- [Full Stack Deep Learning bootcamp](https://www.youtube.com/watch?v=GwGTwPcG0YM&list=PL1T8fO7ArWlf6TWwdstb-PcwlubnlrKrm&index=1).
- He, T., Zhang, Z., Zhang, H., Zhang, Z., Xie, J., & Li, M. (2019). Bag of tricks for image classification with convolutional neural networks. In Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (pp. 558-567).
- Loshchilov, I., & Hutter, F. (2018). Fixing weight decay regularization in adam- Smith, L. N. (2017, March). Cyclical learning rates for training neural networks. In 2017 IEEE winter conference on applications of computer vision (WACV) (pp. 464-472). IEEE.
- Micikevicius, P., Narang, S., Alben, J., Diamos, G., Elsen, E., Garcia, D., ... & Wu, H. (2017). Mixed precision training. arXiv preprint arXiv:1710.03740.
- A huge shout-out to the following people whos lectures I referred to while writing the article. Since I looked at the lectures, it's actually not possible for me to cite every part of the article so I just decided to put a list of people instead. If there is any author you think should be here, please let me know. I will add it. 
- [Jeremy Howard](https://scholar.google.com/scholar?q=jeremy%20howard)
- [Josh Tobin](https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=Josh+Tobin&btnG=&oq=josh+)
- [Sergey Karayev](https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=sergey+karayev&btnG=&oq=sergey+kar)
- [Pieter Abbeel](https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=pieter+abbeel&btnG=&oq=pieter+abb)
- [Andrew Ng](https://scholar.google.com/scholar?q=andrew%20ng)
- [Andrej Karpathy](https://scholar.google.com/scholar?q=andrej%20karpathy)


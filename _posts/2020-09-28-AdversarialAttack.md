---
categories: article
layout: post
title: A murder mystery and Adversarial attack
date: 2020-09-28
tags: 
summary: adversarial attack on networks
---

[title]

How smart are neural networks? And can we break them and fool them into doing dumb things?

# Our friend Termy

Today we have a special guest. His name is Termy, he is a friendly robot from the year 2025. What is cool about him is that he has an AI and a really nice personality. He loves people and animals. (Or atleast is told to). He is programmed to never hurt them. The only thing he hates are guns. He will try to break them as soon as he finds them. 

On the way sadly, his system was hacked. Termy, being from the future, has a failsafe so he managed to kick his attacker out. But in the process, the part of his brain that recognizes objects is affected a tiny bit. Now for every image, a few pixels are different. 

Termy sees nothing wrong and continues his daily tasks. One day however, the police catch him trying to strangle a poor animal to death. 

The only question is.. why?

> Note that the code here is a toy example in JuliaLang. The entire code to train and generate such examples are at [this repository](https://github.com/SubhadityaMukherjee/pytorchTutorialRepo/tree/master/AdversarialFGSM)

# Meet Turty

Let us take Turty, a cute little turtle. 
We load his image, and convert it into a matrix from a matrix of RGB values.

<img src="{{site.baseurl}}/assets/img/deconstrucImages/turtle.jpg" alt="drawing" width="200"/>

```jl
using Images, ImageView
using Flux

img = Images.load("turtle.jpg")

ImageView.imshow(img)

new_img = channelview(colorview(RGB, img))

```

# Attacked 

Now Termy happens to know what a turtle is. He also knows what a gun is. How does he do that? Well using a neural network of course.

He is using a network trained to recognize thousands of types of images. In the attack though, his network had a small corruption. Instead of just taking the gradients in the backward pass, a small value ϵ creeped into the function. This is what happened.

```jl
function signtest(x)
        if(x == 0)
                return 0
        elseif(x < 0)
                return -1
        else
                return 1
        end
end

function fgsm_attack(image, ϵ, data_grad)
        sign_data_grad = signtest.(data_grad)
        peturbed_img = image + ϵ*sign_data_grad
        peturbed_img = clamp.(peturbed_img, 0,1)
        return peturbed_img
end
```

The attack is the function which represents the corruption by means of the peturbed image. 
Signtest is just a simple function to return a specific value based on the if the value in the image matrix is +, - or 0. 

peturbedimage = x + ϵ*sign(∇x J(θ, x, y))

Note that the last bit is the formula to find the gradient. 

What is passed to this image identifier is generally the gradient of the image, the image itself and the function generally keeps the values between 0,1 and returns the image.
Due to the peturbed function, the image now becomes this.

<img src="{{site.baseurl}}/assets/img/deconstrucImages/attacked.png" alt="drawing" width="200"/>

Apart from the color (which does not really matter), the image looks the same. But to Termy, this actually looks like a rifle!!

<img src="{{site.baseurl}}/assets/img/deconstrucImages/attackedpaper.png" alt="drawing" width="300"/>

This is from the [paper](https://arxiv.org/pdf/1707.07397.pdf)

# Why?

This happens because the gradient is altered to the network to appear as a bias. The probablities change, and the network actually feels more *confident* towards its prediction. 
Termy our dear friend, is now dangerous and must be put away...

# The power in your hands

As people who work with AI, we need to avoid the story of poor Termy. Because if you think about it, this is extremely scary. What if Termy thinks that a Stop sign is a Go? Or a person is a rifle? Or a rifle is a stick?

If Termy was driving, maybe he would hit a person because to him.. there is nobody there.

Scared?? This is called an Adversarial Attack.

# What do we do now?

Now that we have looked at what happens, and why it happens. What do we do about it?
The first thing, is to realize that it is a possibility. Deep learning has changed our world for good. In every aspect, every domain, neural networks have slowly crept in. But we have to take their power with a pinch of salt.. because.. it is us who hold this power.

There are many ways to counter this effect, the easiest is to include adversarial images in your training data itself. The function mentioned previously is called the [Fast gradient sign method](https://arxiv.org/abs/1412.6572). 
If you include these images in your set, there is a higher probability of defending against these attacks.

To be noted that this problem has not been fully solved. Majorly because it is hard for us to actually understand why this happens. To do that, we need to dig into the network and understand how it learns. Which we don't yet.

# A word of warning

Note that this is not just a small issue. This method generalizes across all types of network architectures. But the good side to all this is that, including these images not only makes your model perform better, it also helps secure the future of consumer applications. 
A lot of research is going on in this field. [Like this paper](https://www.sciencedirect.com/science/article/pii/S1877050918319884).

So the next time you make a system... try to add adversarial noise to it too and save poor Turty. 

---
layout: post
title:  Differentiable Programming
date:   2020-08-13 01:07:58 +0400
tags:
---

Deep Learning is dead. Hello Differentiable Programming. (Uh come on man)

## In theory

So what was deep learning and why did we move on? Or did we?
In summary, DL had the following steps -> Pick a bunch of inputs and outputs -> Start off by randomly defining a relationship -> Pass it through neural network -> perform gradient descent -> Optimize a loss function -> Repeat until it either works or blows up.

Now what? Well now we take this and realize that hey! What if we applied this to code itself??!! Crazy right? All it means is, why not take arbitrary (almost) code and if it can be differentiated, calculate its gradient and.. optimize it for a function!

Does that make sense? I guess not. So in other words. We can take existing equations which we say know parts of and then use this approach to fill in so to speak. What does this mean? We can apply domain knowledge and well defined laws and use data to find equations to model our system!

Say we have simulated a physics engine (many exist) and we run a simulation. Using a Neural ODE we can plug in the variables we need and compute an equation. "Theoretically"

> I am still figuring things out so I will update this as I go along. If I get anything wrong now, hopefully I will learn enough to fix it. If not, please do tell me 

## Example

## Automatic differentiation part 1



---
categories: article
layout: post
title:  Optimizers
date:   2020-07-29
tags: grad descent ada sgd momen
summary: Optimizers using Julia
---

[title]

Finally let us look at optimizers. Once that is done, we will be able to use Flux ML for a lot of things directly.

Wow I finally got to this article after 4 days. Just havent been feeling like working or doing anything related to DL. Burnout maybe? The quarantine is getting to my head haha. Anyway before I lose motivation again, here goes.

## What is it

So what is an "optimizer"? So remember the loss? Every network has a loss landscape, which basically means that if we plot all the possible losses, we will get something like this.

![img](/assets/img/grad.png) (Got this from wikipedia)

Our objective is to reach the least point in this landscape. The optimizer helps us get there faster. You can think of it like walking down a hill. You need to get to the bottom but how fast you get there depends on how you walk. If you know the way, you can reach faster right? But here we do not know the way, so all we can do is guess. The better the optimizer, the better we can "guess" our way down.
This is called Gradient Descent. (pun intended lol)

Okay so today we will be talking about a few of these optimizers. Before we do that let us load the MNIST data which we were using. 

## Data

We load the data, reshape it into the arrays as we want, one hot encode the labels. We also repeat this for the test set.

``` julia
using MLDatasets
using Random

train_x, train_y = MNIST.traindata()
test_x,  test_y  = MNIST.testdata();

images, labels = (reshape(train_x[:,:,1:1000], (28*28, 1000)), train_y[1:1000])
one_hot_labels = zeros(10,length(labels))
for (i,l) in enumerate(labels)
    one_hot_labels[l+1, i] = 1.0
end
labels = one_hot_labels

## same thing for test

test_images = reshape(test_x, (28*28, size(test_x,3)))
test_labels = zeros((10, size(test_x,3)))

for (i,l) in enumerate(test_y)
    test_labels[l+1, i] = 1.0
end
```

## Defin

Okay, now we can define relu and its derivative. We also take a batch size, learning rate(α) and number of iterations. 
Our images are of size 28x28. Pixels per image is basically 28*28. Since we have 10 numbers, num labels is 10. Hidden size is a parameter we define.

``` julia
relu(x) = x > 0 ? x : 0
relu2deriv(x) = x > 0 ? 1 : 0
batch_size = 100
α, iterations = (0.001, 100)
pixels_per_image, num_labels, hidden_size = (784, 10, 100)
```

## SGD

Now for the first optimizer - Stochastic Gradient Descent. Simply put, this is a random run down the slopes with the hope that we will reach the end. It works. And it was one of the first optimizers so treat it like a grandpa who you go for advice.

We first initialize all the required weights.

``` julia
weights_0_1 = 0.2 .* rand(pixels_per_image,hidden_size) .- 0.1
weights_1_2 = 0.2 .* rand(hidden_size,num_labels) .- 0.1

```

After we do that, we go through all the batches. We apply a linear layer and then a relu to each batch.
We also perform dropout. This is a step which will take us very far by preventing the network from learning "too much". This effectively kills a few nodes at random. So when the network actually learns, it learns wayy better. We then add the errors and yay we are done with forward propagation.


$$Error = \mathrm{sum}\left( \left( \mathrm{labels}\left[:, \mathrm{:}\left( batch_{start}, batch_{end} \right)\right]' - layer_{2} \right)^{2} \right)$$


``` julia
for j = 1:iterations
    Error, Correct_cnt = (0.0, 0)
    for i = 1:batch_size:size(images,2)-batch_size
        batch_start, batch_end = i, i+batch_size-1
        layer_0 = images[:, batch_start:batch_end]
        layer_1 = relu.(layer_0' * weights_0_1)

        
        dropout_mask = bitrand(size(layer_1))
        layer_1 .*= (dropout_mask .* 2)
        layer_2 = layer_1 * weights_1_2
        
        Error += sum((labels[:, batch_start:batch_end]' .- layer_2) .^ 2)
```

Now for back prop.
We basically count the number of examples we got correct from the data. Then we apply the derivatives of the linear layer and relu on the batches.
After this we update the weights which we had initialized before. This way our network learns :)

The weights are updated in this way  $$\alpha \cdot layer_{1}' \cdot layer_{2_delta}$$

``` julia
        for k=1:batch_size
            Correct_cnt += Int(argmax(layer_2[k, :]) == argmax(labels[:, batch_start+k-1]))[]
            layer_2_delta = (labels[:, batch_start:batch_end]' .- layer_2) ./batch_size
            layer_1_delta = (layer_2_delta * weights_1_2') .* relu2deriv.(layer_1)

            layer_1_delta .*= dropout_mask

            weights_1_2 += α .* layer_1' * layer_2_delta
            weights_0_1 += α .* layer_0 * layer_1_delta
        end
    end
      
```
We also need to see how well our network is doing and so we apply this to our test set and use mean squared error to check the accuracy every few epochs.

``` julia
    if (j % 2 == 0)
        test_Error, test_Correct_cnt = (0.0, 0)
        for i = 1:size(test_images, 2)

            layer_0 = test_images[:, i]
            layer_1 = relu.(layer_0' * weights_0_1)
            layer_2 = layer_1 * weights_1_2

            test_Error += sum((test_labels[:, i]' .- layer_2) .^ 2)
            test_Correct_cnt += Int(argmax(layer_2[1,:]) == argmax(test_labels[:, i]))
        end
        println("I: $(j) Train error: $(Error/size(images, 2)) Train accuracy: $(Correct_cnt/size(images, 2)) Test-Err:: $(test_Error/size(test_images, 2)) Test-Acc:: $(test_Correct_cnt/size(test_images, 2))")
    end
end
```

## SGD + momentum

Now to make it better, all we do is add momentum. Run fasteeerrrr. This works a lot better than the previous one so if you want to use SGD, do not forget momentum.

New terms. Momentum term and two velocities.

``` julia
μ= 0.9
v01 = rand(pixels_per_image,hidden_size)
v12 = rand(hidden_size,num_labels)
iterations = 10
```

Changing the weight terms taking momentum into account.

$$v12 = \alpha \cdot layer_{1}' \cdot layer_{2_delta}$$

$$v01 = \alpha \cdot layer_{0} \cdot layer_{1_delta}$$


``` julia
        Correct_cnt += Int(argmax(layer_2[k, :]) == argmax(labels[:, batch_start+k-1]))[]
            layer_2_delta = (labels[:, batch_start:batch_end]' .- layer_2) ./batch_size
            layer_1_delta = (layer_2_delta * weights_1_2') .* relu2deriv.(layer_1)

            layer_1_delta .*= dropout_mask

            v12 =α .* layer_1' * layer_2_delta
#             @info v12
            weights_1_2 += v12
            v01 =  α .* layer_0 * layer_1_delta
            weights_0_1 +=v01
```

## Adagrad

Since SGD was not living up to its chase, Adagrad *tried* to fix it. Instead of taking random jumps, we actually store the gradients for the previous timesteps and use it for our update step. We use a different equation here.
This basically stabilizes training a bit more and adaptively scales the parameter of learning rate based on the stored gradients. Sometimes this optimizer does not learn so keep that in mind. 
It does work very well with Sparse data.

Not much changes.
Updates 

``` julia
weights_0_1 = 0.2 .* rand(pixels_per_image,hidden_size) .- 0.1;
weights_1_2 = 0.2 .* rand(hidden_size,num_labels) .- 0.1;
g01 = rand(pixels_per_image,hidden_size);
g12 = rand(hidden_size,num_labels);
```

And the steps.

$$adjusted_{grad} = \frac{grad_{12}}{\sqrt{1.0e-7 + g12}}$$

``` julia
        for k=1:batch_size
            Correct_cnt += Int(argmax(layer_2[k, :]) == argmax(labels[:, batch_start+k-1]))[]
            layer_2_delta = (labels[:, batch_start:batch_end]' .- layer_2) ./batch_size
            layer_1_delta = (layer_2_delta * weights_1_2') .* relu2deriv.(layer_1)

            layer_1_delta .*= dropout_mask

            grad_12 =  α .* layer_1' * layer_2_delta
            g12 += grad_12.^2
#             @show size(g12)
            adjusted_grad = grad_12./sqrt.(0.0000001 .+ g12)
#             @show size(weights_1_2), size(adjusted_grad)
            weights_1_2 +=adjusted_grad
            
            
            grad_01 = α .* layer_0 * layer_1_delta
            g01 += grad_01.^2
            adjusted_grad = grad_01./sqrt.(0.0000001 .+ g01)
            weights_0_1 +=adjusted_grad
            
        end
```

## Adam

The one you actually should be using the most. (or AdamW which I have not implemented yet.)
The major difference from SGD are the varying learning rates and the fact that algo calculates the exp(gradient(batches)) aka the exponential moving average and also uses the variance. The learning rates are varied using the parameters β1 and β2. 
We also use a leaky relu. 

Defining batch normalization, leaky relu and its derivative.

$$bnorm = \frac{x - \mathrm{mean}\left( x \right)}{\sqrt{\left( \mathrm{var}\left( x \right) \right)^{2} + \epsilon}}$$

``` julia
bnorm(x, ϵ= 0.001) = (x .- mean(x))./sqrt(var(x)^2 + ϵ) 
lrelu(x,c = 0.01) = x > 0 ? x : c*x
lrelu2deriv(x,c = 0.01) = x > 0 ? 1 : c
```

Initializing weights and the parameters.
Loads of things to keep track of here. But the new things are just decay rates, learning rate and the timestep along with momentums and speeds.

``` julia
weights_0_1 = 0.2 .* rand(pixels_per_image,hidden_size) .- 0.1;
weights_1_2 = 0.2 .* rand(hidden_size,num_labels) .- 0.1;
β1 = 0.9
β2 = 0.999
α = 0.002
ϵ = 1e-8
t = 0
m, v, m2, v2 = 0,0,0,0
iterations = 20
```

The actual iteration changes a lot because Adam has a looooot of intermediate steps.

$$m = {\beta}1 \cdot m + \left( 1 - {\beta}1 \right) \cdot grad_{12}$$

$$v = {\beta}1 \cdot v + \left( 1 - {\beta}2 \right) \cdot grad_{12}^{2}$$

$$m\hat = \frac{m}{1 - {\beta}1^{t}}$$

$$v\hat = \frac{v}{1 - {\beta}2^{t}}$$

$$weights_{1_2} = weights_{1_2} + \alpha \cdot \frac{m\hat}{\sqrt{v\hat} + \epsilon}$$

``` julia
for i = 1:batch_size:size(images,2)-batch_size
        batch_start, batch_end = i, i+batch_size-1
        layer_0 = bnorm(images[:, batch_start:batch_end])
        layer_1 = lrelu.(layer_0' * weights_0_1)
#         @show layer_1
#         break
        dropout_mask = bitrand(size(layer_1))
        layer_1 .*= (dropout_mask .* 2)
        layer_2 = layer_1 * weights_1_2
        
        Error += sum((labels[:, batch_start:batch_end]' .- layer_2) .^ 2)
        
        t+=1
        
        for k=1:batch_size
            Correct_cnt += Int(argmax(layer_2[k, :]) == argmax(labels[:, batch_start+k-1]))[]
            layer_2_delta = (labels[:, batch_start:batch_end]' .- layer_2) ./batch_size
            layer_1_delta = (layer_2_delta * weights_1_2') .* lrelu2deriv.(layer_1)

            layer_1_delta .*= dropout_mask

            grad_12 =  α .* layer_1' * layer_2_delta
            grad_01 = α .* layer_0 * layer_1_delta
            
            m = β1*m .+ (1-β1).*grad_12
            v = β1*v .+ (1-β2)*(grad_12.^2)
            m̂ = m./(1 .-β1^t)
            v̂ = v./(1 .-β2^t)
            weights_1_2 = weights_1_2 .+ α*(m̂./(sqrt.(v̂) .+ϵ))        

            m2 = β1*m2 .+ (1-β1).*grad_01
            v2 = β1*v2 .+ (1-β2)*(grad_01.^2)
            m̂2 = m2./(1 .-β1^t)
            v̂2= v2./(1 .-β2^t)
            weights_0_1 = weights_0_1 .+ α*(m̂2./(sqrt.(v̂2) .+ϵ))        
#             @show weights_0_1[1], weights_1_2[1]

        end
    end
```

Yay we can use it nowww!!

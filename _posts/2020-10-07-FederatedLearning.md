---
categories: article
layout: post
title: Federated Learning
date: 2020-10-07T20:15+04:00
tags: federated syft clusters secure
---

Today we will talk about Federated Learning

Want the smarts machine learning offers? That is awesome, but how secure is your data there really? And what if you could have the benefits without there being a chance of your data being leaked? 

We will have a look at Federated Learning and understand how it works. We will also look at a few papers and what they have to say on the matter and take the library [Syft](https://github.com/OpenMined/PySyft/) for a whirl.

# Why is this a problem?

Think about this from the perspective of an app that connects you with your doctor. It is a great app, and even has the ability to forecast future appointments and sometimes even suggest common medication. Now one fine day the company gets sold and all your data is in someone else's hands. And not just medical information, but what the Deep Learning algorithm learned about you and your behaviour. 
Just data privacy is great for standard data like medical reports etc. But what about a DL algorithm?
What about a model that learns how you speak, how you text your friends, what food you like? 

Scary isn't it? 
Now let us look at how we can prevent Company X from having more information on you than you have about yourself.

# Enter Federated Learning

Drumroll.. 
Let us first understand what we want to do. 
Consider a keyboard app. Say we have 200 users of our keyboard app.(Not very popular sadly). Now this is an intelligent keyboard and as time goes by, it learns how the users type, what words they use and is even able to predict what they might say to a given sentence. We want to make sure that if there is a leak, it should not be possible for whoever gets it to identify a unique model for the user.

You might think, hey that's easy. Let's just train the network on their phones!
You are right. Almost.
The only issue is that our phones cannot afford to train the entire model. And if we use a pretrained one? Well.. the predictions are just not personalized enough.

So how about we train the model first on huge clusters of computers and then send the pretrained ones to the phones? Perfect. How about personalization? Why not **update** the model on the phone? 
That's great. But how will the main model get better? If we send the model this phone has learnt, it would defeat our purpose.
How about we aggregate the learning across users? 

There we go.. lets call that federated learning :)

P.S (The keyboard example is from the [Google keyboard paper](https://arxiv.org/pdf/1903.10635.pdf))

# What is this magic?

Let us dig into the steps involved in making a Deep learning algorithm and identify what changes we need to make

1. Get data (Hopefully a lot)
2. Preprocess (aka clean up) the data
3. Find/create an architecture
4. Train the model using the data(1) and the architecture(3). This step is done once. And then periodically updated as the data changes over time. Keep this in mind.
5. Push the model out to n users
6. Collect data about how well the model did. (Bye bye privacy)
7. Send this data back to the main model.
7 (#new). Find the difference between the original model and the personalized one's parameters. Do this for multiple users. Remove identifiable information.
7.1 (#new). Aggregate (eg. average) the information and then send that to the main model
8. Retrain the model on new data

# Yay! What does this do?

- All your information is locally stored and is never sent anywhere
- Saves your personalized data from being leaked
- Removes all connections to you
- Allows the model to be updated and become better without compromizing on privacy
- Nobody "owns" your data except you

# Can I add this to my model? 

Yes! There are many ways but the easiest by far is by using a library in Pytorch called Syft. It is as easy as adding a few lines to your code.

(Since the entire code is huge, I will only put snippets here. For the entire code, refer to my [repository](https://github.com/SubhadityaMukherjee/pytorchTutorialRepo/tree/master/FederatedLearningPySyft))

0. Do look at this [article](https://blog.openmined.org/upgrade-to-federated-learning-in-10-lines/) by Open Mined
1. Let us take a simple architecture with 2 Conv layers and 2 linear (fully connected) layers
2. Import the library(along with the other pytorch ones) and add 2 users
```py
import syft as sy
hook = sy.TorchHook(torch)
bob = sy.VirtualWorker(hook, id="bob")  # person1
alice = sy.VirtualWorker(hook, id="alice")  # person2
```
3. Modify the pytorch train dataloader in this way. The test does not change because it is local.
```py
train_loader = sy.FederatedDataLoader( # this is now a FederatedDataLoader
    datasets.MNIST('/home/eragon/Documents/datasets', train=True, download=True,
            transform=transforms.Compose([
                       transforms.ToTensor(),
                       transforms.Normalize((0.1307,), (0.3081,))
                   
            ]))
    .federate((bob, alice)), # This will simulate a federated learning system
    shuffle=True, **kwargs )
```
4. Modify the main training loop like this
```py
def train(args, model, device, train_loader, optimizer, epoch):
    model.train()  # Setting model to train
    device = torch.device("cuda")  # Sending to GPU
    for batch_idx, (data, target) in tqdm(enumerate(train_loader)):
        model.send(data.location)  # Send to location (worker)
        data, target = data.to(device), target.to(device)
        optimizer.zero_grad()  # Reset grads
        output = model(data)  # Passing batch through model

        loss = F.nll_loss(output, target )

        loss.backward()  # Backprop
        optimizer.step()  # Pass through optimizer
        model.get()  # Get it back

        if batch_idx % args.log_interval == 0:
            loss = loss.get()
            if args.dry_run:
                break
```
5. The test loop remains the same
6. Train the model!!
7. Write a blog post about it and cry when nobody reads it

# Great, so where is it used?

It **could** be used in a lot of places but for now it is still in testing stage. Although there have been a few early adopters. Some of the ones I found are:
- Google Keyboard (Gboard) : They used it to update their predictions and learn words that were not in the initial dataset (like lmao).
- Digital health Companies [Paper](https://doi.org/10.1038/s41746-020-00323-1)  ; Huge promise here
- Military (Not sureof any use cases obviously but I did read that it was being used)
- Companies like OpenMined (who made the library), Nvidia, Google, Apple etc

# Use it!

This is an upcoming field and there are many things left to be done. Contribute to the libraries if you can, or just learn how things work and why they do. Want to read further? Look at the resources section. You will find many interesting links.

Thank you! Do reach out if you have any queries.

# Resources

- [OpenMined Blog](https://blog.openmined.org/upgrade-to-federated-learning-in-10-lines/)
- [Nvidia](https://blogs.nvidia.com/blog/2019/10/13/what-is-federated-learning/)
- [Unite.ai](https://www.unite.ai/what-is-federated-learning/)
- [Google blog](https://ai.googleblog.com/2017/04/federated-learning-collaborative.html)
- [Wiki](https://en.wikipedia.org/wiki/Federated_learning)
- Digital health : Rieke, N., Hancox, J., Li, W. et al. The future of digital health with federated learning. npj Digit. Med. 3, 119 (2020). https://doi.org/10.1038/s41746-020-00323-1
- Gboard : Chen, M., Mathews, R., Ouyang, T., & Beaufays, F. (2019). Federated learning of out-of-vocabulary words. arXiv preprint arXiv:1903.10635. [Paper](https://arxiv.org/pdf/1903.10635.pdf)
- Chen, M., Mathews, R., Ouyang, T., & Beaufays, F. (2019). Federated learning of out-of-vocabulary words. arXiv preprint arXiv:1903.10635.



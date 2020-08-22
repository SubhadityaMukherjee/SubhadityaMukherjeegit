---
layout: post
title:  Action recognition part 1
date:   2020-07-06 20:34:52 +0400
category: article
tags: video recognition tutorial pytorch data format linear max pool 3d conv drop
---

I try to reimplement Video recognition from [Link](https://github.com/jfzhang95/pytorch-video-recognition) and explain the code as I go along.

> This will be rather long so I will split it into parts. Since it has a lot of parts and I want to make sense of each, I will try to explain everything as I go along

Lets go!!!!

## Get data and fix it to required format.

Let us use the UCF101 video dataset for this task. It has 101 categories of actions that were taken from youtube videos.
We first get our data from [here](http://www.thumos.info/download.html) since the main site of the dataset is down.

Since these are just files, we need to put them in the required format of folders and the videos inside them. How do we do that? Well for starters we make a list of all the videos. Then we extract the names from them and pop them into a unique set. 
Now we have 101 names and we make a folder for each.

Once that is done, we use shutil to move each video to its respective folder just by virtue of its name. Done :)

``` python
import os
import shutil
from tqdm import tqdm

dirs = os.listdir("/home/subhaditya/Desktop/Datasets/UCF101/")
dirs = [x for x in dirs if ".avi" in x]
print(dirs[1])

def get_dir(x):
    return x.split("_")[1]

unique_dirs = list(set([get_dir(x) for x in dirs]))

print(len(unique_dirs))
# [os.makedirs(x) for x in unique_dirs]
for a in tqdm(dirs):
    shutil.move(f"/home/subhaditya/Desktop/Datasets/UCF101/{a}",f"/home/subhaditya/Desktop/Datasets/UCF101/{get_dir(a)}/")
```

tqdm is fancy progress bars
os allows us to interact with the system
and shutil makes file operations like copy/move easier

We will get back to these videos later

## Defining the network

The model is obviously the most important thing here, so let us first define the network.
The classes are actually just pytorch syntax so we just follow it.

Let us first define what we need,
Conv3d - Wait what. 3d? I have only used 2d so far. What is 3d now? 
Wow okay this is the 3d cross correlation operation. It applies the convolution when there are several input planes.
It is used with 3D image data such as MRI, CT scans and event detection. 
So apparently they are not just limited to 3d space but also work with 2d space but I am not sure how well they will perform.

MaxPool -> we have talked about this before. It basically takes the max of slices of input data and pools together all of them in the form of a single 3d matrix.

Relu -> Non linearity which we introduce so the neural network can learn more complex functions.

Linear -> Basic Dense layer which we talked about

Last Linear layer -> SInce we have 101 classes, and we want a softmax at the end somewhere, we use num_classes as the final no of channels

Dropout -> We havent talked about this but simply put, it randomly drops a percentage of the connections in every layer. This helps prevent overfitting and helps the network generalize more.

> See how the network grows from smaller to larger? That helps a lot when choosing model architectures. Sometimes they even go back up to smaller heights. 

``` python
import torch
from torch import mode
import torch.nn as nn
from mypath import Path

class C3D(nn.Module):
    def __init__(self, num_classes, pretrained=False):
        super(C3D, self).__init__()

        self.conv1 = nn.Conv3d(3, 64, kernel_size=(3, 3, 3), padding=(1, 1, 1))
        self.pool1 = nn.MaxPool3d(kernel_size=(1, 2, 2), stride=(1, 2, 2))

        self.conv2 = nn.Conv3d(
            64, 128, kernel_size=(3, 3, 3), padding=(1, 1, 1))
        self.pool2 = nn.MaxPool3d(kernel_size=(2, 2, 2), stride=(2, 2, 2))

        self.conv3a = nn.Conv3d(
            128, 256, kernel_size=(3, 3, 3), padding=(1, 1, 1))
        self.conv3b = nn.Conv3d(
            256, 256, kernel_size=(3, 3, 3), padding=(1, 1, 1))
        self.pool3 = nn.MaxPool3d(kernel_size=(2, 2, 2), stride=(2, 2, 2))

        self.conv4a = nn.Conv3d(
            256, 512, kernel_size=(3, 3, 3), padding=(1, 1, 1))
        self.conv4b = nn.Conv3d(
            512, 512, kernel_size=(3, 3, 3), padding=(1, 1, 1))
        self.pool4 = nn.MaxPool3d(kernel_size=(2, 2, 2), stride=(2, 2, 2))

        self.conv5a = nn.Conv3d(
            512, 512, kernel_size=(3, 3, 3), padding=(1, 1, 1))
        self.conv5b = nn.Conv3d(
            512, 512, kernel_size=(3, 3, 3), padding=(1, 1, 1))
        self.pool5 = nn.MaxPool3d(kernel_size=(
            2, 2, 2), stride=(2, 2, 2), padding=(0, 1, 1))

        self.fc6 = nn.Linear(8192, 4096)
        self.fc7 = nn.Linear(4096, 4096)
        self.fc8 = nn.Linear(4096, num_classes)

        self.dropout = nn.Dropout(p=0.5)

        self.relu = nn.ReLU()

        self.__init_weight()

        if pretrained:
            self.__load_pretrained_weights()

```

## Initialization

All you need is a good init! [Link](https://arxiv.org/abs/1511.06422) I mean not really but you still need a good one.
We are using kaiming init which we also discussed before. Notice that we using it only for the conv3d layers. for batchnorm3d (which we do not have here but might have later), we just fill it with 1s and make the bias 0.

``` python
    def __init_weight(self):
        for m in self.modules():
            if isinstance(m, nn.Conv3d):
                torch.nn.init.kaiming_normal_(m.weight)
            elif isinstance(m, nn.BatchNorm3d):
                m.weight.data.fill_(1)
                m.bias.data.zero_()
```

We now make generators to yield our data as and when we need it. In this case we get parameters for the convs and the final classification layer.
Also note that we enable gradient computing here. 

``` python
def get_1x_lr_params(model):
    b = [model.conv1, model.conv2, model.conv3a,model.conv3b, model.conv4a,model.conv4b,model.conv5a, model.conv5b, model.fc6, model.fc7]

    for i in range(len(b)):
        for k in b[i].parameters():
            if k.requires_grad:
                yield k

def get_10x_lr_params(model):
    b = [model.fc8]

    for j in range(len(b)):
        for k in b[j].parameters():
            if k.requires_grad:
                yield k
```

Now for the final part today, something to check if the module works or not.

``` python

if __name__ == "main__":
    inputs = torch.rand(1, 3, 16, 112, 112)
    net = C3D(num_classes = 101, pretrained = True)

    outputs = net.forward(inputs)
    print(outputs.size())   
```

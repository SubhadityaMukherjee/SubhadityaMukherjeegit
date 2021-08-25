---
layout: post
title: readingPapers
categories: article
date: 2021-08-23
tags: howto,read,papers,tutorial
summary: how to read a deep learning paper easily
---
[title]

I borked the formatting on this document. So please look at [the medium article](https://msubhaditya.medium.com/quick-requirements-generation-for-python-fe6dadbfb6ef)

Photo by Kelly Sikkema on Unsplash
Yay! you just made an awesome project. Now you want to let the whole world use it! But wait, what about the requirements? You of course want to make sure that your dear users don’t have to manually go hunting for each dependency right?
This is a tiny tutorial on how to do this easily and some tricks along the way.

What we want
A text file with the packages listed with their version numbers so all dependencies can be easily installed
A way to update if anything changes
An example :
jupytext==1.6.0
graphviz==0.14.2
Installing from a requirements.txt
Just navigate to where the file is stored
pip install -r requirements.txt
The simplest method
You can use this almost every time. It takes a few seconds and works very well.

Open your favorite terminal
Get the package pipreqs (pip install pipreqs)
Identify the path to your project directory (‘pwd’ for linux/mac or ‘cd’ for windows)

pip install pipreqs
pwd
pipreqs "<path>"

Complete environment
Sometimes you want to list every package in your environment. This is extremely easy.

If you are unsure of the lines below just run the first one

pip freeze > requirements.txt #for pip
conda list --export #for conda 

This works for windows/linux/mac etc.
Note that you might need to change pip to pip3 depending on your installation.
Bonus tips? Here you go :)



Photo by Sam Dan Truong on Unsplash
Auto update
This is a bit of a trick. If you want to run a few commands while pushing the file to Github, why not just put them into a simple shell script. Next time you want you do not even have to bother about rewriting the commands.

Make a file called pusher.sh (for linux/mac)
Add whatever you want to run. For example
“chmod +x pusher.sh” (to give permission to execute)
“./pusher.sh” every time you want to push to Github
Go overboard
Okay now if you want to package your code in a way that anyone can directly use it without going to the hassle of doing what you have. This might happen if you have a long list of things you had to do to set up your system so you could run your program.
In this case, simply using a requirements file would possibly not be enough.

Look into Docker, Kubernetes etc for this. I would explain more but that is out of the scope of this tiny article.

That concludes my small guide on pipreqs. Hope it helped :)

If you find this useful, we share the same interests. You might want to follow me!
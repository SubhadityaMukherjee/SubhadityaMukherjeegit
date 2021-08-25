---
layout: post
title: Easy Python reqs
categories: article
date: 2021-08-23
tags: python,tricks,requirements,easy
summary: quickly generate python requirements
---
[title]

Yay you just made an awesome project. Now you want to let the whole world use it! But wait, what about the requirements? You of course want to make sure that your dear users don't have to manually go hunting for each dependency right? 
This is a tiny tutorial on how to do this easily and some tricks along the way. 

Note : This is focused on Python. 

# The required result

- A text file with the packages listed with their version numbers so all dependencies can be easily installed
- A way to update if anything changes
- An example :
        jupytext==1.6.0
        graphviz==0.14.2

# Installing from a requirements.txt
- Just navigate to where the file is stored
- pip install -r requirements.txt

# The simplest method

You can use this almost every time. It takes a few seconds and works very well.
- Open your favorite terminal 
- Get the package pipreqs (pip install pipreqs)
- Identify the path to your project directory ('pwd' for linux/mac or 'cd' for windows)
- Run 'pipreqs <path>'

# Complete environment

Sometimes you want to list every package in your environment. This is extremely easy.
- 'pip freeze > requirements.txt' for pip or 'conda list --export' . (If you are unsure just try the first option)
- This works for windows/linux/mac etc

# Tips
## Auto update

This is a bit of a trick. If you want to run a few commands while pushing the file to Github, why not just put them into a simple shell script. Next time you want you do not even have to bother about rewriting the commands.

- Make a file called pusher.sh (for linux/mac)
- Add whatever you want to run. For example
'''
# format for python and sort the imports
black "." && isort .
# generate readme
pipreqs .
# Newline
echo "
" >> README.md
# Find all subdirectories but keep the depth to 2 | Add a - to keep the markdown syntax  
fd . --type d --maxdepth 2 | sed "s/^/- /" >> README.md
# create scripts if there are any notebook files
for i in $(fd --glob "*.ipynb"); do jupytext --to py $i; done
if [ ! -z $1 ]; then
        git add . && git commit -m $1 && git push
fi
'''

## Go overboard
Okay now if you want to package your code in a way that anyone can directly use it without going to the hassle of doing what you have. This might happen if you have a long list of things you had to do to set up your system so you could run your program. 
In this case, simply using a requirements file would possibly not be enough. 

Look into Docker, Kubernetes etc for this. I would explain more but that is out of the scope of this tiny article.


That concludes my small guide on pipreqs. Hope it helped :)


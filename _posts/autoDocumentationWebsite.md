---
layout: post2
title: Automatic Documentation Website Generator ;others
categories: article
date: 2021-06-06
tags: website,documentation,automation,python,pandoc
summary: Write a library with comments -> Get auto generated github pages website for documentation
---
[title]

Ever made a library, added documentation and then thought "ugh I need to make this into a website. Why is it so much work?". Here is the solution to your problems. Actually making a library not included. (oops)

Note that this only works for python so far. I have tested it on Linux. Which means it should work on Linux/mac/WSL with no issues. Windows.. you might need to change the shell commands.

# Examples
- [Site1](https://subhadityamukherjee.github.io/airJugaad/)
- [Site2](https://subhadityamukherjee.github.io/selket/)

# Prerequisites
- You are using Github. Since we are using Github pages, you need to store your repository on Github. (Of course you could do it some other way but that is too much work and we are lazy.)
        - If you are not sure how to go about doing that, I suggest you have a look at [this article](https://product.hubspot.com/blog/git-and-github-tutorial-for-beginners)
- Your code-base is in Python.
- You are using Linux/Mac/WSL

# Here are the steps:
- Install pandoc (pip install pandoc)
- Since you made a library, the folder structure should be similar to this
        - libraryname
                - __init__.py
                - module1.py
                - module2.py and so on
- Now in each of the files, add documentation to your functions/classes. Just go to the first line after the function/class definition and add a multiline comment with whatever you wish to say.
- Go to the parent directory and run
```sh
pdoc --force --html -o docs libraryname
```
This should generate the required files.
- Now for the hacky part of it. (It works trust me)
```sh
mv docs/libraryname/index.html docs/index.md
mv docs/libraryname/* docs/
```
- Now go to your github repository
- Click settings and open the "Pages" pane (to the left)
- Click source -> master for branch and select /docs in the folder option. (These were auto generated)
- Click change theme and choose a theme you like. (This is important!! Do not skip it)
- Then hit publish! And you are done :)
- You will get a link to your own website. 
- Sit and admire how beautiful it looks and cry you didn't know how to do this before

# Some tips
- You can always customize your page using Jekyll. 
- If you want documentation for an entire module, add a comment right after the imports/ at the start of the file
- You can even change the domain to be on your custom one (if you own any)
- Make a shell script!! We are lazy. Why bother doing the same things a billion times.
        - Create a file called pusher.sh (Or anything you want)
```sh
chmod +x pusher.sh
```

- In the file just pop the above commands. If you want add code formatting with black/isort as well. I have also added a little shell command which lets me push to github easily

```sh
pdoc --force --html -o docs libraryname
mv docs/libraryname/index.html docs/index.md
mv docs/libraryname/* docs/
```

---
layout: default
---
# Posts in order
- RSS feed link : [Click](https://subhadityamukherjee.github.io/feed.xml)
- For anything you want to see the notebooks of. Please refer to the repository. Everything will be there. Link on the left. 

<ul>
  {% for post in site.posts %}
    <li>
      <h2><a href="{{ post.url }}">{{post.date | date: "%-d %B %Y" }} - {{ post.title }}</a></h2>
	{{ post.excerpt }}
    </li>
  {% endfor %}
</ul>

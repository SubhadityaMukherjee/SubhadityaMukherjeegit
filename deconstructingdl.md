---
layout: default
---
# Posts in order
- RSS feed link : [Click](https://subhadityamukherjee.github.io/feed.xml)
<ul>
  {% for post in site.posts %}
    <li>
      <h2><a href="{{ post.url }}">{{post.date | date: "%-d %B %Y" }} - {{ post.title }}</a></h2>
	{{ post.excerpt }}
    </li>
  {% endfor %}
</ul>

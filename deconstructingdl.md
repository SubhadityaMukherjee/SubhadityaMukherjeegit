---
layout: default
---

<ul>
<h2> Articles</h2>
  {% for post in site.posts %}
    <li>
      <h3><a href="{{ post.url }}">{{post.date | date: '%-d %B %Y' }} - {{ post.title }}</a></h3>
	{{ post.excerpt }}
    </li>
  {% endfor %}
</ul>

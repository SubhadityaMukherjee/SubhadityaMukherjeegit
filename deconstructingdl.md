---
layout: default
categories: post
---

<ul>
<h2> Articles</h2>

  {% for post in site.posts %}
    <li>
	{% if post.categories[0] == "book" %}
	    <h3><a href="{{ post.url }}">&#128214;: {{ post.date | date: '%-d %B %Y' }} - {{ post.title }}</a></h3>
	{{ post.excerpt }}
	{% elsif post.categories[0] == "article" %}
	    <h3><a href="{{ post.url }}">&#9883;: {{ post.date | date: '%-d %B %Y' }} - {{ post.title }}</a></h3>
	{{ post.excerpt }}
	{% else %}
	<h3><a href="{{ post.url }}">&#9998;: {{ post.date | date: '%-d %B %Y' }} - {{ post.title }}</a></h3>
	{{ post.excerpt }}
	{% endif %}


    </li>
  {% endfor %}
</ul>



---
layout: default
categories: post
---

<ul >
<h2> Articles  </h2>
<!-- {{ site.posts.first.title }} -->

  {% for post in site.posts %}


    <li id ="bul">
  
	{% if post.categories[0] == "book" %}
	    <h3><a href="{{ post.url }}">&#128214; {{ post.date | date: '%-d %b %y' }} : {{ post.title | capitalize}}</a></h3>
	{{ post.excerpt }}
	{% elsif post.categories[0] == "article" %}
	    <h3><a href="{{ post.url }}">&#9883; {{ post.date | date: '%-d %b %y' }} : {{ post.title | capitalize}}</a></h3>
	{{ post.excerpt }}
	
	{% elsif post.categories[0] == "space" %}
	    <h3><a href="{{ post.url }}">&#128640; {{ post.date | date: '%-d %b %y' }} : {{ post.title | capitalize}}</a></h3>
	{{ post.excerpt }}
	{% else %}
	<h3><a href="{{ post.url }}">&#9998; {{ post.date | date: '%-d %b %y' }} : {{ post.title | capitalize}}</a></h3>
	{{ post.excerpt }}
	{% endif %}


    </li>
  {% endfor %}
</ul>



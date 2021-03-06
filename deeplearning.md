---
layout: default
categories: post
---

{% for tag in site.categories  %}
  {% assign t = tag | first %}
  {% assign posts = tag | last %}

<a href = "#top">Go Up</a>
<h2 id={{ t|upcase }}> {{ t | upcase }} </h2>

<ul>
{% for post in posts %}
  {% if post.categories contains t %}
  <li>
  {% if post.categories[0] == "paper" %}
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
  {% endif %}
{% endfor %}
</ul>
{% endfor %}

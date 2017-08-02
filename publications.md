---
title: Publications
layout: page
permalink: /publications/index.html
---
<style>
img { width: 80%; margin: 0 auto; display: block; }
#bibbase .nav {
    position: inherit;
}
#bibbase img {
    display: inherit;
    width: auto !important;
}
#bibbase .author {
    padding: 0;
    margin: 0;
}
</style>

![Publications Page Banner]({{ site.url }}/{{ site.publications_page_banner }})

<center><h1>{{ page.title }}</h1></center>

<center>
    <iframe width="410" height="210" seamless frameborder="0" scrolling="no"
            src="{{ site.citations_chart }}"></iframe>
</center>

<script src="https://bibbase.org/service/mendeley/{{ site.mendeley_token }}?jsonp=1"></script>

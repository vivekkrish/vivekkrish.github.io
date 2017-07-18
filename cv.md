---
title: Curriculum Vitae
layout: page
---
<style>
img { width: 80%; margin: 0 auto; display: block; }
.embed-responsive {
    position: relative;
    display: block;
    height: 0;
    padding: 0;
    overflow: hidden;
}
.embed-responsive-item {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    border: 0;
}
</style>

![Profile Image]({{ site.url }}/{{ site.cv_page_banner }})

<center><h1>{{ page.title }}</h1></center>

<nav class="nav" style="position: relative; text-align: right;">
    <ul class="list">
        <li class="item">
            <svg style="position: relative; top: 10px" class="icon icon-download">
                <use xlink:href="#icon-download"></use>
            </svg>&nbsp;<a href="{{ site.cv_download_url }}" title="Download CV in PDF format">PDF</a>
        </li>
    </ul>
</nav>

<div id="cv-embed" class="embed-responsive" style="padding-bottom: 100%; border: 1px silver solid;">
    <iframe class="embed-responsive-item" src="{{ site.cv_embed_url }}"></iframe>
</div>

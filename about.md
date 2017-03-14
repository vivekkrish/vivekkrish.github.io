---
title: About
layout: page
---
<style>
img { width: 60%; margin: 0 auto; display: block; }
.alert {
    margin-bottom: 10px;
    color: #3c763d;
    background-color: #dff0d8;
    padding: 20px;
    border-color: #d6e9c6;
    display: none;
}
</style>

![Profile Image]({{ site.url }}/{{ site.about_header }})

<p>Hello. My name is Vivek Krishnakumar. I live in Rockville, MD. I am a
Bioinformatics Engineer at the J. Craig Venter Institute with experience in
genome assembly curation, genome structural and functional annotation as well
as developing and maintaining genome data portals for the plant genomics
research community.</p>

<p>Currently, I am working on <a href="https://www.araport.org">Araport</a>,
an NSF-funded open-access community resource for Arabidopsis research,
where I am part of the data integration and annotation team. I work as an
analyst on the <i>Arabidopsis thaliana</i> genome annotation pipeline, aimed
towards generating and maintaining a gold-standard reference annotation set.
I also work on the data integration aspects of Araport, involving data
warehousing and federation via Web Services.</p>

<h2>Projects</h2>

<ul>
	<li><a href="https://www.araport.org/">Arabidopsis Information Portal</a></li>
	<li><a href="http://www.medicagogenome.org/"><i>Medicago truncatula</i> Genome Database (MTGD)</a></li>
	<li><a href="http://www.legumefederation.org/">Legume Federation</a></li>
</ul>

<h2>Skills</h2>

<ul class="skill-list">
	<li>Python</li>
	<li>Perl</li>
	<li>Java</li>
	<li>HTML - CSS - JavaScript</li>
	<li>PostgreSQL - MySQL</li>
	<li>Git</li>
</ul>

<h2>Contact</h2>

+ [Email](mailto:{{ site.email }})
+ Contact form:
<div class="alert" id="alert-box">
	Your message was sent! I’ll get back to you soon. Thanks!
</div>
<form accept-charset="UTF-8" action="http://pooleapp.com/stash/d73cf94b-8769-4867-af89-ff0c012f48fb/" id="contact-format" method="POST">
	<input type="hidden" name="utf8" value="x">
	<input type="hidden" name="redirect_to" value="{{ site.url }}/about?form=ok#alert-box">
	<label for="name">Name</label> <input type="text" name="name" id="name"><br /><br />
	<label for="email">Email</label> <input type="email" name="email" id="email"><br /><br />
	<label for="msg">Message</label> <textarea name="msg" id="msg" cols="30" rows="10"></textarea>
	<br /><br />
	<input type="submit" value="submit" />
</form>

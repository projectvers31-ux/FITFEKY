import os
import re

files = ['index.html', 'about.html', 'classes.html', 'blog.html', 'contact.html', 'thank-you.html']

nav_old = '''						<li class="dropdown">
							<a href="#">Pages<i class="fa-solid fa-chevron-down"></i></a>
							<ul class="sub-menu">
								<li><a href="class-schedule.html">Class Schedule</a></li>
								<li><a href="gallery.html">Gallery</a></li>
								<li><a href="our-pricing.html">Our Pricing</a></li>
								<li><a href="trainers.html">Trainers</a></li>
								<li><a href="blog-details.html">Blog Details</a></li>
								<li><a href="class-details.html">Class Details</a></li>
							</ul>
						</li>'''
mob_nav_old = '''					<li class="mobail-dropdown">
						<a href="#">Pages<i class="fa-solid fa-chevron-down"></i></a>
						<ul class="mobail-submenu">
							<li><a href="class-schedule.html">Class Schedule</a></li>
							<li><a href="gallery.html">Gallery</a></li>
							<li><a href="our-pricing.html">Our Pricing</a></li>
							<li><a href="trainers.html">Trainers</a></li>
							<li><a href="blog-details.html">Blog Details</a></li>
							<li><a href="class-details.html">Class Details</a></li>
						</ul>
					</li>'''

gtag = '''	<!-- Global site tag (gtag.js) - Google Analytics -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
	<script>
	  window.dataLayer = window.dataLayer || [];
	  function gtag(){dataLayer.push(arguments);}
	  gtag('js', new Date());

	  gtag('config', 'G-XXXXXXXXXX');
	</script>
</head>'''

addons = '''	<!-- Scroll Reveal Script -->
	<script>
		document.addEventListener("DOMContentLoaded", function() {
			const observer = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						entry.target.classList.add('active');
					}
				});
			});
			document.querySelectorAll('section').forEach((section) => {
				section.classList.add('reveal');
				observer.observe(section);
			});
		});
	</script>

	<!-- WhatsApp Button -->
	<a href="https://wa.me/15551234567" target="_blank" title="Chat with us" style="position:fixed; bottom:20px; right:20px; background:#25D366; color:#fff; width:60px; height:60px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:35px; box-shadow: 2px 2px 10px rgba(0,0,0,0.2); z-index:9999;">
		<i class="fa-brands fa-whatsapp"></i>
	</a>
</body>'''

for f in files:
    if not os.path.exists(f): continue
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    content = content.replace(nav_old, '')
    content = content.replace(mob_nav_old, '')
    
    content = content.replace('info@example.com', 'hello@fitcore.com')
    content = content.replace('fitcoredemo@example.com', 'hello@fitcore.com')
    content = content.replace('6391 Elgin St. Celina, 10299', '123 Fitness Ave, NY, USA')
    content = content.replace('6391 Elgin St. Celina, Delaware 10299', '123 Fitness Ave, NY, USA')
    content = content.replace('293 Harrison St, San Francisco, CA 94103, United States', '123 Fitness Ave, NY, USA')
    content = content.replace('(629) 555-0129', '+1 (555) 123-4567')
    content = content.replace('(209) 555-0104', '+1 (555) 123-4567')
    content = content.replace('+ (567) 1234-567-8901', '+1 (555) 123-4567')
    content = content.replace('56712345678901', '15551234567')
    content = content.replace('tel:6295550129', 'tel:15551234567')
    
    content = content.replace('Gymix Gym', 'FitCore')
    content = content.replace('>Gymix<', '>FitCore<')
    content = content.replace('FitFeky', 'FitCore')
    
    if 'G-XXXXXXXXXX' not in content:
        content = content.replace('</head>', gtag)
        
    if 'wa.me/15551234567' not in content:
        content = content.replace('</body>', addons)
        
    if f == 'about.html':
        content = content.replace('<section class="about-section">', '<section class="about-section" id="about-section">')
        
    if f == 'classes.html':
        def repl(m):
            title = m.group(1)
            desc = m.group(2)
            if 'Start Free Quiz' in m.group(0) or 'Start Quiz' in m.group(0):
                return m.group(0) # Already replaced maybe

            goal = "fitness"
            tl = title.lower()
            if "yoga" in tl: goal = "yoga"
            elif "hiit" in tl or "pilates" in tl: goal = "fitness"
            elif "spin" in tl: goal = "muscle"
            elif "crossfit" in tl or "strength" in tl: goal = "muscle"
            
            return f'<h4 class="heading">{title}</h4>\\n\\t\\t\\t\\t\\t\\t<p>{desc}</p>\\n\\t\\t\\t\\t\\t\\t<a href="index.html#quiz-section" onclick="localStorage.setItem(\'fitcore_target_goal\', \'{goal}\');">Start Quiz<i class="fa-solid fa-arrow-right"></i></a>'
        
        content = re.sub(r'<h4 class="heading">(.*?)</h4>\n\s*<p>(.*?)</p>\n\s*<a href="#">Read More<i class="fa-solid fa-arrow-right"></i></a>', repl, content)

    if f == 'contact.html':
        content = content.replace('<form method="post" action="contact-handler.php">', '<form method="post" action="#" onsubmit="event.preventDefault(); alert(\'Message Sent Successfully!\');">')
        content = content.replace('<form method="post" action="mailer.php">', '<form method="post" action="#" onsubmit="event.preventDefault(); alert(\'Message Sent Successfully!\');">')

    if f == 'blog.html':
        content = content.replace('<a href="#">Read More', '<a href="#" onclick="event.preventDefault(); alert(\'Full post coming soon!\');">Read More')
        
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Bulk changes completed.")

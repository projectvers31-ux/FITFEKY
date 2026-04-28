import os, re

files = ['about.html', 'classes.html', 'blog.html', 'contact.html']

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
nav_new = ''

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
mob_nav_new = ''

for f in files:
    if not os.path.exists(f): continue
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    content = content.replace(nav_old, nav_new)
    content = content.replace(mob_nav_old, mob_nav_new)
    
    content = content.replace('info@example.com', 'hello@fitcore.com')
    content = content.replace('(629) 555-0129', '+1 (555) 123-4567')
    content = content.replace('(209) 555-0104', '+1 (555) 123-4567')
    content = content.replace('fitcoredemo@example.com', 'hello@fitcore.com')
    content = content.replace('6391 Elgin St. Celina, 10299', '123 Fitness Ave, NY, USA')
    content = content.replace('6391 Elgin St. Celina, Delaware 10299', '123 Fitness Ave, NY, USA')
    content = content.replace('293 Harrison St, San Francisco, CA 94103, United States', '123 Fitness Ave, NY, USA')
    content = content.replace('56712345678901', '15551234567')
    content = content.replace('+ (567) 1234-567-8901', '+1 (555) 123-4567')

    content = content.replace('Gymix Gym', 'FitCore')
    content = content.replace('>Gymix<', '>FitCore<')

    content = content.replace('<a href="#" class="btn">Join Now<i class="fa-solid fa-angles-right"></i></a>', '<a href="index.html#quiz-section" class="btn">Start Free Quiz &rarr;</a>')
    content = content.replace('<a href="#" class="btn">Get A Quote<i class="fa-solid fa-arrow-right"></i></a>', '<a href="index.html#quiz-section" class="btn">Start Free Quiz &rarr;</a>')

    if f == 'about.html':
        content = content.replace('<section class="about-section">', '<section class="about-section" id="about-section">')

    if f == 'contact.html':
        content = content.replace('<form method="post" action="contact-handler.php">', '<form method="post" action="#" onsubmit="event.preventDefault(); alert(\'Message Sent Successfully!\');">')
        content = content.replace('<form method="post" action="mailer.php">', '<form method="post" action="#" onsubmit="event.preventDefault(); alert(\'Message Sent Successfully!\');">')

    if f == 'blog.html':
        content = content.replace('<a href="#">Read More', '<a href="#" onclick="event.preventDefault(); alert(\'Full post coming soon!\');">Read More')
        
    if f == 'classes.html':
        def replacer(match):
            name = match.group(1).lower()
            goal = 'fitness'
            if 'yoga' in name: goal = 'yoga'
            elif 'spin' in name or 'strength' in name or 'crossfit' in name: goal = 'muscle'
            return f'<h4 class="heading">{match.group(1)}</h4>\n\t\t\t\t\t\t<p>{match.group(2)}</p>\n\t\t\t\t\t\t<a href="index.html#quiz-section" onclick="localStorage.setItem(\'fitcore_target_goal\', \'{goal}\');">Start Quiz'
        
        content = re.sub(r'<h4 class="heading">(.*?)</h4>\n\s*<p>(.*?)</p>\n\s*<a href="#">Read More', replacer, content)

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

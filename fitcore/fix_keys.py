import os
file = 'index.html'

with open(file, 'r', encoding='utf-8') as f:
    text = f.read()

# Fix Step 2
text = text.replace("nextStep(2, 'lose_weight')", "nextStep(2, 'lose_weight', 'goal')")
text = text.replace("nextStep(2, 'build_muscle')", "nextStep(2, 'build_muscle', 'goal')")
text = text.replace("nextStep(2, 'yoga')", "nextStep(2, 'yoga', 'goal')")
text = text.replace("nextStep(2, 'fitness')", "nextStep(2, 'fitness', 'goal')")

# Fix Step 3
text = text.replace("nextStep(3, 'under_30')", "nextStep(3, 'under_30', 'time')")
text = text.replace("nextStep(3, '30_to_60')", "nextStep(3, '30_to_60', 'time')")
text = text.replace("nextStep(3, 'over_60')", "nextStep(3, 'over_60', 'time')")

# Fix Step 4
text = text.replace("nextStep(4, 'beginner')", "nextStep(4, 'beginner', 'level')")
text = text.replace("nextStep(4, 'intermediate')", "nextStep(4, 'intermediate', 'level')")
text = text.replace("nextStep(4, 'advanced')", "nextStep(4, 'advanced', 'level')")

# Fix Step 5
text = text.replace("nextStep(5, 'no_time')", "nextStep(5, 'no_time', 'obstacle')")
text = text.replace("nextStep(5, 'no_motivation')", "nextStep(5, 'no_motivation', 'obstacle')")
text = text.replace("nextStep(5, 'lost')", "nextStep(5, 'lost', 'obstacle')")
text = text.replace("nextStep(5, 'no_gym')", "nextStep(5, 'no_gym', 'obstacle')")

# Fix Step 6
text = text.replace("nextStep(6, '4_weeks')", "nextStep(6, '4_weeks', 'timeline')")
text = text.replace("nextStep(6, '8_weeks')", "nextStep(6, '8_weeks', 'timeline')")
text = text.replace("nextStep(6, '3_months')", "nextStep(6, '3_months', 'timeline')")

with open(file, 'w', encoding='utf-8') as f:
    f.write(text)


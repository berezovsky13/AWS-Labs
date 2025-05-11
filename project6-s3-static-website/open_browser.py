import webbrowser
import os

# Get the absolute path to index.html
current_dir = os.path.dirname(os.path.abspath(__file__))
index_path = os.path.join(current_dir, 'index.html')

# Convert to file URL
file_url = 'file:///' + index_path.replace('\\', '/')

# Open in default browser
webbrowser.open(file_url) 
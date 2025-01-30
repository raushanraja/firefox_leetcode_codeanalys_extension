#!/bin/bash

# Define directories
LIBS_DIR="libs"
CSS_DIR="$LIBS_DIR/css"
JS_DIR="$LIBS_DIR/js"

# Define CSS files to download
CSS_URLS=(
	"https://cdn.jsdelivr.net/npm/picnic/picnic.min.css"
)
CSS_FILENAMES=(
	"picnic.min.css"
)

# Define JS files to download
JS_URLS=(
	"https://cdn.jsdelivr.net/npm/showdown@2.0.3/dist/showdown.min.js"
	"https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js"
)
JS_FILENAMES=(
	"showdown.min.js"
	"markdown-it.min.js"
)

# Create directories if they don't exist
if [ ! -d "$LIBS_DIR" ]; then
	mkdir "$LIBS_DIR"
	echo "Created directory: $LIBS_DIR"
fi

if [ ! -d "$CSS_DIR" ]; then
	mkdir "$CSS_DIR"
	echo "Created directory: $CSS_DIR"
fi

if [ ! -d "$JS_DIR" ]; then
	mkdir "$JS_DIR"
	echo "Created directory: $JS_DIR"
fi

# Download CSS files
echo "Downloading CSS files..."
for i in "${!CSS_URLS[@]}"; do
	url="${CSS_URLS[$i]}"
	filename="${CSS_FILENAMES[$i]}"
	filepath="$CSS_DIR/$filename"
	echo "Downloading: $url to $filepath"
	curl -s -o "$filepath" "$url"
	if [ $? -eq 0 ]; then
		echo "Successfully downloaded: $filepath"
	else
		echo "Failed to download: $filepath"
	fi
done

# Download JavaScript files
echo "Downloading JS files..."
for i in "${!JS_URLS[@]}"; do
	url="${JS_URLS[$i]}"
	filename="${JS_FILENAMES[$i]}"
	filepath="$JS_DIR/$filename"
	echo "Downloading: $url to $filepath"
	curl -s -o "$filepath" "$url"
	if [ $? -eq 0 ]; then
		echo "Successfully downloaded: $filepath"
	else
		echo "Failed to download: $filepath"
	fi
done
echo "Download complete."

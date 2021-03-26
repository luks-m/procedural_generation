all: gen

test:
	node tst/*.js

gen: clean
	mkdir -p public/scripts
	cp src/index.html public/index.html
	cp src/home.css public/home.css
	npx browserify src/browser.js -o public/scripts/all.js

exe:
	node src/main.js

clean:
	rm -rf public/*
	rm -f $$(find . -name \*~)
	rm -f *.png
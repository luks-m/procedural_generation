all: gen

test:
	npx jest --config="src/test/jest.config.js" src/test/filters.test.js

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
	rm -rf src/test/coverage

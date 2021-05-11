all: gen

test:
	@npx jest --config="src/test/jest.config.js" --coverage

gen: clean
	@mkdir -p public/scripts
	@cp src/index.html public/index.html
	@cp src/home.css public/home.css
	npx browserify src/browser.js -o public/scripts/all.js

exe:
	node src/main.js

clean:
	rm -f $$(find . -name "*~" -o  -name "*.png" -depth 1) 
	rm -rf $$(find . -type d -name "coverage" -depth 1)
	rm -rf public/*

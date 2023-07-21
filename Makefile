default: nothing

nothing:
	echo 'use "make run" to build react frontend and serve with backend'

run:
	mkdir -p functions/build/
	cd react-frontend/ && npm run build && cd ../
	cp -rp react-frontend/build/* public/.
	cp react-frontend/build/index.html functions/build/.
	firebase emulators:start

deploy:
	echo TODO
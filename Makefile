build:
	echo '#!/usr/bin/env node \n' >> .tmp
	cat ./lib/locally.js >> .tmp
	chmod 755 .tmp
	mv .tmp ./bin/_locally

.PHONY: build

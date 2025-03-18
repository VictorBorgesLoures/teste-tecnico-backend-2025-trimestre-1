.PRONY: build
build: 
	docker build --progress=plain -t ${name} .

.PRONY: run
run:
	docker run -p 3000:3000 ${name}
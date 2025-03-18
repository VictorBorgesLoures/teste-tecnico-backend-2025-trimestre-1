.PRONY: build
build: 
	docker build --progress=plain -t ${name} .

.PRONY: bake
bake:
	docker run -p 3000:3000 ${name}

.PRONY: compose
compose:
	docker compose -f 'docker-compose.yml' up
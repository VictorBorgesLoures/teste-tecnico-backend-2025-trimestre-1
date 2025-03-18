.PRONY: build
build: 
	docker build --progress=plain -t video-service .

.PRONY: run
run:
	docker run -p 3000:3000 video-service
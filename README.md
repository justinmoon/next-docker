# Instructions

Build:

```sh
docker build -t next_docker .
```

Run:

```sh
docker run -p 3000:3000 next_docker
```

Run and grab container ID:

```sh
ID=$(docker run -p 3000:3000 -it --rm --detach next_docker)
```

Stop:

```sh
docker stop $ID
```

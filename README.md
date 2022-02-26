# Run

After running `docker.js`, a `whoami` service will run for 10 seconds on [http://localhost:3008](http://localhost:3008).


```sh
npm i
node docker.js
```

# Notes to self

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

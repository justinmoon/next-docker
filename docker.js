const { dockerCommand } = require("docker-cli-js");
const simpleGit = require("simple-git");
const fs = require("fs").promises;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function clone(url) {
  const git = simpleGit();
  try {
    await git.clone(url);
  } catch (e) {
    console.log("clone failed");
    throw e;
  }
}

async function build(name) {
  try {
    const options = {};
    const data = await dockerCommand(`build -t ${name} ${name}`, options);
    console.log("build successful", data);
  } catch (e) {
    console.log("build failed");
    throw e;
  }
}

async function run(name) {
  try {
    const options = {};
    // TODO: how to figure out which ports are exposed?
    // TODO: can we simplify this command and still get the container ID?
    const data = await dockerCommand(
      `run -p 3008:80 -it --rm --detach ${name}`,
      options
    );
    console.log("run successful", data);
    return data.containerId;
  } catch (e) {
    console.log("run failed");
    throw e;
  }
}

async function stop(containerId) {
  try {
    const options = {};
    const data = await dockerCommand(`stop ${containerId}`, options);
    console.log("stop successful", data);
  } catch (e) {
    console.log("stop failed");
    throw e;
  }
}

async function removeImage(containerId) {
  try {
    const options = {};
    const data = await dockerCommand(`image rm ${containerId}`, options);
    console.log("docker image removed", data);
  } catch (e) {
    console.log("failed to remove docker image");
    throw e;
  }
}

async function removeRepo(imageName) {
  try {
    const data = await fs.rm(imageName, { recursive: true });
    console.log("git repo removed", data);
  } catch (e) {
    console.log("failed to remove git repo");
    throw e;
  }
}

async function install(url, imageName) {
  // Git clone
  await clone(url);

  // Build docker image
  // TODO: we should create a docker-compose file for each project for run / build,
  // so that restarts will work better ...
  await build(imageName);

  // Run docker image as container
  const containerId = await run(imageName);

  // Wait 10 seconds
  await delay(10000);

  // Stop docker image
  await stop(containerId);

  // Remove docker image
  await removeImage(imageName);

  // Remove git repo (FIXME: don't use imageName variable ...)
  // FIXME: this should run regardless of whether previous commands had errors ...
  await removeRepo(imageName);
}

install(
  "https://github.com/traefik/whoami",
  // TODO: infer from ^^
  "whoami"
);

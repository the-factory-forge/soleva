import { execFileSync } from "node:child_process";

function compose(...args) {
  return execFileSync("docker", ["compose", "--env-file", ".env.local", ...args], {
    encoding: "utf8",
    // Only the resolved URL belongs on stdout, which Varlock captures.
    stdio: ["ignore", "pipe", "inherit"],
  }).trim();
}

try {
  const { environment } = JSON.parse(compose("config", "--format", "json")).services.db;
  compose("up", "--detach", "--wait", "--wait-timeout", "60", "db");

  const url = new URL(`postgresql://${compose("port", "db", "5432")}`);
  url.username = environment.POSTGRES_USER;
  url.password = environment.POSTGRES_PASSWORD;
  url.pathname = `/${environment.POSTGRES_DB}`;
  process.stdout.write(url.href);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

import type { RunOptions, RunOutput } from "./types.ts";

/**
 *  Runs a command and returns the output of the stdout and stderr, as well as the exit code, success status and signal.
 *  You can also provide options to change the working directory, listen to stdout and stderr events, and set environment variables.
 */
export async function runCommand(
  /* The command that will be executed */
  command: string,
  /* The options that will be used to run the command */
  options?: RunOptions,
): Promise<RunOutput> {
  const cmd = new Deno.Command(command, {
    args: options?.args,
    stdout: "piped",
    stderr: "piped",
    cwd: options?.cwd,
    env: options?.env,
  });
  const decoder = new TextDecoder();
  let stdout = "";
  let stderr = "";
  const stdStream = new WritableStream<Uint8Array>({
    write(chunk) {
      const chunkStr = decoder.decode(chunk);
      stdout += chunkStr;
      if (options?.onStdout) {
        options.onStdout(chunkStr);
        return;
      }
      if (!options?.hideOutput) {
        console.log(chunkStr);
      }
    },
  });

  const errStream = new WritableStream<Uint8Array>({
    write(chunk) {
      const chunkStr = decoder.decode(chunk);
      stderr += chunkStr;
      if (options?.onStderr) {
        options.onStderr(chunkStr);
        return;
      }
      if (!options?.hideOutput) {
        console.log(chunkStr);
      }
    },
  });

  try {
    const process = cmd.spawn();
    process.stdout.pipeTo(stdStream);
    process.stderr.pipeTo(errStream);
    const status = await process.status;
    return { stdout, stderr, ...status };
  } catch (e) {
    stderr = e.message;
    if (e.code === "ENOENT" && options?.cwd) {
      stderr = `The directory ${options.cwd} does not exist`;
    }
    if (options?.onStderr) {
      options.onStderr(stderr);
    }
    if (!options?.hideOutput && !options?.onStderr) {
      console.log(stderr);
    }
    return { stdout, stderr, code: 1, success: false, signal: null };
  }
}

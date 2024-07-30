export interface RunOutput {
  /* The output of the stdout */
  stdout: string;
  /* The output of the stderr */
  stderr: string;
  /* The exit code of the process */
  code: number;
  /* The success status of the process */
  success: boolean;
  /* The signal of the process */
  signal: Deno.Signal | null;
}

export interface RunOptions {
  /* The arguments that will be passed to the command */
  args?: string[];
  /* The directory where the command will be executed */
  cwd?: string;
  /* The function that will be called when a chunk of stdout is received
    to allow you to process the output in real-time */
  onStdout?: (chunk: string) => void;
  /* The function that will be called when a chunk of stderr is received
    to allow you to process the output in real-time */
  onStderr?: (chunk: string) => void;
  /* The environment variables that will be passed to the command */
  env?: Record<string, string>;

  /* Set to false to prevent the default behavior of the output
    from stdout and stderr being printed to the console in real-time
  */
  hideOutput?: boolean;
}

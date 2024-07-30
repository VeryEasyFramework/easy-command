# Easy Command Runner

Run terminal commands with ease in your Deno project

## Installation

```shell
deno add @eveffer/easy-command
```

## API

```ts
function runCommand(
  /* The command that will be executed */
  command: string,
  /* The options that will be used to run the command */
  options?: RunOptions,
): Promise<RunOutput>;
```

### Options

```ts
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
```

### Output

```ts
interface RunOutput {
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
```

## Usage

> **Note:** These examples are available to run yourself. You can import and run
> them:
>
> ```ts
> import { examples } from "@eveffer/easy-command";
> await examples.simpleUseCase();
> await examples.withArgs();
> // etc.
> ```

### Simple Use Case

```ts
import { runCommand } from "@eveffer/easy-command";

await runCommand("ls");
```

Sample Output:

```
README.md
mod.ts
```

### With Arguments

```ts
import { runCommand } from "@eveffer/easy-command";

const { stdOut } = await runCommand("ls", {
  args: ["-a"],
});

console.log(stdOut);
```

Sample Output:

```
.
..
.vscode
README.md
mod.ts
```

### Specifying the Working Directory

```ts
import { runCommand } from "@eveffer/easy-command";

const { stdOut } = await runCommand("ls", {
  args: ["-a"],
  cwd: "/var/log",
});

console.log(stdOut);
```

### Real-time Output Processing

```ts
import { runCommand } from "@eveffer/easy-command";
import { colorMe } from "@eveffer/color-me";

await runCommand("git", {
  args: ["pull"],
  cwd: "/path/to/your/repo",
  onStdout: (chunk) => {
    colorMe.green(chunk);
  },
  onStderr: (chunk) => {
    colorMe.red(chunk);
  },
});
```

### With Environment Variables

```ts
import { runCommand } from "@eveffer/easy-command";

await runCommand("/bin/sh", {
  args: ["-c", " echo $SOME_VARIABLE"],
  env: {
    SOME_VARIABLE: "Hello, World!",
  },
});

// output: Hello, World!
```

### Check if the command was successful

```ts
import { runCommand } from "@eveffer/easy-command";

const { success } = await runCommand("ls");

if (success) {
  console.log("Command was successful");
} else {
  console.log("Command failed");
}
```

### Check the exit code of the command

```ts
import { runCommand } from "@eveffer/easy-command";

const { code } = await runCommand("ls");

switch (code) {
  case 0:
    console.log("Command was successful");
    break;
  case 1:
    console.log("Command failed");
    break;
  default:
    console.log("Command exited with code: ", code);
}
```

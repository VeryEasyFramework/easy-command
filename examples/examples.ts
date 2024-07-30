import { runCommand } from "../src/runCommand.ts";
import { colorMe } from "@eveffer/color-me";

function print(msg: string, functionName: string) {
  console.log();
  const exampleOutput = colorMe.bgBrightMagenta("Example: ", {
    bold: true,
  });
  const msgOutput = colorMe.brightCyan(msg, {
    italic: true,
  });
  const functionOutput = colorMe.brightYellow(functionName, {
    bold: true,
  });
  console.log(`${exampleOutput} ${functionOutput}`);
  console.log(msgOutput);
  console.log();
}

/**
 * This example demonstrates how to run a simple command.
 * In this case, we are running the `ls` command.
 */
async function simpleUseCase() {
  print("A simple use case", "simpleUseCase");
  await runCommand("ls");
}

/**
 * This example demonstrates how to run a command with arguments.
 * In this case, we are running the `ls` command with the `-a` flag.
 */
async function withArgs() {
  print("Running a command with arguments", "withArgs");

  await runCommand("ls", {
    args: ["-a"],
  });
}

/**
 * This example demonstrates how to run a command in a different directory.
 */
async function withCwd() {
  print("Running a command in a different directory", "withCwd");
  await runCommand("ls", {
    args: ["-a"],
    cwd: "/var/log",
  });
}

/**
 * This example demonstrates how to run a command with environment variables.
 */
async function withEnv() {
  print("Running a command with environment variables", "withEnv");
  await runCommand("/bin/sh", {
    args: ["-c", " echo $SOME_VARIABLE"],
    env: {
      SOME_VARIABLE: "Hello, World!",
    },
  });
}

/**
 * This example demonstrates how to run a command and process the output in real-time.
 */
async function withRealtimeOutputHandler() {
  print(
    "Running a command with a real-time output handler",
    "withRealtimeOutputHandler",
  );
  await runCommand("git", {
    args: ["pull"],
    cwd: "/path/to/your/repo",
    onStdout: (chunk) => {
      console.log(colorMe.brightGreen(chunk));
    },
    onStderr: (chunk) => {
      console.log(colorMe.brightRed(chunk));
    },
  });
}

/**
 * This example demonstrates how to run a command and check the success status.
 */
async function withSuccessStatus() {
  print(
    "Running a command and checking the success status",
    "withSuccessStatus",
  );

  console.log(colorMe.brightBlue("Running a command that should succeed:\n", {
    italic: true,
  }));

  const { success: success1 } = await runCommand("ls");

  if (success1) {
    console.log(colorMe.brightGreen("Command was successful"));
  } else {
    console.log(colorMe.brightRed("Command failed"));
  }

  console.log(colorMe.brightBlue("\nRunning a command that should fail\n", {
    italic: true,
  }));
  const { success: success2 } = await runCommand("ls", {
    cwd: "/non/existent/directory",
  });

  if (success2) {
    console.log(colorMe.brightGreen("Command was successful"));
  } else {
    console.log(colorMe.brightRed("Command failed"));
  }
}

/**
 * This example demonstrates how to run a command and check the exit code.
 */
async function withExitCodeCheck() {
  print("Running a command and checking the exit code", "withExitCodeCheck");
  const { code } = await runCommand("ls");

  switch (code) {
    case 0:
      console.log(colorMe.brightGreen("Command was successful"));
      break;
    case 1:
      console.log(colorMe.brightRed("Command failed"));
      break;
    default:
      console.log("Command exited with code: ", code);
  }
}

/**
 * The examples that can be run to demonstrate the functionality of the runCommand function.
 */
export const examples = {
  simpleUseCase,
  withArgs,
  withCwd,
  withEnv,
  withRealtimeOutputHandler,
  withSuccessStatus,
  withExitCodeCheck,
};

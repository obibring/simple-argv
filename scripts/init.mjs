#!/usr/bin/env zx
import * as fs from "fs"
import * as path from "path"

// @ts-check
const zxNotInstalledError = new Error(`zx not installed`)
const pltrZxNotInstalledError = new Error(`@pltr/zx not installed`)

async function findInstallersPackageJsonPath() {
  const hardcodedPath = (() => {
    const index = process.argv.findIndex((value) => {
      return value === "--file" || value === "-f" || value == "--packageJson"
    })
    if (index >= 0) {
      let filePath = process.argv[index + 1]
      if (typeof filePath === "string" && filePath.endsWith(".json")) {
        if (!filePath.startsWith("/")) {
          // Relative path
          filePath = path.resolve(process.cwd(), filePath)
        }
        if (fs.existsSync(filePath)) {
          return filePath
        }
      }
      throw new Error(
        `The hardcoded filepath you provided is invalid: "${filePath}".`,
      )
    }
  })()
  if (typeof hardcodedPath === "string") {
    return hardcodedPath
  }
  // Finds the first package.json that exists in a parent of our root directory.
  let currentDirectory = path.resolve(__dirname, "..")
  while (currentDirectory && currentDirectory !== "/") {
    const packageJsonPath = path.resolve(currentDirectory, "package.json")
    if (fs.existsSync(packageJsonPath)) {
      return packageJsonPath
    }
    currentDirectory = path.resolve(currentDirectory, "..")
  }
  throw new Error(`Setup script was unable to find your package.json file!`)
}

try {
  const { question } = await import("zx").catch(() => {
    throw zxNotInstalledError
  })
  const { log, maybe, confirm, choices, npm } = await import("@pltr/zx").catch(
    () => {
      throw pltrZxNotInstalledError
    },
  )
  /**
   * @param {string} message
   * @returns {Promise<string>}
   */
  async function ask_with_confirmation(message) {
    const answer = await question(message + `\n\n> `)
    const confirmed = await confirm(`You typed "${answer}". Continue?`)
    if (confirmed) {
      return answer
    } else {
      return ask_with_confirmation(message)
    }
  }
  /**
   * @returns {Promise<string>}
   */
  async function ask_for_main_filename() {
    const answer = await ask_with_confirmation(
      `Enter the name of the main file.`,
    )
    const extension = path.extname(answer)
    if (extension === "" || extension === ".") {
      log.warn(`The file "${answer}" is missing an extension. Try again.`)
      return ask_for_main_filename()
    }
    return answer
  }
  /**
   * @returns {Promise<string>}
   */
  async function getPackageName() {
    return ask_with_confirmation(`What package name would you like to use?`)
  }
  const packageName = await getPackageName()
  let packageNamespace = (() => {
    if (packageName.includes("/")) {
      const [namespace] = packageName.split("/")
      return namespace
    }
    return null
  })()
  const mainFileBasename = await (async () => {
    const defaultName = (() => {
      // Use the packageName unless it's namespaced like `@pltr/x` in which
      // case we drop the namespace
      if (packageName.includes("/")) {
        const [_namespace, name] = packageName.split("/")
        if (name === "") {
          throw new Error(`Invalid package name ${packageName}.`)
        }
        return name
      }
      return packageName
    })()
    const answer = await choices(
      `What's the name of the main file you want to use?`,
      [`${defaultName}.ts`, `Other`],
    )
    if (answer === "Other") {
      return await ask_for_main_filename()
    }
    return `${defaultName}.ts`
  })()
  const packageJsonPath = await findInstallersPackageJsonPath()

  const ownPackagePath = path.resolve(__dirname, "..", "package.json")
  log.info(
    `own package path: ${ownPackagePath}, package json path: ${packageJsonPath}`,
  )
  const [ownPackageJson, packageJson] = await Promise.all([
    npm.read_package_json(ownPackagePath),
    npm.read_package_json(packageJsonPath),
  ])

  const mainFileNameWithoutExtension = mainFileBasename.replace(/\..*$/, "")

  packageJson.name = packageName

  if (packageJson.repository?.url === ownPackageJson.repository?.url) {
    if (packageNamespace) {
      packageJson.repository.url = `https://github.com/${packageName}`
    } else {
      const gitUrl = await question(
        `Enter the git URL for the repo or "s" to skip.`,
      )
      if (gitUrl.toLowerCase() !== "s") {
        packageJson.repository.url = gitUrl
      }
    }
  }

  if (
    packageJson.module &&
    typeof packageJson.module === "string" &&
    packageJson.module.includes("tsdx-boilerplate")
  ) {
    packageJson.module = packageJson.module.replace(
      /tsdx-boilerplate/,
      mainFileNameWithoutExtension,
    )
  }
  if (
    // !! Fix the "size-limit" property.
    Array.isArray(packageJson["size-limit"])
  ) {
    const sizeLimit = packageJson["size-limit"]
    for (let i = 0; i < sizeLimit.length; i += 1) {
      const theirPath = sizeLimit[i]?.path
      if (
        typeof theirPath === "string" &&
        theirPath.includes("tsdx-boilerplate")
      ) {
        packageJson["size-limit"][i].path = theirPath.replace(
          /tsdx-boilerplate/,
          mainFileNameWithoutExtension,
        )
      }
    }
  }
  const prettierFormatFunction = await import("prettier")
    .then((prettier) => {
      return prettier.format
    })
    .catch(() => null)
  const finalPackageJsonText = prettierFormatFunction
    ? prettierFormatFunction(JSON.stringify(packageJson), {
        filepath: "package.json",
      })
    : JSON.stringify(packageJson, null, 2)
  await maybe(
    async () => {
      const srcRoot = path.resolve(__dirname, "..", "src")
      const mainFileAbsolutePath = path.join(srcRoot, mainFileBasename)
      const indexFileAbsolutePath = path.join(srcRoot, "index.ts")
      log.info(`Writing main file to "${mainFileAbsolutePath}".`)
      fs.writeFileSync(mainFileAbsolutePath, `export default {}`, {
        encoding: "utf-8",
      })
      log.info(`Updating ${indexFileAbsolutePath} to export from main file.`)
      fs.writeFileSync(
        indexFileAbsolutePath,
        `export * from "./${mainFileNameWithoutExtension}";`,
        { encoding: "utf-8" },
      )
      log.info(`Updating package.json at ${packageJsonPath}.`)
      fs.writeFileSync(packageJsonPath, finalPackageJsonText, {
        encoding: "utf-8",
      })
    },
    () => {
      log.dryRun(finalPackageJsonText)
      log.dryRun(`Would have written ${packageJsonPath} with contents above.`)
    },
  )
} catch (e) {
  if (e === zxNotInstalledError) {
    console.error(
      `The init script expected zx be installed. Please install them and try again.`,
    )
    process.exit(1)
  }
  if (e === pltrZxNotInstalledError) {
    console.error(
      `The init script expected @pltr/zx to be installed. Please install them and try again.`,
    )
    process.exit(1)
  }
  throw e
}

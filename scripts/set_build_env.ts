/**
 * This script is a simple workaround for ecmascript module import mechanism, that loads and evaluates modules in a top-down manner,
 * which means it first loads and evaluates all import statements before executing the rest of the code in a module.
 *
 * Since the project relies on the deno's ".env" feature to determine the runing environment, with a default value of 'development'.
 *
 * take a look at utils/paths.ts
 */
Deno.env.set('DENO_ENV', 'compile_production');

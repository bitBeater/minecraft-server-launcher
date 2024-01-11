#!/usr/bin/env -S deno run  --allow-read --allow-write --allow-env --allow-run
import { mkDebPkg } from './mk_deb_pkg_mod.ts';
await mkDebPkg();

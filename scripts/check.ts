#!/usr/bin/env -S deno run -A
/**
 * script to check code quality and consistency
 */
import { checkCodeQuality } from './utils/check.ts';

checkCodeQuality()
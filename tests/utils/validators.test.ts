import { assertEquals } from 'std/assert/assert_equals.ts';
import { describe, it } from 'std/testing/bdd.ts';
import { validateSemver } from 'utils/validators.ts';

describe('validateSemver', () => {
 it('should return true for a valid semver version', () => {
  const version = '1.2.3';
  const isValid = validateSemver(version);
  assertEquals(isValid, true);
 });

 it('should return false for an invalid semver version', () => {
  const version = '1.2';
  const isValid = validateSemver(version);
  assertEquals(isValid, false);
 });

 it('should return false for an empty version', () => {
  const version = '';
  const isValid = validateSemver(version);
  assertEquals(isValid, false);
 });
});

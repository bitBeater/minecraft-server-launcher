import { acceptEula } from 'cli/eula.ts';
import { Confirm } from 'cliffy/prompt/mod.ts';
import { existsEula } from 'data/eula.ts';
import { assertEquals } from 'std/assert/assert_equals.ts';
import { afterAll, afterEach, beforeEach, describe, it } from 'std/testing/bdd.ts';
import { returnsNext, Stub, stub } from 'std/testing/mock.ts';
import { clearTmpDir } from '../test_utils/utils.ts';

// spy(Confirm.prompt);

describe('acceptEula', async () => {
 beforeEach(() => clearTmpDir());
 afterEach(() => promptStub.restore());
 afterAll(() => clearTmpDir());
 let promptStub: Stub;

 await it('should write the EULA file if accepted', async () => {
  promptStub = stub(Confirm, 'prompt', returnsNext([Promise.resolve(true)]));
  const version = '1.20.0';
  await acceptEula(version);
  assertEquals(await existsEula(version), true);
 });

 await it('should not write the EULA file if not accepted', async () => {
  promptStub = stub(Confirm, 'prompt', returnsNext([Promise.resolve(false)]));
  const version = '1.20.0';
  await acceptEula(version);
  assertEquals(await existsEula(version), false);
 });
});

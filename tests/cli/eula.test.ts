
import { acceptEula } from 'cli/eula.ts';
import { Confirm } from 'cliffy/prompt/mod.ts';
import { existsEula } from 'data/eula.ts';
import { assertEquals } from 'std/assert/assert_equals.ts';
import {
    afterAll,
    beforeEach,
    describe,
    it
} from 'std/testing/bdd.ts';
import { returnsNext, stub } from 'std/testing/mock.ts';
import { clearTmpDir } from 'testing-utils';


// spy(Confirm.prompt);


describe('acceptEula', async () => {
    beforeEach(() => clearTmpDir());
    afterAll(() => clearTmpDir());


    await it('should write the EULA file if accepted', async () => {
        // Mock the Confirm.prompt function to return true
        stub(Confirm, 'prompt', returnsNext([Promise.resolve(true)]));
        const version = '1.20.0';

        await acceptEula(version);



        assertEquals((await existsEula(version)), true);
    });
    /*
        t.step('should not write the EULA file if not accepted', async () => {
            // Mock the Confirm.prompt function to return false
            (Confirm.prompt as jest.Mock).mockResolvedValue(false);
    
            const version = '1.16.5';
    
            await acceptEula(version);
    
            // Verify that Confirm.prompt was called with the correct message
            expect(Confirm.prompt).toHaveBeenCalledWith(
                'Accept EULA? By accepting you are indicating your agreement to minecraft EULA (https://aka.ms/MinecraftEULA).'
            );
    
            // Verify that writeEula was not called
            expect(writeEula).not.toHaveBeenCalled();
        });
    
        t.step('should not write the EULA file if it already exists', async () => {
            // Mock the Confirm.prompt function to return true
            (Confirm.prompt as jest.Mock).mockResolvedValue(true);
    
            // Mock the existsEula function to return true
            (existsEula as jest.Mock).mockReturnValue(true);
    
            const version = '1.16.5';
    
            await acceptEula(version);
    
            // Verify that Confirm.prompt was called with the correct message
            expect(Confirm.prompt).toHaveBeenCalledWith(
                'Accept EULA? By accepting you are indicating your agreement to minecraft EULA (https://aka.ms/MinecraftEULA).'
            );
    
            // Verify that writeEula was not called
            expect(writeEula).not.toHaveBeenCalled();
        });
        */
});
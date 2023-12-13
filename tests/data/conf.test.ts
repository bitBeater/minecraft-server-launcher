import { getConf } from "data/conf.ts";
import { assertEquals } from "std/assert/assert_equals.ts";
import { afterAll, describe, it } from "std/testing/bdd.ts";
import { CONFIG_FILE_PATH, DEFAULT_CONFIG } from "utils/consts.ts";

describe('config file', () => {

    const origConf = Deno.readFileSync(CONFIG_FILE_PATH);
    afterAll(() => {
        Deno.writeFileSync(CONFIG_FILE_PATH, origConf);
    });

    it('getConf should return the config from the config file if it exists', () => {
        const readedConf = JSON.parse(Deno.readTextFileSync(CONFIG_FILE_PATH));
        const conf = getConf();
        assertEquals(conf, readedConf);
    });

    it('getConf should return the default config if the config file does not exist', () => {



        // removing the config file
        Deno.removeSync(CONFIG_FILE_PATH);

        const newCreatedConf = getConf();

        const readedConf = JSON.parse(Deno.readTextFileSync(CONFIG_FILE_PATH));

        assertEquals(newCreatedConf, readedConf);
        assertEquals(readedConf, DEFAULT_CONFIG);
    });
});



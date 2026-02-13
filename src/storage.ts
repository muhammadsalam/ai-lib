import fs from 'fs-extra';
import path from 'path';
import {generateHash} from './utils';

const savingDir = 'generated';

class Storage {
    public funcs = []
    private fullPath = path.join(process.cwd(), savingDir);

    constructor() {}
    
    async addInMeta() {
        return generateHash('asd')
    }

    async createFunction(funcName: string, codeInJS: string) {
        const fullPath = path.join(this.fullPath, funcName + '.js')
        await fs.createFile(fullPath);
        await fs.writeFile(fullPath, codeInJS)

        return fullPath;
    }
}

export const store = new Storage();
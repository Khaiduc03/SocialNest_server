import * as bcrypt from 'bcrypt';
import { HASH } from 'src/environment';

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(HASH);
    return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
    password: string,
    hash: string
): Promise<boolean> => {

    return await bcrypt.compare(password, hash);
};

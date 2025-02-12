import 'dotenv/config';
import { startManagerBot } from 'src/managerBot';
import { startCouchBot } from 'src/personalCouchBot';

await Promise.all([
    startManagerBot(),
    startCouchBot(),
]);


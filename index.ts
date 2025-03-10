import 'dotenv/config';
import { startManagerBot } from '@/managerBot';
import { startCouchBot } from '@/couchBot';

await Promise.all([
    startManagerBot(),
    startCouchBot(),
]);

import { config } from 'dotenv';
config();

import '@/ai/flows/assess-plant-health.ts';
import '@/ai/flows/detect-plant-disease.ts';
import '@/ai/flows/classify-rice.ts';
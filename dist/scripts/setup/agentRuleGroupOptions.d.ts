import { Option } from '@clack/prompts';
import type { ProjectType } from '../../types/index.js';
export type AgentRuleGroup = 'universal' | 'react' | 'supabase' | 'ui';
/**
 * Whether the selected project type is a React stack (web or native).
 */
export declare const isReactProjectType: (projectType: ProjectType) => boolean;
/**
 * Rule groups offered in cfs-setup, filtered by project type.
 */
export declare const getAgentRuleGroupOptions: (projectType: ProjectType) => Option<AgentRuleGroup>[];

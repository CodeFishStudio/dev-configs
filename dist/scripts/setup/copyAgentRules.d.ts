import type { AgentRuleGroup } from './agentRuleGroupOptions.js';
/**
 * Copy agent rule files to `.cursor/rules/`.
 * Overwrites any existing rule files at the same path; other files in the directory are left unchanged.
 */
export declare const copyAgentRules: (selectedRuleGroups: AgentRuleGroup[]) => void;

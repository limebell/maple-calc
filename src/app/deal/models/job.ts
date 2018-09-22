import { JOB_CODE, Job } from './job.model';
import * as Mechanic from './skill-mechanic';
import * as Common from './skill-common';
import * as Link from './skill-link';

export const jobEntities: { [code in JOB_CODE]?: Job } = {
  ARCHMAGE_ICE_LIGHTNING: {
    code: 'ARCHMAGE_ICE_LIGHTNING',
    category: 'MAGE',
    mainStat: 'INT',
    name: '아크메이지(썬, 콜)',
    mastery: 0.25,
    skills: [],
  },
  NIGHTLORD: {
    code: 'NIGHTLORD',
    category: 'ROGUE',
    mainStat: 'LUK',
    name: '나이트로드',
    mastery: 0.15,
    skills: [],
  },
  DEMONAVENGER: {
    code: 'DEMONAVENGER',
    category: 'WARRIOR',
    mainStat: 'maxHP',
    name: '데몬어벤져',
    mastery: 0.2,
    skills: [],
  },
  BISHOP: {
    code: 'BISHOP',
    category: 'MAGE',
    mainStat: 'INT',
    name: '비숍',
    mastery: 0.25,
    skills: [],
  },
  MECHANIC: {
    code: 'MECHANIC',
    category: 'PIRATE',
    mainStat: 'DEX',
    name: '메카닉',
    mastery: 0.15,
    skills: [...Mechanic.skillCodes, ...Common.skillCodes, ...Link.skillCodes],
  },
};

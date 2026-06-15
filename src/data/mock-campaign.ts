import type { CampaignDoc } from '@/types/campaign.types';

export type MockCampaign = {
  id: string;
  name: string;
  documents: CampaignDoc[];
};

export const MOCK_CAMPAIGN: MockCampaign = {
  id: 'ironveil-001',
  name: 'The Ironveil Campaign',
  documents: [
    {
      id: 'overview',
      type: 'overview',
      title: 'The Ironveil Campaign',
      source: 'seed',
      createdAt: 0,
      content:
        'The Ironveil Campaign is set in the fractured kingdom of Valdris, a once-unified realm shattered by the Sundering Wars two centuries ago. Magic is scarce and mistrusted by common folk, hoarded by two rival factions: the Order of Ash (scholarly mages who believe magic must be controlled) and the Gilded Veil (a secretive merchant guild that weaponizes arcane artifacts). The player characters are a group of unlikely allies caught between these factions while trying to uncover the truth behind a series of mysterious disappearances across the kingdom.',
    },
    {
      id: 'lore-valdris',
      type: 'lore',
      title: 'The Kingdom of Valdris',
      source: 'seed',
      createdAt: 0,
      content:
        'Valdris was once a prosperous empire ruled by the Ironveil Dynasty, named for the enchanted iron crown worn by each monarch. The Sundering Wars began when the last emperor, Aldric III, attempted to drain all magical energy from the land into the crown to consolidate power. The ritual failed catastrophically, splitting the kingdom into three rival city-states: Thornwall in the north (military stronghold), the Sunken City of Merath in the south (partially submerged, ruled by the Order of Ash), and the Free City of Karrath in the east (trade hub, controlled by the Gilded Veil).',
    },
    {
      id: 'chapter-description-1',
      type: 'chapter-description',
      title: 'Chapter 1: The Sunken City',
      chapterId: '1',
      source: 'seed',
      createdAt: 0,
      content:
        'The party arrived in Merath following rumours of scholars disappearing from the Grand Archive. They investigated the flooded lower districts and discovered a hidden laboratory beneath the city where someone had been secretly experimenting on awakening a fragment of the Ironveil crown. The chapter ended with the party retrieving one crown shard and narrowly escaping a collapsing tunnel. Key revelation: the disappearances are connected to crown shard collectors.',
    },
    {
      id: 'session-summary-1',
      type: 'session-summary',
      title: 'Session 1 Summary',
      chapterId: '1',
      sessionNumber: 1,
      source: 'seed',
      createdAt: 0,
      content:
        "The party (Dara the rogue, Soren the scholar, Fen the ex-soldier) arrived in Merath by boat. They met Archivist Kael who hired them to find his missing colleague, Scholar Mira. They explored the flooded Undercity, fought two Ash Wardens (corrupt guards), and found Mira's notes describing 'resonance points' where crown shards pulse with energy.",
    },
    {
      id: 'chapter-description-2',
      type: 'chapter-description',
      title: 'Chapter 2: The Betrayal at Thornwall',
      chapterId: '2',
      source: 'seed',
      createdAt: 0,
      content:
        "The party travelled north to Thornwall after decoding Mira's notes, which pointed to a second crown shard hidden beneath the fortress-city's ancient keep. Commander Harrek, the city's military governor, appeared cooperative but was secretly working for the Gilded Veil. He ambushed the party after they retrieved the shard. Soren was captured; Dara and Fen escaped with the shard. Chapter ended with the party split and the Gilded Veil now aware of their quest.",
    },
    {
      id: 'session-summary-3',
      type: 'session-summary',
      title: 'Session 3 Summary',
      chapterId: '2',
      sessionNumber: 3,
      source: 'seed',
      createdAt: 0,
      content:
        "The party infiltrated Thornwall Keep using forged military papers obtained from Archivist Kael's contacts. They found the crown shard sealed inside a warding stone deep in the keep's vault. When they broke the seal, it triggered an alarm. Commander Harrek revealed his betrayal and called in Gilded Veil enforcers. Soren was captured protecting the party's escape. The session ended on a cliffhanger with Fen injured and Dara holding both shards.",
    },
    {
      id: 'chapter-description-3',
      type: 'chapter-description',
      title: 'Chapter 3: The Gilded Cage',
      chapterId: '3',
      source: 'seed',
      createdAt: 0,
      content:
        'The party must infiltrate the Gilded Veil headquarters in Karrath to rescue Soren and uncover what the guild plans to do with the crown shards. They have acquired an inside contact: Mira (the rescued scholar from Chapter 1), who has a former colleague embedded in the guild. The third crown shard is believed to be somewhere inside the Karrath Vault, the most heavily guarded building in the kingdom.',
    },
    {
      id: 'npc-seraphina',
      type: 'npc',
      title: 'Queen Seraphina',
      source: 'seed',
      createdAt: 0,
      content:
        "Seraphina Voss is the nominal ruler of Thornwall and Commander Harrek's superior, though she is increasingly a figurehead. She is 52 years old, shrewd, and deeply aware that Harrek has been circumventing her authority. She holds no love for the Gilded Veil and may be an unexpected ally to the party if they can reach her with proof of Harrek's betrayal. She is cautious and will demand concrete evidence before acting. Her motivation is preserving Thornwall's independence.",
    },
    {
      id: 'npc-kael',
      type: 'npc',
      title: 'Archivist Kael',
      source: 'seed',
      createdAt: 0,
      content:
        "Kael Dawnmere is the party's primary contact in Merath, a senior member of the Order of Ash. He is 68 years old, eccentric, obsessed with the Ironveil crown's history, and genuinely terrified of what would happen if anyone reassembled it. He funded the party's initial investigation and has provided research support throughout. He suspects the Gilded Veil wants to use the crown's power to achieve economic dominance, not military conquest. His catchphrase: \"The crown does not grant power — it concentrates it, and that is far worse.\"",
    },
    {
      id: 'npc-harrek',
      type: 'npc',
      title: 'Commander Harrek',
      source: 'seed',
      createdAt: 0,
      content:
        'Halvard Harrek is the military governor of Thornwall, 45 years old, a decorated war veteran turned political opportunist. He made a deal with the Gilded Veil five years ago: intelligence and military access in exchange for wealth and protection of his family. He is not purely evil — he genuinely believes the Gilded Veil will create stability — but he has made increasingly ruthless choices. Currently holding Soren prisoner in Thornwall Keep dungeon as a bargaining chip.',
    },
    {
      id: 'npc-mira',
      type: 'npc',
      title: 'Scholar Mira',
      source: 'seed',
      createdAt: 0,
      content:
        "Mira Solan is the scholar the party rescued from the Merath laboratory in Chapter 1. She is 31 years old, brilliant, and guilt-ridden — her initial research into crown resonance points was stolen and used to launch the collection effort. She now travels with the party as an NPC ally and has identified the third crown shard's likely location inside the Karrath Vault. She has a former university colleague, Pressa, who works in the Gilded Veil's administrative records division and can get the party inside Karrath.",
    },
    {
      id: 'location-merath',
      type: 'location',
      title: 'Merath — The Sunken City',
      source: 'seed',
      createdAt: 0,
      content:
        'The Sunken City of Merath sits on a coastal delta that has been slowly subsiding for centuries. The upper city is a maze of salt-crusted bridges and elevated walkways; the lower city is permanently flooded and accessible only by boat or diving. The Grand Archive of the Order of Ash dominates the skyline — a massive stepped pyramid built above the waterline. The city smells of brine and burned driftwood. Population roughly 40,000, majority human, with a significant minority of Tidewrought (magically adapted humans from the Sundering era).',
    },
    {
      id: 'location-thornwall',
      type: 'location',
      title: 'Thornwall',
      source: 'seed',
      createdAt: 0,
      content:
        "Thornwall is a fortress-city built into a mountain pass in northern Valdris. Its walls are literally carved from the mountain, making conventional siege impossible. The city is cold, militaristic, and orderly — wide streets designed for troop movement, buildings built for function not aesthetics. The Keep sits at the highest point and is accessible only via a single switchback road with three guarded checkpoints. Commander Harrek's office and the dungeon are both within the Keep.",
    },
    {
      id: 'location-karrath',
      type: 'location',
      title: 'Karrath — The Free City',
      source: 'seed',
      createdAt: 0,
      content:
        "Karrath is the wealthiest city in Valdris — chaotic, cosmopolitan, and morally flexible. The Gilded Veil operates openly here, framing itself as a 'commercial guild' that maintains the city's prosperity. The Karrath Vault is built in the centre of the financial district, constructed with anti-magic wards and manned by Veil Sentinels (elite guards trained specifically to counter spellcasters). The vault is the most secure location in the kingdom; even the city's nominal governor does not have unsupervised access.",
    },
    {
      id: 'faction-order-of-ash',
      type: 'faction',
      title: 'The Order of Ash',
      source: 'seed',
      createdAt: 0,
      content:
        "The Order of Ash is Valdris's scholarly mage organisation, based in Merath. They believe that uncontrolled magic caused the Sundering and that all arcane practice must be licensed, studied, and regulated. They are not evil but are often paternalistic and slow-moving. Their highest priority is ensuring the Ironveil crown is never reassembled. They have limited combat capability but vast historical knowledge and the ability to nullify arcane artifacts.",
    },
    {
      id: 'faction-gilded-veil',
      type: 'faction',
      title: 'The Gilded Veil',
      source: 'seed',
      createdAt: 0,
      content:
        "The Gilded Veil presents itself as a merchant's guild but functions as a shadow government in Karrath. Its true leadership, the 'Five Fingers', is unknown to outsiders. The Veil's goal is to assemble the Ironveil crown and use its power to eliminate economic competition across Valdris — effectively making every trade route dependent on Veil approval. Their enforcers are called Debt Collectors and operate as licensed bounty hunters with full legal protection in Karrath.",
    },
  ],
};
